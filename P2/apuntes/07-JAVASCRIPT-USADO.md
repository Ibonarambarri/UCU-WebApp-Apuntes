# 07 — JavaScript usado en los ejercicios y parciales

> Todo el JS "moderno" que aparece en las soluciones, explicado para
> principiante, con un ejemplo corto y **dónde verlo en acción** (rutas
> relativas a `P2/`). Al final: las trampas de JS que salieron en parciales.

---

## 1. Variables: `const` y `let`

```js
const URL_BASE = 'https://countries.dev';   // no se reasigna nunca
let textoDeFronteras = 'No tiene países limítrofes';
if (pais.borders.length > 0) {
  textoDeFronteras = pais.borders.join(', ');   // let permite reasignar
}
```

- `const` por defecto. `let` solo cuando la variable cambia de valor después.
- `const` no significa "inmutable": `const lista = []; lista.push(1)` es válido
  (cambia el contenido, no la variable). En React igual **no mutamos** estado.
- `var` no se usa.

Ver: `Ejers/UT5/UT5.1.1-paises-router/src/paginas/DetalleDePais.jsx`.

---

## 2. Strings: concatenación, template strings, `trim`, `toLowerCase`, `includes`

```js
// Concatenación con + (la que más usamos en las soluciones)
const url = '/api/countries/' + cca3;
const alt = 'Bandera de ' + pais.name;

// Template string: backticks y ${}. Aparece en las plantillas de los parciales.
const url2 = `${API_URL}/${id}`;              // "http://localhost:3001/tasks/7"
throw new Error(`Error HTTP ${respuesta.status}`);

// trim: saca espacios de los costados. Para validar "no vacío".
if (form.title.trim() === '') { ... }

// toLowerCase + includes: buscador que no distingue mayúsculas.
pais.name.toLowerCase().includes(textoDeBusqueda.toLowerCase());

// localeCompare: comparar strings alfabéticamente (para sort, ver §4).
'Argentina'.localeCompare('Brasil');   // negativo => va antes
```

Ver: `Ejers/UT5/UT5.1.1-paises-router/src/paginas/ListaDePaises.jsx`,
`parciales/2026sem1-prueba2-vespertino/src/services/taskService.js`.

---

## 3. Funciones: declaración, `function` anónima, arrow

```js
// Declaración (la forma del curso): tiene nombre, se puede llamar antes de definirla.
function elegirAlAzar(lista) {
  const indice = Math.floor(Math.random() * lista.length);
  return lista[indice];
}

// Función anónima como argumento (lo que le pasamos a map, sort, setInterval...)
lista.sort(function (paisA, paisB) {
  return paisA.name.localeCompare(paisB.name);
});

// Arrow function: lo mismo, más corto. (parametros) => resultado
lista.sort((paisA, paisB) => paisA.name.localeCompare(paisB.name));
```

Arrow: si el cuerpo es una sola expresión, se omite `{}` y `return`. Si tiene
`{}`, hay que escribir `return`.

**Dónde aparecen arrows en las soluciones (y es correcto)**:
- dentro de `.map` en el JSX: `{tareas.map((tarea) => <li key={tarea.id}>...</li>)}`
- en `.filter` / `.find`: `tareas.filter((tarea) => tarea.id !== id)`
- para pasar argumentos a un handler: `onClick={() => props.alBorrar(tarea.id)}`
- en el setter funcional: `setVisitados((anterior) => [...anterior, cca3])`
- en las **plantillas** de los parciales (código que ya viene): `useEffect(() => {...}, [])`, `prev => ({ ...prev, [name]: value })`. Hay que **saber leerlas**.

⚠️ `(x) => { valor }` con llaves devuelve `undefined`. Para devolver un objeto
en una línea: `(prev) => ({ ...prev, [name]: value })` (paréntesis alrededor).

---

## 4. Arrays: los métodos que salen sí o sí

Todos estos **devuelven un array/valor nuevo y NO modifican el original**
(salvo `push`, `sort` y `splice`, que sí lo modifican — cuidado con el estado).

