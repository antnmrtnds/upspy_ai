import { useState, useCallback, useEffect } from 'react';

/**
 * Hook to fetch ads from the backend API.
 */
export function useAds() {
  const [ads, setAds] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchAds = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/ads');
      if (!res.ok) throw new Error(`Failed to fetch ads: ${res.statusText}`);
      const data = await res.json();
      setAds(data);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAds();
  }, [fetchAds]);

  return { ads, loading, error, refetch: fetchAds };
} 