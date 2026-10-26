# Simulacro Prueba 3 2026 Sem1 Vespertino (Trivia de Capitales) — RESUELTO

Resolución comentada del simulacro. El enunciado original está en `README.md`
(no se tocó) y el croquis en `specs/design.svg`.

> La prueba real de ese semestre (`../2026sem1-prueba3-vespertino/`, figuritas
> del Mundial) usó **la misma plantilla**: Expo Router + API routes, `common/`
> con `styles.js`, `utils.js` (`expoDevServerUri`) y `api.js`, y banderas en
> `app/static/flags/`. Lo que cambia es el dominio. Este simulacro es más
> "lógica de juego" (estado que evoluciona); la prueba fue más "CRUD" (PATCH).

---

## 1. Qué pide el enunciado → dónde está resuelto

| Requisito | Dónde | Cómo |
|---|---|---|
| Header de `/` diga "Bienvenido" (no "index") | `app/_layout.jsx` | `options={{ title: 'Bienvenido' }}` |
| Pantalla del juego en el Stack con título "Trivia Capitales" y ← | `app/_layout.jsx` | `<Stack.Screen name="game" options={{ title: 'Trivia Capitales' }} />` |
| Vista 1 `/`: 3 dificultades (Fácil 8, Medio 5, Difícil 3 errores) → `/game` | `app/index.jsx` + `common/game.js` | `DIFFICULTIES.map(...)` → `router.push({ pathname: '/game', params: { maxErrors } })` |
| Vista 2 `/game`: capital de un país al azar + 9 banderas al azar (1 correcta) | `hooks/useTriviaRound.js` + `app/game.jsx` | `GET /api/countries/random?n=9` + `Promise.all` de los 9 detalles; la correcta se sortea entre los que tienen capital |
| Botón _Salir_ (sin responder) → bienvenida | `app/game.jsx` | `router.dismissTo('/')` |
| Botón _Continuar_ (ya respondió) → siguiente jugada | `app/game.jsx` | `setSelectedCode(null); setRoundNumber(roundNumber + 1)` |
| Tocada verde si acierta, roja si erra, las otras grises | `app/game.jsx` → `flagStyle(option)` | array de estilos condicional |
| Decir si acertó o erró + errores que quedan | `app/game.jsx` | "¡Correcto! / ¡Error!", "Montevideo (no) es capital de X", `remainingErrorsText(...)` |
| Ruta 3 `/end`: resumen con aciertos y errores | `app/end.jsx` | params `?hits=9&errors=3` → "Luego de 12 intentos, acertaste 9 veces, erraste 3 veces" |
| Carga y error | `hooks/useTriviaRound.js` + `components/StatusMessage.jsx` | `isLoading` / `error` / "Reintentar" |
| Casos borde | ver §5 | países sin capital, países con 2+ capitales, `?maxErrors=hola`, `/end` sin params |

### Mapa de rutas

| URL | Archivo | Header | Qué muestra |
|---|---|---|---|
| `/` | `app/index.jsx` | Bienvenido | "Elija la dificultad del juego:" + Fácil / Medio / Difícil |
| `/game?maxErrors=5` | `app/game.jsx` | Trivia Capitales (con ←) | pregunta, 9 banderas 3×3, Salir / Continuar |
| `/end?hits=9&errors=3` | `app/end.jsx` | Trivia Capitales (sin ←) | "Fin del juego", resumen, Nuevo juego |

> El README dice `/game` y `/end`, pero la plantilla traía `app/trivia/index.jsx`
> (ruta `/trivia`). Manda el README: se borró `app/trivia/` y se crearon
> `app/game.jsx` y `app/end.jsx`.

---

## 2. Cómo correrlo

```bash
npm install
npm start          # o: npx expo start --web --port 8091
npm run lint       # tiene que salir sin nada
```

`npm start` levanta app + API (`app/api/*+api.js`) juntas. La API de este
simulacro **sólo lee** `app/api/data.json`, no escribe nada.

```bash
curl localhost:8091/api/countries                      # ["ABW","AFG",...] (250)
curl 'localhost:8091/api/countries/random?n=9'         # 9 códigos al azar (comillas por el ?)
curl localhost:8091/api/countries/URY                  # { name: { common }, capital: [...], ... }
curl localhost:8091/api/countries/XYZ                  # 404 "Country XYZ not found!"
```

---

## 3. Estructura de la solución, archivo por archivo