### `map` — transformar cada elemento (dibujar listas)
```js
const nombres = usuarios.map(function (usuario) {
  return usuario.name;
});
// En JSX:
{usuarios.map((usuario) => <li key={usuario.id}>{usuario.name}</li>)}
// Editar UN elemento de un array de estado:
const tareasActualizadas = tareas.map(function (tarea) {
  if (tarea.id === idEditando) {
    return { ...tarea, texto: textoEditando };
  }
  return tarea;
});
```
Ver: `Ejers/UT4/TA08-editar-tarea/src/App.jsx`.

### `filter` — quedarse con los que cumplen
```js
const tareasFiltradas = tareas.filter((tarea) => tarea.id !== idABorrar);   // borrar
const doneTasks = tasks.filter((t) => t.status === 'Done');                // por estado
const columnTasks = tasks.filter((t) => t.status === status);              // columnas Trello
```
Ver: `parciales/2026sem1-prueba2-vespertino/src/components/Board/Board.jsx`.

### `find` — el primero que cumple (o `undefined`)
```js
const tareaEncontrada = tasks.find((tarea) => tarea.id === id);
if (tareaEncontrada === undefined) {
  return <p>No existe.</p>;
}
```
Ver: `Ejers/UT4/TA17-router-params/src/paginas/DetalleProducto.jsx`.

### `includes` — ¿está?
```js
pais.borders.includes('ARG');            // true/false
paisesVisitados.includes(cca3);
'Uruguay'.toLowerCase().includes('urug');  // también en strings
```

### `some` — ¿alguno cumple?
```js
const hayFronterizoDisponible = opciones.some(function (codigo) {
  return pais.borders.includes(codigo) && !paisesVisitados.includes(codigo);
});
```

### `sort` — ordenar (⚠️ MUTA el array; hacerlo sobre una copia o antes de guardar en estado)
```js
// Strings: localeCompare (respeta acentos y mayúsculas)
listaDeLaApi.sort(function (paisA, paisB) {
  return paisA.name.localeCompare(paisB.name);
});
// Números: resta. Negativo = a antes que b.
entries.sort((a, b) => b[1] - a[1]);   // descendente
// Copia antes de ordenar si el array es estado o props:
const copiaOrdenada = lista.slice().sort(...)
```
⚠️ `lista.sort()` **sin función** ordena como strings: `[10, 9, 1].sort()` → `[1, 10, 9]`.

### `join` — array → string
```js
pais.borders.join(', ');        // "ARG, BRA"
partesDelQuery.join('&');       // "currency=EUR&language=fra"
```

### `slice` — copiar / cortar (no muta)
```js
const copia = lista.slice();        // copia completa
const primeros3 = lista.slice(0, 3);
```

### `push` — agregar al final (MUTA; solo en arrays locales, nunca en estado)
```js
const elegidos = [];
elegidos.push(candidato);   // OK: es una variable local de la función
```

### `length`, `for`, `for...of`
```js
for (let indice = 0; indice < lista.length; indice = indice + 1) { ... }   // con índice
for (const tarea of doneTasks) { ... }                                    // por elemento
```

### Reemplazar `reduce` por un `for` con acumulador
`reduce` aparece en las plantillas (Trello `AssigneesChart`, BarApp
`utils/cuentas.js`). Hace lo mismo que un `for` con una variable acumuladora:

```js
// Contar tareas Done por persona.
// Con reduce (plantilla):
const countByAssignee = doneTasks.reduce((acc, task) => {
  acc[task.assignee] = (acc[task.assignee] || 0) + 1;
  return acc;
}, {});

// Con for (equivalente, estilo del curso):
const countByAssignee = {};
for (const tarea of doneTasks) {
  const nombre = tarea.assignee;
  if (countByAssignee[nombre] === undefined) {
    countByAssignee[nombre] = 0;
  }
  countByAssignee[nombre] = countByAssignee[nombre] + 1;
}

// Sumar un total.
let total = 0;
for (const consumo of cuenta.productos) {
  total = total + Number(consumo.cantidad) * precio;
}
```
Ver: `parciales/2026sem1-prueba2-vespertino/src/components/AssigneesChart/AssigneesChart.jsx`,
`parciales/2026sem1-simulacro-vespertino/src/utils/cuentas.js`.

### `Array.isArray`
```js
setProductos(Array.isArray(data) ? data : []);   // por si la API no devolvió un array
```

