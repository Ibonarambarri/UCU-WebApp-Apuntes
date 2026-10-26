# Documentación oficial SIN INTERNET — índice (Parcial 3: React Native + Expo)

Copias locales de la documentación oficial (en inglés, en Markdown / MDX):

| Carpeta | Qué es | Tamaño |
|---|---|---|
| `react-native-website/docs/` | React Native (reactnative.dev): componentes, APIs, estilos, flexbox | ~220 págs |
| `expo/docs/pages/router/` | **Expo Router** (guías: layouts, Stack, Tabs, rutas dinámicas, params, API routes) | ~55 págs |
| `expo/docs/pages/versions/v58.0.0/sdk/` | Páginas del SDK **58** (la versión del parcial): `image`, `constants`, `router`, `async-storage`… | ~130 págs |
| `expo/docs/pages/{get-started,develop,guides,tutorial}/` | Guías generales de Expo y el tutorial oficial | |
| `expo-api-v58/` | **API reference** del SDK 58 (props, hooks, métodos), pasada a Markdown | ~230 págs |
| `async-storage/packages/website/docs/` | `@react-native-async-storage/async-storage` **v2.2.0** (la del `package.json`) | 13 págs |

> ⚠️ En la web de Expo, la tabla de props/métodos de cada librería se arma con un componente
> `<APISection>` que en el `.mdx` no se ve. Por eso existe `expo-api-v58/`: ahí está esa misma
> referencia (por ejemplo **todos los métodos de `router`** o **todas las props de `<Image>`**) en texto.

> ⚠️ La documentación de AsyncStorage en internet hoy es la **v3** (API distinta, `createAsyncStorage`).
> El parcial usa la **v2.2.0** (`AsyncStorage.getItem/setItem`): esta copia local es la correcta.

> ℹ️ La copia de React Native es la versión "next" (lo último, ≈ 0.88, la del parcial). En los `.md`
> vas a ver bloques `:::note` / `:::warning` y pestañas `<Tabs>`: son de la web, ignoralos.
> En los `.mdx` de Expo pasa lo mismo con `<Terminal>`, `<BoxLink>`, `<FileTree>`, `<Step>`…

---

## Cómo buscar (lo más rápido)

**En VS Code:**
1. `Cmd+Shift+F` (buscar en todos los archivos).
2. Tocar `…` y en **"files to include"** poner la carpeta, por ejemplo:
   - `P3/docs-offline/react-native-website/docs` → solo React Native
   - `P3/docs-offline/expo/docs/pages/router` → solo Expo Router (guías)
   - `P3/docs-offline/expo-api-v58` → la referencia de la API (hooks, props, métodos)
3. Abrir el `.md` y verlo lindo con **`Cmd+Shift+V`** (vista previa de Markdown).
   Los `.mdx` también se pueden previsualizar: si VS Code no lo ofrece, abajo a la derecha
   cambiá el lenguaje del archivo a "Markdown".

**Por nombre de archivo:** `Cmd+P` y escribir, por ejemplo, `flatlist.md`, `url-parameters` o `expo-image.md`.

**Desde la terminal:**
```bash
cd P3/docs-offline
grep -ril "useLocalSearchParams" expo/docs/pages/router     # qué guías lo mencionan
grep -n "dismissTo" expo-api-v58/expo-router.md              # la firma exacta
grep -n "contentFit" expo-api-v58/expo-image.md              # una prop de expo-image
grep -rl "keyExtractor" react-native-website/docs            # dónde se explica algo de RN
```

---

## "Me trabé con…" → abrir esto

Las rutas son relativas a esta carpeta (`P3/docs-offline/`). Los links se pueden abrir con Cmd+clic.

### Componentes core de React Native — `react-native-website/docs/`

