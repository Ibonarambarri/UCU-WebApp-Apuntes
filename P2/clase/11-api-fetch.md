# Tema 11 — Hablar con la API

## 11.1 Pedido y respuesta HTTP

```
PEDIDO                                   RESPUESTA
  método:  PUT                             status: 200 OK   (o 400, 404, 500…)
  URL:     /api/favorites                  cuerpo: {"code":"URY","date":"2026-…"}
  cuerpo:  {"code":"URY"}   (opcional)
```

| Método | Significa | Cuerpo | En tus parciales |
|---|---|---|---|
| `GET` | leer | no | `GET /api/countries` |
| `POST` | crear | sí | json-server (2026sem1: Trello, BarApp) |
| `PUT` | crear / reemplazar | sí | **plantilla 2026sem2: crear es PUT** (`/api/players`, `/api/favorites`) |
| `PATCH` | modificar parte | sí | json-server |
| `DELETE` | borrar | no | `DELETE /api/favorites/URY` |

⚠️ **No asumas que crear es POST.** Mirá `mock-routes.js` / README.
⚠️ **PUT reemplaza el objeto entero**: si mandás `{ status }` solo, se pierden los demás campos →
`{ ...tarea, status: 'Done' }`. PATCH cambia solo lo que mandás.

Status: **2xx** bien · **400** pedido mal armado · **404** no existe · **500** el servidor se rompió.

## 11.2 `fetch` a pelo (parciales 2025 / 2026sem1)

```js
const response = await fetch('/api/countries/XYZ');   // 1) esperar la RESPUESTA
if (!response.ok) throw new Error(`Error ${response.status}`);  // 2) ¿2xx?
const data = await response.json();                   // 3) esperar y convertir el CUERPO
```
- **Dos `await`**: respuesta y `.json()`.
- ⚠️ **`fetch` NO tira error en 404/500** (solo sin conexión). Hay que chequear `response.ok`.
- Cuando **sí** tira: error de red → `TypeError: Failed to fetch` (servidor apagado, **puerto
  equivocado**, CORS). Mirá la pestaña Network: rojo sin status = red/puerto; 404 = ruta mal.
- `204 No Content` (algunos DELETE): **no** hagas `.json()` → *"Unexpected end of JSON input"*.

Enviar datos a mano:
```js
await fetch('/api/favorites', {
  method: 'PUT',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ code: 'URY' }),
});
```

## 11.3 `fetchJSON` (dado en `web/src/utils/fetch.js`)

Hace todo lo anterior: URL completa, GET por defecto, header JSON, `JSON.stringify` del body,
**tira Error si no es 2xx** y devuelve el cuerpo ya convertido.
```js
const countries = await fetchJSON('/api/countries');                              // GET
const fav = await fetchJSON('/api/favorites', { method: 'PUT', body: { code } }); // body = OBJETO
await fetchJSON(`/api/favorites/${code}`, { method: 'DELETE' });
```
1. **`body` como objeto**, no string (si stringificás vos → doble string → **400**).
2. **404/400 SÍ tiran error** → alcanza con `try/catch`.
3. El mensaje trae el status: `"GET /api/countries/XYZ failed with 404 Not Found!"` →
   detectar con `error.message.includes(' 404 ')`.

## 11.4 `try / catch / finally`

```js
try {
  const data = await fetchJSON(url);  // si tira error…
  setData(data);                      // …esto NO corre
} catch (err) {
  setError(err);                      // …salta acá
} finally {
  setIsLoading(false);                // SIEMPRE
}
```
Sin `try/catch`: "Cargando…" eterno + *"Uncaught (in promise)"* en consola.

## 11.5 Después de modificar: que la pantalla se entere

**A) Volver a pedir** (más simple y seguro — tatetí):
```js
await createPlayer({ name });
refetch();
```
**B) Actualizar el estado con lo que respondió la API** (favoritos del matutino):
```js
const favorite = await fetchJSON('/api/favorites', { method: 'PUT', body: { code } });
setFavorites((list) => [...list, favorite]);
await fetchJSON(`/api/favorites/${code}`, { method: 'DELETE' });
setFavorites((list) => list.filter((f) => f.code !== code));
```
**Si dudás en el examen → A.**

**Dónde van los pedidos:** los componentes no hacen `fetch` sueltos. En la plantilla 2026sem2
cada endpoint tiene su hook en `hooks/` (`useFetchPlayers`, `useCreatePlayer`…; cómo se arman:
[tema 12](12-hooks-propios.md)); en formatos viejos, un archivo de servicio (11.8 a).
## 11.6 Leer `mock-routes.js`

```js
{
  route: /^PUT \/api\/favorites\/?$/,          // método + ruta
  handler: ({ db, body }) => {
    if (typeof body?.code !== 'string') {
      throw new ApiError(`Missing country code`, { status: 400 });  // cuándo 400
    }
    const { code } = findCountry(db, body.code);                    // 404 si no existe
    const existing = db.data.favorites.find((f) => f.code === code);
    if (existing) return existing;                                   // no duplica
    …
    return favorite;                                                 // qué devuelve
  },
},
```
De cada ruta: **método**, **URL** (`(?<code>…)` = parámetro), **qué espera en el body**,
**qué devuelve / cuándo falla**. Y probá los GET en el navegador: `localhost:5173/api/countries/URY`.
(PUT/DELETE: Bruno o `curl`; la plantilla trae `bruno/`.)

## 11.7 Detalles que suman

