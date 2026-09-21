/*
# Ejercicio 03 - resuelto.

`rollDie` está asociada al click en el dado. Elige un valor aleatorio entre 1 y
6 y muestra los pips de la manera estándar.
*/

// Pips visibles para cada valor, usando la grilla 3x3 (fila, columna).
const PIPS = {
  1: ['pip22'],
  2: ['pip11', 'pip33'],
  3: ['pip11', 'pip22', 'pip33'],
  4: ['pip11', 'pip13', 'pip31', 'pip33'],
  5: ['pip11', 'pip13', 'pip22', 'pip31', 'pip33'],
  6: ['pip11', 'pip13', 'pip21', 'pip23', 'pip31', 'pip33'],
};

const TODOS = [
  'pip11', 'pip12', 'pip13',
  'pip21', 'pip22', 'pip23',
  'pip31', 'pip32', 'pip33',
];

function rollDie() {
  showDie(Math.floor(Math.random() * 6) + 1);
}

function showDie(value) {
  const visibles = PIPS[value] ?? [];
  for (const id of TODOS) {
    // `visibility: hidden` en vez de `display: none` para que la grilla no se
    // reacomode al ocultar un pip.
    document.getElementById(id).style.visibility =
      visibles.includes(id) ? 'visible' : 'hidden';
  }
  console.log(`Dado: ${value}`);
}
