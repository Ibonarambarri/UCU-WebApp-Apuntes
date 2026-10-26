# Estrategia de examen — Parcial 3 (React Native + Expo Router)

Todo lo "de examen" en un solo lugar: los primeros minutos, el plan de 2 h, el checklist
antes de entregar y **todas las trampas** (deduplicadas, agrupadas por tema).
La teoría está en [`clase/`](clase/00-INDICE-CLASE.md); los fragmentos para copiar, en
[`CHULETA-EXAMEN.md`](CHULETA-EXAMEN.md); el paso a paso con tiempos, en
[`PLAN-DE-RUTA-EXAMEN.md`](PLAN-DE-RUTA-EXAMEN.md).

**Formatos** (para saber qué aplica a cada cosa):

| Etiqueta | Formato | Parciales |
|---|---|---|
| **26s2** | Workspace (raíz + `mobile/`), Expo SDK 58 + Expo Router, **API en el mismo servidor de Expo** (`app/api/*+api.js`) que **escribe** en `data/db/data.json`, `fetchJSON` (lanza `Error` con `.status`), `expoDevServerUri`, `components/Button.jsx`, Bruno. Crear es **POST**. Lint con React Compiler. **El del examen.** | `simulacro-prueba3-2026sem2-matutino`, `practica-matutino` |
| **26s1** | Igual idea (Expo Router + `+api.js`), sin workspace. Figuritas del Mundial (PATCH) y trivia con `/game` y `/end`. ⚠️ La API real traía un bug (`/api/groups/H` → 500). | `2026sem1-*` |
| **2025s2** | Trivia de países sobre la misma plantilla (`hooks/api.js`, `useFetch`, `expo-image` con SVG). Lógica de juego **en el cliente** (azar, vidas, puntaje). Solo lectura. | `2025sem2-*` |
| **2025s1** | Expo 53 + **json-server** en otro puerto, URL de la API en `.env`. Formato viejo. | `2025sem1-*` |

---

## 1. Primeros 5 minutos (SIN internet)

```bash
git clone <url-de-mi-fork>  &&  cd <repo>
npm install --prefer-offline      # en la RAÍZ (workspace); usa la caché de npm
# si falla y el package.json es igual al del simulacro:
#   diff package.json ../simulacro-prueba3-2026sem2-matutino/package.json
#   cp -R ../simulacro-prueba3-2026sem2-matutino/node_modules .
npm start                          # Metro en :8081 → w = web (http://localhost:8081)
npm run lint                       # al final tiene que salir limpio
```

1. Leer el **README entero**. Marcar: pantallas/rutas exactas, qué mostrar, "casos a contemplar"
   (cada uno es un punto fácil), qué es opcional.
2. Abrir `mobile/app/api/` y `mobile/data/*.js` → endpoints, métodos (¿POST? ¿PATCH?), body
   esperado, errores (400/404/409). → [tema 10](clase/10-api-fetchjson-y-api-routes.md)
3. **Probar cada endpoint con curl** antes de programar (los mocks pueden tener bugs, como en 26s1):
   `curl -s localhost:8081/api/ranking`, `curl -s -X POST localhost:8081/api/games -H 'Content-Type: application/json' -d '{"player":"Yo"}'`.
4. Mirar el boceto (`specs/*.excalidraw` → arrastrarlo a excalidraw… **sin internet no abre**:
   leer los textos con el visor o abrir el `.svg` si hay). Dice qué va en cada pantalla.
5. `app/_layout.jsx` → qué pantallas ya existen. `grep -rn TODO mobile/app mobile/components` → qué falta.
6. **Comparar con el simulacro** (si es la misma plantilla): `diff -r ../simulacro…/mobile/app mobile/app`.

**Formatos viejos:** 2025s1 → dos terminales (`npm run server` en `api/` + `npm start` en `mobile/`),
revisar el `.env` (URL de la API; desde el celular va la **IP** de la compu, no `localhost`).

---

## 2. Plan de ataque de 2 h

**Reglas generales:**
- **Primero que funcione, después que se vea.** El boceto es guía; el diseño es libre.
- **Copiá sin culpa** del simulacro: `hooks/useFetchJSON.js`, `hooks/useCreateGame.js` (renombrar),
  `common/format.js`, `components/StatusMessage.jsx`, `components/CountryCard.jsx`.
- **Commit + push cada ~30 min.** Si algo se rompe, volvés.
- Si algo no sale en **15 min**, pasar al siguiente y volver después.
- **Faltando 15 min:** `npm run lint`, probar los casos a mano, commit, push, PR.

