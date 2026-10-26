# Tema 15 — AsyncStorage: guardar datos en el dispositivo

> El `localStorage` de React Native. Ya está en la plantilla:
> `"@react-native-async-storage/async-storage": "2.2.0"` en `mobile/package.json` → **no hay que
> instalar nada** (y en el examen no hay internet para hacerlo).

## 15.1 La API (v2.2.0): todo es asíncrono y todo es string

```js
import AsyncStorage from '@react-native-async-storage/async-storage';   // export default

await AsyncStorage.setItem('player', 'Bruno');          // guardar   → Promise<void>
const name = await AsyncStorage.getItem('player');      // leer      → Promise<string | null>
await AsyncStorage.removeItem('player');                // borrar    → Promise<void>
```
| Quiero… | Uso |
|---|---|
| Guardar un string | `await AsyncStorage.setItem(key, 'texto')` |
| Guardar objeto / array / número / boolean | `await AsyncStorage.setItem(key, JSON.stringify(valor))` |
| Leer | `const raw = await AsyncStorage.getItem(key)` → **`null` si no existe** |
| Leer objeto | `const valor = raw !== null ? JSON.parse(raw) : valorPorDefecto` |
| Borrar una clave / todo | `removeItem(key)` / `clear()` (⚠️ borra todo lo de la app) |
| Hook atado a una clave | `const { getItem, setItem } = useAsyncStorage('player')` (también exportado) |

Diferencias con `localStorage` de la web:
1. **Asíncrono**: devuelve promesas → `await` (o `.then`). Sin `await`, `getItem` te da una **Promise**, no el valor.
2. **Solo strings**: `setItem('score', 7)` no guarda un número → `String(7)` / `JSON.stringify`.
3. **En web, por debajo usa `window.localStorage`** (lo dice su código en `node_modules`): podés
   ver lo guardado en DevTools → Application → Local Storage. En el celular usa almacenamiento nativo.

⚠️ La documentación en internet hoy es la **v3** (API distinta, `createAsyncStorage`). Usá la copia
local de la **v2**: [API.md](../docs-offline/async-storage/packages/website/docs/API.md) ·
[Usage.md](../docs-offline/async-storage/packages/website/docs/Usage.md).

## 15.2 Cargar al montar (sin romper `set-state-in-effect`)

```jsx
const [player, setPlayer] = useState('');

useEffect(() => {
  (async () => {
    const saved = await AsyncStorage.getItem('player');
    if (saved !== null) setPlayer(saved);           // ✅ setState DESPUÉS de un await
  })();
}, []);
```
❌ Lo que **no** pasa el lint (probado):
```js
useEffect(() => {
  const raw = AsyncStorage.getItem('player');       // además es una Promise, no el valor
  setPlayer(raw);                                   // setState síncrono en el cuerpo del efecto
}, []);
// error  Error: Calling setState synchronously within an effect can trigger cascading renders
//        react-hooks/set-state-in-effect
```
La regla es la del tema 17.4: setState **directo** en el cuerpo del efecto = error; dentro de un
callback (`async` después de `await`, `.then`, `setInterval`) = bien.

## 15.3 Guardar: en el handler (lo más simple)

```jsx
function handleChangePlayer(text) {
  setPlayer(text);
  AsyncStorage.setItem('player', text);              // fire-and-forget: no hace falta esperar
}
<TextInput value={player} onChangeText={handleChangePlayer} />
```
O al confirmar (menos escrituras): guardarlo en `handlePlay` antes de crear la partida.

## 15.4 Guardar con un efecto (y la trampa del primer render)

