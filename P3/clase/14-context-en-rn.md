# Tema 14 — Context en React Native

> **Es exactamente el Context de P2** ([`../../P2/clase/16-context.md`](../../P2/clase/16-context.md)):
> `createContext` + Provider + `useContext`. Lo único nuevo es **dónde va el Provider**.

## 14.1 Cuándo usarlo (y cuándo no)

| El dato… | Dónde va |
|---|---|
| lo usa **una** pantalla | `useState` / hook en esa pantalla |
| identifica la pantalla (`id` de la partida) | **URL**: `app/games/[id].jsx` + `useLocalSearchParams` (tema 8.3) |
| pasa de una pantalla a la siguiente una vez (nombre, dificultad) | **params** de `router.push` (tema 8.4) |
| lo leen/cambian **varias** pantallas y no está en la API | **Context** |
| tiene que sobrevivir a cerrar la app | Context **+ AsyncStorage** (tema 15) |
| ya vive en la API (partida, ranking) | **la API** (no lo copies a un Context) |

En el simulacro 2026sem2 **no hace falta** Context: el jugador viaja en la partida
(`game.player`) y todo lo demás está en la API. Aparece si piden, por ejemplo, "recordar el nombre
del jugador en el inicio", "modo oscuro" o "favoritos".

## 14.2 Dónde va el Provider: `app/_layout.jsx`, envolviendo el `<Stack>`

En RN no hay `main.jsx`: el "raíz" de la app es **`app/_layout.jsx`**. Todo lo que esté adentro del
`<Stack>` (todas las pantallas) puede leer el contexto.

```jsx
// app/_layout.jsx
import { DefaultTheme, Stack, ThemeProvider } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { PlayerProvider } from '@/context/PlayerProvider';

export default function RootLayout() {
  return (
    <PlayerProvider>                                  {/* ← afuera del Stack */}
      <ThemeProvider value={DefaultTheme}>
        <Stack>
          <Stack.Screen name="index" options={{ title: 'Higher / Lower' }} />
          <Stack.Screen name="games/[id]" options={{ title: 'Partida' }} />
        </Stack>
        <StatusBar style="auto" />
      </ThemeProvider>
    </PlayerProvider>
  );
}
```
⚠️ Si lo ponés **adentro de una pantalla** (`index.jsx`), solo esa pantalla lo ve y las otras reciben
`null` → *Cannot read property 'player' of null*.
⚠️ **No** crees el archivo del contexto en `app/`: Expo Router lo toma como ruta. Carpeta `context/`.

## 14.3 Tres archivos (como en P2)

```js
// context/PlayerContext.js
import { createContext, useContext } from 'react';
export const PlayerContext = createContext(null);
export function usePlayer() {
  const value = useContext(PlayerContext);
  if (!value) throw new Error('usePlayer tiene que usarse dentro de <PlayerProvider>');
  return value;
}
```
```jsx
// context/PlayerProvider.jsx
import { useState } from 'react';
import { PlayerContext } from './PlayerContext';

export function PlayerProvider({ children }) {
  const [player, setPlayer] = useState('');
  const [bestScore, setBestScore] = useState(0);
  function registerScore(score) {
    setBestScore((best) => Math.max(best, score));
  }
  return (
    <PlayerContext.Provider value={{ player, setPlayer, bestScore, registerScore }}>
      {children}
    </PlayerContext.Provider>
  );
}
```
```jsx
// en cualquier pantalla
const { player, setPlayer } = usePlayer();
<TextInput value={player} onChangeText={setPlayer} placeholder="Tu nombre" />
```

**¿Separarlos es obligatorio por el lint?** En P2 sí (regla de Fast Refresh de Vite). En esta
plantilla **no**: `expo lint` no trae esa regla — lo probé: Context + Provider + hook en **un solo
archivo** pasa `npx eslint` sin mensajes. Igual separalos: es lo que ya sabés hacer, y Fast Refresh
de Metro recarga mejor un archivo que exporta solo componentes.

## 14.4 Ejemplo: tema claro/oscuro

