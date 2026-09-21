# Apuntes — Prueba 2 2026 Sem1 Vespertino (Trello App)

Resolución comentada de la prueba. El enunciado original está en `README.md`
(no se modificó). Las pantallas están en `Screens.png`.

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
| 6 | Context | `TasksContext` + `TasksProvider`; `ProgressBar` y `AssigneesChart` leen las tareas del contexto | `context/TasksContext.jsx`, `ProgressBar.jsx`, `AssigneesChart.jsx`, `App.jsx`, `main.jsx` |

### Tabla de rutas

| Ruta | Componente | Qué muestra |
|------|-----------|-------------|
| `/` | `BoardPage` | Tablero con 3 columnas + gráfico por persona |
| `/tasks/new` | `TaskFormPage` (sin `id`) | Formulario vacío, al guardar hace `POST` |
| `/tasks/:id/edit` | `TaskFormPage` (con `id`) | Formulario precargado, al guardar hace `PUT` |

`Navbar` (con `ProgressBar` adentro) está fuera de `<Routes>`, así que se ve en
todas las páginas.

---

## 2. Cómo correrlo

```bash
npm install
```

Dos terminales:

```bash
# Terminal 1 — API (json-server) en el puerto 3001
npm run server        # = json-server --watch BE/db.json --port 3001

# Terminal 2 — frontend (vite) en el puerto 5173
npm run dev
```

- API: `http://localhost:3001/tasks`
- App: `http://localhost:5173`

