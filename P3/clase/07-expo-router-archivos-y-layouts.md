# Tema 7 — Expo Router: rutas por archivos y layouts

## 7.1 La idea: el árbol de `app/` ES el router

En P2 escribías las rutas a mano (`<Route path="/countries/:code" element={…} />`). En Expo Router
**cada archivo de `app/` es una ruta** y su `export default` es la pantalla:

```
app/
├── _layout.jsx          → el marco de todas (el <Stack>), NO es una ruta
├── index.jsx            → /
├── games/
│   ├── index.jsx        → /games            (si existiera)
│   └── [id].jsx         → /games/6, /games/9999   (id = '6')
├── about.jsx            → /about
├── [...path].jsx        → cualquier cosa no reconocida (catch-all)
├── +not-found.jsx       → la pantalla de "no existe"
└── api/
    ├── games+api.js     → BACKEND: /api/games
    └── games/[id]+api.js→ BACKEND: /api/games/6
```
Para agregar una pantalla: **creás el archivo**. Sin registrar nada.

⚠️ Todo `.jsx` adentro de `app/` se vuelve ruta: hooks, componentes y estilos van **afuera**
(`hooks/`, `components/`, `common/`). Un archivo de `app/` sin `export default` → warning *"missing
the required default export"*.

## 7.2 Notación de nombres

| Archivo | URL | Lo leés con |
|---|---|---|
| `index.jsx` | la carpeta "pelada" (`/`, `/games`) | — |
| `[id].jsx` | un segmento dinámico (`/games/6`) | `const { id } = useLocalSearchParams()` → `'6'` (tema 8) |
| `[...path].jsx` | uno o más segmentos (`/static/flags/URY.png`) | `path` → **array** `['flags', 'URY.png']` |
| `(tabs)/` | grupo: **no** aparece en la URL (`(tabs)/perfil.jsx` → `/perfil`) | — |
| `_layout.jsx` | no es URL: envuelve a sus hermanas e hijas | — |
| `+not-found.jsx` | cuando ninguna ruta coincide | — |
| `algo+api.js` | endpoint del servidor (no pantalla) | `export function GET(request, params)` |

Rutas fijas le ganan a las dinámicas: `tasks/new.jsx` gana a `tasks/[id].jsx` para `/tasks/new`.

## 7.3 `_layout.jsx` con `<Stack>`: la pila de pantallas

```jsx
// app/_layout.jsx (plantilla 2026sem2)
import { DefaultTheme, Stack, ThemeProvider } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

export default function RootLayout() {
  return (
    <ThemeProvider value={DefaultTheme}>
      <Stack>
        <Stack.Screen name="index" options={{ title: 'Higher / Lower' }} />
        <Stack.Screen name="games/[id]" options={{ title: 'Partida' }} />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
```
- **Stack** = pantallas apiladas, como cartas: entrar a una la pone **arriba**; "atrás" la saca.
  Pone solo el **header** con el título y la flecha ← cuando hay algo abajo.
- `name` = la ruta del archivo **relativa a la carpeta del layout**, sin extensión: `"index"`,
  `"games/[id]"`.
- En un Stack **no hace falta** declarar todas: las que falten igual andan (con el nombre de
  archivo como título). Se declaran para ponerles `options`.
- Opciones típicas: `title`, `headerShown: false`, `headerBackTitle`, `headerRight: () => <…/>`,
  `presentation: 'modal'`.
- Es el equivalente de `Layout` + `<Outlet />` de P2: el Stack dibuja "la pantalla que toque".
  Sin navegador (solo un marco común) → `<Slot />` de `expo-router`.

## 7.4 `Stack.Screen` adentro de la pantalla (título dinámico)

El layout no sabe el `id`. La pantalla puede pisar sus propias opciones dibujando un `Stack.Screen`
**sin `name`**:
```jsx
// app/games/[id].jsx
import { Stack, useLocalSearchParams } from 'expo-router';

export default function Game() {
  const { id } = useLocalSearchParams();
  …
  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: `Partida ${id}` }} />   {/* no dibuja nada en la pantalla */}
      …
    </View>
  );
}
```
⚠️ Si la pantalla tiene **varios `return`** (error / cargando / datos), poné el `Stack.Screen` en
**todos** (el simulacro lo guarda en una variable `title` y lo repite). También sirve para el botón
"+" del header: `options={{ headerRight: () => <Pressable onPress={…}>…</Pressable> }}`.

## 7.5 `<Tabs>` y grupos `(tabs)`

