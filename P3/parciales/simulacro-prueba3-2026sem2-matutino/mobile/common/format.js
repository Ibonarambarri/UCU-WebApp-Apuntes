/** Números con separador de miles "." y decimales con ",":
 * 3473727 → "3.473.727" · 0.44 → "0,44" · 181034.5 → "181.034,5"
 *
 * Se hace a mano (en vez de `toLocaleString`) para que salga igual en web,
 * Android e iOS, sin depender del idioma del dispositivo.
 */
export function formatNumber(value) {
  if (value === null || value === undefined) {
    return '—';
  }
  const [integer, decimals] = String(value).split('.');
  // Pone un punto antes de cada grupo de 3 cifras contando desde la derecha.
  const withDots = integer.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  return decimals ? `${withDots},${decimals}` : withDots;
}

/** Cómo se nombra cada tipo de pregunta (`stat`) en la pantalla. */
export const STATS = {
  population: { question: 'habitantes', unit: 'habitantes' },
  area: { question: 'superficie', unit: 'km²' },
};

/** "3.473.727 habitantes" o "181.034 km²". */
export function formatStat(stat, value) {
  return `${formatNumber(value)} ${STATS[stat]?.unit ?? ''}`;
}
