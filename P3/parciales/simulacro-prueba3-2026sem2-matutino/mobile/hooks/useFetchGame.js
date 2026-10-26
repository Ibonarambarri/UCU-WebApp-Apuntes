import { useFetchJSON } from './useFetchJSON';

/** Una partida. Si no existe, `error.status` es 404. */
export function useFetchGame(id) {
  return useFetchJSON(`/api/games/${id}`);
}