- **`encodeURIComponent`** para parámetros con espacios/símbolos (`UTC+01:00`: el `+` en URL es espacio).
- **Ids string** (`"1"`): lo de `<select>` y `useParams` **siempre es string**.
- La base **se modifica de verdad**: `git checkout web/data/db/data.json` para restaurar.

📂 **Verlo funcionando:** `parciales/simulacro-prueba2-2026sem2-matutino/web/src/utils/fetch.js` ·
`parciales/simulacro-prueba2-2026sem2-matutino/web/src/context/FavoritesProvider.jsx` (PUT/DELETE) ·
`parciales/simulacro-prueba2-2026sem2-vespertino/web/src/hooks/useCreatePlayer.js`

## 11.8 Formatos anteriores (json-server, 2025) — ⚠️ NO es el formato 2026sem2

Solo para leer los parciales viejos. En 2026sem2 usás `fetchJSON` y la API vive en Vite.

**a) Archivo de servicio con `fetch` a pelo** (`parciales/2026sem1-prueba2-vespertino/src/services/taskService.js`):
```js
const API_URL = 'http://localhost:3001/tasks';   // = puerto del script de json-server
const JSON_HEADERS = { 'Content-Type': 'application/json' };

export async function getTasks() {
  const r = await fetch(API_URL);
  if (!r.ok) throw new Error('Error al obtener');
  return r.json();
}
export async function createTask(t) {                 // POST: devuelve el objeto CON id
  const r = await fetch(API_URL, { method: 'POST', headers: JSON_HEADERS, body: JSON.stringify(t) });
  if (!r.ok) throw new Error('Error al crear');
  return r.json();
}
// updateTask(id, t): igual con `${API_URL}/${id}` y 'PUT' (objeto completo) o 'PATCH' (parcial)
// deleteTask(id):    fetch(`${API_URL}/${id}`, { method: 'DELETE' }) + chequear r.ok
```

**b) json-server 1.x** (2026sem1: Trello, BarApp)
- `"server": "json-server db.json --port 3001"` → **dos terminales**: `npm run server` + `npm run dev`.
- Cada clave de primer nivel de `db.json` es un recurso: `{"tasks": […]}` → `/tasks`, `/tasks/1`, `/tasks?status=Done`.
- POST → objeto con **id string** generado (`"a1b2"`); `useParams` también da string → comparar sin `Number()`.
- Escribe en `db.json` de verdad (hacé una copia antes de probar).
- ⚠️ El puerto del service tiene que ser **el del script**, no el del README (Trello: 3000 vs 3001).
- ⚠️ BarApp: `BE/` solo traía `db.json` → hubo que crear `parciales/2026sem1-simulacro-vespertino/BE/package.json`.
```bash
curl -s http://localhost:3001/tasks
curl -s -X PATCH http://localhost:3001/tasks/1 -H "Content-Type: application/json" -d '{"status":"Done"}'
```

**c) Mock API de Vite 2025** (países y trivias): misma idea que 2026sem2 (URLs relativas `/api/…`,
solo con `npm start`, **no** con `vite preview`), pero sin `fetchJSON` y con datos más rebuscados:
- `GET /api/countries` devuelve **solo códigos** (`["ABW","AFG",…]`) → cada ítem (`ItemPais`) hace
  su propio fetch del nombre en `useEffect([props.cca3])`; la bandera es `/flags/${cca3}.svg`.
- En el país, `currencies`, `languages`, `name.nativeName` son **objetos** (`Object.keys` + `for…of`,
  tema 2); `capital`, `timezones`, `borders` son **arrays** (pueden venir vacíos: ATA).
- Filtros combinados solo con los no vacíos, codificando cada valor:
```js
const partes = [];
if (moneda !== '') partes.push('currency=' + encodeURIComponent(moneda));
if (zona !== '') partes.push('timezone=' + encodeURIComponent(zona));   // el + de UTC+01:00
const url = '/api/countries' + (partes.length > 0 ? '?' + partes.join('&') : '');
```

**d) APIs públicas de los ejercicios**
- `https://jsonplaceholder.typicode.com/users` (TA10): 10 usuarios; acepta POST/PUT pero no guarda.
- `https://countries.dev` (UT5): `/countries?fields=name,alpha2Code,flags`, `/alpha/UY` (404 si no existe).
  Forma distinta al mock: `capital` es **string**, `languages`/`currencies` son **arrays de objetos**.

(Código: `parciales/2025sem2-parcial2-matutino/web/src/components/ItemPais.jsx`,
`parciales/2025sem2-parcial2-matutino/web/src/services/api.js`, `Ejers/UT5/UT5.1.1-paises-router/src/servicios/api.js`.)

---

## ❓ Repaso

**Pregunta:** ¿3 problemas?
```js
async function agregar(name) {
  const nuevo = await fetch('/api/players', {
    method: 'POST',
    body: JSON.stringify({ name }),
  });
  setPlayers([...players, nuevo]);
}
```

**Respuesta:**
1. **POST** en vez de **PUT** (en esta API crear es PUT).
2. **`nuevo` es la `Response`, no el jugador** → falta `await nuevo.json()`. Mete basura en la lista.
3. **Sin manejo de errores**: `fetch` no tira en 400 → agrega aunque falle. Falta `response.ok` + `try/catch`.
   *(Extra: falta el header `Content-Type`.)*

```js
async function agregar(name) {
  try {
    const nuevo = await fetchJSON('/api/players', { method: 'PUT', body: { name } });
    setPlayers((list) => [...list, nuevo]);    // o refetch()
  } catch (err) {
    setError(err);
  }
}
```
