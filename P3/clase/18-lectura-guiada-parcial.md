# Tema 18 — Lectura guiada de un parcial completo (simulacro 2026sem2, Higher / Lower)

Recorrido de `parciales/simulacro-prueba3-2026sem2-matutino/` en el orden en que conviene leer
**cualquier** parcial: README → API → `_layout` → inicio → partida. Abrí los archivos al lado.

## 18.1 ¿Dónde vive cada dato?

| Dato | Dónde vive | Por qué | Tema |
|---|---|---|---|
| Partida (jugador, puntaje, países, `stat`, `status`) | **API** → `useFetchGame(id)` | sobrevive a recargar; la lógica está en la API | [10](10-api-fetchjson-y-api-routes.md), [11](11-hooks-de-datos.md) |
| Ranking | **API** → `useFetchRanking()` | cambia al terminar partidas | [11](11-hooks-de-datos.md) |
| Id de la partida | **URL** `/games/[id]` | identidad de la pantalla, recargable | [08](08-navegar-y-parametros.md) |
| Nombre escrito | `useState` en el inicio | solo lo usa esa pantalla hasta crear | [06](06-formularios-textinput.md) |
| Respuesta de la última ronda | `useState(result)` en la partida | se ve una vez, hasta "Siguiente" | [12](12-logica-de-juego-y-estado.md) |
| ¿Esperando? / error del POST | `isGuessing`, `guessError`, `isCreating` | deshabilitar y avisar | [12.5](12-logica-de-juego-y-estado.md) |
| Qué país/valor/pregunta/botones mostrar | **nada: se calcula** | sale de `game` + `result` | [12.2](12-logica-de-juego-y-estado.md) |
| "Puede jugar" | **se calcula**: `trim() !== '' && !isCreating` | estado derivado | [06](06-formularios-textinput.md) |

No hay Context ni AsyncStorage: no hace falta. Pocas piezas de estado → solución corta y robusta.

## 18.2 README: qué piden (y los "casos a contemplar")

Leelo con un lápiz y convertilo en checklist. Los casos que **diferencian** la nota:
- [ ] Botón **Jugar** deshabilitado si el nombre está vacío **o solo espacios** → `trim()`.
- [ ] Recargar en `/games/6` sigue en la misma ronda → la partida se pide a la API, no se guarda local.
- [ ] Resultado con el `stat` **de esa ronda** (`result.stat`), no el de la siguiente.
- [ ] `/games/9999` → mensaje de "no existe" (404).
- [ ] Miles con punto y decimales con coma (`0,44 km²` del Vaticano).
- [ ] **Jugar de nuevo** sin quedarse con la partida anterior.
- [ ] Carga y error **de cada pedido** (GET partida, GET ranking, POST crear, POST guess).
- [ ] Entrar a una partida terminada → resultado directo, sin Más/Menos.
- [ ] `npm run lint` sin advertencias (+ `npx eslint .`, tema 17.1).

## 18.3 La API (tema 10): leerla, no tocarla

1. `app/api/` → **qué rutas hay** (un archivo = una ruta; `export const GET/POST`).
2. `data/games.js` → **qué responde y cuándo falla**: `createGame` (400 sin nombre), `findGame`
   (404), `guess` (400 respuesta inválida, 409 terminada; devuelve `{ guess, stat, correct, revealed, game }`),
   `gameView` (oculta `population`/`area` de `next` mientras se juega).
3. `bruno/Games/*.bru` → ejemplos de cada pedido **con sus tests** (los `docs { }` explican `stat` vs `game.stat`).
4. Probala sola antes de escribir pantallas: `http://localhost:8081/api/ranking` en el navegador.

## 18.4 `app/_layout.jsx` (tema 07)

```jsx
<ThemeProvider value={DefaultTheme}>
  <Stack>
    <Stack.Screen name="index" options={{ title: 'Higher / Lower' }} />
    <Stack.Screen name="games/[id]" options={{ title: 'Partida' }} />
  </Stack>
  <StatusBar style="auto" />
</ThemeProvider>
```
Viene dado. Si hubiera Context, el Provider iría envolviendo esto (tema 14.2).

## 18.5 Inicio: `app/index.jsx` (temas 05, 06, 09, 11)

