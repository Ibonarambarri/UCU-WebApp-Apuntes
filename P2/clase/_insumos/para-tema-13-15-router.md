# Insumo para temas 13, 14 y 15 — React Router

> Material destilado de los apuntes viejos (apuntes/_archivo/03-REACT-ROUTER.md) y del simulacro 2026sem2 matutino para integrar al escribir los temas. No duplica CHULETA-EXAMEN.md ni los temas 01-11.

Ya en la chuleta (no repetir): esqueleto `BrowserRouter`+`Layout`+`Outlet`+`index`+`*`, tabla "Quiero… / Uso",
`updateParam` con `useSearchParams`, `Link state` + `useLocation` → [CHULETA §1-§2](../../CHULETA-EXAMEN.md).
Ya en temas: `useEffect([code])` misma ruta/otro parámetro → [tema 10 §10.5](../10-useeffect.md); `encodeURIComponent` → [tema 11 §11.7](../11-api-fetch.md).

Versiones: las plantillas traen **v6** (2025sem2, BarApp, 2026sem2) o v7 (Trello 2026sem1). Para todo lo que se usa
(`BrowserRouter`, `Routes`, `Route`, `Link`, `NavLink`, `useParams`, `useNavigate`, `Navigate`, `Outlet`) son idénticas.
⚠️ **No agregar ni actualizar `react-router-dom` en el `package.json`** (dos versiones = contextos distintos, errores raros).

---

## TEMA 13 — `Routes`, `Route`, `Link`, `Outlet`, `Navigate`

### 13.1 Dónde va el `BrowserRouter` (uno solo)

| Forma | Dónde | Plantillas |
|---|---|---|
| A | en `App.jsx`, envolviendo `<Routes>` | TA16-18, UT5, 2025sem2, Trello, 2026sem2 |
| B | en `main.jsx`, envolviendo `<App />` (App solo tiene `<Routes>`) | BarApp 2026sem1 |

⚠️ Antes de escribir rutas **mirá `main.jsx`**. Si ya hay router y ponés otro en App → dos routers anidados, comportamiento raro.
Si no hay ninguno y usás `<Link>` → *"useHref() may be used only in the context of a <Router> component"*.
Ver `parciales/2026sem1-simulacro-vespertino/src/main.jsx` vs `Ejers/UT4/TA16-router-basico/src/App.jsx`.

### 13.2 `Route`: `element={<X />}`, no `element={X}`

```jsx
<Route path="/countries" element={<ListaDePaises titulo="All countries" url="/api/countries" />} />
```
- `element` recibe **JSX** (con `< />`), y se le pueden pasar props. `element={Home}` → pantalla en blanco sin error.
  `component={X}` era v5.
- El mismo componente en dos rutas vale (ver 14.4).
- `Routes` elige la ruta **más específica** (`/end` gana a `/:cca3`); igual conviene poner la fija primero por claridad
  (`parciales/2025sem2-simulacro-vespertino/web/src/components/App.jsx`).
- Ruta `*` = 404; la página suele tener un `Link` a `/` (`Ejers/UT4/TA16-router-basico/src/paginas/NoEncontrada.jsx`).

### 13.3 `Link` vs `<a href>`

| `<a href="/x">` | `<Link to="/x">` |
|---|---|
| Pide la página al servidor → **recarga todo** | Solo cambia la URL; `Routes` redibuja |
| Se pierde **todo** el estado y el **Context** (puntaje, favoritos, tema) | El Provider sigue vivo |
| Para enlaces **externos** sí | Solo rutas internas |

Trivia 2025: si el link al país fuera `<a>`, el puntaje volvía a 0.
`Link` es un `<a>` por debajo: acepta `className` y se estiliza igual (botón que navega:
`parciales/simulacro-prueba2-2026sem2-vespertino/web/src/components/Button/LinkButton.jsx`).

### 13.4 `NavLink`: marcar el enlace activo

`className` puede ser una **función** que recibe `{ isActive }`:
```jsx
<NavLink to="/cuentas" className={({ isActive }) => (isActive ? styles.active : '')}>Cuentas</NavLink>
```
Ver `Ejers/UT4/TA16-router-basico/src/componentes/BarraNavegacion.jsx` (versión con `function` y CSS global),
`parciales/2026sem1-simulacro-vespertino/src/components/NavBar/NavBar.jsx` (CSS Modules).

⚠️ Trampa BarApp: la página vivía en `/` y el `NavLink` apuntaba a `/cuentas` → nunca se marcaba activo.
Solución: `/` redirige a `/cuentas` (13.6) y la página vive en **una** sola ruta.

### 13.5 Lo que se ve en todas las páginas