```
app/_layout.jsx             Stack: index / game / end con sus títulos
app/index.jsx               `/` — 3 botones de dificultad
app/game.jsx                `/game` — la jugada (estado de la partida)
app/end.jsx                 `/end` — resumen
app/api/...                 (DADO, sin tocar) countries+api.js y countries/[cca3]+api.js
hooks/useTriviaRound.js     arma una jugada: 9 países + respuesta correcta
common/game.js              DIFFICULTIES, parseMaxErrors, remainingErrorsText
common/fetch.js             fetchJSON(url, options) con response.ok
common/styles.js            plantilla + estilos nuevos (verde/rojo/gris, etc.)
common/utils.js             (DADO) expoDevServerUri
common/api.js               (DADO, ya no se usa)
components/StatusMessage.jsx cartel cargando / error + Reintentar
```

| Archivo | Estado | Qué hace |
|---|---|---|
| `app/_layout.jsx` | modificado | Títulos; en `end` se saca la flecha con `headerLeft: () => null` |
| `app/index.jsx` | reescrito | Un botón por dificultad, todos a `/game` con distinto `maxErrors` |
| `app/game.jsx` | **creado** | `useState` de `roundNumber`, `selectedCode`, `hits`, `errors`; todo lo demás derivado |
| `app/end.jsx` | **creado** | Lee `hits` y `errors` de la URL, calcula intentos |
| `app/trivia/` | **borrado** | Vista de ejemplo de la plantilla |
| `hooks/useTriviaRound.js` | **creado** | Hace los 10 pedidos de una jugada y elige la correcta |
| `common/game.js` | **creado** | Constantes y helpers del juego (fuera de los componentes) |

---

## 4. Conceptos clave (con el código de ESTA solución)

### 4.1 Pasar datos entre pantallas por la URL (params)

```jsx
// app/index.jsx — ir al juego con la dificultad
router.push({ pathname: '/game', params: { maxErrors: difficulty.maxErrors } });
// → /game?maxErrors=8

// app/game.jsx — leerla
const { maxErrors: maxErrorsParam } = useLocalSearchParams();
const maxErrors = parseMaxErrors(maxErrorsParam);   // "8" → 8 (o 5 si viene basura)
```

- `useLocalSearchParams()` devuelve **juntos** los segmentos dinámicos (`[id]`) y los query params (`?a=1`). Siempre **strings**.
- Equivalente con template string: `router.push(`/game?maxErrors=${8}`)`. Con objeto `{ pathname, params }` Expo Router hace el `encodeURIComponent` por vos.
- Para el resumen igual: `router.replace({ pathname: '/end', params: { hits, errors } })` y en `end.jsx` `Number(params.hits) || 0`.

### 4.2 Una jugada = 1 + 9 pedidos — `hooks/useTriviaRound.js`

```js
const codes = await fetchJSON(`/api/countries/random?n=9`);
// Los 9 detalles EN PARALELO; Promise.all espera a todos (si uno falla, falla todo → catch)
const countries = await Promise.all(
  codes.map((code) => fetchJSON(`/api/countries/${encodeURIComponent(code)}`)),
);
const options = countries.map((c) => ({ cca3: c.cca3, name: c.name.common, capitals: c.capital ?? [] }));
const withCapital = options.filter((o) => o.capitals.length > 0);
const answer = withCapital[Math.floor(Math.random() * withCapital.length)];
setData({ options, answer, capital: answer.capitals[0] });
```

- El endpoint `random` ya devuelve los códigos **mezclados** → la posición de la correcta ya es aleatoria; no hace falta mezclar de nuevo.
- Se piden los 9 detalles (y no sólo el de la correcta) porque después hay que decir "Montevideo **no es capital de Great Britain**" → necesito el nombre del que tocó.
- El hook tiene `[roundNumber, reloadIndex]` como dependencias: **cambiar `roundNumber` = nueva jugada**. Es el mismo truco que `refetch` (un contador que dispara el efecto).
- Mismo esqueleto que `useFetchJSON` (`isLoading`, `error`, `ignore`, `finally`), sólo que el `try` hace varios `await`.

### 4.3 Estado mínimo + estado derivado — `app/game.jsx`

```jsx
const [roundNumber, setRoundNumber] = useState(1);
const [selectedCode, setSelectedCode] = useState(null);   // null = no respondió
const [hits, setHits] = useState(0);
const [errors, setErrors] = useState(0);

// derivados (NO son useState):
const remainingErrors = maxErrors - errors;
const hasAnswered = selectedCode !== null;
const selectedOption = round?.options.find((o) => o.cca3 === selectedCode);
const isCorrect = selectedOption ? selectedOption.capitals.includes(round.capital) : false;
```

