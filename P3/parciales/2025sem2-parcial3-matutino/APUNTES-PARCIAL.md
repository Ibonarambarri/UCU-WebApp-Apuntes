# Apuntes: Parcial 3 - 2025sem2 (matutino) - Trivia "¿mapa y bandera del mismo país?" (RESUELTO)

> Formato 2025sem2 de la prueba 3: plantilla Expo Router (SDK 54) con la API mock
> **dentro** del mismo proyecto (`app/api/...+api.js`). Las 4 pruebas de 2025sem2
> (2 simulacros + 2 parciales) son la MISMA app de trivia de países con distinta
> pregunta: si entendés una, tenés las cuatro.

## 0. Cómo correrlo

```bash
cd P3/parciales/2025sem2-parcial3-matutino
npm install
npm run web            # = expo start --web  → abre http://localhost:8081
# o en otro puerto:  npx expo start --web --port 8092
npm run lint           # tiene que salir SIN nada
```

- La API y las imágenes las sirve el mismo `expo start` (no hay otro servidor): `curl localhost:8081/api/countries/random?n=2`.
- En el celular (Expo Go) también anda porque las URLs se arman con `expoDevServerUri` (ver §3.6).
- La API **no escribe** nada: no hay que restaurar datos.

## 1. Qué pide el enunciado → dónde está resuelto

| Requisito | Dónde | Cómo |
|---|---|---|
| Header de `/` dice "Bienvenido" (no "index") | `app/_layout.jsx` | `<Stack.Screen name="index" options={{ title: 'Bienvenido' }} />` |
| Pantalla nueva en el stack con título "Trivia de Países" y back button | `app/_layout.jsx` + `app/game.jsx` | `<Stack.Screen name="game" options={{ title: 'Trivia de Países' }} />`; el back lo pone solo el Stack |
| Ruta `/game` | `app/game.jsx` | Archivo = ruta (file-based routing). Borré `app/trivia/` de la plantilla |
| Pedir el nombre | `app/index.jsx` | `TextInput` controlado (`value` + `onChangeText`) |
| 3 botones Fácil (9) / Medio (6) / Difícil (3 vidas) | `app/index.jsx` | Array `NIVELES` + `.map` → `router.push({ pathname: '/game', params: { nombre, vidas } })` |
| Nombre y vidas en la otra vista | `app/game.jsx` | `useLocalSearchParams()` → **strings**, `Number(params.vidas)` |
| Mapa de un país al azar + bandera del mismo u otro (50%) | `app/game.jsx` → `pedirPregunta()` | `random?n=2` + `Math.random() < 0.5` |
| ❤️ por vida que queda, 💀 por vida perdida | `app/game.jsx` | `'💀'.repeat(perdidas) + '❤️'.repeat(quedan)` |
| Botones Sí / No + Salir | `app/game.jsx` | `TouchableOpacity`; Salir → `volverAlInicio()` |
| Al responder: decir bien/mal, ajustar puntaje, Salir → Continuar | `app/game.jsx` → `responder()` | Estado `respuesta` (`null`/`'si'`/`'no'`); botón apretado verde o rojo; render condicional del botón |
| Continuar → otra pregunta o Fin si no quedan vidas | `app/game.jsx` → `continuar()` | `setRonda(ronda + 1)` dispara el `useEffect`; sin vidas → `setTerminado(true)` |
| Vista Fin: felicita, vidas con las que jugó y preguntas contestadas; "Volver a jugar" | `app/game.jsx` (bloque `if (terminado)`) | Mismo componente, otro `return`; título del header cambia a "Fin de juego" con `<Stack.Screen options>` |
| Carga y error de cada pedido | `app/game.jsx` | `cargando` / `error` + botón "Reintentar" |

## 2. Estructura de la solución (archivo por archivo)

