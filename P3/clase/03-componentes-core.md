# Tema 3 — Componentes core: los "ladrillos" de React Native

Todo se importa de `'react-native'`:
```jsx
import { View, Text, Image, TextInput, Pressable, TouchableOpacity, ScrollView,
         ActivityIndicator, Switch, Modal } from 'react-native';
```

## 3.1 Tabla HTML → React Native

| HTML | RN | Notas |
|---|---|---|
| `<div>`, `<section>`, `<nav>` | `View` | caja; por defecto apila **en columna** (tema 4) |
| `<p>`, `<span>`, `<h1>`…`<h6>`, `<label>` | `Text` | **todo** texto va acá |
| `<img>` | `Image` | tamaño obligatorio si es remota |
| `<input>`, `<textarea>` | `TextInput` | `multiline` = textarea |
| `<button>` | `Pressable` / `TouchableOpacity` / `Button` | |
| `<input type="checkbox">` | `Switch` | |
| página con scroll | `ScrollView` / `FlatList` | sin esto, lo que no entra **se corta** |
| spinner | `ActivityIndicator` | |
| `<dialog>` | `Modal` | |

## 3.2 `View` y `Text`

```jsx
<View style={styles.row}>                          {/* caja */}
  <Text style={styles.titleText}>Ranking</Text>    {/* texto */}
  <Text>
    Puntaje: <Text style={{ fontWeight: 'bold' }}>{score}</Text>   {/* Text anidado = <span> */}
  </Text>
</View>
```
- `Text` adentro de `Text` hereda el estilo del de afuera (es lo **único** que hereda, tema 4.3).
- `numberOfLines={1}` corta con "…" un nombre largo.

## 3.3 `Image`: `source`, tamaño, `resizeMode`

```jsx
// Remota (de la API): source es un OBJETO { uri } y el tamaño es OBLIGATORIO
<Image
  source={{ uri: expoDevServerUri(country.flagUrl) }}   // URL completa (ver abajo)
  style={{ width: 80, height: 54 }}                    // sin esto → mide 0×0, no se ve
  resizeMode="contain"                                 // 'cover' (default) | 'contain' | 'stretch' | 'center'
/>

// Local (archivo del proyecto): require con ruta relativa; el tamaño lo saca del archivo
<Image source={require('../assets/images/icon.png')} style={styles.logoImage} />
```
- ⚠️ **No hay `src` ni `alt`**: `src="…"` no muestra nada.
- ⚠️ `flagUrl` viene **relativa** (`/static/flags/URY.png`). En web anda igual, pero en el celular
  la app no está en el mismo servidor que la API → usá **siempre** `expoDevServerUri(flagUrl)`
  (de `@/common/utils`), que arma `http://192.168.x.x:8081/static/flags/URY.png`.
- `contain` = entra entera (bandera); `cover` = llena la caja recortando (foto de fondo).
- La plantilla también trae `expo-image` (`import { Image } from 'expo-image'`): misma idea, pero el
  ajuste se llama `contentFit="contain"` en vez de `resizeMode` (lo usó 2026sem1).

## 3.4 `TextInput` (detalle en tema 6)

```jsx
<TextInput style={styles.input} placeholder="Tu nombre" value={player} onChangeText={setPlayer} />
```
Sin `style` en el celular **no se ve el borde**: parece que no hay nada.

## 3.5 Botones: `Button` vs `Pressable` vs `TouchableOpacity`

| Componente | Cómo se usa | Cuándo |
|---|---|---|
| `Button` de RN | `<Button title="Jugar" onPress={…} disabled={…} color="#000099" />` | rapidísimo, pero **casi no se puede estilar** (solo `color`) |
| `TouchableOpacity` | `<TouchableOpacity style onPress disabled><Text>Jugar</Text></TouchableOpacity>` | botón con estilo propio; se pone transparente al tocarlo |
| `Pressable` | igual, y `style` puede ser **función** de `{ pressed }` | el recomendado hoy; feedback a gusto |

```jsx
<Pressable
  onPress={() => handleGuess('higher')}
  disabled={isGuessing}
  style={({ pressed }) => [styles.primaryButton, pressed && { opacity: 0.7 }]}
>
  <Text style={styles.buttonText}>Más ▲</Text>
</Pressable>
```

