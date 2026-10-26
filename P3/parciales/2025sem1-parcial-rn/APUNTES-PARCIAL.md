# Apuntes — Parcial 2 2025 Sem1 (React Native: Task List app)

Resolución comentada de la prueba de React Native de 2025sem1 (en ese semestre fue el
"parcial 2"; acá la usamos como práctica para el **Parcial 3**). El enunciado original está
en `docs/PLANTEO.md` y el bosquejo en `docs/UI-example.png` (no se modificaron).

> **Formato VIEJO (2025sem1).** El backend es **json-server** en otra terminal (`api/`) y
> la app le pega con `fetch` a una URL que sale de `EXPO_PUBLIC_API_URL` (`mobile/.env`).
> En el formato **2026sem2** la API la sirve **el mismo Expo Router** con archivos
> `app/api/...+api.js`, se llama con el helper `fetchJSON(ruta, opciones)` de
> `common/fetch.js` y la URL base la arma `expoDevServerUri()` (la IP/puerto del dev
> server de Expo). O sea: allá **no hay json-server, ni `.env`, ni segundo proceso**, y
> el `body` se pasa como objeto (`fetchJSON` hace el `JSON.stringify` y tira error si
> `!response.ok`). Lo que SÍ se repite: Expo Router (`app/`, `[id]`, `Stack`,
> `useLocalSearchParams`, `useRouter`), componentes core de RN y `StyleSheet`.

---

## 1. Resumen del enunciado

App de lista de tareas. Cada tarea: `icon` (emoji), `name`, `description` y estado
`pending | blocked | completed`. Tres vistas:

| Vista | Ruta (Expo Router) | Qué muestra |
|-------|--------------------|-------------|
| `Home` | `/` → `app/index.jsx` | Header "Tasks List" + botón **+**; lista (ícono + nombre) con **color de fondo según estado**; pie con 3 filtros ⏳ ⚠️ ✅ que se **activan/desactivan** (toggle) |
| `TaskDetail` | `/tasks/:id` → `app/tasks/[id].jsx` | Header "Task Details" + **✕** para cerrar; formulario (nombre, ícono, descripción); pie con **los 2 estados que no son el actual** |
| `NewTask` | `/tasks/new` → `app/tasks/new.jsx` | Header "Task Details"; mismo formulario; pie **Create** / **Cancel**. Nace en `pending`, nombre obligatorio, ícono por defecto = el primero de `/icons` |

Endpoints (json-server): `GET /tasks`, `GET /tasks/:id`, `GET /icons`,
"`PUT /tasks/:id`" para crear (ver trampa 2) y `PATCH /tasks/:id` para cambiar el estado.

---

## 2. Cómo correrlo

```bash
# una sola vez (la raíz es un workspace npm con api/ y mobile/)
npm install

# terminal 1: backend
cd api && npm start                # json-server en http://localhost:3000

# terminal 2: app
cd mobile && npx expo start        # el script "start" usa --tunnel (necesita ngrok); sin él anda en la LAN
#   w → web   ·   a → emulador Android   ·   QR → Expo Go en el celular
```

En esta máquina se verificó con puertos alternativos:
`npx json-server ./data.json --port 3005` y `npx expo start --web --port 8096`, con un
`mobile/.env.local` con `EXPO_PUBLIC_API_URL=http://localhost:3005` (el `.env.local` le gana
al `.env` y está en `.gitignore`; **pasarla por la línea de comandos NO funcionó**, el
`.env` la pisaba). Al terminar se borró el `.env.local`.

### ¿Qué URL pongo en `EXPO_PUBLIC_API_URL`?

`localhost` es "este mismo aparato". Funciona solo si la app corre en la misma máquina que
json-server:

| Dónde corre la app | URL de la API |
|--------------------|---------------|
| Web (`w`) o simulador iOS | `http://localhost:3000` |
| Emulador Android | `http://10.0.2.2:3000` (el "localhost" de la compu visto desde el emulador) |
| Celular físico con Expo Go | `http://<IP de tu compu en la LAN>:3000`, ej. `http://192.168.1.50:3000` (`ipconfig getifaddr en0` en macOS). Celular y compu en la **misma wifi** |

`EXPO_PUBLIC_*` se **pega en el bundle al compilar**: si la cambiás, cortá y volvé a correr
`expo start` (mejor con `--clear`).

### Versiones / Node 26

