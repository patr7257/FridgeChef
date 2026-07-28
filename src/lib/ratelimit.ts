const WINDOW_MS = 60 * 60 * 1000;
const MAX_RUNS_PER_WINDOW = 10;

/**
 * Best-effort in-memory sliding-window rate limiter, keyed per IP.
 * Resets when the serverless instance is recycled; acceptable for an unlisted
 * personal v1. The real budget guard is the spend cap on the OpenAI key.
 */
export function createRateLimiter(
  maxPerWindow = MAX_RUNS_PER_WINDOW,
  windowMs = WINDOW_MS
) {
  const hits = new Map<string, number[]>();
  return {
    check(key: string, now = Date.now()): boolean {
      const cutoff = now - windowMs;
      const recent = (hits.get(key) ?? []).filter((t) => t > cutoff);
      if (recent.length >= maxPerWindow) {
        hits.set(key, recent);
        return false;
      }
      recent.push(now);
      hits.set(key, recent);
      return true;
    },
  };
}

const globalLimiter = createRateLimiter();

export function checkRateLimit(request: Request): boolean {
  const forwarded = request.headers.get("x-forwarded-for");
  const ip = forwarded ? forwarded.split(",")[0].trim() : "unknown";
  return globalLimiter.check(ip);
}
