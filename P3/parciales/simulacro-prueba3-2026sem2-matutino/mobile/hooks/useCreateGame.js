import { useState } from 'react';
import { fetchJSON } from '@/common/fetch';

/** Crear una partida con `POST /api/games`. Se usa en el inicio (Jugar) y al
 * final de la partida (Jugar de nuevo), por eso está en un hook aparte.
 *
 * `createGame(player)` devuelve la partida nueva, o `null` si falló (el error
 * queda en `error` para mostrarlo).
 */
export function useCreateGame() {
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState(null);

  async function createGame(player) {
    setIsCreating(true);
    setError(null);
    try {
      // fetchJSON hace el JSON.stringify del body: se le pasa un OBJETO.
      return await fetchJSON('/api/games', { method: 'POST', body: { player } });
    } catch (err) {
      setError(err);
      return null;
    } finally {
      setIsCreating(false);
    }
  }

  return { createGame, isCreating, error };
}
