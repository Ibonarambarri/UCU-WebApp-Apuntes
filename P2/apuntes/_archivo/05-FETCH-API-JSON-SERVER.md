# 05 — Fetch, APIs y json-server

> Cómo se habla con el backend en todos los ejercicios y parciales: `fetch` +
> `async/await`, un archivo de servicio con las llamadas, `json-server` (2026), el
> mock de API dentro de Vite (2025sem2) y las APIs públicas (`jsonplaceholder`, `countries.dev`).

---

## 0. Mapa mental en 30 segundos

```
src/services/api.js  (o servicios/api.js, api/client.js, services/taskService.js)
   ├── obtenerTodos()        GET    /tasks
   ├── obtenerPorId(id)      GET    /tasks/:id
   ├── crear(objeto)         POST   /tasks          body JSON
   ├── reemplazar(id, obj)   PUT    /tasks/:id      body JSON completo
   ├── actualizar(id, obj)   PATCH  /tasks/:id      body JSON parcial
   └── borrar(id)            DELETE /tasks/:id
            │
componente → useEffect([]) + async function cargar() + try/catch/finally + estados
            │   (estaCargando, mensajeError, datos)
handler    → await crear(...) → actualizar lista / recargar() → navigate('/lista')
```

Reglas de oro:
1. `fetch` **no lanza error con 404/500** → comprobar `respuesta.ok` siempre.
2. El callback de `useEffect` **no puede ser async** → función async adentro y llamarla.
3. **El puerto** es el del script que levanta el backend, no el del README ni el del service.
4. Los inputs devuelven strings → `Number()` antes del POST cuando el campo es numérico.

---

## 1. `fetch` básico con `async/await`

```js
// GET simple
async function obtenerJson(url) {
  const respuesta = await fetch(url);                 // 1) pedir (devuelve una Promesa -> await)
  if (!respuesta.ok) {                                 // 2) 200-299 = ok; 404/500 NO lanzan solos
    throw new Error('Error al pedir ' + url + ' (status ' + respuesta.status + ')');
  }
  const datos = await respuesta.json();               // 3) el cuerpo es texto JSON -> objeto/array
  return datos;
}
```

Ver `parciales/2025sem2-parcial2-matutino/web/src/services/api.js`.

```js
// POST / PUT / PATCH / DELETE: segundo argumento con opciones
const respuesta = await fetch(url, {
  method: 'POST',                                        // o 'PUT', 'PATCH', 'DELETE'
  headers: { 'Content-Type': 'application/json' },       // le decimos al server que mandamos JSON
  body: JSON.stringify(objeto),                          // el body tiene que ser TEXTO
});
```

- `respuesta.status` → número (200, 201, 204, 404, 500).
- `respuesta.status === 404` → distinguir "no existe" de "se rompió" (ver `Ejers/UT5/UT5.1.1-paises-router/src/servicios/api.js`).
- `respuesta.status === 204` → "No Content": **no** hacer `.json()` (explota). `DELETE` a veces devuelve 204 o 200 con `{}`.
- `respuesta.text()` → si el server devolvió texto (mensajes de error).
- Errores de **red** (server apagado, sin internet, CORS) → `fetch` **sí** lanza → cae en el `catch`. Mensaje típico: `TypeError: Failed to fetch`.

---

## 2. ✅ Archivo de servicio para copiar (GET / POST / PUT / PATCH / DELETE)

Los componentes **nunca** hacen `fetch` directo: llaman a estas funciones. Nombres en español
según la guía, pero la plantilla Trello viene en inglés (`getTasks`, `createTask`…) — si el
parcial ya trae el archivo, **usalo tal cual** y solo arreglá el puerto.

