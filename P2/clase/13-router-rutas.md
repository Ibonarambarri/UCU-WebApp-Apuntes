# Tema 13 — React Router: `Routes`, `Route`, `Link`, `Outlet`, `Navigate`

## 13.1 Qué resuelve

La app es **una sola página HTML**. React Router **mira la URL y decide qué componente dibujar**,
sin pedirle otra página al servidor (y con "atrás" y links compartibles funcionando).
```
/countries        →  <PageCountryList />
/countries/URY    →  <PageCountry />   (code = 'URY')
/cualquier-cosa   →  <PageNotFound />
```

## 13.2 Las 3 piezas

```jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';

<BrowserRouter>                                               {/* activa el router (UNO solo) */}
  <Routes>                                                    {/* elige UNA */}
    <Route path="/countries" element={<PageCountryList />} />
    <Route path="/countries/:code" element={<PageCountry />} />   {/* :code = parámetro (tema 14) */}
    <Route path="*" element={<PageNotFound />} />                 {/* 404 */}
  </Routes>
</BrowserRouter>
```
- **`BrowserRouter` uno solo.** ⚠️ Mirá `main.jsx` antes: en BarApp (2026sem1) estaba ahí, no en App.

  | Forma | Dónde | Plantillas |
  |---|---|---|
  | A | en `App.jsx`, envolviendo `<Routes>` | TA16-18, UT5, 2025sem2, Trello, **2026sem2** |
  | B | en `main.jsx`, envolviendo `<App />` | BarApp 2026sem1 |
- **`element={<X />}` con `< />`**. `element={X}` → pantalla en blanco **sin error**. (`component={X}` era v5.)
  Se le pueden pasar props: `element={<ListaDePaises titulo="Todos" url="/api/countries" />}` (2025: el mismo componente en 9 rutas).
- `Routes` elige la **más específica** (`/end` gana a `/:cca3`); igual conviene poner la fija primero.
- `*` = 404; la página suele tener un `Link` a `/`.

## 13.3 `Link` vs `<a href>`

| `<a href="/x">` | `<Link to="/x">` |
|---|---|
| Pide la página al servidor → **recarga todo** | Solo cambia la URL; `Routes` redibuja |
| Se pierde **todo el estado y el Context** | Todo sigue vivo |
| Para links **externos** | Rutas **internas** |

Trivia 2025: con `<a>` el puntaje volvía a 0. Matutino 2026: "limítrofes navegables **sin recargar**" = `Link`.
`Link` es un `<a>` por debajo: acepta `className` (botón que navega:
`parciales/simulacro-prueba2-2026sem2-vespertino/web/src/components/Button/LinkButton.jsx`).

## 13.4 `NavLink`: enlace activo

```jsx
<NavLink to="/players" className={({ isActive }) => (isActive ? styles.active : '')}>Players</NavLink>
```
`className` recibe una **función** con `{ isActive }`.
⚠️ Trampa BarApp: la página vivía en `/` y el NavLink apuntaba a `/cuentas` → nunca activo.
Solución: `/` redirige a `/cuentas` y la página vive en **una** sola ruta.

## 13.5 Rutas anidadas + `Outlet` (plantillas 2026sem2)

```jsx
<Routes>
  <Route path="/" element={<Layout />}>                             {/* padre: el marco */}
    <Route index element={<Navigate to="/countries" replace />} />  {/* "/" exacto */}
    <Route path="countries" element={<PageCountryList />} />        {/* hijas SIN "/" inicial */}
    <Route path="countries/:code" element={<PageCountry />} />
    <Route path="*" element={<PageNotFound />} />
  </Route>
</Routes>
```
```jsx
function Layout() {
  return (
    <>
      <nav>🌎 Country Explorer · ★ Favoritos</nav>   {/* siempre */}
      <main><Outlet /></main>                         {/* ← la página hija que coincida */}
    </>
  );
}
```
- `<Outlet />` = el **hueco** donde va la hija.
- Hijas con path **relativo** (`countries`, no `/countries`).
- **`index`** = la hija de la URL **exacta** del padre.
- La plantilla lo trae "en línea": `element={<div className={styles.app}><Outlet /></div>}`.

Alternativa: lo que esté **dentro del router pero fuera de `<Routes>`** también se ve siempre
(Trello 2026sem1: `<Navbar />` arriba de `<Routes>`). Puede usar `Link` porque está dentro del router.

