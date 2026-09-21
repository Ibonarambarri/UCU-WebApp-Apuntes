// Tests automáticos. Por favor no modificar.
//   node test.js                  → prueba ejercicios.js
//   node test.js ./soluciones.js  → prueba soluciones.js
import assert from 'node:assert';
import datos from './datos.json' with { type: 'json' };

const modulo = process.argv[2] ?? './ejercicios.js';
const {
  groupByField, activeLoans, objectToFieldList, topBy, searchItems, randomExpression,
} = await import(modulo);

const libros = datos.libros;
let ok = 0;
function suite(nombre, fn) {
  try {
    fn();
    ok += 1;
    console.log(`  ✅ ${nombre}`);
  } catch (error) {
    console.log(`  ❌ ${nombre}\n     ${error.message.split('\n')[0]}`);
    process.exitCode = 1;
    throw error;
  }
}

console.log(`Probando ${modulo}\n`);

// ---------------------------------------------------------------- 1
suite('1. groupByField', () => {
  assert.equal(typeof groupByField, 'function', 'debe exportar groupByField');

  assert.deepEqual(groupByField([], 'x'), {}, 'lista vacía → objeto vacío');

  assert.deepEqual(
    groupByField([{ t: 'a', n: 1 }, { t: 'b', n: 2 }, { t: 'a', n: 3 }], 't'),
    { a: [{ t: 'a', n: 1 }, { t: 'a', n: 3 }], b: [{ t: 'b', n: 2 }] },
    'agrupa manteniendo el orden original',
  );

  assert.deepEqual(
    Object.keys(groupByField(libros, 'categoria')).sort(),
    ['Diseño', 'Programación'],
    'agrupa los libros por categoría',
  );
  assert.equal(groupByField(libros, 'autor')['John Doe'].length, 2);

  assert.throws(() => groupByField(null, 't'), 'falla con null');
  assert.throws(() => groupByField(undefined, 't'), 'falla con undefined');
  assert.throws(() => groupByField([{ t: 'a' }]), 'falla si no se pasa field');
  assert.throws(() => groupByField([{ t: 'a' }, {}], 't'), 'falla si falta la propiedad');
});

// ---------------------------------------------------------------- 2
suite('2. activeLoans', () => {
  assert.equal(typeof activeLoans, 'function', 'debe exportar activeLoans');

  assert.deepEqual(activeLoans([]), [], 'lista vacía → arreglo vacío');

  assert.deepEqual(
    activeLoans([{ titulo: 'X', prestamos: [] }]),
    [],
    'sin préstamos abiertos → arreglo vacío',
  );

  assert.deepEqual(activeLoans(libros), [
    { titulo: 'JavaScript Avanzado', estudiante: 'Ana', fechaPrestamo: '2026-03-01' },
    { titulo: 'Node para todos', estudiante: 'Cami', fechaPrestamo: '2026-03-05' },
  ], 'devuelve sólo los préstamos con fechaDevolucion en null');

  assert.throws(() => activeLoans(null), 'falla con null');
  assert.throws(() => activeLoans(undefined), 'falla con undefined');
  assert.throws(() => activeLoans([{ titulo: 'X' }]), 'falla si falta prestamos');
  assert.throws(() => activeLoans([{ prestamos: [] }]), 'falla si falta titulo');
});

// ---------------------------------------------------------------- 3
suite('3. objectToFieldList', () => {
  assert.equal(typeof objectToFieldList, 'function', 'debe exportar objectToFieldList');

  assert.deepEqual(objectToFieldList({}), [], 'objeto vacío → lista vacía');

  assert.deepEqual(
    objectToFieldList({ x: 1, y: 2 }),
    [{ field: 'x', value: 1 }, { field: 'y', value: 2 }],
    'respeta el orden de las propiedades',
  );

  assert.deepEqual(
    objectToFieldList({ a: undefined }),
    [{ field: 'a', value: undefined }],
    'incluye las propiedades con valor undefined',
  );

  assert.throws(() => objectToFieldList(null), 'falla con null');
  assert.throws(() => objectToFieldList(), 'falla con undefined');
  assert.throws(() => objectToFieldList([1, 2]), 'falla con un arreglo');
  assert.throws(() => objectToFieldList('hola'), 'falla si no es un objeto');
});