```
app/
├── _layout.jsx        Stack con 2 pantallas: index ("Bienvenido") y game ("Trivia de Países")
├── index.jsx          Vista 1: TextInput del nombre + 3 botones de nivel (router.push con params)
├── game.jsx           Vista 2 (Juego) y Vista 3 (Fin) en el mismo componente
├── api/               (MOCK, no tocar) countries+api.js, countries/[cca3]+api.js, data.json
└── static/            (MOCK, no tocar) flags/ y maps/ + [cca3]+api.js que sirven las imágenes
components/
├── styles.js          StyleSheet compartido (+ estilos nuevos: fila, mapa, bandera, Sí/No, verde/rojo)
└── utils.js           (DADO) expoDevServerUri(path)
hooks/
└── api.js             obtenerJson(ruta), urlBandera(cca3), urlMapa(cca3) + los hooks de la plantilla
```

- **`app/_layout.jsx`**: saqué `unstable_settings = { anchor: '(tabs)' }` (venía de la plantilla de Expo con pestañas; acá no hay `(tabs)`). Dos `Stack.Screen`.
- **`app/index.jsx`**: estado `nombre`; si está vacío los botones quedan `disabled` y grises (si no, en el juego diría ": ❤️❤️❤️").
- **`app/game.jsx`**:
  - `pedirPregunta()` (función async **fuera** del componente): `random?n=2` → detalle de los dos con `Promise.all` → si al del mapa le falta `map`, se usa el otro o se repite → moneda 50%.
  - Estado del juego: `vidasPerdidas`, `respondidas`, `correctas`, `terminado`.
  - Estado de la pregunta: `pregunta`, `respuesta`, `cargando`, `error`, `ronda`.
  - `useEffect(..., [ronda])` con bandera `ignorar` en la limpieza.
  - `volverAlInicio()`: `router.canGoBack() ? router.back() : router.replace('/')`.
- **`components/styles.js`**: la plantilla usaba `styles.normalText` y `styles.errorText` **sin definirlos** (quedaban `undefined`); los agregué.
- **`hooks/api.js`**: `obtenerJson` chequea `respuesta.ok` y tira `Error` (404 → mensaje). Los hooks `useFetch...` de la plantilla quedaron sin usar (ver §4.3 por qué).

## 3. Conceptos clave (con fragmentos)

### 3.1 Expo Router: archivo = ruta, `_layout` = navegador

```jsx
// app/_layout.jsx
<Stack>
  <Stack.Screen name="index" options={{ title: 'Bienvenido' }} />
  <Stack.Screen name="game" options={{ title: 'Trivia de Países' }} />
</Stack>
```
- `name` = nombre del archivo en `app/` sin extensión (`app/game.jsx` → `"game"`, `app/trivia/index.jsx` → `"trivia/index"`).
- El **back button** no se programa: aparece solo porque `game` está apilada encima de `index` (en iOS muestra el título de la anterior, "Bienvenido").
- Una pantalla que no declarás igual existe (si el archivo está), pero con título = nombre del archivo.

### 3.2 Pasar datos entre pantallas: params

```jsx
// app/index.jsx
router.push({ pathname: '/game', params: { nombre: nombre.trim(), vidas: vidas } });
// equivalente: router.push(`/game?nombre=${encodeURIComponent(nombre)}&vidas=${vidas}`)

// app/game.jsx
const params = useLocalSearchParams();          // { nombre: 'Ramón', vidas: '6' }
const vidasTotales = Number(params.vidas) > 0 ? Number(params.vidas) : 3;
```
**Llegan como string** (`'6'`): `'6' - 1` funciona pero `'6' + 1` da `'61'`. Siempre `Number(...)`.
Si entran directo a `/game` sin params → `undefined` → valores por defecto.

Alternativa con `Link`: `<Link href={{ pathname: '/game', params: { nombre, vidas: 9 } }} asChild><TouchableOpacity>…</TouchableOpacity></Link>` (con `asChild` el `Link` le pasa el `onPress` al hijo).

### 3.3 Cambiar el título del header desde la pantalla

```jsx
if (terminado) {
  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: 'Fin de juego' }} />
      ...
```
`<Stack.Screen options>` **dentro** de una pantalla pisa las opciones del `_layout` mientras se renderiza. Sirve también para títulos dinámicos: `options={{ title: pais.name.common }}`.

### 3.4 "Otra pregunta" = cambiar una dependencia del `useEffect`

