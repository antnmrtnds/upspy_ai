import { useState, useCallback, useEffect } from 'react';
import { Ad } from '../components/ads/types';

export interface UseAdsResult {
  ads: Ad[];
  loading: boolean;
  error: Error | null;
  refetch: () => void;
  pagination: {
    total: number;
    limit: number;
    offset: number;
  };
}

export function useAds(
  page: number,
  limit: number = 12,
  sortBy: string = 'created_at',
  sortOrder: 'desc' | 'asc' = 'desc'
): UseAdsResult {
  const [ads, setAds] = useState<Ad[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const [pagination, setPagination] = useState<{ total: number; limit: number; offset: number }>({
    total: 0,
    limit,
    offset: (page - 1) * limit
  });

  const fetchAds = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        sort_by: sortBy,
        sort_order: sortOrder
      });
      const res = await fetch(`/api/ads?${params.toString()}`);
      if (!res.ok) throw new Error(`Failed to fetch ads: ${res.statusText}`);
      const json = await res.json();
      setAds(json.data);
      setPagination(json.pagination);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, [page, limit, sortBy, sortOrder]);

  useEffect(() => {
    fetchAds();
  }, [fetchAds]);

  return { ads, loading, error, refetch: fetchAds, pagination };
} 