// ---------------------------------------------------------------- 4
suite('4. topBy', () => {
  assert.equal(typeof topBy, 'function', 'debe exportar topBy');

  assert.deepEqual(topBy([], 'p', 3), [], 'lista vacía → arreglo vacío');

  assert.deepEqual(
    topBy([{ p: 1 }, { p: 9 }, { p: 5 }], 'p', 2),
    [{ p: 9 }, { p: 5 }],
    'devuelve los n mayores, de mayor a menor',
  );

  assert.deepEqual(
    topBy([{ p: 1 }, { p: 9 }], 'p'),
    [{ p: 9 }, { p: 1 }],
    'sin n devuelve todos ordenados',
  );

  assert.deepEqual(
    topBy([{ p: 1 }], 'p', 10).length, 1,
    'n mayor que la cantidad no rompe',
  );

  assert.deepEqual(
    topBy(libros, 'precio', 2).map((l) => l.titulo),
    ['Node para todos', 'JavaScript Avanzado'],
  );

  const original = [{ p: 1 }, { p: 9 }];
  topBy(original, 'p');
  assert.deepEqual(original, [{ p: 1 }, { p: 9 }], 'NO debe modificar el arreglo original');

  assert.throws(() => topBy(null, 'p'), 'falla con null');
  assert.throws(() => topBy([{ p: 1 }]), 'falla si no se pasa field');
  assert.throws(() => topBy([{ p: 'x' }], 'p'), 'falla si el campo no es numérico');
});

// ---------------------------------------------------------------- 5
suite('5. searchItems', () => {
  assert.equal(typeof searchItems, 'function', 'debe exportar searchItems');

  assert.deepEqual(searchItems([], { a: 1 }), [], 'lista vacía → arreglo vacío');

  assert.equal(searchItems(libros).length, 4, 'sin criterios devuelve todos');
  assert.equal(searchItems(libros, {}).length, 4, 'criterios vacíos devuelve todos');

  assert.deepEqual(
    searchItems(libros, { autor: 'doe' }).map((l) => l.id),
    [1, 3],
    'los strings buscan por subcadena sin distinguir mayúsculas',
  );

  assert.deepEqual(
    searchItems(libros, { categoria: 'Diseño', precio: 18 }).map((l) => l.id),
    [4],
    'combina varios criterios',
  );

  assert.deepEqual(
    searchItems(libros, { autor: 'nadie' }),
    [],
    'sin coincidencias → arreglo vacío',
  );

  assert.deepEqual(
    searchItems(libros, { autor: undefined }).length,
    4,
    'los criterios undefined se ignoran',
  );

  assert.throws(() => searchItems(null, {}), 'falla con null');
  assert.throws(() => searchItems(undefined, {}), 'falla con undefined');
});

// ---------------------------------------------------------------- 6
suite('6. randomExpression', () => {
  assert.equal(typeof randomExpression, 'function', 'debe exportar randomExpression');

  const evaluar = ({ operator, left, right }) => ({
    '+': left + right, '-': left - right, '*': left * right, '/': left / right,
  }[operator]);

  for (const objetivo of [0, 1, 7, 12, 100, -5]) {
    const operadores = new Set();
    for (let i = 0; i < 300; i += 1) {
      const exp = randomExpression(objetivo);
      assert.ok(['+', '-', '*', '/'].includes(exp.operator), 'operador válido');
      assert.ok(Number.isInteger(exp.left), 'left entero');
      assert.ok(Number.isInteger(exp.right), 'right entero');
      if (exp.operator === '/') {
        assert.notEqual(exp.right, 0, 'no dividir por cero');
      }
      assert.equal(
        evaluar(exp), objetivo,
        `${exp.left} ${exp.operator} ${exp.right} debe dar ${objetivo}`,
      );
      operadores.add(exp.operator);
    }
    assert.ok(operadores.size >= 2, `debe generar operadores variados para ${objetivo}`);
  }

  assert.throws(() => randomExpression('x'), 'falla si no es entero');
  assert.throws(() => randomExpression(1.5), 'falla con decimales');
});

console.log(`\n${ok}/6 ejercicios OK.`);
