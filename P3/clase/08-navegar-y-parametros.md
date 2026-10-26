# Tema 8 — Navegar y leer parámetros: `Link`, `router`, `useLocalSearchParams`

Todo se importa de `'expo-router'`.

## 8.1 `<Link href>`: navegar al tocar

```jsx
import { Link } from 'expo-router';

<Link href="/">Volver al inicio</Link>                  // se dibuja como un Text tocable
<Link href={`/games/${game.id}`}>Ver partida</Link>
<Link href="/ranking" style={styles.normalText}>Ranking</Link>
```
Por dentro `Link` es un `<Text>`: sirve para links de texto. Para que **un botón** navegue, `asChild`:
```jsx
<Link href={`/groups/${letter}`} asChild>
  <Pressable style={styles.primaryButton}>        {/* UN solo hijo que acepte onPress */}
    <Text style={styles.buttonText}>Grupo {letter}</Text>
  </Pressable>
</Link>
```
`asChild` le pasa el `onPress` al hijo (Pressable o TouchableOpacity). ⚠️ Con el `Button` de la
plantilla mejor usá `onPress={() => router.push(…)}` (8.2).

Variantes: `<Link push href>`, `<Link replace href>`, `<Link dismissTo href>` (como los métodos de 8.2).

## 8.2 `useRouter()` / `router`: navegar desde código

```jsx
import { useRouter } from 'expo-router';      // o: import { router } from 'expo-router';

const router = useRouter();

async function handlePlay() {
  const game = await createGame(trimmedPlayer);
  if (game) router.push(`/games/${game.id}`);   // DESPUÉS de que la API respondió
}
```
| Método | Qué hace con la pila | Cuándo |
|---|---|---|
| `router.push(href)` | **apila** una pantalla nueva | ir a un detalle, crear y abrir |
| `router.navigate(href)` | va a `href`; si es la misma ruta de arriba, la **reusa** cambiando params; si está abajo, vuelve a ella | navegación "normal" (es lo que hace `<Link>`) |
| `router.replace(href)` | **reemplaza** la de arriba (atrás no vuelve a ella) | "Jugar de nuevo", después de un login |
| `router.back()` | saca la de arriba | botón "Volver" |
| `router.canGoBack()` | `true` si hay algo abajo | antes de `back()` |
| `router.dismissTo(href)` | saca pantallas hasta llegar a `href`; si no está en la pila, **reemplaza** por `href` | "Volver al inicio" desde lo más profundo |
| `router.dismissAll()` | vuelve a la primera del Stack | |
| `router.setParams({ q })` | cambia los params de la pantalla **actual** | filtro en la URL (8.5) |

`useNavigate()` de P2 = `useRouter()`; `navigate('/x')` = `router.push('/x')`; `navigate(-1)` = `router.back()`.

**"Volver al inicio" robusto** (en web, si recargaste en `/games/6` no hay nada abajo):
```jsx
router.dismissTo('/');                                         // simulacro 2026sem2
// equivalente a mano (2025):
if (router.canGoBack()) router.back(); else router.replace('/');
```
⚠️ `router.push('/')` para "volver" **apila otro inicio** encima: la flecha ← te devuelve a la partida.

## 8.3 `useLocalSearchParams`: leer `[id]` — ⚠️ SIEMPRE STRING

```jsx
// app/games/[id].jsx    URL: /games/6
import { useLocalSearchParams } from 'expo-router';

const { id } = useLocalSearchParams();        // id === '6'   (string, no 6)
```
Consecuencias:
```jsx
game.id === id                         // ❌ 6 === '6' → false
String(game.id) === String(id)         // ✅ (lo que hace el simulacro)
game.id === Number(id)                 // ✅
fetchJSON(`/api/games/${id}`)          // ✅ en una URL el string está perfecto
const vidas = Number(params.vidas) > 0 ? Number(params.vidas) : 3;   // con valor por defecto (2025)
```
Si el param no viene, es `undefined`. Un `[...path]` llega como **array** de strings.
`useParams()` de P2 = `useLocalSearchParams()`. (Existe `useGlobalSearchParams`, pero en un Stack
la de abajo se re-renderiza con la URL de la de arriba: usá la **Local**.)

## 8.4 `href` como objeto `{ pathname, params }`

