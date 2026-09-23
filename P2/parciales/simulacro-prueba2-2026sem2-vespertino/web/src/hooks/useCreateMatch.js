import { useCallback, useState } from 'react';
import { fetchJSON } from '../utils/fetch.js';

export function useCreateMatch() {
  const [isCreating, setIsCreating] = useState(false);

  const createMatch = useCallback(async ({ playerX, playerO, history, winner }) => {
    setIsCreating(true);
    try {
      return await fetchJSON(
        '/api/matches',
        { method: 'PUT', body: { playerX, playerO, history, winner } },
      );
    } finally {
      setIsCreating(false);
    }
  }, []);

  return { isCreating, createMatch };
}
