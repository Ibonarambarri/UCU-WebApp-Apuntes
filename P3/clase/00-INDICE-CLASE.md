# Clase: todos los conceptos del Parcial 3 (React Native + Expo Router), de fácil a difícil

Apuntes de la clase particular (un archivo por tema). Todo lo de React que ya sabés de P2
(`useState`, `useEffect`, props, hooks propios, Context) **sigue igual**: acá se explica solo lo
que cambia en React Native y lo que piden las pruebas 3. Cada tema termina con una pregunta de
repaso y su respuesta.

| # | Tema | Archivo | Estado |
|---|---|---|---|
| **Nivel 1 — De React web a React Native** | | | |
| 1 | Anatomía de un proyecto Expo: workspaces, `npm start`, alias `@/`, Metro | [01-anatomia-proyecto-expo.md](01-anatomia-proyecto-expo.md) | ✅ |
| 2 | Qué sigue igual y qué cambia respecto de React web | [02-react-que-sigue-igual.md](02-react-que-sigue-igual.md) | ✅ |
| 3 | Componentes core: `View`, `Text`, `Image`, botones, `ScrollView` | [03-componentes-core.md](03-componentes-core.md) | ✅ |
| 4 | Estilos: `StyleSheet` y flexbox (columna por defecto) | [04-estilos-stylesheet-flexbox.md](04-estilos-stylesheet-flexbox.md) | ✅ |
| 5 | Listas: `FlatList` (y cuándo alcanza con `map`) | [05-listas-flatlist.md](05-listas-flatlist.md) | ✅ |
| 6 | Formularios: `TextInput` controlado, validar, botón deshabilitado | [06-formularios-textinput.md](06-formularios-textinput.md) | ✅ |
| **Nivel 2 — Navegación** | | | |
| 7 | Expo Router: rutas por archivos, `_layout`, `Stack`, `+api` | [07-expo-router-archivos-y-layouts.md](07-expo-router-archivos-y-layouts.md) | ✅ |
| 8 | Navegar y leer parámetros: `Link`, `router`, `useLocalSearchParams` | [08-navegar-y-parametros.md](08-navegar-y-parametros.md) | ✅ |
| 9 | Ciclo de vida de las pantallas: qué se monta, `useFocusEffect` | [09-ciclo-de-vida-pantallas.md](09-ciclo-de-vida-pantallas.md) | ✅ |
| **Nivel 3 — Datos** | | | |
| 10 | La API: API routes, `fetchJSON`, `expoDevServerUri`, 400/404/409 | [10-api-fetchjson-y-api-routes.md](10-api-fetchjson-y-api-routes.md) | ✅ |
| 11 | Hooks de datos: `useFetchJSON`, hooks por endpoint, `useCreateX`, `setData` | [11-hooks-de-datos.md](11-hooks-de-datos.md) | ✅ |
| 12 | Lógica de juego: la pantalla como estados, derivadas, azar, vidas, timer | [12-logica-de-juego-y-estado.md](12-logica-de-juego-y-estado.md) | ✅ |
| 13 | Formatear datos: miles, decimales, unidades, fechas, `null`, banderas | [13-formatear-datos.md](13-formatear-datos.md) | ✅ |
| **Nivel 4 — Estado compartido y persistencia** | | | |
| 14 | Context en RN: el Provider en `app/_layout.jsx` | [14-context-en-rn.md](14-context-en-rn.md) | ✅ |
| 15 | AsyncStorage: guardar en el dispositivo | [15-asyncstorage.md](15-asyncstorage.md) | ✅ |
| **Nivel 5 — Terminaciones** | | | |
| 16 | Plataforma y extras: `Platform`, `Alert` (no anda en web), `Modal`, iconos, `expo-image` | [16-plataforma-y-extras.md](16-plataforma-y-extras.md) | ✅ |
| 17 | Lint y React Compiler: mensajes reales → arreglo | [17-lint-y-react-compiler.md](17-lint-y-react-compiler.md) | ✅ |
| 18 | Lectura guiada del simulacro 2026sem2 completo | [18-lectura-guiada-parcial.md](18-lectura-guiada-parcial.md) | ✅ |

**El ciclo en una línea** (igual que en P2, con nombres de RN):

```
onPress / onChangeText → setAlgo(nuevo) (o fetchJSON → setData) → React vuelve a ejecutar la pantalla → <View>/<Text> nuevos
```

Y el de navegación:
```
router.push('/games/7') → Expo Router busca app/games/[id].jsx → useLocalSearchParams() = { id: '7' } (string) → useFetchGame('7')
```

## Si tenés poco tiempo

1. [18](18-lectura-guiada-parcial.md) (el simulacro entero) → 2. [12](12-logica-de-juego-y-estado.md) (estados del juego) →
3. [10](10-api-fetchjson-y-api-routes.md) + [11](11-hooks-de-datos.md) (datos) → 4. [09](09-ciclo-de-vida-pantallas.md) (Stack no desmonta) →
5. [17.9](17-lint-y-react-compiler.md) (tabla del lint).

## Material de consulta relacionado

- [`../README.md`](../README.md) — punto de entrada: qué hay, cómo correr cada proyecto, tabla concepto → tema → código.
- [`../CHULETA-EXAMEN.md`](../CHULETA-EXAMEN.md) — fragmentos para copiar en el examen.
- [`../ESTRATEGIA-EXAMEN.md`](../ESTRATEGIA-EXAMEN.md) — plan de 2 h, checklist de entrega y todas las trampas.
- [`../PLAN-DE-RUTA-EXAMEN.md`](../PLAN-DE-RUTA-EXAMEN.md) — el orden de ataque basado en el simulacro.
- [`../docs-offline/INDICE.md`](../docs-offline/INDICE.md) — documentación oficial sin internet (RN, Expo Router, SDK 58, AsyncStorage v2).
- [`../../P2/clase/`](../../P2/clase/00-INDICE-CLASE.md) — la clase de P2: `useEffect` (10), hooks propios (12), Context (16), estado derivado (9).
