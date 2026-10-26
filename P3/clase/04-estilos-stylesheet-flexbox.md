# Tema 4 — Estilos: `StyleSheet` y flexbox

## 4.1 No hay CSS: los estilos son objetos de JavaScript

```jsx
import { StyleSheet, Text, View } from 'react-native';

export default function Tarjeta() {
  return (
    <View style={styles.card}>
      <Text style={styles.name}>Uruguay</Text>
    </View>
  );
}

const styles = StyleSheet.create({     // abajo del componente, fuera de la función
  card: {
    padding: 12,                       // número = puntos (sin 'px')
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    backgroundColor: 'white',
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',                // string
  },
});
```
| CSS | RN |
|---|---|
| `background-color: red;` | `backgroundColor: 'red'` (**camelCase**, valores string) |
| `padding: 12px;` | `padding: 12` (**número sin unidad**) |
| `width: 50%;` | `width: '50%'` (porcentaje como string) |
| `margin: 0 10px;` | `marginVertical: 0, marginHorizontal: 10` (no hay atajos con varios valores) |
| `border: 1px solid #ccc;` | `borderWidth: 1, borderColor: '#ccc'` (sólido por defecto) |
| `font-weight: 600;` | `fontWeight: '600'` (**string**) |
| `className="card"` | `style={styles.card}` |
| `:hover`, media queries, selectores | no existen (`Pressable` con `pressed`, `useWindowDimensions`) |

`StyleSheet.create` no es obligatorio (un objeto común también anda, como `homeStyles` del
simulacro), pero valida los nombres y es la convención.

## 4.2 Estilo en línea

```jsx
<Text style={{ textAlign: 'center' }}>vs</Text>      {/* doble llave: JSX + objeto */}
```
Para algo puntual está bien; si se repite, al `StyleSheet`.

## 4.3 ⚠️ Sin cascada ni herencia (salvo Text dentro de Text)

```jsx
<View style={{ color: 'red', fontSize: 20 }}>
  <Text>Hola</Text>                {/* ❌ NO sale rojo: View no pasa estilos a sus hijos */}
</View>

<Text style={{ color: 'red' }}>
  Hola <Text style={{ fontWeight: 'bold' }}>mundo</Text>   {/* ✅ "mundo" sale rojo Y negrita */}
</Text>
```
Cada `Text` necesita su propio `style` (por eso la plantilla tiene `normalText`, `titleText`, `buttonText`).

## 4.4 Flexbox: lo mismo que en CSS… con otro default

Todo `View` ya es `display: flex`. Diferencias con la web:

| | Web | RN |
|---|---|---|
| `flexDirection` por defecto | `row` | **`column`** (los hijos se apilan) |
| `flexShrink` por defecto | `1` | **`0`** (un texto largo en una fila se sale: poné `flexShrink: 1` o `flex: 1`) |
| `flex: 1` | atajo de `1 1 0` | "ocupá todo el espacio libre" (solo acepta un número) |

```jsx
row: {
  flexDirection: 'row',              // en fila (input + botón)
  alignItems: 'center',              // eje cruzado (vertical en una fila)
  justifyContent: 'space-between',   // eje principal (horizontal en una fila)
  gap: 10,                           // espacio entre hijos
},
```
- `justifyContent` → eje **principal** (el de `flexDirection`): `flex-start`, `center`, `space-between`, `space-around`.
- `alignItems` → eje **cruzado**. `alignSelf` lo cambia para un solo hijo (`{ alignSelf: 'center' }`).
- `flexWrap: 'wrap'` → que bajen de renglón (grilla de botones).

## 4.5 `flex: 1` (el que más se olvida)

```jsx
container: { flex: 1, padding: 20, gap: 15 },     // la pantalla ocupa TODO el alto
input:     { flex: 1, borderWidth: 1, … },        // en una fila: el input se estira, el botón no
card:      { flex: 1, alignItems: 'center', … },  // dos tarjetas lado a lado, mitad y mitad
```
⚠️ Si una pantalla con `FlatList` no scrollea o se ve cortada, casi siempre falta `flex: 1` en el
contenedor de arriba.

## 4.6 Combinar estilos: arrays `[a, cond && b]`

```jsx
<View style={[styles.row, homeStyles.rankingRow]}>            {/* gana el último */}
<TouchableOpacity style={[style, disabled && styles.disabledButton]}>   {/* false se ignora */}
<Text style={[styles.titleText, { color: correct ? '#008800' : '#cc0000' }]}>
```
- Es el reemplazo de `className={`${a} ${b}`}` / clases condicionales de P2.
- `false`, `null`, `undefined` dentro del array **se ignoran** → `cond && estilo` es seguro.
- Si dos estilos ponen la misma propiedad, gana **el de más a la derecha**.

## 4.7 Estilos condicionales: 3 formas

```jsx
style={[styles.filterButton, filter === status && styles.filterActive]}   // agregar uno
style={isOver ? styles.dangerButton : styles.primaryButton}               // elegir uno
style={[styles.item, { backgroundColor: STATUSES[item.status].color }]}   // valor calculado
```

## 4.8 `common/styles.js` de la plantilla

```js
export const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, gap: 15 },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 10 },
  primaryButton: { …baseButton, backgroundColor: '#000099' },
  dangerButton:  { …baseButton, backgroundColor: '#cc0000' },
  disabledButton: { opacity: 0.5 },
  buttonText: { color: 'white', fontSize: 16, fontWeight: '600' },
  input: { flex: 1, borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 10, … },
  titleText: { fontSize: 24, fontWeight: 'bold' },
  normalText: { fontSize: 16, color: '#222' },
  errorText: { fontSize: 16, color: '#cc0000' },
});
```
```jsx
import { styles } from '@/common/styles';     // export con nombre → llaves
```
**Examen:** usá estos y agregá los tuyos ahí o en un `StyleSheet` al pie de la pantalla. El diseño
es libre: no pierdas tiempo puliendo.

📂 **Verlo funcionando:** `parciales/simulacro-prueba3-2026sem2-matutino/mobile/common/styles.js` ·
`.../components/CountryCard.jsx` (StyleSheet propio, `flex: 1`) · `.../app/games/[id].jsx` (arrays y color condicional) ·
`parciales/2025sem1-parcial-rn/mobile/components/TaskForm.jsx` (`flexWrap`, seleccionado) · docs:
[style.md](../docs-offline/react-native-website/docs/style.md) ·
[flexbox.md](../docs-offline/react-native-website/docs/flexbox.md) ·
[height-and-width.md](../docs-offline/react-native-website/docs/height-and-width.md)

---

## ❓ Repaso

**Pregunta:** querés el input del nombre y el botón **Jugar** en la misma fila, el input estirado y
el botón a su tamaño; y el botón gris cuando está deshabilitado. Estilos y JSX.

**Respuesta:**
```jsx
<View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
  <TextInput style={{ flex: 1, borderWidth: 1, borderColor: '#ccc', padding: 10 }} … />
  <Pressable style={[styles.primaryButton, !canPlay && { backgroundColor: '#999' }]} disabled={!canPlay} onPress={handlePlay}>
    <Text style={styles.buttonText}>Jugar</Text>
  </Pressable>
</View>
```
`flexDirection: 'row'` porque el default es columna; `flex: 1` solo en el input; el estilo
condicional va **último** en el array para pisar el `backgroundColor`.
