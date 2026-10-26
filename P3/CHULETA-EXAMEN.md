# CHULETA DE EXAMEN — Parcial 3 (React Native + Expo Router, formato 2026sem2)

Tenerla abierta al lado del editor durante el examen. Todo está probado en el simulacro resuelto:
`parciales/simulacro-prueba3-2026sem2-matutino/mobile/` (lo llamamos **SOL**).

Lo de React que **no cambia** (useState, useEffect, props, map/key, estado derivado, Context) está
en la chuleta del P2: [`../P2/CHULETA-EXAMEN.md`](../P2/CHULETA-EXAMEN.md).

---

## 0. Arrancar y entregar

```bash
npm install --prefer-offline   # en la RAÍZ del repo (es un workspace con mobile/)
npm start                      # Metro en :8081 → apretar w (web) · QR para Expo Go
npm run lint                   # desde la raíz; tiene que salir SIN nada
(cd mobile && npx eslint .)    # ⚠️ expo lint solo mira app/, components/, src/ → esto revisa también hooks/ y common/
npx expo start -c              # (desde mobile/) si Metro dice "Unable to resolve" con un archivo nuevo
curl -s localhost:8081/api/ranking   # probar la API sin la app
```
Entrega: `git add -A && git commit -m "…" && git push` → **Pull Request en tu fork**.
Más detalle: [ESTRATEGIA §1](ESTRATEGIA-EXAMEN.md) y [PLAN-DE-RUTA](PLAN-DE-RUTA-EXAMEN.md).

---

## 1. HTML → React Native

> → [tema 2](clase/02-react-que-sigue-igual.md), [tema 3](clase/03-componentes-core.md)

| Web (P2) | React Native |
|---|---|
| `<div>` | `<View>` |
| `<p>`, `<span>`, `<h1>` | `<Text>` (**todo texto va dentro de `<Text>`**, si no: error) |
| `<img src>` | `<Image source={{ uri }} style={{ width, height }} />` (**sin tamaño no se ve**) |
| `<input value onChange>` | `<TextInput value={x} onChangeText={setX} />` (recibe el **string**, no el evento) |
| `<button onClick>` | `<Button title onPress>` / `<Pressable onPress>` / `<TouchableOpacity onPress>` |
| `<ul>{map}</ul>` | `<FlatList data renderItem keyExtractor />` o `map` dentro de `<ScrollView>` |
| `<form onSubmit>` | no existe: botón con `onPress` + `onSubmitEditing` en el TextInput |
| `className` + CSS | `style={styles.x}` con `StyleSheet.create` (objetos camelCase, sin unidades) |
| `<input type="checkbox">` | `<Switch value onValueChange />` |
| "Cargando…" | `<ActivityIndicator />` |
| `alert()` | `Alert.alert()` (**no anda en web**: mejor un `<Text>` en pantalla) |

```jsx
import { ActivityIndicator, FlatList, Image, Pressable, ScrollView, StyleSheet, Switch, Text, TextInput, View } from 'react-native';
import Button from '@/components/Button';                      // el de la plantilla: title, onPress, disabled, style
import { styles } from '@/common/styles';                      // container, row, input, titleText, normalText, errorText…
```

---

## 2. Estilos

> → [tema 4](clase/04-estilos-stylesheet-flexbox.md)

```jsx
const s = StyleSheet.create({
  card: { flex: 1, padding: 12, gap: 6, borderWidth: 1, borderColor: '#ccc', borderRadius: 8 },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
});
<View style={[s.card, selected && s.selected]} />              // array = combinar; false se ignora
<Text style={{ color: ok ? 'green' : 'red' }}>…</Text>          // estilo inline calculado
```
- `flexDirection` por defecto es **`column`** (en web era `row`).
- No hay cascada: el `color` del `View` no pasa a los `Text` de adentro.
- `flex: 1` = ocupar el espacio que sobra.

---

## 3. Expo Router (navegación por archivos)

> → [tema 7](clase/07-expo-router-archivos-y-layouts.md), [tema 8](clase/08-navegar-y-parametros.md), [tema 9](clase/09-ciclo-de-vida-pantallas.md)

| Archivo en `mobile/app/` | URL |
|---|---|
| `index.jsx` | `/` |
| `games/[id].jsx` | `/games/6` → `id === '6'` (**string**) |
| `ranking.jsx` | `/ranking` |
| `_layout.jsx` | envuelve a las de su carpeta (`<Stack>` o `<Tabs>`) |
| `+not-found.jsx` | cualquier URL que no exista |
| `api/games+api.js` | **backend**: `GET`/`POST`… de `/api/games` |

