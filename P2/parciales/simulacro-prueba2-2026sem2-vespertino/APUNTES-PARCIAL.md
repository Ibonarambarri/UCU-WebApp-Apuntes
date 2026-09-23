# Apuntes: simulacro prueba 2 (vespertino) – TicTacToe

Cómo correrlo: ver [README principal](../../README.md#cómo-correr-cada-cosa) (formato 2026sem2: `npm install` + `npm start`).

## 1. Resumen del enunciado

App de Tatetí en React 19 + react-router-dom v6 + Vite (la API mock la sirve el mismo Vite en `/api`).

| Ruta | Qué muestra |
|---|---|
| `/` | Título "TicTacToe" + botones **Play** (→ `/play`) y **Players** (→ `/players`). La plantilla redirigía a `/play`. |
| `/play` | Subtítulo "Play". Selects "Player X:" / "Player O:" + botón **Play**. Luego tablero, "Moves X (Adriana)", al final "X Wins (Adriana)" + **Play again**. **Main menu** siempre visible. La partida se guarda al terminar. |
| `/players` | Subtítulo "Players". Lista "Nombre - ganados / jugados". Input "New:" + **Add**. **Main menu**. |

API: `GET /api/players`, `GET /api/players/:id`, `GET /api/players/:id/matches`, `PUT /api/players` (`{ name }`),
`GET /api/matches`, `PUT /api/matches` (`{ playerX, playerO, history, winner }`). Ojo: **crear es con PUT**, no POST
(→ [tema 11](../../clase/11-api-fetch.md)). Ids **strings** (`"1"`); `winner` puede ser `'X'`, `'O'` o `null` (empate).

Los **hooks de los docentes** (`web/src/hooks/`: `useFetchPlayers`, `useFetchMatches`, `useFetchPlayerMatches`,
`useCreatePlayer`, `useCreateMatch`, `useTicTacToe`) son el "estilo oficial": `useFetchX` → `{ data, isLoading, error, refetch }`;
`useCreateX` → `{ isCreating, createX }` (`createX` es `async` y **tira error** si falla).

## 2. Archivo → qué resuelve

| Archivo | Qué resuelve |
|---|---|
| `components/App/App.jsx` | Rutas: layout con `<Outlet />`, `index` → `PageHome`, `play`, `players`, `*` → `Navigate` a `/`. |
| `components/App/App.module.css` | "Tarjeta" centrada, flex en columna (para mandar "Main menu" abajo). |
| `components/Header/Header.jsx` (+css) | Título fijo "TicTacToe" + `subtitle` opcional. |
| `components/Button/Button.jsx` | `<button>` con variante `primary` (negro) / `secondary` (blanco). |
| `components/Button/LinkButton.jsx` | `<Link>` con el mismo estilo de botón (navegar sin recargar). |
| `components/Button/Button.module.css` | Estilos compartidos por los dos anteriores. |
| `pages/PageHome/PageHome.jsx` (+css) | Página de inicio. |
| `pages/PagePlay/PagePlay.jsx` (+css) | Estado de la página (`selectedPlayers`, `isGameFinished`, `saveError`), guarda la partida, "Play again" sin reload. |
| `components/PlayersSelection/PlayersSelection.jsx` (+css) | Form con selects controlados, valida que sean 2 jugadores distintos. |
| `components/TicTacToeGame/TicTacToeGame.jsx` (+css) | Textos de estado del diseño + guarda con `useRef` para que `onFinish` se llame una sola vez. |
| `components/TicTacToeBoard/TicTacToeBoard.module.css` | Tablero estilo "#" (solo líneas internas). |
| `pages/PagePlayers/PagePlayers.jsx` (+css) | Lista con estadísticas + alta de jugador con form controlado y `refetch`. |
| `index.css` | Solo lo global (fuente, fondo, reset de `button/input/select`). |

## 3. Decisiones de este código

### Estadísticas con `filter` (`PagePlayers.jsx`)
```js
const played = matches.filter((m) => m.playerX === id || m.playerO === id);
const won = played.filter((m) => (m.winner === 'X' && m.playerX === id)
                              || (m.winner === 'O' && m.playerO === id));
```
- El empate (`winner: null`) cuenta como jugado, no como ganado.
- Función pura fuera del componente; se calcula en el render → [tema 9](../../clase/09-estado-derivado.md).

### "Loading…" con `!data`, no con `isLoading`
`data` arranca en `null`. Orden del render: `if (error) … else if (!data) Loading… else lista`. Así en un
`refetch` se sigue viendo la lista vieja en vez de parpadear.

### Alta de jugador + refetch
Form controlado, `trim()`, `disabled={!name.trim() || isCreating}`, `await createPlayer(...)` → limpiar → `refetch()`
(la lista **no** se actualiza sola). Receta completa → [tema 8](../../clase/08-formularios-controlados.md) §8.3.

### Reset del juego sin recargar (`PagePlay.jsx`)
- `selectedPlayers` (`null` = selección). "Play again" → `setSelectedPlayers(null)` → `<TicTacToeGame>` se desmonta y su
  `useTicTacToe` se descarta: la próxima partida arranca vacía → [tema 7](../../clase/07-usestate.md) §7.7.
- Alternativas válidas: `reset()` del hook, o cambiar la `key` (`<TicTacToeGame key={gameId} />`) para forzar remount.

### Guardar la partida una sola vez (`TicTacToeGame.jsx`)
- `onFinish` se llama desde un `useEffect` cuando `isFinished` pasa a `true`.
- `handleFinish` está en `useCallback` (identidad estable) **y** hay un `useRef` (`hasReportedRef`) como guarda: si el
  efecto se re-ejecuta (onFinish cambia, StrictMode), no se hace un segundo PUT. (`useCallback`/`useRef`: [tema 17](../../clase/17-usememo-usecallback-useref.md).)

### Conceptos clave
- Layout con `<Outlet />`, `index`, `*` → `Navigate` ([tema 13](../../clase/13-router-rutas.md)).
- Funciones como props (`onFinish`, `onStart`) → [tema 4](../../clase/04-props-y-children.md).
- Selects controlados con ids string → [tema 8](../../clase/08-formularios-controlados.md).
- Estado derivado (`useTicTacToe` guarda solo `history`) → [tema 9](../../clase/09-estado-derivado.md).
- Hooks `useFetchX` / `useCreateX` ([tema 12](../../clase/12-hooks-propios.md)).

## 4. Errores del intento del compañero (NO hacerlos)

1. **`import { useLocation } from 'react'`** → los hooks de router vienen de `'react-router-dom'`.
2. **Agregar `react-router-dom` v7 en el `package.json` de la raíz** → la raíz es solo el workspace; la dependencia ya
   está en `web/package.json` (v6). Dos versiones del router = contextos distintos y errores raros. No tocar nada fuera de `web/src`.
3. **Pasar los jugadores por `navigate(..., { state })`** en vez de tener el estado en la página → se pierde al recargar.
   El flujo selección → juego → fin es estado local de `PagePlay`.
4. **Crear la partida al empezar (sin `history`)** → la API pide `history` array y `winner`; se guarda **al terminar**.
5. **Rutas con mayúsculas / nombres inventados** (`/Home`, `/Play`, `/PlayersSelection`) → el enunciado pide `/`, `/play`, `/players` exactos.
6. **`window.location.reload()`** para "jugar de nuevo" → se resetea con estado de React (ver §3).

## 5. Variantes probables en el examen (y cómo resolverlas)

**a) Historial de partidas de un jugador — `/players/:id`**
- Ruta `<Route path="players/:id" element={<PagePlayer />} />`; en la lista, cada nombre es `<Link to={`/players/${p.id}`}>`.
- `const { id } = useParams();` → `useFetchPlayerMatches(id)` (ya está dado) y `useFetchPlayers()` para mapear ids a nombres.
- Mostrar cada partida: "Adriana (X) vs Alberto (O) – ganó X / empate".