La plantilla trae Expo 53 con `react-native@0.80.0` y `react@19.1.0` (Expo avisa que espera
0.79.6 / 19.0.0). **Igual instala y corre en web con Node v26.5.1 sin tocar nada**; no se
actualizó ninguna versión. Si en el celular Expo Go pide otra SDK, ahí sí habría que alinear
con `npx expo install --fix`.

---

## 3. Archivos tocados / creados (`mobile/`)

| Archivo | Estado | Qué hace |
|---------|--------|----------|
| `app/api.js` → `lib/api.js` | **movido** | Expo Router toma todo lo de `app/` como ruta (trampa 1). Conserva `getAPIURL` de la plantilla y agrega `fetchAPI(path, method, body)` (fetch + `response.ok` + JSON), un hook genérico `useFetch(path)` → `{ data, error, isLoading, reload }`, y `useFetchTasks`, `useFetchTask(id)`, `useFetchIcons`, `createTask`, `updateTask` |
| `lib/status.js` | **creado** | `STATUSES` = emoji, label y color de cada estado + `STATUS_KEYS`. Un solo lugar para no repetir `if` |
| `lib/navigation.js` | **creado** | `goBackOrHome(router)`: `router.back()` si hay historial, si no `router.replace('/')` (en la web podés entrar directo a `/tasks/3`) |
| `components/StatusMessage.jsx` | **creado** | "Loading..." con `ActivityIndicator` o error + botón Retry |
| `components/TaskForm.jsx` | **creado** | Formulario **controlado** compartido: `TextInput` nombre, grilla de `Pressable` con los emojis (no hay `<select>` en RN), `TextInput multiline` descripción |
| `app/_layout.jsx` | modificado | `Stack` con `index`, `tasks/[id]`, `tasks/new` |
| `app/index.jsx` | reescrito | Home: `FlatList`, color por estado, botón + en `headerRight`, filtros toggle, `useFocusEffect` para recargar al volver |
| `app/tasks/[id].jsx` | **creado** | TaskDetail: `useLocalSearchParams`, carga tarea + íconos, `useEffect` que llena el form cuando llega la tarea, ✕ en `headerRight` (+ `headerLeft: () => null`), PATCH del estado |
| `app/tasks/new.jsx` | **creado** | NewTask: ícono por defecto, validación, POST, vuelve a la Home |

### Lo importante de cada pantalla

**Home** — filtro como dato derivado (no un segundo estado con la lista filtrada):
```js
const [filter, setFilter] = useState(null);           // null = todas
function handleFilterPress(status) {
  if (filter === status) setFilter(null); else setFilter(status);   // toggle
}
const visibleTasks = filter ? tasks.filter((t) => t.status === filter) : tasks;
```
Color: `style={[styles.item, { backgroundColor: STATUSES[item.status]?.color ?? '#fff' }]}`
(en RN `style` acepta un **array**: se mezclan de izquierda a derecha).

Recargar al volver (en un Stack la Home **no se desmonta**, su `useEffect([])` no se repite):
```js
useFocusEffect(useCallback(() => { reload(); }, [reload]));
```

Botón en el header, desde la propia pantalla:
```jsx
<Stack.Screen options={{ title: 'Tasks List',
  headerRight: () => <Pressable onPress={() => router.push('/tasks/new')}><Text>+</Text></Pressable> }} />
```

**TaskDetail** — los dos botones que NO son el estado actual:
```js
STATUS_KEYS.filter((key) => key !== status).map((key) => <Pressable onPress={() => handleChangeStatus(key)}>…)
```
`handleChangeStatus` hace `updateTask(id, { ...values, status: newStatus })` y guarda el
`status` que devuelve el server (la pantalla cambia de color y de botones sin recargar).
Se mandan también los campos del form para no perder lo editado (PATCH solo pisa lo que
mandás). Lo mínimo que pide el PLANTEO es `{ status }`.

**NewTask** — ícono por defecto sin `useEffect`:
```js
const defaultIcon = icons && icons.length > 0 ? icons[0].icon : '';
const formValues = { ...values, icon: values.icon || defaultIcon };
```
Validación `formValues.name.trim() === ''` → mensaje y `return`. Si sale bien:
`createTask({ icon, name, description, status: 'pending' })` y `goBackOrHome(router)`.

---

## 4. Trampas de ESTE parcial

### Trampa 1: `app/api.js` adentro de `app/`
Expo Router convierte **cada archivo de `app/`** en una ruta y avisa
"Route ./api.js is missing the required default export". Helpers, hooks y componentes van
**fuera** de `app/` (`lib/`, `components/`).

