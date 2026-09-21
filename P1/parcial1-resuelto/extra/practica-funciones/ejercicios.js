/*
============================================================
 PRÁCTICA — ejercicios estilo ej02 del parcial 1
 Correr:  node test.js
============================================================
*/

/*
1. groupByField(items, field)

Agrupa los elementos de `items` según el valor de la propiedad `field`.
Devuelve un objeto donde cada clave es un valor de `field` y cada valor es el
arreglo de elementos que lo tienen, en el orden original.

  groupByField([{t:'a'},{t:'b'},{t:'a'}], 't')
  // → { a: [{t:'a'},{t:'a'}], b: [{t:'b'}] }

Debe fallar si `items` es null/undefined, si `field` no es un string, o si
algún elemento no tiene la propiedad `field`.
*/
export function groupByField(items, field) {
  throw new Error('groupByField no está implementada');
}

/*
2. activeLoans(books)

Toma libros con la forma
  { titulo, prestamos: [{ estudiante, fechaPrestamo, fechaDevolucion }] }
y devuelve la lista de préstamos ABIERTOS (fechaDevolucion === null) con la
forma { titulo, estudiante, fechaPrestamo }, en el orden en que aparecen.

Debe fallar si `books` es null/undefined o si algún libro no tiene `titulo`
string o `prestamos` arreglo.
*/
export function activeLoans(books) {
  throw new Error('activeLoans no está implementada');
}

/*
3. objectToFieldList(obj)

La inversa de fieldListToObject: convierte un objeto en una lista de
{ field, value }, en el orden de las propiedades.

  objectToFieldList({ x: 1, y: 2 })  // → [{field:'x',value:1},{field:'y',value:2}]

Debe fallar si el argumento es null, undefined, un arreglo, o no es un objeto.
*/
export function objectToFieldList(obj) {
  throw new Error('objectToFieldList no está implementada');
}

/*
4. topBy(items, field, n)

Devuelve los `n` elementos con mayor valor numérico en `field`, ordenados de
mayor a menor. Si `n` no se pasa, devuelve todos ordenados.
NO debe modificar el arreglo original.

Debe fallar si `items` es null/undefined, si `field` no es string, o si algún
elemento no tiene un número en `field`.
*/
export function topBy(items, field, n) {
  throw new Error('topBy no está implementada');
}

/*
5. searchItems(items, criteria)

Búsqueda flexible: devuelve los elementos que cumplen TODOS los criterios.
- si el valor del criterio es string → coincide si el campo lo CONTIENE,
  sin distinguir mayúsculas/minúsculas
- cualquier otro tipo → igualdad estricta
- criterios en undefined se ignoran
- sin criterios (o {}) → devuelve todos

  searchItems(libros, { autor: 'doe', categoria: 'Programación' })

Debe fallar si `items` es null/undefined.
*/
export function searchItems(items, criteria) {
  throw new Error('searchItems no está implementada');
}

/*
6. randomExpression(result)

Devuelve { operator, left, right } con operator en '+', '-', '*', '/', donde
`left operator right` da exactamente `result`. left y right deben ser enteros,
y con '/' la división debe ser exacta y right distinto de 0.

Debe fallar si `result` no es un entero.
*/
export function randomExpression(result) {
  throw new Error('randomExpression no está implementada');
}
