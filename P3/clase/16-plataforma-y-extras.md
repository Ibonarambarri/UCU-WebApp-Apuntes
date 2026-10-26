# Tema 16 — Plataforma y extras: `Platform`, `Alert`, `Modal`, iconos, imágenes…

> Nada de esto es obligatorio en el simulacro. Es lo que te puede pedir una consigna "extra" o lo
> que te salva cuando algo **anda en el celular y no en web** (o al revés). Todo está ya instalado.

## 16.1 `Platform`: ¿dónde estoy corriendo?

```js
import { Platform } from 'react-native';

Platform.OS                     // 'ios' | 'android' | 'web'
if (Platform.OS === 'web') { … }

const padding = Platform.select({ ios: 20, android: 12, default: 16 });  // default = el resto (web)
const styles = StyleSheet.create({
  card: {
    ...Platform.select({
      web: { boxShadow: '0 1px 4px rgba(0,0,0,.15)' },
      default: { elevation: 3 },                                         // Android
    }),
  },
});
```
`Platform.select` prioriza `ios`/`android`, después `native` (los dos celulares), después `default`.
Archivos por plataforma: `Boton.web.jsx` + `Boton.jsx` → el import `./Boton` elige solo.

## 16.2 `Alert.alert`: ⚠️ en web NO hace nada

```js
import { Alert } from 'react-native';
Alert.alert('¿Abandonar?', 'Se pierde la partida', [
  { text: 'Cancelar', style: 'cancel' },
  { text: 'Salir', style: 'destructive', onPress: () => router.dismissTo('/') },
]);
```
En `react-native-web` es literalmente `class Alert { static alert() {} }` (mirado en
`node_modules/react-native-web/dist/exports/Alert/index.js`): **no muestra nada y no tira error**.
Si el corrector prueba en web, tu confirmación "no existe".

| Quiero… | Opción que anda en todos lados |
|---|---|
| Avisar un error | `<Text style={styles.errorText}>…</Text>` en la pantalla (lo que hace el simulacro) |
| Confirmar | `Platform.OS === 'web' ? window.confirm('¿Salir?') : Alert.alert(…)` |
| Confirmar con diseño propio | `<Modal>` (16.3) o un estado `confirming` que muestre dos botones |

```js
function confirmExit(onYes) {
  if (Platform.OS === 'web') {
    if (window.confirm('¿Abandonar la partida?')) onYes();
  } else {
    Alert.alert('¿Abandonar la partida?', '', [{ text: 'No', style: 'cancel' }, { text: 'Sí', onPress: onYes }]);
  }
}
```

## 16.3 `Modal`: algo encima de la pantalla

```jsx
import { Modal, View, Text } from 'react-native';
const [showHelp, setShowHelp] = useState(false);

<Button title="¿Cómo se juega?" onPress={() => setShowHelp(true)} />
<Modal
  visible={showHelp}                      // controlado por estado, como un input
  transparent                             // se ve la pantalla de atrás
  animationType="fade"                    // 'none' | 'slide' | 'fade'
  onRequestClose={() => setShowHelp(false)}   // botón "atrás" de Android
>
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,.4)' }}>
    <View style={{ backgroundColor: 'white', padding: 20, borderRadius: 12, gap: 10 }}>
      <Text>Adiviná si el segundo país tiene más o menos…</Text>
      <Button title="Entendido" onPress={() => setShowHelp(false)} />
    </View>
  </View>
</Modal>
```
Alternativa con Expo Router: una **ruta** como modal → `<Stack.Screen name="help" options={{ presentation: 'modal' }} />`
(ver [modals.mdx](../docs-offline/expo/docs/pages/router/advanced/modals.mdx)).

## 16.4 `useWindowDimensions`: tamaño de la pantalla

```js
import { useWindowDimensions } from 'react-native';
const { width, height } = useWindowDimensions();       // se actualiza al rotar / achicar la ventana
const isWide = width > 600;                            // derivado
<View style={{ flexDirection: isWide ? 'row' : 'column' }}>
const flagWidth = (width - 40 - 20) / 3;               // 3 columnas con padding 20 y gap 10
```
Preferilo a `Dimensions.get('window')` (ese no se actualiza solo).

## 16.5 Safe area (notch, barra de estado)

- Con el **header del Stack visible** (el caso del simulacro) **no hacés nada**: el header ya deja
  lugar arriba. Expo Router además envuelve todo en un `SafeAreaProvider`.
- Con `headerShown: false`, el contenido queda **debajo del notch** → usá el de
  `react-native-safe-area-context` (el `SafeAreaView` de `react-native` está **deprecado**):
```jsx
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
<SafeAreaView style={{ flex: 1 }} edges={['top', 'bottom']}> … </SafeAreaView>
const insets = useSafeAreaInsets();                     // { top, bottom, left, right } en puntos
<View style={{ paddingBottom: insets.bottom }}>          // botón pegado abajo sin tapar la barra
```

## 16.6 Iconos: `@expo/vector-icons`