```js
// src/services/api.js
// TRAMPA: este puerto tiene que ser EL MISMO que el del script que levanta json-server.
const URL_BASE = 'http://localhost:3001/tareas';

// GET /tareas -> array
async function obtenerTareas() {
  const respuesta = await fetch(URL_BASE);
  if (!respuesta.ok) {
    throw new Error('Error al obtener las tareas');
  }
  return await respuesta.json();
}

// GET /tareas/:id -> objeto
async function obtenerTarea(id) {
  const respuesta = await fetch(URL_BASE + '/' + id);
  if (!respuesta.ok) {
    throw new Error('Tarea no encontrada');
  }
  return await respuesta.json();
}

// POST /tareas -> devuelve la tarea creada, CON el id que le puso json-server
async function crearTarea(tarea) {
  const respuesta = await fetch(URL_BASE, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(tarea),
  });
  if (!respuesta.ok) {
    throw new Error('Error al crear la tarea');
  }
  return await respuesta.json();
}

// PUT /tareas/:id -> REEMPLAZA el objeto entero: hay que mandar TODOS los campos
async function reemplazarTarea(id, tareaCompleta) {
  const respuesta = await fetch(URL_BASE + '/' + id, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(tareaCompleta),
  });
  if (!respuesta.ok) {
    throw new Error('Error al actualizar la tarea');
  }
  return await respuesta.json();
}

// PATCH /tareas/:id -> modifica SOLO los campos que mandás
async function actualizarTarea(id, camposCambiados) {
  const respuesta = await fetch(URL_BASE + '/' + id, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(camposCambiados),      // ej: { status: 'Done' }
  });
  if (!respuesta.ok) {
    throw new Error('Error al actualizar la tarea');
  }
  return await respuesta.json();
}

// DELETE /tareas/:id -> no devuelve nada útil
async function borrarTarea(id) {
  const respuesta = await fetch(URL_BASE + '/' + id, { method: 'DELETE' });
  if (!respuesta.ok) {
    throw new Error('Error al eliminar la tarea');
  }
}

export { obtenerTareas, obtenerTarea, crearTarea, reemplazarTarea, actualizarTarea, borrarTarea };
```

Versiones reales:
- `parciales/2026sem1-prueba2-vespertino/src/services/taskService.js` (Trello, funciones en inglés, PUT).
- `parciales/2026sem1-simulacro-vespertino/src/api/client.js` (BarApp: una función genérica
  `fetchJson(ruta, opciones)` + objetos `cuentasApi` / `productosApi` con `listar/obtener/crear/reemplazar/actualizar/borrar`; maneja el 204).
- `Ejers/UT5/UT5.1.1-paises-router/src/servicios/api.js` (API pública, distingue 404).

---

## 3. Usar el servicio desde un componente

### Cargar al montar (GET) — ✅ patrón para copiar

```jsx
// Ejers/UT4/TA10-fetch-usuarios/src/componentes/ListaUsuarios.jsx
import { useState, useEffect } from 'react';

function ListaUsuarios() {
  const [usuarios, setUsuarios] = useState([]);          // los datos
  const [estaCargando, setEstaCargando] = useState(true); // true desde el arranque
  const [mensajeError, setMensajeError] = useState('');   // '' = sin error

  // [] = solo al montar. Sin el array: fetch infinito (cada setUsuarios re-renderiza y re-dispara).
  useEffect(function () {
    // El callback NO puede ser async (devolvería una Promesa y React espera nada o una función de limpieza).
    async function cargarUsuarios() {
      try {
        const respuesta = await fetch('https://jsonplaceholder.typicode.com/users');
        if (!respuesta.ok) {
          throw new Error('La API respondió con el código ' + respuesta.status);
        }
        const datos = await respuesta.json();
        setUsuarios(datos);
      } catch (error) {
        setMensajeError('No se pudieron cargar los usuarios: ' + error.message);
      } finally {
        setEstaCargando(false);      // pase lo que pase, dejamos de cargar
      }
    }
    cargarUsuarios();
  }, []);

  if (estaCargando) {
    return <p>Cargando...</p>;
  }
  if (mensajeError !== '') {
    return <p className="error">{mensajeError}</p>;
  }
  return (
    <ul>
      {usuarios.map((usuario) => (
        <li key={usuario.id}>{usuario.name} — {usuario.email}</li>
      ))}
    </ul>
  );
}
```