| Duda | Archivo |
|---|---|
| Panorama: qué componente reemplaza a qué etiqueta HTML | [intro-react-native-components.md](react-native-website/docs/intro-react-native-components.md) · [components-and-apis.md](react-native-website/docs/components-and-apis.md) ⭐ |
| `<View>` (el `<div>` de RN) | [view.md](react-native-website/docs/view.md) |
| `<Text>` (TODO texto va adentro de `<Text>`) | [text.md](react-native-website/docs/text.md) |
| `<Image>` de RN (`source={{ uri }}`, `require(...)`) | [image.md](react-native-website/docs/image.md) · guía: [images.md](react-native-website/docs/images.md) |
| `<TextInput>` (`value`, `onChangeText`, `placeholder`, `keyboardType`, `secureTextEntry`) | [textinput.md](react-native-website/docs/textinput.md) · guía: [handling-text-input.md](react-native-website/docs/handling-text-input.md) |
| `<Pressable>` (`onPress`, estilo según `pressed`) ⭐ | [pressable.md](react-native-website/docs/pressable.md) |
| `<TouchableOpacity>` | [touchableopacity.md](react-native-website/docs/touchableopacity.md) |
| `<Button>` (solo `title` + `onPress`, casi no se puede estilar) | [button.md](react-native-website/docs/button.md) |
| `<FlatList>` (`data`, `renderItem`, `keyExtractor`, `ListEmptyComponent`, `ItemSeparatorComponent`, `numColumns`, `onRefresh`/`refreshing`) ⭐ | [flatlist.md](react-native-website/docs/flatlist.md) · guía: [using-a-listview.md](react-native-website/docs/using-a-listview.md) |
| `<SectionList>` (lista con secciones) | [sectionlist.md](react-native-website/docs/sectionlist.md) |
| `<ScrollView>` (y cuándo NO usarlo en vez de FlatList) | [scrollview.md](react-native-website/docs/scrollview.md) · [using-a-scrollview.md](react-native-website/docs/using-a-scrollview.md) |
| `<ActivityIndicator>` (spinner de "cargando") | [activityindicator.md](react-native-website/docs/activityindicator.md) |
| `<Switch>` (`value`, `onValueChange`) | [switch.md](react-native-website/docs/switch.md) |
| `<Modal>` (`visible`, `animationType`, `transparent`, `onRequestClose`) | [modal.md](react-native-website/docs/modal.md) |
| `<SafeAreaView>` (⚠️ el de RN está deprecado → usar `react-native-safe-area-context`) | [safeareaview.md](react-native-website/docs/safeareaview.md) · [expo: safe-area-context](expo/docs/pages/versions/v58.0.0/sdk/safe-area-context.mdx) · [guía safe areas](expo/docs/pages/develop/user-interface/safe-areas.mdx) |
| `<KeyboardAvoidingView>` (que el teclado no tape el input) | [keyboardavoidingview.md](react-native-website/docs/keyboardavoidingview.md) |
| `<RefreshControl>` (pull to refresh) | [refreshcontrol.md](react-native-website/docs/refreshcontrol.md) |
| `<ImageBackground>` | [imagebackground.md](react-native-website/docs/imagebackground.md) |
| `Alert.alert('Título', 'msg', [botones])` | [alert.md](react-native-website/docs/alert.md) |
| `<StatusBar>` de RN | [statusbar.md](react-native-website/docs/statusbar.md) (en Expo se usa [expo-status-bar](expo/docs/pages/versions/v58.0.0/sdk/status-bar.mdx)) |

### Estilos, StyleSheet, flexbox y layout (diferencias con CSS web)

| Duda | Archivo |
|---|---|
| Cómo se estila en RN (`style={...}`, arrays de estilos `[a, b && c]`, camelCase) ⭐ | [style.md](react-native-website/docs/style.md) |
| `StyleSheet.create`, `StyleSheet.flatten`, `hairlineWidth`, `absoluteFill` | [stylesheet.md](react-native-website/docs/stylesheet.md) |
| **Flexbox en RN** — ¡`flexDirection` es `column` por defecto! `flex: 1`, `flexShrink` 0 por defecto ⭐ | [flexbox.md](react-native-website/docs/flexbox.md) (la intro lista las diferencias con la web) |
| Ancho y alto (números = puntos, porcentajes en string `'50%'`, `flex: 1`) | [height-and-width.md](react-native-website/docs/height-and-width.md) |
| Todas las props de layout (`margin`, `padding`, `gap`, `position`, `alignItems`…) | [layout-props.md](react-native-website/docs/layout-props.md) |
| Props de estilo de `View` (`backgroundColor`, `borderRadius`, `borderWidth`, `opacity`) | [view-style-props.md](react-native-website/docs/view-style-props.md) |
| Props de estilo de texto (`fontSize`, `fontWeight`, `color`, `textAlign`, `lineHeight`) | [text-style-props.md](react-native-website/docs/text-style-props.md) |
| Estilos de imagen (`resizeMode`, `tintColor`) | [image-style-props.md](react-native-website/docs/image-style-props.md) |
| Sombras (`boxShadow`, `shadowColor`, `elevation`) | [shadow-props.md](react-native-website/docs/shadow-props.md) · [boxshadowvalue.md](react-native-website/docs/boxshadowvalue.md) |
| Colores válidos | [colors.md](react-native-website/docs/colors.md) |
| `transform` | [transforms.md](react-native-website/docs/transforms.md) |
| Modo oscuro (`useColorScheme`) | [usecolorscheme.md](react-native-website/docs/usecolorscheme.md) · [appearance.md](react-native-website/docs/appearance.md) |

