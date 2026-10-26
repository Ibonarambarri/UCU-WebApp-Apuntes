import { useFetchJSON } from './useFetchJSON';

/** Las 10 mejores partidas terminadas: `[{ id, player, score, finishedAt }]`. */
export function useFetchRanking() {
  return useFetchJSON('/api/ranking');
}