Con dependencia (cambia el parámetro de la URL o un filtro): `}, [cca2]);` /
`}, [props.url]);` / `}, [moneda, lenguaje, zona]);` y reiniciar `setEstaCargando(true)` al
principio de la función. Ver `03-REACT-ROUTER.md` §5 y `02-HOOKS-USEEFFECT.md`.

### Crear desde un formulario (POST) y redirigir

```jsx
// parciales/2026sem1-simulacro-vespertino/src/pages/NuevaCuentaPage.jsx
async function handleSubmit(evento) {
  evento.preventDefault();
  setError('');

  if (!formulario.cliente.trim() || !formulario.nombre.trim()) {   // validación (bonus)
    setError('El cliente y el producto son obligatorios.');
    return;
  }

  const cuentaNueva = {
    cliente: formulario.cliente.trim(),
    productos: [{ icono: formulario.icono.trim(), nombre: formulario.nombre.trim(), cantidad: Number(formulario.cantidad) }],
  };                                       // Number(): los inputs SIEMPRE dan strings

  try {
    await cuentasApi.crear(cuentaNueva);   // POST
    await recargar();                      // total del contexto
    navigate('/cuentas');                  // recién ahora
  } catch (errorCapturado) {
    setError('Error al crear la cuenta: ' + errorCapturado.message);
  }
}
```

⚠️ Mirá `db.json` antes de armar el objeto: el POST tiene que tener **la misma forma** que los
registros existentes (en BarApp `cuentas.productos[]` guarda `{icono, nombre, cantidad}`, sin id
de producto). La colección de Postman puede estar desactualizada; manda el README + `db.json`.

### Modificar un registro (PUT) sin volver a pedir toda la lista

```jsx
// parciales/2026sem1-prueba2-vespertino/src/pages/BoardPage/BoardPage.jsx
async function handleStatusChange(id, newStatus) {
  const tareaEncontrada = tasks.find((tarea) => tarea.id === id);   // ids string: sin Number()
  if (!tareaEncontrada) {
    return;
  }
  const tareaActualizada = { ...tareaEncontrada, status: newStatus };   // copia, NUNCA mutar
  try {
    const tareaGuardada = await updateTask(id, tareaActualizada);       // PUT con el objeto completo
    const listaActualizada = tasks.map((tarea) => (tarea.id === id ? tareaGuardada : tarea));
    setTasks(listaActualizada);
  } catch (errorCapturado) {
    alert('No se pudo actualizar la tarea: ' + errorCapturado.message);
  }
}
```

### Borrar (DELETE)

```jsx
async function handleDelete(id) {
  try {
    await deleteTask(id);
    setTasks(tasks.filter((tarea) => tarea.id !== id));
  } catch (errorCapturado) {
    alert('No se pudo eliminar: ' + errorCapturado.message);
  }
}
```

### Cargar UN registro para editar (GET por id, depende de `[id]`)

```jsx
// parciales/2026sem1-prueba2-vespertino/src/pages/TaskFormPage/TaskFormPage.jsx
const { id } = useParams();
const isEditing = Boolean(id);

useEffect(() => {
  async function cargarTarea() {
    setLoading(true);
    try {
      const tarea = await getTask(id);
      setForm({ title: tarea.title, description: tarea.description, status: tarea.status, assignee: tarea.assignee || '' });
    } catch {
      setError('No se encontró la tarea.');
    } finally {
      setLoading(false);
    }
  }
  if (isEditing) {
    cargarTarea();
  }
}, [id]);
```

---

## 4. json-server (formato 2026: Trello y BarApp)

### Instalación y arranque

```bash
npm install -D json-server          # en la carpeta donde está db.json (o en la raíz)
npx json-server db.json --port 3001 # levanta la API REST en http://localhost:3001
```

En `package.json`:

```json
"scripts": {
  "dev": "vite",
  "server": "json-server db.json --port 3001"
}
```

- **Dos terminales**: una con `npm run dev` (Vite, 5173) y otra con `npm run server`.
  Trello trae `"start": "concurrently \"npm run dev\" \"npm run server\""` para las dos juntas.