### Trampa 2: "PUT para crear" no anda en json-server
El PLANTEO dice `PUT /tasks/:task_id` para crear. json-server 1.x devuelve **404** si el id
no existe (PUT reemplaza, no crea). Para crear: **`POST /tasks`** y el server genera el id.

### Trampa 3: `state` (PLANTEO) vs `status` (data.json)
El enunciado habla de `state`, pero `api/data.json` trae `status`. Si filtrás por `state`
no aparece nada. Se usó `status` (lo que devuelve la API). Si hacés `PATCH {state}`,
json-server lo agrega como campo nuevo y el color no cambia.

### Trampa 4: los ids son strings
json-server 1.x devuelve `"id": "1"` y los nuevos son tipo `"c25b"`. Y `useLocalSearchParams`
también da strings. Nunca `Number(id)`; para `keyExtractor` usar `String(item.id)`.
Ojo: los `/icons` no tienen id en `data.json`; json-server se los inventa **y reescribe
`data.json`** la primera vez que escribís algo (PATCH/POST). Hacé copia del db antes de probar.

### Trampa 5: la lista no se actualiza al volver
Crear o cambiar estado y volver con `router.back()` deja la Home vieja: no se desmontó.
Solución `useFocusEffect` (o pasar los datos por Context).

### Trampa 6: la flecha de "volver" en TaskDetail
El PLANTEO pide una **✕** para cerrar. `headerBackVisible: false` saca la flecha en el
celular, pero en la web sigue apareciendo: además `headerLeft: () => null`.

### Trampa 7: `tasks/new` vs `tasks/[id]`
Las dos viven en `app/tasks/`. Expo Router prioriza la ruta **fija** (`new`) sobre la
dinámica (`[id]`), así que `/tasks/new` no se interpreta como "tarea con id new".

### Trampa 8: `onChangeText`, no `onChange`
En RN el `TextInput` te da el string directo en `onChangeText={(text) => …}`. No hay
`event.target.value`, ni `<form>`, ni `onSubmit`: el "submit" es un `Pressable` con `onPress`.

---

## 5. Conceptos clave

- **Expo Router**: archivo = ruta; `[id].jsx` = parámetro (`useLocalSearchParams`);
  `_layout.jsx` con `<Stack>`; navegar con `useRouter()` (`push`, `back`, `replace`,
  `canGoBack`) o `<Link href>`; opciones del header con `<Stack.Screen options>` dentro de
  la pantalla.
- **Core components**: `View` (div), `Text` (todo texto va adentro de `<Text>`),
  `Pressable` (botón), `TextInput`, `FlatList` (`data`, `keyExtractor`, `renderItem`,
  `ListEmptyComponent`), `ScrollView`, `ActivityIndicator`.
- **StyleSheet**: flexbox con `flexDirection: 'column'` por defecto; `flex: 1` para ocupar
  el resto y empujar el pie abajo; estilos en array para condicionales.
- **Fetch**: `response.ok` + `try/catch/finally` + tres estados (`data`, `error`,
  `isLoading`). Hook genérico con `useCallback` + `useEffect([reload])`.
- **Formulario controlado** con un solo `handleChange(campo, valor)` y spread
  `{ ...previous, [field]: value }`.
- **Dato derivado**: lista filtrada e ícono por defecto se calculan en el render.

---

## 6. Variantes probables (y cómo resolverlas)

1. **Borrar tarea** (`DELETE /tasks/:id`) desde TaskDetail: agregar `deleteTask(id)` en
   `lib/api.js` con `fetchAPI(\`/tasks/${id}\`, 'DELETE')`, un botón 🗑️ en el header o el pie,
   confirmar con `Alert.alert` (en web `window.confirm`) y `goBackOrHome(router)`.
2. **Guardar la edición del formulario** (no solo el estado): botón "Save" en TaskDetail
   que haga `updateTask(id, { name, icon, description })` con la misma validación del nombre.
   Si lo piden con PUT, mandar el objeto **completo** (incluido `status`).
3. **Filtro en la URL / contador por estado**: en el pie mostrar `⏳ 3` contando con
   `tasks.filter((t) => t.status === key).length`; o guardar el filtro como query param
   (`router.setParams({ status })` + `useLocalSearchParams()`) para que sobreviva al
   recargar en la web.