```jsx
// app/_layout.jsx — registrar pantallas y títulos
<Stack>
  <Stack.Screen name="index" options={{ title: 'Higher / Lower' }} />
  <Stack.Screen name="games/[id]" options={{ title: 'Partida' }} />
  <Stack.Screen name="ranking" options={{ title: 'Ranking' }} />   {/* pantalla nueva */}
</Stack>

// dentro de una pantalla: título dinámico
<Stack.Screen options={{ title: `Partida ${id}` }} />
```

```jsx
import { Link, Stack, useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router';

const { id } = useLocalSearchParams();       // parámetros de la URL: SIEMPRE string
const router = useRouter();

router.push(`/games/${game.id}`);            // ir (se puede volver atrás)
router.replace(`/games/${newGame.id}`);      // ir REEMPLAZANDO (atrás no vuelve a la vieja)
router.back();                               // atrás (falla si recargaste en web: no hay historial)
router.dismissTo('/');                       // volver hasta el inicio (o abrirlo si no está en la pila)
router.setParams({ q: 'uru' });              // cambiar ?q= de la pantalla actual
router.push({ pathname: '/games/[id]', params: { id: 6 } });

<Link href="/ranking">Ver ranking</Link>
<Link href={`/games/${item.id}`} asChild><Pressable>…</Pressable></Link>
```

| Quiero… | Uso |
|---|---|
| Refrescar datos al **volver** a una pantalla | `useFocusEffect(useCallback(() => { refetch(); }, [refetch]))` |
| Que la pantalla no muestre datos de la partida anterior al cambiar el `id` | estado derivado: `const game = data && String(data.id) === String(id) ? data : null` |
| Query param `?stat=area` | `const { stat } = useLocalSearchParams();` + `router.setParams({ stat: 'area' })` |

⚠️ En un `Stack` la pantalla de abajo **no se desmonta**: al volver al inicio no se re-ejecuta su
`useEffect` → por eso `useFocusEffect` para el ranking.

---

## 4. Hablar con la API

> → [tema 10](clase/10-api-fetchjson-y-api-routes.md)

```js
import { fetchJSON } from '@/common/fetch';
import { expoDevServerUri } from '@/common/utils';

const ranking = await fetchJSON('/api/ranking');                                         // GET
const game = await fetchJSON('/api/games', { method: 'POST', body: { player: 'Bruno' } }); // body = OBJETO
await fetchJSON(`/api/games/${id}`, { method: 'DELETE' });

try { … } catch (err) {
  if (err.status === 404) …        // no existe
  if (err.status === 400) …        // datos inválidos
  if (err.status === 409) …        // conflicto (partida ya terminada)
}

<Image source={{ uri: expoDevServerUri(country.flagUrl) }} style={{ width: 80, height: 54 }} resizeMode="contain" />
```
⚠️ **No** hacer `JSON.stringify` (ya lo hace `fetchJSON`). ⚠️ Imágenes de la API: **siempre** `expoDevServerUri`
(en el celular la ruta relativa no anda).

---

## 5. Hooks de datos (copiar de SOL `mobile/hooks/`)

> → [tema 11](clase/11-hooks-de-datos.md)

```js
// hooks/useFetchJSON.js  → { data, setData, isLoading, error, refetch }   (copiar entero de SOL)
export function useFetchRanking() { return useFetchJSON('/api/ranking'); }
export function useFetchGame(id) { return useFetchJSON(`/api/games/${id}`); }

// hooks/useCreateGame.js → { createGame, isCreating, error }   createGame(player) devuelve la partida o null
```

```jsx
const { data: ranking, error, refetch } = useFetchRanking();

let content;
if (error)                     content = <StatusMessage error={error} text="No se pudo cargar." onRetry={refetch} />;
else if (!ranking)             content = <StatusMessage loading text="Cargando…" />;
else if (ranking.length === 0) content = <Text>Todavía no hay partidas.</Text>;
else                           content = <FlatList data={ranking} keyExtractor={(i) => String(i.id)} renderItem={…} />;
```

**Acción (POST) con botón deshabilitado mientras espera:**
```jsx
const [isGuessing, setIsGuessing] = useState(false);
const [guessError, setGuessError] = useState(null);
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

---

## 6. Listas: FlatList

> → [tema 5](clase/05-listas-flatlist.md)

```jsx
<FlatList
  data={ranking}
  keyExtractor={(item) => String(item.id)}                   // tiene que devolver STRING
  renderItem={({ item, index }) => (                          // recibe { item, index }, no el ítem directo
    <View style={styles.row}>
      <Text>{index + 1}</Text>
      <Text style={{ flex: 1 }}>{item.player}</Text>
      <Text>{item.score} pts</Text>
    </View>
  )}
  ListEmptyComponent={<Text>No hay partidas.</Text>}
  ItemSeparatorComponent={() => <View style={{ height: 1, backgroundColor: '#ddd' }} />}
  refreshing={isLoading}                                      // pull-to-refresh
  onRefresh={refetch}
