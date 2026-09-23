# 08 — Setup: Vite, json-server, puertos y errores de arranque

> Los primeros 10 minutos del parcial son de setup. Si acá te trabás, perdés
> tiempo de código. Este archivo tiene todos los comandos exactos, qué hace
> cada archivo de una plantilla, y **todos los errores de arranque que salieron**
> al resolver los 6 parciales (con su solución).

---

## 1. Crear un proyecto React desde cero (formato 2025: "app desde casi cero")

```bash
npm create vite@latest mi-app -- --template react   # pregunta nombre/framework si no se los pasás
cd mi-app
npm install                                          # instala react, react-dom, vite
npm install react-router-dom                         # router (SIEMPRE hace falta en el parcial)
npm install -D json-server                           # solo si el backend es json-server
npm run dev                                          # http://localhost:5173
```

### Estructura mínima que genera (y qué hace cada archivo)

```
mi-app/
├── index.html          ← la ÚNICA página. Tiene <div id="root"> y <script type="module" src="/src/main.jsx">
├── package.json        ← dependencias y scripts ("dev": "vite", "build": "vite build")
├── vite.config.js      ← plugins: [react()]. No se toca (salvo proxy).
└── src/
    ├── main.jsx        ← punto de entrada: createRoot(...).render(<App />)
    ├── App.jsx         ← componente raíz (acá va el BrowserRouter + Routes)
    ├── App.css
    └── index.css       ← estilos globales (importado en main.jsx)
```

`main.jsx` mínimo (es el de `Ejers/UT4/TA04-contador/src/main.jsx`):

```jsx
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './index.css';

// Buscamos el div#root de index.html y dibujamos <App /> adentro.
createRoot(document.getElementById('root')).render(<App />);
```

Con StrictMode y Provider (parcial 2026 Trello, `parciales/2026sem1-prueba2-vespertino/src/main.jsx`):

```jsx
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <TasksProvider>
      <App />
    </TasksProvider>
  </React.StrictMode>
);
```

Notas:
- **`import React from 'react'` ya no hace falta** en los archivos con JSX (Vite lo inyecta). Las plantillas viejas lo traen; no molesta.
- **StrictMode** solo en desarrollo: monta → desmonta → monta cada componente. Vas a ver dos fetch y dos `console.log` al cargar. Es normal; no lo saques, y si un `setInterval` "cuenta de a 2" es porque falta la función de limpieza (ver `02-HOOKS-USEEFFECT.md`).
- Node: las plantillas piden `nodejs 24.4.1` en `.tool-versions` (`asdf install`). Con Node 26 funciona igual.

---

## 2. Cómo está organizada la carpeta `P2/Ejers` (un `node_modules` por UT)

Para no tener 20 carpetas `node_modules` de 100 MB, las dependencias se
instalaron **una sola vez** en `Ejers/UT4/package.json` y `Ejers/UT5/package.json`.

```
Ejers/UT4/
├── package.json        ← react, react-dom, react-router-dom, vite, @vitejs/plugin-react
├── node_modules/       ← UNA sola instalación
├── TA01-card-props/    ← mini-proyecto vite completo (index.html, vite.config.js, src/)
│   └── package.json    ← SIN dependencias, solo scripts dev/build
├── TA02-card-children/
└── ...
```

¿Por qué funciona? Node busca `node_modules` en la carpeta actual y, si no
está, **sube por las carpetas padre** hasta encontrarlo. Vite y `@vitejs/plugin-react`
se resuelven igual. Así que:

```bash
cd Ejers/UT4                 # solo si borraste node_modules:
npm install
cd TA06-lista-tareas
npm run dev                  # http://localhost:5173
```

⚠️ Si dos ejercicios corren a la vez, Vite usa 5173 para el primero y 5174
para el segundo (avisa en consola). Para elegir puerto: `npx vite --port 5200`.

---

## 3. Cómo correr CADA parcial (comandos exactos y puertos)

| Parcial | Instalar | Backend | Frontend | URL API | URL app |
|---|---|---|---|---|---|
| `parciales/2026sem1-prueba2-vespertino` (Trello) | `npm install` | `npm run server` (json-server, **3001**) | `npm run dev` | `http://localhost:3001/tasks` | `http://localhost:5173` |
| `parciales/2026sem1-simulacro-vespertino` (BarApp) | `npm install` **y** `cd BE && npm install` | `cd BE && npm run dev` (o `npm run be` desde la raíz) → **3001** | `npm run dev` | `http://localhost:3001/cuentas` | `http://localhost:5173` (redirige a `/cuentas`) |
| `parciales/2025sem2-parcial2-matutino` | `cd web && npm install` | no hay: la API es un plugin de Vite | `npm start` | `http://localhost:5173/api/countries` | `http://localhost:5173` |
| `parciales/2025sem2-parcial2-vespertino` | ídem | ídem | `npm start` | ídem | ídem |
| `parciales/2025sem2-simulacro-matutino` | ídem | ídem | `npm start` | ídem + `/flags/URY.svg`, `/maps/URY.svg` | ídem |
| `parciales/2025sem2-simulacro-vespertino` | ídem | ídem | `npm start` | ídem | ídem |

