// ==============================================
// Archivo: src/utils/azar.js
// Qué hace: funciones de ayuda para elegir cosas al azar. Se usan para
// elegir el país inicial, los países "de relleno" entre las 9 opciones,
// el país no visitado al que se salta con "Ninguno", y para mezclar.
// Conceptos: Math.random, Math.floor, copiar arrays, bucles for.
// ==============================================

// Devuelve un elemento al azar de la lista.
// Math.random() da un número entre 0 (incluido) y 1 (excluido). Al
// multiplicarlo por el largo y redondear para abajo obtenemos un índice
// válido entre 0 y lista.length - 1.
export function elegirAlAzar(lista) {
  const indice = Math.floor(Math.random() * lista.length);
  return lista[indice];
}

// Devuelve una COPIA de la lista con los elementos en orden aleatorio.
// No modificamos la lista original (en React nunca se mutan estados/props).
// Algoritmo: recorremos la copia de atrás para adelante y en cada paso
// intercambiamos la posición actual con otra posición al azar anterior.
export function mezclarArray(lista) {
  const copia = lista.slice(); // slice() sin argumentos copia todo el array
  for (let indice = copia.length - 1; indice > 0; indice = indice - 1) {
    // Elegimos un índice al azar entre 0 e indice (ambos incluidos).
    const indiceAlAzar = Math.floor(Math.random() * (indice + 1));
    // Intercambio clásico con una variable temporal.
    const temporal = copia[indice];
    copia[indice] = copia[indiceAlAzar];
    copia[indiceAlAzar] = temporal;
  }
  return copia;
}

// Elige "cantidad" elementos distintos de la lista, sin repetir y sin usar
// ninguno de los que están en "excluidos" (por ejemplo, el país actual y
// sus fronterizos, para que los de relleno no sean fronterizos "de casualidad").
// OJO: si no hay suficientes elementos disponibles el while sería infinito;
// con 250 países y pocos excluidos nunca pasa, pero lo dejamos anotado.
// Vamos sacando candidatos al azar hasta juntar los que necesitamos.
export function elegirVariosDistintos(lista, cantidad, excluidos) {
  const elegidos = [];
  while (elegidos.length < cantidad) {
    const candidato = elegirAlAzar(lista);
    // includes devuelve true si el elemento ya está en el array.
    const yaEstaExcluido = excluidos.includes(candidato);
    const yaFueElegido = elegidos.includes(candidato);
    if (!yaEstaExcluido && !yaFueElegido) {
      elegidos.push(candidato);
    }
  }
  return elegidos;
}
