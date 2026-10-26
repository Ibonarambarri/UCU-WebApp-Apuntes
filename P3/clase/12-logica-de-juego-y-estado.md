# Tema 12 — Lógica de juego: la pantalla como estados

> Los parciales de P3 son **juegos** (trivias 2025, Higher/Lower 2026sem2). La parte difícil no es
> React Native: es saber **en qué estado está la pantalla** y qué dibujar en cada uno.

## 12.1 Pensar la pantalla como una máquina de estados

Antes de escribir JSX, dibujá los estados y qué los hace cambiar:

```
           GET ok, playing                 POST guess ok
cargando ─────────────────► jugando ───────────────────► resultado de la ronda
   │  GET falla                ▲   (botones disabled          │ correct && sigue
   ▼                           │    mientras isGuessing)      │──► [Siguiente] → setGame(result.game) → jugando
 error (404 / red)             │                              │ !correct (status 'lost')
                               │                              ▼
   GET ok, status != playing ──┼──────────────────────────► terminada ── [Jugar de nuevo] → /games/nuevo
                               └── (entrar a una partida ya terminada va directo acá)
```

| Estado | Se reconoce por | Se muestra |
|---|---|---|
| cargando | `!game` | spinner |
| error | `error` (`404` aparte) | mensaje + volver (+ Reintentar si no es 404) |
| jugando | `!roundResult && game.status === 'playing'` | `current` vs `next` con **"?"**, botones Más/Menos |
| resultado | `roundResult && roundResult.correct` | valor revelado, "¡Correcto!", **Siguiente** |
| terminada | `roundResult.game.status !== 'playing'` o al entrar `game.status !== 'playing'` | puntaje final, Jugar de nuevo, Volver |

## 12.2 Pocos `useState`, muchas variables derivadas

El estado **mínimo** del simulacro (`app/games/[id].jsx`):
```js
const { data: loadedGame, setData: setGame, error, refetch } = useFetchGame(id);  // la partida (API)
const [result, setResult] = useState(null);         // respuesta del último POST …/guess, o null
const [isGuessing, setIsGuessing] = useState(false);
const [guessError, setGuessError] = useState(null);
```
**Todo lo demás se calcula** en cada render (tema 09 de P2: calcular, no guardar):
```js
const finishedOnEntry = !roundResult && game.status !== 'playing';
const stat         = roundResult ? roundResult.stat : game.stat;            // ¿qué pregunta mostrar?
const otherCountry = roundResult ? roundResult.revealed : game.next;        // ¿contra quién?
const hideOther    = !roundResult && game.status === 'playing';             // ¿"?" o valor?
const score        = roundResult ? roundResult.game.score : game.score;
const isOver       = roundResult ? roundResult.game.status !== 'playing' : finishedOnEntry;
```
⚠️ No hagas `const [isOver, setIsOver] = useState(false)` + un efecto que lo sincronice: es
duplicar la verdad (y el lint te frena con `set-state-in-effect`, tema 17.4).

## 12.3 La API es la fuente de verdad

- El puntaje, el país actual, el `stat` y si terminó **viven en la API**. La app solo **muestra**
  lo que responde → recargar (F5 en web, `r` en Metro) en `/games/6` **sigue en la misma ronda**.
- Lo único local es `result` (lo que acabás de responder). Si recargás justo después de responder,
  ves la ronda **siguiente** (la API ya avanzó): es correcto.
- ⚠️ No calcules vos si acertó comparando números: **`next` no trae** `population`/`area` mientras
  se juega (la API los oculta). La corrección es `result.correct`.

## 12.4 Datos de la ronda respondida vs. de la siguiente

```json
{ "stat": "area", "correct": true, "revealed": { "name": "Paraguay", "area": 406752, … },
  "game": { "stat": "population", "current": { "name": "Paraguay" }, "next": { "name": "Iceland" } } }
```
| Quiero mostrar | Uso | ⚠️ No |
|---|---|---|
| La pregunta que se acaba de responder | `result.stat` ("superficie") | `result.game.stat` (ya es la próxima: "habitantes") |
| El país que estaba oculto, con su valor | `result.revealed` | `result.game.next` (es el **nuevo**, sin valores) |
| El puntaje actualizado | `result.game.score` | `game.score` (todavía el viejo) |
| La ronda siguiente (al tocar Siguiente) | `setGame(result.game)` + `setResult(null)` | `refetch()` (anda, pero es un GET de más) |

Es el "caso a contemplar" del README: *"el resultado se muestra con el tipo de pregunta de esa
ronda, aunque la partida que devolvió la API ya traiga el de la siguiente"*.

## 12.5 Deshabilitar mientras se espera

