import { useCallback, useEffect, useState } from 'react';
import { fetchJSON } from '../utils/fetch.js';

export function useFetchPlayers() {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [reloadIndex, setReloadIndex] = useState(0);

  useEffect(() => {
    (async () => {
      setIsLoading(true);
      try {
        const jsonData = await fetchJSON('/api/players');
        setData(jsonData);
        setError(null);
      } catch (err) {
        setError(err);
      } finally {
        setIsLoading(false);
      }
    })();
  }, [reloadIndex]);

  const refetch = useCallback(() => setReloadIndex((index) => index + 1), []);

  return { data, isLoading, error, refetch };
}
