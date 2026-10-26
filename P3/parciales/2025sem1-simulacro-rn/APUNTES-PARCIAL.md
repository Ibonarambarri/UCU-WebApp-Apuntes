# Apuntes — Simulacro Parcial 2 2025 Sem1 (React Native: Backoffice Food App)

Resolución comentada del simulacro de React Native de 2025sem1 (en ese semestre fue el
"parcial 2"; acá es práctica para el **Parcial 3**). El enunciado está en `README.md`
(no se modificó).

> **Formato VIEJO (2025sem1).** Backend = **json-server** aparte (`api/`) y la app hace
> `fetch` a `EXPO_PUBLIC_API_URL` (`mobile/.env`, que **no venía**: lo creamos). En el
> formato **2026sem2** la API vive dentro del propio proyecto Expo como rutas
> `app/api/...+api.js` (Expo Router hace de servidor), se consume con
> `fetchJSON(ruta, opciones)` de `common/fetch.js` y la URL base la calcula
> `expoDevServerUri()` a partir del dev server de Expo: **no hay json-server, ni `.env`, ni
> segunda terminal**. Lo que se repite: Expo Router, `Stack`, `[id]`,
> `useLocalSearchParams`, `FlatList`, `Pressable`, `StyleSheet`, estados de carga/error.

---

## 1. Resumen del enunciado

Backoffice de la Food App, dos pantallas:

| Pantalla | Ruta | Qué muestra |
|----------|------|-------------|
| Resumen | `/` → `app/index.jsx` | Título **Comidas**. Un **botón por comida** con ícono, nombre, precio y **stock = suma de `count` de sus órdenes**. Al tocarlo va al detalle |
| Detalle | `/foods/:id` → `app/foods/[id].jsx` | Título = **ícono + nombre**. Debajo el precio y la lista de órdenes (fecha y cantidad) |

Endpoints: `GET /foods`, `GET /foods/:id`, `GET /orders?food=:id` (devuelve un **array**,
aunque el README muestre un solo objeto).

---

## 2. Cómo correrlo

```bash
cd api && npm install && npm start          # json-server en http://localhost:3000
cd mobile && npm install && npx expo start  # (el script "start" usa --tunnel, necesita ngrok)
#   w → web · a → emulador Android · QR → Expo Go
```

No hay workspace en la raíz: se instala **en `api/` y en `mobile/` por separado**.

Verificado acá con `npx json-server ./data.json --port 3006` + `npx expo start --web --port 8097`
y un `mobile/.env.local` temporal con `EXPO_PUBLIC_API_URL=http://localhost:3006`
(`.env.local` le gana a `.env`; pasar la variable por la línea de comandos no alcanzó).

### URL de la API según dónde corre la app

| Dónde | `EXPO_PUBLIC_API_URL` |
|-------|-----------------------|
| Web o simulador iOS | `http://localhost:3000` |
| Emulador Android | `http://10.0.2.2:3000` |
| Celular con Expo Go | `http://<IP de la compu>:3000` (misma wifi; `ipconfig getifaddr en0`) |

`localhost` en el celular es **el celular**, no tu compu. Y como `EXPO_PUBLIC_*` se pega al
compilar, después de cambiarla reiniciá `expo start --clear`.

### Versiones / Node 26
Expo 53 + RN 0.79.3 + React 19.0.0. Instala y corre en web con **Node v26.5.1 sin cambios**.

---

## 3. Archivos creados / tocados (`mobile/`)

| Archivo | Estado | Qué hace |
|---------|--------|----------|
| `.env` | **creado** | `EXPO_PUBLIC_API_URL=http://localhost:3000` (comentado cómo poner la IP) |
| `lib/api.js` | **creado** | `getAPIURL` (como en la plantilla de la prueba), `fetchAPI(path)` con `response.ok`, hook genérico `useFetch(path)` → `{ data, error, isLoading, reload }`, y `useFetchFoods`, `useFetchFood(id)`, `useFetchOrders(foodId?)` |
| `lib/format.js` | **creado** | `formatPrice` (`$ 200`) y `formatDate` (ISO → `29/05/2025, 07:00` con `toLocaleString('es-UY')`) |
| `components/StatusMessage.jsx` | **creado** | "Cargando..." / error + "Reintentar" |
| `app/_layout.jsx` | modificado | `Stack` con `index` (título "Comidas") y `foods/[id]` |
| `app/index.jsx` | reescrito | Dos fetch (`/foods` y `/orders`), `getStock` con `for`, `FlatList` de `Pressable` |
| `app/foods/[id].jsx` | **creado** | `useLocalSearchParams`, fetch de la comida y de `/orders?food=id`, título dinámico con `<Stack.Screen>` |

