interface CacheData {
  data: any;
  timestamp: number;
}

const CACHE_DURATION = 24 * 60 * 60 * 1000; // 1 day in milliseconds

// Client-side cache using localStorage
export function getCachedData(key: string): any | null {
  if (typeof window === "undefined") return null;

  try {
    const cached = localStorage.getItem(`cache_${key}`);
    if (!cached) return null;

    const { data, timestamp }: CacheData = JSON.parse(cached);
    const now = Date.now();
    const isExpired = now - timestamp > CACHE_DURATION;

    if (isExpired) {
      localStorage.removeItem(`cache_${key}`);
      return null;
    }

    return data;
  } catch (error) {
    console.error("Error reading cache:", error);
    return null;
  }
}

export function setCachedData(key: string, data: any): void {
  if (typeof window === "undefined") return;

  try {
    const cacheData: CacheData = {
      data,
      timestamp: Date.now(),
    };
    localStorage.setItem(`cache_${key}`, JSON.stringify(cacheData));
  } catch (error) {
    console.error("Error setting cache:", error);
  }
}

export function clearCache(key?: string): void {
  if (typeof window === "undefined") return;

  try {
    if (key) {
      localStorage.removeItem(`cache_${key}`);
    } else {
      // Clear all cache entries
      const keys = Object.keys(localStorage);
      keys.forEach((k) => {
        if (k.startsWith("cache_")) {
          localStorage.removeItem(k);
        }
      });
    }
  } catch (error) {
    console.error("Error clearing cache:", error);
  }
}

export function getCacheInfo(
  key: string
): { exists: boolean; age: number; expired: boolean } | null {
  if (typeof window === "undefined") return null;

  try {
    const cached = localStorage.getItem(`cache_${key}`);
    if (!cached) return null;

    const { timestamp }: CacheData = JSON.parse(cached);
    const now = Date.now();
    const age = now - timestamp;
    const expired = age > CACHE_DURATION;

    return {
      exists: true,
      age,
      expired,
    };
  } catch (error) {
    console.error("Error reading cache info:", error);
    return null;
  }
}