Todo lo que está **dentro del router pero fuera de `<Routes>`** (o en el `Layout` con `<Outlet />`) se dibuja siempre:
navbar, selector de tema, total de recaudación. Puede usar `Link` porque está dentro del router.
Ver `parciales/2026sem1-prueba2-vespertino/src/App.jsx` (`<Navbar />`), `Ejers/UT5/UT5.1.2-paises-dark-mode/src/App.jsx`,
`parciales/simulacro-prueba2-2026sem2-matutino/web/src/components/Layout/Layout.jsx` (con `Outlet`).

### 13.6 `<Navigate>`: redirigir desde el render

```jsx
<Route path="/" element={<Navigate to="/countries" replace />} />      // raíz → lista
if (contexto.dificultad === '') return <Navigate to="/" replace />;    // guardia (recargó en /URY)
```
- **`replace`**: reemplaza la entrada del historial. Sin él, "atrás" vuelve a `/` que redirige otra vez → **bucle**.
- ⚠️ El `return <Navigate />` va **después de todos los hooks** (si no: *"Rendered more hooks than during the previous render"*).
Ver `Ejers/UT5/UT5.1.2-paises-dark-mode/src/App.jsx`, `parciales/2025sem2-simulacro-vespertino/web/src/components/PaginaPais.jsx`.

### 13.7 Rutas protegidas (TA18)

```jsx
function RutaProtegida({ children }) {
  const contexto = useContext(ContextoAutenticacion);
  if (!contexto.estaLogueado) return <Navigate to="/" replace />;
  return children;
}
<Route path="/perfil" element={<RutaProtegida><Perfil /></RutaProtegida>} />
```
Variante con `<Outlet />`: ruta padre **sin path** que envuelve varias privadas:
```jsx
<Route element={<RutaProtegida />}>        {/* RutaProtegida devuelve <Outlet /> en vez de children */}
  <Route path="/perfil" element={<Perfil />} />
  <Route path="/panel" element={<Panel />} />
</Route>
```
El Provider de autenticación va **por fuera** del router (lo leen la barra, las páginas y el guardia).
Ver `Ejers/UT4/TA18-rutas-protegidas/src/componentes/RutaProtegida.jsx`, `.../src/App.jsx`.

---

## TEMA 14 — `useParams` y `useNavigate`

### 14.1 `useParams` devuelve SIEMPRE strings

```jsx
// Route: path="/producto/:id"   → el nombre de la clave es el que pusiste después de ":"
const { id } = useParams();                                  // "2"
productos.find((p) => p.id === Number(id));                  // ids NÚMERO (array hardcodeado, TA17)
tasks.find((t) => t.id === id);                              // ids STRING (json-server 1.x, tatetí "1")
```
Regla: **mirá los datos** (`db.json` / `data.json`) y compará con el mismo tipo.
⚠️ `Number("QqR8tAYZJTw")` = `NaN` → nunca matchea (ids generados por json-server).
Ver `Ejers/UT4/TA17-router-params/src/paginas/DetalleProducto.jsx`.

⚠️ `parametros.id` es `undefined` si el nombre no coincide con el `path` (`:cca3` vs `parametros.cca2`).

### 14.2 `useParams` solo dentro del componente que renderiza la `Route` → envoltorios

En 2025 vespertino (9 rutas) una `ListaDePaises` genérica recibe `titulo` + `url`. `App.jsx` no puede leer el
parámetro, así que cada ruta con parámetro tiene un **envoltorio** de ~5 líneas:
```jsx
function PaisesPorZonaHoraria() {
  const { timezone } = useParams();                                          // ya DECODIFICADO: "UTC+01:00"
  const url = '/api/countries?timezone=' + encodeURIComponent(timezone);     // re-codificar para la API
  return <ListaDePaises titulo={'Countries with timezone ' + timezone} url={url} />;
}
```
Parámetros con caracteres raros: **codificar en el `Link`** (`'/timezones/' + encodeURIComponent(zona)`),
`useParams` ya lo devuelve decodificado, y **volver a codificar** al meterlo en un query string.
Ver `parciales/2025sem2-parcial2-vespertino/web/src/components/PaisesPorZonaHoraria.jsx`, `.../ListaDeOpciones.jsx`.

### 14.3 `useNavigate`: navegar desde código

```jsx
const navigate = useNavigate();           // hook: arriba, nunca en un if
navigate('/players');                     // ir a una ruta
navigate(-1);                             // "atrás"
navigate('/x', { replace: true });        // sin dejar rastro en el historial
```
⚠️ Después de guardar: **`await` primero, `navigate` después**:
```jsx
await cuentasApi.crear(cuenta);   // 1) guardar
await recargar();                 // 2) refrescar lo global
navigate('/cuentas');             // 3) recién ahora
```
Si va antes, se navega sin haber guardado y si el POST falla el usuario no se entera.

| `<Link>` | `useNavigate()` |
|---|---|
| En el JSX; el usuario hace clic | En una función, cuando **vos** decidís (tras un `await`, tras validar, al azar) |

