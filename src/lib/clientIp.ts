/**
 * Resolves a client IP suitable for rate limiting on Vercel.
 *
 * Does not trust an arbitrary client-supplied leftmost X-Forwarded-For hop.
 * Prefers Vercel platform headers, then the rightmost forwarded hop (typically
 * appended by the trusted edge), then x-real-ip.
 */
export function getClientIp(request: Request): string {
  const vercelForwarded = request.headers.get("x-vercel-forwarded-for");
  if (vercelForwarded) {
    const ip = firstHop(vercelForwarded);
    if (ip) return ip;
  }

  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) {
    const hops = forwardedFor
      .split(",")
      .map((part) => part.trim())
      .filter(Boolean);
    if (hops.length === 1) {
      return hops[0];
    }
    if (hops.length > 1) {
      // Rightmost hop is the one added by the nearest trusted proxy (e.g. Vercel).
      return hops[hops.length - 1];
    }
  }

  const realIp = request.headers.get("x-real-ip")?.trim();
  if (realIp) return realIp;

  // Shared bucket when IP cannot be determined — safer than per-spoof keys.
  return "unknown";
}

function firstHop(header: string): string | null {
  const hop = header.split(",")[0]?.trim();
  return hop || null;
}