### Platform, Dimensions y otras APIs

| Duda | Archivo |
|---|---|
| `Platform.OS`, `Platform.select({ ios, android, web })` ⭐ | [platform.md](react-native-website/docs/platform.md) |
| Archivos `.ios.js` / `.android.js` / `.web.js` | [platform-specific-code.md](react-native-website/docs/platform-specific-code.md) |
| `Dimensions.get('window')` | [dimensions.md](react-native-website/docs/dimensions.md) |
| `useWindowDimensions()` (se actualiza al rotar — preferible) | [usewindowdimensions.md](react-native-website/docs/usewindowdimensions.md) |
| `fetch` en RN | [network.md](react-native-website/docs/network.md) · [global-fetch.md](react-native-website/docs/global-fetch.md) |
| `Keyboard.dismiss()` | [keyboard.md](react-native-website/docs/keyboard.md) |
| `Linking.openURL` | [linking.md](react-native-website/docs/linking.md) |
| `Vibration` (en Expo, mejor [expo-haptics](expo/docs/pages/versions/v58.0.0/sdk/haptics.mdx)) | [vibration.md](react-native-website/docs/vibration.md) |
| Debug (`console.log`, React Native DevTools) | [debugging.md](react-native-website/docs/debugging.md) |

### Manejo de eventos y toques

| Duda | Archivo |
|---|---|
| Toques: Pressable vs Touchable*, qué usar | [handling-touches.md](react-native-website/docs/handling-touches.md) ⭐ |
| El objeto evento de `onPress` (`nativeEvent`, `locationX`…) | [pressevent.md](react-native-website/docs/pressevent.md) |
| `onChangeText` (te da el string directo, no `e.target.value`) vs `onChange` | [textinput.md](react-native-website/docs/textinput.md) (buscar "onChangeText") |
| `onSubmitEditing`, `returnKeyType` | [textinput.md](react-native-website/docs/textinput.md) |
| `onLayout` | [layoutevent.md](react-native-website/docs/layoutevent.md) |
| Gestos a bajo nivel (raro en el parcial) | [gesture-responder-system.md](react-native-website/docs/gesture-responder-system.md) |

### Expo Router — guías en `expo/docs/pages/router/`

