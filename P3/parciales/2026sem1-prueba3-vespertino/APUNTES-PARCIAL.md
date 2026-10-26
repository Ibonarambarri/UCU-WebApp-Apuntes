# Apuntes — Prueba 3 2026 Sem1 Vespertino (Figuritas del Mundial) — RESUELTO

Resolución comentada de la prueba. El enunciado original está en `README.md`
(no se tocó) y el croquis en `specs/design.svg`.

> Es **la prueba real** del semestre 1 (la del simulacro es la trivia de
> capitales, en `../2026sem1-simulacro-prueba3-vespertino/`). Misma plantilla,
> mismo formato: Expo Router + API routes dentro del mismo proyecto. Fijate que
> el README hasta tiene el título copiado del simulacro ("Trivia de países").

---

## 1. Qué pide el enunciado → dónde está resuelto

App para llevar el álbum de figuritas del Mundial 2026: 12 grupos → 4 equipos
por grupo → 20 figuritas por equipo, que se marcan/desmarcan y se guardan con un
`PATCH`.

| Requisito | Dónde | Cómo |
|---|---|---|
| Header de `/` diga "Bienvenido" (no "index") | `app/_layout.jsx` | `<Stack.Screen name="index" options={{ title: 'Bienvenido' }} />` |
| Pantallas de la app en el Stack con título "Figuritas del Mundial" y flecha atrás | `app/_layout.jsx` | `Stack.Screen` para `groups/[letter]` y `teams/[code]`; la flecha la pone el Stack solo |
| Ruta 1 `/`: 12 botones, uno por grupo | `app/index.jsx` | `GET /api/groups` + `map` → `<Link href={`/groups/${letter}`} asChild>` |
| Ruta 2 `/groups/:letter`: 4 botones con nombre y bandera → equipo | `app/groups/[letter].jsx` | `useLocalSearchParams()` → `useFetchGroup(letter)`; `router.push(`/teams/${code}`)` |
| Botón _Volver_ en el grupo → vista de grupos | `app/groups/[letter].jsx` | `router.dismissTo('/')` |
| Ruta 3 `/teams/:code`: nombre, grupo, continente, confederación, bandera | `app/teams/[code].jsx` | `useFetchTeam(code)` + `<Image>` de `expo-image` |
| 20 botones de figuritas, marcar/desmarcar → **PATCH** | `app/teams/[code].jsx` | `toggleSticker(index)` → `saveStickers(nuevaLista)` → `fetchJSON(..., { method: 'PATCH' })` |
| _Todas_ / _Ninguna_ | `app/teams/[code].jsx` | `setAllStickers(true/false)` → `team.stickers.map(() => value)` + PATCH |
| _Volver_ al pie → vista del grupo | `app/teams/[code].jsx` | `router.dismissTo(`/groups/${team.group}`)` |
| Carga y error en cada pedido | `hooks/useFetchJSON.js` + `components/StatusMessage.jsx` | `isLoading` / `error` / botón "Reintentar" (`refetch`) |
| Extra: contador "Figuritas: 4 de 20", "Guardando...", error al guardar | `app/teams/[code].jsx` | estado derivado (`filter(...).length`) + `isSaving` / `saveError` |
| Casos borde: `/groups/Z`, `/teams/XXX` | `[letter].jsx`, `[code].jsx` | lista vacía → "No existe el grupo Z"; 404 → "No existe el equipo XXX" (sin Reintentar) |

### Mapa de rutas

| URL | Archivo | Header | Qué muestra |
|---|---|---|---|
| `/` | `app/index.jsx` | Bienvenido | "Figuritas del Mundial", "Grupos:" y 12 botones |
| `/groups/H` | `app/groups/[letter].jsx` | Figuritas del Mundial (con ←) | "Grupo H", 4 equipos con bandera, Volver |
| `/teams/URU` | `app/teams/[code].jsx` | Figuritas del Mundial (con ←) | datos + bandera, grilla 4×5 de figuritas, Todas/Ninguna, Volver |

---

## 2. Cómo correrlo

```bash
npm install
npm start          # o: npx expo start --web --port 8090
npm run lint       # tiene que salir sin nada
```

`npm start` levanta **todo junto**: la app y la API (`app/api/*+api.js`). No
hay servidor aparte. En el celular con Expo Go, o `w` para web.

Probar la API a mano:

```bash
curl localhost:8090/api/groups                     # ["A",...,"L"]
curl localhost:8090/api/teams                      # los 48 equipos
curl localhost:8090/api/teams/URU                  # { ..., stickers: [20 × false] }
curl -X PATCH -H 'Content-Type: application/json' \
  -d '{"stickers":[true,false,...20 booleanos...]}' localhost:8090/api/teams/URU
curl localhost:8090/api/groups/H                   # 500 (¡bug del mock! ver trampa 1)
```

> **El PATCH escribe de verdad en `app/api/worldcup.json`** (le agrega
> `stickers` al equipo y lo re-indenta). Para dejarlo como venía:
> `git checkout app/api/worldcup.json` (o copiarlo del repo original).

---

## 3. Estructura de la solución, archivo por archivo

```
app/_layout.jsx              Stack con los 3 títulos
app/index.jsx                `/` — grilla de 12 grupos
app/groups/[letter].jsx      `/groups/:letter` — 4 equipos
app/teams/[code].jsx         `/teams/:code` — álbum del equipo + PATCH
app/api/...                  (DADO, sin tocar) mock del backend
app/static/flags/...         (DADO) banderas .png y .svg
hooks/useFetchJSON.js        hook genérico GET → { data, setData, isLoading, error, refetch }
hooks/useFetchGroups.js      useFetchGroups() y useFetchGroup(letter)
hooks/useFetchTeam.js        useFetchTeam(code)
common/fetch.js              fetchJSON(url, options): fetch + response.ok + error.status
common/styles.js             StyleSheet (los de la plantilla + los nuevos)
common/utils.js              (DADO) expoDevServerUri(path) para las imágenes
common/api.js                (DADO, ya no se usa) los hooks de la plantilla
components/StatusMessage.jsx cartel de cargando / error + Reintentar
```

| Archivo | Estado | Qué hace |
|---|---|---|
| `app/_layout.jsx` | modificado | Agrega `title` a `index` y registra `groups/[letter]` y `teams/[code]` con "Figuritas del Mundial" |
| `app/index.jsx` | reescrito | Pide `/api/groups` y arma la grilla de 3 columnas con `<Link asChild>` |
| `app/groups/[letter].jsx` | **creado** | Lee `letter`, muestra los 4 equipos (`TouchableOpacity` con `Image` + `Text`) |
| `app/teams/[code].jsx` | **creado** | Lee `code`, muestra datos + 20 figuritas; `saveStickers` hace el PATCH y guarda la respuesta con `setTeam` |
| `app/stickers/` | **borrado** | Era la vista de ejemplo de la plantilla (hardcodeaba `URU`) |
| `hooks/*.js`, `common/fetch.js`, `components/StatusMessage.jsx` | **creados** | Ver §4 |
| `common/styles.js` | ampliado | Se mantienen los de la plantilla y se agregan `groupGrid`, `teamButton`, `teamHeader`, `halfButton`, etc. |

---

## 4. Conceptos clave (con el código de ESTA solución)

### 4.1 Títulos del header en el Stack — `app/_layout.jsx`

```jsx
<Stack>
  <Stack.Screen name="index" options={{ title: 'Bienvenido' }} />
  <Stack.Screen name="groups/[letter]" options={{ title: 'Figuritas del Mundial' }} />
  <Stack.Screen name="teams/[code]" options={{ title: 'Figuritas del Mundial' }} />
</Stack>
```

- `name` es la ruta del archivo **relativa a `app/`, sin extensión**, con los corchetes.
- Sin `title`, el header muestra el nombre del archivo (`index`, `groups/[letter]`) → eso es lo que el enunciado dice que NO quiere.
- La flecha "←" de la izquierda **no se programa**: aparece sola cuando hay una pantalla anterior en la pila. Si entrás directo por URL a `/teams/URU` no hay flecha (no hay a dónde volver) — por eso existe el botón "Volver".
- Título dinámico (ej. "Grupo H" en el header, como en el croquis): ver variante V1.

### 4.2 Rutas dinámicas + `useLocalSearchParams` — `app/groups/[letter].jsx`

```jsx
// app/groups/[letter].jsx  →  /groups/H
const { letter } = useLocalSearchParams();   // 'H' (string)
const { data: teams, isLoading, error, refetch } = useFetchGroup(letter);
```

El nombre del parámetro es lo que está entre corchetes en el **nombre del archivo**. Si el archivo fuera `[id].jsx`, sería `const { id } = ...`. Siempre llega como **string**.