## 13.6 `<Navigate>`: redirigir al dibujar

```jsx
<Route index element={<Navigate to="/countries" replace />} />   // "/" → lista
if (!dificultad) return <Navigate to="/" replace />;             // guardia (2025 sim. vesp.)
```
- **`replace`**: sin él, "atrás" vuelve a `/`, que redirige otra vez → **bucle**.
- ⚠️ El `return <Navigate />` va **después de todos los hooks** (tema 7.6).

## 13.7 Rutas protegidas (TA18, ejercicios)

```jsx
function RutaProtegida({ children }) {
  const { estaLogueado } = useContext(ContextoAuth);   // Context → tema 16
  if (!estaLogueado) return <Navigate to="/" replace />;
  return children;
}
<Route path="/perfil" element={<RutaProtegida><Perfil /></RutaProtegida>} />
```
Variante: ruta padre **sin path** cuyo componente devuelve `<Outlet />` o `<Navigate>` y envuelve varias privadas.
El Provider de auth va **por fuera** del router.

## 13.8 Rutas de cada parcial

| Parcial | Rutas | Qué ilustra |
|---|---|---|
| 2026sem2 mat. (países) | `/countries`, `/countries/:code`, `*` (Layout + `index` → Navigate) | query params, detalle, limítrofes |
| 2026sem2 vesp. (tatetí) | `/`, `/play`, `/players`, `*` → Navigate | Layout + Outlet, LinkButton |
| 2026sem1 Trello | `/`, `/tasks/new`, `/tasks/:id/edit` | mismo componente crear/editar |
| 2026sem1 BarApp | `/` → `/cuentas`, `/cuentas`, `/cuentas/nueva`, `/productos`, `/productos/nuevo` | router en main, NavLink |
| 2025 mat. | `/`, `/country/:cca3` | detalle + volver |
| 2025 vesp. | `/`, `/countries(/:cca3)`, `/currencies(/:code)`, `/languages(/:code)`, `/timezones(/:tz)` | 9 rutas, componentes reutilizables |
| 2025 sim. mat. | `/`, `/country/:cca3` | Context sobrevive a navegar |
| 2025 sim. vesp. | `/`, `/end`, `/:cca3` | guardia `<Navigate>` |

## 13.9 Errores

| Síntoma | Causa → arreglo |
|---|---|
| Pantalla en blanco sin error | `element={Home}` → `element={<Home />}` |
| *"useHref() may be used only in the context of a <Router>"* | `Link`/hook fuera del router → subirlo |
| Se recarga todo y se pierde el estado | `<a href>` / `window.location` → `<Link>` / `navigate` |
| "Atrás" en bucle | `<Navigate>` sin `replace` |
| NavLink nunca activo | página en `/`, link a `/cuentas` → `/` redirige |
| `import { Link } from 'react'` | viene de **`'react-router-dom'`** |
| Warning *"React Router Future Flag…"* | aviso de v7: `future={{ v7_startTransition: true, v7_relativeSplatPath: true }}` |

⚠️ **No agregar ni actualizar `react-router-dom`** en ningún `package.json` (el compañero del tatetí metió v7 en la raíz).

📂 **Verlo funcionando:** `Ejers/UT4/TA16-router-basico/src/App.jsx` (+ `componentes/BarraNavegacion.jsx`, NavLink) ·
`parciales/simulacro-prueba2-2026sem2-matutino/web/src/components/App/App.jsx` + `.../Layout/Layout.jsx` ·
`Ejers/UT4/TA18-rutas-protegidas/src/componentes/RutaProtegida.jsx`

---

## ❓ Repaso

**Pregunta:** `/` inicio, `/players` lista, `/players/:id` detalle, barra "TicTacToe" en todas las
páginas, cualquier otra URL → redirigir al inicio. `<Routes>` con Layout + Outlet.

**Respuesta:**
```jsx
<Routes>
  <Route path="/" element={<Layout />}>
    <Route index element={<PageHome />} />
    <Route path="players" element={<PagePlayers />} />
    <Route path="players/:id" element={<PagePlayer />} />
    <Route path="*" element={<Navigate to="/" replace />} />
  </Route>
</Routes>
```
`index` (no `path="/"`), hijas sin `/`, `*` con `Navigate replace` (piden redirigir, no 404).