```jsx
router.push({ pathname: '/games/[id]', params: { id: game.id } });      // → /games/6
router.push({ pathname: '/game', params: { nombre: 'Ana', vidas: 3 } }); // → /game?nombre=Ana&vidas=3
<Link href={{ pathname: '/teams/[code]', params: { code: 'URY' } }}>Uruguay</Link>
```
- Los params que **no** están en el `pathname` como `[x]` se vuelven **query** (`?vidas=3`).
- Del otro lado, todos se leen igual: `const { nombre, vidas } = useLocalSearchParams();` → `vidas === '3'`.
- Pasá **datos chicos** (id, nombre, nivel). Un objeto entero no: pasá el id y pedilo a la API.

## 8.5 Query params `?q=` y `router.setParams` (≈ `useSearchParams` de P2)

```jsx
// app/index.jsx   URL: /?q=uru
const { q = '' } = useLocalSearchParams();          // '' si no está
const visibles = countries.filter((c) => c.name.toLowerCase().includes(q.toLowerCase()));  // derivado

<TextInput value={q} onChangeText={(text) => router.setParams({ q: text })} placeholder="Buscar" />
```
El filtro vive en la URL: sobrevive a recargar la página y se comparte el link (como
`setSearchParams` en P2 [tema 15](../../P2/clase/15-usesearchparams.md)). Para limpiarlo:
`router.setParams({ q: '' })`. ⚠️ Igual que `id`, un `?page=2` llega como `'2'` → `Number(page)`.

## 8.6 `<Redirect>`: redirigir al dibujar

```jsx
import { Redirect } from 'expo-router';

export default function Index() {
  return <Redirect href="/games" />;          // como <Navigate to replace /> de P2
}

// guardia: sin nombre no se juega
if (!player) return <Redirect href="/" />;    // ⚠️ DESPUÉS de todos los hooks
```
Se comporta como `replace` (no queda en el historial → no hay bucle con "atrás").

## 8.7 Tabla React Router (P2) → Expo Router (P3)

| React Router v6 | Expo Router |
|---|---|
| `import { … } from 'react-router-dom'` | `import { … } from 'expo-router'` |
| `<Link to="/x">` | `<Link href="/x">` (y `asChild` para botones) |
| `const navigate = useNavigate()` | `const router = useRouter()` |
| `navigate('/x')` | `router.push('/x')` / `router.navigate('/x')` |
| `navigate('/x', { replace: true })` | `router.replace('/x')` |
| `navigate(-1)` | `router.back()` |
| `const { code } = useParams()` | `const { code } = useLocalSearchParams()` |
| `const [sp, setSp] = useSearchParams(); sp.get('q')` | `const { q } = useLocalSearchParams()` |
| `setSearchParams({ q })` | `router.setParams({ q })` |
| `<Navigate to="/" replace />` | `<Redirect href="/" />` |
| `to={`/countries/${code}`}` | `href={`/countries/${code}`}` o `{ pathname: '/countries/[code]', params: { code } }` |

📂 **Verlo funcionando:** `parciales/simulacro-prueba3-2026sem2-matutino/mobile/app/index.jsx` (`router.push`
tras crear) · `.../app/games/[id].jsx` (`useLocalSearchParams`, `String(...) === String(id)`, `replace`,
`dismissTo`) · `parciales/2026sem1-prueba3-vespertino/app/index.jsx` (`Link asChild`) ·
`parciales/2025sem2-parcial3-matutino/app/index.jsx` + `app/game.jsx` (`{ pathname, params }`, `Number`) ·
`parciales/2025sem1-parcial-rn/mobile/lib/navigation.js` (`canGoBack`) · docs:
[navigation.mdx](../docs-offline/expo/docs/pages/router/basics/navigation.mdx) ·
[url-parameters.mdx](../docs-offline/expo/docs/pages/router/reference/url-parameters.mdx) ·
[redirects.mdx](../docs-offline/expo/docs/pages/router/reference/redirects.mdx) ·
[expo-router.md](../docs-offline/expo-api-v58/expo-router.md) (todos los métodos de `router`)

---

## ❓ Repaso

**Pregunta:** en `/teams/[code].jsx` llega `code`. La API devuelve `{ code: 'URY', rival: { code: 'ARG' } }`.
1) Leé el código. 2) Botón que lleve a la página del rival. 3) Botón "Inicio" que no deje
pantallas viejas en la pila.

**Respuesta:**
```jsx
const { code } = useLocalSearchParams();                 // 'URY'
const router = useRouter();

<Button title="Ver rival" onPress={() => router.push(`/teams/${team.rival.code}`)} />
<Button title="Inicio" onPress={() => router.dismissTo('/')} />
```
`push` para apilar el rival (← vuelve a URY); `dismissTo('/')` saca todo hasta el inicio, o lo abre
si entraste directo por URL.
