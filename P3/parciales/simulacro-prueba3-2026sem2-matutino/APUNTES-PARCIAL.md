# Simulacro Prueba 3 2026sem2 MATUTINO — Higher / Lower (RESUELTO)

> En el P2 el profe pidió traer el simulacro hecho y el examen usó la misma plantilla.
> Apostamos a lo mismo: **el examen probablemente es esta misma plantilla (Expo + API en
> `mobile/app/api`) con otro juego u otros requisitos.** Por eso este archivo tiene la
> solución explicada, la API mapeada, las trampas que encontré y, al final, un
> **recetario de variantes** con código probado (lint limpio y probado en web).

---

## 0. Cómo correrlo

```bash
npm install          # en la RAÍZ del repo (es un workspace: instala también mobile/)
npm start            # en la raíz → levanta Expo + la API (es el mismo servidor)
```

- **Web**: apretar `w` en la terminal de Expo, o abrir <http://localhost:8081>.
  Para probar rápido una URL: `http://localhost:8081/games/9999`, `http://localhost:8081/api/ranking`.
- **Celular**: escanear el QR con **Expo Go** (Android) o con la cámara (iOS). Misma red WiFi que la compu.
- **Lint**: `npm run lint` en la raíz (corre `expo lint` en `mobile/`). Tiene que salir **sin nada**.
- **Bruno**: abrir la carpeta `bruno/` en Bruno, elegir el entorno `Local`
  (`baseUrl = http://localhost:8081`) y correr los pedidos mientras está `npm start`.
  Sin Bruno: `curl -s localhost:8081/api/ranking` o abrir la URL de la API en el navegador (solo GET).

**Trampa que me pasó**: después de **crear archivos nuevos** (un hook, un componente, una
pantalla) Metro a veces dice `Unable to resolve "@/hooks/useFetchGame"` aunque el archivo
exista. Cortar con `Ctrl+C` y reiniciar limpiando la caché:

```bash
cd mobile && npx expo start -c      # -c = --clear (borra la caché de Metro)
```

También conviene recargar el navegador (o `r` en la terminal de Expo). Si moviste
archivos de `app/` (rutas nuevas, carpeta `(tabs)`), reiniciá siempre.

**La base de datos se modifica de verdad** (`mobile/data/db/data.json`): cada partida que
jugás queda guardada. Para volver al seed: `git checkout mobile/data/db/data.json`.

---

## 1. Qué pedía el enunciado → dónde está resuelto

Resumen del enunciado: juego **Higher / Lower** de países. Se muestran dos países y hay que
adivinar si el segundo tiene **más** o **menos** habitantes (o superficie, según el `stat`
que sortea la API). Cada acierto suma 1 y el país revelado pasa a ser el de referencia; el
primer error termina la partida. **Toda la lógica está en la API**: la app crea la partida,
manda las respuestas y muestra lo que devuelve.

