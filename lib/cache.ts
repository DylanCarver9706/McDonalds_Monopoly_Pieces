interface CacheData {
  data: any;
  timestamp: number;
}

const CACHE_DURATION = 24 * 60 * 60 * 1000; // 1 day in milliseconds

// In-memory cache for server-side data
const cache = new Map<string, CacheData>();

export function getCachedData(key: string): any | null {
  const cached = cache.get(key);
  if (!cached) return null;

  const now = Date.now();
  const isExpired = now - cached.timestamp > CACHE_DURATION;

  if (isExpired) {
    cache.delete(key);
    return null;
  }

  return cached.data;
}

export function setCachedData(key: string, data: any): void {
  cache.set(key, {
    data,
    timestamp: Date.now(),
  });
}

export function clearCache(key?: string): void {
  if (key) {
    cache.delete(key);
  } else {
    cache.clear();
  }
}

export function getCacheInfo(
  key: string
): { exists: boolean; age: number; expired: boolean } | null {
  const cached = cache.get(key);
  if (!cached) return null;

  const now = Date.now();
  const age = now - cached.timestamp;
  const expired = age > CACHE_DURATION;

  return {
    exists: true,
    age,
    expired,
  };
}
