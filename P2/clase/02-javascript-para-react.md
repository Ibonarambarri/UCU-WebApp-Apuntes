# Tema 2 — El JavaScript que React usa sin parar

React en sí es chico. Lo que hace que el código parezca difícil es **JavaScript moderno
compacto**. Son ~8 herramientas; si las reconocés, el 80 % del código se lee solo.

## 2.1 Funciones flecha

```js
function doble(x) { return x * 2; }    // clásica
const doble = (x) => x * 2;             // flecha: UNA expresión → return implícito
const doble = (x) => { return x * 2; }; // flecha con llaves → return OBLIGATORIO
```
Aparecen como funciones "de paso":
```jsx
onClick={() => setCount(count + 1)}               // "cuando hagan clic, ejecutá esto"
countries.filter((c) => c.region === 'Americas')  // "quedate con los que cumplan esto"
```
⚠️ **Trampa:** `onClick={borrar(id)}` **ejecuta** `borrar` al dibujar.
Correcto: `onClick={() => borrar(id)}` → le **pasás una función** que se ejecutará con el clic.

## 2.2 Desestructuración

```js
const pais = { name: 'Uruguay', capital: 'Montevideo', population: 3473727 };

const { name, capital } = pais;                   // OBJETO → llaves, por NOMBRE
// = const name = pais.name; const capital = pais.capital;

const { data: countries } = useFetchCountries();  // "sacá data pero llamalo countries"
const { data = [] } = algo;                       // valor por defecto si es undefined

const [count, setCount] = useState(0);            // ARRAY → corchetes, por POSICIÓN
```
En los parámetros de un componente:
```jsx
function CountryCard({ country }) { … }   // = function CountryCard(props) { const country = props.country; }
```

## 2.3 Spread `...` — copiar y extender

```js
const nueva = [...lista, nuevoItem];              // copia + uno al final
const copia = [...countries].sort(...);           // copia ANTES de sort (sort modifica el original)
const actualizado = { ...tarea, estado: 'hecho' };// copia del objeto cambiando UNA propiedad
```
Base de "no modificar el estado" (tema 7): **siempre algo nuevo, nunca tocar el original.**

## 2.4 Template strings

```js
`/api/countries/${code}`                          // en vez de '/api/countries/' + code
`Mostrando ${visibles.length} de ${total} países`
```

## 2.5 Métodos de array

```js
const paises = [ {code:'URY', population: 3}, {code:'ARG', population: 45}, {code:'BRA', population: 212} ];

paises.map((p) => p.code)                  // ['URY','ARG','BRA']  → TRANSFORMA (mismo largo)
paises.filter((p) => p.population > 10)    // [ARG, BRA]           → SE QUEDA con los que cumplen
paises.find((p) => p.code === 'ARG')       // {code:'ARG',…}       → EL PRIMERO que cumple (o undefined)
paises.some((p) => p.code === 'ARG')       // true                 → ¿ALGUNO cumple?
lista.includes(x)                          //                      → ¿está x? (valores simples)
[...paises].sort((a, b) => b.population - a.population)  // mayor a menor
```

| Quiero obtener… | Uso |
|---|---|
| lista del mismo tamaño, transformada (ej. JSX) | `map` |
| lista más corta | `filter` |
| **un** elemento | `find` |
| sí / no | `some` / `includes` |
| la misma lista en otro orden | `[...].sort` |

Ejemplo real (tatetí):
```js
const played = matches.filter((m) => m.playerX === id || m.playerO === id);
// "partidas jugadas = donde este jugador era X o era O"
```

## 2.6 `?.` y `??` — protegerse de `null` / `undefined`

```js
location.state?.listSearch     // si state es null NO explota: da undefined
searchParams.get('q') ?? ''    // si la izquierda es null/undefined → ''
```
- Sin `?.`: `null.algo` → 💥 *"Cannot read properties of null"* (el error más común
  cuando los datos todavía no llegaron).
- `??` vs `||`: `0 || '—'` → `'—'` (¡perdés el 0!). `0 ?? '—'` → `0`.

## 2.7 Ternario y `&&` — los "if" que caben en JSX

```jsx
{active ? '★' : '☆'}                              // si / sino
{isGameFinished && <button>Play again</button>}   // si true → mostrar; si no → nada
```
Dentro del JSX **no se puede escribir `if`**.

## 2.8 `async` / `await` (a fondo en el tema 11)

```js
async function cargar() {
  const datos = await fetchJSON('/api/countries');  // "esperá a que llegue"
  console.log(datos);                               // recién acá están
}
```
`await` pausa **esa función** (no la página) hasta la respuesta. Solo dentro de `async`.
Errores con `try { … } catch (err) { … }`.