| Duda | Archivo |
|---|---|
| Conceptos: cada archivo de `app/` es una ruta | [basics/core-concepts.mdx](expo/docs/pages/router/basics/core-concepts.mdx) |
| **Notación de archivos**: `index`, `[id]`, `(grupo)`, `_layout`, `+not-found`, `+api` ⭐ | [basics/notation.mdx](expo/docs/pages/router/basics/notation.mdx) |
| **Layouts `_layout.js`** (Stack, Tabs, Slot; layouts anidados) ⭐ | [basics/navigation-layouts.mdx](expo/docs/pages/router/basics/navigation-layouts.mdx) |
| Patrones comunes (Stack adentro de Tabs, etc.) | [basics/common-navigation-patterns.mdx](expo/docs/pages/router/basics/common-navigation-patterns.mdx) |
| **Navegar**: `useRouter`, `router.push/replace/back`, `<Link>`, `<Link asChild>`, rutas dinámicas, pasar query params ⭐ | [basics/navigation.mdx](expo/docs/pages/router/basics/navigation.mdx) |
| **`useLocalSearchParams` vs `useGlobalSearchParams`**, `router.setParams` ⭐ | [reference/url-parameters.mdx](expo/docs/pages/router/reference/url-parameters.mdx) |
| **Stack**: `<Stack.Screen options={{ title, headerShown… }} />` estático y dinámico, `dismiss`, **`dismissTo`**, `dismissAll`, `canDismiss` ⭐ | [advanced/stack.mdx](expo/docs/pages/router/advanced/stack.mdx) |
| **Tabs**: `<Tabs>`, `tabBarIcon`, `href: null` para ocultar una tab | [advanced/tabs.mdx](expo/docs/pages/router/advanced/tabs.mdx) |
| Tabs nativas (`NativeTabs`) | [advanced/native-tabs.mdx](expo/docs/pages/router/advanced/native-tabs.mdx) |
| Modales (`presentation: 'modal'`) | [advanced/modals.mdx](expo/docs/pages/router/advanced/modals.mdx) |
| Navegadores anidados | [advanced/nesting-navigators.mdx](expo/docs/pages/router/advanced/nesting-navigators.mdx) |
| `<Redirect href="..." />` y redirecciones | [reference/redirects.mdx](expo/docs/pages/router/reference/redirects.mdx) |
| Rutas protegidas / login (`Stack.Protected`, `guard`) | [advanced/protected.mdx](expo/docs/pages/router/advanced/protected.mdx) · [advanced/authentication.mdx](expo/docs/pages/router/advanced/authentication.mdx) |
| **`useFocusEffect`** (recargar datos al volver a una pantalla), `useIsFocused` ⭐ | [reference/focus-handling.mdx](expo/docs/pages/router/reference/focus-handling.mdx) |
| **`+not-found`** (ruta no encontrada) y `ErrorBoundary` | [error-handling.mdx](expo/docs/pages/router/error-handling.mdx) |
| **API routes `+api.js`** (`export function GET(request)`, `Response.json(...)`, body, query params) | [web/api-routes.mdx](expo/docs/pages/router/web/api-routes.mdx) |
| `unstable_settings` / `initialRouteName` | [advanced/router-settings.mdx](expo/docs/pages/router/advanced/router-settings.mdx) |
| Instalación / estructura de un proyecto con Router | [installation.mdx](expo/docs/pages/router/installation.mdx) · [introduction.mdx](expo/docs/pages/router/introduction.mdx) |
| Rutas tipadas (`Href`) | [reference/typed-routes.mdx](expo/docs/pages/router/reference/typed-routes.mdx) |
| Cambios del SDK 57 → 58 en Router (por si algo de un parcial viejo no anda) | [migrate/sdk-57-to-58.mdx](expo/docs/pages/router/migrate/sdk-57-to-58.mdx) |
| Problemas comunes | [reference/troubleshooting.mdx](expo/docs/pages/router/reference/troubleshooting.mdx) |

### Expo Router — referencia exacta de la API (SDK 58)

| Duda | Archivo |
|---|---|
| Página del SDK de `expo-router` | [versions/v58.0.0/sdk/router/index.mdx](expo/docs/pages/versions/v58.0.0/sdk/router/index.mdx) |
| **Todo** `expo-router`: `router` (métodos `push`, `replace`, `back`, `canGoBack`, `dismissTo`, `navigate`, `setParams`…), `useRouter`, `useLocalSearchParams`, `useGlobalSearchParams`, `useFocusEffect`, `usePathname`, `useSegments`, `Redirect`, `Slot`, `Tabs`… ⭐ | [expo-api-v58/expo-router.md](expo-api-v58/expo-router.md) (buscar con Cmd+F, ej. `` `useFocusEffect` ``) |
| `<Link>` (`href`, `asChild`, `replace`, `push`, `dismissTo`) | [sdk/router/link.mdx](expo/docs/pages/versions/v58.0.0/sdk/router/link.mdx) · API: [expo-router-link.md](expo-api-v58/expo-router-link.md) |
| `<Stack>` y sus `options` (`title`, `headerShown`, `headerRight`, `presentation`…) | [sdk/router/stack.mdx](expo/docs/pages/versions/v58.0.0/sdk/router/stack.mdx) · API: [expo-router-stack.md](expo-api-v58/expo-router-stack.md) |

### expo-image, expo-constants, AsyncStorage y otras librerías del SDK