### 4.3 Navegar: `Link asChild`, `router.push`, `router.dismissTo`

```jsx
// app/index.jsx — Link envolviendo un botón propio
<Link key={letter} href={`/groups/${letter}`} asChild>
  <TouchableOpacity style={styles.groupButton}>
    <Text style={styles.buttonText}>Grupo {letter}</Text>
  </TouchableOpacity>
</Link>

// app/groups/[letter].jsx — navegar desde un onPress
onPress={() => router.push(`/teams/${team.code}`)}

// "Volver" — app/teams/[code].jsx
onPress={() => router.dismissTo(`/groups/${team.group}`)}
```

- `asChild`: el `Link` no dibuja su propio texto/elemento, le "presta" el `onPress` al hijo. Sin `asChild`, el `Link` se dibuja como un `Text`.
- `push` **apila** una pantalla nueva. Para "Volver" NO uses `push('/')`: apilarías una bienvenida nueva arriba (y la flecha ← te llevaría al grupo otra vez).
- `dismissTo(href)`: saca pantallas de la pila hasta encontrar `href`; si no está (entraste por URL), **reemplaza**. Es el "volver a X" correcto. Alternativas: `router.back()` (vuelve una, pero falla si no hay historial) o `router.replace(href)`.

### 4.4 Hook genérico de fetch — `hooks/useFetchJSON.js`

```js
export function useFetchJSON(url) {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reloadIndex, setReloadIndex] = useState(0);

  useEffect(() => {
    let ignore = false;
    (async () => {
      setIsLoading(true); setError(null); setData(null);
      try {
        const json = await fetchJSON(url);
        if (!ignore) setData(json);
      } catch (err) {
        if (!ignore) setError(err);
      } finally {
        if (!ignore) setIsLoading(false);
      }
    })();
    return () => { ignore = true; };
  }, [url, reloadIndex]);

  const refetch = useCallback(() => setReloadIndex((index) => index + 1), []);
  return { data, setData, isLoading, error, refetch };
}
```

- `url` en las dependencias: si cambia `code` (otro equipo) se vuelve a pedir.
- `ignore`: si llega tarde una respuesta vieja, no pisa la nueva.
- `setData` se expone para guardar lo que devuelve el PATCH sin volver a hacer GET.
- Hooks de un endpoint = 1 línea: `export function useFetchTeam(code) { return useFetchJSON(`/api/teams/${encodeURIComponent(code)}`); }`.

`common/fetch.js` es el `fetch` "con ok": `fetch` **no** tira error con 404/500, así que lo tiramos nosotros y guardamos `error.status` para distinguir "no existe" de "falló":

```js
if (!response.ok) {
  const error = new Error(`${options?.method ?? 'GET'} ${url} falló con ${response.status}`);
  error.status = response.status;
  throw error;
}
```

### 4.5 PATCH con la lista completa — `app/teams/[code].jsx`

```jsx
const { data: team, setData: setTeam, isLoading, error, refetch } = useFetchTeam(code);
const [isSaving, setIsSaving] = useState(false);
const [saveError, setSaveError] = useState(null);

async function saveStickers(newStickers) {
  setIsSaving(true);
  setSaveError(null);
  try {
    const updatedTeam = await fetchJSON(`/api/teams/${encodeURIComponent(code)}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ stickers: newStickers }),
    });
    setTeam(updatedTeam);          // lo que quedó guardado de verdad
  } catch (err) {
    setSaveError(err);
  } finally {
    setIsSaving(false);
  }
}

function toggleSticker(index) {
  const newStickers = team.stickers.map((has, i) => (i === index ? !has : has));
  saveStickers(newStickers);
}