| Min | Qué | Tema |
|---|---|---|
| 0–10 | Lectura (§1) + curl de cada endpoint. | [1](clase/01-anatomia-proyecto-expo.md), [10](clase/10-api-fetchjson-y-api-routes.md) |
| 10–20 | Copiar infraestructura (hooks, format, StatusMessage). Pantallas registradas en `_layout.jsx` y navegación entre ellas funcionando (aunque vacías). | [7](clase/07-expo-router-archivos-y-layouts.md), [8](clase/08-navegar-y-parametros.md) |
| 20–45 | Pantalla de inicio: formulario (TextInput + botón deshabilitado) + POST + navegar; lista con FlatList + 4 estados. | [5](clase/05-listas-flatlist.md), [6](clase/06-formularios-textinput.md), [11](clase/11-hooks-de-datos.md) |
| 45–85 | Pantalla principal (juego/detalle): `useLocalSearchParams`, GET, 404, mostrar datos, acciones (POST) con botones deshabilitados, fases (jugando / resultado / terminado). | [9](clase/09-ciclo-de-vida-pantallas.md), [12](clase/12-logica-de-juego-y-estado.md) |
| 85–95 | Casos a contemplar uno por uno (formato de números, recargar, cambiar de partida sin recargar, errores). **Lint + commit + push.** | [13](clase/13-formatear-datos.md), [17](clase/17-lint-y-react-compiler.md) |
| 95–110 | Opcionales / lo nuevo del examen (recetario de variantes del simulacro). Estilos. | apuntes del simulacro §variantes |
| 110–120 | Checklist (§3) + PR. | — |

---

## 3. Checklist final antes de entregar

- [ ] `npm run lint` **sin ninguna línea** de warning/error, y también `cd mobile && npx eslint .`
      (`expo lint` solo revisa `app/`, `components/` y `src/`: un `;` faltante en `hooks/` o `common/` se le escapa).
- [ ] La terminal de Metro sin errores rojos; la consola del navegador sin errores (warnings de la librería, como `pointerEvents is deprecated`, no importan).
- [ ] Cada "caso a contemplar" del README probado a mano (anotar la URL/acción que lo prueba).
- [ ] URL inexistente (`/games/9999`) → mensaje claro, no pantalla en blanco.
- [ ] **Recargar** (F5 en web) en cada pantalla → sigue funcionando.
- [ ] Botones de acción deshabilitados mientras se espera la API (no se puede responder dos veces).
- [ ] Volver al inicio → la lista (ranking) está **actualizada**.
- [ ] Números con separador de miles y decimales con coma, si lo piden.
- [ ] No quedaron archivos de prueba ni `console.log` de más; el `data.json` de la API no importa (se regenera), pero no subas basura.
- [ ] `git add -A && git commit -m "Entrega" && git push` → **Pull Request en el fork** → abrirlo y ver que muestra los commits.

---

## 4. Trampas (todas, deduplicadas)

### 4.1 Arranque y entorno
- `npm install` va en la **raíz** (workspace). Si lo hacés solo en `mobile/` puede faltar algo.
- Creaste un archivo y Metro dice **`Unable to resolve "../components/X"`** aunque existe → reiniciar
  con `npx expo start -c` (desde `mobile/`). Pasó con el simulacro.
- Cualquier archivo dentro de `app/` es una **ruta**: hooks, utils y componentes van en `hooks/`,
  `common/`, `components/` (si no, aparecen pantallas fantasma o warnings de "missing default export").
- Puerto 8081 ocupado → otro Metro abierto: cerrarlo (`Ctrl+C`) o `npx expo start --port 8082`.
- La API **solo existe con `npm start`** (corre dentro del servidor de Expo).
- La API **escribe** en `mobile/data/db/data.json`: las partidas de prueba quedan guardadas.
  Para volver al seed: `git checkout mobile/data/db/data.json`.
- En el celular, `localhost` es el celular: imágenes y fetch con `expoDevServerUri` (en 26s2
  `fetchJSON` ya lo usa). En 2025s1 la URL de la API va con la **IP** de la compu en el `.env`.

### 4.2 Componentes (web → RN)
- **Todo texto dentro de `<Text>`**. Un string suelto en un `<View>` → *"Text strings must be rendered within a `<Text>` component"*.
- `{count && <Text>…</Text>}` con `count = 0` muestra un `0` suelto → error. Usar `count > 0 &&` o ternario.
- `onPress`, no `onClick`. `onChangeText` recibe el **string**, no el evento.
- `<Image>` sin `width`/`height` **no se ve**. Imagen de la API → `{ uri: expoDevServerUri(url) }`.
- `Alert.alert` **no funciona en web** → mostrar el mensaje en un `<Text>`.
- No hay `<form>` ni `preventDefault`: botón con `onPress` + `onSubmitEditing` en el `TextInput`.
- El `Button` de la plantilla recibe `title`, `onPress`, `disabled`, `style` (no `children`).

