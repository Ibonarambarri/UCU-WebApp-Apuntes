import { useFetchJSON } from './useFetchJSON.js';

/** GET /api/countries → los 250 países con los campos del listado. */
export function useFetchCountries() {
  return useFetchJSON('/api/countries');
}
