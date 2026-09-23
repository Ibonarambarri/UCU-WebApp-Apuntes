import { useCallback, useState } from 'react';
import { fetchJSON } from '../utils/fetch.js';

export function useCreatePlayer() {
  const [isCreating, setIsCreating] = useState(false);

  const createPlayer = useCallback(async ({ name }) => {
    setIsCreating(true);
    try {
      return await fetchJSON(
        '/api/players',
        { method: 'PUT', body: { name } },
      );
    } finally {
      setIsCreating(false);
    }
  }, []);

  return { isCreating, createPlayer };
}