---

## 5. Spread `...` (copiar arrays y objetos)

```js
// Array: copiar y agregar al final
setTareas([...tareas, nuevaTarea]);

// Objeto: copiar y pisar un campo
const tareaActualizada = { ...tareaEncontrada, status: newStatus };
setForm({ ...form, [name]: value });          // [name] = clave calculada
updateTask(id, { ...form, id: id });          // agregar el id para el PUT

// Objeto: fusionar opciones (plantilla BarApp)
fetch(url, { headers: { 'Content-Type': 'application/json', ...opciones.headers }, ...opciones });
```

El spread es **copia superficial**: los objetos anidados siguen siendo los
mismos. Para nuestro uso (un nivel) alcanza.

---

## 6. Objetos: `Object.keys / values / entries`, claves calculadas, `typeof`

Muchas APIs devuelven **objetos con claves dinámicas** en vez de arrays.
No se puede hacer `.map` sobre un objeto: primero sacar las claves.

```js
// currencies: { "UYU": { name: "Uruguayan peso", symbol: "$" } }
const textosDeMonedas = [];
const codigosDeMonedas = Object.keys(pais.currencies);   // ["UYU"]
for (const codigoDeMoneda of codigosDeMonedas) {
  const moneda = pais.currencies[codigoDeMoneda];        // acceso con corchetes
  textosDeMonedas.push(moneda.name + ' (' + moneda.symbol + ')');
}

// languages: { "spa": "Spanish" }  -> valores directos
Object.values(pais.languages);              // ["Spanish"]

// entries: pares [clave, valor]  (plantilla AssigneesChart)
Object.entries(countByAssignee);            // [["Ana", 2], ["Carlos", 1]]
```

| | Array | Objeto |
|---|---|---|
| Ejemplo API países 2025 | `capital`, `timezones`, `borders` | `currencies`, `languages`, `name.nativeName` |
| Ejemplo countries.dev (UT5) | `languages`, `currencies`, `timezones`, `borders` (todos arrays) | — |
| Recorrer | `.map`, `for...of` | `Object.keys(obj)` + `for...of` |
| ¿Vacío? | `arr.length === 0` | `Object.keys(obj).length === 0` |

Clave calculada `[variable]` y acceso `obj[variable]`:
```js
const clave = 'status';
const copia = { ...form, [clave]: 'Done' };   // { ..., status: 'Done' }
textos[idioma].titulo;                          // textos['es'].titulo
```

`typeof` para distinguir formas (monedas = objeto, zonas horarias = string):
```js
if (typeof elemento === 'string') {
  return elemento;
}
return elemento.code;
```
Ver: `parciales/2025sem2-parcial2-matutino/web/src/components/PaginaPais.jsx`,
`parciales/2025sem2-parcial2-vespertino/web/src/components/ListaDeOpciones.jsx`,
`Ejers/UT4/TA15-dos-contextos/src/textos.js`.

---

## 7. Conversiones: `Number`, `String`, `Boolean`, `toLocaleString`

```js
Number('7');             // 7      (useParams e inputs devuelven STRINGS)
Number(formulario.precio);
Number('abc');           // NaN    -> validar con Number.isNaN(x)
String(7);               // "7"
Boolean(id);             // false si id es undefined, '', 0, null -> isEditing
3473727.toLocaleString('es-UY');   // "3.473.727"
Number(valor).toLocaleString('es-AR');
Math.round((done / total) * 100);  // porcentaje entero
```

Ver: `parciales/2026sem1-prueba2-vespertino/src/pages/TaskFormPage/TaskFormPage.jsx`
(`const isEditing = Boolean(id)`), `Ejers/UT5/UT5.1.1-paises-router/src/paginas/DetalleDePais.jsx` (`toLocaleString`).

---

## 8. Comparación: `===`, `null`, `undefined`, truthy/falsy

- **Siempre `===` y `!==`** (compara tipo y valor). `'7' === 7` es `false`.
- `undefined`: la variable existe pero no tiene valor (campo que la API no
  mandó, `useParams` sin ese parámetro, `find` que no encontró).
- `null`: "vacío a propósito" (lo usamos como valor inicial: `useState(null)`,
  `localStorage.getItem` devuelve `null` si no hay nada).
