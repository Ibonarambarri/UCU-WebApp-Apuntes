# Apuntes Parcial 1 — DWYM (FIT-UCU)

Resoluciones de todos los parciales 1 / prueba 1 que hay en
`ucu-fit-dwym/historial-pruebas`. Los originales quedaron intactos en
`../historial-pruebas/`; acá está todo resuelto.

## Qué hay en cada carpeta

| Carpeta | Origen | Ejercicios |
|---|---|---|
| `2026sem1-prueba1/` | prueba real 2026 sem1 vespertino | ej01 HTML/CSS (Apollo), ej02 JS puro + tests, ej03 DOM + fetch (json-server) |
| `2026sem1-simulacro/` | simulacro 2026 sem1 | ej01 HTML/CSS (menú), ej02 JS puro + tests, ej03 DOM + fetch |
| `2025sem2-matutino/` | parcial real 2025 sem2 mat. | ej1 HTML/CSS (Los Pollos), ej2 objetos/arrays, ej3 display 7 segmentos, ej4 CRUD users |
| `2025sem2-vespertino/` | parcial real 2025 sem2 vesp. | ej1 HTML/CSS (CV), ej2 objetos/arrays, ej3 dado, ej4 CRUD products |
| `2025sem2-simulacro/` | simulacro 2025 sem2 | ej01 HTML/CSS (grilla), ej02 genExp, ej03 fetch API países + favoritos, ej04 CRUD tareas |

**El formato más probable para mañana es el de `2026sem1-prueba1`**: 3 ejercicios
— maquetado, función pura con tests automáticos, y DOM + API con json-server.

## Material de repaso extra

`extra/` tiene lo que armé mirando qué se repite entre años:

- `extra/PATRONES.md` — qué se preguntó cada año y qué apostar
- `extra/CHECKLIST.md` — plan de ataque durante la prueba
- `extra/snippets/` — código listo para copiar (fetch/CRUD, DOM, arrays, layouts)
- `extra/practica-funciones/` — 6 ejercicios nuevos con tests + soluciones
- `extra/practica-api/` — app CRUD completa funcionando (GET/POST/PATCH/PUT/DELETE)
- `extra/galeria-layouts/` — los 4 diseños que salen siempre, en un archivo cada uno

## Cómo correr cada cosa

```bash
# ej02 (función pura con tests)
node ej02/ej02.test.js

# ej03 (DOM + API)
cd ej03 && npm install && npm start   # http://localhost:3000/

# ej01 (solo HTML/CSS): abrir el .html en el navegador
```

`2026sem1-prueba1/ej03/node_modules` ya está instalado — en la prueba **no hay
internet**, así que si te dan `npm install` para correr, hacelo apenas empiece.

---

# Chuleta

## 1. Maquetado (ej01)

Patrón que resuelve casi cualquier diseño de tarjetas responsivo:

```css
.grilla {
  display: grid;
  gap: 1.2em;
  /* la clave de "responsivo": columnas que se acomodan solas */
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
}
```

- `auto-fit` + `minmax` = responsivo **sin media queries**. Es lo que piden
  cuando dicen "si se modifican las dimensiones de la ventana, la grilla debe
  ajustarse automáticamente".
- Marco exterior: `border` + `border-radius` + `max-width` + `margin: 0 auto`.
- Header de tarjeta (título a la izquierda, bandera a la derecha):
  `display:flex; justify-content: space-between; align-items:center`.
- Texto alineado a la derecha dentro de la tarjeta: `text-align: right`.
- Siempre `* { box-sizing: border-box }` arriba de todo.
- Fuente con `@font-face`:

```css
@font-face {
  font-family: 'Rufina';
  src: url('./assets/fonts/Rufina-Bold.ttf') format('truetype');
  font-weight: 700;
}
body { font-family: 'Rufina', Georgia, serif; }
```

- Layout de dos columnas que alterna lado: `flex` + `flex-direction: row-reverse`
  en la clase modificadora.
- Media query de rescate:

```css
@media (max-width: 640px) {
  .dos-columnas { grid-template-columns: 1fr; }
}
```

## 2. Funciones puras sobre arrays/objetos (ej02)

Los tests suelen pedir tres cosas: caso vacío, caso normal, y **que tire error**
con datos inválidos.

```js
export function countriesForCurrency(data, currency) {
  // data null/undefined => .filter ya lanza TypeError (eso satisface assert.throws)
  return data
    .filter((c) => {
      if (typeof c?.cca2 !== "string" || typeof c?.currencies !== "object" || c.currencies === null) {
        throw new TypeError("Formato inválido");
      }
      return Object.hasOwn(c.currencies, currency);
    })
    .map((c) => c.cca2);
}
```

Métodos que aparecen una y otra vez:

