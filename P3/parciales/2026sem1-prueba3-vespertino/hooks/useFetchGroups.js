import { useFetchJSON } from './useFetchJSON';

// GET /api/groups → ["A", "B", ...]
export function useFetchGroups() {
  return useFetchJSON('/api/groups');
}

/** Los 4 equipos de un grupo.
 *
 * OJO (trampa del mock): el README dice que existe `GET /api/groups/H`, pero
 * en `app/api/groups/[code]+api.js` el handler lee `{ group }` cuando el
 * segmento dinámico se llama `[code]` → `group` es undefined y la API
 * responde 500 SIEMPRE. Como la API "no es de interés" (no la tocamos),
 * pedimos `GET /api/teams` (todos los equipos, que sí anda) y filtramos acá.
 */
export function useFetchGroup(letter) {
  const { data: allTeams, ...rest } = useFetchJSON('/api/teams');
  const groupLetter = String(letter).toUpperCase();
  // Estado derivado: no guardamos la lista filtrada en un useState.
  const teams = allTeams ? allTeams.filter((team) => team.group === groupLetter) : null;
  return { data: teams, ...rest };
}
