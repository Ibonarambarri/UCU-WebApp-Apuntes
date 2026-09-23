# Apuntes — Prueba 2 2026 Sem1 Vespertino (Trello App)

Resolución comentada de la prueba. El enunciado original está en `README.md`
(no se modificó). Las pantallas están en `Screens.png`.

> Formato viejo (json-server + `fetch` a pelo + service propio), no el 2026sem2.
> Sirve sobre todo si el examen trae un **formulario crear/editar** o un Context de lista global.

---

## 1. Resumen del enunciado

Tablero estilo Trello con tareas en tres columnas (`To Do`, `In Progress`,
`Done`) persistidas en json-server. 6 ejercicios, **con 5 de 6 se obtiene el
100%**.

| # | Ejercicio | Qué hay que hacer | Dónde |
|---|-----------|-------------------|-------|
| 1 | Columnas y tareas | Renderizar una `TaskCard` por tarea dentro de su columna (`map` + `filter`), mensaje si la columna está vacía, contador (bonus) | `Board.jsx` |
| 2 | GET a json-server | `getTasks()` en un `useEffect` al montar, con loading/error, y guardar en el estado | `BoardPage.jsx` |
| 3 | Rutas | `/`, `/tasks/new`, `/tasks/:id/edit` con React Router | `App.jsx` |
| 4 | Crear tarea | Formulario controlado + `POST`. Bonus: validar campos vacíos | `TaskFormPage.jsx` |
| 5 | Editar tarea | Leer `:id` con `useParams`, `GET /tasks/:id`, precargar el form, `PUT` al guardar | `TaskFormPage.jsx` |
| 6 | Context | `TasksContext` + `TasksProvider`; `ProgressBar` y `AssigneesChart` leen las tareas del contexto | `context/TasksContext.js` + `context/TasksProvider.jsx`, `ProgressBar.jsx`, `AssigneesChart.jsx`, `App.jsx`, `main.jsx` |

### Tabla de rutas

| Ruta | Componente | Qué muestra |
|------|-----------|-------------|
| `/` | `BoardPage` | Tablero con 3 columnas + gráfico por persona |
| `/tasks/new` | `TaskFormPage` (sin `id`) | Formulario vacío, al guardar hace `POST` |
| `/tasks/:id/edit` | `TaskFormPage` (con `id`) | Formulario precargado, al guardar hace `PUT` |

`Navbar` (con `ProgressBar` adentro) está fuera de `<Routes>`, así que se ve en
todas las páginas.

---

## 2. Cómo correrlo (difiere: json-server aparte)