## 2.9 Objetos: `Object.keys / values / entries`

Hay APIs que devuelven **objetos con claves dinámicas** en vez de arrays (países 2025:
`currencies`, `languages`, `name.nativeName`). Un objeto **no tiene `.map`** → primero sacar las claves:
```js
// currencies: { UYU: { name: 'Uruguayan peso', symbol: '$' } }
Object.keys(pais.currencies)        // ['UYU']
Object.values(pais.languages)       // ['Spanish']        (languages: { spa: 'Spanish' })
Object.entries(conteo)              // [['Ana', 2], ['Carlos', 1]]
Object.keys(pais.currencies).map((code) => pais.currencies[code].name)   // acceso con [variable]
Object.keys(obj).length === 0       // ¿objeto vacío?  (array vacío: arr.length === 0)
```
Contar/sumar: un `for...of` con acumulador (más legible que el `reduce` de las plantillas; receta en la CHULETA §6).
Para **devolver un objeto** desde una flecha en una línea: paréntesis → `(prev) => ({ ...prev, [name]: value })`.
Sin ellos, `{ }` se toma como cuerpo de la función y devuelve `undefined`.
`typeof x === 'string'` sirve para distinguir formas (zonas horarias = strings; monedas = objetos).

## 2.10 Comparar y convertir

- **Siempre `===`**: `'7' === 7` → `false`. Lo que viene de `useParams`, inputs y selects es **string**.
- Falsy: `false, 0, '', null, undefined, NaN` (todo lo demás es truthy). `if (!x)` trata el `0` como vacío.
- `Number('7')` → 7 · `Number('abc')` → `NaN` (chequear con `Number.isNaN`) · `String(7)` · `Boolean(id)` → `false` si `undefined`/`''`.
- ⚠️ `'2' + 3` → `'23'` (concatena): convertir con `Number()` antes de sumar.
- Formato: `(3473727).toLocaleString('es-UY')` → `"3.473.727"` · porcentaje entero: `Math.round((hechas / total) * 100)`.
- ⚠️ `[10, 9, 1].sort()` sin comparador ordena **como texto** → `[1, 10, 9]`. Siempre `(a, b) => a - b`.

## 2.11 Azar

```js
const uno = lista[Math.floor(Math.random() * lista.length)];   // índice 0 .. length-1

function mezclar(lista) {               // Fisher-Yates sobre una COPIA
  const copia = [...lista];
  for (let i = copia.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copia[i], copia[j]] = [copia[j], copia[i]];
  }
  return copia;
}
// N distintos: while (elegidos.length < n) { sacar uno; si !elegidos.includes(c) → push }
```
⚠️ `lista.sort(() => Math.random() - 0.5)`: no mezcla bien **y muta** el original.

## 2.12 Varios del navegador (se usan en otros temas)

- `JSON.stringify({ a: 1 })` → `'{"a":1}'` · `JSON.parse('{"a":1}')` → objeto. ⚠️ `JSON.parse('')` tira error.
- `new Date(iso).toLocaleDateString('es-UY')` → `"21/9/2026"`.
- `localStorage.getItem/setItem` (solo strings, `null` si no existe) y `setInterval/clearInterval` → [tema 10](10-useeffect.md).
- `encodeURIComponent('UTC+01:00')` (el `+` en una URL es un espacio) → [tema 11](11-api-fetch.md).
- `URLSearchParams` → ([tema 15](15-usesearchparams.md)).

📂 **Verlo funcionando:** `parciales/2025sem2-parcial2-matutino/web/src/components/PaginaPais.jsx` (recorrer objetos),
`parciales/2025sem2-simulacro-matutino/web/src/utils/azar.js` (azar),
`parciales/simulacro-prueba2-2026sem2-matutino/web/src/utils/format.js` (`toLocaleString`, `??` con el 0).

---

## ❓ Repaso

**Pregunta:** ¿qué hace esto? (`allCountries` puede ser `null`; `borderCode` es tipo `'ARG'`)
```js
const found = allCountries?.find((item) => item.code === borderCode);
return { code: borderCode, name: found?.name ?? borderCode, flag: found?.flag ?? '' };
```

**Respuesta:**
- Busca el primer país cuyo `code` es `borderCode`.
- `allCountries?.find(...)`: si la lista todavía es `null`, **no ejecuta el find** y `found` queda `undefined` (sin romper).
- `found` puede ser `undefined` por **dos** motivos: la lista no llegó, o `find` no encontró a nadie.
- `found?.name ?? borderCode`: si no hay país, muestra al menos el código. `found?.flag ?? ''`: sin bandera.
- En resumen: *mientras no tengo los datos del vecino, muestro su código; cuando llegan, nombre y bandera.* La página nunca se rompe.
