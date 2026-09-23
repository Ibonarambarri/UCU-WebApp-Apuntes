# Documentación oficial SIN INTERNET — índice

Copias locales de la documentación oficial (en inglés, en Markdown):

| Carpeta | Qué es | Tamaño |
|---|---|---|
| `react.dev/src/content/learn/` | Guías de React (react.dev → "Learn") | 60 págs |
| `react.dev/src/content/reference/react/` | Referencia de cada hook/componente (`useState`, `useEffect`…) | ~120 págs |
| `react-router-v6/docs/` | React Router **v6.30.1**, la versión exacta de la plantilla | 114 págs |
| `mdn/files/en-us/web/javascript/` | MDN JavaScript (todo) | ~1.900 págs |
| `mdn/files/en-us/web/css/` | MDN CSS (todo) | ~900 págs |
| `mdn/files/en-us/web/html/reference/elements/` | MDN etiquetas HTML | |
| `mdn/files/en-us/web/api/…` | `fetch`, `Response`, `URL`, `URLSearchParams`, `localStorage`, `Event` | |
| `mdn/files/en-us/learn_web_development/core/css_layout/` | Tutoriales de flexbox y grid | |

> ⚠️ La documentación de **React Router** en internet (reactrouter.com) hoy es la de **v7**.
> La plantilla usa **v6**: esta copia local es la correcta.

---

## Cómo buscar (lo más rápido)

**En VS Code:**
1. `Cmd+Shift+F` (buscar en todos los archivos).
2. Tocar `…` y en **"files to include"** poner la carpeta, por ejemplo:
   - `P2/docs-offline/react.dev` → solo React
   - `P2/docs-offline/react-router-v6` → solo Router
   - `P2/docs-offline/mdn/files/en-us/web/css` → solo CSS
3. Abrir el `.md` y verlo lindo con **`Cmd+Shift+V`** (vista previa de Markdown).

**Por nombre de archivo:** `Cmd+P` y escribir, por ejemplo, `useSearchParams` o `localecompare`.
Cada página de MDN es una carpeta con un `index.md` adentro (`…/array/sort/index.md`).

**Desde la terminal:**
```bash
cd P2/docs-offline
grep -ril "useSearchParams" react-router-v6/docs          # qué archivos lo mencionan
grep -rl "title: justify-content" mdn/files/en-us/web/css  # la página de una propiedad CSS
```

En las páginas de MDN vas a ver cosas como `{{jsxref("Array")}}` o `{{cssxref("flex")}}`:
son links internos de la web, ignoralos.

---

## "Me trabé con…" → abrir esto

Las rutas son relativas a esta carpeta (`P2/docs-offline/`). Los links se pueden abrir con Cmd+clic.

### React

| Duda | Archivo |
|---|---|
| `useState`, actualizar con función `set(x => x + 1)` | [reference/react/useState.md](react.dev/src/content/reference/react/useState.md) |
| `useEffect`, dependencias, cleanup | [reference/react/useEffect.md](react.dev/src/content/reference/react/useEffect.md) |
| Fetch dentro de un efecto + `ignore` | [learn/synchronizing-with-effects.md](react.dev/src/content/learn/synchronizing-with-effects.md) (buscar "Fetching data") |
| ¿Necesito un efecto o lo calculo en el render? | [learn/you-might-not-need-an-effect.md](react.dev/src/content/learn/you-might-not-need-an-effect.md) ⭐ |
| Quitar un warning de dependencias | [learn/removing-effect-dependencies.md](react.dev/src/content/learn/removing-effect-dependencies.md) |
| `useMemo` / `useCallback` | [useMemo.md](react.dev/src/content/reference/react/useMemo.md) · [useCallback.md](react.dev/src/content/reference/react/useCallback.md) |
| `useRef` (valor que no re-renderiza) | [reference/react/useRef.md](react.dev/src/content/reference/react/useRef.md) |
| Context (`createContext`, Provider, `useContext`) | [learn/passing-data-deeply-with-context.md](react.dev/src/content/learn/passing-data-deeply-with-context.md) · [useContext.md](react.dev/src/content/reference/react/useContext.md) |
| Hooks propios (`useFetchX`) | [learn/reusing-logic-with-custom-hooks.md](react.dev/src/content/learn/reusing-logic-with-custom-hooks.md) |
| Listas, `map`, `key` | [learn/rendering-lists.md](react.dev/src/content/learn/rendering-lists.md) |
| Render condicional (`&&`, ternario) | [learn/conditional-rendering.md](react.dev/src/content/learn/conditional-rendering.md) |
| Eventos (`onClick`, `onChange`, `preventDefault`) | [learn/responding-to-events.md](react.dev/src/content/learn/responding-to-events.md) |
| Props y `children` | [learn/passing-props-to-a-component.md](react.dev/src/content/learn/passing-props-to-a-component.md) |
| Agregar/quitar/editar en un array de estado | [learn/updating-arrays-in-state.md](react.dev/src/content/learn/updating-arrays-in-state.md) ⭐ |
| Actualizar objetos en el estado | [learn/updating-objects-in-state.md](react.dev/src/content/learn/updating-objects-in-state.md) |
| Levantar el estado al padre | [learn/sharing-state-between-components.md](react.dev/src/content/learn/sharing-state-between-components.md) |
| Resetear un componente (`key`) | [learn/preserving-and-resetting-state.md](react.dev/src/content/learn/preserving-and-resetting-state.md) |
| Inputs, selects, checkbox controlados | [reference/react-dom/components/input.md](react.dev/src/content/reference/react-dom/components/input.md) · [select.md](react.dev/src/content/reference/react-dom/components/select.md) |
| Reglas de los hooks ("called conditionally") | [reference/rules/rules-of-hooks.md](react.dev/src/content/reference/rules/rules-of-hooks.md) |
| El tutorial oficial es… ¡un tatetí! | [learn/tutorial-tic-tac-toe.md](react.dev/src/content/learn/tutorial-tic-tac-toe.md) |