`npm install` y dos terminales: `npm run server` (json-server `BE/db.json` en **3001**) y `npm run dev` (Vite 5173); o `npm start` levanta las dos con `concurrently`.
API: `http://localhost:3001/tasks`. json-server 1.x avisa que `--watch` es redundante, pero arranca igual.
Resto: [README principal](../../README.md#cómo-correr-cada-cosa).

---

## 3. Archivos tocados / creados

| Archivo | Estado | Qué hace | Ejercicio |
|---------|--------|----------|-----------|
| `src/services/taskService.js` | modificado | Puerto **3000 → 3001**. Funciones `getTasks`, `getTask`, `createTask` (POST), `updateTask` (PUT), `deleteTask` (DELETE), todas con `fetch` + `response.ok` | 2, 4, 5 |
| `src/context/TasksContext.js` + `TasksProvider.jsx` | **creado** | `TasksContext` (createContext, en `.js`) y `TasksProvider` (en `.jsx`; separados para que el lint no avise) (componente con `useState([])` que expone `{ tasks, setTasks }` a `props.children`) | 6 |
| `src/main.jsx` | modificado | Envuelve `<App />` con `<TasksProvider>` | 6 |
| `src/App.jsx` | modificado | Saca `tasks/setTasks` del contexto con `useContext` (antes era un `useState` local), define `handleSave`, agrega las rutas `/tasks/new` y `/tasks/:id/edit` | 3, 6 |
| `src/components/Board/Board.jsx` | modificado | `map` de columnas → `filter` por estado → `map` de `TaskCard`. Ternario: si `columnTasks.length === 0` muestra "Sin tareas". Pasa `onStatusChange` y `onDelete` a cada tarjeta | 1 |
| `src/pages/BoardPage/BoardPage.jsx` | modificado | `useEffect(..., [])` que llama `getTasks()` con `loading`/`error`; `handleStatusChange` (find → copia con spread → PUT → map); `handleDelete` (confirm → DELETE → filter) | 2 |
| `src/components/ProgressBar/ProgressBar.jsx` | modificado | `useContext(TasksContext)` en vez del `const tasks = []` de la plantilla | 6 |
| `src/components/AssigneesChart/AssigneesChart.jsx` | modificado | `useContext(TasksContext)`; el `reduce` de la plantilla se reescribió con `for...of` (y se dejó comentada la versión con `reduce`) | 6 |
| `src/components/Navbar/Navbar.jsx` | modificado | Ya no recibe `tasks` por props (no las usaba); `ProgressBar` lee del contexto | 6 |
| `src/components/TaskCard/TaskCard.jsx` | comentado | Venía hecho. Solo se agregaron comentarios | 1 |
| `src/pages/TaskFormPage/TaskFormPage.jsx` | modificado | Venía casi hecho. Se reescribió el `.then().catch()` con `async/await + try/catch`, `handleChange` sin destructuring, y se comentó todo (validación bonus incluida) | 4, 5 |

No se creó ningún componente nuevo aparte del contexto, así que no hizo falta
ningún `.module.css` nuevo. Todos los estilos ya existían en la plantilla y
se respetó CSS Modules (`import styles from './X.module.css'`).

---

## 4. Dónde estaba lo difícil (trampas de ESTE parcial)

### Trampa 1: puerto 3000 vs 3001
- `package.json` → `npm run server` levanta json-server en **3001**.
- `README.md` ejercicio 2 → dice **3001**, pero las "Notas técnicas" dicen **3000**.
- `taskService.js` (plantilla) → apuntaba a **3000**.

Sin corregir: `TypeError: Failed to fetch` y el tablero muestra el error. El puerto real es el del script
`server` del `package.json` → `API_URL = "http://localhost:3001/tasks"`.

### Trampa 2: ids STRING
json-server 1.x guarda `"id": "4"` y al hacer POST genera ids tipo `"QqR8tAYZJTw"`; `useParams()` también da
string → `tarea.id === id` funciona. **NO** `Number(id)`: `Number("QqR8tAYZJTw")` es `NaN`.

### Trampa 3: `updateTask` es PUT (reemplaza todo)
`handleStatusChange` primero busca la tarea con `find`, la copia con spread (`{ ...tarea, status: nuevo }`) y
recién ahí hace el PUT; mandar solo `{ status }` borraría título, descripción, etc. → [tema 11](../../clase/11-api-fetch.md).

### Trampa 4: dónde vive el estado global
La plantilla tenía `useState([])` en `App`, pero `ProgressBar` y `AssigneesChart` tenían `const tasks = []`
hardcodeado. Si cada uno hiciera su `getTasks()` habría **copias distintas** (creás una tarea y la barra no cambia).
Solución: una sola fuente en `TasksProvider`. El Provider va en `main.jsx` porque `App` también hace `useContext`
(para `handleSave`): un componente no puede consumir un contexto que él mismo renderiza. (Context: [tema 16](../../clase/16-context.md).)

### Trampa 5: limitación conocida al recargar en `/tasks/new`
El `getTasks()` está en `BoardPage` (así lo pide el TODO): si recargás en `/tasks/new`, la `ProgressBar` muestra
`0/0` hasta volver al tablero. Alternativa (no pedida): el `useEffect` con `getTasks()` dentro del `TasksProvider`.

### Trampa 6: `TaskFormPage` avisa a `App` con `onSave`
Después del `await` del POST/PUT: `onSave(tareaGuardada, isEditing)` (App actualiza la lista sin volver a pedirla:
crear → spread, editar → `map`) y recién ahí `navigate('/')`.

### Trampa 7: `onDelete` no estaba cableado
`TaskCard` ya llamaba `onDelete(task.id)` pero ni `Board` ni `BoardPage` lo pasaban. Hubo que crear `handleDelete`
en `BoardPage` y pasarlo por `Board`.

---

## 5. Conceptos clave

- Crear/editar con el mismo form (`Boolean(id)`, un `handleChange` con `[name]`) → [tema 8](../../clase/08-formularios-controlados.md) §8.4–8.5.
- CRUD sobre el estado (spread / `filter` / `map`) → [tema 7](../../clase/07-usestate.md) §7.5.
- GET al montar con `useEffect([])`; editar con `useEffect([id])` → [tema 10](../../clase/10-useeffect.md).
- Service con `fetch` + `response.ok`, PUT vs POST → [tema 11](../../clase/11-api-fetch.md).
- Barra de progreso (porcentaje calculado) → [tema 9](../../clase/09-estado-derivado.md).
- `reduce` reescrito con `for...of` (`AssigneesChart.jsx`) → [tema 2](../../clase/02-javascript-para-react.md).
- Rutas + `useParams`/`useNavigate` ([tema 13](../../clase/13-router-rutas.md), [tema 14](../../clase/14-useparams-usenavigate.md)); Context ([tema 16](../../clase/16-context.md)); CSS Modules + `style` inline de la barra ([tema 18](../../clase/18-css-modules-y-lint.md)).
