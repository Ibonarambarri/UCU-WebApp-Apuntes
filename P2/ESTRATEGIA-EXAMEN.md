# Estrategia de examen — Parcial 2 (React + Router + Context)

Todo lo "de examen" en un solo lugar: los primeros minutos, el plan de 2 h, el checklist
antes de entregar y **todas las trampas** (deduplicadas, agrupadas por tema).
La teoría está en [`clase/`](clase/00-INDICE-CLASE.md); los fragmentos para copiar, en
[`CHULETA-EXAMEN.md`](CHULETA-EXAMEN.md).

**Formatos** (para saber qué aplica a cada cosa):

| Etiqueta | Formato | Parciales |
|---|---|---|
| **26s2** | Plantilla con **mock API en Vite** + `fetchJSON` + CSS Modules + React Router v6. Requisitos + opcionales, crear es **PUT**. **El del examen.** | `simulacro-prueba2-2026sem2-*`, `practica-*` |
| **26s1** | Plantilla con `// TODO`, 6 ejercicios (5/6 = 100 %), **json-server** en otro puerto, `fetch` a pelo en un service | `2026sem1-*` |
| **2025** | App desde casi cero, mock API en Vite (`/api/...`), `fetch` a pelo, datos de países con objetos | `2025sem2-*` |

---

## 1. Primeros 5 minutos (SIN internet)

```bash
git clone <url-de-mi-fork>  &&  cd <repo>
npm install --prefer-offline      # usa la caché de npm (ya está cargada: probado)
# si falla, copiar node_modules de un simulacro (el package.json es IDÉNTICO):
#   cp -R ../simulacro-prueba2-2026sem2-matutino/node_modules .
# si avisa "allow-scripts ... esbuild":
#   npm approve-scripts esbuild --yes && npm rebuild esbuild
npm start                          # http://localhost:5173 (la API vive en el mismo puerto)
npm run lint                       # tiene que salir limpio al final
```

1. Leer el **README entero**. Marcar: rutas exactas, campos a mostrar, "casos a contemplar"
   (son puntos fáciles), opcionales.
2. Abrir `web/data/mock-routes.js` → qué endpoints hay, qué método (¡crear es **PUT**!),
   qué body esperan, qué errores (400/404). → [tema 11](clase/11-api-fetch.md)
3. Mirar `specs/design.svg` (arrastrarlo al navegador): te dice la estructura de componentes.
4. Probar la API en el navegador: `localhost:5173/api/...`.
5. `App.jsx` → qué rutas/páginas existen. `grep -rn TODO web/src` → qué falta.

**Formatos viejos:**
- **26s1:** `npm install` (y `cd BE && npm install` si existe `BE/`). Mirar `db.json`
  (¿ids string? ¿qué campos?), el script del backend en `package.json` (**ese** es el
  puerto real) y el service (`services/*.js`, `api/client.js`): **unificar el puerto antes de
  escribir React**. Dos terminales: backend (`npm run server` / `npm run be`) + `npm run dev`.
  Probar `curl -s http://localhost:3001/tasks | head -c 300`.
- **2025:** `cd web && npm install && npm start`. Leer `mock-routes.js` y un país en
  `/api/countries/URY`: anotar qué es **objeto** y qué es **array**.