/>
```
⚠️ FlatList dentro de un `ScrollView` → warning: usá uno u otro (lista corta → `map` en `ScrollView`).

---

## 7. Formularios

> → [tema 6](clase/06-formularios-textinput.md)

```jsx
const [player, setPlayer] = useState('');
const canPlay = player.trim() !== '' && !isCreating;          // estado derivado, sin useState

<TextInput
  style={styles.input}
  placeholder="Tu nombre"
  value={player}
  onChangeText={setPlayer}              // recibe el texto directo
  onSubmitEditing={handlePlay}          // "Enter" del teclado
  keyboardType="numeric"                // números (igual devuelve string → Number(x))
  maxLength={20}
/>
<Button title="Jugar" onPress={handlePlay} disabled={!canPlay} />
```

---

## 8. Formatear

> → [tema 13](clase/13-formatear-datos.md) · copiar `SOL/common/format.js`

```js
formatNumber(3473727)          // "3.473.727"
formatNumber(0.44)             // "0,44"
formatStat('area', 181034)     // "181.034 km²"
STATS[stat].question           // "habitantes" | "superficie"
new Date(iso).toLocaleDateString('es-UY')   // fecha (puede variar por plataforma)
```

---

## 9. Estado de juego (pantalla con varias fases)

> → [tema 12](clase/12-logica-de-juego-y-estado.md)

```jsx
// Qué mostrar = función de (partida, resultado de la ronda). Nada de efectos para "resetear".
const stat = roundResult ? roundResult.stat : game.stat;           // el de LA RONDA respondida
const other = roundResult ? roundResult.revealed : game.next;
const hidden = !roundResult && game.status === 'playing';           // "?" en el país oculto
const isOver = roundResult ? roundResult.game.status !== 'playing' : game.status !== 'playing';

function handleNext() { setGame(roundResult.game); setResult(null); }   // la API ya mandó la ronda nueva
```

---

## 10. Context y AsyncStorage

> → [tema 14](clase/14-context-en-rn.md), [tema 15](clase/15-asyncstorage.md)

```jsx
// app/_layout.jsx: el Provider envuelve el Stack
<PlayerProvider><Stack>…</Stack></PlayerProvider>
```
```js
import AsyncStorage from '@react-native-async-storage/async-storage';
await AsyncStorage.setItem('player', name);                         // solo strings
const saved = await AsyncStorage.getItem('player');                 // null si no hay
await AsyncStorage.setItem('favs', JSON.stringify(list));           // objetos → JSON
useEffect(() => {
  (async () => { const v = await AsyncStorage.getItem('player'); if (v) setPlayer(v); })();   // setState DENTRO del async
}, []);
```

---

## 11. Lint (`npm run lint` sin advertencias)

> → [tema 17](clase/17-lint-y-react-compiler.md)

| Mensaje | Arreglo |
|---|---|
| `Avoid calling setState() directly within an effect` (`set-state-in-effect`) | Calcular en el render (estado derivado) o hacer el `setX` dentro de la función `async` del efecto |
| `React Hook useEffect has a missing dependency: 'id'` | Agregar `id` al array de dependencias |
| `React Hook "useState" is called conditionally` | Todos los hooks **arriba**, antes de cualquier `return` |
| `Missing semicolon` (`semi`) | Poner `;` |
| `'x' is defined but never used` | Borrar el import/variable |
| `Unable to resolve path to module '@/…'` | Revisar la ruta / mayúsculas del archivo |

---

## 12. Si algo sale mal

| Síntoma | Causa típica |
|---|---|
| `Text strings must be rendered within a <Text> component` | texto suelto o `{cond && 'x'}` fuera de `<Text>`; ojo con `{0 && …}` |
| La imagen no aparece | falta `width`/`height`, o falta `expoDevServerUri` |
| `Unable to resolve "../components/X"` con el archivo creado | reiniciar Metro: `npx expo start -c` |
| Al volver al inicio el ranking está viejo | falta `useFocusEffect` |
| "Jugar de nuevo" muestra el resultado anterior | estado de la partida vieja: derivar por `id` |
| `router.back()` no hace nada tras recargar en web | usar `router.dismissTo('/')` |
| El botón se puede apretar dos veces | `disabled={isGuessing}` |
| `Objects are not valid as a React child` | estás mostrando un objeto: `country.name`, no `country` |
| Todas las trampas | [ESTRATEGIA-EXAMEN.md §4](ESTRATEGIA-EXAMEN.md) |