Si guardaras `remainingErrors` o `isCorrect` en otro `useState`, tendrías que acordarte de actualizarlos juntos → bugs. Se calculan en cada render.

### 4.4 Responder, continuar, terminar

```jsx
function handleAnswer(option) {
  if (hasAnswered) return;                  // no se puede cambiar la respuesta
  setSelectedCode(option.cca3);
  if (option.capitals.includes(round.capital)) setHits(hits + 1);
  else setErrors(errors + 1);
}

function handleContinue() {
  if (remainingErrors <= 0) {
    router.replace({ pathname: '/end', params: { hits, errors } });   // replace: ← no vuelve al juego
    return;
  }
  setSelectedCode(null);
  setRoundNumber(roundNumber + 1);
}
```

Decisión de interpretación: "Difícil permite 3 errores" = al 3.er error la partida termina (cuando aprieta _Continuar_ con 0 restantes). Coincide con el croquis del final ("erraste 3 veces"). Si el profe lo quiere al revés (termina en el 4.º error), cambiar a `if (remainingErrors < 0)` y empezar mostrando "Te quedan 3".

### 4.5 Botón que cambia + colores condicionales

```jsx
// el botón de abajo depende de si respondió
{hasAnswered
  ? <TouchableOpacity style={styles.primaryButton} onPress={handleContinue}><Text style={styles.buttonText}>Continuar</Text></TouchableOpacity>
  : <TouchableOpacity style={styles.primaryButton} onPress={() => router.dismissTo('/')}><Text style={styles.buttonText}>Salir</Text></TouchableOpacity>}

// color de cada bandera
function flagStyle(option) {
  if (!hasAnswered) return null;
  if (option.cca3 !== selectedCode) return styles.flagGray;
  return isCorrect ? styles.flagCorrect : styles.flagWrong;
}
<TouchableOpacity style={[styles.flagGridItem, flagStyle(option)]} disabled={hasAnswered} ... />
```

### 4.6 Header: título, flecha y cómo sacarla

```jsx
<Stack.Screen name="game" options={{ title: 'Trivia Capitales' }} />
<Stack.Screen name="end" options={{ title: 'Trivia Capitales', headerLeft: () => null }} />
```

- `headerLeft: () => null` saca la flecha en web, iOS y Android. `headerBackVisible: false` en web **no** la sacó.
- Otras opciones útiles: `headerShown: false` (sin header), `gestureEnabled: false` (no volver deslizando en iOS), `headerTitleAlign: 'center'`.

### 4.7 Imágenes SVG con `expo-image`

```jsx
<Image source={{ uri: expoDevServerUri(`/static/flags/${option.cca3}.svg`) }}
       style={styles.flagImage} contentFit="contain" />
```

`Image` de `expo-image` (no el de `react-native`): dibuja SVG también en el celular. Siempre con `width`/`height` en el estilo.

---

## 5. Trampas / casos borde de ESTE simulacro

1. **Países sin capital**: `ATA`, `BVT`, `HMD`, `MAC` vienen con `capital: []`. Si sorteás la correcta entre los 9 sin filtrar, podés preguntar "¿cuál tiene a `undefined` como capital?". → la correcta se elige entre `withCapital`. (Igual pueden aparecer como banderas "incorrectas", no molesta.)
2. **Países con varias capitales**: `ZAF` (Pretoria, Bloemfontein, Cape Town), `PSE` (Ramallah, Jerusalem). Se muestra `capitals[0]` y se corrige con `capitals.includes(capitalMostrada)` en vez de comparar códigos → si salen Israel y Palestina juntos y la capital es Jerusalem, las dos cuentan como bien.
3. **`random` está dentro de `[cca3]+api.js`**: el mock trata `cca3 === 'random'` como caso especial y lee `?n=` con `new URL(req.url).searchParams`. Sin `n` devuelve 4. En `curl`/zsh poné la URL entre comillas (el `?` es comodín).
4. **El nombre está en `name.common`** (no `name`) y la capital es un **array** (`capital[0]`). Leé el JSON real antes de programar.
5. **Params como string**: `maxErrors` llega `"5"`. `"5" - 1` funciona por casualidad, pero `"5" + 1` da `"51"`. Siempre `Number(...)` y validar (`parseMaxErrors` → si es basura usa 5).
6. **`/end` sin params** (entrar directo): `Number(undefined)` es `NaN` → `|| 0`.
7. **Rutas del README vs plantilla**: la plantilla tenía `/trivia`; el README pide `/game` y `/end`.
8. **`replace` vs `push` al terminar**: con `push('/end')` el usuario apretaría ← y volvería a la partida terminada.
9. **Cambios en `_layout.jsx` que "no se ven"** en web: recargá la página; si sigue igual, reiniciá con `npx expo start --clear`.
10. **Lint**: `semi`, imports sin usar, `exhaustive-deps`, hooks antes de cualquier `return` (en `game.jsx` todos arriba).

