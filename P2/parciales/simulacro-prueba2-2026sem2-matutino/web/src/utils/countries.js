/** Lógica "pura" del listado (sin React): buscar, filtrar y ordenar.
 * Tenerla aparte hace que el componente quede corto y fácil de leer.
 */

/** Opciones de orden. La clave (`name`, `population`, `area`) es lo que va en
 * la URL: `/countries?sort=population`.
 */
export const SORT_OPTIONS = {
  name: 'Nombre (A-Z)',
  population: 'Población (mayor a menor)',
  area: 'Área (mayor a menor)',
};

export const DEFAULT_SORT = 'name';

/** Pasa a minúsculas y saca tildes: "Perú" → "peru", "Åland" → "aland".
 * Así buscar "peru" encuentra "Perú".
 */
export function normalizeText(text) {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '');
}

/** Compara números de mayor a menor, mandando los null al final
 * (hay 10 países con `area: null`; sin esto quedarían mezclados).
 */
function compareDescending(a, b) {
  if (a === null && b === null) return 0;
  if (a === null) return 1;
  if (b === null) return -1;
  return b - a;
}

export function sortCountries(countries, sort) {
  // [...countries]: sort() MODIFICA el array, así que ordenamos una copia
  // (nunca mutar el estado ni los datos de un hook).
  const sorted = [...countries];
  if (sort === 'population') {
    sorted.sort((a, b) => compareDescending(a.population, b.population));
  } else if (sort === 'area') {
    sorted.sort((a, b) => compareDescending(a.area, b.area));
  } else {
    sorted.sort((a, b) => a.name.localeCompare(b.name));
  }
  return sorted;
}

/** Aplica todos los filtros y el orden. Cada filtro se saltea si está vacío. */
export function filterAndSortCountries(countries, { query, region, onlyFavorites, isFavorite, sort }) {
  const normalizedQuery = normalizeText(query.trim());
  const filtered = countries.filter((country) => {
    if (normalizedQuery && !normalizeText(country.name).includes(normalizedQuery)) {
      return false;
    }
    if (region && country.region !== region) {
      return false;
    }
    if (onlyFavorites && !isFavorite(country.code)) {
      return false;
    }
    return true;
  });
  return sortCountries(filtered, sort);
}
