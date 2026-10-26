import { useFetchJSON } from './useFetchJSON.js';

/** GET /api/countries/:code → datos completos de un país (404 si no existe).
 * `encodeURIComponent` por si en la URL escriben cualquier cosa (`/countries/a b`).
 */
export function useFetchRandomCountry() {
  return useFetchJSON('/api/countries/random');
}
