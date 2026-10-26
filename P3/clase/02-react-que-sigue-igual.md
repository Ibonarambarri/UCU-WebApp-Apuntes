# Tema 2 — React Native: qué sigue igual y qué cambia respecto de React web

## 2.1 La idea en una línea

**React Native = React + otros "ladrillos".** El React (componentes, props, estado, hooks) es el
**mismo** de P2. Lo que cambia es con qué dibujás: en vez de `<div>`, `<p>`, `<button>` (HTML del
navegador) usás `<View>`, `<Text>`, `<Pressable>` (componentes que se convierten en vistas nativas
de Android/iOS, o en HTML cuando lo abrís con `w`).

```
evento → setAlgo(nuevo) → React vuelve a ejecutar el componente → pantalla nueva   ← IGUAL QUE EN P2
```

## 2.2 Lo que sigue EXACTAMENTE igual (repasalo en P2)

| Concepto | Igual en RN | Repaso P2 |
|---|---|---|
| Componentes = funciones que devuelven JSX, `export default` | ✅ | [03-componentes-y-jsx](../../P2/clase/03-componentes-y-jsx.md) |
| Props, funciones como props, `children` | ✅ | [04-props-y-children](../../P2/clase/04-props-y-children.md) |
| `map` + `key`, `&&`, ternario, `let content` + `if` | ✅ (con un ⚠️, ver 2.5) | [05-listas-y-condicionales](../../P2/clase/05-listas-y-condicionales.md) |
| `useState`, inmutabilidad (`[...a, x]`, `filter`, `map`) | ✅ | [07-usestate](../../P2/clase/07-usestate.md) |
| Estado derivado (calcular, no guardar) | ✅ | [09-estado-derivado](../../P2/clase/09-estado-derivado.md) |
| `useEffect`, dependencias, limpieza (`ignore`) | ✅ | [10-useeffect](../../P2/clase/10-useeffect.md) |
| `fetch`, `async/await`, `try/catch/finally` | ✅ (`fetchJSON` de `common/fetch.js`) | [11-api-fetch](../../P2/clase/11-api-fetch.md) |
| Hooks propios `useFetchJSON`, `useCreateX` | ✅ (idénticos) | [12-hooks-propios](../../P2/clase/12-hooks-propios.md) |
| Context (`createContext`, Provider, `useContext`) | ✅ | [16-context](../../P2/clase/16-context.md) |
| `useCallback`, `useMemo`, `useRef` | ✅ | [17-usememo-usecallback-useref](../../P2/clase/17-usememo-usecallback-useref.md) |
| Reglas de hooks (arriba, nunca en `if` ni después de un `return`) | ✅ | [07-usestate §7.6](../../P2/clase/07-usestate.md) |

El `hooks/useFetchJSON.js` del simulacro es **el mismo** de P2 (más `setData` e `ignore`). Si lo
sabías hacer en web, lo sabés hacer acá.

## 2.3 Lo que cambia

| Web (P2) | React Native (P3) |
|---|---|
| `<div>` | `<View>` |
| `<p>`, `<span>`, `<h1>` | `<Text>` (con `style` para el tamaño) |
| `<img src="…">` | `<Image source={{ uri: '…' }} style={{ width, height }} />` |
| `<button onClick>` | `<Pressable onPress>` / `<TouchableOpacity onPress>` / el `Button` de la plantilla |
| `<input value onChange={(e) => set(e.target.value)}>` | `<TextInput value onChangeText={set}>` (te da el **string**) |
| `<input type="checkbox">` | `<Switch value onValueChange>` |
| `<select>` | no existe: una fila de botones (tema 6) |
| `<ul>{items.map(...)}</ul>` | `<FlatList data renderItem keyExtractor>` (tema 5) |
| Scroll automático de la página | **No scrollea solo**: `<ScrollView>` o `<FlatList>` |
| `className` + CSS / CSS Modules | `style={styles.x}` con `StyleSheet.create` (tema 4) |
| `<form onSubmit>` + `e.preventDefault()` | no hay `<form>`: `onPress` del botón y `onSubmitEditing` del input |
| `<Link to>` / `useNavigate` / `useParams` (React Router) | `<Link href>` / `useRouter` / `useLocalSearchParams` (Expo Router, temas 7-8) |
| `alert()`, `window`, `document`, `localStorage` | no existen en el celular (AsyncStorage para guardar, `Alert.alert`) |

## 2.4 Eventos: `onPress` y `onChangeText`

```jsx
// Web
<button onClick={() => setCount(count + 1)}>+</button>
<input value={name} onChange={(e) => setName(e.target.value)} />

// React Native
<Pressable onPress={() => setCount(count + 1)}><Text>+</Text></Pressable>
<TextInput value={name} onChangeText={setName} />     // recibe el texto directo
```
Mismo truco de P2: `onPress={handle}` (sin paréntesis) o `onPress={() => handle(x)}` si hay que
pasar algo. ⚠️ `onPress={handle()}` lo ejecuta al dibujar.

## 2.5 ⚠️ Todo texto va adentro de `<Text>`

En web podés tirar texto suelto en un `<div>`. En RN **no**:
```jsx
<View>Hola</View>                       // ❌ "Text strings must be rendered within a <Text> component."
<View><Text>Hola</Text></View>          // ✅
```
Trampas típicas que dan **ese mismo error** (en el celular; en web a veces "anda" y te confiás):
```jsx
{score && <Text>{score}</Text>}         // ❌ con score = 0 dibuja "0" suelto → crash
{score > 0 && <Text>{score}</Text>}     // ✅ la condición es booleana
<View> {item.name}</View>               // ❌ hasta un espacio suelto cuenta
```
Y un `<Pressable>` no muestra texto por sí solo: adentro va un `<Text>`.

## 2.6 Probá en web, pero pensá en el celular

`w` es lo más cómodo, pero react-native-web es más permisivo. Antes de entregar, si podés, abrilo en
Expo Go. Diferencias que muerden:
- Texto suelto: en web se ve, en el celular rompe (2.5).
- `Alert.alert(...)` **no hace nada en web** → para mensajes del examen usá un `<Text>` en pantalla.
- En el celular la API no está en `localhost`: por eso `fetchJSON` y las imágenes usan
  `expoDevServerUri(...)` (tema 3.3).

📂 **Verlo funcionando:** `parciales/simulacro-prueba3-2026sem2-matutino/mobile/hooks/useFetchJSON.js` (= P2) ·
`.../mobile/app/index.jsx` (`TextInput` + `onChangeText`, `let rankingContent` como en P2) ·
docs: [intro-react-native-components.md](../docs-offline/react-native-website/docs/intro-react-native-components.md)

---

## ❓ Repaso

**Pregunta:** pasá a React Native este fragmento de P2:
```jsx
<div>
  <h2>Jugador: {name}</h2>
  {wins && <p>Ganó {wins}</p>}
  <button onClick={() => setWins(wins + 1)}>Sumar</button>
</div>
```

**Respuesta:**
```jsx
<View>
  <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Jugador: {name}</Text>
  {wins > 0 && <Text>Ganó {wins}</Text>}
  <Pressable onPress={() => setWins(wins + 1)}>
    <Text>Sumar</Text>
  </Pressable>
</View>
```
`div` → `View`; `h2`/`p` → `Text` (el tamaño va en `style`); `wins &&` → `wins > 0 &&` (si no,
con 0 queda un "0" suelto y rompe); `onClick` → `onPress` y el texto del botón dentro de `<Text>`.
