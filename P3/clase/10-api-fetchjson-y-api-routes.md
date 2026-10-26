# Tema 10 — La API: API routes de Expo, `fetchJSON` y `expoDevServerUri`

> En P2 la API vivía adentro de Vite (`mock-routes.js`). En P3 vive adentro del **mismo servidor
> de Expo** (Metro, puerto **8081**): un solo `npm start` levanta app + API.

## 10.1 Dónde vive la API: `app/api/*+api.js`

Expo Router trata **todo** archivo de `app/` como ruta. Si el nombre termina en **`+api.js`**,
no es una pantalla: es un **endpoint** que corre en el servidor (Node), no en el celular.

```
mobile/app/
  index.jsx                  → pantalla  /
  games/[id].jsx             → pantalla  /games/6
  api/ranking+api.js         → endpoint  GET  /api/ranking
  api/games+api.js           → endpoint  POST /api/games
  api/games/[id]+api.js      → endpoint  GET/DELETE /api/games/6
  api/games/[id]/guess+api.js→ endpoint  POST /api/games/6/guess
  static/[...path]+api.js    → sirve las banderas  /static/flags/URY.png
```

Cada archivo **exporta una función por método HTTP** (`GET`, `POST`, `DELETE`…), que recibe el
`Request` y los parámetros de la ruta, y devuelve un `Response`:

```js
// app/api/games/[id]+api.js (simulacro)
export const GET = apiHandler((_request, { id }) => {            // { id } = el [id] del archivo
  return Response.json(performDataOp((data) => gameView(data, findGame(data, id))));
});
```

| Quiero… | En una API route |
|---|---|
| Responder JSON | `Response.json(objeto)` · con status: `Response.json({ error }, { status: 404 })` |
| Leer el body | `await request.json()` |
| Leer `?n=4` | `new URL(request.url).searchParams.get('n')` |
| Parámetro `[id]` | segundo argumento: `(request, { id })` — **string** |
| Cortar con error | `throw new StatusError(404, 'msg')` (de `expo-server`, plantillas 2025/2026sem1) |

⚠️ Requiere `"web": { "output": "server" }` en `app.json` (la plantilla ya lo trae).
⚠️ **No pongas archivos que no sean pantallas en `app/`** (un `api.js` suelto, un `Context.js`):
Expo Router se queja de que no tienen `export default`. Van en `common/`, `hooks/`, `context/`.

## 10.2 La "base de datos": `data/mock-db.js` + `data/db/data.json`

```js
performDataOp((data) => createGame(data, body), { write: true });
// 1) lee data.json ENTERO   2) llama a tu función   3) si write: true, lo vuelve a escribir
```
- `apiHandler(fn)` envuelve el handler: si adentro se tira un `ApiError(msg, { status })`, lo
  convierte en `Response.json({ error: msg }, { status })`.
- La lógica de verdad está en `data/games.js` (`createGame`, `guess`, `ranking`…). **No hace falta
  tocarla**, pero leerla te dice **cuándo** responde 400/404/409 y **qué forma** tiene la respuesta.
- ⚠️ Escribe en `data.json` **de verdad**. Para volver al seed: `git checkout mobile/data/db/data.json`.

## 10.3 `fetchJSON` (dado en `common/fetch.js`)

```js
export async function fetchJSON(resource, options = undefined) {
  options = {
    method: 'GET',                                   // GET por defecto
    ...options,
    headers: { 'Content-Type': 'application/json', ...options?.headers },
    body: options?.body !== undefined ? JSON.stringify(options.body) : undefined,  // ← stringify ACÁ
  };
  const response = await fetch(expoDevServerUri(resource), options);    // ← URL completa (10.4)
  if (!response.ok) {
    const error = new Error(`${options.method} ${resource} failed with ${response.status} ${response.statusText}!`);
    error.status = response.status;                  // ← número: 400, 404, 409…
    throw error;
  }
  return await response.json();
}
```

```js
const ranking = await fetchJSON('/api/ranking');                                       // GET
const game    = await fetchJSON('/api/games', { method: 'POST', body: { player } });  // body = OBJETO
const result  = await fetchJSON(`/api/games/${id}/guess`, { method: 'POST', body: { guess } });
await fetchJSON(`/api/games/${id}`, { method: 'DELETE' });
```

Tres reglas:
1. **`body` como OBJETO.** Si hacés `body: JSON.stringify({ guess })` queda **doble string** → la
   API recibe `"{\"guess\":\"higher\"}"` (un string, no un objeto) → **400** *Guess must be one of:
   higher, lower* (probado con curl).
2. **No-2xx tira error** → con `try/catch` alcanza.
3. El status viene en **`error.status`** (número). Mejor que buscar `' 404 '` en el mensaje (P2).

⚠️ El `error.message` **no** trae el texto de la API (`"Game 9999 not found"`), trae
`"GET /api/games/9999 failed with 404 Not Found!"`. Para el usuario armá vos el mensaje.

## 10.4 `expoDevServerUri`: por qué en el celular no alcanza `/api/...`

En la **web**, la app se sirve desde `http://localhost:8081` → `/api/ranking` se resuelve solo.
En el **celular** (Expo Go) la app es un bundle de JS en el teléfono: una ruta relativa no tiene
"servidor" contra el cual resolverse. Hay que decirle **la IP de la compu**:

```js
// common/utils.js (dado)
export function expoDevServerUri(path) {
  let expoBaseUri = Constants.expoConfig?.hostUri ?? window.location.href;  // "192.168.1.50:8081" en el celu
  if (!/^https?:\/\//.test(expoBaseUri)) expoBaseUri = `http://${expoBaseUri}`;
  return new URL(path, expoBaseUri).toString();      // → "http://192.168.1.50:8081/api/ranking"
}
```
- `fetchJSON` **ya la usa** → para pedidos no tenés que hacer nada.
- **Imágenes: sí** tenés que usarla, porque `<Image>` no pasa por `fetchJSON`:
```jsx
<Image source={{ uri: expoDevServerUri(country.flagUrl) }} style={{ width: 80, height: 54 }} />
```
⚠️ `source={{ uri: country.flagUrl }}` (relativa) → en web se ve, **en el celular no**. Y sin
`width`/`height` una imagen remota mide 0×0 (tema 3.3).

## 10.5 Códigos de error del simulacro y cómo distinguirlos

| Pedido | Status | Cuándo (`data/games.js`) | En la pantalla |
|---|---|---|---|
| `POST /api/games` | **400** | `player` falta o es solo espacios | evitarlo: botón deshabilitado si `trim() === ''` |
| `GET /api/games/:id` | **404** | no existe (`/games/9999`) | "La partida no existe" + volver, **sin** Reintentar |
| `POST …/guess` | **400** | `guess` no es `higher`/`lower` | bug tuyo (¿doble stringify?) |
| `POST …/guess` | **409** | la partida ya terminó | no mostrar Más/Menos si `status !== 'playing'` |
| cualquiera | sin status | servidor apagado / IP mala → `TypeError` (*Network request failed* en el celu, *Failed to fetch* en web) | "No se pudo…" + **Reintentar** |

```jsx
if (error?.status === 404) …            // no existe → no tiene sentido reintentar
else if (error) …                       // se cayó / red → Reintentar
```

## 10.6 Probar la API sin la app

- **Navegador** (solo GET): `http://localhost:8081/api/ranking`, `/api/games/1`, `/api/games/9999`.
- **curl** (todo):
```bash
curl -i http://localhost:8081/api/games/9999                       # 404 {"error":"Game 9999 not found"}
curl -X POST http://localhost:8081/api/games -H "Content-Type: application/json" -d '{"player":"Ana"}'
curl -X POST http://localhost:8081/api/games/1/guess -H "Content-Type: application/json" -d '{"guess":"higher"}'
# → {"error":"Game 1 is already over"}  (409: la 1 es del seed, ya terminada)
```
- **Bruno**: abrir la carpeta `bruno/` (entorno `Local`, `baseUrl = http://localhost:8081`). Trae
  cada endpoint **y sus casos de error** (`Get game - not found`, `Guess - game over`…).

## 10.7 Formatos anteriores — ⚠️ NO es el formato 2026sem2

| Prueba | Backend | URL en el código | Body |
|---|---|---|---|
| **2026sem2** (simulacro) | API routes + `mock-db.js` | `fetchJSON('/api/…')` (usa `expoDevServerUri`) | **objeto** |
| 2026sem1 prueba 3 (figuritas) | API routes con `StatusError` | `fetchJSON(url)` **propio**, `fetch` a pelo adentro | **string**: `JSON.stringify` + header a mano |
| 2025sem2 (trivias) | API routes, datos en `app/api/data.json` | `fetch(expoDevServerUri('/api/…'))` a pelo, chequeando `res.ok` | — (solo GET) |
| 2025sem1 (tareas, comidas) | **json-server en otro puerto** (3000) | `EXPO_PUBLIC_API_URL` en `mobile/.env` | objeto → `JSON.stringify` en `fetchAPI` |

- **json-server (2025sem1)**: dos terminales (`api/` y `mobile/`). En el celular `localhost` es **el
  celular**, así que en `.env` había que poner la **IP de la compu** (`http://192.168.1.50:3000`) y
  reiniciar Expo (las `EXPO_PUBLIC_*` se pegan al compilar). Ids **string** (`"19"`) → comparar con `String()`.
- **2026sem1**: su `fetchJSON` **no** hace stringify → ahí sí `body: JSON.stringify(...)`. Mirá
  siempre `common/fetch.js` **antes** de mandar un body.

📂 **Verlo funcionando:** `parciales/simulacro-prueba3-2026sem2-matutino/mobile/common/fetch.js` ·
`.../mobile/common/utils.js` · `.../mobile/app/api/games/[id]/guess+api.js` · `.../mobile/data/mock-db.js` ·
`.../mobile/data/games.js` (cuándo 400/404/409) · `.../mobile/components/CountryCard.jsx` (imagen con `expoDevServerUri`) ·
`parciales/2026sem1-prueba3-vespertino/app/teams/[code].jsx` (PATCH con body string) ·
`parciales/2025sem1-parcial-rn/mobile/lib/api.js` (json-server + `EXPO_PUBLIC_API_URL`)
· Docs: [api-routes.mdx](../docs-offline/expo/docs/pages/router/web/api-routes.mdx) ·
[expo-constants.md](../docs-offline/expo-api-v58/expo-constants.md) (`hostUri`)

---

## ❓ Repaso

**Pregunta:** ¿qué está mal? (anda en web, falla en el celular y además da 400)
```jsx
const r = await fetchJSON(`/api/games/${id}/guess`, {
  method: 'POST',
  body: JSON.stringify({ guess: 'higher' }),
});
<Image source={{ uri: r.revealed.flagUrl }} style={{ width: 80, height: 54 }} />
```

**Respuesta:**
1. **Doble stringify**: `fetchJSON` ya hace `JSON.stringify(body)` → la API recibe un string → **400**.
   Va `body: { guess: 'higher' }`.
2. **Imagen con ruta relativa**: en el celular no hay servidor implícito →
   `source={{ uri: expoDevServerUri(r.revealed.flagUrl) }}`. (El `fetchJSON` sí anda en el celular
   porque adentro usa `expoDevServerUri`.)
3. *(Extra)* Falta `try/catch`: un 409 (partida terminada) dejaría la promesa rechazada sin manejar.