- json-server **1.x** (beta, la que traen las plantillas 2026): `--watch` no hace falta (solo avisa que es redundante, no rompe).
- Si el puerto está ocupado: `Error: listen EADDRINUSE` → cambiá el número **en el script Y en el service**.

⚠️ **Trampa BarApp:** el README dice `cd BE && npm install && npm run dev` pero la carpeta `BE/`
**solo tenía `db.json`**. Hubo que crear `BE/package.json`:

```json
{
  "name": "be",
  "private": true,
  "scripts": { "dev": "json-server db.json --port 3001" },
  "devDependencies": { "json-server": "^1.0.0-beta.3" }
}
```
Ver `parciales/2026sem1-simulacro-vespertino/BE/package.json`.

⚠️ **Trampa Trello:** `package.json` levanta en **3001**, `taskService.js` apuntaba a **3000** y
el README decía 3000 en las notas y 3001 en el ejercicio 2. Resultado: `Failed to fetch` y
tablero vacío. Regla: **unificar antes de escribir una línea de React**. Ver el comentario en
`parciales/2026sem1-prueba2-vespertino/src/services/taskService.js`.

### `db.json`: cada clave de primer nivel es un recurso

```json
{
  "tasks": [
    { "id": "1", "title": "Diseñar login", "description": "...", "status": "Done", "assignee": "Ana García" }
  ],
  "productos": [ { "id": "1", "icono": "🍺", "nombre": "Cerveza", "precio": 900 } ],
  "cuentas":   [ { "id": "1", "cliente": "María", "productos": [ { "icono": "🍺", "nombre": "Cerveza", "cantidad": 2 } ] } ]
}
```

### Qué hace cada verbo

| Petición | Qué devuelve | Notas |
|---|---|---|
| `GET /tasks` | array completo | |
| `GET /tasks?status=Done` | array filtrado | filtros por igualdad `?campo=valor` |
| `GET /tasks/1` | el objeto | 404 si no existe |
| `POST /tasks` + body | el objeto creado **con `id`** | json-server 1.x genera ids **string** cortos (`"a1b2"`) |
| `PUT /tasks/1` + body completo | el objeto nuevo | **reemplaza** todo: si olvidás un campo, desaparece |
| `PATCH /tasks/1` + body parcial | el objeto resultante | solo cambia lo que mandás |
| `DELETE /tasks/1` | `{}` (200) o 204 | |

- **Ids son STRING** en 1.x (`"id": "4"`) y `useParams` también devuelve string →
  comparar con `===` directo, **no** hacer `Number(id)`.
- json-server **escribe en `db.json`**: cada POST/PUT/DELETE modifica el archivo. Para probar
  sin ensuciar los datos, guardá una copia (`cp db.json db.original.json`) y restaurala al final.
- Mismo puerto para todos los recursos: `http://localhost:3001/productos`, `.../cuentas`.

### Probar con curl (copiar y pegar)

```bash
# GET lista
curl -s http://localhost:3001/tasks
# GET uno
curl -s http://localhost:3001/tasks/1
# POST
curl -s -X POST http://localhost:3001/tasks \
  -H "Content-Type: application/json" \
  -d '{"title":"Prueba","description":"desde curl","status":"To Do","assignee":""}'
# PUT (objeto completo)
curl -s -X PUT http://localhost:3001/tasks/1 \
  -H "Content-Type: application/json" \
  -d '{"id":"1","title":"Diseñar login","description":"...","status":"In Progress","assignee":"Ana García"}'
# PATCH (parcial)
curl -s -X PATCH http://localhost:3001/tasks/1 \
  -H "Content-Type: application/json" \
  -d '{"status":"Done"}'
# DELETE
curl -s -X DELETE http://localhost:3001/tasks/ID_CREADO
```

Con Postman / Bruno: las plantillas 2026 traen colecciones
(`parciales/2026sem1-simulacro-vespertino/collections/postman/Simulacro-JSON-Server.postman_collection.json`
y `collections/bruno/`). Import → poner `base_url` → probar. Si no coincide con `db.json`, manda `db.json`.

