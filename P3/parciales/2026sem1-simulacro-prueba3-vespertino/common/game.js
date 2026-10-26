// Dificultades del juego: cuántos errores permite cada una.
// Están en un solo lugar para no repetir "8", "5", "3" por todos lados.
export const DIFFICULTIES = [
  { key: 'facil', label: 'Fácil', maxErrors: 8 },
  { key: 'medio', label: 'Medio', maxErrors: 5 },
  { key: 'dificil', label: 'Difícil', maxErrors: 3 },
];

export const DEFAULT_MAX_ERRORS = 5;

// Los params de la URL llegan SIEMPRE como string ("5"). Los pasamos a número
// y, si vienen mal (ej. /game?maxErrors=hola), usamos el valor por defecto.
export function parseMaxErrors(value) {
  const number = Number(value);
  return Number.isInteger(number) && number > 0 ? number : DEFAULT_MAX_ERRORS;
}

// "Te queda 1 error." / "Te quedan 2 errores." (singular y plural).
export function remainingErrorsText(count) {
  return count === 1 ? 'Te queda 1 error.' : `Te quedan ${count} errores.`;
}