| Requisito | Dónde | Cómo |
|---|---|---|
| Campo nombre + botón **Jugar** deshabilitado si vacío/solo espacios | `app/index.jsx` | `TextInput` controlado (`value` + `onChangeText`); `canPlay = player.trim() !== '' && !isCreating` (derivado) |
| Jugar → `POST /api/games` y navegar a `/games/:id` | `app/index.jsx` + `hooks/useCreateGame.js` | `createGame(nombre)` devuelve la partida; `router.push(`/games/${game.id}`)` |
| Ranking: posición, jugador, puntaje (`GET /api/ranking`) | `app/index.jsx` + `hooks/useFetchRanking.js` | `FlatList` con `keyExtractor`; posición = `index + 1` |
| Al entrar a la partida: `GET /api/games/:id`; recargar sigue en la misma ronda | `app/games/[id].jsx` + `hooks/useFetchGame.js` | `useLocalSearchParams()` → `id` → `useFetchGame(id)`. El estado vive en la API: no hay nada que guardar |
| Jugador, puntaje, dos países con bandera y nombre | `app/games/[id].jsx` + `components/CountryCard.jsx` | `<Image source={{ uri: expoDevServerUri(flagUrl) }}>` |
| Pregunta según `stat` (_¿X tiene más o menos habitantes/superficie que Y?_) | `app/games/[id].jsx` + `common/format.js` | Diccionario `STATS[stat].question` |
| Valor del actual con unidad; del siguiente `?` | `components/CountryCard.jsx` | `hidden ? '?' : formatNumber(country[stat])` + `STATS[stat].unit` |
| Botones **Más** / **Menos** → `POST /api/games/:id/guess`; no responder dos veces | `app/games/[id].jsx` (`handleGuess`) | `isGuessing` deshabilita los botones mientras se espera |
| Mostrar valor revelado y si acertó | `app/games/[id].jsx` | `result.revealed` + `result.correct` → "¡Correcto!" / "Incorrecto" |
| Acierto → **Siguiente** con la partida que devolvió la API | `handleNext` | `setGame(result.game)` (sin otro GET) + `setResult(null)` |
| Error → puntaje final, **Jugar de nuevo** (mismo jugador), volver al inicio | `handlePlayAgain`, `handleGoHome` | `useCreateGame` otra vez + `router.replace`; `router.dismissTo('/')` |
| Entrar a una partida terminada → resultado directo, sin botones | `app/games/[id].jsx` | `finishedOnEntry = !roundResult && game.status !== 'playing'`; `next` ya trae valores |
| **Caso**: resultado con el `stat` de ESA ronda | `app/games/[id].jsx` | `stat = roundResult ? roundResult.stat : game.stat` (nunca `result.game.stat`) |
| **Caso**: `/games/9999` | `app/games/[id].jsx` | `error.status === 404` → "La partida 9999 no existe." |
| **Caso**: miles con `.` y decimales con `,` (`0,44 km²`) | `common/format.js` | `formatNumber` a mano |
| **Caso**: Jugar de nuevo sin quedarse con la partida anterior | `app/games/[id].jsx` | `game` / `roundResult` solo si su `id` coincide con el de la URL (derivado) |
| **Caso**: carga y error de cada pedido | `hooks/useFetchJSON.js` + `components/StatusMessage.jsx` | `isLoading`/`error`/`refetch`; errores del POST en su propio estado |
| `npm run lint` sin advertencias | todo | ver [trampas](#5-trampas-encontradas-y-cómo-las-esquivé) |

### Mapa de archivos (`mobile/`)

```
app/_layout.jsx                   (DADO) Stack con las 2 pantallas y sus títulos
app/index.jsx                     Inicio: nombre + Jugar + ranking
app/games/[id].jsx                Partida: países, Más/Menos, resultado, fin
app/api/...  data/...             (DADO, no tocar) la API y la "base de datos"
common/fetch.js                   (DADO) fetchJSON: tira Error con .status si !ok
common/utils.js                   (DADO) expoDevServerUri(path) → URL completa
common/styles.js                  (DADO) estilos comunes (container, row, input, botones…)
common/format.js                  formatNumber, STATS, formatStat
hooks/useFetchJSON.js             GET genérico → { data, setData, isLoading, error, refetch }
hooks/useFetchGame.js             GET /api/games/:id      (1 línea)
hooks/useFetchRanking.js          GET /api/ranking         (1 línea)
hooks/useCreateGame.js            POST /api/games → { createGame, isCreating, error }
components/Button.jsx             (DADO) TouchableOpacity + Text, con disabled
components/CountryCard.jsx        bandera + nombre + valor (o "?") + unidad
components/StatusMessage.jsx      cargando (ActivityIndicator) / error + Reintentar
```

**Para el examen**: copiá `hooks/`, `common/format.js`, `components/StatusMessage.jsx` (y
`CountryCard.jsx` si vuelve a haber países) a la plantilla nueva antes de arrancar. Son
genéricos.

---

## 2. Mapa de la API

Todo bajo el mismo servidor de Expo (`http://localhost:8081`). Los códigos de país son
alpha-3 en mayúsculas. **Todas las respuestas exitosas son `200`** (también los POST).
Los errores vienen como `{ "error": "mensaje" }` con su código; `fetchJSON` los convierte en
un `Error` con `error.status`.

| Método | Ruta | Body | Éxito | Errores |
|---|---|---|---|---|
| `POST` | `/api/games` | `{ "player": "Bruno" }` | `200` partida nueva (`status: "playing"`, `score: 0`, `next` **sin** valores) | `400` si falta `player`, no es string o es solo espacios (la API hace `trim`) · `400` si el body no es JSON |
| `GET` | `/api/games/:id` | — | `200` la partida | `404` si no existe (`/api/games/9999`, `/api/games/abc`) |
| `POST` | `/api/games/:id/guess` | `{ "guess": "higher" }` o `"lower"` | `200` `{ guess, stat, correct, revealed, game }` | `404` si no existe (se chequea **primero**) · `400` si `guess` no es `higher`/`lower` · `409` si la partida ya terminó |
| `GET` | `/api/ranking` | — | `200` `[{ id, player, score, finishedAt }]` (máx. 10) | — |
| `DELETE` | `/api/games/:id` | — | `200` la partida borrada | `404` |

**La partida** (`GET /api/games/6`):

```json
{
  "id": 6, "player": "Bruno", "status": "playing", "score": 2, "stat": "area",
  "current": { "code": "URY", "name": "Uruguay", "flag": "🇺🇾", "flagUrl": "/static/flags/URY.png", "population": 3473727, "area": 181034 },
  "next":    { "code": "PRY", "name": "Paraguay", "flag": "🇵🇾", "flagUrl": "/static/flags/PRY.png" },
  "createdAt": "2026-10-24T11:30:46.726Z", "finishedAt": null
}
```

- `id` es **número** en el JSON; el de la URL (`useLocalSearchParams`) es **string**.
- `status`: `playing` → `lost` (al primer error) o `won` (si se acabaran los ~240 países;
  en ese caso `next` es `null`).
- `stat`: `population` o `area`, el de la ronda **actual**. Se sortea en cada ronda.
- `next` mientras se juega: **sin** `population`/`area` (para que no se vea en la red).
  Cuando terminó: `next` es el país en el que se erró, **con** valores, y `stat` es el de esa ronda.
- `flagUrl` es **relativa** (`/static/flags/URY.png`) → en el celular hace falta `expoDevServerUri`.

**La respuesta del guess** (`POST /api/games/6/guess`):

```json
{
  "guess": "higher", "stat": "area", "correct": true,
  "revealed": { "code": "PRY", "name": "Paraguay", ..., "population": 7132530, "area": 406752 },
  "game": { "id": 6, "score": 3, "stat": "population", "current": { "code": "PRY", ... }, "next": { "code": "ISL", ... }, ... }
}
```

| Campo | Qué es | Ojo |
|---|---|---|
| `stat` | el tipo de la ronda **que se acaba de responder** | Es el que hay que usar para mostrar el resultado |
| `game.stat` | el tipo de la ronda **siguiente** | Puede ser distinto. Si lo usás para el resultado, mostrás el valor equivocado |
| `revealed` | el país que estaba oculto, ahora con valores | Si acertó, también es `game.current` |
| `game` | la partida ya actualizada | Si acertó: `current` = revelado, `next` nuevo, `score + 1`. Si erró: `status: "lost"`, `current` y `next` quedan como estaban |
| `correct` | si acertó | Con valores iguales, cualquier respuesta es correcta (`>=` / `<=`) |

**Ranking**: solo partidas terminadas (`status !== 'playing'`, incluye `won`), ordenadas por
`score` desc y, a igual puntaje, la que terminó **antes** primero. Top 10. El seed trae 5
(Ayrton Senna 7, Niki Lauda 4, Alain Prost 4, Juan Manuel Fangio 2, Michael Schumacher 0).

Datos útiles para probar: Uruguay `URY` 3.473.727 hab / 181.034 km²; Vaticano `VAT` 451 hab
/ **0,44 km²**. Los 10 países con `area: null` no participan del juego.

---

## 3. Decisiones de ESTE código (lo específico; la teoría está en clase/)

### 3.1 `useFetchJSON` genérico con `setData` e `ignore` — `hooks/useFetchJSON.js`

Devuelve `{ data, setData, isLoading, error, refetch }`. Un endpoint nuevo = un hook de una
línea (`useFetchGame(id)` → `useFetchJSON(`/api/games/${id}`)`).
Teoría: [tema 10](../../clase/10-api-fetchjson-y-api-routes.md) y [tema 11](../../clase/11-hooks-de-datos.md).

- **`url` en las dependencias del efecto**: "Jugar de nuevo" cambia el `id` de la URL sin
  desmontar la pantalla → cambia la `url` → el efecto vuelve a correr y pide la partida nueva.
- **`ignore` en la limpieza**: si cambia la `url` antes de que llegue la respuesta vieja, la
  vieja se descarta y no pisa los datos nuevos.
- **`setData`**: el POST del guess ya devuelve la partida actualizada; "Siguiente" hace
  `setGame(result.game)` en vez de pedirla otra vez.
- **`refetch`** = un contador (`reloadIndex`) en las dependencias. Lo uso para "Reintentar"
  y para refrescar el ranking. Está en `useCallback` porque lo uso dentro de `useFocusEffect`.
- **Los `setX` están dentro de una función `async` que se invoca en el efecto**
  (`(async () => { ... })()`). Si los pusiera directo en el cuerpo del efecto, el lint de
  React Compiler da **error** (`react-hooks/set-state-in-effect`, ver trampas).

### 3.2 `useCreateGame` reutilizado — `hooks/useCreateGame.js`

El mismo POST se usa en **dos** lugares: "Jugar" (inicio) y "Jugar de nuevo" (fin de
partida). Por eso es un hook: `{ createGame, isCreating, error }`. `createGame(player)`
devuelve la partida o `null` si falló (el error queda en `error` para mostrarlo).
No es un `useFetchJSON` porque **no** se dispara solo al montar: se dispara con un clic.
`fetchJSON` hace el `JSON.stringify` → el body se pasa como **objeto** (`{ player }`).

### 3.3 Refrescar el ranking al volver — `useFocusEffect` en `app/index.jsx`

Con `Stack`, al abrir `/games/6` el inicio **no se desmonta** (queda abajo en la pila). Al
volver, el `useEffect` del hook no corre de nuevo → el ranking quedaría viejo.
`useFocusEffect(useCallback(() => { refetch(); }, [refetch]))` corre cada vez que la
pantalla gana el foco (incluida la primera vez). El `useCallback` es obligatorio ahí.
Teoría: [tema 9](../../clase/09-ciclo-de-vida-pantallas.md).

Detalle: muestro "Cargando ranking…" con `!ranking` y no con `isLoading` → al refrescar se
sigue viendo la lista vieja en vez de parpadear.

### 3.4 Estado derivado por `id` en vez de efectos para "resetear" — `app/games/[id].jsx`

El problema de **Jugar de nuevo**: `router.replace('/games/8')` desde `/games/7`
**reutiliza la misma pantalla**; cambia el `id` pero el estado (`result`, la partida
cargada) sigue siendo de la 7 hasta que llega la nueva. La tentación es:

```js
useEffect(() => { setResult(null); }, [id]);   // ❌ ERROR de lint (set-state-in-effect)
```

Lo que hice: **no borrar nada**, solo **ignorar lo que no es de este id**:

```js
const game = loadedGame && String(loadedGame.id) === String(id) ? loadedGame : null;
const roundResult = result && String(result.game.id) === String(id) ? result : null;
```

Mientras la nueva no llegó, `game` es `null` → "Cargando partida…". `String()` en los dos
lados porque el `id` de la URL es string y el del JSON es número.
Teoría: [tema 12](../../clase/12-logica-de-juego-y-estado.md) y [tema 17](../../clase/17-lint-y-react-compiler.md).
(Otra salida válida: darle una `key={id}` a un componente hijo para que se remonte; la uso en V12.)

### 3.5 Qué se muestra en cada momento — `result.stat` vs `game.stat`

Tres situaciones, todas en el mismo render (variables derivadas, sin `useState`):

| Situación | País 1 | País 2 | `stat` | Botones |
|---|---|---|---|---|
| Jugando, sin responder | `game.current` | `game.next` con `?` | `game.stat` | Más / Menos |
| Recién respondida | `game.current` | `roundResult.revealed` | **`roundResult.stat`** | Siguiente (si acertó) o Jugar de nuevo / Inicio |
| Terminada al entrar | `game.current` | `game.next` (con valores) | `game.stat` (= el de la ronda errada) | Jugar de nuevo / Inicio |

```js
const stat = roundResult ? roundResult.stat : game.stat;   // NUNCA roundResult.game.stat
const otherCountry = roundResult ? roundResult.revealed : game.next;
const hideOther = !roundResult && game.status === 'playing';
const score = roundResult ? roundResult.game.score : game.score;
```

Ojo que mientras se muestra el resultado, `game` sigue siendo la partida **de antes** del
guess (por eso `game.current` es el país de referencia correcto). Recién en "Siguiente" se
reemplaza por `roundResult.game`.

### 3.6 Navegación: `push`, `replace`, `dismissTo`

- **Jugar** (inicio): `router.push('/games/6')` → la partida se apila; "atrás" vuelve al inicio.
- **Jugar de nuevo**: `router.replace('/games/7')` → reemplaza la partida terminada; "atrás"
  vuelve al inicio y no a la partida vieja. Con `push`, la pila crecería con cada partida.
- **Volver al inicio**: `router.dismissTo('/')` → saca pantallas hasta llegar a `/`. Si
  recargaste en `/games/6` no hay nada abajo en la pila: `router.back()` no tendría a dónde
  ir, `dismissTo` abre el inicio igual.

Teoría: [tema 8](../../clase/08-navegar-y-parametros.md).

### 3.7 Título dinámico con `<Stack.Screen>` dentro de la pantalla

`_layout.jsx` define títulos fijos; dentro de `[id].jsx` un `<Stack.Screen options={{ title: `Partida ${id}` }} />`
los pisa (lo trae la plantilla). Lo pongo en **todos** los `return` (cargando, error,
normal) para que el título no dependa de qué rama se dibuja. Teoría: [tema 7](../../clase/07-expo-router-archivos-y-layouts.md).

### 3.8 Imágenes con `expoDevServerUri` — `components/CountryCard.jsx`

`flagUrl` es relativa. En web funciona igual porque la página está en el mismo servidor,
pero **en el celular la app no está en `localhost`** → hay que armar la URL completa:
`<Image source={{ uri: expoDevServerUri(country.flagUrl) }} style={{ width: 80, height: 54 }} />`.
`Image` con URL remota **necesita `width` y `height`** (si no, mide 0×0 y no se ve).
Uso la imagen y no el emoji `flag` porque en Windows los emojis de banderas no se ven (lo dice el README).
Teoría: [tema 3](../../clase/03-componentes-core.md).

### 3.9 `formatNumber` a mano — `common/format.js`

```js
const [integer, decimals] = String(value).split('.');
const withDots = integer.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
return decimals ? `${withDots},${decimals}` : withDots;
```

¿Por qué no `value.toLocaleString('es-UY')`? En web anda, pero en el celular depende del
motor JS (Hermes) y del idioma del dispositivo: puede salir `3,473,727` o sin separador.
A mano sale igual en todos lados. `0.44` → `"0,44"`, `0` → `"0"` (ojo con `if (!value)`,
que trataría 0 como vacío). Teoría: [tema 13](../../clase/13-formatear-datos.md).

`STATS = { population: { question: 'habitantes', unit: 'habitantes' }, area: { question: 'superficie', unit: 'km²' } }`
→ un diccionario en vez de `if`/ternarios por todos lados.

### 3.10 Botones deshabilitados con `isGuessing`

`handleGuess` pone `isGuessing = true` antes del `await` y `false` en el `finally`. Los
botones Más/Menos tienen `disabled={isGuessing}` → no se puede mandar dos respuestas (la
segunda daría `409` o respondería la ronda siguiente). El error del POST va en su propio
estado (`guessError`) para no confundirlo con el error de carga.

### 3.11 404 con `error.status`

`fetchJSON` le pone `.status` al Error → `error.status === 404` muestra "La partida 9999 no
existe." (sin "Reintentar", no tiene sentido); cualquier otro error → `StatusMessage` con
"Reintentar" (`refetch`). Mejor que buscar `' 404 '` dentro de `error.message`.

### 3.12 Todos los hooks arriba de los `return`

En `[id].jsx` primero van todos los `useX()`, después las funciones y los derivados, y recién
ahí los `if (error) return …` / `if (!game) return …`. Regla de los hooks: el mismo orden en
cada render. Teoría: [tema 2](../../clase/02-react-que-sigue-igual.md).

---

## 4. Casos a contemplar → dónde → cómo comprobarlo a mano

| Caso del enunciado | Dónde / cómo se resuelve | Cómo comprobarlo |
|---|---|---|
| Botón Jugar deshabilitado si el nombre está vacío o con espacios | `canPlay` derivado de `player.trim()` | Escribir `"   "` → el botón sigue gris; escribir `Ana` → se habilita |
| Crear y navegar | `useCreateGame` + `router.push` | Jugar → la URL pasa a `/games/N` |
| Recargar sigue en la misma ronda | El estado vive en la API; `useFetchGame(id)` | En una partida, F5 (o `r` en Expo) → mismos países y puntaje |
| Resultado con el `stat` de ESA ronda | `stat = roundResult ? roundResult.stat : game.stat` | Jugar hasta acertar una ronda donde el `stat` siguiente sea distinto (pasa ~50%): la tarjeta revelada tiene que seguir mostrando la unidad de la pregunta respondida. Con Bruno: `Guess` y comparar `stat` vs `game.stat` |
| Partida inexistente | `error.status === 404` | Abrir `http://localhost:8081/games/9999` → "La partida 9999 no existe." + Volver al inicio. También `/games/abc` |
| Separador de miles y decimales | `formatNumber` | Cualquier partida (`3.473.727`). Decimal: el Vaticano (`0,44`) sale poco; probalo desde la raíz con `node --input-type=module -e "import('./mobile/common/format.js').then(m => console.log(m.formatNumber(0.44)))"` → `0,44` (el warning de "module type" se ignora) |
| Jugar de nuevo sin quedarse con la anterior | `game`/`roundResult` solo si coinciden con el `id` | Perder → Jugar de nuevo → la URL cambia a `/games/N+1`, se ve "Cargando…" un instante y aparece la partida nueva con puntaje 0 y botones Más/Menos (no el "Incorrecto" anterior) |
| Partida terminada al entrar | `finishedOnEntry` | Abrir `/games/1` (seed, Ayrton Senna): Brasil vs India con los dos valores, "Incorrecto", puntaje 7, sin Más/Menos |
| No poder responder dos veces | `disabled={isGuessing}` | Al tocar "Más" los dos botones se ven grises (opacidad) y aparece "Enviando respuesta…" hasta que llega la respuesta; en web, mirar la pestaña Network |
| Carga y error de cada pedido | `StatusMessage` + estados de los hooks | Cortar `npm start` con la app abierta y tocar Más → "No se pudo enviar la respuesta."; recargar el inicio con el servidor caído → error + Reintentar |
| Ranking actualizado al volver | `useFocusEffect` | Perder una partida con puntaje ≥1 → Volver al inicio → aparece en el ranking sin recargar |
| `npm run lint` sin advertencias | — | `npm run lint` en la raíz: no imprime nada más que el encabezado |

---

## 5. Trampas encontradas (y cómo las esquivé)

**Lint / React Compiler** (la config es `eslint-config-expo` + React Compiler; muchas cosas
que en P2 eran warnings acá son **errores**). Teoría: [tema 17](../../clase/17-lint-y-react-compiler.md).

1. **`react-hooks/set-state-in-effect` (ERROR)**: llamar un `setX(...)` directo en el cuerpo
   de un `useEffect` da error:
   ```js
   useEffect(() => { setResult(null); }, [id]);   // ❌ "Calling setState synchronously within an effect"
   ```
   Lo que **sí** pasa: `setX` dentro de un `.then(...)`, de un callback (`setInterval`,
   listener), o de una función `async` invocada en el efecto (así está `useFetchJSON`).
   Y la mayoría de las veces la solución real es **no tener ese estado**: derivarlo (3.4) o
   remontar con `key`.
2. **`react-hooks/purity` (ERROR)**: `Date.now()`, `new Date()` sin argumentos o
   `Math.random()` **durante el render** dan error ("Cannot call impure function during
   render"). Van dentro de handlers, efectos o `useState(() => Math.random())`.
3. **`react-hooks/refs` (ERROR)**: leer `ref.current` durante el render. Solo en handlers/efectos.
4. **React Compiler + `null` (bug real, lo encontré probando V13)**: el compilador memoiza las
   funciones y usa sus propiedades como dependencias **al principio del componente**, antes
   de los `return` tempranos. Esto rompe en runtime (no en lint):
   ```js
   const { data: game } = useFetchGame(id);          // null mientras carga
   async function handlePlayAgain() {
     await createGame(game.player);                  // 💥 "Cannot read properties of null (reading 'player')"
   }
   if (!game) return <Cargando />;
   ```
   Arreglo: `game?.player` dentro de la función (o pasar el dato por parámetro, o definir la
   función después de los `return`). En `[id].jsx` ya está escrito `game?.player` por las
   dudas (antes no explotaba solo porque el compilador **no optimiza** componentes con
   `try { } finally { }`). Ante la duda: `?.`.
5. **`semi: always`**: punto y coma en todas las sentencias (regla agregada en `eslint.config.js`).
6. **`no-unused-vars` / `import/no-unresolved`**: imports sin usar o con ruta mal escrita
   (`@/hook/...` en vez de `@/hooks/...`) → error.
7. **`react-hooks/exhaustive-deps`**: todo lo que uses dentro de `useEffect`/`useCallback` va
   en las dependencias. No lo apagues con `eslint-disable`.

**React Native (no es web)** — teoría: [tema 3](../../clase/03-componentes-core.md), [tema 4](../../clase/04-estilos-stylesheet-flexbox.md).

8. **Texto fuera de `<Text>`**: `<View>hola</View>` en el celular **rompe** (pantalla roja
   "Text strings must be rendered within a <Text> component"); en web solo tira
   "Unexpected text node" en consola y se ve igual → **probá en el celular o mirá la consola**.
   Lo mismo con `{score && <X/>}` cuando `score` es `0`: renderiza un `0` suelto → crash.
   Usá `{score > 0 && ...}` o un ternario.
9. **`onPress`, no `onClick`**; **`onChangeText={setPlayer}`** (recibe el string), no
   `onChange` (recibe un evento). No existen `<div>`, `<button>`, `<input>`, `<ul>`, `<img>`.
10. **`Image` necesita `width` y `height`** y `source={{ uri: URL_COMPLETA }}` (con
    `expoDevServerUri`). Imagen local: `source={require('@/assets/images/icon.png')}`.
11. **Estilos**: números sin `px`, `flexDirection` por defecto es `column`, no hay cascada
    (el color no se hereda de un `View` a su `Text`), no hay `:hover` ni media queries.
    Varios estilos: array `style={[styles.a, cond && styles.b]}`.
12. **`Link asChild` + array de estilos = error** (me pasó en V3): `<Link asChild><Pressable style={[a, b]}>`
    tira "You are passing an array of styles to a child of <Slot>". Usá
    `style={StyleSheet.flatten([a, b])}` o un solo objeto.
13. **`Alert.alert` no funciona en web** (no muestra nada). Para confirmar en web:
    `window.confirm` con `Platform.OS === 'web'` (ver V14).
14. **`FlatList` dentro de `ScrollView`** (vertical) → warning "VirtualizedLists should never be
    nested" y la lista no virtualiza. En una pantalla con `ScrollView` usá `.map()` (V10), o hacé
    que la `FlatList` sea el contenedor y lo de arriba va en `ListHeaderComponent`.
15. **`key` / `keyExtractor`**: `keyExtractor={(item) => String(item.id)}` (tiene que ser
    string). En `.map()`, `key={item.id}` en el elemento de afuera.
16. **`TextInput`**: `onSubmitEditing` (Enter), `maxLength`, `autoCapitalize`, `keyboardType="numeric"`
    (igual devuelve string). Teoría: [tema 6](../../clase/06-formularios-textinput.md).

**Expo Router** — teoría: [tema 7](../../clase/07-expo-router-archivos-y-layouts.md), [tema 8](../../clase/08-navegar-y-parametros.md).

17. **`useLocalSearchParams()` devuelve strings** (o `undefined`, o un array si el param se
    repite). `id === game.id` es `"6" === 6` → `false`. Comparar con `String()` o convertir con `Number()`.
18. **El inicio no se desmonta** al navegar con `push` → `useFocusEffect` para refrescar.
19. **Archivos nuevos/movidos y Metro** → `npx expo start -c` (sección 0).
20. **`usePreventRemove` + `navigation.dispatch(data.action)` entra en loop en web** (el
    confirm se repite infinitamente; lo probé). Para "confirmar antes de salir" usá V15
    (`headerLeft` propio + botón).
21. **Tema oscuro siguiendo `useColorScheme()` en web**: la app usa `"output": "server"` (SSR):
    el servidor no conoce el tema del sistema → error de hidratación en web. Arrancá en
    `'light'` y cambiá después (V16).

**API / datos**

22. **`fetchJSON` ya hace `JSON.stringify`**: pasale `body: { player }` (objeto). Si le pasás
    un string, lo stringifica dos veces → `400`.
23. **`next` no trae valores mientras se juega** → `country[stat]` da `undefined` → mostrar `?`.
24. **`result.game.stat` ≠ `result.stat`** (3.5). Es EL caso trampa del enunciado.
25. **La base se modifica**: `git checkout mobile/data/db/data.json` para volver al seed.

---

## 6. Si en el examen me trabo: orden de prioridades (~2 h)

| Tiempo | Qué |
|---|---|
| 0:00–0:10 | Leer **todo** el enunciado y la tabla de la API. `npm install`, `npm start`, abrir `w`. Probar 2–3 endpoints en el navegador o Bruno para ver la forma real de los datos |
| 0:10–0:20 | Copiar de este simulacro: `hooks/useFetchJSON.js` (+ hooks de 1 línea para los endpoints nuevos), `components/StatusMessage.jsx`, `common/format.js`. Si hay archivos nuevos → `npx expo start -c` |
| 0:20–0:40 | Pantalla 1 (inicio): input controlado + botón deshabilitado + POST + `router.push`. Lista con `FlatList` |
| 0:40–1:15 | Pantalla 2: GET por id, mostrar datos, botones de acción con `isX` para deshabilitar, mostrar la respuesta del POST. Primero que funcione feo |
| 1:15–1:35 | Casos borde: 404, carga/error en cada pedido, "jugar de nuevo" sin datos viejos (derivado por id), stat de la ronda, formato de números |
| 1:35–1:50 | Lo opcional / variantes / estilos mínimos |
| 1:50–2:00 | `npm run lint` hasta que salga limpio. Probar a mano la tabla de la sección 4. Commit + push + PR |

Probar a mano antes de entregar: `/`, nombre con espacios, Jugar, Más/Menos, Siguiente,
perder, Jugar de nuevo, Volver al inicio (ranking actualizado), F5 en mitad de partida,
`/games/9999`, `/games/1`.

---

## 7. RECETARIO DE VARIANTES PROBABLES EN EL EXAMEN

Todas están **probadas**: aplicadas sobre una copia de esta solución, `npx eslint .` limpio en
cada una y probadas en web (las que tocan plataforma también compilan para Android con
`npx expo export --platform android`). Cada una parte de la solución tal cual está (son
independientes entre sí salvo que diga otra cosa).

Historial de los parciales anteriores (`../2025sem2-*`, `../2026sem1-*`): piden títulos
del header ("Bienvenido"), dificultad con **vidas** (❤️/💀), pantalla de **fin** aparte,
colorear verde/rojo según acierto, botón Salir/Continuar, PATCH/DELETE a la API. Por eso
V1, V9, V11, V13 y V14 son las más probables.

| # | Variante | Archivos |
|---|---|---|
| V1 | Títulos y estilo del header | `_layout.jsx`, `[id].jsx` |
| V2 | Ranking con fecha formateada y medallas | `common/format.js`, `index.jsx` |
| V3 | Ranking tocable → detalle de la partida | `index.jsx` |
| V4 | Pull-to-refresh en el ranking | `index.jsx` |
| V5 | Ranking en pantalla aparte (Stack) o Tabs | `app/ranking.jsx` / `app/(tabs)/…` |
| V6 | Recordar el último nombre (AsyncStorage) | `index.jsx` |
| V7 | Mejor puntaje personal (ranking / AsyncStorage) | `index.jsx`, `common/storage.js`, `[id].jsx` |
| V8 | Validaciones extra del nombre | `index.jsx` |
| V9 | Mostrar población y superficie + verde/rojo | `CountryCard.jsx`, `[id].jsx` |
| V10 | Historial de rondas de la partida | `[id].jsx` |
| V11 | Vidas por dificultad (lógica en el cliente) | `index.jsx`, `[id].jsx` |
| V12 | Temporizador por ronda | `components/RoundTimer.jsx`, `[id].jsx` |
| V13 | Pantalla de resultado aparte `/results/:id` | `app/results/[id].jsx`, `[id].jsx`, `_layout.jsx` |
| V14 | Borrar partida (DELETE) con confirmación | `common/confirm.js`, `index.jsx` |
| V15 | Confirmar antes de abandonar una partida | `common/confirm.js`, `[id].jsx` |
| V16 | Tema oscuro con Context (+ AsyncStorage) | `context/…`, `_layout.jsx`, pantallas |
| V17 | Emoji vs imagen según `Platform.OS` + vibración | `CountryCard.jsx`, `[id].jsx` |

> **¿Y "elegir el stat" o "elegir la dificultad de los países"?** Con ESTA API no se puede:
> `POST /api/games` ignora todo menos `player`, y el `stat` lo sortea el servidor. Si en el
> examen la API lo acepta (leé la tabla del README), es solo agregarlo al body:
> `fetchJSON('/api/games', { method: 'POST', body: { player, stat } })` y un selector de
> botones en el inicio (como los de dificultad de V11). La "dificultad" que sí se puede
> hacer del lado del cliente es V11 (vidas) o V12 (tiempo).

---

### V1. Títulos y estilo del header — `app/_layout.jsx`

Piden: "en el header del inicio tiene que decir _Bienvenido_", colores, botón atrás con texto.
Teoría: [tema 7](../../clase/07-expo-router-archivos-y-layouts.md).

```jsx
import { DefaultTheme, Stack, ThemeProvider } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

export default function RootLayout() {
  return (
    <ThemeProvider value={DefaultTheme}>
      {/* screenOptions: opciones para TODAS las pantallas del Stack. */}
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: '#000099' },
          headerTintColor: 'white',
          headerTitleAlign: 'center',
        }}
      >
        <Stack.Screen name="index" options={{ title: 'Bienvenido' }} />
        <Stack.Screen
          name="games/[id]"
          options={{ title: 'Partida', headerBackTitle: 'Inicio' }}
        />
      </Stack>
      <StatusBar style="light" />
    </ThemeProvider>
  );
}
```

Título dinámico con el nombre del jugador, en `app/games/[id].jsx` (reemplaza la línea de `title`):

```jsx
  // Título dinámico: mientras carga, el id; después, el nombre del jugador.
  const title = (
    <Stack.Screen
      options={{ title: game ? `Partida de ${game.player}` : `Partida ${id}` }}
    />
  );
```

Otras opciones útiles: `headerShown: false` (sin header), `headerBackVisible: false` (sin
flecha), `headerRight: () => <Text>…</Text>`, `presentation: 'modal'`.
Probado: `/` dice "Bienvenido"; `/games/2` dice "Partida de Niki Lauda".

### V2. Ranking con fecha formateada y medallas — `common/format.js` + `app/index.jsx`

`common/format.js` (agregar al final):

```js
/** "2026-10-20T13:04:40.000Z" → "20/10/2026 10:04" (hora local del dispositivo).
 * A mano, igual que formatNumber, para que salga igual en todas las plataformas.
 */
export function formatDate(isoString) {
  if (!isoString) {
    return '—';
  }
  const date = new Date(isoString);
  const pad = (n) => String(n).padStart(2, '0');
  const day = `${pad(date.getDate())}/${pad(date.getMonth() + 1)}/${date.getFullYear()}`;
  return `${day} ${pad(date.getHours())}:${pad(date.getMinutes())}`;
}
```

`app/index.jsx`: importar `import { formatDate } from '@/common/format';` y reemplazar el `renderItem`:

```jsx
        renderItem={({ item, index }) => (
          <View style={[styles.row, homeStyles.rankingRow, index === 0 && homeStyles.firstRow]}>
            {/* Medalla para los 3 primeros; número para el resto. */}
            <Text style={homeStyles.position}>{MEDALS[index] ?? index + 1}</Text>
            <View style={{ flex: 1 }}>
              <Text style={styles.normalText}>{item.player}</Text>
              <Text style={homeStyles.date}>{formatDate(item.finishedAt)}</Text>
            </View>
            <Text style={styles.normalText}>{item.score} pts</Text>
          </View>
        )}
```

y arriba de `homeStyles` (fuera del componente):

```js
const MEDALS = ['🥇', '🥈', '🥉'];

const homeStyles = {
  firstRow: { backgroundColor: '#fff6d5' },
  date: { fontSize: 12, color: '#777' },
  // ...rankingRow igual que antes...
  position: { width: 32, fontSize: 16, fontWeight: 'bold' },
};
```

`new Date(isoString)` **con argumento** no es impuro (lint ok); `new Date()` / `Date.now()` en
el render sí. Probado: "🥇 Ayrton Senna 20/10/2026 10:04 7 pts" (13:04 UTC → 10:04 en Uruguay).
Teoría: [tema 13](../../clase/13-formatear-datos.md).

### V3. Ranking tocable → detalle de la partida — `app/index.jsx`

La pantalla `/games/:id` ya muestra una partida terminada → solo hay que linkear. Imports:
`import { FlatList, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';` y
`import { Link, useFocusEffect, useRouter } from 'expo-router';`.

```jsx
        renderItem={({ item, index }) => (
          // asChild: el Link no dibuja nada propio, le pasa el onPress al Pressable.
          // OJO: con asChild el hijo NO puede recibir un array de estilos
          // (expo-router tira error) → StyleSheet.flatten lo junta en uno.
          <Link href={`/games/${item.id}`} asChild>
            <Pressable style={StyleSheet.flatten([styles.row, homeStyles.rankingRow])}>
              <Text style={homeStyles.position}>{index + 1}</Text>
              <Text style={[styles.normalText, { flex: 1 }]}>{item.player}</Text>
              <Text style={styles.normalText}>{item.score} pts ›</Text>
            </Pressable>
          </Link>
        )}
```

Alternativa sin `Link`: `<Pressable onPress={() => router.push(`/games/${item.id}`)}>` (ahí
sí se puede usar array de estilos). Probado: tocar "Niki Lauda" → `/games/2` con Alemania vs
China, "Incorrecto", puntaje 4; atrás vuelve al inicio.

### V4. Pull-to-refresh en el ranking — `app/index.jsx`

```jsx
  const { data: ranking, isLoading: isRankingLoading, error: rankingError, refetch } =
    useFetchRanking();
```

```jsx
      <FlatList
        data={ranking}
        // Pull-to-refresh: tirar la lista hacia abajo vuelve a pedir el ranking.
        // `refreshing` tiene que ser un booleano (spinner arriba de la lista).
        refreshing={isRankingLoading}
        onRefresh={refetch}
        keyExtractor={(item) => String(item.id)}
        renderItem={/* igual */}
      />
```

En web no hay gesto de tirar → agregar un botón:

```jsx
      <View style={styles.row}>
        <Text style={styles.titleText}>Ranking</Text>
        {/* En web no hay gesto de "tirar para actualizar": botón aparte. */}
        <Button title="Actualizar" onPress={refetch} disabled={isRankingLoading} />
      </View>
```

Probado: creé y perdí una partida con `curl` por fuera de la app → "Actualizar" la trae.
Teoría: [tema 5](../../clase/05-listas-flatlist.md).

### V5. Ranking en pantalla aparte — Stack (`/ranking`) o Tabs

**V5a — Stack.** Archivo nuevo `app/ranking.jsx`:

```jsx
import { useCallback } from 'react';
import { FlatList, Text, View } from 'react-native';
import { useFocusEffect } from 'expo-router';
import { styles } from '@/common/styles';
import StatusMessage from '@/components/StatusMessage';
import { useFetchRanking } from '@/hooks/useFetchRanking';

export default function Ranking() {
  const { data: ranking, error, refetch } = useFetchRanking();

  // Si desde acá se abre una partida y se vuelve, refrescar.
  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [refetch]),
  );

  if (error) {
    return (
      <View style={styles.container}>
        <StatusMessage error={error} text="No se pudo cargar el ranking." onRetry={refetch} />
      </View>
    );
  }
  if (!ranking) {
    return (
      <View style={styles.container}>
        <StatusMessage loading text="Cargando ranking…" />
      </View>
    );
  }
  return (
    <FlatList
      contentContainerStyle={styles.container}
      data={ranking}
      keyExtractor={(item) => String(item.id)}
      ListEmptyComponent={
        <Text style={styles.normalText}>Todavía no hay partidas terminadas.</Text>
      }
      renderItem={({ item, index }) => (
        <View style={[styles.row, rankingStyles.row]}>
          <Text style={rankingStyles.position}>{index + 1}</Text>
          <Text style={[styles.normalText, { flex: 1 }]}>{item.player}</Text>
          <Text style={styles.normalText}>{item.score} pts</Text>
        </View>
      )}
    />
  );
}

const rankingStyles = {
  row: {
    justifyContent: 'flex-start',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  position: { width: 24, fontSize: 16, fontWeight: 'bold' },
};
```

En `_layout.jsx`: `<Stack.Screen name="ranking" options={{ title: 'Ranking' }} />`.
En `index.jsx` se borra todo lo del ranking (hook, `useFocusEffect`, `rankingContent`) y se agrega
`<Button title="Ver ranking 🏆" onPress={() => router.push('/ranking')} />`
(o `<Link href="/ranking">Ver ranking</Link>`).

**V5b — Tabs.** Mover `app/index.jsx` y `app/ranking.jsx` a `app/(tabs)/` (los paréntesis
hacen un **grupo**: no aparecen en la URL, siguen siendo `/` y `/ranking`) y crear
`app/(tabs)/_layout.jsx`:

```jsx
import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';

export default function TabsLayout() {
  return (
    <Tabs screenOptions={{ tabBarActiveTintColor: '#000099' }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Jugar',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="game-controller" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="ranking"
        options={{
          title: 'Ranking',
          tabBarIcon: ({ color, size }) => <Ionicons name="trophy" color={color} size={size} />,
        }}
      />
    </Tabs>
  );
}
```

`app/_layout.jsx` (la partida queda **fuera** de las tabs, encima):

```jsx
      <Stack>
        {/* El grupo (tabs) tiene su propio header (el de cada tab): ocultamos el del Stack. */}
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="games/[id]" options={{ title: 'Partida' }} />
      </Stack>
```

Reiniciar con `npx expo start -c` después de mover archivos. `router.dismissTo('/')` sigue
funcionando (probado). `@expo/vector-icons` ya está en las dependencias.
Teoría: [tema 7](../../clase/07-expo-router-archivos-y-layouts.md).

### V6. Recordar el último nombre — AsyncStorage en `app/index.jsx`

```jsx
import { useCallback, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const PLAYER_KEY = 'lastPlayer';
```

Dentro de `Home`, después de los hooks:

```jsx
  // Al montar: leer el último nombre guardado. El setState va dentro del
  // .then (cuando responde AsyncStorage), NO directo en el cuerpo del efecto
  // (eso es error de lint react-hooks/set-state-in-effect).
  useEffect(() => {
    AsyncStorage.getItem(PLAYER_KEY)
      .then((saved) => {
        // Si el usuario ya empezó a escribir, no le pisamos lo que escribió.
        if (saved) setPlayer((current) => current || saved);
      })
      .catch(() => {}); // si falla, simplemente arranca vacío
  }, []);
```

En `handlePlay`, antes del `createGame`:

```js
    // Guardar en el evento (no en un efecto). Si falla, se juega igual.
    AsyncStorage.setItem(PLAYER_KEY, trimmedPlayer).catch(() => {});
```

AsyncStorage: todo es **async** y guarda **solo strings** (objetos → `JSON.stringify` /
`JSON.parse`). En web usa `localStorage`. Probado: jugar como "Lucía", recargar → el input
ya dice "Lucía". Teoría: [tema 15](../../clase/15-asyncstorage.md).

### V7. Mejor puntaje personal

**V7a — Según el ranking (sin guardar nada)**, en `app/index.jsx` después de `canPlay`:

```js
  // Mejor puntaje del jugador SEGÚN EL RANKING (derivado, sin estado).
  // El ranking ya viene ordenado de mayor a menor → el primero que aparece es el mejor.
  const myBestIndex = trimmedPlayer
    ? (ranking ?? []).findIndex((g) => g.player.toLowerCase() === trimmedPlayer.toLowerCase())
    : -1;
  const myBest = myBestIndex >= 0 ? ranking[myBestIndex] : null;
```

```jsx
      {myBest && (
        <Text style={styles.normalText}>
          Tu mejor puntaje en el ranking: {myBest.score} (puesto {myBestIndex + 1})
        </Text>
      )}
```

(Limitación: solo ve el top 10.)

**V7b — Récord guardado en el dispositivo** (aunque no entre al top 10). Archivo nuevo
`common/storage.js`:

```js
import AsyncStorage from '@react-native-async-storage/async-storage';

// AsyncStorage guarda SOLO strings: los números se pasan con String()/Number().
function bestKey(player) {
  return `best:${player.trim().toLowerCase()}`;
}

/** Récord personal guardado en el dispositivo (0 si no hay). */
export async function loadBestScore(player) {
  const saved = await AsyncStorage.getItem(bestKey(player));
  return saved === null ? 0 : Number(saved);
}

export async function saveBestScore(player, score) {
  await AsyncStorage.setItem(bestKey(player), String(score));
}
```

En `app/games/[id].jsx`: importar `import { loadBestScore, saveBestScore } from '@/common/storage';`, y:

```js
  // { gameId, best, isNewRecord } cuando termina una partida.
  const [record, setRecord] = useState(null);
  // (después de roundResult)
  const recordInfo = record && String(record.gameId) === String(id) ? record : null;

  /** Al terminar la partida: comparar con el récord guardado y actualizarlo. */
  async function updateRecord(finishedGame) {
    const previousBest = await loadBestScore(finishedGame.player).catch(() => 0);
    const isNewRecord = finishedGame.score > previousBest;
    if (isNewRecord) {
      await saveBestScore(finishedGame.player, finishedGame.score).catch(() => {});
    }
    setRecord({
      gameId: finishedGame.id,
      best: Math.max(previousBest, finishedGame.score),
      isNewRecord,
    });
  }
```

En `handleGuess`, después de `setResult(response);`:

```js
      if (response.game.status !== 'playing') {
        // En el handler (no en un efecto): es la respuesta a una acción del usuario.
        await updateRecord(response.game);
      }
```

Y en el bloque de fin, debajo de "Puntaje final":

```jsx
          {recordInfo && (
            <Text style={styles.titleText}>
              {recordInfo.isNewRecord ? '🏆 ¡Nuevo récord personal!' : `Tu récord: ${recordInfo.best}`}
            </Text>
          )}
```

Probado: primera partida con 1 punto → "🏆 ¡Nuevo récord personal!"; la siguiente con 1 → "Tu récord: 1".

### V8. Validaciones extra del nombre — `app/index.jsx`

Arriba del componente:

```js
const MIN_LENGTH = 2;
const MAX_LENGTH = 20;
// \p{L} = cualquier letra (incluye tildes y ñ); la "u" final habilita \p{...}.
const VALID_NAME = /^[\p{L}0-9 .'-]+$/u;

/** Devuelve el mensaje de error del nombre, o null si es válido. */
function validatePlayer(name) {
  if (name === '') return null; // vacío: botón deshabilitado, sin mensaje rojo
  if (name.length < MIN_LENGTH) return `Mínimo ${MIN_LENGTH} caracteres.`;
  if (name.length > MAX_LENGTH) return `Máximo ${MAX_LENGTH} caracteres.`;
  if (!VALID_NAME.test(name)) return "Solo letras, números, espacios y . ' -";
  return null;
}
```

Reemplaza `trimmedPlayer` / `canPlay`:

```js
  // Además de trim, colapsar espacios repetidos: "Ana   Laura" → "Ana Laura".
  const trimmedPlayer = player.trim().replace(/\s+/g, ' ');
  const nameError = validatePlayer(trimmedPlayer); // derivado: nada de useState
  const canPlay = trimmedPlayer !== '' && !nameError && !isCreating;
```

En el `TextInput`: `autoCapitalize="words"` y `autoCorrect={false}` (si querés cortar en
seco: `maxLength={MAX_LENGTH}`, pero entonces el mensaje de "máximo" no se ve nunca). Debajo:

```jsx
      <Text style={homeStyles.counter}>
        {trimmedPlayer.length}/{MAX_LENGTH}
      </Text>
      {nameError && <Text style={styles.errorText}>{nameError}</Text>}
      {createError && (
        <Text style={styles.errorText}>
          {createError.status === 400
            ? 'La API rechazó el nombre (400).'
            : `No se pudo crear la partida (${createError.message}).`}
        </Text>
      )}
```

`counter: { alignSelf: 'flex-end', fontSize: 12, color: '#777' }` en `homeStyles`.
Probado: "A" → "Mínimo 2 caracteres."; "Pepe<script>" → error; 26 letras → "Máximo 20";
"Ana   Laura" → válido (9/20). Teoría: [tema 6](../../clase/06-formularios-textinput.md).

### V9. Mostrar población y superficie + verde/rojo según acierto — `components/CountryCard.jsx`

```jsx
import { Image, StyleSheet, Text, View } from 'react-native';
import { expoDevServerUri } from '@/common/utils';
import { formatNumber, STATS } from '@/common/format';

/** Tarjeta de un país con los DOS valores (población y superficie).
 *
 * - `stat`: el de la ronda → se resalta en negrita.
 * - `hidden`: el país siguiente mientras no se respondió (la API no manda
 *   sus valores, así que no hay nada que mostrar: "?").
 * - `outcome`: 'correct' | 'wrong' | undefined → borde verde / rojo.
 */
export default function CountryCard({ country, stat, hidden, outcome }) {
  return (
    <View
      style={[
        cardStyles.card,
        outcome === 'correct' && cardStyles.correct,
        outcome === 'wrong' && cardStyles.wrong,
      ]}
    >
      <Image
        source={{ uri: expoDevServerUri(country.flagUrl) }}
        style={cardStyles.flag}
        resizeMode="contain"
      />
      <Text style={cardStyles.name}>{country.name}</Text>
      {Object.keys(STATS).map((key) => (
        <Text key={key} style={key === stat ? cardStyles.highlighted : cardStyles.other}>
          {hidden ? '?' : formatNumber(country[key])} {STATS[key].unit}
        </Text>
      ))}
    </View>
  );
}

const cardStyles = StyleSheet.create({
  card: {
    flex: 1,
    alignItems: 'center',
    gap: 6,
    padding: 12,
    borderWidth: 2,
    borderColor: '#ccc',
    borderRadius: 8,
    backgroundColor: 'white',
  },
  correct: { borderColor: '#008800', backgroundColor: '#e8f5e9' },
  wrong: { borderColor: '#cc0000', backgroundColor: '#fdecea' },
  flag: { width: 80, height: 54 },
  name: { fontSize: 18, fontWeight: 'bold', textAlign: 'center' },
  highlighted: { fontSize: 18, fontWeight: 'bold' },
  other: { fontSize: 14, color: '#777' },
});
```

En `[id].jsx`, la segunda tarjeta:

```jsx
        {otherCountry && (
          <CountryCard
            country={otherCountry}
            stat={stat}
            hidden={hideOther}
            // Color solo cuando hay respuesta (recién respondida o partida terminada).
            outcome={roundResult ? (roundResult.correct ? 'correct' : 'wrong') : isOver ? 'wrong' : undefined}
          />
        )}
```

Para colorear los **botones** (como en el parcial 2026sem1): guardar `result.guess` y pasar
`style={result?.guess === 'higher' ? (result.correct ? greenButton : redButton) : greyButton}` al `Button`.
Probado (captura): Finlandia con borde verde, "5.530.719 habitantes" en negrita y "338.424 km²" en gris.

### V10. Historial de rondas de la partida actual — `app/games/[id].jsx`

`import { formatNumber, STATS } from '@/common/format';`

```js
  // Todas las respuestas de la sesión: [{ ...respuestaDelGuess, previous }].
  const [history, setHistory] = useState([]);
  // (después de roundResult)
  // Solo las rondas de ESTA partida (mismo truco: derivado, sin efecto que borre).
  const rounds = history.filter((round) => String(round.game.id) === String(id));
```

En `handleGuess`, después de `setResult(response);`:

```js
      // La respuesta no trae contra qué país se comparó: lo guardamos nosotros.
      setHistory((previousHistory) => [...previousHistory, { ...response, previous: game.current }]);
```

Al final del `ScrollView`:

```jsx
      {rounds.length > 0 && (
        <View style={{ gap: 4 }}>
          <Text style={styles.titleText}>Rondas</Text>
          {/* .map y no FlatList: ya estamos dentro de un ScrollView. */}
          {rounds.map((round, index) => (
            <Text key={index} style={styles.normalText}>
              {round.correct ? '✅' : '❌'} {index + 1}. {round.revealed.name} (
              {formatNumber(round.revealed[round.stat])}) {round.guess === 'higher' ? 'más' : 'menos'}{' '}
              {STATS[round.stat].question} que {round.previous.name} (
              {formatNumber(round.previous[round.stat])})
            </Text>
          ))}
        </View>
      )}
```

Limitación: la API no guarda las rondas → al recargar el historial se pierde (si lo piden
persistente: guardarlo en AsyncStorage con la clave `history:${id}`). Probado: "✅ 1. Costa
Rica (5.094.114) más habitantes que Djibouti (988.002) | ❌ 2. …"; Jugar de nuevo → lista vacía.

### V11. Vidas por dificultad (lógica en el cliente) — `index.jsx` + `[id].jsx`

La API corta al primer error, así que las vidas son del cliente: **perder una partida = perder
una vida y seguir en una partida nueva**. Vidas y total van **en la URL**
(`/games/6?lives=2&max=3&total=4`) → sobreviven a F5. Teoría: [tema 8](../../clase/08-navegar-y-parametros.md), [tema 12](../../clase/12-logica-de-juego-y-estado.md).

`app/index.jsx`:

```jsx
const DIFFICULTIES = [
  { label: 'Fácil', lives: 3 },
  { label: 'Medio', lives: 2 },
  { label: 'Difícil', lives: 1 },
];
```

```jsx
  async function handlePlay(lives) {
    if (!canPlay) return;
    const game = await createGame(trimmedPlayer);
    if (game) {
      // Forma objeto: los params que no son parte de la ruta van al query
      // → /games/6?lives=3&max=3&total=0
      router.push({
        pathname: '/games/[id]',
        params: { id: game.id, lives, max: lives, total: 0 },
      });
    }
  }
```

En el JSX, el botón Jugar se reemplaza por (y `onSubmitEditing={() => handlePlay(2)}`):

```jsx
      <View style={[styles.row, { justifyContent: 'center' }]}>
        {DIFFICULTIES.map((difficulty) => (
          <Button
            key={difficulty.label}
            title={`${difficulty.label} (${'❤️'.repeat(difficulty.lives)})`}
            onPress={() => handlePlay(difficulty.lives)}
            disabled={!canPlay}
          />
        ))}
      </View>
```

`app/games/[id].jsx`:

```js
  // Los params del query también llegan acá, y TODOS son strings (o undefined).
  const { id, lives: livesParam, max: maxParam, total: totalParam } = useLocalSearchParams();
  const maxLives = Number(maxParam) || 1;
  const lives = Math.min(Number(livesParam) || 1, maxLives); // vidas al empezar ESTA partida
  const total = Number(totalParam) || 0; // puntos acumulados de las partidas anteriores
```

`handlePlayAgain` se reemplaza por:

```js
  /** Crea otra partida en la API y la abre con las vidas/total que se indiquen. */
  async function goToNewGame(nextLives, nextTotal) {
    const newGame = await createGame(game?.player);
    if (newGame) {
      router.replace({
        pathname: '/games/[id]',
        params: { id: newGame.id, lives: nextLives, max: maxLives, total: nextTotal },
      });
    }
  }
```

Después de `finalStatus`:

```js
  const livesLeft = isOver && finalStatus === 'lost' ? lives - 1 : lives;
  const totalScore = total + score;
  const hearts = '❤️'.repeat(livesLeft) + '💀'.repeat(maxLives - livesLeft);
```

Encabezado: `<Text style={styles.normalText}>{hearts}</Text>` y
`Puntaje: {score}{total > 0 ? ` (total ${totalScore})` : ''}`. En el bloque de fin:

```jsx
          <Text style={styles.normalText}>
            {livesLeft > 0
              ? `Perdiste una vida. Te ${livesLeft === 1 ? 'queda 1' : `quedan ${livesLeft}`}.`
              : `Fin del juego. Puntaje total: ${totalScore}`}
          </Text>
          <View style={styles.row}>
            {livesLeft > 0 ? (
              <Button
                title={isCreating ? 'Creando…' : 'Seguir'}
                onPress={() => goToNewGame(livesLeft, totalScore)}
                disabled={isCreating}
              />
            ) : (
              <Button
                title={isCreating ? 'Creando…' : 'Jugar de nuevo'}
                onPress={() => goToNewGame(maxLives, 0)}
                disabled={isCreating}
              />
            )}
            <Button title="Volver al inicio" onPress={handleGoHome} style={styles.dangerButton} />
          </View>
```

Ojo: el ranking de la API sigue contando cada partida por separado (no el total).
Probado: Medio → ❤️❤️; error → ❤️💀 "Te queda 1" + Seguir → `?lives=1&max=2&total=0`; otro
error → 💀💀 "Fin del juego. Puntaje total: 1"; F5 mantiene todo; Jugar de nuevo → ❤️❤️.

### V12. Temporizador por ronda — `components/RoundTimer.jsx` + `[id].jsx`

Archivo nuevo `components/RoundTimer.jsx`:

```jsx
import { useEffect, useState } from 'react';
import { Text } from 'react-native';

/** Cuenta regresiva. Llama a `onTimeout` UNA vez cuando llega a 0.
 *
 * Para reiniciarla en cada ronda NO se resetea con un efecto: el padre le
 * cambia la `key` y React la monta de nuevo (estado nuevo = `seconds`).
 */
export default function RoundTimer({ seconds, onTimeout }) {
  const [secondsLeft, setSecondsLeft] = useState(seconds);

  useEffect(() => {
    let left = seconds;
    // El setState va dentro del callback del intervalo (asíncrono): OK para el lint.
    const intervalId = setInterval(() => {
      left -= 1;
      setSecondsLeft(left);
      if (left <= 0) {
        clearInterval(intervalId);
        onTimeout();
      }
    }, 1000);
    // Limpieza: al desmontar (se respondió, se fue de la pantalla) se corta.
    return () => clearInterval(intervalId);
  }, [seconds, onTimeout]);

  return (
    <Text style={{ fontSize: 20, fontWeight: 'bold', color: secondsLeft <= 3 ? '#cc0000' : '#222' }}>
      ⏱ {secondsLeft} s
    </Text>
  );
}
```

`app/games/[id].jsx` (imports: `useCallback` de react y `RoundTimer`):

```js
const SECONDS_PER_ROUND = 10;   // fuera del componente
```

```js
  // Ronda en la que se acabó el tiempo (o null).
  const [timedOutRound, setTimedOutRound] = useState(null);
  // (después de roundResult)
  // Identificador de la ronda: cambia con cada partida y con cada acierto.
  // (`game` puede ser null mientras carga.)
  const roundKey = game ? `${game.id}-${game.score}` : null;
  const timedOut = timedOutRound !== null && timedOutRound === roundKey;
  // useCallback: si la función cambiara en cada render, el efecto del timer
  // se reiniciaría en cada render y nunca llegaría a 0.
  const handleTimeout = useCallback(() => setTimedOutRound(roundKey), [roundKey]);
```

Cambios en los derivados y el JSX:

```js
  const isOver = timedOut || (roundResult ? roundResult.game.status !== 'playing' : finishedOnEntry);
  // verdict: if (timedOut) verdict = 'Incorrecto'; else if (roundResult) …
```

```jsx
      {!roundResult && game.status === 'playing' && !timedOut && (
        <View style={[styles.row, { justifyContent: 'center' }]}>
          {/* key = ronda → cada ronda nueva monta un timer nuevo (arranca de 10). */}
          <RoundTimer key={roundKey} seconds={SECONDS_PER_ROUND} onTimeout={handleTimeout} />
          {/* …botones Más / Menos igual… */}
        </View>
      )}
```

y en el texto de fin: `{timedOut ? '⏱ ¡Se acabó el tiempo! ' : ''}`.
Limitación: la partida queda `playing` en la API (si recargás, se puede seguir). Si piden que
cuente como error en la API, no hay endpoint para eso; lo más parecido es borrarla
(`DELETE`) o avisarlo. Probado: a los 10 s → "¡Se acabó el tiempo!" sin botones; tras un
acierto + Siguiente vuelve a 10 s; Jugar de nuevo arranca de 10.
Teoría: [tema 9](../../clase/09-ciclo-de-vida-pantallas.md) (efectos con limpieza).

### V13. Pantalla de resultado aparte — `app/results/[id].jsx`

Archivo nuevo `app/results/[id].jsx` (pide la partida a la API → anda con F5 y desde el ranking):

```jsx
import { ScrollView, Text, View } from 'react-native';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { STATS } from '@/common/format';
import { styles } from '@/common/styles';
import Button from '@/components/Button';
import CountryCard from '@/components/CountryCard';
import StatusMessage from '@/components/StatusMessage';
import { useCreateGame } from '@/hooks/useCreateGame';
import { useFetchGame } from '@/hooks/useFetchGame';

/** /results/:id — Resumen de una partida terminada. Pide la partida a la API,
 * así que funciona también al recargar o al entrar desde el ranking. */
export default function Result() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { data: game, error, refetch } = useFetchGame(id);
  const { createGame, isCreating, error: createError } = useCreateGame();

  async function handlePlayAgain() {
    // `game?.` y no `game.`: con React Compiler esta función se arma ANTES de
    // los return de abajo, cuando `game` todavía puede ser null (ver trampas).
    const newGame = await createGame(game?.player);
    if (newGame) {
      router.replace(`/games/${newGame.id}`);
    }
  }

  if (error) {
    return (
      <View style={styles.container}>
        <StatusMessage
          error={error}
          text={error.status === 404 ? `La partida ${id} no existe.` : 'No se pudo cargar.'}
          onRetry={error.status === 404 ? undefined : refetch}
        />
        <Button title="Volver al inicio" onPress={() => router.dismissTo('/')} />
      </View>
    );
  }
  if (!game) {
    return (
      <View style={styles.container}>
        <StatusMessage loading text="Cargando resultado…" />
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Stack.Screen options={{ title: `Resultado de ${game.player}` }} />
      <Text style={[styles.titleText, { textAlign: 'center' }]}>
        {game.status === 'won' ? '🏆 ¡Ganaste!' : 'Fin de la partida'}
      </Text>
      <Text style={[styles.normalText, { textAlign: 'center', fontSize: 40 }]}>{game.score}</Text>
      <Text style={[styles.normalText, { textAlign: 'center' }]}>
        {game.score === 1 ? 'acierto' : 'aciertos'}
      </Text>
      {game.next && (
        <>
          <Text style={[styles.normalText, { textAlign: 'center' }]}>
            Erraste en: ¿{game.next.name} tiene más o menos {STATS[game.stat].question} que{' '}
            {game.current.name}?
          </Text>
          <View style={[styles.row, { alignItems: 'stretch' }]}>
            <CountryCard country={game.current} stat={game.stat} />
            <CountryCard country={game.next} stat={game.stat} />
          </View>
        </>
      )}
      <View style={[styles.row, { justifyContent: 'center' }]}>
        <Button
          title={isCreating ? 'Creando…' : 'Jugar de nuevo'}
          onPress={handlePlayAgain}
          disabled={isCreating}
        />
        <Button title="Inicio" onPress={() => router.dismissTo('/')} style={styles.dangerButton} />
      </View>
      {createError && <Text style={styles.errorText}>No se pudo crear la partida.</Text>}
    </ScrollView>
  );
}
```

`_layout.jsx`: `<Stack.Screen name="results/[id]" options={{ title: 'Resultado' }} />`.
En `app/games/[id].jsx`: importar `Redirect` de `expo-router` y, después de los `return` de error/carga:

```jsx
  // Si la partida ya estaba terminada al entrar, directo al resultado.
  // <Redirect> navega (con replace) apenas se dibuja.
  if (!roundResult && game.status !== 'playing') {
    return <Redirect href={`/results/${id}`} />;
  }
```

y el bloque de fin se reduce a:

```jsx
      {isOver && (
        <View style={[styles.row, { justifyContent: 'center' }]}>
          <Button title="Ver resultado" onPress={() => router.replace(`/results/${id}`)} />
        </View>
      )}
```

(sacar `handlePlayAgain`, `useCreateGame` y `finalStatus` de `[id].jsx` → si no, `no-unused-vars`).
Si en vez de pedirla a la API te piden pasar datos: `router.replace({ pathname: '/end', params: { score, player } })`
y en `app/end.jsx` `const { score, player } = useLocalSearchParams();` (strings). Probado:
`/games/2` redirige a `/results/2`; `/results/9999` → "no existe (error 404)"; perder → Ver
resultado → Jugar de nuevo → partida nueva. **Sin el `?.` esta pantalla explotaba** (trampa 4).

### V14. Borrar partida (DELETE) con confirmación — `common/confirm.js` + `app/index.jsx`

Archivo nuevo `common/confirm.js` (sirve también para V15):

```js
import { Alert, Platform } from 'react-native';

/** Pregunta "¿Seguro?" y devuelve una Promise<boolean>.
 *
 * `Alert.alert` con botones NO funciona en web (react-native-web no lo
 * implementa): ahí se usa `window.confirm`. En Android/iOS, `Alert.alert`.
 *
 *   if (await confirmAction('Borrar', '¿Seguro?')) { ... }
 */
export function confirmAction(title, message) {
  if (Platform.OS === 'web') {
    return Promise.resolve(window.confirm(`${title}\n\n${message}`));
  }
  return new Promise((resolve) => {
    Alert.alert(
      title,
      message,
      [
        { text: 'Cancelar', style: 'cancel', onPress: () => resolve(false) },
        { text: 'Aceptar', style: 'destructive', onPress: () => resolve(true) },
      ],
      { cancelable: true, onDismiss: () => resolve(false) },
    );
  });
}
```

`app/index.jsx` (imports `confirmAction` y `fetchJSON`):

```jsx
  const { data: ranking, setData: setRanking, error: rankingError, refetch } =
    useFetchRanking();
  const [deletingId, setDeletingId] = useState(null);
  const [deleteError, setDeleteError] = useState(null);

  async function handleDelete(item) {
    const ok = await confirmAction('Borrar partida', `¿Borrar la partida de ${item.player}?`);
    if (!ok) return;
    setDeletingId(item.id);
    setDeleteError(null);
    try {
      await fetchJSON(`/api/games/${item.id}`, { method: 'DELETE' });
      // Sacarla de la lista local al toque (sin esperar otro GET)...
      setRanking((list) => list.filter((game) => game.id !== item.id));
      // ...y pedir el ranking de nuevo: puede "subir" la partida número 11.
      refetch();
    } catch (err) {
      setDeleteError(err);
    } finally {
      setDeletingId(null);
    }
  }
```

En el `renderItem`, después del puntaje:

```jsx
            <Button
              title={deletingId === item.id ? '…' : '🗑'}
              onPress={() => handleDelete(item)}
              disabled={deletingId !== null}
              style={styles.dangerButton}
            />
```

y arriba de la lista:

```jsx
      {deleteError && (
        <Text style={styles.errorText}>
          {deleteError.status === 404
            ? 'Esa partida ya no existe.'
            : `No se pudo borrar (${deleteError.message}).`}
        </Text>
      )}
```

Probado: cancelar → no pasa nada; aceptar → desaparece "Michael Schumacher" del ranking.
(Si piden un PATCH/PUT: mismo patrón con `method: 'PATCH', body: { ... }`.)

### V15. Confirmar antes de abandonar una partida en curso — `app/games/[id].jsx`

Usa `common/confirm.js` de V14. Imports: `Pressable` de react-native y `confirmAction`.

```js
  // (después de roundResult) ¿La partida sigue en curso? (contando la respuesta recién recibida)
  const finished = roundResult ? roundResult.game.status !== 'playing' : game?.status !== 'playing';
  const inProgress = game !== null && !finished;

  async function handleLeave() {
    if (inProgress) {
      const ok = await confirmAction(
        'Abandonar partida',
        'La partida queda sin terminar. ¿Salir igual?',
      );
      if (!ok) return;
    }
    router.dismissTo('/');
  }
```

El `title` pasa a reemplazar la flecha de "atrás":

```jsx
  const title = (
    <Stack.Screen
      options={{
        title: `Partida ${id}`,
        // Reemplazar la flecha "atrás" por un botón propio que pregunta antes.
        headerBackVisible: false,
        headerLeft: () => (
          <Pressable onPress={handleLeave} style={{ paddingHorizontal: 12 }}>
            <Text style={{ fontSize: 16, color: '#000099' }}>‹ Salir</Text>
          </Pressable>
        ),
        // iOS: sin gesto de deslizar para volver mientras se juega.
        gestureEnabled: !inProgress,
      }}
    />
  );
```

Y un botón visible mientras se juega:

```jsx
      {inProgress && (
        <View style={[styles.row, { justifyContent: 'center' }]}>
          <Button title="Abandonar" onPress={handleLeave} style={styles.dangerButton} />
        </View>
      )}
```

No cubre el botón físico "atrás" de Android (para eso: `BackHandler` en un efecto). **No** uses
`usePreventRemove` + `navigation.dispatch(data.action)`: lo probé y en web el confirm se repite
en loop. Probado: "‹ Salir" con cancelar → se queda; "Abandonar" con aceptar → inicio.

### V16. Tema oscuro con Context (+ AsyncStorage) — `context/` + `_layout.jsx`

Dos archivos (contexto + hook en `.js`, Provider en `.jsx`, como en P2).
Teoría: [tema 14](../../clase/14-context-en-rn.md).

`context/ThemeContext.js`:

```js
import { createContext, useContext } from 'react';

export const COLORS = {
  light: { background: '#f2f2f2', card: 'white', text: '#222', muted: '#666', border: '#ccc' },
  dark: { background: '#121212', card: '#1e1e1e', text: '#eee', muted: '#aaa', border: '#444' },
};

export const ThemeContext = createContext(null);

/** `const { scheme, colors, toggleScheme } = useAppTheme();` */
export function useAppTheme() {
  const value = useContext(ThemeContext);
  if (!value) {
    throw new Error('useAppTheme tiene que usarse dentro de <AppThemeProvider>');
  }
  return value;
}
```

`context/AppThemeProvider.jsx`:

```jsx
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { COLORS, ThemeContext } from './ThemeContext';

const SCHEME_KEY = 'scheme';

export default function AppThemeProvider({ children }) {
  // Arranca SIEMPRE en 'light' (ver trampa de hidratación en web) y después
  // carga lo que el usuario eligió la última vez.
  const [scheme, setScheme] = useState('light');

  useEffect(() => {
    AsyncStorage.getItem(SCHEME_KEY)
      .then((saved) => {
        if (saved === 'light' || saved === 'dark') setScheme(saved);
      })
      .catch(() => {});
  }, []);

  function toggleScheme() {
    const next = scheme === 'dark' ? 'light' : 'dark';
    setScheme(next);
    AsyncStorage.setItem(SCHEME_KEY, next).catch(() => {}); // guardar en el evento
  }

  return (
    <ThemeContext.Provider value={{ scheme, colors: COLORS[scheme], toggleScheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
```

`app/_layout.jsx`:

```jsx
import { Pressable, Text } from 'react-native';
import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import AppThemeProvider from '@/context/AppThemeProvider';
import { useAppTheme } from '@/context/ThemeContext';

export default function RootLayout() {
  return (
    <AppThemeProvider>
      <ThemedStack />
    </AppThemeProvider>
  );
}

/** Componente aparte: para usar useAppTheme() hay que estar DENTRO del Provider. */
function ThemedStack() {
  const { scheme, toggleScheme } = useAppTheme();
  return (
    // El ThemeProvider de navegación pinta header y fondo de las pantallas.
    <ThemeProvider value={scheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack
        screenOptions={{
          headerRight: () => (
            <Pressable onPress={toggleScheme} style={{ paddingHorizontal: 12 }}>
              <Text style={{ fontSize: 20 }}>{scheme === 'dark' ? '☀️' : '🌙'}</Text>
            </Pressable>
          ),
        }}
      >
        <Stack.Screen name="index" options={{ title: 'Higher / Lower' }} />
        <Stack.Screen name="games/[id]" options={{ title: 'Partida' }} />
      </Stack>
      <StatusBar style={scheme === 'dark' ? 'light' : 'dark'} />
    </ThemeProvider>
  );
}
```

En cada pantalla/componente: `const { colors } = useAppTheme();` y combinar estilos:
`style={[styles.container, { backgroundColor: colors.background }]}`,
`style={[styles.normalText, { color: colors.text }]}`, en el `TextInput`
`style={[styles.input, { backgroundColor: colors.card, color: colors.text, borderColor: colors.border }]}`
y `placeholderTextColor={colors.muted}`; en `CountryCard` `backgroundColor: colors.card`.
**Ojo**: `styles.normalText` tiene `color: '#222'` fijo y no hay herencia → hay que pisarlo en
**cada** `Text` (si no, texto oscuro sobre fondo negro). Probado: 🌙 → oscuro, se guarda
(`localStorage.scheme = "dark"`) y se mantiene al recargar.

### V17. Emoji vs imagen según `Platform.OS` + vibración — `CountryCard.jsx` + `[id].jsx`

Teoría: [tema 16](../../clase/16-plataforma-y-extras.md).
`components/CountryCard.jsx` (importar `Platform`):

```jsx
      {/* Web (Windows no dibuja emojis de banderas) → imagen; celular → emoji. */}
      {Platform.OS === 'web' ? (
        <Image
          source={{ uri: expoDevServerUri(country.flagUrl) }}
          style={cardStyles.flag}
          resizeMode="contain"
        />
      ) : (
        <Text style={cardStyles.emoji}>{country.flag}</Text>
      )}
```

```js
  card: {
    // Sombra: iOS usa shadow*, Android usa elevation, web acepta boxShadow.
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOpacity: 0.15, shadowRadius: 4, shadowOffset: { width: 0, height: 2 } },
      android: { elevation: 3 },
      web: { boxShadow: '0 2px 4px rgba(0, 0, 0, 0.15)' },
    }),
    flex: 1,
    // ...resto igual
  },
  emoji: { fontSize: 48 },
```

`app/games/[id].jsx` — vibración al responder (`expo-haptics` ya está instalado):

```js
import { Platform, ScrollView, Text, View } from 'react-native';
import * as Haptics from 'expo-haptics';
```

```js
      setResult(response);
      // Vibración de éxito / error (solo en el celular).
      if (Platform.OS !== 'web') {
        Haptics.notificationAsync(
          response.correct
            ? Haptics.NotificationFeedbackType.Success
            : Haptics.NotificationFeedbackType.Error,
        );
      }
```

También existen archivos por plataforma: `CountryCard.web.jsx` / `CountryCard.native.jsx` y
Metro elige solo. Probado: en web 2 `<img>` y la sombra aplicada; el bundle de Android compila.

---

## 8. Teoría relacionada (carpeta `clase/`)

| Tema | Para qué en este parcial |
|---|---|
| [01 Anatomía del proyecto Expo](../../clase/01-anatomia-proyecto-expo.md) | workspace raíz/mobile, `app/`, `@/` alias, `npm start` |
| [02 React que sigue igual](../../clase/02-react-que-sigue-igual.md) | estado, props, reglas de los hooks, listas con `key` |
| [03 Componentes core](../../clase/03-componentes-core.md) | `View`, `Text`, `Image`, `Pressable`, `ScrollView`, `ActivityIndicator` |
| [04 Estilos: StyleSheet y Flexbox](../../clase/04-estilos-stylesheet-flexbox.md) | `styles.row`, arrays de estilos, `flex: 1` en las tarjetas |
| [05 Listas con FlatList](../../clase/05-listas-flatlist.md) | ranking, `keyExtractor`, pull-to-refresh (V4) |
| [06 Formularios con TextInput](../../clase/06-formularios-textinput.md) | nombre del jugador, validaciones (V8) |
| [07 Expo Router: archivos y layouts](../../clase/07-expo-router-archivos-y-layouts.md) | `_layout.jsx`, `[id].jsx`, `Stack.Screen`, Tabs (V5) |
| [08 Navegar y parámetros](../../clase/08-navegar-y-parametros.md) | `push`/`replace`/`dismissTo`, `useLocalSearchParams`, params en el query (V11) |
| [09 Ciclo de vida de pantallas](../../clase/09-ciclo-de-vida-pantallas.md) | `useFocusEffect`, efectos con limpieza (V12) |
| [10 API: fetchJSON y API routes](../../clase/10-api-fetchjson-y-api-routes.md) | `fetchJSON`, `error.status`, `expoDevServerUri`, `+api.js` |
| [11 Hooks de datos](../../clase/11-hooks-de-datos.md) | `useFetchJSON`, `useCreateGame`, `ignore`, `refetch` |
| [12 Lógica de juego y estado](../../clase/12-logica-de-juego-y-estado.md) | estado derivado por id, `result.stat`, vidas (V11) |
| [13 Formatear datos](../../clase/13-formatear-datos.md) | `formatNumber`, `formatDate` (V2) |
| [14 Context en RN](../../clase/14-context-en-rn.md) | tema oscuro (V16) |
| [15 AsyncStorage](../../clase/15-asyncstorage.md) | último nombre (V6), récord (V7), tema (V16) |
| [16 Plataforma y extras](../../clase/16-plataforma-y-extras.md) | `Platform.OS`, `Alert` vs `window.confirm`, haptics (V14, V17) |
| [17 Lint y React Compiler](../../clase/17-lint-y-react-compiler.md) | `set-state-in-effect`, purity, refs, trampa del `?.` |
| [18 Lectura guiada del parcial](../../clase/18-lectura-guiada-parcial.md) | cómo leer el enunciado y planificar las 2 h |
