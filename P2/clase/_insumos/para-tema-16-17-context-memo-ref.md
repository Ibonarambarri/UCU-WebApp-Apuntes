# Insumo para temas 16 y 17 — Context, `useMemo`, `useCallback`, `useRef`

> Material destilado de los apuntes viejos (apuntes/_archivo/04-CONTEXT.md) y de los simulacros 2026sem2 para integrar al escribir los temas. No duplica CHULETA-EXAMEN.md ni los temas 01-11.

Ya en la chuleta (no repetir): Context en **dos archivos** (`ThingsContext.js` + `ThingsProvider.jsx`) con
`useThings()` y dónde envolver → [CHULETA §7](../../CHULETA-EXAMEN.md). `useMemo` una línea → CHULETA §6.
Ya en temas: `useMemo` opcional → [tema 9 §9.4](../09-estado-derivado.md); `children` → [tema 4 §4.4](../04-props-y-children.md);
lazy init de `useState` + `localStorage` → [tema 10](../10-useeffect.md).

---

## TEMA 16 — Context

### 16.1 Qué problema resuelve (3 casos reales)

1. **Prop drilling**: `App` → `Panel` (no la usa) → `SaludoUsuario`. Con contexto, el nieto lo lee directo
   (`Ejers/UT4/TA12-contexto-usuario/src/componentes/Panel.jsx` no recibe props).
2. **Estado que se pierde al cambiar de ruta**: ir a `/country/URY` **desmonta** `Home` y su `useState` se destruye →
   el puntaje vuelve a 0. El Provider, puesto por encima de `<Routes>`, nunca se desmonta
   (`parciales/2025sem2-simulacro-matutino/web/src/context/ContextoPuntaje.jsx`).
3. **Una sola fuente de verdad**: Navbar (progreso), gráfico y tablero necesitan **la misma** lista. Si cada uno hace
   su fetch, al crear una tarea el progreso no cambia (`parciales/2026sem1-prueba2-vespertino/src/context/TasksContext.jsx`).
   Favoritos del matutino: barra, listado y detalle.

Cuándo NO: algo que usa una sola página → un hook/estado local alcanza. Contexto ≠ reemplazo de props (una
`TaskCard` sigue recibiendo `task` por props).

### 16.2 Valor por defecto con la misma forma

```js
export const TasksContext = createContext({ tasks: [], setTasks: () => {} });
```
Solo se usa si alguien consume **sin** Provider arriba. Con la misma forma no explota; con `null` explota con
*"Cannot read properties of null (reading 'x')"* (lo cual al menos avisa rápido). Los dos criterios se ven en los parciales.

### 16.3 Dónde va el Provider

**Regla: un componente NO puede consumir un contexto que él mismo renderiza.**

| Situación | Provider en | Ejemplo |
|---|---|---|
| Solo lo usan hijos de App | dentro del `return` de App | `Ejers/UT4/TA13-contexto-actualizar/src/App.jsx` |
| App también hace `useContext` | `main.jsx`, envolviendo `<App />` | `parciales/2026sem1-prueba2-vespertino/src/main.jsx`, `Ejers/UT5/UT5.1.2-paises-dark-mode/src/main.jsx` |
| Lo comparten varias rutas | por encima de `<Routes>` (fuera o dentro del `BrowserRouter`, da igual) | `parciales/2025sem2-simulacro-vespertino/web/src/components/App.jsx`, 2026sem2 `components/App/App.jsx` |
| El Provider usa `useNavigate` | **dentro** del `BrowserRouter` | — |

⚠️ Síntoma de Provider mal ubicado: `useContext` devuelve el default y `setX` "no hace nada".

### 16.4 El `value`

- **Siempre un objeto** (aunque hoy sea un dato): mañana agregás una función sin tocar consumidores.
- Cuando el `value` cambia, **todos** los que hacen `useContext` se redibujan, estén donde estén.
- Mejor exponer **funciones con nombre** que el setter crudo: `{ puntaje, sumarPunto, restarPunto }`,
  `{ favorites, isFavorite, toggleFavorite }` — el consumidor no puede poner cualquier cosa.
- Si hay que decidir con el valor nuevo en el mismo clic, la función **lo devuelve**:
  ```js
  function descontarError() {
    const quedan = erroresRestantes - 1;
    setErroresRestantes(quedan);
    return quedan;                 // el handler: if (quedan <= 0) navigate('/end')
  }
  ```
  (`parciales/2025sem2-simulacro-vespertino/web/src/context/ContextoJuego.jsx`; base en [tema 7 §7.3](../07-usestate.md).)

### 16.5 Dos estilos de Provider

| "Tonto" (Trello) | Autosuficiente (BarApp, favoritos 2026sem2) |
|---|---|
| Solo guarda `{ tasks, setTasks }`; una página hace el fetch y llama `setTasks` | Hace **su propio fetch** en `useEffect([])` y expone `{ total, recargar }` / `toggleFavorite` |
| ⚠️ Recargar en `/tasks/new` → progreso 0/0 hasta volver al tablero | El dato está listo en cualquier ruta (la barra lo muestra siempre) |

Después de modificar: `await crear(...)` → `await recargar()` → `navigate(...)`.
Actualizar lista global **sin** refetch: crear `[...tasks, nueva]`, editar `map`, borrar `filter` (tema 7 §7.5).
Ver `parciales/2026sem1-simulacro-vespertino/src/context/RecaudacionContext.jsx`,
`parciales/simulacro-prueba2-2026sem2-matutino/web/src/context/FavoritesProvider.jsx`.

### 16.6 Variantes que salieron

- **Varios contextos**: Providers anidados; el orden no importa (cada `useContext(X)` busca el suyo). Un componente
  puede consumir dos. `Ejers/UT4/TA15-dos-contextos/src/App.jsx`.