- Comprobar existencia con `if`, sin `?.` ni `??`:
  ```js
  if (pais.borders !== undefined && pais.borders.length > 0) { ... }
  if (tareaEncontrada === undefined) { return; }
  if (modoGuardado === 'dark') { ... }   // en vez de modoGuardado ?? 'light'
  ```
- Falsy en JS: `false, 0, '', null, undefined, NaN`. Las plantillas usan
  `if (!form.title.trim())`; en el curso preferimos `=== ''` explícito.

⚠️ **Ids string vs number**: json-server 1.x guarda `"id": "4"` (string) y
`useParams` devuelve string → comparar `tarea.id === id` funciona **sin
convertir**. Pero si los ids son números (array hardcodeado, TA17) hay que
`Number(parametros.id)` antes del `find`. Mirá el `db.json` antes de decidir.

---

## 9. Azar: `Math.random`, `Math.floor`, mezclar, elegir varios

```js
// Elemento al azar
function elegirAlAzar(lista) {
  const indice = Math.floor(Math.random() * lista.length);   // 0 .. length-1
  return lista[indice];
}

// Copia mezclada (Fisher-Yates): recorrer de atrás hacia adelante e intercambiar
function mezclarArray(lista) {
  const copia = lista.slice();
  for (let indice = copia.length - 1; indice > 0; indice = indice - 1) {
    const indiceAlAzar = Math.floor(Math.random() * (indice + 1));
    const temporal = copia[indice];
    copia[indice] = copia[indiceAlAzar];
    copia[indiceAlAzar] = temporal;
  }
  return copia;
}

// N distintos, sin repetir ni usar los excluidos
function elegirVariosDistintos(lista, cantidad, excluidos) {
  const elegidos = [];
  while (elegidos.length < cantidad) {
    const candidato = elegirAlAzar(lista);
    if (!excluidos.includes(candidato) && !elegidos.includes(candidato)) {
      elegidos.push(candidato);
    }
  }
  return elegidos;
}
```
⚠️ No usar `lista.sort(() => Math.random() - 0.5)`: no mezcla bien y muta.

Ver: `parciales/2025sem2-simulacro-vespertino/web/src/utils/azar.js`.

---

## 10. `async / await`, `try / catch / finally`

```js
// async: la función devuelve una Promise y adentro se puede usar await.
async function cargarPais() {
  try {
    const pais = await obtenerPaisPorCodigo(cca2);   // espera sin bloquear
    setPais(pais);
  } catch (error) {
    // cae acá si obtenerPaisPorCodigo lanzó (throw) o falló la red
    setMensajeError(error.message);
  } finally {
    // siempre, haya salido bien o mal
    setEstaCargando(false);
  }
}
```

- `await` solo dentro de `async`.
- `throw new Error('mensaje')` corta la función y va al `catch` más cercano.
  `error.message` tiene el texto.
- Quien llama a una función `async` **también** usa `await` (y su propio
  `try/catch`), o la llama y sigue (`cargarPais();` en un `useEffect`).
- Varios `await` seguidos se ejecutan **uno después del otro**:
  ```js
  const monedas = await obtenerMonedas();
  const lenguajes = await obtenerLenguajes();
  ```
- Nunca `.then().then()` en este curso; en las plantillas puede aparecer
  `getTask(id).then((task) => ...)` — equivale a `const task = await getTask(id)`.

---

## 11. `fetch`

```js
// GET (lo más común)
const respuesta = await fetch('/api/countries/' + cca3);
if (!respuesta.ok) {                         // ok = status 200-299
  throw new Error('Error ' + respuesta.status);
}
const datos = await respuesta.json();        // texto JSON -> objeto/array

// 404 con mensaje propio
if (respuesta.status === 404) {
  throw new Error('País no encontrado');
}

// POST / PUT / PATCH / DELETE
const respuesta = await fetch(API_URL, {
  method: 'POST',                                        // 'PUT' | 'PATCH' | 'DELETE'
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(task),                            // objeto -> texto JSON
});
```

⚠️ **`fetch` no lanza error con 404/500**; solo con fallo de red
("Failed to fetch": servidor apagado, puerto equivocado, CORS). Por eso
**siempre** `respuesta.ok`. Detalle de cada método y json-server en
`05-FETCH-API-JSON-SERVER.md`.

