/*
# Ejercicio 03 - resuelto.

`showRandomDigit` está asociada al click en el display. Elige un dígito
aleatorio entre 0 y 9 y prende/apaga los 7 segmentos correspondientes.
*/

// Segmentos encendidos para cada dígito (display de 7 segmentos estándar).
const SEGMENTOS = {
  0: ['a', 'b', 'c', 'd', 'e', 'f'],
  1: ['b', 'c'],
  2: ['a', 'b', 'g', 'e', 'd'],
  3: ['a', 'b', 'g', 'c', 'd'],
  4: ['f', 'g', 'b', 'c'],
  5: ['a', 'f', 'g', 'c', 'd'],
  6: ['a', 'f', 'g', 'e', 'c', 'd'],
  7: ['a', 'b', 'c'],
  8: ['a', 'b', 'c', 'd', 'e', 'f', 'g'],
  9: ['a', 'b', 'c', 'd', 'f', 'g'],
};

const COLOR_ON = '#e0e000';
const COLOR_OFF = '#030303';

function showRandomDigit() {
  showDigit(Math.floor(Math.random() * 10));
}

function showDigit(digit) {
  const encendidos = SEGMENTOS[digit] ?? [];
  for (const nombre of ['a', 'b', 'c', 'd', 'e', 'f', 'g']) {
    const segmento = document.getElementById(`seg-${nombre}`);
    segmento.style.backgroundColor = encendidos.includes(nombre) ? COLOR_ON : COLOR_OFF;
  }
  console.log(`Dígito mostrado: ${digit}`);
}
