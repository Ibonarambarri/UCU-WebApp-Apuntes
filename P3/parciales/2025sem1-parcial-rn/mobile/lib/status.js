/* Los tres estados posibles de una tarea, con su emoji y su color.
 * Tenerlo en UN solo lugar evita repetir `if (status === 'pending') ...` en
 * cada pantalla.
 *
 * OJO con el nombre del campo: el PLANTEO dice `state`, pero `api/data.json`
 * trae `status`. Usamos `status` porque es lo que realmente devuelve la API.
 */
export const STATUSES = {
  pending: { emoji: '⏳', label: 'Pending', color: '#bde4ff' }, // celeste
  blocked: { emoji: '⚠️', label: 'Blocked', color: '#fff1a8' }, // amarillo
  completed: { emoji: '✅', label: 'Completed', color: '#c4f0c2' }, // verde
};

// Lista de claves en orden: ['pending', 'blocked', 'completed'].
export const STATUS_KEYS = Object.keys(STATUSES);