### React Router v6

| Duda | Archivo |
|---|---|
| `<Routes>` / `<Route>`, rutas anidadas, `index`, `*` | [components/routes.md](react-router-v6/docs/components/routes.md) · [components/route.md](react-router-v6/docs/components/route.md) · [route/route.md](react-router-v6/docs/route/route.md) |
| `<Outlet />` (layout) | [components/outlet.md](react-router-v6/docs/components/outlet.md) |
| `<Link>` (y su `state`) / `<NavLink>` (link activo) | [components/link.md](react-router-v6/docs/components/link.md) · [components/nav-link.md](react-router-v6/docs/components/nav-link.md) |
| `<Navigate>` (redirigir) | [components/navigate.md](react-router-v6/docs/components/navigate.md) |
| `useParams` | [hooks/use-params.md](react-router-v6/docs/hooks/use-params.md) |
| `useNavigate` (`navigate('/x')`, `navigate(-1)`) | [hooks/use-navigate.md](react-router-v6/docs/hooks/use-navigate.md) |
| `useSearchParams` (query params) ⭐ | [hooks/use-search-params.md](react-router-v6/docs/hooks/use-search-params.md) |
| `useLocation` (`location.state`, `location.search`) | [hooks/use-location.md](react-router-v6/docs/hooks/use-location.md) |
| Tutorial completo de v6 | [start/tutorial.md](react-router-v6/docs/start/tutorial.md) |

### JavaScript (MDN) — `mdn/files/en-us/web/javascript/reference/…`

| Duda | Archivo |
|---|---|
| Métodos de array (`map`, `filter`, `find`, `some`, `sort`, `slice`, `includes`, `join`…) | `global_objects/array/<método>/index.md` → ej. [sort](mdn/files/en-us/web/javascript/reference/global_objects/array/sort/index.md), [filter](mdn/files/en-us/web/javascript/reference/global_objects/array/filter/index.md), [find](mdn/files/en-us/web/javascript/reference/global_objects/array/find/index.md), [slice](mdn/files/en-us/web/javascript/reference/global_objects/array/slice/index.md), [reduce](mdn/files/en-us/web/javascript/reference/global_objects/array/reduce/index.md) |
| `toSorted` (ordenar sin mutar, alternativa a `[...a].sort()`) | [array/tosorted](mdn/files/en-us/web/javascript/reference/global_objects/array/tosorted/index.md) |
| Comparar textos con tildes | [string/localecompare](mdn/files/en-us/web/javascript/reference/global_objects/string/localecompare/index.md) · [string/normalize](mdn/files/en-us/web/javascript/reference/global_objects/string/normalize/index.md) |
| Formato de números `3.473.727` | [number/tolocalestring](mdn/files/en-us/web/javascript/reference/global_objects/number/tolocalestring/index.md) |
| Fechas | [date/tolocaledatestring](mdn/files/en-us/web/javascript/reference/global_objects/date/tolocaledatestring/index.md) |
| `...spread` | [operators/spread_syntax](mdn/files/en-us/web/javascript/reference/operators/spread_syntax/index.md) |
| Desestructuración `const { a } = obj` | [operators/destructuring](mdn/files/en-us/web/javascript/reference/operators/destructuring/index.md) |
| `??` y `?.` | [nullish_coalescing](mdn/files/en-us/web/javascript/reference/operators/nullish_coalescing/index.md) · [optional_chaining](mdn/files/en-us/web/javascript/reference/operators/optional_chaining/index.md) |
| Template strings `` `${x}` `` | [template_literals](mdn/files/en-us/web/javascript/reference/template_literals/index.md) |
| `Object.entries` / `Object.keys` / `Object.hasOwn` | [object/entries](mdn/files/en-us/web/javascript/reference/global_objects/object/entries/index.md) · [object/hasown](mdn/files/en-us/web/javascript/reference/global_objects/object/hasown/index.md) |
| `Set` (valores únicos) | [global_objects/set](mdn/files/en-us/web/javascript/reference/global_objects/set/index.md) |
| `async/await`, promesas, `Promise.all` | [statements/async_function](mdn/files/en-us/web/javascript/reference/statements/async_function/index.md) · [guide/using_promises](mdn/files/en-us/web/javascript/guide/using_promises/index.md) |
| `for...of` | [statements/for...of](mdn/files/en-us/web/javascript/reference/statements/for...of/index.md) |
| `Math.random` | [math/random](mdn/files/en-us/web/javascript/reference/global_objects/math/random/index.md) |
| `encodeURIComponent` | [encodeuricomponent](mdn/files/en-us/web/javascript/reference/global_objects/encodeuricomponent/index.md) |