### Proxy de Vite (solo BarApp lo trae)

`vite.config.js` de BarApp define `server.proxy['/api'] → http://localhost:3001` con `rewrite`.
Eso permitiría usar `fetch('/api/cuentas')` sin puerto y sin CORS. La solución NO lo usa (usa la
URL completa en `client.js`), pero si ves un proxy en la plantilla, sabé que existe.

---

## 5. El mock de API dentro de Vite (formato 2025sem2: países y trivias)

Las 4 plantillas de 2025sem2 **no usan json-server**: `web/vite.config.js` monta un plugin
`mockApi` (`web/data/mock-api.js` + `web/data/mock-routes.js`) que sirve la API en el
**mismo servidor de Vite** (`http://localhost:5173/api/...`). Consecuencias:

- Se usan URLs **relativas**: `fetch('/api/countries')`. Sin puerto, sin CORS.
- Solo existe con **`npm start`** (dev server). `vite build` / `vite preview` no la sirven.
- Las imágenes están en `web/data/static` (publicDir): `/flags/URY.svg`, `/maps/URY.svg`.
- `web/data/` **no se toca**; se lee `mock-routes.js` para conocer los endpoints exactos.

### Endpoints (idénticos en los 4 repos 2025sem2, verificado con `diff`)

| Endpoint | Devuelve | Forma |
|---|---|---|
| `GET /api/countries` | **solo códigos** cca3 | `["ABW", "AFG", ...]` |
| `GET /api/countries?currency=EUR&language=fra&timezone=UTC%2B01:00` | códigos filtrados (combinables) | `["BEL", "FRA", ...]` |
| `GET /api/countries/URY` | objeto país completo | ver abajo; 404 `{ "error": "..." }` si no existe |
| `GET /api/currencies` | monedas | `[{ code: "EUR", name: "Euro", symbol: "€" }]` |
| `GET /api/languages` | lenguajes | `[{ code: "fra", name: "French" }]` |
| `GET /api/timezones` | zonas | `["UTC-04:00", "UTC+01:00", ...]` (strings sueltos) |
| `GET /flags/URY.svg`, `GET /maps/URY.svg` | imágenes | `<img src={'/flags/' + cca3 + '.svg'} />` |

### Forma del objeto país (`web/data/db/data.json`)

```js
{
  "id": "URY", "cca2": "UY", "cca3": "URY",
  "name": {
    "common": "Uruguay",
    "official": "Oriental Republic of Uruguay",
    "nativeName": { "spa": { "official": "República Oriental del Uruguay", "common": "Uruguay" } }  // OBJETO clave=idioma
  },
  "capital": ["Montevideo"],                                  // ARRAY (puede ser [] -> ATA)
  "currencies": { "UYU": { "name": "Uruguayan peso", "symbol": "$" } },   // OBJETO clave=código (puede ser {})
  "languages": { "spa": "Spanish" },                          // OBJETO clave=código -> nombre
  "borders": ["ARG", "BRA"],                                  // ARRAY de cca3 (puede ser [])
  "timezones": ["UTC-03:00"],                                 // ARRAY
  "flag": { "alt": "The flag of Uruguay...", "svg": "/flags/URY.svg" },
  "map": { "svg": "/maps/URY.svg" }                           // algunos países NO lo tienen (FSM)
}
```

⚠️ **Objetos vs arrays**: `currencies`, `languages`, `name.nativeName` son **objetos** → recorrer con
`Object.keys(pais.currencies)` y un `for...of`; `capital`, `timezones`, `borders` son **arrays**
→ `join(', ')`, `includes`. Contemplar vacíos con una función auxiliar que devuelva `"-"`.
Ver `parciales/2025sem2-parcial2-matutino/web/src/components/PaginaPais.jsx`.

### ⚠️ La lista devuelve solo códigos → `ItemPais` con fetch propio

Para mostrar "bandera + nombre" por ítem hace falta el detalle de cada país. La solución de
principiante: un componente por ítem que pide su propio nombre; la bandera se arma con el
código sin esperar:

