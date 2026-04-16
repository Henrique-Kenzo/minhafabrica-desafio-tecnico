import { useState, useEffect } from 'react';
import api from '@/services/api';

interface CacheEntry<T> {
  data: T[];
  total: number;
}

const globalCache: Record<string, CacheEntry<any>> = {};

export function usePaginatedCache<T>(
  endpoint: string,
  page: number,
  limit: number,
  searchParams: Record<string, string>
) {
  const [data, setData] = useState<T[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const buildQueryString = (overridePage?: number) => {
    const qs = new URLSearchParams();
    Object.entries(searchParams).forEach(([k, v]) => {
      if (v) qs.append(k, v);
    });
    qs.append('page', (overridePage || page).toString());
    qs.append('limit', limit.toString());
    return qs.toString();
  };

  const currentCacheKey = `${endpoint}?${buildQueryString()}`;

  const triggerPrefetch = (totalPages: number) => {
    [page + 1, page + 2].forEach(async (p) => {
      if (p > totalPages) return;
      const prefetchKey = `${endpoint}?${buildQueryString(p)}`;
      if (!globalCache[prefetchKey]) {
        try {
          const res = await api.get(prefetchKey);
          globalCache[prefetchKey] = {
            data: res.data.data,
            total: res.data.total || 0,
          };
        } catch {
          // prefetch silencioso
        }
      }
    });
  };

  const fetchData = async () => {
    if (globalCache[currentCacheKey]) {
      setData(globalCache[currentCacheKey].data);
      setTotalItems(globalCache[currentCacheKey].total);
      setIsLoading(false);
      triggerPrefetch(Math.ceil(globalCache[currentCacheKey].total / limit));
      return;
    }

    setIsLoading(true);
    try {
      const res = await api.get(currentCacheKey);
      
      globalCache[currentCacheKey] = {
        data: res.data.data,
        total: res.data.total || 0,
      };
      
      setData(res.data.data);
      setTotalItems(res.data.total || 0);

      triggerPrefetch(Math.ceil((res.data.total || 0) / limit));
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [currentCacheKey]);

  const mutate = (newData: T[], MathTotal: number) => {
    setData(newData);
    setTotalItems(MathTotal);
  };

  const invalidateCache = () => {
    Object.keys(globalCache).forEach(key => {
      if (key.startsWith(endpoint)) {
        delete globalCache[key];
      }
    });
  };

  const refetch = () => {
    invalidateCache();
    fetchData();
  };

  return {
    data,
    totalItems,
    isLoading,
    totalPages: Math.ceil(totalItems / limit) || 1,
    mutate,
    invalidateCache,
    refetch,
    currentCacheKey,
  };
}