| Necesito | Uso |
|---|---|
| filtrar | `arr.filter(f)` |
| transformar | `arr.map(f)` |
| filtrar + transformar en un paso | `arr.flatMap(x => cond ? [y] : [])` |
| buscar uno | `arr.find(f)` / índice: `arr.findIndex(f)` |
| acumular | `arr.reduce((acc, x) => ..., inicial)` |
| ¿tiene la propiedad? | `Object.hasOwn(obj, k)` o `"k" in obj` |
| pares clave/valor | `Object.entries(o)`, `Object.keys(o)`, `Object.values(o)` |
| lista de pares → objeto | `Object.fromEntries(pares)` |
| ordenar por texto | `arr.sort((a,b) => a.n.localeCompare(b.n))` |
| copiar y modificar | `{ ...obj, campo: nuevo }` |
| sin repetidos | `[...new Set(arr)]` |

Ojo con `sort`: **muta** el array. Si no querés mutar: `[...arr].sort(...)`.

Import de JSON en Node moderno (`assert` está deprecado):

```js
import datos from './datos.json' with { type: 'json' };
```

Y el archivo `.js` tiene que ser módulo (`export`/`import`, o `"type": "module"`
en package.json / extensión `.mjs`).

## 3. DOM + API (ej03 / ej04)

### Esqueleto que sirve para todos

```js
async function onLoad() {
  await loadItems();
}

async function loadItems() {
  const cont = document.getElementById('lista');
  try {
    const items = await fetchJSON('/items');
    cont.replaceChildren(...items.map(itemElement)); // borra y redibuja todo
  } catch (error) {
    console.error(error);
  }
}

function itemElement(item) {
  const div = document.createElement('div');
  div.className = 'item';
  div.style.backgroundColor = item.color;   // estilos inline
  div.textContent = item.nombre;            // textContent, NO innerHTML
  const b = document.createElement('button');
  b.textContent = 'Borrar';
  b.addEventListener('click', () => borrar(item));
  div.append(b);
  return div;
}
```

### Métodos de DOM

| Necesito | Uso |
|---|---|
| buscar por id | `document.getElementById('x')` |
| buscar por selector | `document.querySelector('.c')` / `querySelectorAll` |
| crear | `document.createElement('div')` |
| texto | `el.textContent = '...'` |
| clase | `el.className = 'a b'` / `el.classList.add/remove/toggle('x')` |
| estilo inline | `el.style.backgroundColor = '#fff'` (camelCase) |
| agregar hijos | `el.append(a, b)` / `el.prepend(x)` |
| **reemplazar todos los hijos** | `el.replaceChildren(...nuevos)` |
| vaciar | `el.replaceChildren()` |
| evento | `el.addEventListener('click', fn)` |
| valor de input | `el.value` (¡es string! `Number(el.value)`) |
| checkbox | `el.checked` |

### fetch contra json-server

```js
async function fetchJSON(path, options) {
  const resource = new URL(path, window.location);
  const response = await window.fetch(resource, {
    ...options,
    headers: { 'Content-Type': 'application/json', ...options?.headers },
  });
  if (!response.ok) throw new Error(`Error ${response.status}: ${response.statusText}`);
  return await response.json();
}
```

| Operación | Llamada |
|---|---|
| listar | `fetchJSON('/items')` |
| crear | `fetchJSON('/items', { method:'POST', body: JSON.stringify(obj) })` (no mandes `id`, lo genera json-server) |
| reemplazar entero | `PUT /items/:id` con el objeto completo |
| cambiar un campo | `PATCH /items/:id` con `{ campo: valor }` |
| borrar | `DELETE /items/:id` |

**Regla de oro del ejercicio: después de todo POST/PATCH/PUT/DELETE exitoso,
volver a llamar a `loadItems()`.** Es literalmente lo que dice la consigna
("actualizar la UI").

### Formularios

```js
form.addEventListener('submit', async (event) => {
  event.preventDefault();     // sin esto la página se recarga
  ...
});
```

Si el botón está fuera del `<form>` o es `type="button"`, no hay submit y no
hace falta `preventDefault`.

### Errores típicos que cuestan puntos

- Olvidar `event.preventDefault()` en el submit.
- Mandar `id` en el POST.
- No parsear a número: `Number(input.value)`.
- Acumular elementos en vez de redibujar (usá `replaceChildren`).
- `onclick="fn()"` en el HTML pero la función declarada dentro de un módulo
  (`type="module"` no expone funciones globales). Con `<script src="...">`
  normal sí funciona.
- Que `onLoad` corra antes de que exista el DOM: usá `<body onload="...">`,
  `defer` en el script, o `DOMContentLoaded`.

## 4. Utilidades sueltas que aparecieron

```js
// Color hex aleatorio
`#${Array.from({length:3}, () => Math.floor(Math.random()*256).toString(16).padStart(2,'0')).join('')}`

// Entero aleatorio en [min, max]
min + Math.floor(Math.random() * (max - min + 1))

// Elegir al azar de una lista
lista[Math.floor(Math.random() * lista.length)]

// Blanco o negro según el fondo
const lum = (0.299*r + 0.587*g + 0.114*b) / 255;
const texto = lum > 0.5 ? '#000' : '#fff';
```

Mostrar/ocultar sin romper una grilla: `el.style.visibility = 'hidden'`
(a diferencia de `display:none`, sigue ocupando lugar) — es lo que usé en el
ejercicio del dado.