```jsx
// parciales/2025sem2-parcial2-matutino/web/src/components/ItemPais.jsx
function ItemPais(props) {
  const [nombre, setNombre] = useState(null);

  useEffect(() => {
    async function cargarNombre() {
      try {
        const pais = await obtenerPais(props.cca3);
        setNombre(pais.name.common);
      } catch (error) {
        setNombre(props.cca3);          // si falla, mostramos el código igual
      }
    }
    cargarNombre();
  }, [props.cca3]);

  const textoAMostrar = nombre !== null ? nombre : props.cca3;   // provisorio mientras carga

  return (
    <li>
      <Link to={'/country/' + props.cca3}>
        <img src={'/flags/' + props.cca3 + '.svg'} alt={'Bandera de ' + textoAMostrar} />
        <span>{textoAMostrar}</span>
      </Link>
    </li>
  );
}
```

250 fetch en paralelo al servidor local: funciona sin problema.

### Query string con filtros combinados y `encodeURIComponent`

```js
// parciales/2025sem2-parcial2-matutino/web/src/services/api.js
async function obtenerPaises(moneda, lenguaje, zonaHoraria) {
  let url = '/api/countries';
  const partesDelQuery = [];
  if (moneda !== '') { partesDelQuery.push('currency=' + encodeURIComponent(moneda)); }
  if (lenguaje !== '') { partesDelQuery.push('language=' + encodeURIComponent(lenguaje)); }
  if (zonaHoraria !== '') { partesDelQuery.push('timezone=' + encodeURIComponent(zonaHoraria)); }
  if (partesDelQuery.length > 0) {
    url = url + '?' + partesDelQuery.join('&');     // /api/countries?currency=EUR&language=fra
  }
  return await obtenerJson(url);
}
```

`"UTC+01:00"` sin codificar → el server lee `UTC 01:00` → devuelve `[]`. Con
`encodeURIComponent` → `UTC%2B01%3A00` → funciona. Alternativa: `new URLSearchParams({...}).toString()`.

---

## 6. APIs públicas usadas

### `https://jsonplaceholder.typicode.com/users` (TA10)

GET → array de 10 usuarios `{ id, name, username, email, address: {...}, phone, website, company: {...} }`.
Sin clave, con CORS. También acepta POST/PUT/DELETE pero **no persiste** (devuelve como si).

### `https://countries.dev` (UT5.1.1 / UT5.1.2)

| Endpoint | Devuelve |
|---|---|
| `GET /countries` | 250 países, todos los campos |
| `GET /countries?fields=name,alpha2Code,flags` | solo esos campos (liviano, es lo que usa la lista) |
| `GET /alpha/UY` | un país; **404** si no existe |

Forma de un país (distinta a la del mock de 2025, ¡ojo!):

```js
{
  "name": "Uruguay", "nativeName": "Uruguay",
  "alpha2Code": "UY", "alpha3Code": "URY",
  "capital": "Montevideo",                      // STRING (no array)
  "region": "Americas", "subregion": "South America",
  "population": 3473727, "area": 181034,
  "flag": "🇺🇾", "flags": { "png": "https://flagcdn.com/w320/uy.png", "svg": "https://flagcdn.com/uy.svg" },
  "languages":  [{ "name": "Spanish", "nativeName": "Español", "iso639_1": "es" }],   // ARRAY de objetos
  "currencies": [{ "code": "UYU", "name": "Uruguayan peso", "symbol": "$" }],         // ARRAY de objetos
  "borders": ["ARG", "BRA"], "timezones": ["UTC-03:00"], "callingCodes": ["598"]
}
```

Ordenar la lista: `lista.sort(function (a, b) { return a.name.localeCompare(b.name); })`.
Ver `Ejers/UT5/UT5.1.1-paises-router/src/servicios/api.js` y `paginas/DetalleDePais.jsx`.

---

## 7. Trampas (todas salieron de verdad)