Trello también tiene `npm start` que levanta los dos con `concurrently`
(`"start": "concurrently \"npm run dev\" \"npm run server\""`). Con dos
terminales es más fácil ver los errores de cada uno.

### 3.1 Formato 2026 (json-server aparte): dos terminales

```bash
# Terminal 1: backend
npm run server            # Trello: json-server --watch BE/db.json --port 3001
# Terminal 2: frontend
npm run dev               # vite en 5173
```

Comprobar que la API responde ANTES de escribir React:
```bash
curl -s http://localhost:3001/tasks | head -c 300
```
O abrir `http://localhost:3001/tasks` en el navegador.

### 3.2 Formato 2025 (mock API dentro de Vite)

`web/vite.config.js` monta un plugin `mockApi` que atiende `/api/...` en el
**mismo puerto** de Vite (5173). Solo existe con `npm start` (= `vite`).
⚠️ `vite build` + `vite preview` **no** sirven la API: probar siempre con `npm start`.
Las rutas exactas están en `web/data/mock-routes.js` (leerlo primero) y los datos en `web/data/db/data.json`.

---

## 4. json-server: lo mínimo para el parcial

```bash
npm install -D json-server            # versión 1.x (beta) en 2026
```

`package.json`:
```json
"scripts": {
  "dev": "vite",
  "server": "json-server db.json --port 3001"
}
```

`db.json` (cada clave de primer nivel es un recurso → `/tasks`, `/productos`):
```json
{
  "tasks": [
    { "id": "1", "title": "Diseñar login", "status": "Done", "assignee": "Ana" }
  ]
}
```

| Petición | Qué hace |
|---|---|
| `GET /tasks` | lista |
| `GET /tasks/1` | uno (404 si no existe) |
| `GET /tasks?status=Done` | filtro por campo |
| `POST /tasks` (body JSON sin id) | crea y **devuelve el objeto con id** (string corto tipo `"a1b2"`) |
| `PUT /tasks/1` (body completo) | reemplaza todo |
| `PATCH /tasks/1` (body parcial) | cambia solo esos campos |
| `DELETE /tasks/1` | borra |

⚠️ json-server 1.x: los **ids son string** (`"id": "4"`), `--watch` es
redundante (avisa "JSON Server 1+ watches for file changes by default" pero
arranca igual), y **escribe en `db.json`** cuando hacés POST/PUT/DELETE
(guardá una copia si querés volver al estado inicial: `cp BE/db.json BE/db.original.json`).

Detalle completo en `05-FETCH-API-JSON-SERVER.md`.

---

## 5. ESLint y warnings que vas a ver (y que NO son errores)

| Warning en consola | Qué es | Qué hacer |
|---|---|---|
| `React Router Future Flag Warning: v7_startTransition...` (dos avisos) | React Router **v6** avisa de cambios de v7 | Nada. Vienen con las plantillas 2025. |
| `react-refresh/only-export-components` (ESLint) | un archivo exporta un Context **y** un componente Provider | Nada (o `// eslint-disable-next-line react-refresh/only-export-components` arriba del `export const Contexto`). Es lo normal en `context/*.jsx`. |
| `Missing "key" prop` | falta `key` en un `.map` | Sí arreglar: `key={item.id}`. |
| `Each child in a list should have a unique "key"` | ids repetidos o `key={indice}` con lista que cambia | usar id real. |
| `Warning: A component is changing an uncontrolled input to be controlled` | `value={undefined}` al principio | inicializar el estado con `''`. |
| `Can't perform a React state update on an unmounted component` | fetch terminó después de desmontar | ignorable en el parcial (o cleanup). |

`npx eslint src` corre el linter de la plantilla (2025 tienen `eslint.config.js`).

---

## 6. ⚠️ Errores de arranque que salieron de verdad (y la solución)

### 6.1 `npm install` avisa `allow-scripts ... esbuild` y después Vite no arranca
npm 11 bloquea los scripts de post-instalación. esbuild (lo usa Vite) necesita el suyo.
```bash
npm approve-scripts esbuild --yes && npm rebuild esbuild
```
Se vio en **todas** las plantillas. Después de esto `npx esbuild --version` tiene que responder.

### 6.2 `Failed to fetch` / `ERR_CONNECTION_REFUSED` en todos los fetch
El puerto del service no coincide con el del backend.
- Trello 2026: `package.json` levanta json-server en **3001**, pero `taskService.js` venía con `http://localhost:3000/tasks` y el README dice 3000 en las notas técnicas. Se unificó a 3001 (ver `parciales/2026sem1-prueba2-vespertino/src/services/taskService.js`).
- BarApp 2026: `api/client.js` tenía `BASE = 'http://localhost:3000'`; el 3000 estaba ocupado en la máquina por otro proceso → se unificó todo en 3001.
**Regla: el puerto real es el del script que levanta el backend. Unificalo antes de escribir React.**

