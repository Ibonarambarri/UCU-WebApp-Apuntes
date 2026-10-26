import { useFetchJSON } from './useFetchJSON';

// GET /api/teams/URU → { code, name, group, continent, confed, stickers: [...] }
export function useFetchTeam(code) {
  return useFetchJSON(`/api/teams/${encodeURIComponent(code)}`);
}