```jsx
const router = useRouter();
const [player, setPlayer] = useState('');                                  // 6.1 input controlado
const { createGame, isCreating, error: createError } = useCreateGame();    // 11.6
const { data: ranking, error: rankingError, refetch } = useFetchRanking(); // 11.3

useFocusEffect(useCallback(() => { refetch(); }, [refetch]));             // 9.3: el inicio NO se desmonta

const trimmedPlayer = player.trim();
const canPlay = trimmedPlayer !== '' && !isCreating;                       // derivado

async function handlePlay() {
  if (!canPlay) return;                                                    // también lo llama onSubmitEditing
  const game = await createGame(trimmedPlayer);
  if (game) router.push(`/games/${game.id}`);                              // 8.2
}
```
- **Por qué `useFocusEffect`:** volvés de una partida terminada y el ranking cambió; con
  `useEffect([])` no se pediría de nuevo porque la pantalla nunca se desmontó.
- **Por qué `!ranking`** (y no `isLoading`) para "Cargando": el refetch al volver no parpadea (11.4).
- **Por qué `if (!canPlay) return`** en el handler: el `onSubmitEditing` del teclado no respeta el `disabled` del botón.
- Ranking con `FlatList` + `keyExtractor={(item) => String(item.id)}` + posición `index + 1` (tema 05).

## 18.6 Partida: `app/games/[id].jsx` (temas 08, 09, 11, 12, 13)

**a) Hooks arriba** (17.3):
```jsx
const { id } = useLocalSearchParams();                                     // string
const { data: loadedGame, setData: setGame, error, refetch } = useFetchGame(id);
const { createGame, isCreating, error: createError } = useCreateGame();
const [result, setResult] = useState(null);
const [isGuessing, setIsGuessing] = useState(false);
const [guessError, setGuessError] = useState(null);
```
**b) Solo datos de ESTA partida** (12.6, sin efectos):
```jsx
const game = loadedGame && String(loadedGame.id) === String(id) ? loadedGame : null;
const roundResult = result && String(result.game.id) === String(id) ? result : null;
```
**c) Handlers:** `handleGuess` (POST + `isGuessing`, 12.5) · `handleNext` → `setGame(roundResult.game); setResult(null)`
(11.7) · `handlePlayAgain` → `createGame(game.player)` + **`router.replace`** (para que "atrás" no vuelva a la terminada) ·
`handleGoHome` → **`router.dismissTo('/')`** (si recargaste en `/games/6` no hay "atrás"; `dismissTo` abre el inicio igual).

**d) Returns tempranos:** `if (error)` → 404 vs Reintentar (11.5) · `if (!game)` → "Cargando partida…".
El título va con ``<Stack.Screen options={{ title: `Partida ${id}` }} />`` en **cada** return (tema 7.4).

**e) Derivadas** (12.2): `finishedOnEntry`, `stat`, `otherCountry`, `hideOther`, `score`, `isOver`, `verdict`.

**f) JSX por condiciones:**
```jsx
{!roundResult && game.status === 'playing' && <Más/Menos disabled={isGuessing} />}
{verdict && <Text>{verdict}</Text>}                         // "¡Correcto!" / "Incorrecto"
{roundResult && !isOver && <Siguiente />}
{isOver && <Fin: puntaje, Jugar de nuevo, Volver al inicio />}
```
**g) `CountryCard`** (`components/`): `Image` con `expoDevServerUri(country.flagUrl)` (10.4),
`hidden ? '?' : formatNumber(country[stat])` (13.1), unidad de `STATS[stat]` (13.3).

## 18.7 Seguir un evento de punta a punta

**Toca "Más":**
```
onPress → handleGuess('higher') → setIsGuessing(true) → botones disabled
→ POST /api/games/6/guess {guess:'higher'} → games.js guess() escribe data.json
→ setResult({ stat:'area', correct:true, revealed: PRY, game: {…ronda siguiente} })
→ re-render: roundResult ≠ null → stat='area', otherCountry=PRY con valor, "¡Correcto!", [Siguiente]
```
**Toca "Siguiente":**
```
setGame(result.game) + setResult(null) → game = ronda nueva (sin GET) → current=PRY vs next=ISL "?" → Más/Menos
```
**Pierde y toca "Jugar de nuevo":**
```
createGame('Bruno') → POST /api/games → {id: 7} → router.replace('/games/7')
→ MISMO componente, id='7' → url cambió → useFetchJSON pide la 7 (ignore=true para la 6)
→ loadedGame.id (6) ≠ '7' → game=null → "Cargando…" → llega la 7 → jugando
   (result viejo: result.game.id 6 ≠ '7' → roundResult=null → no se ve el "Incorrecto" anterior)
```

