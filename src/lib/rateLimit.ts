import connectDB from "@/lib/mongodb";
import RateLimit from "@/models/RateLimit";

export class RateLimitStoreError extends Error {
  constructor(message = "Rate limit store unavailable") {
    super(message);
    this.name = "RateLimitStoreError";
  }
}

type AdmitResult = {
  allowed: boolean;
  remaining: number;
};

type LimitedResult = {
  limited: boolean;
  remaining: number;
};

function isDuplicateKeyError(error: unknown): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    (error as { code?: number }).code === 11000
  );
}

async function withStore<T>(operation: () => Promise<T>): Promise<T> {
  try {
    await connectDB();
    try {
      return await operation();
    } catch (error) {
      // Concurrent upserts can race on the unique key — retry once.
      if (isDuplicateKeyError(error)) {
        return await operation();
      }
      throw error;
    }
  } catch (error) {
    if (error instanceof RateLimitStoreError) {
      throw error;
    }
    throw new RateLimitStoreError();
  }
}

/**
 * Sliding-window check that records an attempt when under the limit.
 * Uses a MongoDB aggregation pipeline update for atomic read-modify-write.
 */
export async function checkRateLimit(
  key: string,
  maxRequests: number,
  windowMs: number
): Promise<AdmitResult> {
  return withStore(async () => {
    const now = Date.now();
    const windowStart = now - windowMs;
    const expiresAt = new Date(now + windowMs);

    const doc = await RateLimit.findOneAndUpdate(
      { key },
      [
        {
          $set: {
            key: { $ifNull: ["$key", key] },
            filtered: {
              $filter: {
                input: { $ifNull: ["$timestamps", []] },
                as: "t",
                cond: { $gt: ["$$t", windowStart] },
              },
            },
          },
        },
        {
          $set: {
            underLimit: { $lt: [{ $size: "$filtered" }, maxRequests] },
          },
        },
        {
          $set: {
            timestamps: {
              $cond: [
                "$underLimit",
                { $concatArrays: ["$filtered", [now]] },
                "$filtered",
              ],
            },
            lastAdmit: {
              $cond: ["$underLimit", now, { $ifNull: ["$lastAdmit", 0] }],
            },
            expiresAt,
          },
        },
        {
          $unset: ["filtered", "underLimit"],
        },
      ],
      {
        upsert: true,
        returnDocument: "after",
        updatePipeline: true,
      } as Parameters<typeof RateLimit.findOneAndUpdate>[2]
    );

    if (!doc) {
      throw new RateLimitStoreError();
    }

    const allowed = doc.lastAdmit === now;
    const remaining = Math.max(0, maxRequests - (doc.timestamps?.length ?? 0));

    return { allowed, remaining };
  });
}

/**
 * Checks whether a key is already at/over the limit without recording.
 */
export async function isRateLimited(
  key: string,
  maxAttempts: number,
  windowMs: number
): Promise<LimitedResult> {
  return withStore(async () => {
    const now = Date.now();
    const windowStart = now - windowMs;

    const doc = await RateLimit.findOne({ key }).lean();
    if (!doc || !Array.isArray(doc.timestamps)) {
      return { limited: false, remaining: maxAttempts };
    }

    const active = doc.timestamps.filter((ts: number) => ts > windowStart);
    if (active.length >= maxAttempts) {
      return { limited: true, remaining: 0 };
    }

    return {
      limited: false,
      remaining: maxAttempts - active.length,
    };
  });
}

/**
 * Records a failed attempt for the specified key (always appends in-window).
 */
export async function recordAttempt(
  key: string,
  windowMs: number
): Promise<number> {
  return withStore(async () => {
    const now = Date.now();
    const windowStart = now - windowMs;
    const expiresAt = new Date(now + windowMs);

    const doc = await RateLimit.findOneAndUpdate(
      { key },
      [
        {
          $set: {
            key: { $ifNull: ["$key", key] },
            timestamps: {
              $concatArrays: [
                {
                  $filter: {
                    input: { $ifNull: ["$timestamps", []] },
                    as: "t",
                    cond: { $gt: ["$$t", windowStart] },
                  },
                },
                [now],
              ],
            },
            lastAdmit: now,
            expiresAt,
          },
        },
      ],
      {
        upsert: true,
        returnDocument: "after",
        updatePipeline: true,
      } as Parameters<typeof RateLimit.findOneAndUpdate>[2]
    );

    if (!doc) {
      throw new RateLimitStoreError();
    }

    return doc.timestamps?.length ?? 0;
  });
}

/**
 * Resets the rate limit / lockout for a specific key.
 */
export async function resetRateLimit(key: string): Promise<void> {
  return withStore(async () => {
    await RateLimit.deleteOne({ key });
  });
}

/**
 * Clears all rate limits (development lockout reset only).
 */
export async function clearAllRateLimits(): Promise<void> {
  return withStore(async () => {
    await RateLimit.deleteMany({});
  });
}