```js
async function handleGuess(guess) {
  setIsGuessing(true);
  setGuessError(null);
  try {
    setResult(await fetchJSON(`/api/games/${id}/guess`, { method: 'POST', body: { guess } }));
  } catch (err) {
    setGuessError(err);
  } finally {
    setIsGuessing(false);
  }
}
<Button title="Más ▲" onPress={() => handleGuess('higher')} disabled={isGuessing} />
```
Sin `disabled`, un doble toque manda **dos** POST: el segundo responde la ronda **siguiente** (o 409).
Mismo patrón para "Jugar": `disabled={!canPlay}` con `canPlay = player.trim() !== '' && !isCreating`.

## 12.6 Cambiar de partida sin recargar ("Jugar de nuevo")

`router.replace('/games/7')` desde `/games/6` **reusa** el componente: cambia `id`, el hook pide la
7, pero **hasta que llegue** `loadedGame` y `result` siguen siendo de la 6. Solución sin efectos:
```js
const game        = loadedGame && String(loadedGame.id) === String(id) ? loadedGame : null;
const roundResult = result && String(result.game.id) === String(id) ? result : null;
```
Si no coinciden → `game` es `null` → "Cargando…". (`id` de la URL es **string**, el de la API
**número**: por eso `String()` en los dos.) Ver temas 9.4–9.5 (ciclo de vida) y 11.2 (`ignore`).

## 12.7 Cuando la API NO tiene la lógica (trivias 2025): todo en el cliente

En 2025sem2 la API solo daba países; el juego era tuyo. Piezas típicas:

**Azar**
```js
const random = (list) => list[Math.floor(Math.random() * list.length)];       // uno al azar
const shuffle = (list) => [...list].sort(() => Math.random() - 0.5);          // mezclar (copia)
const coin = Math.random() < 0.5;                                             // 50 %
```
⚠️ **Nunca** en el cuerpo del componente: el lint lo marca (*Cannot call impure function during
render*, `react-hooks/purity`) y además cambiaría en cada render. Va en un **handler**, en un
efecto, o en una función async que pide la pregunta (`pedirPregunta()` de 2025sem2).

**Puntaje y vidas** (estado local, actualizado en el handler):
```js
const maxLives = Number(params.vidas) || 3;                      // params siempre string
const [lives, setLives] = useState(maxLives);
const [score, setScore] = useState(0);
function answer(isCorrect) {
  if (isCorrect) setScore((s) => s + 1);
  else setLives((l) => l - 1);
}
const isGameOver = lives <= 0;                                   // derivado
const hearts = '❤️'.repeat(lives) + '💀'.repeat(maxLives - lives);
```

**Temporizador** (efecto con limpieza; el `setState` va dentro del callback → el lint lo acepta):
```js
const [secondsLeft, setSecondsLeft] = useState(30);
useEffect(() => {
  if (isGameOver) return;                                   // no arrancar si terminó
  const timer = setInterval(() => setSecondsLeft((s) => s - 1), 1000);
  return () => clearInterval(timer);                        // ← sin esto: intervalos duplicados
}, [isGameOver]);
const timeIsUp = secondsLeft <= 0;                          // derivado, no un useState
```
- Forma funcional `s => s - 1`: el callback se creó con el `secondsLeft` del primer render.
- ⚠️ El `Stack` no desmonta la pantalla al ir para adelante: si navegás a otra y volvés, el intervalo
  sigue corriendo. Para pausar al perder el foco: `useFocusEffect` (tema 9.3).

**Pasar datos de la bienvenida al juego** (nombre, dificultad): params de la URL
(`router.push({ pathname: '/game', params: { nombre, vidas: 6 } })`, tema 8.4) o Context (tema 14).

📂 **Verlo funcionando:** `parciales/simulacro-prueba3-2026sem2-matutino/mobile/app/games/[id].jsx`
(estados, derivadas, `result.stat`, `setGame`, comparación de ids) · `.../data/games.js` (función `guess`) ·
`parciales/2025sem2-parcial3-matutino/app/game.jsx` (vidas, azar, `ronda` como gatillo del efecto) ·
`parciales/2025sem2-simulacro-matutino/app/game.jsx`

---

## ❓ Repaso

**Pregunta:** acertaste una ronda de **superficie** y la siguiente es de **población**. La pantalla
de resultado dice *"¿Paraguay tiene más o menos habitantes que Uruguay?"* y debajo de Paraguay
aparece **"?"**. ¿Qué dos variables están mal calculadas?

**Respuesta:**
- `stat` sale de `result.game.stat` (la próxima ronda) → debe ser `result.stat` (la respondida).
- El país de la derecha sale de `result.game.next` (el nuevo, sin valores → "?") → debe ser
  `result.revealed`, y `hideOther` tiene que ser `false` cuando hay `result`.
```js
const stat = roundResult ? roundResult.stat : game.stat;
const otherCountry = roundResult ? roundResult.revealed : game.next;
const hideOther = !roundResult && game.status === 'playing';
```