**b) Replay de una partida con `history`**
- Estado `const [step, setStep] = useState(0)`; `<TicTacToeBoard state={match.history[step]} />` **sin** `onPlay` (queda deshabilitado).
- Botones Prev/Next con `disabled={step === 0}` / `step === history.length - 1`, o un `<input type="range">`.
- Auto-play: `useEffect` con `setInterval` que hace `setStep(s => Math.min(s + 1, last))` y **cleanup** `clearInterval`.
- Alternativa: `useTicTacToe(match.history)` recibe `initialHistory`.

**c) Ranking ordenado**
- Mapear a `{ ...player, won, played }` y ordenar una **copia**: `[...rows].sort((a, b) => b.won - a.won || b.played - a.played || a.name.localeCompare(b.name))`. Nunca `sort` sobre `data` directo (muta el estado).
- Extra: % de victorias `played ? Math.round(won / played * 100) : 0`.

**d) Validar nombres duplicados**
- Antes del `createPlayer`: `players.some((p) => p.name.trim().toLowerCase() === trimmed.toLowerCase())` → mostrar error y no enviar.
- Deshabilitar "Add" si es duplicado (derivado del estado, sin useState extra).

**e) Mostrar empates / perdidos** — `draws = played.filter(m => m.winner === null)`, `lost = played.length - won - draws`.

**f) Recordar la selección al "Play again"** — subir `playerXId/playerOId` a `PagePlay` (o pasar `initialX/initialO` a `PlayersSelection`) para que los selects vengan precargados.

**g) Revancha con roles invertidos** — botón que hace `setSelectedPlayers({ playerXId: o, playerOId: x })` + cambiar `key` del juego para remontarlo.

**h) Últimas partidas en el home o en `/play`** — `useFetchMatches()` y `matches.slice(-5).reverse()`; después de guardar una partida llamar `refetch()`.

**i) Filtro/búsqueda en `/players`** — input controlado `query` y `players.filter(p => p.name.toLowerCase().includes(query.toLowerCase()))` (derivado, sin estado extra).

## 6. Pruebas propias antes de entregar

- Jugar una partida completa y ver en `/players` que suben ganados/jugados.
- Agregar un jugador y ver que aparece sin recargar (y en los selects de `/play`).
- Checklist general (lint, rutas a mano, PR): [ESTRATEGIA-EXAMEN.md](../../ESTRATEGIA-EXAMEN.md).