```
app/
├── _layout.jsx            → <Stack> con <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
└── (tabs)/
    ├── _layout.jsx        → <Tabs>
    ├── index.jsx          → /          (pestaña 1)
    └── ranking.jsx        → /ranking   (pestaña 2)
```
```jsx
// app/(tabs)/_layout.jsx
import { Tabs } from 'expo-router/js-tabs';      // SDK 58 (desde 'expo-router' anda pero está deprecado)

export default function TabsLayout() {
  return (
    <Tabs>
      <Tabs.Screen name="index" options={{ title: 'Jugar' }} />
      <Tabs.Screen name="ranking" options={{ title: 'Ranking' }} />
    </Tabs>
  );
}
```
⚠️ **SDK 58: en Tabs solo aparecen las pestañas declaradas** con `Tabs.Screen` (a diferencia del Stack).
Una ruta que no querés como pestaña: `options={{ href: null }}`.
⚠️ Plantillas viejas traían `export const unstable_settings = { anchor: '(tabs)' }` sin tener
carpeta `(tabs)`: si no usás tabs, borralo.

## 7.6 `+not-found.jsx`

```jsx
import { Link, Stack } from 'expo-router';
import { Text, View } from 'react-native';

export default function NotFound() {
  return (
    <View style={styles.centered}>
      <Stack.Screen options={{ title: 'No encontrado' }} />
      <Text>Esta pantalla no existe.</Text>
      <Link href="/">Volver al inicio</Link>
    </View>
  );
}
```
⚠️ **No confundir:** `/games/9999` **sí** coincide con `games/[id].jsx` → no va a `+not-found`. El
"no existe" ahí lo da la API (`error.status === 404`) y lo mostrás en la pantalla de la partida.

## 7.7 `+api.js`: el backend en la misma app

```js
// app/api/games/[id]+api.js  → GET /api/games/6
export function GET(request, { id }) {               // los [params] llegan en el 2º argumento
  return Response.json({ id });                      // (como string)
}
export async function POST(request) {
  const body = await request.json();
  return Response.json(body, { status: 201 });
}
```
Requiere `"web": { "output": "server" }` en `app.json` (ya está). **En el parcial no se toca**; lo
leés para entender las respuestas.

## 7.8 React Router v6 (P2) → Expo Router (P3)

| React Router (P2) | Expo Router (P3) |
|---|---|
| `<BrowserRouter><Routes>…</Routes>` en `App.jsx` | la carpeta `app/` |
| `<Route path="/" element={<Home />} />` | `app/index.jsx` |
| `<Route path="countries/:code" element={…} />` | `app/countries/[code].jsx` |
| `<Route path="*" element={<NotFound />} />` | `app/+not-found.jsx` |
| `<Route element={<Layout />}>` + `<Outlet />` | `_layout.jsx` con `<Stack>` / `<Tabs>` / `<Slot />` |
| `index` route | `index.jsx` |
| `<title>` / título a mano en el JSX | `options={{ title }}` del Stack |
| servidor de la API aparte (`api/`, puerto 3000) | `app/api/*+api.js`, mismo puerto 8081 |

📂 **Verlo funcionando:** `parciales/simulacro-prueba3-2026sem2-matutino/mobile/app/_layout.jsx` ·
`.../app/games/[id].jsx` (`Stack.Screen` con `Partida ${id}` en cada return) · `.../app/static/[...path]+api.js`
(catch-all) · `.../app/api/games/[id]+api.js` · `parciales/2025sem1-parcial-rn/mobile/app/+not-found.jsx` ·
`parciales/2025sem1-parcial-rn/mobile/app/index.jsx` (`headerRight`) · docs:
[notation.mdx](../docs-offline/expo/docs/pages/router/basics/notation.mdx) ·
[navigation-layouts.mdx](../docs-offline/expo/docs/pages/router/basics/navigation-layouts.mdx) ·
[stack.mdx](../docs-offline/expo/docs/pages/router/advanced/stack.mdx) ·
[tabs.mdx](../docs-offline/expo/docs/pages/router/advanced/tabs.mdx) ·
[api-routes.mdx](../docs-offline/expo/docs/pages/router/web/api-routes.mdx)

---

## ❓ Repaso

**Pregunta:** te piden `/` (inicio), `/players` (lista), `/players/:id` (detalle con el nombre del
jugador como título). ¿Qué archivos creás y qué va en `_layout.jsx`?

**Respuesta:**
```
app/_layout.jsx
app/index.jsx
app/players/index.jsx
app/players/[id].jsx
```
```jsx
<Stack>
  <Stack.Screen name="index" options={{ title: 'Inicio' }} />
  <Stack.Screen name="players/index" options={{ title: 'Jugadores' }} />
  <Stack.Screen name="players/[id]" options={{ title: 'Jugador' }} />
</Stack>
```
Y en `players/[id].jsx`, cuando llega el jugador: `<Stack.Screen options={{ title: player.name }} />`.
