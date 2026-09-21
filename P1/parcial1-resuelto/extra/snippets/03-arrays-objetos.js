/* ============================================================
   SNIPPET 3 — arrays y objetos (el ej02 de siempre)
   ============================================================ */

/* --- Los 6 métodos que resuelven el 90% --- */
arr.filter((x) => x.activo);                       // quedarse con algunos
arr.map((x) => x.nombre);                          // transformar
arr.flatMap((x) => x.hijos);                       // aplanar un nivel
arr.flatMap((x) => cond(x) ? [f(x)] : []);         // filtrar+transformar en un paso
arr.find((x) => x.id === 3);                       // el primero que cumpla (o undefined)
arr.some((x) => x.malo);  arr.every((x) => x.ok);  // booleanos
arr.reduce((acc, x) => acc + x.precio, 0);         // acumular

/* --- Objetos --- */
Object.keys(o); Object.values(o); Object.entries(o);
Object.fromEntries([['a', 1], ['b', 2]]);          // → { a: 1, b: 2 }
Object.hasOwn(o, 'clave');                         // ¿tiene esa propiedad?
'clave' in o;                                      // idem (incluye el prototipo)
const copia = { ...o, campo: 'nuevo' };            // copiar cambiando algo
const { a, ...resto } = o;                         // sacar una propiedad

/* --- Ordenar (¡sort MUTA!) --- */
[...arr].sort((a, b) => a.valor - b.valor);        // números
[...arr].sort((a, b) => a.nombre.localeCompare(b.nombre));  // texto

/* --- Agrupar --- */
const porCategoria = {};
for (const x of arr) {
  (porCategoria[x.categoria] ??= []).push(x);
}
// o, si está disponible:  Object.groupBy(arr, (x) => x.categoria)

/* --- Sin repetidos --- */
[...new Set(arr.map((x) => x.categoria))];

/* --- Encadenado típico del parcial --- */
const resultado = datos
  .filter((x) => x.moneda === 'UYU')
  .map((x) => x.codigo);

/* ============================================================
   PLANTILLA de función que pasa los tests del curso
   ============================================================ */

export function miFuncion(data, criterio) {
  // 1. null/undefined → el propio .filter lanza TypeError, que es lo que
  //    espera assert.throws. Si querés un mensaje propio:
  if (data === undefined || data === null) {
    throw new TypeError('data no puede ser undefined ni null');
  }

  return data
    .filter((item) => {
      // 2. formato inválido → throw (los tests SIEMPRE lo prueban)
      if (typeof item?.campoRequerido !== 'string') {
        throw new TypeError(`Formato inválido: ${JSON.stringify(item)}`);
      }
      // 3. criterio undefined → false → devuelve [] (los tests lo prueban)
      return item.campoRequerido === criterio;
    })
    .map((item) => item.id);
  // 4. si no encuentra nada devuelve [], nunca undefined
}

/* --- Importar JSON en Node (ojo: `assert` está deprecado) --- */
// import datos from './datos.json' with { type: 'json' };
