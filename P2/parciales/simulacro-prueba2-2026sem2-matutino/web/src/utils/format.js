/** Funciones chicas para mostrar datos. Todas contemplan valores null
 * (en los datos hay países sin capital, sin área, sin densidad, sin monedas).
 */

const EMPTY = '—';

/** 3473727 → "3.473.727" (formato uruguayo, con puntos de miles). */
export function formatNumber(value, maximumFractionDigits = 0) {
  if (value === null || value === undefined) {
    return EMPTY;
  }
  return value.toLocaleString('es-UY', { maximumFractionDigits });
}

/** Texto o guion si viene null / string vacío. */
export function formatText(value) {
  return value ? value : EMPTY;
}

/** ["a", "b"] → "a, b"; [] → "—". */
export function formatList(values) {
  return values && values.length > 0 ? values.join(', ') : EMPTY;
}