Nota: json-server 1.x avisa que `--watch` es redundante ("JSON Server 1+
watches for file changes by default") pero arranca igual, no hace falta
cambiar el script.

---

## 3. Archivos tocados / creados

| Archivo | Estado | Qué hace | Ejercicio |
|---------|--------|----------|-----------|
| `src/services/taskService.js` | modificado | Puerto **3000 → 3001**. Funciones `getTasks`, `getTask`, `createTask` (POST), `updateTask` (PUT), `deleteTask` (DELETE), todas con `fetch` + `response.ok` | 2, 4, 5 |
| `src/context/TasksContext.jsx` | **creado** | `TasksContext` (createContext) y `TasksProvider` (componente con `useState([])` que expone `{ tasks, setTasks }` a `props.children`) | 6 |
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

## 4. Dónde estaba lo difícil (trampas)

### Trampa 1: puerto 3000 vs 3001
- `package.json` → `npm run server` levanta json-server en **3001**.
- `README.md` ejercicio 2 → dice **3001**, pero las "Notas técnicas" dicen **3000**.
- `taskService.js` (plantilla) → apuntaba a **3000**.

Si no se corrige, el `fetch` falla con `TypeError: Failed to fetch` y el
tablero muestra el error. **Siempre mirar el script `server` del
`package.json`: ese es el puerto real.** Solución: `API_URL = "http://localhost:3001/tasks"`.

### Trampa 2: los ids son STRING
json-server 1.x guarda `"id": "4"` (string) y al hacer POST genera ids tipo
`"QqR8tAYZJTw"`. `useParams()` también devuelve string. Por eso:
- Comparar con `tarea.id === id` funciona (string con string).
- **NO** convertir a `Number(id)`: `Number("QqR8tAYZJTw")` es `NaN` y nunca
  matchea.

### Trampa 3: PUT vs PATCH
- `PUT /tasks/:id` **reemplaza el objeto entero**: hay que mandar todos los
  campos (`{ ...tarea, status: nuevo }`), si mandás solo `{ status }` perdés
  título, descripción, etc.
- `PATCH /tasks/:id` modifica solo los campos enviados.
La plantilla trae `updateTask` con PUT, por eso `handleStatusChange` primero
busca la tarea con `find`, la copia con spread y recién ahí hace el PUT.

### Trampa 4: dónde vive el estado global
La plantilla tenía `useState([])` en `App` y le pasaba `tasks` a `Navbar` y a
`BoardPage`, pero `ProgressBar` y `AssigneesChart` tenían `const tasks = []`
hardcodeado. Si cada componente hace su propio `getTasks()` termina con
**copias distintas** de la lista: creás una tarea y la barra de progreso no
cambia. Solución: **una sola fuente de verdad** en `TasksProvider`; todos
leen `useContext(TasksContext)` y `setTasks` es el único que la modifica.

El Provider va en `main.jsx` (envolviendo `<App />`) porque `App` mismo
necesita `useContext` para `handleSave`: un componente no puede consumir un
contexto que él mismo renderiza.

### Trampa 5: limitación conocida al recargar en `/tasks/new`
Como el `getTasks()` está en `BoardPage` (así lo pide el TODO), si recargás
la página estando en `/tasks/new` la `ProgressBar` muestra `0/0` hasta volver
al tablero. Alternativa (no pedida): mover el `useEffect` con `getTasks()`
adentro del `TasksProvider`, así se carga una vez sin importar la ruta.

### Trampa 6: redirigir después de guardar
`navigate('/')` después del `await` del POST/PUT. Si lo ponés antes del
`await`, navegás sin haber guardado. Y `TaskFormPage` avisa a `App` con
`onSave(tareaGuardada, isEditing)` para actualizar la lista sin volver a
pedirla a la API.

### Trampa 7: formulario controlado con un solo `handleChange`
Cada `<input name="title">` tiene `name` igual a la clave del objeto `form`.
`setForm({ ...form, [name]: value })` usa **clave calculada** `[name]`:
copia el objeto y pisa solo ese campo. Un solo handler para 4 inputs.

### Trampa 8: `onDelete` no estaba cableado
`TaskCard` ya llamaba `onDelete(task.id)` pero ni `Board` ni `BoardPage` lo
pasaban. Hubo que crear `handleDelete` en `BoardPage` y pasarlo por `Board`.

### Trampa 9: CSS Modules
`import styles from './Board.module.css'` y `className={styles.column}`.
Si escribís `className="column"` no aplica nada porque Vite renombra las
clases (`Board_column_x1y2z`).

---

## 5. Lo más importante para repetir en el parcial

### Service con fetch (GET / POST / PUT / DELETE)
```js
const API_URL = "http://localhost:3001/tasks";

export async function getTasks() {
  const response = await fetch(API_URL);
  if (!response.ok) throw new Error("Error al obtener las tareas");
  return response.json();
}
export async function createTask(task) {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(task),
  });
  if (!response.ok) throw new Error("Error al crear");
  return response.json();
}
export async function updateTask(id, task) {   // PUT = objeto completo
  const response = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(task),
  });
  if (!response.ok) throw new Error("Error al actualizar");
  return response.json();
}
export async function deleteTask(id) {
  const response = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
  if (!response.ok) throw new Error("Error al eliminar");
}
```

### Provider de contexto
```jsx
import { createContext, useState } from 'react';

export const TasksContext = createContext({ tasks: [], setTasks: function () {} });

export function TasksProvider(props) {
  const [tasks, setTasks] = useState([]);
  return (
    <TasksContext.Provider value={{ tasks: tasks, setTasks: setTasks }}>
      {props.children}
    </TasksContext.Provider>
  );
}
// main.jsx:  <TasksProvider><App /></TasksProvider>
// consumidor: const contexto = useContext(TasksContext); contexto.tasks
```

### Cargar lista al montar (useEffect + loading/error)
```jsx
useEffect(() => {
  async function cargar() {
    setLoading(true);
    try {
      const datos = await getTasks();
      setTasks(datos);
    } catch (errorCapturado) {
      setError(errorCapturado.message);
    } finally {
      setLoading(false);
    }
  }
  cargar();
}, []); // [] = solo al montar
```

### useParams + useEffect para cargar UN registro
```jsx
const { id } = useParams();           // string, o undefined si no hay :id
const isEditing = Boolean(id);

useEffect(() => {
  async function cargarTarea() {
    const tarea = await getTask(id);
    setForm({ title: tarea.title, description: tarea.description, ... });
  }
  if (isEditing) cargarTarea();
}, [id]);
```

### Formulario controlado + useNavigate tras submit
```jsx
const navigate = useNavigate();

function handleChange(evento) {
  const name = evento.target.name;
  const value = evento.target.value;
  setForm({ ...form, [name]: value });
}

async function handleSubmit(evento) {
  evento.preventDefault();
  if (!form.title.trim()) { setError('El título es obligatorio.'); return; }
  try {
    const guardada = isEditing
      ? await updateTask(id, { ...form, id: id })
      : await createTask(form);
    onSave(guardada, isEditing);
    navigate('/');
  } catch (errorCapturado) {
    setError('Error al guardar.');
  }
}
```

### Actualizar la lista sin volver a pedirla
```jsx
// crear:   setTasks([...tasks, nueva]);
// editar:  setTasks(tasks.map((t) => (t.id === editada.id ? editada : t)));
// borrar:  setTasks(tasks.filter((t) => t.id !== id));
```

### Rutas
```jsx
<BrowserRouter>
  <Navbar />
  <Routes>
    <Route path="/" element={<BoardPage />} />
    <Route path="/tasks/new" element={<TaskFormPage onSave={handleSave} />} />
    <Route path="/tasks/:id/edit" element={<TaskFormPage onSave={handleSave} />} />
  </Routes>
</BrowserRouter>
```

---

## 6. Plan de ataque (2 horas, con 5/6 alcanza el 100%)

1. **(5 min) Leer todo antes de escribir.** `package.json` (puerto del script
   `server`), `db.json` (forma de los datos: `id` string, `assignee` puede
   faltar), `taskService.js`, todos los TODOs. Corregir el puerto en el
   service YA. Levantar json-server y vite y comprobar `/tasks` en el
   navegador.
2. **(15 min) Ejercicio 2 — GET en BoardPage.** Sin datos no se ve nada de
   lo demás. `useEffect` + `getTasks` + `setTasks`. Verificar en consola /
   Network que llega el array.
3. **(15 min) Ejercicio 1 — Board.** `map` de columnas ya venía; agregar el
   `map` de `TaskCard`, el mensaje "Sin tareas", pasar `onStatusChange` y
   `onDelete`. Ya se ve el tablero completo.
4. **(10 min) Ejercicio 3 — rutas.** Dos `<Route>` con `TaskFormPage`.
   Probar que `+ Nueva Tarea` y el lápiz navegan.
5. **(20 min) Ejercicios 4 y 5 — formulario.** La plantilla ya trae casi
   todo: revisar `handleChange`, `handleSubmit`, `useEffect([id])`.
   Probar crear y editar de verdad mirando `db.json`.
6. **(20 min) Ejercicio 6 — Context.** Crear `TasksContext.jsx`, envolver en
   `main.jsx`, reemplazar el `useState` de `App` por `useContext`, y en
   `ProgressBar` / `AssigneesChart` cambiar `const tasks = []` por el
   contexto. Probar: crear una tarea `Done` con persona → la barra y el
   gráfico cambian.
7. **(10 min) `handleStatusChange` y `handleDelete`** en BoardPage (son parte
   del ejercicio 2 según el TODO). Probar cambiar un select y borrar.
8. **(resto) Repasar:** consola sin errores, recargar la página en `/` y ver
   que todo sigue, `npm run build` sin errores, comentarios.

Si te trancás en el 6 (Context), con 1-5 bien hechos ya tenés el 100%. Pero
el 6 es el más "copiable": son 15 líneas de Provider + `useContext` en 3
componentes.