| ⚠️ Trampa | Qué pasa | Solución |
|---|---|---|
| Puerto del README ≠ script ≠ service | `Failed to fetch`, app vacía | Mirar `package.json` (o `BE/package.json`) y poner ese puerto en el service |
| `BE/` sin `package.json` | `npm run dev` falla en BE | Crear `BE/package.json` con json-server (sección 4) |
| Puerto ocupado por otro proceso | `EADDRINUSE` | Cambiar puerto en script + service |
| `fetch` no lanza en 404/500 | Explota después al leer `pais.name.common` de `{ error }` | `if (!respuesta.ok) throw new Error(...)` |
| `useEffect(async () => ...)` | Warning y limpieza rota | Función async adentro + llamarla |
| `useEffect` sin `[]` | Fetch infinito | Poner `[]` o la dependencia correcta |
| StrictMode en desarrollo | El fetch se hace **dos veces** al montar (montar-desmontar-montar) | Es normal; en producción no pasa. Si un POST se duplica, revisar que no esté en un `useEffect` |
| Ids string vs number | `find` no encuentra, `===` da false | Mirar `db.json`; con json-server 1.x **no** convertir; con ids numéricos `Number(parametros.id)` |
| PUT con objeto incompleto | Se pierden campos | Mandar `{ ...objetoOriginal, campo: nuevo }` (o usar PATCH) |
| Inputs numéricos | `"3"` va al backend como string | `Number(formulario.cantidad)` antes del POST |
| `navigate()` antes del `await` | La lista se muestra sin el registro nuevo | `await crear()` → (recargar) → `navigate()` |
| `+` en query string | Filtro devuelve `[]` | `encodeURIComponent` |
| Objetos donde esperabas arrays | `.map is not a function` | `Object.keys(objeto)` y recorrer las claves |
| Campos que faltan (`capital: []`, país sin `map`) | `undefined` en pantalla o explota | `if` explícito y valor por defecto `"-"` |
| CORS (`blocked by CORS policy`) | Solo con APIs externas que no lo permiten | Usar API con CORS (countries.dev lo tiene), o proxy de Vite. json-server y el mock ya lo permiten |
| Mock 2025 en `vite preview` | `/api/...` devuelve el `index.html` | Probar siempre con `npm start` |
| json-server escribe `db.json` | Los datos de prueba quedan "sucios" | Copia de seguridad antes de probar |
| `.json()` sobre 204 | `Unexpected end of JSON input` | `if (respuesta.status === 204) return null` |

---

## 8. Plan mínimo "backend" en el parcial (10 minutos)

1. Leer README + `package.json` + `db.json` (o `mock-routes.js`). Anotar **puerto** y **forma de cada recurso**.
2. Levantar el backend y probar con `curl` (o el navegador) `GET /recurso`. Si no responde, arreglar puerto/`package.json` **antes** de tocar React.
3. Escribir/arreglar `src/services/api.js` con las funciones que el enunciado necesita.
4. Recién ahí: `useEffect` + estados en la página de lista.

---

## Checklist de repaso

1. ¿Por qué `fetch` a una URL que devuelve 404 no cae en el `catch` por sí solo?
2. Escribí de memoria la función `crear(objeto)` con POST.
3. ¿Diferencia entre PUT y PATCH? ¿Cuál usa el Trello y qué tenés que mandar?
4. ¿Dónde miro el puerto real de json-server? ¿Qué pasa si el service tiene otro?
5. ¿Qué tipo tienen los ids en json-server 1.x? ¿Convierto `useParams` con `Number()`?
6. ¿Por qué el `useEffect` que carga datos define una función async adentro?
7. ¿Qué devuelve `GET /api/countries` en el mock de 2025 y cómo obtengo el nombre de cada país?
8. ¿Cuáles campos del país del mock son objetos y cuáles arrays?
9. ¿Cómo armo `/api/countries?currency=EUR&timezone=UTC+01:00` correctamente?
10. ¿Por qué el fetch se ejecuta dos veces en desarrollo? ¿Es un bug?
11. ¿En qué orden van `await crear()`, `recargar()` y `navigate()`?
12. ¿Qué hago si `BE/` solo tiene `db.json`?