```jsx
const [ronda, setRonda] = useState(0);
useEffect(() => {
  let ignorar = false;
  async function cargar() {
    setCargando(true); setError(null);
    try {
      const nueva = await pedirPregunta();
      if (!ignorar) setPregunta(nueva);
    } catch (err) { if (!ignorar) setError(err); }
    finally { if (!ignorar) setCargando(false); }
  }
  cargar();
  return () => { ignorar = true; };
}, [ronda]);
// Continuar:   setRespuesta(null); setRonda(ronda + 1);
// Reintentar:  setRonda(ronda + 1);
```
- `useEffect` **no** puede ser `async` directamente → función async adentro y se llama.
- `ignorar`: si salís de la pantalla (o se pide otra) antes de que llegue, no se guarda una respuesta vieja.

### 3.5 Aleatoriedad y "verdad" de la respuesta

```js
const mismoPais = Math.random() < 0.5;                  // 50%
const paisBandera = mismoPais ? paisMapa : otroPais;
// al responder:
const esCorrecta = (opcion === 'si') === pregunta.mismoPais;
```
El azar va en la **función que pide** (una vez por pregunta), nunca en el render: si ponés `Math.random()` en el cuerpo del componente, cada re-render cambia la pregunta.

### 3.6 URLs en React Native: `expoDevServerUri`

```js
export async function obtenerJson(ruta) {
  const respuesta = await fetch(expoDevServerUri(ruta));   // http://IP:8081/api/...
  if (!respuesta.ok) throw new Error(`Error ${respuesta.status} al pedir ${ruta}`);
  return respuesta.json();
}
<Image source={{ uri: expoDevServerUri(`/static/maps/${cca3}.svg`) }} style={{ width: 140, height: 140 }} contentFit="contain" />
```
- En la web `fetch('/api/countries')` anda (mismo origen). En el **celular no**: no hay "origen", necesitás `http://IP:puerto`. `expoDevServerUri` lo saca de `Constants.expoConfig.hostUri`.
- `Image` en RN **necesita tamaño** (`width`/`height`) para imágenes remotas; si no, mide 0×0 y no ves nada.
- Se usa `Image` de **`expo-image`** (soporta SVG; el `Image` de `react-native` no muestra SVG en el celular). `contentFit="contain"` = `object-fit: contain`.

### 3.7 Estilos en RN

```jsx
style={[styles.answerButton, acerto ? styles.correctButton : styles.wrongButton]}
```
- `StyleSheet.create`, camelCase, números sin `px`, **no hay cascada** ni herencia (salvo `Text` dentro de `Text`).
- Array de estilos: se combinan y **el último gana**.
- `flexDirection` por defecto es `'column'` (al revés que en la web) → para una fila: `flexDirection: 'row'`.
- `ScrollView`: el centrado va en `contentContainerStyle`, no en `style`.
- `TouchableOpacity disabled={...}` evita volver a responder.

## 4. Trampas / casos borde

1. **El enunciado dice `/game` pero la plantilla trae `app/trivia/index.jsx`** (ruta `/trivia`). Hice `app/game.jsx` y borré `trivia`. Si preferís dejar `trivia`, el `name` del Stack.Screen es `"trivia/index"`.
2. **8 países sin mapa** (`FSM, JEY, MHL, MNP, PSE, TUV, UMI, UNK`): `/static/maps/FSM.svg` da 404 y el detalle no trae `map`. Por eso `pedirPregunta` mira `pais.map` y repite si hace falta.
3. **Los hooks de la plantilla (`useFetchRandomCountries(2)`) solo piden UNA vez**: dependen de `[n]` y `n` no cambia → para "otra pregunta" no sirven tal cual. Además usan URL relativa (no anda en el celular) y no resetean `data`/`error`. Truco si igual querés usarlos: `useFetchRandomCountries(2, ronda)` (el arg extra entra en las dependencias).
4. **`styles.normalText`/`styles.errorText` no existían** en la plantilla → el texto salía sin estilo. Definilos.
5. **Params = strings** (§3.2). `Number(undefined)` = `NaN` → valor por defecto.
6. **"Salir" con `router.back()` rompe si entraste directo a `/game`** (web, URL escrita) → `router.canGoBack()` antes; si no, `router.replace('/')`. Ojo: `router.push('/')` apila otra Bienvenida encima (el back de esa vuelve al juego).
7. **Último error**: al perder la última vida NO se salta directo al Fin; primero se muestra "Incorrecto…" y el botón Continuar lleva al Fin (como en el croquis).
8. **Nombre vacío** → botones deshabilitados.
9. **Lint**: `semi: always`, sin imports sin usar, `react-hooks/exhaustive-deps` (el `useEffect` usa solo `ronda`; `pedirPregunta` está fuera del componente y por eso no es dependencia).
10. **Al borrar/renombrar un archivo de `app/` con `expo start` corriendo**, Metro se puede caer (`ENOENT …/trivia/index.jsx`): reiniciá con `npx expo start --web --clear`.

