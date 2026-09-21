/*
# Ejercicio 02 - resuelto.

`genExp(result)` devuelve una expresión aritmética aleatoria
`{ operator, left, right }` cuyo resultado es `result`.
*/

const OPERATORS = ['+', '-', '*', '/'];

/* Entero aleatorio en [min, max] (ambos incluidos). */
function randomInt(min, max) {
  return min + Math.floor(Math.random() * (max - min + 1));
}

/* Divisores de n (para construir multiplicaciones exactas). */
function divisors(n) {
  const result = [];
  for (let i = 1; i <= Math.abs(n); i += 1) {
    if (n % i === 0) {
      result.push(i);
    }
  }
  return result;
}

export function genExp(result) {
  if (!Number.isInteger(result)) {
    throw new TypeError('genExp espera un número entero.');
  }

  // Con 0 no se puede usar `*` ni `/` de forma interesante: se descartan.
  const candidates = result === 0 ? ['+', '-'] : OPERATORS;
  const operator = candidates[randomInt(0, candidates.length - 1)];

  switch (operator) {
    case '+': {
      // left + right = result
      const left = randomInt(1, Math.max(1, Math.abs(result)) * 2);
      return { operator, left, right: result - left };
    }
    case '-': {
      // left - right = result
      const right = randomInt(1, 20);
      return { operator, left: result + right, right };
    }
    case '*': {
      // left * right = result, usando un divisor exacto
      const divs = divisors(result);
      const left = divs[randomInt(0, divs.length - 1)];
      return { operator, left, right: result / left };
    }
    default: {
      // left / right = result, con división exacta
      const right = randomInt(1, 10);
      return { operator: '/', left: result * right, right };
    }
  }
}

/* Evalúa la expresión, útil para verificar. */
export function evalExp({ operator, left, right }) {
  switch (operator) {
    case '+': return left + right;
    case '-': return left - right;
    case '*': return left * right;
    case '/': return left / right;
    default: throw new Error(`Operador desconocido: ${operator}`);
  }
}
