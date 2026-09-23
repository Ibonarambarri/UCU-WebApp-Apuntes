import { useFetchJSON } from './useFetchJSON.js';

/** GET /api/regions → ["Africa", "Americas", …] ya ordenadas.
 * EXTRA: el enunciado dice que no se usa, pero el TODO de la plantilla habla de
 * "filtro por región": es una variante muy probable para el examen.
 */
export function useFetchRegions() {
  return useFetchJSON('/api/regions');
}