| Duda | Archivo |
|---|---|
| **`expo-image`**: `<Image source contentFit placeholder transition />` | guía: [sdk/image.mdx](expo/docs/pages/versions/v58.0.0/sdk/image.mdx) · todas las props: [expo-api-v58/expo-image.md](expo-api-v58/expo-image.md) ⭐ |
| **`expo-constants`**: `Constants.expoConfig.extra` (variables del `app.json`), `Constants.expoConfig.hostUri` (IP del Metro → URL del backend) | guía: [sdk/constants.mdx](expo/docs/pages/versions/v58.0.0/sdk/constants.mdx) · API: [expo-api-v58/expo-constants.md](expo-api-v58/expo-constants.md) ⭐ |
| `app.json` / `app.config.js` (campo `extra`, `scheme`, `plugins`) | [versions/v58.0.0/config/app.mdx](expo/docs/pages/versions/v58.0.0/config/app.mdx) |
| Variables de entorno `EXPO_PUBLIC_...` | [guides/environment-variables.mdx](expo/docs/pages/guides/environment-variables.mdx) |
| **AsyncStorage v2** (`getItem`, `setItem`, `removeItem`, `getAllKeys`, `multiGet`, `clear`) ⭐ | API: [API.md](async-storage/packages/website/docs/API.md) · uso (guardar objetos con `JSON.stringify`/`JSON.parse`): [Usage.md](async-storage/packages/website/docs/Usage.md) |
| AsyncStorage en Expo (instalación) | [sdk/async-storage.mdx](expo/docs/pages/versions/v58.0.0/sdk/async-storage.mdx) · guía "guardar datos": [develop/user-interface/store-data.mdx](expo/docs/pages/develop/user-interface/store-data.mdx) |
| AsyncStorage: límites y problemas | [Limits.md](async-storage/packages/website/docs/Limits.md) · [Troubleshooting.md](async-storage/packages/website/docs/help/Troubleshooting.md) |
| `expo-haptics` (vibración al tocar) | [sdk/haptics.mdx](expo/docs/pages/versions/v58.0.0/sdk/haptics.mdx) · API: [expo-haptics.md](expo-api-v58/expo-haptics.md) |
| `expo-status-bar` (`<StatusBar style="auto" />`) | [sdk/status-bar.mdx](expo/docs/pages/versions/v58.0.0/sdk/status-bar.mdx) · API: [expo-status-bar.md](expo-api-v58/expo-status-bar.md) |
| Íconos (`@expo/vector-icons`) | [guides/icons.mdx](expo/docs/pages/guides/icons.mdx) |
| Fuentes | [develop/user-interface/fonts.mdx](expo/docs/pages/develop/user-interface/fonts.mdx) |
| Teclado (manejo en formularios) | [guides/keyboard-handling.mdx](expo/docs/pages/guides/keyboard-handling.mdx) |

### Expo en general (arrancar, correr, tutorial)

| Duda | Archivo |
|---|---|
| Crear un proyecto / estructura de carpetas | [get-started/create-a-project.mdx](expo/docs/pages/get-started/create-a-project.mdx) |
| `npx expo start`, Expo Go, recargar, abrir en web | [get-started/start-developing.mdx](expo/docs/pages/get-started/start-developing.mdx) |
| Navegación en Expo (resumen) | [develop/app-navigation.mdx](expo/docs/pages/develop/app-navigation.mdx) |
| Herramientas de desarrollo | [develop/tools.mdx](expo/docs/pages/develop/tools.mdx) |
| Tutorial oficial (pantalla, imágenes, navegación con tabs, modal) | [tutorial/build-a-screen.mdx](expo/docs/pages/tutorial/build-a-screen.mdx) · [tutorial/add-navigation.mdx](expo/docs/pages/tutorial/add-navigation.mdx) · [tutorial/create-a-modal.mdx](expo/docs/pages/tutorial/create-a-modal.mdx) |

---

## "Busco X → abrí Y" (lo más rápido)

