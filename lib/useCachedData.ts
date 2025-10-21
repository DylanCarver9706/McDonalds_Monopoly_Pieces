import { useState, useEffect } from "react";
import { getCachedData, setCachedData } from "./clientCache";

interface UseCachedDataOptions {
  cacheKey: string;
  fetchFunction: () => Promise<any>;
  dependencies?: any[];
}

export function useCachedData<T>({
  cacheKey,
  fetchFunction,
  dependencies = [],
}: UseCachedDataOptions) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Check cache first
        const cachedData = getCachedData(cacheKey);
        if (cachedData) {
          setData(cachedData);
          setLoading(false);
          return;
        }

        // Fetch fresh data
        const freshData = await fetchFunction();

        // Cache the data
        setCachedData(cacheKey, freshData);

        setData(freshData);
      } catch (err) {
        console.error(`Error loading data for ${cacheKey}:`, err);
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, dependencies);

  return { data, loading, error };
}