## 5. Variantes probables (con código)

### V1. Pasar el estado a un Context en vez de params (nombre + vidas globales)

```jsx
// context/JuegoContext.js
export const JuegoContext = createContext(null);
export function useJuego() { return useContext(JuegoContext); }
// context/JuegoProvider.jsx
export default function JuegoProvider({ children }) {
  const [nombre, setNombre] = useState('');
  const [vidas, setVidas] = useState(3);
  return <JuegoContext.Provider value={{ nombre, setNombre, vidas, setVidas }}>{children}</JuegoContext.Provider>;
}
// app/_layout.jsx:  <JuegoProvider><Stack>…</Stack></JuegoProvider>
```

### V2. Fin como pantalla aparte (`/fin`) en vez de dentro de `/game`

```jsx
// _layout: <Stack.Screen name="fin" options={{ title: 'Fin de juego', headerBackVisible: false }} />
// game.jsx, en continuar():
router.replace({ pathname: '/fin', params: { nombre, vidas: vidasTotales, respondidas } });
// fin.jsx: const { nombre, vidas, respondidas } = useLocalSearchParams();
// "Volver a jugar": router.dismissTo('/')  (o router.replace('/'))
```
`replace` para que el back del Fin no vuelva a un juego terminado.

### V3. Récord / historial que persiste (AsyncStorage)

```js
import AsyncStorage from '@react-native-async-storage/async-storage';  // npx expo install @react-native-async-storage/async-storage
const guardado = await AsyncStorage.getItem('record');                 // string o null
if (correctas > Number(guardado ?? 0)) await AsyncStorage.setItem('record', String(correctas));
```

### V4. Temporizador por pregunta (10 s; si se acaba cuenta como error)

```jsx
const [segundos, setSegundos] = useState(10);
useEffect(() => {
  if (respuesta !== null || cargando) return;
  if (segundos === 0) { responder(pregunta.mismoPais ? 'no' : 'si'); return; } // fuerza respuesta mala
  const id = setTimeout(() => setSegundos(segundos - 1), 1000);
  return () => clearTimeout(id);
}, [segundos, respuesta, cargando]);   // + resetear setSegundos(10) al pedir otra
```
(el lint va a pedir `responder` y `pregunta` en dependencias: definí la lógica dentro del efecto o usá `useCallback`).

### V5. Mostrar el nombre del país y elegir entre 2 mapas (o "¿la capital es X?")

Misma estructura, cambia `pedirPregunta`:
```js
const capitalVerdadera = Math.random() < 0.5;
const capital = (capitalVerdadera ? paisA : paisB).capital[0] ?? '(sin capital)';
return { pais: paisA, capital, esCorrecta: paisA.capital.includes(capital) };
```
Ojo: hay países con `capital: []` (Antártida) → `?.[0]` / filtrar.

### V6. Lista de respuestas al final (FlatList)

```jsx
const [historial, setHistorial] = useState([]);        // en responder(): setHistorial([...historial, { id: respondidas, mapa, bandera, acerto }])
<FlatList
  data={historial}
  keyExtractor={(item) => String(item.id)}
  renderItem={({ item }) => <Text>{item.acerto ? '✅' : '❌'} {item.mapa} / {item.bandera}</Text>}
/>
```