### Lo central

Stock (dato derivado, se calcula en el render):
```js
function getStock(food, orders) {
  let stock = 0;
  for (const order of orders) {
    if (String(order.food) === String(food.id)) stock += order.count;   // ver trampa 2
  }
  return stock;
}
```

Botón con feedback al tocar (`style` puede ser una **función** que recibe `pressed`):
```jsx
<Pressable style={({ pressed }) => [styles.card, pressed && styles.pressed]}
           onPress={() => router.push(`/foods/${item.id}`)}>
```

Título que depende de los datos:
```jsx
<Stack.Screen options={{ title: `${food.data.icon} ${food.data.name}` }} />
```
Mientras carga se muestra `title: 'Detalle'` (todavía no sabés el nombre).

---

## 4. Trampas de ESTE simulacro

### Trampa 1: no hay `.env` ni cliente de API
A diferencia de la prueba, la plantilla del simulacro no trae `api.js` ni `.env`. Hay que
crearlos. Y van **fuera de `app/`** (si no, Expo Router los toma como pantallas).

### Trampa 2: `"19"` vs `19`
json-server 1.x devuelve `food.id` como **string** (`"19"`), pero `order.food` es **número**
(`19`). `order.food === food.id` da `false` para todo y el stock queda en 0. Comparar
`String(a) === String(b)`.

### Trampa 3: el stock necesita TODAS las órdenes
En la pantalla de resumen hay que pedir `GET /orders` (todas) además de `/foods` y sumar en
el cliente. Hacer un `GET /orders?food=id` por cada comida (30 requests) funciona pero es
peor. Banana no tiene órdenes → stock **0** (no `undefined`).

### Trampa 4: `GET /orders?food=:id` devuelve un array
El README lo documenta como objeto, pero es un filtro: viene `[]` o `[{…}, {…}]`. Usar
`FlatList` con `ListEmptyComponent`.

### Trampa 5: dos fetch → dos loading y dos errores
Mostrar la lista recién cuando **los dos** terminaron: `if (foods.isLoading || orders.isLoading || foods.error || orders.error)`.
Si renderizás con `orders.data === null`, `getStock` explota con "orders is not iterable".

### Trampa 6: fechas ISO en UTC
`"2025-05-29T10:00:00.000Z"` es UTC; `toLocaleString` la pasa a hora local (Uruguay −3 →
07:00). Si mostrás el string crudo queda feo; si lo cortás con `slice(0, 10)` perdés la hora.

---

## 5. Conceptos clave

- Expo Router: `app/index.jsx` = `/`, `app/foods/[id].jsx` = `/foods/:id`,
  `useLocalSearchParams()` (string), `useRouter().push(...)`, `<Stack.Screen options>`
  para el título.
- `FlatList` (`data`, `keyExtractor` con `String(id)`, `renderItem={({ item }) => …}`) en vez
  de `.map` para listas largas: renderiza solo lo visible y scrollea solo.
- `Pressable` como botón; `style` en array o función `({ pressed }) => …`.
- `StyleSheet.create`, flexbox con `flexDirection: 'row'` y `flex: 1` en el texto del
  medio para empujar el stock a la derecha.
- Hook genérico de fetch con `useCallback` + `useEffect` y estados `data/error/isLoading`.

---

## 6. Variantes probables

1. **Ordenar / filtrar el resumen**: botones "Precio ↑", "Stock ↓" o un `TextInput` de
   búsqueda. Estado `sortBy` / `query` con `useState` y la lista ordenada calculada en el
   render con `[...foods.data].sort(...)` (copiar antes de `sort`, que muta).
2. **Total del detalle**: mostrar "Total vendido: N u. — $ M" con
   `orders.data.reduce((acc, o) => acc + o.count, 0) * food.data.price`, y ordenar las
   órdenes por fecha (`new Date(b.date) - new Date(a.date)`).
3. **Crear una orden** desde el detalle: `TextInput` con `keyboardType="numeric"` para la
   cantidad, validar `Number(count) > 0`, `POST /orders` con
   `{ food: Number(id), date: new Date().toISOString(), count: Number(count) }`, y después
   `orders.reload()`. Para que el stock del resumen se actualice al volver:
   `useFocusEffect(useCallback(() => { orders.reload(); }, [...]))` en `app/index.jsx`.