---

## 6. Recetario de variantes probables

### V1. Al revés: mostrar la bandera y elegir el NOMBRE (o la capital)

Mismo hook; cambia sólo el render:

```jsx
<Image source={{ uri: expoDevServerUri(`/static/flags/${round.answer.cca3}.svg`) }} style={styles.bigFlag} />
{round.options.map((option) => (
  <TouchableOpacity key={option.cca3} style={[styles.optionButton, flagStyle(option)]}
                    disabled={hasAnswered} onPress={() => handleAnswer(option)}>
    <Text>{option.name}</Text>
  </TouchableOpacity>
))}
// y en handleAnswer comparar option.cca3 === round.answer.cca3
```

### V2. Puntaje máximo guardado (AsyncStorage, ya está en `package.json`)

```js
import AsyncStorage from '@react-native-async-storage/async-storage';
// en end.jsx
const [best, setBest] = useState(null);
useEffect(() => {
  (async () => {
    const saved = Number(await AsyncStorage.getItem('best')) || 0;
    const newBest = Math.max(saved, hits);
    await AsyncStorage.setItem('best', String(newBest));   // guarda STRINGS
    setBest(newBest);
  })();
}, [hits]);
```

AsyncStorage es el `localStorage` de RN pero **asíncrono** (todo con `await`) y sólo guarda strings (`JSON.stringify` para objetos).

### V3. Límite de jugadas / tiempo por pregunta

```js
// N jugadas fijas: terminar también por cantidad
const MAX_ROUNDS = 10;
if (remainingErrors <= 0 || roundNumber >= MAX_ROUNDS) router.replace(...);

// Temporizador de 10 s por pregunta
const [secondsLeft, setSecondsLeft] = useState(10);
useEffect(() => {
  if (hasAnswered || !round) return;
  const id = setInterval(() => setSecondsLeft((s) => s - 1), 1000);
  return () => clearInterval(id);            // limpieza: si no, se acumulan intervalos
}, [hasAnswered, round]);
// cuando secondsLeft llega a 0 → contar como error (y resetear a 10 al cambiar de jugada)
```

### V4. Resaltar también la correcta cuando erra

```js
function flagStyle(option) {
  if (!hasAnswered) return null;
  if (option.capitals.includes(round.capital)) return styles.flagCorrect;   // la correcta siempre verde
  if (option.cca3 === selectedCode) return styles.flagWrong;
  return styles.flagGray;
}
```

### V5. Historial de la partida en el resumen (`FlatList`)

```js
// game.jsx: const [history, setHistory] = useState([]);
// en handleAnswer: setHistory([...history, { capital: round.capital, ok: option.capitals.includes(round.capital) }]);
// al terminar: params: { hits, errors, history: JSON.stringify(history) }
// end.jsx:
const history = params.history ? JSON.parse(params.history) : [];
<FlatList data={history} keyExtractor={(_, i) => String(i)}
          renderItem={({ item }) => <Text>{item.ok ? '✔' : '✘'} {item.capital}</Text>} />
```

(Para cosas grandes, mejor un Context que la URL.)

### V6. Elegir cantidad de opciones (4 / 9) o región

```jsx
// index.jsx: params: { maxErrors, options: 4 }
// useTriviaRound(roundNumber, optionCount): `/api/countries/random?n=${optionCount}` y
// agregar optionCount a las dependencias del useEffect.
// Por región: pedir /api/countries/<code> de muchos y filtrar por c.region
// (el random no filtra: sería pedir de más o agregar un endpoint, si lo permiten).
```

---

## 7. Si en el examen me trabo: orden de prioridades

1. `_layout.jsx` con títulos (puntos regalados).
2. `/` con 3 botones que pasan la dificultad.
3. `/game` mostrando capital + 9 banderas (aunque la correcta salga siempre en la misma posición).
4. Responder: colores + mensaje + errores que quedan.
5. Continuar / Salir / fin con `/end`.
6. Casos borde (sin capital, params inválidos), loading/error.
7. `npm run lint` limpio.