- **Tema claro/oscuro**: el contexto guarda `'light' | 'dark'`, el raíz elige la clase CSS (tema 18) y se persiste en
  `localStorage` (lazy init + `useEffect([modo])`). `Ejers/UT5/UT5.1.2-paises-dark-mode/src/contextos/ContextoTema.jsx`,
  `.../componentes/SelectorDeModo.jsx`, `Ejers/UT4/TA14-contexto-tema/src/componentes/TarjetaConTema.jsx`.
- **Autenticación**: `{ estaLogueado, nombreUsuario, iniciarSesion, cerrarSesion }` + ruta protegida (tema 13).
  `Ejers/UT4/TA18-rutas-protegidas/src/contextos/ContextoAutenticacion.jsx`.
- **Estado de juego**: `agregarPaisVisitado` con setter funcional y sin duplicar:
  `setVisitados((prev) => prev.includes(c) ? prev : [...prev, c])`.

### 16.7 Qué contexto se usó en cada lugar

| Dónde | `value` | Provider en |
|---|---|---|
| TA12 | `nombreUsuario` (solo lectura) | App |
| TA13 / TA14 | `{ nombre, setNombre }` / `{ tema, setTema }` | App |
| TA15 | tema + idioma | App, anidados |
| TA18 | auth | App, fuera del router |
| UT5.1.2 | `{ modo, setModo }` + localStorage | main.jsx |
| Trivia 2025 mat. | `{ puntaje, sumarPunto, restarPunto }` | App, fuera del router |
| Viaje 2025 vesp. | dificultad, errores, visitados + 3 funciones | App, fuera del router |
| Trello 2026sem1 | `{ tasks, setTasks }` | main.jsx |
| BarApp 2026sem1 | `{ total, recargar }` (fetch propio) | main.jsx, dentro del router |
| Países 2026sem2 | favoritos + `toggleFavorite` (PUT/DELETE) | `App.jsx` |

### 16.8 Warning `react-refresh/only-export-components`

Aparece cuando un `.jsx` exporta un componente (Provider) **y** algo que no lo es (el contexto o un hook).
- 2026sem2 (lint obligatorio limpio): **separar** en `XContext.js` + `XProvider.jsx` (CHULETA §7).
- Parciales viejos: se toleraba o se apagaba con `// eslint-disable-next-line react-refresh/only-export-components`.

---

## TEMA 17 — `useMemo`, `useCallback`, `useRef`

### 17.1 `useMemo`: recordar un **cálculo**

```jsx
const visibleCountries = useMemo(
  () => (countries ? filterAndSortCountries(countries, { query, region, sort }) : []),
  [countries, query, region, sort],
);
```
- Recalcula solo si cambia una dependencia. Con 250 países un `const` normal alcanza: es **optimización**, no cambia
  el resultado.
- ⚠️ Dependencias: **todo** lo que se usa adentro (lint `exhaustive-deps`). Faltó una → lista vieja.
- Receta de filtro nuevo (matutino): leer de la URL → control → condición en el filtro → **agregar a las deps del `useMemo`**.
Ver `parciales/simulacro-prueba2-2026sem2-matutino/web/src/components/PageCountryList/PageCountryList.jsx`.

### 17.2 `useCallback`: recordar una **función** (identidad estable)

Cada render crea funciones nuevas. Importa cuando la función está en las **dependencias de un efecto**:
- `refetch = useCallback(() => setReloadIndex((i) => i + 1), [])` en los hooks de los docentes.
- `handleFinish` de `PagePlay` va en `useCallback` porque `TicTacToeGame` lo tiene en las deps de su `useEffect`;
  sin eso el efecto se re-ejecutaría en cada render del padre.
- `FavoritesProvider`: `isFavorite`/`toggleFavorite` en `useCallback` y el `value` en `useMemo`, porque la lista usa
  `isFavorite` en las deps de su `useMemo` (si cambiara en cada render, recalcularía siempre). Pulido, no obligatorio.
- Lint *"missing dependency: 'cargar'"* con una función del componente → envolverla en `useCallback` o moverla dentro del efecto.
Ver `parciales/simulacro-prueba2-2026sem2-vespertino/web/src/pages/PagePlay/PagePlay.jsx`, `.../hooks/useCreatePlayer.js`.

### 17.3 `useRef`: una "caja" que sobrevive a los renders **sin redibujar**

```jsx
const hasReportedRef = useRef(false);
useEffect(() => {
  if (isFinished && !hasReportedRef.current) {
    hasReportedRef.current = true;          // cambiar .current NO provoca re-render
    onFinish({ history, winner });          // la partida se guarda UNA sola vez
  }
}, [isFinished, winner, history, onFinish]);
```
Guarda contra dobles llamadas (StrictMode, efecto que se re-ejecuta). Diferencia con `useState`: cambiar un ref no redibuja.
Ver `parciales/simulacro-prueba2-2026sem2-vespertino/web/src/components/TicTacToeGame/TicTacToeGame.jsx`.

### 17.4 Extra: `key` para forzar un remontaje

`<TicTacToeGame key={gameId} … />`: cambiar la `key` hace que React tire el componente y monte uno nuevo con estado
limpio (revancha, "jugar de nuevo"). Alternativa a dejar de dibujarlo (tema 7 §7.7).

| Hook | Recuerda | ¿Redibuja al cambiar? | Uso típico en el examen |
|---|---|---|---|
| `useState` | un valor | sí | todo lo que se ve |
| `useMemo` | el resultado de un cálculo | — | lista filtrada/ordenada |
| `useCallback` | una función | — | `refetch`, handler que va en deps de un efecto |
| `useRef` | un valor mutable | **no** | "ya lo hice", guardas |
