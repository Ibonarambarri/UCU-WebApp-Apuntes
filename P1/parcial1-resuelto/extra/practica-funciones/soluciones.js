/*
============================================================
 SOLUCIONES de la práctica.
 Correr:  node test.js ./soluciones.js
============================================================
*/

/* --- 1 ------------------------------------------------------------------ */
export function groupByField(items, field) {
  if (items === null || items === undefined) {
    throw new TypeError('items no puede ser null ni undefined');
  }
  if (typeof field !== 'string') {
    throw new TypeError('field debe ser un string');
  }

  const result = {};
  for (const item of items) {
    if (item === null || typeof item !== 'object' || !Object.hasOwn(item, field)) {
      throw new TypeError(`El elemento no tiene la propiedad "${field}": ${JSON.stringify(item)}`);
    }
    // (result[k] ??= []) crea el arreglo la primera vez y lo reutiliza después
    (result[item[field]] ??= []).push(item);
  }
  return result;
}

/* --- 2 ------------------------------------------------------------------ */
export function activeLoans(books) {
  if (books === null || books === undefined) {
    throw new TypeError('books no puede ser null ni undefined');
  }

  // flatMap = map + aplanar: sirve para "por cada libro, 0..n resultados"
  return books.flatMap((book) => {
    if (typeof book?.titulo !== 'string' || !Array.isArray(book?.prestamos)) {
      throw new TypeError(`Libro con formato inválido: ${JSON.stringify(book)}`);
    }
    return book.prestamos
      .filter((p) => p.fechaDevolucion === null)
      .map((p) => ({
        titulo: book.titulo,
        estudiante: p.estudiante,
        fechaPrestamo: p.fechaPrestamo,
      }));
  });
}

/* --- 3 ------------------------------------------------------------------ */
export function objectToFieldList(obj) {
  if (obj === null || typeof obj !== 'object' || Array.isArray(obj)) {
    throw new TypeError('Se esperaba un objeto');
  }
  // Object.entries toma las claves propias enumerables, tenga el valor que tenga
  // (incluido undefined), y en el orden de inserción.
  return Object.entries(obj).map(([field, value]) => ({ field, value }));
}

/* --- 4 ------------------------------------------------------------------ */
export function topBy(items, field, n) {
  if (items === null || items === undefined) {
    throw new TypeError('items no puede ser null ni undefined');
  }
  if (typeof field !== 'string') {
    throw new TypeError('field debe ser un string');
  }

  for (const item of items) {
    if (typeof item?.[field] !== 'number' || Number.isNaN(item[field])) {
      throw new TypeError(`"${field}" debe ser numérico en ${JSON.stringify(item)}`);
    }
  }

  // [...items] copia: sort() muta y la consigna pide no tocar el original
  const ordenados = [...items].sort((a, b) => b[field] - a[field]);
  return n === undefined ? ordenados : ordenados.slice(0, n);
}

/* --- 5 ------------------------------------------------------------------ */
export function searchItems(items, criteria = {}) {
  if (items === null || items === undefined) {
    throw new TypeError('items no puede ser null ni undefined');
  }

  const entradas = Object.entries(criteria)
    .filter(([, valor]) => valor !== undefined);

  return items.filter((item) => entradas.every(([campo, valor]) => (
    typeof valor === 'string'
      ? String(item?.[campo]).toLowerCase().includes(valor.toLowerCase())
      : item?.[campo] === valor
  )));
}

/* --- 6 ------------------------------------------------------------------ */
const randomInt = (min, max) => min + Math.floor(Math.random() * (max - min + 1));

function divisores(n) {
  const abs = Math.abs(n);
  const result = [];
  for (let i = 1; i <= abs; i += 1) {
    if (abs % i === 0) {
      result.push(i);
    }
  }
  return result;
}

export function randomExpression(result) {
  if (!Number.isInteger(result)) {
    throw new TypeError('randomExpression espera un entero');
  }

  const operator = ['+', '-', '*', '/'][randomInt(0, 3)];

  switch (operator) {
    case '+': {
      const left = randomInt(-20, 20);
      return { operator, left, right: result - left };
    }
    case '-': {
      const right = randomInt(1, 20);
      return { operator, left: result + right, right };
    }
    case '*': {
      if (result === 0) {
        return { operator, left: 0, right: randomInt(1, 10) };
      }
      const divs = divisores(result);
      const left = divs[randomInt(0, divs.length - 1)];
      return { operator, left, right: result / left };
    }
    default: {
      const right = randomInt(1, 10);
      return { operator: '/', left: result * right, right };
    }
  }
}