**El `Button` de la plantilla** (`components/Button.jsx`) **no es** el de RN: es un
`TouchableOpacity` ya estilado. Usalo, y fijate en el import:
```jsx
import Button from '@/components/Button';        // ✅ el de la plantilla (default export)
// import { Button } from 'react-native';        // ← el otro, sin estilos
<Button title={isCreating ? 'Creando…' : 'Jugar'} onPress={handlePlay} disabled={!canPlay} />
<Button title="Volver al inicio" onPress={handleGoHome} style={styles.dangerButton} />
```
Por dentro: `style={[style, disabled && styles.disabledButton]}` → con `disabled` se ve a media opacidad.

## 3.6 `ScrollView`

```jsx
<ScrollView contentContainerStyle={styles.container}>   {/* padding/gap van en contentContainerStyle */}
  …contenido más largo que la pantalla…
</ScrollView>
```
⚠️ El `style` de un ScrollView es la "ventana"; el **contenido** se estila con `contentContainerStyle`.
Listas largas o que vienen de la API → `FlatList` (tema 5), no ScrollView.

## 3.7 `ActivityIndicator`, `Switch`, `Modal`

```jsx
<ActivityIndicator size="large" color="#000099" />      // ruedita de "cargando"

<Switch value={soloFavoritos} onValueChange={setSoloFavoritos} />   // recibe el booleano nuevo

<Modal visible={open} animationType="slide" transparent onRequestClose={() => setOpen(false)}>
  <View style={styles.centered}>
    <Text>¿Seguro?</Text>
    <Button title="Cerrar" onPress={() => setOpen(false)} />
  </View>
</Modal>
```
`onRequestClose` = botón "atrás" de Android. El modal se muestra/oculta con **estado**, como en P2.

## 3.8 `SafeAreaView` (el notch)

En la plantilla el **header del Stack** ya deja el espacio de arriba, así que casi nunca hace falta.
Si sacás el header (`headerShown: false`), envolvé la pantalla:
```jsx
import { SafeAreaView } from 'react-native-safe-area-context';   // ✅ (el de 'react-native' está deprecado)
<SafeAreaView style={{ flex: 1 }}>…</SafeAreaView>
```

## 3.9 Un componente propio = igual que en P2

```jsx
// components/CountryCard.jsx
export default function CountryCard({ country, stat, hidden }) {
  return (
    <View style={cardStyles.card}>
      <Image source={{ uri: expoDevServerUri(country.flagUrl) }} style={cardStyles.flag} resizeMode="contain" />
      <Text style={cardStyles.name}>{country.name}</Text>
      <Text style={cardStyles.value}>{hidden ? '?' : formatNumber(country[stat])}</Text>
    </View>
  );
}
```

📂 **Verlo funcionando:** `parciales/simulacro-prueba3-2026sem2-matutino/mobile/components/Button.jsx` ·
`.../components/CountryCard.jsx` (Image remota) · `.../components/StatusMessage.jsx` (ActivityIndicator) ·
`parciales/2026sem1-prueba3-vespertino/app/groups/[letter].jsx` (expo-image + TouchableOpacity) ·
`parciales/2025sem1-parcial-rn/mobile/app/index.jsx` (Pressable) · docs:
[image.md](../docs-offline/react-native-website/docs/image.md) ·
[pressable.md](../docs-offline/react-native-website/docs/pressable.md) ·
[handling-touches.md](../docs-offline/react-native-website/docs/handling-touches.md) ·
[modal.md](../docs-offline/react-native-website/docs/modal.md)

---

## ❓ Repaso

**Pregunta:** la bandera no aparece: `<Image src={country.flagUrl} />`. ¿Cuáles son los 3 errores?

**Respuesta:**
```jsx
<Image
  source={{ uri: expoDevServerUri(country.flagUrl) }}
  style={{ width: 80, height: 54 }}
  resizeMode="contain"
/>
```
1. Es `source={{ uri }}`, no `src`. 2. Imagen remota sin `width`/`height` mide 0×0.
3. `flagUrl` es relativa: en el celular hace falta `expoDevServerUri` para armar la URL completa.
