interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number;
}

interface RateLimitEntry {
  count: number;
  resetTime: number;
}
class SimpleCache {
  private cache = new Map<string, CacheEntry<unknown>>();
  private rateLimits = new Map<string, RateLimitEntry>();

  get<T>(key: string): T | null {
    const entry = this.cache.get(key);
    if (!entry) return null;

    if (Date.now() > entry.timestamp + entry.ttl) {
      this.cache.delete(key);
      return null;
    }

    return entry.data as T;
  }

  set<T>(key: string, data: T, ttlMs: number): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl: ttlMs,
    });
  }

  checkRateLimit(key: string, maxRequests: number, windowMs: number): boolean {
    const now = Date.now();
    const entry = this.rateLimits.get(key);

    if (!entry || now > entry.resetTime) {
      this.rateLimits.set(key, { count: 1, resetTime: now + windowMs });
      return true;
    }

    if (entry.count >= maxRequests) {
      return false;
    }

    entry.count++;
    return true;
  }

  clear(): void {
    this.cache.clear();
    this.rateLimits.clear();
  }
}

export const cache = new SimpleCache();

export const CACHE_TTL = {
  CONNECTIONS: 5 * 60 * 1000,
  STATIONS: 60 * 60 * 1000,
};
export function clearCache(): void {
  cache.clear();
}

export function getCacheStats(): { size: number } {
  return { size: cache["cache"].size };
}
export const RATE_LIMIT = {
  MAX_REQUESTS: 10,
  WINDOW_MS: 60 * 1000, // 1 minute
};