Ver: `Ejers/UT5/UT5.1.1-paises-router/src/servicios/api.js`,
`parciales/2026sem1-prueba2-vespertino/src/services/taskService.js`,
`parciales/2026sem1-simulacro-vespertino/src/api/client.js` (`fetchJson` genérico).

---

## 12. `JSON.stringify` / `JSON.parse`

```js
JSON.stringify({ a: 1 });        // '{"a":1}'  -> body de fetch, localStorage
JSON.parse('{"a":1}');           // { a: 1 }   -> leer de localStorage
```

---

## 13. URLs: `encodeURIComponent` y `URLSearchParams`

```js
// Un "+" en un query string significa ESPACIO. "UTC+01:00" sin codificar
// llega como "UTC 01:00" y el filtro devuelve []. Codificar SIEMPRE los valores.
encodeURIComponent('UTC+01:00');   // "UTC%2B01%3A00"
const url = '/api/countries?timezone=' + encodeURIComponent(zonaHoraria);

// Armar un query string solo con filtros no vacíos:
const partesDelQuery = [];
if (moneda !== '') { partesDelQuery.push('currency=' + encodeURIComponent(moneda)); }
if (lenguaje !== '') { partesDelQuery.push('language=' + encodeURIComponent(lenguaje)); }
let url = '/api/countries';
if (partesDelQuery.length > 0) { url = url + '?' + partesDelQuery.join('&'); }

// Alternativa: URLSearchParams codifica solo
const parametros = new URLSearchParams();
parametros.set('currency', 'EUR');
parametros.set('timezone', 'UTC+01:00');
const url2 = '/api/countries?' + parametros.toString();   // currency=EUR&timezone=UTC%2B01%3A00
```

En un `<Link to={'/timezones/' + encodeURIComponent(zona)}>` también se
codifica; `useParams()` **ya lo devuelve decodificado** (`"UTC+01:00"`), y al
volver a meterlo en la URL de la API hay que **codificarlo otra vez**.

Ver: `parciales/2025sem2-parcial2-matutino/web/src/services/api.js`,
`parciales/2025sem2-parcial2-vespertino/web/src/components/PaisesPorZonaHoraria.jsx`.

---

## 14. `localStorage`

```js
localStorage.setItem('modo', modo);            // guarda (solo strings)
const modoGuardado = localStorage.getItem('modo');   // string o null
localStorage.removeItem('modo');

// Objetos/arrays: pasar por JSON
localStorage.setItem('visitados', JSON.stringify(paisesVisitados));
const visitados = JSON.parse(localStorage.getItem('visitados'));   // ojo: null si no existe
```
Sobrevive a recargar y cerrar el navegador. Se ve en DevTools → Application → Local Storage.

Ver: `Ejers/UT5/UT5.1.2-paises-dark-mode/src/contextos/ContextoTema.jsx`.

---

## 15. Timers: `setInterval`, `setTimeout`, `clearInterval`

```js
const idIntervalo = setInterval(function () { ... }, 1000);   // cada 1 s
clearInterval(idIntervalo);                                     // parar

const idTimeout = setTimeout(function () { ... }, 3000);       // una vez, en 3 s
clearTimeout(idTimeout);
```
En React: dentro de `useEffect`, con limpieza que hace `clearInterval`, y
setter en forma funcional (`02-HOOKS-USEEFFECT.md` §6).

---

## 16. `Date` básico

```js
const ahora = new Date();
ahora.toLocaleDateString('es-UY');   // "21/9/2026"
ahora.toLocaleTimeString('es-UY');   // "14:05:33"
ahora.getFullYear();                 // 2026
new Date('2026-09-21').toLocaleDateString('es-UY');
```
(En los ejercicios las fechas de las Cards son strings fijos; `Date` no fue
necesario, pero puede pedirse "fecha de creación" en un CRUD.)

---

## 17. `import` / `export`