```jsx
import Ionicons from '@expo/vector-icons/Ionicons';
<Ionicons name="trophy" size={24} color="#e6a700" />
<Ionicons name={isFav ? 'star' : 'star-outline'} size={24} color="#e6a700" />
```
Nombres que existen (comprobados en el glyphmap): `heart`, `heart-outline`, `star`, `star-outline`,
`arrow-up`, `arrow-down`, `caret-up`, `caret-down`, `trophy`, `refresh`, `home`, `checkmark-circle`,
`close-circle`. Otros sets: `MaterialIcons`, `FontAwesome`… (`@expo/vector-icons/MaterialIcons`).
Sin internet no podés buscar en la web de iconos: si dudás de un nombre, usá un **emoji** o texto
(`▲`, `▼`, `★`) como el simulacro (`"Más ▲"`). Un nombre que no existe muestra un `?`.

## 16.7 Vibración: `expo-haptics`

```js
import * as Haptics from 'expo-haptics';
Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);                    // toque leve
Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);      // acierto
Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);        // error
Haptics.selectionAsync();
```
Ejemplo: en `handleGuess`, después de recibir la respuesta,
`Haptics.notificationAsync(response.correct ? …Success : …Error)`. En web usa `navigator.vibrate`
(si el navegador no vibra, no pasa nada). Son async pero no hace falta `await`.

## 16.8 Imágenes: `Image` de RN vs `expo-image`

| | `Image` de `react-native` | `Image` de `expo-image` |
|---|---|---|
| Import | `import { Image } from 'react-native'` | `import { Image } from 'expo-image'` |
| Fuente remota | `source={{ uri }}` | `source={{ uri }}` (o `source="https://…"`) |
| Cómo encaja | **`resizeMode`**`="contain"` | **`contentFit`**`="contain"` |
| SVG en el celular | ❌ | ✅ (por eso las trivias 2025 con `.svg` usan expo-image) |
| Extras | — | `transition={200}`, `placeholder`, caché |
| Tamaño | **obligatorio** `width`/`height` | **obligatorio** también |

Las dos necesitan **`expoDevServerUri(flagUrl)`** para imágenes de la API (tema 10.4).
⚠️ No mezcles las props: `contentFit` en el `Image` de RN no hace nada (y viceversa).

## 16.9 `StatusBar` (la barra de la hora y la batería)

```jsx
import { StatusBar } from 'expo-status-bar';
<StatusBar style="auto" />      // 'auto' | 'light' | 'dark' — ya está en app/_layout.jsx
```
Fondo oscuro → `style="light"` (texto blanco). En web no hace nada (devuelve `null`).

## 16.10 Otros de `react-native` que pueden aparecer

| Quiero… | Uso |
|---|---|
| Interruptor sí/no | `<Switch value={on} onValueChange={setOn} />` |
| Cerrar el teclado | `Keyboard.dismiss()` |
| Que el teclado no tape el input | `<KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined}>` |
| Tirar para recargar | `<FlatList refreshing={isLoading} onRefresh={refetch} … />` (tema 5.5) |
| Modo oscuro del sistema | `useColorScheme()` → `'light' \| 'dark'` (tema 14.4) |
| Abrir un link | `Linking.openURL('https://…')` |

📂 **Verlo funcionando:** `parciales/simulacro-prueba3-2026sem2-matutino/mobile/app/_layout.jsx` (`StatusBar`) ·
`.../components/CountryCard.jsx` (`Image` de RN + `resizeMode`) · `parciales/2026sem1-prueba3-vespertino/app/teams/[code].jsx`
(`expo-image` + `contentFit`) · `parciales/2025sem2-simulacro-matutino/app/game.jsx` (expo-image con SVG) ·
Docs: [platform.md](../docs-offline/react-native-website/docs/platform.md) · [alert.md](../docs-offline/react-native-website/docs/alert.md) ·
[modal.md](../docs-offline/react-native-website/docs/modal.md) · [usewindowdimensions.md](../docs-offline/react-native-website/docs/usewindowdimensions.md) ·
[safe-areas.mdx](../docs-offline/expo/docs/pages/develop/user-interface/safe-areas.mdx) · [icons.mdx](../docs-offline/expo/docs/pages/guides/icons.mdx) ·
[expo-haptics.md](../docs-offline/expo-api-v58/expo-haptics.md) · [expo-image.md](../docs-offline/expo-api-v58/expo-image.md)

---

## ❓ Repaso

**Pregunta:** agregaste "¿Seguro que querés volver al inicio?" con `Alert.alert` y en el celular
anda, pero el corrector dice que en web el botón "no hace nada". ¿Por qué y cómo lo arreglás?

**Respuesta:** en `react-native-web`, `Alert.alert` es una función **vacía**: no muestra nada ni
llama a ningún `onPress`. Arreglo: si `Platform.OS === 'web'`, usar `window.confirm(...)` (16.2);
o, mejor, no depender de un diálogo: mostrar en la pantalla dos botones "Sí, salir" / "Cancelar"
controlados por un `useState` (o un `<Modal>`, que sí funciona en web).