### 4.3 Estilos
- `flexDirection` por defecto **`column`**. Filas → `flexDirection: 'row'`.
- Sin cascada ni herencia: el color va en cada `<Text>`.
- Números sin unidades (`padding: 10`), propiedades camelCase (`backgroundColor`).
- Grilla: `flexDirection: 'row'` + `flexWrap: 'wrap'` + `width: '30%'`, o `FlatList numColumns`.
- `ScrollView`: el centrado/padding va en `contentContainerStyle`, no en `style`.

### 4.4 Listas
- `keyExtractor` tiene que devolver **string**: `(item) => String(item.id)`.
- `renderItem` recibe `{ item, index }` (desestructurar).
- `FlatList` dentro de `ScrollView` vertical → warning *VirtualizedLists should never be nested*. Usar uno solo.

### 4.5 Navegación (Expo Router)
- `useLocalSearchParams()` devuelve **strings**: `Number(id)`, y comparar ids con `String(a) === String(b)`.
- El título del header sale del nombre del archivo ("index") si no ponés `<Stack.Screen options={{ title }}>`.
- En `Stack` la pantalla anterior **no se desmonta**: al volver, su `useEffect` no corre → `useFocusEffect` para refrescar.
- Navegar a la **misma pantalla con otro parámetro** puede reusar el componente → datos/resultado viejos.
  Derivar por id (`data.id === id`) o `router.replace`.
- `router.back()` falla si se recargó la página en web (no hay historial) → `router.dismissTo('/')`
  o `router.canGoBack() ? router.back() : router.replace('/')`.
- `push` apila (atrás vuelve); `replace` reemplaza (para "Jugar de nuevo" o pantallas finales).
- Si el enunciado pide una ruta (`/game`) distinta de la que trae la plantilla (`/trivia`), **creá la del enunciado**.
- Sacar la flecha de atrás en web: `headerLeft: () => null` (`headerBackVisible: false` no alcanza).

### 4.6 Datos y API
- `fetchJSON(url, { method: 'POST', body: { … } })` → body como **objeto** (no `JSON.stringify`: doble
  stringify da un **400** real). ⚠️ Pero **leé el `fetchJSON` de la plantilla**: el de 26s1 NO convertía
  el body y ahí sí había que hacer `JSON.stringify` a mano.
- 404 → `err.status === 404` (mensaje "no existe", sin "Reintentar"); otros → "No se pudo…" + Reintentar.
- `isLoading` arranca en `true` si se pide al montar; para mostrar "cargando" preferí `!data` (no parpadea al refrescar).
- Cada pedido con su estado de carga **y** de error (lo piden explícitamente).
- La respuesta de un POST suele traer el objeto actualizado: usarla (`setData(resp.game)`) en vez de re-pedir.
- Datos de la ronda **respondida** vs de la **siguiente** (`result.stat` vs `game.stat`): leer bien qué trae cada respuesta.
- Ids que llegan como texto en un lado y número en otro (json-server) → comparar con `String()`.
- Mock con bug (26s1): no "arreglar" la API sin permiso; rodearlo en el cliente (pedir otro endpoint y filtrar) y documentarlo.

### 4.7 Estado y lógica de juego
- **No** guardar en estado lo que se puede calcular (puntaje mostrado, "está terminada", texto de la pregunta).
- Azar **fuera del render** (en el handler o en la función que pide datos), si no se re-mezcla en cada render.
- `setX` es asíncrono: si necesitás el valor nuevo para decidir (¿perdió?), calculalo en una variable primero.
- Temporizador: `setInterval` en un efecto **con limpieza** (`return () => clearInterval(t)`) y setter funcional.

### 4.8 Lint (`npm run lint` = `expo lint`, React Compiler activado)
- **`react-hooks/set-state-in-effect`**: `setX(…)` directo en el cuerpo de un `useEffect` es **error**.
  Arreglo: estado derivado, o el `setX` dentro de la función `async` del efecto.
- Hooks **antes** de cualquier `return` temprano (`rules-of-hooks`).
- `exhaustive-deps`: todo lo que usás adentro del efecto va en las dependencias.
- `semi`: punto y coma en todas las sentencias.
- Imports sin usar → borrarlos. Rutas con `@/` → que el archivo exista con esas mayúsculas.
- `expo lint` **no mira** `hooks/` ni `common/` → correr además `npx eslint .` desde `mobile/`.
- El lint **no** detecta un import con nombre mal escrito (`{ formatNumbr }`) ni mutar un array antes de `setX`: explotan al correr.
- `Math.random()` en el render → error `purity` del React Compiler: el azar va en un handler o efecto.
- `setIsLoading(true)` síncrono en el efecto antes de un `.then(...)` → error; dentro de la `async` está bien.
- Texto con `'` o `>` suelto en JSX → `react/no-unescaped-entities`: ponerlo entre llaves `{"Don't"}`.
- Tabla completa mensaje → arreglo: [tema 17](clase/17-lint-y-react-compiler.md).
