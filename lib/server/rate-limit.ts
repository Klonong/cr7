import type { RateLimitResult } from "@/interface/api";

/**
 * In-memory sliding-window rate limiter for single-instance Next.js deployments.
 * Note: For multi-instance / serverless scale, swap the backing store with Redis / Upstash.
 */
interface BucketEntry {
  timestamps: number[];
}

const globalStore = globalThis as unknown as {
  __cr7RateLimitBuckets?: Map<string, BucketEntry>;
};

const buckets =
  globalStore.__cr7RateLimitBuckets ?? new Map<string, BucketEntry>();
if (!globalStore.__cr7RateLimitBuckets) {
  globalStore.__cr7RateLimitBuckets = buckets;
}

export function checkRateLimit(
  key: string,
  limit: number,
  windowMs: number
): RateLimitResult {
  const now = Date.now();
  const windowStart = now - windowMs;

  // Periodic opportunistic prune to prevent unbounded memory growth
  if (buckets.size > 5000) {
    for (const [k, entry] of buckets.entries()) {
      const active = entry.timestamps.filter((t) => t > windowStart);
      if (active.length === 0) buckets.delete(k);
      else entry.timestamps = active;
    }
  }

  const entry = buckets.get(key) ?? { timestamps: [] };
  entry.timestamps = entry.timestamps.filter((t) => t > windowStart);

  if (entry.timestamps.length >= limit) {
    const oldest = entry.timestamps[0] ?? now;
    const retryAfterSeconds = Math.max(
      1,
      Math.ceil((oldest + windowMs - now) / 1000)
    );
    buckets.set(key, entry);
    return {
      allowed: false,
      remaining: 0,
      retryAfterSeconds,
    };
  }

  entry.timestamps.push(now);
  buckets.set(key, entry);

  return {
    allowed: true,
    remaining: Math.max(0, limit - entry.timestamps.length),
    retryAfterSeconds: 0,
  };
}

export function resetRateLimit(key: string): void {
  buckets.delete(key);
}

export function getClientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    const first = forwarded.split(",")[0]?.trim();
    if (first) return first;
  }
  const realIp = request.headers.get("x-real-ip")?.trim();
  if (realIp) return realIp;
  return "unknown";
}