```js
// export default: uno por archivo. Se importa con el nombre que quieras.
export default Card;                 →  import Card from './componentes/Card.jsx';

// export con nombre: varios por archivo. Se importa con llaves y el MISMO nombre.
export { ContextoTema, ProveedorTema };  →  import { ContextoTema, ProveedorTema } from '../contextos/ContextoTema.jsx';
export async function getTasks() {...}   →  import { getTasks, createTask } from '../../services/taskService';

// De librerías
import { useState, useEffect, useContext, createContext } from 'react';
import { BrowserRouter, Routes, Route, Link, NavLink, Navigate, useParams, useNavigate } from 'react-router-dom';
import styles from './Board.module.css';     // CSS Modules
import './App.css';                          // CSS global
```

Rutas relativas: `./` misma carpeta, `../` una arriba, `../../` dos arriba.
Las mayúsculas **importan** en Linux (`NavBar.module.css` ≠ `Navbar.module.css`).

---

## 18. Trampas de JS que salieron en parciales

| Trampa | Dónde | Solución |
|---|---|---|
| `currencies`, `languages`, `nativeName` son **objetos**, no arrays → `.map` explota (*"map is not a function"*) | parciales países 2025 | `Object.keys(obj)` + `for...of` |
| `+` en el query string se vuelve espacio → filtro devuelve `[]` | timezones 2025 | `encodeURIComponent` |
| `useParams` devuelve **string**; ids numéricos no matchean con `===` | TA17 | `Number(parametros.id)` |
| json-server 1.x: ids **string** (`"4"`) | Trello, BarApp | no convertir; comparar string con string |
| `evento.target.value` de `type="number"` es string | BarApp cantidad/precio | `Number(...)` antes de guardar/sumar |
| `fetch` no lanza en 404 → `pais.name.common` de `{error}` explota | todos | `if (!respuesta.ok) throw new Error(...)` |
| Campos que faltan: `capital: []`, `currencies: {}`, `assignee` undefined, país sin `map` | ATA, HMD, BVT; db.json | función `unirOGuion(lista)` / `if (x !== undefined)` |
| `sort` muta el array de props/estado | listas | `lista.slice().sort(...)` o ordenar antes del `setEstado` |
| `[10, 9, 1].sort()` ordena como texto | — | pasar función comparadora |
| Sumar con `+` strings: `'2' + 3 === '23'` | totales | `Number()` primero |
| `setEstado` no cambia la variable en la misma función | juego fronteras | calcular en variable y usar esa |
| `lista.push` sobre estado no redibuja | CRUD | `[...lista, nuevo]` |
| `localStorage.getItem` devuelve `null` la primera vez | dark mode | `if (valor === null) usar default` |
| `JSON.parse(null)` → `null`, `JSON.parse('')` → error | localStorage | comprobar `null` antes de parsear |
| Colección Postman/Bruno desactualizada respecto del `db.json` | BarApp | mirar `db.json` para la forma real del objeto |
| Puerto del README ≠ puerto del `package.json` ≠ puerto del service | Trello 3000/3001 | unificar antes de escribir React |

---

## Checklist de repaso

1. ¿Cuál es la diferencia entre `map`, `filter` y `find`? ¿Qué devuelve `find` si no encuentra?
2. Escribí "borrar por id", "editar un campo por id" y "agregar" sin mutar.
3. ¿Cómo recorrés `{ "UYU": { name, symbol } }` para armar `"Uruguayan peso ($)"`?
4. ¿Qué hace `{ ...tarea, texto: 'nuevo' }`? ¿Y `{ ...form, [name]: value }`?
5. Reescribí con `for` un `reduce` que cuenta tareas por persona.
6. ¿Por qué `'7' === 7` es `false` y cuándo tenés que usar `Number()`?
7. ¿Qué pasa con `UTC+01:00` en un query string sin codificar? ¿Cómo lo arreglás?
8. ¿Qué devuelve `fetch` con un 404? ¿Cómo lo detectás?
9. Escribí un `POST` con `fetch` (method, headers, body).
10. ¿Cómo elegís un elemento al azar y cómo mezclás un array sin mutar el original?
11. `localStorage` solo guarda ¿qué tipo? ¿Cómo guardás un array?
12. ¿Qué diferencia hay entre `export default` y `export { a, b }` al importar?
13. ¿Para qué sirve `finally` en el patrón de carga?
14. `lista.sort()` sin función con números, ¿qué hace?