function setAllStickers(value) {
  saveStickers(team.stickers.map(() => value));
}
```

- La API exige **exactamente 20 booleanos** y **sólo** `stickers` en el body (si mandás `{ stickers, name }` → 400 "Only stickers can be updated!"). Por eso se manda la lista entera, no "la figurita 5".
- **Inmutabilidad**: `map` crea un array nuevo. Nunca `team.stickers[i] = true` (no re-renderiza y además ensucia el estado).
- Mientras guarda, los botones quedan `disabled={isSaving}` → evita dos PATCH cruzados con clics rápidos.

### 4.6 Grilla de botones con `flexWrap` — `common/styles.js`

```js
flagGrid:     { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
flagGridItem: { width: '23%', alignItems: 'center', borderWidth: 1, borderRadius: 8, ... }, // 4 por fila
groupButton:  { ...baseButton, width: '31%' },                                              // 3 por fila
```

En RN no hay CSS Grid: la grilla es `flexDirection: 'row'` + `flexWrap: 'wrap'` + un `width` en % por item. Recordá que en RN el `flexDirection` por defecto es **`column`**.

Estilo condicional = **array de estilos** (los `false`/`null` se ignoran):

```jsx
style={[styles.flagGridItem, hasSticker && styles.flagGridItemSelected]}
```

### 4.7 Imágenes de la API — `expo-image` + `expoDevServerUri`

```jsx
<Image
  source={{ uri: expoDevServerUri(`/static/flags/${team.code}.png`) }}
  style={styles.smallFlag}          // ¡con width y height, si no no se ve!
  contentFit="contain"
/>
```

- Imagen remota → `source={{ uri }}` y **tamaño obligatorio**.
- `expoDevServerUri` (dado) arma la URL absoluta con el host del servidor de Expo: en el celular `/static/...` solo no sirve (no hay "origen" como en el navegador).
- `expo-image` también dibuja `.svg`; el `Image` de `react-native` **no** (en nativo). Por eso la plantilla usa `expo-image`.

### 4.8 `ScrollView` para que entre en el celular

La vista del equipo (encabezado + 20 botones + 3 botones) no entra en una pantalla chica → `ScrollView` con `contentContainerStyle={styles.scrollContent}` (el padding va en `contentContainerStyle`, no en `style`). Para listas largas o desconocidas, `FlatList` (ver V5).

---

## 5. Trampas / casos borde de ESTE parcial

1. **`GET /api/groups/H` da 500 SIEMPRE (bug del mock).** En `app/api/groups/[code]+api.js` el archivo se llama `[code]` pero el handler destructura `{ group }` → `group` es `undefined` → `undefined.toUpperCase()` revienta. Como la API "no es de interés", **no la toqué**: `useFetchGroup(letter)` (`hooks/useFetchGroups.js`) pide `GET /api/teams` (que anda) y filtra `team.group === letter`. Si el profe dice que se puede tocar, el arreglo es 1 línea: `export async function GET(req, { code: group })`. *Moraleja: probá cada endpoint con `curl` antes de programar la pantalla.*
2. **`stickers` no existe en `worldcup.json` hasta el primer PATCH.** El GET devuelve `{ stickers: Array(20).fill(false), ...team }` → siempre hay 20. Si el profe cambiara la API para no mandarlo: `team.stickers ?? new Array(20).fill(false)`.
3. **El PATCH valida duro**: 20 booleanos exactos y sólo la clave `stickers` (400 si no). No mandes el equipo entero.
4. **Los params llegan como string y en la mayúscula/minúscula que haya en la URL.** `/groups/h` → filtro con `String(letter).toUpperCase()`. `/teams/uru` funciona porque la API hace `toUpperCase()`.
5. **`/groups/Z`** → la lista filtrada queda vacía → "No existe el grupo Z". **`/teams/XXX`** → 404 → `error.status === 404` → "No existe el equipo XXX" sin botón Reintentar (reintentar no lo va a arreglar) + "Volver al inicio".
6. **"Volver" con `push` es un error típico**: duplica pantallas en la pila. Usá `dismissTo` / `back`.
7. **Hooks antes de cualquier `return`**: en `[code].jsx` todos los `useX()` están arriba de los `if (isLoading) return ...` (regla de los hooks; si no, el lint lo marca).
8. **`key` con índice** en las figuritas está bien (lista fija de 20 que nunca se reordena). En listas que cambian, usá un id (`team.code`).
9. **Archivos sueltos dentro de `app/`** (como el `app/stickers/utils.js` de la plantilla) Expo Router los trata como **rutas**. Los hooks/utilidades van fuera (`hooks/`, `common/`).
10. **Lint**: `semi: always` (punto y coma en todo), imports sin usar = error, `react-hooks/exhaustive-deps`. `npm run lint` tiene que salir vacío.
11. **El PATCH modifica `app/api/worldcup.json`** → restaurarlo al terminar de probar.
12. Warning en consola web "props.pointerEvents is deprecated": viene de la librería de navegación, no de tu código. Ignorar.

---

## 6. Recetario de variantes probables

### V1. Título dinámico en el header ("Grupo H", "Equipo: Uruguay")

Dentro de la pantalla, un `<Stack.Screen>` **sin `name`** cambia las opciones de la pantalla actual:

```jsx
// app/teams/[code].jsx (dentro del return, en cualquier lugar)
import { Stack } from 'expo-router';
<Stack.Screen options={{ title: team ? `Equipo: ${team.name}` : 'Cargando...' }} />
```

O con el hook: `const navigation = useNavigation(); useEffect(() => { navigation.setOptions({ title: `Grupo ${letter}` }); }, [navigation, letter]);`

### V2. Contador de figuritas por grupo / álbum completo

```jsx
// en /groups/[letter]: mostrar "12/20" al lado de cada equipo.
// /api/teams NO trae stickers → hay que pedir el detalle de cada uno:
const [counts, setCounts] = useState({});
useEffect(() => {
  if (!teams) return;
  (async () => {
    const details = await Promise.all(teams.map((t) => fetchJSON(`/api/teams/${t.code}`)));
    const result = {};
    for (const d of details) result[d.code] = d.stickers.filter(Boolean).length;
    setCounts(result);
  })();
}, [teams]);
// <Text>{counts[team.code] ?? '…'}/20</Text>
```

(Ojo: `teams` sale de un `filter` en cada render → cambia de referencia → el efecto se repetiría. Envolvé el filtro en `useMemo` o usá como dependencia `letter` + `allTeams`.)

### V3. Marcar "optimista" (cambia el color antes de que responda la API)

```js
async function saveStickers(newStickers) {
  const previous = team;
  setTeam({ ...team, stickers: newStickers });       // 1. pinto ya
  try {
    await fetchJSON(url, { method: 'PATCH', headers, body: JSON.stringify({ stickers: newStickers }) });
  } catch (err) {
    setTeam(previous);                               // 2. si falla, deshago
    setSaveError(err);
  }
}
```

### V4. Figuritas "repetidas" (contador en vez de booleano) — long press

```jsx
<Pressable
  onPress={() => toggleSticker(index)}
  onLongPress={() => addRepeated(index)}            // mantener apretado
  style={({ pressed }) => [styles.flagGridItem, pressed && { opacity: 0.6 }]}
>
```

`Pressable` es el reemplazo moderno de `TouchableOpacity`: tiene `onLongPress` y el estilo puede ser función de `{ pressed }`.

### V5. Lista de los 48 equipos con buscador (`FlatList` + `TextInput`)

```jsx
const [query, setQuery] = useState('');
const { data: teams } = useFetchJSON('/api/teams');
const visible = (teams ?? []).filter((t) => t.name.toLowerCase().includes(query.toLowerCase()));

<TextInput style={styles.input} placeholder="Buscar equipo" value={query} onChangeText={setQuery} />
<FlatList
  data={visible}
  keyExtractor={(t) => t.code}
  renderItem={({ item }) => (
    <Link href={`/teams/${item.code}`} asChild>
      <TouchableOpacity style={styles.teamButton}><Text>{item.name}</Text></TouchableOpacity>
    </Link>
  )}
  ListEmptyComponent={<Text>Sin resultados</Text>}
/>
```

`TextInput` usa `onChangeText` (te da el **string** directo, no un evento).

### V6. Grilla con `FlatList numColumns` en vez de `flexWrap`

```jsx
<FlatList
  data={team.stickers}
  numColumns={4}
  keyExtractor={(_, index) => String(index)}
  renderItem={({ item: hasSticker, index }) => (
    <TouchableOpacity style={[styles.sticker, hasSticker && styles.flagGridItemSelected]}
                      onPress={() => toggleSticker(index)}>
      <Text>{index + 1}</Text>
    </TouchableOpacity>
  )}
/>
```

(No metas una `FlatList` dentro de un `ScrollView` vertical: RN avisa. Usá `ListHeaderComponent` / `ListFooterComponent` para lo de arriba y abajo.)

---

## 7. Si en el examen me trabo: orden de prioridades

1. `_layout.jsx` con los títulos (2 minutos, puntos seguros).
2. `/` con los 12 grupos (aunque sea con `router.push`).
3. `/groups/[letter]` con nombre + bandera → navega.
4. `/teams/[code]` mostrando datos y figuritas.
5. PATCH al tocar + Todas/Ninguna.
6. Volver bien (`dismissTo`), loading/error, casos borde.
7. `npm run lint` limpio.