### 6.3 Puerto ocupado (`EADDRINUSE` / json-server no arranca / Vite pasa a 5174)
```bash
lsof -i :3000            # ¿quién está usando el puerto?
kill <PID>               # matarlo (o kill -9 <PID>)
# o simplemente usar otro puerto: json-server db.json --port 3001
```

### 6.4 `cd BE && npm install` falla: "no package.json"
BarApp 2026: la carpeta `BE/` **solo tenía `db.json`**. Hay que crear `BE/package.json`
(es el real de `parciales/2026sem1-simulacro-vespertino/BE/package.json`):
```json
{
  "name": "be",
  "private": true,
  "scripts": { "dev": "json-server db.json --port 3001" },
  "devDependencies": { "json-server": "^1.0.0-beta.3" }
}
```

### 6.5 `Failed to resolve import "./Navbar.module.css"`
El archivo se llama `NavBar.module.css` (mayúscula distinta). En macOS a veces
anda, en Linux no. Corregir el import para que coincida **letra por letra**.
También pasa con `import App from './App'` vs `./App.jsx` (Vite resuelve sin
extensión, pero si el archivo se llama distinto, no).

### 6.6 `useParams()` / `Link` explota: "useNavigate() may be used only in the context of a <Router>"
El componente está fuera del `<BrowserRouter>`. Mirá dónde está el router:
en `main.jsx` (BarApp) o en `App.jsx` (Trello, 2025). Todo lo que use
`Link`, `NavLink`, `useParams`, `useNavigate` tiene que estar **adentro**.

### 6.7 `Cannot read properties of null (reading 'tasks')` al usar `useContext`
El Provider está **adentro** del componente que consume, o no está. El
Provider va por fuera (en `main.jsx`) si `App` también consume. Ver `04-CONTEXT.md`.

### 6.8 La app queda en "Cargando..." para siempre
El `finally` con `setEstaCargando(false)` falta, o el `catch` no lo apaga.
Abrir la pestaña **Network** del navegador: si la petición está en rojo es
puerto/CORS; si es 404, la ruta de la API está mal.

### 6.9 `vite build` pasa pero la app no carga datos con `vite preview` (2025)
La mock API solo existe en el dev server (`npm start`). No es un bug tuyo.

### 6.10 Cambié el `.env` / `vite.config.js` y no toma
Reiniciar `npm run dev` (Vite no recarga la config).

---

## 7. ✅ Checklist "primeros 5 minutos del parcial"

1. **Fork privado + clone** del repo (el enunciado siempre pide entregar por PR al original).
2. `npm install` en la raíz (y en `web/` o `BE/` si existen). Si aparece lo de `allow-scripts`: `npm approve-scripts esbuild --yes && npm rebuild esbuild`.
3. Leer **todo** el `README.md` (los 6 ejercicios, la tabla de rutas, las notas técnicas con puertos).
4. Mirar `db.json` (formato 2026) o `web/data/mock-routes.js` + primeros registros de `data.json` (formato 2025): **¿qué devuelve cada endpoint? ¿ids string? ¿objetos o arrays?**
5. Abrir `package.json`: ¿qué scripts hay? ¿qué puerto usa el backend? Abrir el service (`services/*.js`, `api/client.js`): ¿coincide el puerto? **Unificar.**
6. Levantar backend y frontend en dos terminales. Probar la API con `curl` o en el navegador. Abrir `http://localhost:5173` y la consola (F12).
7. `grep -rn "TODO" src/` para listar todo lo que falta completar. Anotar qué archivo corresponde a cada ejercicio.
8. Mirar `Screens.png` / `specs/design.png` (croquis) 30 segundos: te dice la estructura de componentes.
9. Recién ahora: código. Orden en `09-PATRONES-DE-PARCIAL.md`.

---

## Checklist de repaso

- [ ] ¿Qué comando crea un proyecto Vite con React y cuál instala el router?
- [ ] ¿Qué hay en `index.html`, `main.jsx` y `App.jsx`?
- [ ] ¿Por qué un ejercicio de `Ejers/UT4/TAxx` funciona sin tener `node_modules` propio?
- [ ] ¿Cómo levanto el Trello 2026 (dos comandos, dos puertos)?
- [ ] ¿Cómo levanto un parcial 2025 y dónde está la API?
- [ ] ¿Qué hago si `npm install` avisa de `allow-scripts`?
- [ ] ¿Qué hago si el service apunta a 3000 y json-server corre en 3001?
- [ ] ¿Qué hago si `BE/` no tiene `package.json`?
- [ ] ¿Cuáles son los dos warnings de consola que NO hay que arreglar?