```jsx
const [codes, setCodes] = useState([]);
const [isLoaded, setIsLoaded] = useState(false);

useEffect(() => {                                     // 1) cargar
  (async () => {
    try {
      const raw = await AsyncStorage.getItem('favorites');
      if (raw !== null) setCodes(JSON.parse(raw));
    } finally {
      setIsLoaded(true);
    }
  })();
}, []);

useEffect(() => {                                     // 2) guardar cada vez que cambia
  if (!isLoaded) return;                              // ← sin esto: pisa lo guardado con []
  AsyncStorage.setItem('favorites', JSON.stringify(codes));
}, [codes, isLoaded]);
```
⚠️ **La trampa:** los dos efectos corren en el **primer render**. Sin `isLoaded`, el de guardar
escribe `[]` **antes** de que termine la lectura → al reiniciar la app los favoritos "se borran".
(Este código pasa el lint: el `setItem` no es un setState.)

## 15.5 Dentro de un Provider (lo típico)

Juntá tema 14 + 15: el Provider carga una vez al montar y guarda en cada cambio, y las pantallas
ni se enteran de que existe AsyncStorage.
```jsx
export function FavoritesProvider({ children }) {
  const [codes, setCodes] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  /* efectos de 15.4 */
  const toggleFavorite = (code) =>
    setCodes((list) => (list.includes(code) ? list.filter((c) => c !== code) : [...list, code]));
  return (
    <FavoritesContext.Provider value={{ codes, isLoaded, toggleFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
}
```
`isLoaded` en el `value` sirve para que una pantalla muestre "Cargando…" en vez de "No tenés favoritos".

## 15.6 AsyncStorage vs. estado en la API

| | **API** (`data.json`) | **AsyncStorage** |
|---|---|---|
| Dónde vive | en la compu (servidor) | en **ese** dispositivo |
| Lo ve otro celular | sí | no |
| Sobrevive a cerrar la app | sí | sí |
| Ejemplo 2026sem2 | partida, puntaje, ranking | "recordar mi nombre", preferencias, favoritos locales |
| Cómo se lee | `fetchJSON` + hook | `await getItem` en un efecto |

⚠️ **No dupliques** en AsyncStorage algo que la API ya guarda (la partida en curso): si los dos
difieren, ¿cuál vale? La partida se retoma por la URL `/games/:id`, que pide a la API.
Lo que sí tiene sentido: guardar el **id de la última partida** para un botón "Continuar".

## 15.7 Cosas que pasan

- `JSON.parse(null)` da `null` (no rompe), pero `JSON.parse('')` o un string viejo no-JSON **tira** →
  envolvé la lectura en `try/catch`.
- Para "resetear" mientras probás: en web, borrar el Local Storage en DevTools; en el celular,
  `AsyncStorage.clear()` desde un botón temporal (y sacarlo antes de entregar).
- Leer es async → en el primer render **siempre** tenés el valor inicial (`''`, `[]`).

📂 **Verlo funcionando:** `parciales/simulacro-prueba3-2026sem2-matutino/mobile/package.json` (la
dependencia) · `parciales/simulacro-prueba3-2026sem2-matutino/node_modules/@react-native-async-storage/async-storage/src/AsyncStorage.ts`
(versión web: `window.localStorage`) · Docs: [API.md](../docs-offline/async-storage/packages/website/docs/API.md) ·
[sdk/async-storage.mdx](../docs-offline/expo/docs/pages/versions/v58.0.0/sdk/async-storage.mdx)

---

## ❓ Repaso

**Pregunta:** ¿por qué el inicio siempre muestra el campo vacío aunque ayer escribiste "Bruno"?
```jsx
const [player, setPlayer] = useState(AsyncStorage.getItem('player') ?? '');
```

**Respuesta:** `getItem` es **asíncrono**: devuelve una `Promise` (que no es `null`, así que el `??`
no actúa) y el estado arranca con la promesa, no con el texto. Hay que arrancar en `''` y cargar en
un efecto, con el `setState` después del `await`:
```jsx
const [player, setPlayer] = useState('');
useEffect(() => {
  (async () => {
    const saved = await AsyncStorage.getItem('player');
    if (saved !== null) setPlayer(saved);
  })();
}, []);
```