```jsx
// context/ThemeModeProvider.jsx
export function ThemeModeProvider({ children }) {
  const system = useColorScheme();                         // 'light' | 'dark' (de react-native)
  const [mode, setMode] = useState(null);                  // null = seguir al sistema
  const current = mode ?? system ?? 'light';               // derivado
  const colors = current === 'dark'
    ? { background: '#121212', text: '#eee', card: '#222' }
    : { background: '#fff', text: '#222', card: '#fff' };
  const toggle = () => setMode(current === 'dark' ? 'light' : 'dark');
  return <ThemeModeContext.Provider value={{ current, colors, toggle }}>{children}</ThemeModeContext.Provider>;
}
// en una pantalla
const { current, colors, toggle } = useThemeMode();
<View style={[styles.container, { backgroundColor: colors.background }]}>
  <Text style={{ color: colors.text }}>Hola</Text>
  <Switch value={current === 'dark'} onValueChange={toggle} />
```
En RN **no hay herencia de CSS**: cada `<Text>` necesita su `color` (no hay `.modo-dark .tarjeta`).
Para el header/fondo de navegación: `<ThemeProvider value={current === 'dark' ? DarkTheme : DefaultTheme}>`
(`DarkTheme` y `DefaultTheme` se importan de `expo-router`).

## 14.5 Ejemplo: favoritos (lista compartida)

```jsx
export function FavoritesProvider({ children }) {
  const [codes, setCodes] = useState([]);                       // ['URY', 'ARG']
  const isFavorite = (code) => codes.includes(code);
  const toggleFavorite = (code) =>
    setCodes((list) => (list.includes(code) ? list.filter((c) => c !== code) : [...list, code]));
  return (
    <FavoritesContext.Provider value={{ codes, isFavorite, toggleFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
}
// Botón estrella en cualquier pantalla
const { isFavorite, toggleFavorite } = useFavorites();
<Pressable onPress={() => toggleFavorite(country.code)}>
  <Text style={{ fontSize: 24 }}>{isFavorite(country.code) ? '★' : '☆'}</Text>
</Pressable>
// Contador en el header: DENTRO de la pantalla (el layout que renderiza el Provider no puede leerlo)
const { codes } = useFavorites();
<Stack.Screen options={{ title: `Países (${codes.length} ★)` }} />
```
Inmutabilidad igual que en P2: `filter` para sacar, spread para agregar, **nunca** `push`.
⚠️ El lint **no** detecta `codes.push(x); setCodes(codes)` dentro de un handler (lo probé): no
cambia la referencia → React no re-renderiza → "no pasa nada al tocar la estrella".

Para que sobrevivan a cerrar la app → AsyncStorage en el Provider (tema 15.5).

## 14.6 Cada consumidor se re-dibuja

Cuando cambia el `value`, **todas** las pantallas que llaman a `usePlayer()` se vuelven a ejecutar,
aunque estén "atrás" en el Stack (siguen montadas, tema 9.2). Para estos tamaños da igual; no
optimices con `useMemo` (con `reactCompiler: true` el compilador ya memoiza, tema 17.5).

📂 **Verlo funcionando:** `parciales/simulacro-prueba3-2026sem2-matutino/mobile/app/_layout.jsx` (dónde
iría el Provider) · P2: `../P2/parciales/simulacro-prueba2-2026sem2-matutino/web/src/context/` (FavoritesContext + Provider) ·
Docs: [usecolorscheme.md](../docs-offline/react-native-website/docs/usecolorscheme.md) ·
[navigation-layouts.mdx](../docs-offline/expo/docs/pages/router/basics/navigation-layouts.mdx)

---

## ❓ Repaso

**Pregunta:** querés que el nombre escrito en el inicio aparezca en el header de **todas** las
pantallas. Lo pusiste en un `useState` de `app/index.jsx`. ¿Qué cambiás y dónde va el Provider?

**Respuesta:** el nombre lo usan varias pantallas y no está en la API → Context.
`context/PlayerContext.js` (contexto + `usePlayer`) y `context/PlayerProvider.jsx` (`useState('')`);
en **`app/_layout.jsx`** envolvés el `<Stack>` con `<PlayerProvider>`. En `index.jsx`:
`const { player, setPlayer } = usePlayer();` y `<TextInput value={player} onChangeText={setPlayer} />`.
En el layout, para el header, el que lee el contexto tiene que estar **adentro** del Provider: o un
componente hijo que haga `<Stack.Screen options={{ title: player }} />` dentro de cada pantalla
(tema 7.4), o un `RootStack` interno en el layout que llame a `usePlayer()`.