Juego al azar: `navigate('/' + elegirAlAzar(codigos))` (2025 vespertino), `navigate(`/countries/${random.code}`)` (variante V8).

### 14.4 Una página para crear y editar

```jsx
<Route path="/tasks/new"      element={<TaskFormPage onSave={handleSave} />} />
<Route path="/tasks/:id/edit" element={<TaskFormPage onSave={handleSave} />} />
```
`const { id } = useParams(); const isEditing = Boolean(id);` → si edita: `useEffect([id])` que precarga el form;
al enviar: PUT o POST y luego `navigate('/')`. (El formulario en sí → [tema 8 §8.5](../08-formularios-controlados.md).)
Ver `parciales/2026sem1-prueba2-vespertino/src/pages/TaskFormPage/TaskFormPage.jsx`.

---

## TEMA 15 — `useSearchParams` (lo que no está en la chuleta)

- Todo lo que viene de la URL es **string o `null`** → default con `??` y `Number(...)` para números:
  `Math.max(1, Number(searchParams.get('page')) || 1)`.
- **Validar valores raros**: `?sort=xyz` → usar el default:
  `const sort = Object.hasOwn(SORT_OPTIONS, sortParam ?? '') ? sortParam : DEFAULT_SORT;`
- `setSearchParams({ q: 'uru' })` **borra** los demás parámetros → por eso `updateParam` copia con `new URLSearchParams(prev)`.
- `<Link to="?region=Asia">` también cambia solo el query… pero **borra los otros**. Para conservarlos, `updateParam`.
- `{ replace: true }`: sin él, cada tecla del buscador es una entrada del historial ("atrás" deshace letra por letra).
- Paginación: al cambiar la búsqueda, volver a página 1 → en `updateParam`, `if (name !== 'page') next.delete('page')`.
- Filtro dependiente (subregión): al cambiar la región, `next.delete('subregion')`.
- Ventaja sobre `useState`: F5 y compartir el link conservan búsqueda y orden. La lista visible se **deriva** (tema 9).
Ver `parciales/simulacro-prueba2-2026sem2-matutino/web/src/components/PageCountryList/PageCountryList.jsx`
y su APUNTES-PARCIAL §4 (V1-V4) para variantes.

---

## Rutas de cada parcial (para ejemplos)

| Parcial | Rutas | Qué ilustra |
|---|---|---|
| 2026sem2 mat. (países) | `/countries`, `/countries/:code`, `*` (Layout + `index` → Navigate) | query params, detalle, limítrofes misma ruta |
| 2026sem2 vesp. (tatetí) | `/`, `/play`, `/players`, `*` → Navigate | Layout + Outlet, LinkButton |
| 2026sem1 Trello | `/`, `/tasks/new`, `/tasks/:id/edit` | mismo componente crear/editar |
| 2026sem1 BarApp | `/` → `/cuentas`, `/cuentas`, `/cuentas/nueva`, `/productos`, `/productos/nuevo` | router en main, NavLink activo |
| 2025 mat. | `/`, `/country/:cca3` | detalle + botón volver |
| 2025 vesp. | `/`, `/countries(/:cca3)`, `/currencies(/:currencyCode)`, `/languages(/:languageCode)`, `/timezones(/:timezone)` | 9 rutas, 2 componentes reutilizables + envoltorios |
| 2025 sim. mat. | `/`, `/country/:cca3` | Context sobrevive a navegar |
| 2025 sim. vesp. | `/`, `/end`, `/:cca3` | guardia `<Navigate>`, `navigate('/end')` |

## Errores clásicos del router

| Síntoma | Causa | Arreglo |
|---|---|---|
| `useHref()/useNavigate() may be used only in the context of a <Router>` | `Link`/hook fuera del router | Router más arriba (o componente adentro) |
| `useParams()` da `{}` / `undefined` | nombre distinto en `path`, o el componente no es el de la `Route` | mismo nombre; envoltorio |
| Página no cambia de `/x/A` a `/x/B` | `useEffect(…, [])` | `[param]` (tema 10) |
| `find` no encuentra | `"2" === 2` | mismo tipo que los datos |
| "Atrás" en bucle | redirección sin `replace` | `<Navigate replace />` |
| NavLink nunca activo | página en `/`, link a `/cuentas` | `/` redirige |
| Se recarga todo y se pierde el estado | `<a href>` / `window.location` | `<Link>` / `navigate` |
| `Rendered more hooks…` | `return <Navigate />` antes de un hook | hooks arriba |
| Pantalla en blanco sin error | `element={Home}` | `element={<Home />}` |
| `import { useLocation } from 'react'` | hooks de router vienen de otro paquete | `from 'react-router-dom'` |
| Warning "React Router Future Flag…" | v6 avisando de v7 | ignorar o `future={{ v7_startTransition: true, v7_relativeSplatPath: true }}` |