### APIs del navegador (MDN) — `mdn/files/en-us/web/api/…`

| Duda | Archivo |
|---|---|
| `fetch` con método, body y headers | [fetch_api/using_fetch](mdn/files/en-us/web/api/fetch_api/using_fetch/index.md) · [window/fetch](mdn/files/en-us/web/api/window/fetch/index.md) |
| `response.ok`, `response.status`, `.json()` | [response](mdn/files/en-us/web/api/response/index.md) |
| `URLSearchParams` (`get`, `set`, `delete`) | [urlsearchparams](mdn/files/en-us/web/api/urlsearchparams/index.md) |
| `localStorage` | [window/localstorage](mdn/files/en-us/web/api/window/localstorage/index.md) |
| `event.preventDefault()`, `event.target.value` | [event/preventdefault](mdn/files/en-us/web/api/event/preventdefault/index.md) |

### CSS (MDN) — `mdn/files/en-us/web/css/…`

| Duda | Archivo |
|---|---|
| **Flexbox** explicado (guía) | [guides/flexible_box_layout](mdn/files/en-us/web/css/guides/flexible_box_layout/index.md) y sus subcarpetas · tutorial: [css_layout/flexbox](mdn/files/en-us/learn_web_development/core/css_layout/flexbox/index.md) ⭐ |
| **Grid** explicado (guía) | [guides/grid_layout](mdn/files/en-us/web/css/guides/grid_layout/index.md) · tutorial: [css_layout/grids](mdn/files/en-us/learn_web_development/core/css_layout/grids/index.md) ⭐ |
| Una propiedad concreta | `reference/properties/<propiedad>/index.md` → ej. [flex](mdn/files/en-us/web/css/reference/properties/flex/index.md), [gap](mdn/files/en-us/web/css/reference/properties/gap/index.md), [grid-template-columns](mdn/files/en-us/web/css/reference/properties/grid-template-columns/index.md), `justify-content`, `align-items`, `border-radius`, `box-shadow`… |
| Selectores (`:hover`, `:disabled`, `>`, `:nth-child`) | `reference/selectors/…` → ej. [_colon_hover](mdn/files/en-us/web/css/reference/selectors/_colon_hover/index.md) (los `:` se escriben `_colon_`) |
| Media queries (responsive) | [css_layout/media_queries](mdn/files/en-us/learn_web_development/core/css_layout/media_queries/index.md) |

### HTML (MDN) — `mdn/files/en-us/web/html/reference/elements/<etiqueta>/index.md`

[input](mdn/files/en-us/web/html/reference/elements/input/index.md) ·
[select](mdn/files/en-us/web/html/reference/elements/select/index.md) ·
[form](mdn/files/en-us/web/html/reference/elements/form/index.md) ·
[dl](mdn/files/en-us/web/html/reference/elements/dl/index.md) ·
`button`, `label`, `ul`, `table`, `nav`, `main`…

---

## Tu propio material va PRIMERO

Antes de ir a la documentación oficial, fijate en tus apuntes, que ya están adaptados al examen:
1. [`P2/CHULETA-EXAMEN.md`](../CHULETA-EXAMEN.md) — fragmentos para copiar.
2. [`P2/ESTRATEGIA-EXAMEN.md`](../ESTRATEGIA-EXAMEN.md) — plan de 2 h y todas las trampas.
3. [`P2/parciales/simulacro-prueba2-2026sem2-matutino/APUNTES-PARCIAL.md`](../parciales/simulacro-prueba2-2026sem2-matutino/APUNTES-PARCIAL.md) — solución + recetario de variantes.
4. [`P2/clase/`](../clase/00-INDICE-CLASE.md) — la teoría, un tema por archivo (JS, componentes, estado, useEffect, API, router, Context, CSS).

La documentación oficial sirve para **detalles puntuales** ("¿cómo era el parámetro de
`toLocaleString`?", "¿qué hacía `align-items`?"). Si la usás para aprender algo desde cero
durante el examen, se te va el tiempo.