Detalle de comandos y puertos de cada proyecto: [README → Cómo correr cada cosa](README.md#cómo-correr-cada-cosa).

---

## 2. Plan de ataque de 2 h

**Reglas generales (todos los formatos):**
- **Primero que funcione, después que se vea.** Los estilos van al final.
- **Copiá sin culpa** de tu solución del simulacro: hooks (`useFetchJSON.js`), utils
  (`format.js`), `StatusMessage`, `FavoritesProvider`, estructura de páginas. Adaptar es más
  rápido que escribir de cero.
- **Commit cada ~30 min** (`git add -A && git commit -m "avance"`). Si algo se rompe, volvés.
- Si algo no sale en **15 min**, pasar al siguiente y volver después.
- Lo **opcional** solo si lo obligatorio está completo y probado.
- **Faltando 15 min:** `npm run lint`, probar casos borde a mano, commit, push, PR.

### 26s2 — plantilla con mock API (el del examen)

Orden de prioridades (del simulacro matutino):

| Min | Qué | Tema |
|---|---|---|
| 0–10 | Lectura (§1). | 1, 11 |
| 10–25 | Rutas en `App.jsx`: Layout con `<Outlet />`, `index`, `*`, las rutas **con los nombres exactos** del enunciado apuntando a páginas vacías. Navegar por todas. | [13](clase/13-router-rutas.md) |
| 25–50 | Listado que muestra datos (aunque feo): hook de GET (copiar `useFetchJSON`), 4 estados (cargando/error/vacío/datos), `map` + `key`, `<Link>` al detalle. | 5, 10, [12](clase/12-hooks-propios.md) |
| 50–75 | Detalle `/x/:code`: `useParams`, dependencia `[code]`, todos los campos, 404, casos borde (null, listas vacías), limítrofes/relacionados con `<Link>`, volver. | 10, [14](clase/14-useparams-usenavigate.md) |
| 75–95 | Búsqueda/filtros/orden **en la URL** (`useSearchParams`), "Mostrando X de Y", "sin resultados". | 9, [15](clase/15-usesearchparams.md) |
| 95–110 | Opcionales (favoritos con Context; si no llega, un hook por página alcanza) y estilos. | [16](clase/16-context.md), [18](clase/18-css-modules-y-lint.md) |
| 110–120 | `npm run lint` limpio + checklist (§3) + PR. | [18](clase/18-css-modules-y-lint.md) |

Si piden un **formulario de alta** (tatetí): form controlado + `await createX(...)` +
limpiar + `refetch()` → [tema 8](clase/08-formularios-controlados.md). Variantes probables con
código: `parciales/simulacro-prueba2-2026sem2-matutino/APUNTES-PARCIAL.md` §4.

### 26s1 — plantilla con TODOs + json-server (6 ejercicios, 5/6 = 100 %)

| Min | Qué | Por qué en este orden |
|---|---|---|
| 0–10 | Setup (§1 formatos viejos): puerto unificado, dos servers, API probada. | Sin API no se ve nada. El puerto fue trampa en las dos pruebas 2026sem1. |
| 10–30 | GET + render: `useEffect(…, [])` que llama al service, loading/error, `map` de tarjetas por columna/lista. | Es lo que hace que "se vea todo". |
| 30–40 | Rutas que faltan, `Link` a `/x/new`, `<Navigate>` para `/`. | 10 líneas, puntos fáciles. |
| 40–65 | Crear: form controlado con un `handleChange` por `[name]`, validación, `await crear()`, actualizar lista o `recargar()`, `navigate` **después**. | Probar de verdad contra json-server. |
| 65–85 | Editar: misma página, `Boolean(id)`, `useEffect([id])` que precarga, PUT **completo**. | Si el crear anda, son 20 líneas. |
| 85–105 | Context: Provider (~25 líneas) envolviendo `<App>` en `main.jsx`, reemplazar el `const x = []` por `useContext`. | Toca varios archivos, por eso al final. |
| 105–120 | Checklist + PR. | |

Diferencias por parcial: en **BarApp** crear primero `BE/package.json` y usar
`ProductosPage`/`NuevoProductoPage` (vienen hechas) como modelo; `utils/cuentas.js` ya trae
los totales. En **Trello** la plantilla trae casi todo el formulario: revisar, no reescribir.

### 2025 — app desde casi cero con mock API

| Min | Qué |
|---|---|
| 0–10 | Setup. `mock-routes.js` + un país en JSON (objetos vs arrays). |
| 10–20 | `services/api.js` con `obtenerJson(url)` genérico + una función por endpoint. |
| 20–35 | `App.jsx` con **todas** las rutas apuntando a componentes vacíos (`<h1>Ruta X</h1>`). |
| 35–60 | Lista principal (`useEffect` + `map` + `Link`). Si la lista devuelve solo códigos → `ItemPais` con fetch propio. |
| 60–80 | Detalle (`useParams`, `[cca3]`, `Object.keys` para objetos, volver). |
| 80–105 | Rutas derivadas **reutilizando** la lista (`props.titulo` + `props.url` + envoltorios con `useParams`). Juegos: `utils/azar.js` + estado en Context. |
| 105–120 | Recargar en cada ruta, consola limpia, estilos mínimos, PR. |

Diferencias: en el de **9 rutas**, hacer `ListaDePaises` genérico desde el principio
(generalizar después cuesta más). En la **trivia**, el puntaje primero con `useState` local y
recién después moverlo a Context. En el **viaje por fronteras**, Context +
`useEffect([cca3])` antes que las reglas del juego.

---

## 3. Checklist final antes de entregar

**Todos los formatos**
- [ ] `npm run lint` → 0 errores / 0 warnings (`semi`, variables sin usar, deps de hooks).
- [ ] Consola del navegador sin errores rojos (los avisos de *future flags* de React Router no cuentan).
- [ ] **F5 en cada ruta**, incluida una con parámetro y una con query (`/countries?q=uru&sort=population`). Si una ruta necesita estado previo (juego sin dificultad), redirige a `/` sin explotar.
- [ ] Escribir las URLs **a mano** y también navegar con los botones/links.
- [ ] Casos borde: código inexistente (`/countries/XYZ` → 404 prolijo), datos `null`/vacíos (sin capital, sin fronteras, población 0), lista sin resultados.
- [ ] Navegar entre dos valores del mismo parámetro (limítrofe → limítrofe, `/currencies/EUR` → `/USD`): los datos cambian.
- [ ] Crear / editar / borrar → se ve **sin recargar** (y en la base: `data.json` o `db.json`). Validación: enviar vacío no crea nada.
- [ ] Lo global (Context: favoritos, progreso, total, puntaje) cambia solo, en todas las pantallas.
- [ ] No quedan `TODO`: `grep -rn TODO web/src` (o `src/`).
- [ ] Cada componente nuevo en su carpeta con su `.module.css` (si la plantilla/enunciado lo usa).
- [ ] Entrega: `git add -A && git commit -m "Prueba 2" && git push` → en GitHub, abrir el **Pull Request** (en tu fork / hacia el repo original, según diga el enunciado). La entrega **es** el PR.
- [ ] Si algo quedó a medias, que funcione "hasta donde llegó" sin romper el resto.

**26s2:** restaurar datos de prueba si querés: `git checkout web/data/db/data.json`.
**26s1:** editar no borra campos (PUT completo); `curl` del recurso muestra lo creado.

---

## 4. Trampas (todas, deduplicadas)

Columna **F** = formato donde aplica: **todos**, **26s2**, **viejo** (26s1 y/o 2025).
Las específicas de un solo parcial están en su `APUNTES-PARCIAL.md`.

### 4.1 Arranque y entorno → [README](README.md#cómo-correr-cada-cosa), [tema 1](clase/01-anatomia-del-proyecto.md)

| Trampa | Síntoma | Arreglo | F |
|---|---|---|---|
| `npm install` avisa `allow-scripts … esbuild` | Vite no arranca | `npm approve-scripts esbuild --yes && npm rebuild esbuild` | todos |
| Sin internet en el examen | `npm install` falla | `npm install --prefer-offline`; si no, `cp -R` el `node_modules` de un simulacro | 26s2 |
| Agregar/actualizar dependencias (p. ej. `react-router-dom` v7 en el `package.json` de la raíz) | Dos routers, contextos distintos, errores raros | **No tocar dependencias** ni archivos fuera de `web/src` | 26s2 |
| La mock API solo existe con `npm start` | `/api/...` devuelve el `index.html` en `vite preview` | Probar siempre con `npm start` | 26s2, 2025 |
| Cambié `vite.config.js` y no toma | — | Reiniciar el servidor | todos |
| Puerto ocupado | `EADDRINUSE` / Vite pasa a 5174 | `lsof -i :3000` → `kill <PID>`, o usar otro puerto | todos |
| Puerto del service ≠ puerto del script ≠ README (3000 vs 3001) | `Failed to fetch`, lista vacía | El real es el del **script** del backend; unificar en el service | viejo |
| `BE/` sin `package.json` | `cd BE && npm install` falla | Crear `BE/package.json` con `json-server db.json --port 3001` | viejo |
| La base se modifica de verdad | Datos de prueba "sucios" | 26s2: `git checkout web/data/db/data.json`; json-server: copia de `db.json` antes | todos |
| Colección Bruno/Postman desactualizada | Campos con otros nombres | Mandan el README + `db.json` / `mock-routes.js` | todos |
| Import con mayúsculas distintas (`Navbar.module.css` vs `NavBar.module.css`) | Anda en Mac, `Failed to resolve import` en Linux | Nombre idéntico letra por letra | todos |

### 4.2 JavaScript → [tema 2](clase/02-javascript-para-react.md)

| Trampa | Arreglo | F |
|---|---|---|
| `lista.sort()` muta el array del estado/hook | `[...lista].sort(...)` | todos |
| `[10, 9, 1].sort()` ordena como texto | Pasar comparador `(a, b) => a - b` | todos |
| `'2' + 3 === '23'` (inputs, `useParams`, selects son strings) | `Number(...)` antes de sumar/comparar | todos |
| `valor \|\| '—'` convierte el `0` en guion | `valor ?? '—'` | todos |
| Datos `null` (`area`, `capital`) → `b.area - a.area` raro, `normalizeText(null)` rompe | Comparador que manda `null` al final; `capital ?? ''` | 26s2 |
| `currencies`, `languages`, `name.nativeName` son **objetos** → `.map is not a function` | `Object.keys(obj)` + `for...of` | 2025 |
| Campos vacíos (`capital: []`, país sin `map`, `assignee` undefined) | `if` + valor por defecto (`'—'`) | todos |
| `sort(() => Math.random() - 0.5)` no mezcla bien y muta | Fisher-Yates sobre una copia | todos |
| `localStorage.getItem` da `null` la 1ª vez; `JSON.parse('')` explota | Chequear `null` antes de parsear | todos |

### 4.3 Componentes, listas y eventos → temas [3](clase/03-componentes-y-jsx.md), [5](clase/05-listas-y-condicionales.md), [6](clase/06-eventos.md)

| Trampa | Síntoma | Arreglo | F |
|---|---|---|---|
| Dos elementos raíz / `class` / componente en minúscula | `Adjacent JSX elements…` / `Invalid DOM property` / no se ve | `<>…</>`, `className`, Mayúscula | todos |
| `key` faltante o por índice en lista que cambia | Warning `unique "key"`; filas mezcladas al borrar | `key={item.id}` (código, id) | todos |
| `{lista.length && <p/>}` | Aparece un `0` | `lista.length > 0 && …` o ternario | todos |
| `{country.languages}` (array de objetos) | `Objects are not valid as a React child` | `.map((l) => l.name).join(', ')` | todos |
| `map` con llaves sin `return` | Lista vacía sin error | `return` o paréntesis | todos |
| `onClick={f()}` | Se ejecuta al dibujar / `Too many re-renders` | `onClick={f}` o `onClick={() => f(id)}` | todos |
| `<button>` dentro de `<form>` que no debía enviar | Dispara el submit | `type="button"` | todos |

### 4.4 Estado → [tema 7](clase/07-usestate.md), [tema 9](clase/09-estado-derivado.md)

| Trampa | Arreglo | F |
|---|---|---|
| Mutar el estado (`push`, `obj.x = …`) → no redibuja | `[...lista, nuevo]`, `filter`, `map` con `{ ...obj }` | todos |
| Leer el valor recién seteado en la misma función (es la "foto" vieja) | Calcular en una variable, setear y decidir con esa (`descontarError` devuelve el valor) | todos |
| `setX(x + 1)` dentro de `setInterval` se clava en 1 | Forma funcional `setX((prev) => prev + 1)` | todos |
| Hook dentro de `if`/`for` o después de un `return` temprano | `Rendered more hooks…` / lint *called conditionally* → todos los hooks arriba | todos |
| `window.location.reload()` para "jugar de nuevo" | Resetear con estado (desmontar el componente, `key`) | todos |
| Lista filtrada/total en `useState` + `useEffect` | Calcular en el render (`const`) | todos |

### 4.5 Formularios → [tema 8](clase/08-formularios-controlados.md)

| Trampa | Arreglo | F |
|---|---|---|
| Sin `event.preventDefault()` → la página recarga y se pierde todo | Primera línea del `onSubmit` | todos |
| `value` sin `onChange` → input congelado | Siempre juntos | todos |
| `useState()` sin inicial → *uncontrolled to controlled* | `useState('')` | todos |
| Inputs numéricos llegan como string al backend | `Number(form.cantidad)` antes de enviar | todos |
| Limpiar/refrescar antes del `await` → la lista vuelve sin el nuevo | `await crear()` → limpiar → `refetch()` | todos |
| Doble clic crea dos | `disabled={!name.trim() \|\| isCreating}` | todos |

### 4.6 `useEffect` → [tema 10](clase/10-useeffect.md)

| Trampa | Síntoma | Arreglo | F |
|---|---|---|---|
| `useEffect(async () => …)` | Warning / *destroy is not a function* | Función async **adentro** y llamarla | todos |
| Efecto sin array con un `setX` | Bucle infinito, miles de pedidos en Network | `[]` o las dependencias correctas | todos |
| `[]` cuando el efecto usa un parámetro de la URL o una prop | `/x/URY` → `/x/ARG` sigue mostrando URY | `[code]`, `[id]`, `[props.url]` | todos |
| Apagar `exhaustive-deps` con `eslint-disable` | Bug escondido | Agregar la dependencia (función → `useCallback` o adentro del efecto) | todos |
| StrictMode monta dos veces en desarrollo | Dos fetch, timer "de a 2" | Normal; con limpieza correcta no molesta | viejo |

### 4.7 API → [tema 11](clase/11-api-fetch.md)

| Trampa | Arreglo | F |
|---|---|---|
| Asumir que crear es POST | Mirar `mock-routes.js`: en 26s2 crear es **PUT** | 26s2 |
| `JSON.stringify` del body con `fetchJSON` → doble string → **400** | `body` como **objeto** | 26s2 |
| Distinguir 404 de otro error | `error.message.includes(' 404 ')` | 26s2 |
| Crear el registro al **empezar** sin datos (partida sin `history`) | Crearlo al **terminar**, con todo | 26s2 |
| La lista no se entera sola después de crear | `refetch()` o actualizar el estado con lo que devolvió la API | todos |
| Ids: `"1"` (string) vs `1` → `find` no encuentra | Mirar los datos; comparar mismo tipo (json-server 1.x y `useParams` = string) | todos |
| `fetch` a pelo **no** lanza en 404/500 → explota después (`pais.name` de `{error}`) | `if (!response.ok) throw new Error(...)` | viejo |
| `PUT` con objeto incompleto → se pierden campos | `{ ...original, campo: nuevo }` (o `PATCH`) | viejo |
| `.json()` sobre un 204 | `Unexpected end of JSON input` → `if (status === 204) return null` | viejo |
| `+` en query string (`UTC+01:00`) se lee como espacio → `[]`; espacios en params (`Antarctic Ocean`) | `encodeURIComponent` al armar URL y `Link` | todos |
| La lista devuelve solo códigos | Componente por ítem con fetch propio / buscar en la lista completa | 2025 |
| CORS `blocked by CORS policy` | Solo APIs externas; json-server y el mock lo permiten | viejo |

### 4.8 Router → ([tema 13](clase/13-router-rutas.md), [tema 14](clase/14-useparams-usenavigate.md), [tema 15](clase/15-usesearchparams.md)) · [CHULETA §1-2](CHULETA-EXAMEN.md#1-router-react-router-dom-v6)

| Trampa | Síntoma | Arreglo | F |
|---|---|---|---|
| `import { useLocation } from 'react'` | No existe | Hooks de router desde `'react-router-dom'` | todos |
| `<a href>` para navegar | Recarga todo: se pierden estado y Context | `<Link>` / `useNavigate` | todos |
| Rutas con otros nombres (`/PlayersSelection`, `/Play`) | No cumple el enunciado | Paths exactos del README | todos |
| `navigate()` antes del `await` del guardado | Vuelve a la lista sin el nuevo / no se entera del error | `await …` → (`recargar()`) → `navigate()` | todos |
| `<Navigate>` sin `replace` | "Atrás" entra en bucle | `<Navigate to="/x" replace />` | todos |
| `Link`/`useParams` fuera del `BrowserRouter` | `useHref() may be used only in the context of a <Router>` | Mover el router arriba (o el componente adentro) | todos |
| Dos `BrowserRouter` (en `main.jsx` y en `App.jsx`) | Comportamiento raro | Mirar `main.jsx` antes de escribir rutas | viejo |
| `element={Home}` | Pantalla en blanco | `element={<Home />}` | todos |
| Nombre del parámetro distinto (`:cca3` vs `parametros.cca2`) | `undefined` | Mismo nombre en `path` y en `useParams` | todos |
| `useParams` en `App.jsx` (o en un componente que no renderiza la `<Route>`) para armar una URL | No hay parámetro | Componente envoltorio que lee `useParams` y pasa la URL por props | todos |
| F5 en una ruta que necesita estado previo | Explota | Guardia `if (!x) return <Navigate to="/" replace />` después de los hooks | todos |
| `setSearchParams({ q })` borra los demás params | Se pierde `sort` | Copiar `new URLSearchParams(prev)` y `set`/`delete` | 26s2 |
| Pasar datos entre páginas con `navigate(…, { state })` | Se pierden al recargar | Estado en la página o en la URL | 26s2 |
| `/` y `/cuentas` con el mismo componente | `NavLink` nunca activo | `/` → `<Navigate to="/cuentas" replace />` | viejo |

### 4.9 Context → ([tema 16](clase/16-context.md)) · [CHULETA §7](CHULETA-EXAMEN.md#7-context-estado-compartido-entre-páginas)

| Trampa | Síntoma | Arreglo | F |
|---|---|---|---|
| Provider **dentro** del componente que consume | `useContext` da el default (`null` → *Cannot read properties of null*) | Envolver `<App>` en `main.jsx` o el router en `App` | todos |
| Estado que se pierde al cambiar de ruta (puntaje a 0) | El componente se desmonta | Moverlo a un Context por encima de `<Routes>` | todos |
| Dos copias de la misma lista (cada componente hace su fetch) | La barra/contador no cambia al crear | Una sola fuente de verdad en el Provider | todos |
| Contexto + Provider en el mismo `.jsx` | Lint `react-refresh/only-export-components` | Contexto + hook en `XContext.js`, Provider en `XProvider.jsx` | 26s2 |

### 4.10 Lint y CSS → ([tema 18](clase/18-css-modules-y-lint.md)) · [CHULETA §8-9](CHULETA-EXAMEN.md#9-lint-errores-típicos-y-arreglo)

| Trampa | Arreglo | F |
|---|---|---|
| `Missing semicolon` (regla `semi: always`) | `;` en todas las sentencias | 26s2 |
| `'x' is defined but never used` | Borrar el import/variable sobrante | todos |
| `className="card"` con CSS Modules | `className={styles.card}` (Vite renombra las clases) | todos |
| `.column-header` en un módulo | camelCase (`styles.columnHeader`) | todos |
| Avisos *React Router Future Flag* en consola | No son errores; en 26s2 se silencian con `future={{ v7_startTransition: true, v7_relativeSplatPath: true }}` | todos |
