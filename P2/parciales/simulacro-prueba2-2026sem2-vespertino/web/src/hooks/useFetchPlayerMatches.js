import { useCallback, useEffect, useState } from 'react';
import { fetchJSON } from '../utils/fetch.js';

export function useFetchPlayerMatches(id) {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [reloadIndex, setReloadIndex] = useState(0);

  useEffect(() => {
    if (!id) {
      return;
    }
    (async () => {
      setIsLoading(true);
      setError(null);
      try {
        const jsonData = await fetchJSON(`/api/players/${encodeURIComponent(id)}/matches`);
        setData(jsonData);
      } catch (err) {
        setError(err);
      } finally {
        setIsLoading(false);
      }
    })();
  }, [id, reloadIndex]);

  const refetch = useCallback(() => setReloadIndex((index) => index + 1), []);

  return { data, isLoading, error, refetch };
}