| Busco… | Abrí… |
|---|---|
| Lista con `renderItem` / `keyExtractor` | [flatlist.md](react-native-website/docs/flatlist.md) |
| Botón con estilo propio | [pressable.md](react-native-website/docs/pressable.md) |
| Input controlado | [textinput.md](react-native-website/docs/textinput.md) → `value` + `onChangeText` |
| "Cargando…" | [activityindicator.md](react-native-website/docs/activityindicator.md) |
| Algo no se centra / no ocupa toda la pantalla | [flexbox.md](react-native-website/docs/flexbox.md) → `flex: 1`, `justifyContent`, `alignItems` |
| Estilo condicional `[styles.a, cond && styles.b]` | [style.md](react-native-website/docs/style.md) |
| Distinto en iOS / Android / web | [platform.md](react-native-website/docs/platform.md) |
| Ancho de la pantalla | [usewindowdimensions.md](react-native-website/docs/usewindowdimensions.md) |
| Pantalla de detalle `app/items/[id].js` | [notation.mdx](expo/docs/pages/router/basics/notation.mdx) + [navigation.mdx](expo/docs/pages/router/basics/navigation.mdx) ("Dynamic routes") |
| Leer el `id` de la URL | [url-parameters.mdx](expo/docs/pages/router/reference/url-parameters.mdx) → `useLocalSearchParams()` |
| Ir a otra pantalla desde código | [navigation.mdx](expo/docs/pages/router/basics/navigation.mdx) → `router.push('/x')` |
| Volver atrás / volver a una pantalla concreta del stack | [stack.mdx](expo/docs/pages/router/advanced/stack.mdx) → `router.back()` / `router.dismissTo('/x')` |
| Reemplazar sin dejar historial (ej. después de login o de crear) | [navigation.mdx](expo/docs/pages/router/basics/navigation.mdx) → `router.replace` |
| Firma exacta de un método de `router` | [expo-api-v58/expo-router.md](expo-api-v58/expo-router.md) |
| Título del header de una pantalla | [stack.mdx](expo/docs/pages/router/advanced/stack.mdx) → `<Stack.Screen options={{ title }} />` |
| Ocultar el header | [stack.mdx](expo/docs/pages/router/advanced/stack.mdx) → `headerShown: false` |
| Barra de pestañas abajo | [tabs.mdx](expo/docs/pages/router/advanced/tabs.mdx) |
| Recargar la lista al volver de "crear" | [focus-handling.mdx](expo/docs/pages/router/reference/focus-handling.mdx) → `useFocusEffect(useCallback(...))` |
| Redirigir si no hay sesión | [redirects.mdx](expo/docs/pages/router/reference/redirects.mdx) · [protected.mdx](expo/docs/pages/router/advanced/protected.mdx) |
| Pantalla 404 | [error-handling.mdx](expo/docs/pages/router/error-handling.mdx) → `app/+not-found.js` |
| Endpoint propio `app/api/x+api.js` | [api-routes.mdx](expo/docs/pages/router/web/api-routes.mdx) |
| Imagen remota con `contentFit="cover"` | [expo-api-v58/expo-image.md](expo-api-v58/expo-image.md) |
| URL del backend según la IP de la compu | [expo-api-v58/expo-constants.md](expo-api-v58/expo-constants.md) → `expoConfig.hostUri` |
| Guardar favoritos / datos que sobrevivan al cerrar la app | [API.md](async-storage/packages/website/docs/API.md) (AsyncStorage v2) |
| Notch / la barra de estado tapa el contenido | [safe-areas.mdx](expo/docs/pages/develop/user-interface/safe-areas.mdx) |
| Confirmar antes de borrar | [alert.md](react-native-website/docs/alert.md) |
| Popup encima de la pantalla | [modal.md](react-native-website/docs/modal.md) o [modals.mdx](expo/docs/pages/router/advanced/modals.mdx) (como ruta) |

---

## Tu propio material va PRIMERO

Antes de ir a la documentación oficial, fijate en los parciales resueltos de [`P3/parciales/`](../parciales/)
(sobre todo el [simulacro 2026sem2 matutino](../parciales/simulacro-prueba3-2026sem2-matutino/README.md)):
ya tienen la estructura de carpetas, los hooks y los estilos que te van a pedir.

La documentación oficial sirve para **detalles puntuales** ("¿cómo era la prop de FlatList para la
lista vacía?", "¿`dismissTo` recibía un href?"). Si la usás para aprender algo desde cero
durante el examen, se te va el tiempo.