## 18.8 Leer CUALQUIER parcial

1. README → checklist (18.2). 2. API (`app/api/`, `data/`, o `api/data.json` si es json-server) + Bruno/navegador.
3. `common/fetch.js` → ¿stringify adentro? ¿`.status`? (tema 10.7). 4. `_layout.jsx` → pantallas y títulos.
5. **Tabla "dónde vive cada dato"** (18.1). 6. Cada pantalla: hooks → returns tempranos → derivadas → JSX.

### Qué se pidió cada año (carpetas en `parciales/`)

| Prueba | Carpeta | Rutas | Datos | Juego / lógica | Extra |
|---|---|---|---|---|---|
| **Sim. 2026sem2 mat.** (Higher/Lower) | `simulacro-prueba3-2026sem2-matutino` | `/`, `/games/[id]` | API routes + `fetchJSON`, **POST** | en la **API** | ranking, `useFocusEffect` |
| Práctica (misma consigna, sin resolver) | `practica-matutino` | `/`, `/games/[id]` | ídem | ídem | para hacerla de cero |
| Prueba 3 2026sem1 (figuritas) | `2026sem1-prueba3-vespertino` | `/`, `/groups/[letter]`, `/teams/[code]` | API routes, GET + **PATCH** | — | `setData` con la respuesta, `dismissTo` |
| Sim. 2026sem1 (trivia capitales) | `2026sem1-simulacro-prueba3-vespertino` | `/`, `/game`, `/end` | API routes, países al azar | cliente: errores por dificultad | 9 banderas, colores por respuesta |
| Parcial 3 2025sem2 mat. (mapa/bandera) | `2025sem2-parcial3-matutino` | `/`, `/game` | `fetch` + `expoDevServerUri` | cliente: vidas, azar | expo-image con SVG |
| Parcial 3 2025sem2 vesp. | `2025sem2-parcial3-vespertino` | `/`, `/game` | ídem | cliente: N preguntas, 3 vidas | |
| Sim. 2025sem2 mat./vesp. (trivias) | `2025sem2-simulacro-*` | `/`, `/game` | ídem | cliente: azar, limítrofes | |
| Parcial RN 2025sem1 (tareas) | `2025sem1-parcial-rn` | `/`, `/tasks/new`, `/tasks/[id]` | **json-server** (`EXPO_PUBLIC_API_URL`) | — | formulario crear/editar |
| Sim. RN 2025sem1 (comidas) | `2025sem1-simulacro-rn` | `/`, `/foods/[id]` | json-server | — | stock calculado, fechas |

**Siempre:** Stack con títulos, ruta dinámica + `useLocalSearchParams`, cargando/error, lista
(`FlatList`/`map`), botones con `disabled`. **Casi siempre:** un juego con estados (tema 12) y un
nombre de jugador que pasa de pantalla.

---

## ❓ Pregunta final

**Pregunta:** recargás la página (web) en `/games/6` justo después de tocar "Más" y ver "¡Correcto!".
¿Qué ves, y por qué?

**Respuesta:**
```
1. El navegador pide /games/6 a Metro → la app arranca de cero: _layout → Stack → games/[id]
2. Todo el estado de React se perdió: result = null, isGuessing = false
3. useLocalSearchParams → id = '6' (de la URL)                                  [8.3]
4. useFetchGame('6') → data = null → "Cargando partida…"                        [11]
5. GET /api/games/6 → la API ya había aplicado el guess (data.json):
   current = PRY, next = ISL (sin valores), score = 3, stat = la ronda NUEVA     [10.2, 12.3]
6. game.status === 'playing' y no hay roundResult → pantalla "jugando": PRY vs ISL "?", Más/Menos
```
**No** ves "¡Correcto!" (era estado local, `result`), pero **no perdiste nada**: el puntaje y la
ronda viven en la API. Por eso la consigna dice "al recargar se sigue en la misma ronda".
