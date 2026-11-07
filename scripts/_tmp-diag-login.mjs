import fs from "fs";

const envText = fs.readFileSync(".env", "utf8");
for (const line of envText.split(/\r?\n/)) {
  const t = line.trim();
  if (!t || t.startsWith("#")) continue;
  const i = t.indexOf("=");
  if (i <= 0) continue;
  const k = t.slice(0, i).trim();
  let v = t.slice(i + 1).trim();
  if (
    (v.startsWith('"') && v.endsWith('"')) ||
    (v.startsWith("'") && v.endsWith("'"))
  ) {
    v = v.slice(1, -1);
  }
  if (process.env[k] === undefined) process.env[k] = v;
}

const { isRateLimited, recordAttempt, resetRateLimit, RateLimitStoreError } =
  await import("../src/lib/rateLimit.ts").catch(async () => {
    // Prefer compiled/ts via next isn't available; use mongoose model directly
    return { fallback: true };
  });

if (isRateLimited) {
  const key = "diag_admin_login_test";
  try {
    const check = await isRateLimited(key, 5, 15 * 60 * 1000);
    console.log("isRateLimited:", check);
    const n = await recordAttempt(key, 15 * 60 * 1000);
    console.log("recordAttempt count:", n);
    await resetRateLimit(key);
    console.log("resetRateLimit: OK");
  } catch (e) {
    console.log(
      "rateLimit error:",
      e?.name,
      e instanceof RateLimitStoreError,
      String(e?.message || e)
    );
    process.exitCode = 1;
  }
} else {
  console.log("Could not import rateLimit.ts directly; testing via mongoose model");
  const mongoose = (await import("mongoose")).default;
  const uri = process.env.MONGODB_URI.trim();
  await mongoose.connect(uri, { serverSelectionTimeoutMS: 8000 });
  const RateLimit =
    mongoose.models.RateLimit ||
    mongoose.model(
      "RateLimit",
      new mongoose.Schema({
        key: { type: String, required: true, unique: true },
        timestamps: { type: [Number], default: [] },
        lastAdmit: Number,
        expiresAt: Date,
      })
    );
  const key = "diag_admin_login_test";
  const now = Date.now();
  try {
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
                    cond: { $gt: ["$$t", now - 900000] },
                  },
                },
                [now],
              ],
            },
            lastAdmit: now,
            expiresAt: new Date(now + 900000),
          },
        },
      ],
      { upsert: true, new: true }
    );
    console.log("pipeline upsert: OK, timestamps:", doc?.timestamps?.length);
    await RateLimit.deleteOne({ key });
  } catch (e) {
    console.log("pipeline upsert FAIL:", e?.name, String(e?.message || e));
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
}

const hash = process.env.ADMIN_PASSWORD_HASH?.trim() || "";
const parts = hash.split("$");
console.log(
  "auth configured for scrypt:",
  parts[0] === "scrypt" && parts.length === 6
);
console.log(
  "hash looks like 64-char hex (legacy SHA-256 style):",
  /^[a-f0-9]{64}$/i.test(hash)
);
