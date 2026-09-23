# 09 — Patrones de parcial: qué se pide, plan de ataque, esqueleto para copiar y las 25 trampas

> Este es el archivo estratégico. Si solo podés leer uno la noche anterior, es este.
> Todo lo que hay acá salió de resolver los 6 parciales/simulacros de segundo
> parcial de `ucu-fit-dwym/historial-pruebas` (carpeta `P2/parciales/`).

---

## (a) Qué se pidió cada año

| Prueba | Carpeta | Formato | Router | Fetch | Context | Formulario | Azar / juego | CSS Modules |
|---|---|---|---|---|---|---|---|---|
| **Prueba 2 2026 sem1** (Trello) | `parciales/2026sem1-prueba2-vespertino` | plantilla con TODOs, 6 ej., json-server | `/`, `/tasks/new`, `/tasks/:id/edit` | GET/POST/PUT/DELETE a json-server | **sí** (ej. 6: `TasksContext`, lo leen ProgressBar y AssigneesChart) | crear + editar (misma página) | no | **sí, exigido** |
| **Simulacro 2026 sem1** (BarApp) | `parciales/2026sem1-simulacro-vespertino` | plantilla con TODOs, 6 puntos, json-server | `/cuentas`, `/cuentas/nueva` (faltaban) | GET/POST | **sí** (punto 5: total recaudado en la NavBar) | crear cuenta + redirigir | no | sí (venía en la plantilla) |
| **Parcial 2 2025 sem2 matutino** (países + 3 selects) | `parciales/2025sem2-parcial2-matutino` | app desde casi cero, mock API en Vite | `/`, `/country/:cca3` | GET con query string combinado | no | 3 `<select>` controlados | no | no |
| **Parcial 2 2025 sem2 vespertino** (países, 9 rutas) | `parciales/2025sem2-parcial2-vespertino` | ídem | **9 rutas**, 6 con parámetro | GET | no | no | no | no |
| **Simulacro 2025 sem2 matutino** (trivia mapa→bandera) | `parciales/2025sem2-simulacro-matutino` | ídem | `/`, `/country/:cca3` | GET | sí (puntaje que sobrevive al navegar) | no | **sí** (elegir 4, mezclar) | no |
| **Simulacro 2025 sem2 vespertino** (viaje por fronteras) | `parciales/2025sem2-simulacro-vespertino` | ídem | `/`, `/:cca3`, `/end` | GET | **sí** (errores, visitados, dificultad) | no | **sí** (9 opciones, "Ninguno") | no |

Lo que aparece **siempre**: `BrowserRouter/Routes/Route`, `Link`, `useParams`,
`useNavigate`, `useEffect` + `fetch` con loading/error, `map` con `key`.
Lo que aparece **casi siempre**: Context (5 de 6), formulario controlado (3 de 6),
página de detalle por parámetro (6 de 6).

---

## (b) Los dos formatos posibles

### Formato 2026 — el más probable (es el más reciente y lo dieron dos veces)

- Te dan una **plantilla que ya anda a medias**: componentes con `// TODO`, un
  `services/taskService.js` o `api/client.js` con los fetch (algunos vacíos),
  `db.json` en `BE/`, `.module.css` ya hechos, `Screens.png` con el croquis.
- **6 ejercicios de igual valor. Con 5 de 6 se obtiene el 100%.** Los
  ejercicios son siempre parecidos: (1) renderizar listas/columnas, (2) GET a
  json-server, (3) completar rutas, (4) formulario POST, (5) editar con
  `useParams` + PUT, (6) **Context** para algo global (progreso, total).
- Se entrega por PR al repo original.
- Cosas que **exigen** en el enunciado: CSS Modules por componente, estructura
  de carpetas, `map` para listas, centralizar HTTP en el service.

### Formato 2025 — el alternativo

- Plantilla mínima: `App.jsx` con un router de ejemplo, `Home.jsx` vacío,
  `ApiRef.jsx` (referencia de la API), `index.css` vacío. La API es un
  **plugin de Vite** (`web/data/mock-routes.js`) en el mismo puerto.
- Piden una app entera (2 a 9 rutas) desde cero. No hay ejercicios numerados:
  se evalúa que **todas las rutas funcionen** y que reutilices componentes.
- Datos de países con estructura rebuscada (objetos vs arrays) y a veces
  lógica de juego (azar).

---

## (c) Plan de ataque de 2 horas

### Formato 2026 (plantilla + 6 ejercicios)

| Minuto | Qué hacer | Por qué en este orden |
|---|---|---|
| 0–10 | Setup (`08-SETUP-VITE-Y-ENTORNO.md` §7): install, leer README entero, `grep -rn TODO src/`, mirar `db.json`, **unificar puertos**, levantar los dos servers, probar la API con curl/navegador. | Sin API nada se ve. El puerto fue trampa en ambas pruebas 2026. |
| 10–30 | **Ej. 2 (GET) + Ej. 1 (render)**: `useEffect(..., [])` que llama al service, `loading`/`error`, `map` de tarjetas por columna/lista. | Es lo que hace que "se vea todo". Base de los demás. |
| 30–40 | **Ej. 3 (rutas)**: agregar `<Route>` que faltan, `Link` a `/x/new`, `<Navigate>` para `/`. | 10 líneas. Puntos fáciles. |
| 40–65 | **Ej. 4 (crear)**: formulario controlado con un `handleChange` por `[name]`, `preventDefault`, validación, `await service.crear(...)`, actualizar lista o `recargar()`, `navigate('/lista')`. | Segundo ejercicio "grande". Probar de verdad contra json-server. |
| 65–85 | **Ej. 5 (editar)**: misma página con `const isEditing = Boolean(id)`, `useEffect([id])` que hace GET y precarga el form, PUT al guardar. | Reusa el 4. Si el 4 anda, esto son 20 líneas. |
| 85–105 | **Ej. 6 (Context)**: crear `context/XContext.jsx` con `createContext` + `XProvider` (`useState` + `props.children`), envolver `<App>` en `main.jsx`, reemplazar `const tasks = []` por `useContext`. | Son ~25 líneas si sabés el patrón. Dejarlo para el final solo porque toca varios archivos. |
| 105–120 | **Verificación** (sección f) + PR. Estilos SOLO si sobra tiempo. | Un ejercicio que funciona vale más que seis medio hechos. |

Si algo no sale en 15 minutos: **pasar al siguiente** (5/6 = 100%).

### Formato 2025 (app desde cero)

| Minuto | Qué hacer |
|---|---|
| 0–10 | Setup. Leer `mock-routes.js` y los primeros 60 líneas de `data.json`: anotar qué es objeto y qué es array. Probar `/api/countries` y `/api/countries/URY` en el navegador. |
| 10–20 | `services/api.js` con `obtenerJson(url)` genérico + una función por endpoint. |
| 20–35 | `App.jsx` con **todas** las rutas del enunciado apuntando a componentes vacíos (`<h1>Ruta X</h1>`). Navegar por todas. |
| 35–60 | La lista principal (`useEffect` + `map` + `Link` al detalle). Si la lista devuelve solo códigos → `ItemPais` con fetch propio. |
| 60–80 | La página de detalle (`useParams`, `useEffect([cca3])`, `Object.keys` para objetos, botón volver). |
| 80–105 | Las rutas "derivadas" (filtros, listas por moneda…) **reutilizando** el componente de lista con `props.titulo` + `props.url`. Si hay juego: `utils/azar.js` + estado en Context. |
| 105–120 | Recargar en cada ruta, consola limpia, estilos mínimos (grilla + tarjeta), PR. |

---

## (d) Esqueleto completo para copiar

Todo esto está sacado de las soluciones reales (rutas al lado de cada bloque)
y sigue la guía de estilo (`function`, nombres en español, sin `&&`).

### d.1 `main.jsx` con Provider + `App.jsx` con Router

```jsx
// src/main.jsx  (real: parciales/2026sem1-prueba2-vespertino/src/main.jsx)
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import { TasksProvider } from './context/TasksContext.jsx';
import './index.css';

// El Provider va ACÁ (afuera de App) porque App también hace useContext.
// Un componente NO puede consumir un contexto que él mismo renderiza.
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <TasksProvider>
      <App />
    </TasksProvider>
  </React.StrictMode>
);
```

```jsx
// src/App.jsx  (real: parciales/2026sem1-prueba2-vespertino/src/App.jsx, resumido)
import { useContext } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar/Navbar';
import BoardPage from './pages/BoardPage/BoardPage';
import TaskFormPage from './pages/TaskFormPage/TaskFormPage';
import { TasksContext } from './context/TasksContext';

function App() {
  // La lista vive en el contexto; App solo la lee para handleSave.
  const contexto = useContext(TasksContext);
  const tasks = contexto.tasks;
  const setTasks = contexto.setTasks;

  // La llama el formulario después de guardar (POST o PUT).
  function handleSave(savedTask, isEditing) {
    if (isEditing) {
      // map devuelve un array NUEVO con esa tarea reemplazada.
      const listaActualizada = tasks.map((tarea) =>
        tarea.id === savedTask.id ? savedTask : tarea
      );
      setTasks(listaActualizada);
    } else {
      // spread: copia + la nueva al final.
      setTasks([...tasks, savedTask]);
    }
  }

  return (
    <BrowserRouter>
      {/* Fuera de <Routes>: se ve en todas las páginas */}
      <Navbar />
      <Routes>
        <Route path="/" element={<BoardPage />} />
        <Route path="/tasks/new" element={<TaskFormPage onSave={handleSave} />} />
        <Route path="/tasks/:id/edit" element={<TaskFormPage onSave={handleSave} />} />
        {/* Redirección y 404 (de Ejers/UT5 y BarApp) */}
        <Route path="/inicio" element={<Navigate to="/" replace />} />
        <Route path="*" element={<p>Página no encontrada</p>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
```

### d.2 `services/api.js` — GET / POST / PUT / DELETE

```js
// src/services/taskService.js  (real: parciales/2026sem1-prueba2-vespertino/src/services/taskService.js)

// ¡Unificar con el puerto del script que levanta json-server!
const API_URL = "http://localhost:3001/tasks";

// GET /tasks -> array con todas las tareas.
export async function getTasks() {
  const response = await fetch(API_URL);
  // fetch NO lanza error con 404/500: lo lanzamos nosotros.
  if (!response.ok) throw new Error("Error al obtener las tareas");
  return response.json();
}

// GET /tasks/:id -> UNA tarea.
export async function getTask(id) {
  const response = await fetch(`${API_URL}/${id}`);
  if (!response.ok) throw new Error("Tarea no encontrada");
  return response.json();
}

// POST /tasks -> crea. json-server le pone el id (string) y devuelve el objeto.
export async function createTask(task) {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(task),
  });
  if (!response.ok) throw new Error("Error al crear la tarea");
  return response.json();
}

// PUT /tasks/:id -> REEMPLAZA la tarea completa (mandar TODOS los campos).
export async function updateTask(id, task) {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(task),
  });
  if (!response.ok) throw new Error("Error al actualizar la tarea");
  return response.json();
}

// DELETE /tasks/:id -> borra. No devuelve nada útil.
export async function deleteTask(id) {
  const response = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
  if (!response.ok) throw new Error("Error al eliminar la tarea");
}
```

Variante 2025 con función genérica (`parciales/2025sem2-parcial2-vespertino/web/src/services/api.js`):
`export async function obtenerJson(url) { const respuesta = await fetch(url); if (!respuesta.ok) { throw new Error('Error ' + respuesta.status); } return await respuesta.json(); }`

### d.3 Página de LISTA con useEffect / loading / error

```jsx
// Real: parciales/2025sem2-parcial2-vespertino/web/src/components/ListaDePaises.jsx
// (reutilizable: recibe props.titulo y props.url)
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { obtenerJson } from '../services/api';
import ItemPais from './ItemPais';

function ListaDePaises(props) {
  const [codigosDePaises, setCodigosDePaises] = useState([]);
  const [estaCargando, setEstaCargando] = useState(true);
  const [mensajeDeError, setMensajeDeError] = useState('');

  // Dependencia [props.url]: si se navega de /currencies/EUR a /currencies/USD
  // React Router REUTILIZA este componente; sin la dependencia queda la lista vieja.
  useEffect(() => {
    async function cargarPaises() {
      setEstaCargando(true);
      try {
        const codigos = await obtenerJson(props.url);
        setCodigosDePaises(codigos);
        setMensajeDeError('');
      } catch (error) {
        setMensajeDeError('No se pudo cargar la lista de países.');
      }
      setEstaCargando(false);
    }
    cargarPaises();
  }, [props.url]);

  // Qué mostrar, con if/else (sin &&).
  let contenido;
  if (mensajeDeError !== '') {
    contenido = <p className="mensaje-error">{mensajeDeError}</p>;
  } else if (estaCargando) {
    contenido = <p>Cargando países...</p>;
  } else if (codigosDePaises.length === 0) {
    contenido = <p>No hay países para mostrar.</p>;
  } else {
    contenido = (
      <ul className="lista">
        {codigosDePaises.map((cca3) => (
          <ItemPais key={cca3} cca3={cca3} />
        ))}
      </ul>
    );
  }

  return (
    <div className="pagina">
      <h1>{props.titulo}</h1>
      {contenido}
      <Link to="/">Back to home</Link>
    </div>
  );
}

export default ListaDePaises;
```

Y el "envoltorio" que lee el parámetro y reutiliza la lista
(`parciales/2025sem2-parcial2-vespertino/web/src/components/PaisesPorMoneda.jsx`):

```jsx
function PaisesPorMoneda() {
  const parametros = useParams();
  const codigoDeMoneda = parametros.currencyCode;
  const url = '/api/countries?currency=' + encodeURIComponent(codigoDeMoneda);
  return <ListaDePaises titulo={'Countries with currency ' + codigoDeMoneda} url={url} />;
}
```

### d.4 Página de DETALLE con useParams

```jsx
// Real: Ejers/UT5/UT5.1.1-paises-router/src/paginas/DetalleDePais.jsx (resumido)
import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { obtenerPaisPorCodigo } from '../servicios/api.js';

function DetalleDePais() {
  // La clave es el nombre puesto en la ruta: "/countries/:cca2" -> parametros.cca2
  const parametros = useParams();
  const cca2 = parametros.cca2;
  const navegar = useNavigate();

  const [pais, setPais] = useState(null);
  const [estaCargando, setEstaCargando] = useState(true);
  const [mensajeError, setMensajeError] = useState('');

  // [cca2]: de /countries/UY a /countries/AR el componente NO se desmonta.
  useEffect(function () {
    async function cargarPais() {
      setEstaCargando(true);
      setMensajeError('');
      try {
        const paisDeLaApi = await obtenerPaisPorCodigo(cca2);
        setPais(paisDeLaApi);
      } catch (error) {
        setMensajeError(error.message);   // incluye el 404
      } finally {
        setEstaCargando(false);
      }
    }
    cargarPais();
  }, [cca2]);

  function manejarClickVolver() {
    navegar(-1);   // como el botón "atrás"
  }

  if (estaCargando) {
    return <p>Cargando país...</p>;
  }
  if (mensajeError !== '') {
    return (
      <div>
        <p className="mensaje-error">{mensajeError}</p>
        <Link to="/countries">Ir a la lista de países</Link>
      </div>
    );
  }

  return (
    <div className="detalle">
      <h1>{pais.name}</h1>
      <img className="bandera-grande" src={pais.flags.png} alt={'Bandera de ' + pais.name} />
      <p>Capital: {pais.capital}</p>
      <ul>
        {pais.languages.map((idioma) => (
          <li key={idioma.name}>{idioma.name}</li>
        ))}
      </ul>
      <button className="boton" onClick={manejarClickVolver}>Volver</button>
    </div>
  );
}

export default DetalleDePais;
```

Si los datos son **objetos** (parciales 2025: `currencies`, `languages`, `name.nativeName`):
```jsx
// parciales/2025sem2-parcial2-matutino/web/src/components/PaginaPais.jsx
const codigosDeMoneda = Object.keys(pais.currencies);       // ["UYU"]
const textos = [];
for (const codigo of codigosDeMoneda) {
  const moneda = pais.currencies[codigo];                    // { name, symbol }
  textos.push(moneda.name + ' (' + moneda.symbol + ')');
}
// textos.join(', ')   -> "Uruguayan peso ($)"
```

### d.5 Página FORMULARIO crear/editar (un solo `handleChange` + `useNavigate`)

```jsx
// Real: parciales/2026sem1-prueba2-vespertino/src/pages/TaskFormPage/TaskFormPage.jsx (resumido)
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getTask, createTask, updateTask } from '../../services/taskService';

function TaskFormPage(props) {
  const onSave = props.onSave;
  const { id } = useParams();            // "7" en /tasks/7/edit, undefined en /tasks/new
  const navigate = useNavigate();
  const isEditing = Boolean(id);         // decide GET previo + PUT vs POST

  // UN objeto con todos los campos; cada input tiene name = clave.
  const [form, setForm] = useState({ title: '', description: '', status: 'To Do', assignee: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Modo edición: cargar la tarea y precargar el formulario.
  useEffect(() => {
    async function cargarTarea() {
      setLoading(true);
      try {
        const tarea = await getTask(id);
        setForm({
          title: tarea.title,
          description: tarea.description,
          status: tarea.status,
          assignee: tarea.assignee ? tarea.assignee : '',
        });
      } catch (errorCapturado) {
        setError('No se encontró la tarea.');
      } finally {
        setLoading(false);
      }
    }
    if (isEditing) {
      cargarTarea();
    }
  }, [id]);

  // UN solo handler: usa el atributo name del input como clave calculada.
  function handleChange(evento) {
    const name = evento.target.name;
    const value = evento.target.value;
    setForm({ ...form, [name]: value });
  }

  async function handleSubmit(evento) {
    evento.preventDefault();             // sin esto el navegador recarga la página
    setError('');
    if (!form.title.trim()) {            // validación (bonus)
      setError('El título es obligatorio.');
      return;
    }
    try {
      let tareaGuardada;
      if (isEditing) {
        tareaGuardada = await updateTask(id, { ...form, id: id });   // PUT: objeto completo
      } else {
        tareaGuardada = await createTask(form);                        // POST
      }
      onSave(tareaGuardada, isEditing);  // actualizar la lista global
      navigate('/');                     // DESPUÉS del await
    } catch (errorCapturado) {
      setError('Error al guardar la tarea. Intentá de nuevo.');
    }
  }

  if (loading) {
    return <p>Cargando tarea...</p>;
  }

  return (
    <form onSubmit={handleSubmit}>
      {error ? <p className="error">{error}</p> : null}
      <label>
        Título
        <input type="text" name="title" value={form.title} onChange={handleChange} />
      </label>
      <label>
        Estado
        <select name="status" value={form.status} onChange={handleChange}>
          {['To Do', 'In Progress', 'Done'].map((estado) => (
            <option key={estado} value={estado}>{estado}</option>
          ))}
        </select>
      </label>
      <button type="submit">{isEditing ? 'Guardar cambios' : 'Crear tarea'}</button>
      <button type="button" onClick={() => navigate('/')}>Cancelar</button>
    </form>
  );
}

export default TaskFormPage;
```

⚠️ Inputs numéricos devuelven **string**: `precio: Number(form.precio)` antes del POST
(ver `parciales/2026sem1-simulacro-vespertino/src/pages/NuevoProductoPage.jsx`).

### d.6 Provider de contexto (lista global) — ~25 líneas

```jsx
// Real: parciales/2026sem1-prueba2-vespertino/src/context/TasksContext.jsx
import { createContext, useState } from 'react';

// Valor por defecto con la MISMA forma, para que no explote fuera del Provider.
export const TasksContext = createContext({
  tasks: [],
  setTasks: function () {},
});

export function TasksProvider(props) {
  const [tasks, setTasks] = useState([]);

  const valorDelContexto = {
    tasks: tasks,
    setTasks: setTasks,
  };

  return (
    <TasksContext.Provider value={valorDelContexto}>
      {props.children}
    </TasksContext.Provider>
  );
}
```

Consumo en cualquier componente (`.../components/ProgressBar/ProgressBar.jsx`):
```jsx
const contexto = useContext(TasksContext);
const tasks = contexto.tasks;
```

### d.7 Provider "autosuficiente" (carga sus datos y expone `recargar`)

```jsx
// Real: parciales/2026sem1-simulacro-vespertino/src/context/RecaudacionContext.jsx (resumido)
export const RecaudacionContext = createContext({ total: 0, recargar: function () {} });

export function RecaudacionProvider(props) {
  const [total, setTotal] = useState(0);

  async function recargar() {
    try {
      const cuentas = await cuentasApi.listar();
      const productos = await productosApi.listar();
      setTotal(totalRecaudado(cuentas, productos));
    } catch (errorCapturado) {
      setTotal(0);
    }
  }

  // []: una vez al montar el Provider (al cargar la app).
  useEffect(() => {
    recargar();
  }, []);

  return (
    <RecaudacionContext.Provider value={{ total: total, recargar: recargar }}>
      {props.children}
    </RecaudacionContext.Provider>
  );
}
```
Después de crear una cuenta: `await cuentasApi.crear(...)`, `await contexto.recargar()`, `navigate('/cuentas')`.

### d.8 Ruta protegida

```jsx
// Real: Ejers/UT4/TA18-rutas-protegidas/src/componentes/RutaProtegida.jsx
function RutaProtegida(props) {
  const contexto = useContext(ContextoAutenticacion);
  if (!contexto.estaLogueado) {
    return <Navigate to="/" replace />;   // replace: no deja la privada en el historial
  }
  return props.children;
}
// En App: <Route path="/perfil" element={<RutaProtegida><Perfil /></RutaProtegida>} />
```

### d.9 Borrar y cambiar estado (PUT) desde la lista

```jsx
// Real: parciales/2026sem1-prueba2-vespertino/src/pages/BoardPage/BoardPage.jsx
async function handleDelete(id) {
  const confirmado = window.confirm('¿Eliminar esta tarea?');
  if (!confirmado) {
    return;
  }
  try {
    await deleteTask(id);
    const listaSinLaTarea = tasks.filter((tarea) => tarea.id !== id);
    setTasks(listaSinLaTarea);
  } catch (errorCapturado) {
    alert('No se pudo eliminar la tarea: ' + errorCapturado.message);
  }
}
```
Cambio de estado: `find` la tarea → `const tareaModificada = { ...tarea, status: nuevoEstado }` → `await updateTask(id, tareaModificada)` → `map` reemplazando.

### d.10 Azar (trivias 2025)

```js
// Real: parciales/2025sem2-simulacro-matutino/web/src/utils/azar.js
export function elegirAlAzar(lista) {
  const indice = Math.floor(Math.random() * lista.length);
  return lista[indice];
}
export function mezclarArray(lista) {
  const copia = lista.slice();                 // nunca mutar el original
  for (let i = copia.length - 1; i > 0; i = i - 1) {
    const j = Math.floor(Math.random() * (i + 1));
    const temporal = copia[i];
    copia[i] = copia[j];
    copia[j] = temporal;
  }
  return copia;
}
export function elegirVariosDistintos(lista, cantidad, excluidos) {
  const elegidos = [];
  while (elegidos.length < cantidad) {
    const candidato = elegirAlAzar(lista);
    if (!elegidos.includes(candidato) && !excluidos.includes(candidato)) {
      elegidos.push(candidato);
    }
  }
  return elegidos;
}
```

---

## (e) Las 25 trampas más importantes (cómo se detecta → cómo se arregla)

| # | Trampa | Cómo se detecta | Cómo se arregla | Dónde salió |
|---|---|---|---|---|
| 1 | **Puerto del service ≠ puerto del backend** (3000 vs 3001) | Todos los fetch en rojo: `Failed to fetch`, lista vacía | Mirar el script de `package.json`; poner ese puerto en `API_URL`/`BASE` | Trello y BarApp 2026 |
| 2 | **`BE/` sin `package.json`** | `npm install` en BE falla | Crear `BE/package.json` con `json-server db.json --port 3001` | BarApp 2026 |
| 3 | **ids son STRING** en json-server 1.x y en `useParams` | `find` devuelve `undefined`, `===` con número falla | Comparar strings con `===`; no hacer `Number(id)` para tareas | Trello 2026 |
| 4 | **PUT reemplaza todo** | Tras editar, desaparecen campos | Mandar `{ ...objeto, campo: nuevo }` completo (o usar PATCH) | Trello 2026 |
| 5 | **`fetch` no lanza en 404/500** | `pais.name` de `undefined` explota | `if (!respuesta.ok) throw new Error(...)` en el service | Todos |
| 6 | **`useEffect` no puede ser `async`** | Warning "Effect callbacks are synchronous" / no espera | `async function cargar() {...}` adentro y llamarla | Todos |
| 7 | **Dependencias `[]` cuando hay parámetro de ruta** | De `/x/UY` a `/x/AR` sigue mostrando UY | `useEffect(..., [cca3])` / `[props.url]` / `[id]` | UT5, 2025 vesp, simulacros |
| 8 | **Estado que se pierde al cambiar de ruta** | El puntaje vuelve a 0 al volver del detalle | Mover el estado a un Context cuyo Provider envuelve el router | Simulacros 2025 |
| 9 | **Provider adentro del componente que consume** | `useContext` devuelve el default (`null`/`[]`) | Envolver `<App>` en `main.jsx` | Trello, BarApp, UT5.1.2 |
| 10 | **Dos copias de la misma lista** (Navbar y BoardPage con fetch propio) | Progreso no cambia al crear tarea | Una sola fuente: el Provider; los demás `useContext` | Trello 2026 |
| 11 | **`<a href>` en vez de `<Link>`** | Recarga la página; Context y estado vuelven a inicial | `Link`/`NavLink`/`useNavigate` | Todos |
| 12 | **`navigate()` antes del `await`** | Vuelve a la lista sin el nuevo ítem | `await crear()` → `recargar()` → `navigate()` | BarApp 2026 |
| 13 | **Sin `preventDefault` en `onSubmit`** | La página parpadea/recarga y se pierde todo | `evento.preventDefault()` primera línea | Todos los formularios |
| 14 | **Inputs devuelven string** | `precio: "500"` guardado como string; sumas concatenan | `Number(form.precio)` antes del POST | BarApp, UT4 TA17 |
| 15 | **Mutar el estado** (`push`, `tarea.x = ...`) | React no re-renderiza | `[...lista, nuevo]`, `filter`, `map` con `{ ...obj }` | UT4 TA06-08 |
| 16 | **`key` faltante o por índice** | Warning en consola; al borrar del medio se mezclan | `key={item.id}` (o `indice + '-' + nombre` si no hay id) | Todos |
| 17 | **`onClick={funcion()}` con paréntesis** | Se ejecuta en cada render / bucle infinito | `onClick={funcion}` o `onClick={() => funcion(id)}` | UT4 |
| 18 | **Closure vieja en `setInterval`** | Contador clavado en 1 | `setSegundos(function (anterior) { return anterior + 1; })` | UT4 TA11 |
| 19 | **StrictMode monta dos veces** | Dos fetch, "cuenta de a 2" | Es normal; con cleanup correcto (`clearInterval`) no molesta | UT4 TA11 |
| 20 | **Objetos vs arrays en datos de países** (`currencies`, `languages`, `nativeName` son objetos) | `.map is not a function` | `Object.keys(obj)` + `for...of`; arrays (`capital`, `timezones`) con `join` | 2025 todos |
| 21 | **La lista devuelve solo códigos** (`["ABW", ...]`) | No hay nombre para mostrar | `ItemPais` con `useEffect([props.cca3])` y fetch propio; bandera directa `/flags/CCA3.svg` | 2025 mat/vesp |
| 22 | **`+` en la query string** (`UTC+01:00`) | Filtro devuelve `[]` | `encodeURIComponent(valor)` al armar la URL y el Link | 2025 mat/vesp |
| 23 | **Import con mayúscula distinta** (`Navbar.module.css` vs `NavBar.module.css`) | `Failed to resolve import` (en Linux) | Igualar nombre letra por letra | BarApp 2026 |
| 24 | **`/` y `/cuentas` muestran lo mismo** → `NavLink` no marca activo | Enlace "Cuentas" nunca resaltado | `<Route path="/" element={<Navigate to="/cuentas" replace />} />` | BarApp 2026 |
| 25 | **`setEstado` es asíncrono** | Decidir "¿quedó en 0?" con el valor viejo | Calcular `const nuevo = valor - 1;` → `setValor(nuevo)` → decidir con `nuevo` | Simulacro 2025 vesp |

Bonus: 26) datos incompletos (`capital: []`, `borders: []`, países sin `map`,
`assignee` undefined) → `if` + valor por defecto (`'-'`, `''`); 27) `allow-scripts`
de esbuild al instalar → `npm approve-scripts esbuild --yes && npm rebuild esbuild`.

---

## (f) Checklist final antes de entregar

- [ ] Consola del navegador **sin errores rojos** (los warnings de future flags y `only-export-components` no cuentan).
- [ ] **Recargar (F5) en cada ruta**, incluida una con parámetro (`/tasks/3/edit`, `/country/URY`): tiene que cargar sola. Si una ruta necesita estado previo (juego sin dificultad), redirige a `/` sin explotar.
- [ ] Crear un registro desde el formulario → aparece en la lista **y en `db.json`** (o en `curl http://localhost:3001/tasks`).
- [ ] Editar un registro → los otros campos siguen ahí (PUT completo).
- [ ] Borrar → desaparece de la lista y del backend.
- [ ] Lo del Context (progreso/total) **cambia solo** después de crear/editar/borrar, sin recargar.
- [ ] Navegar entre dos parámetros de la misma ruta (`/currencies/EUR` → `/currencies/USD`) refresca los datos.
- [ ] Validación: enviar vacío muestra mensaje y no hace POST.
- [ ] Cada componente nuevo tiene su carpeta y su `.module.css` (si lo exige el enunciado).
- [ ] No quedó ningún `TODO` sin resolver: `grep -rn "TODO" src/`.
- [ ] `git add -A && git commit -m "Resuelvo prueba" && git push` y **abrir el Pull Request** hacia el repo original (la entrega es el PR).
- [ ] Si un ejercicio quedó a medias, dejalo funcionando "hasta donde llegó" sin romper los demás (mejor que falte uno a que explote todo).

---

## Checklist de repaso

- [ ] ¿Cuál es el formato más probable y cuántos ejercicios hay que hacer bien para el 100%?
- [ ] ¿En qué orden atacás los 6 ejercicios y por qué el Context va último?
- [ ] Escribí de memoria: service con GET/POST/PUT/DELETE.
- [ ] Escribí de memoria: página de lista con `useEffect`, `loading`, `error`, `map`.
- [ ] Escribí de memoria: formulario con un `handleChange` por `[name]`, `preventDefault`, `navigate` tras el `await`.
- [ ] Escribí de memoria: `createContext` + Provider con `props.children` + `useContext`.
- [ ] Nombrá 5 trampas y cómo se detectan en la consola/Network.
- [ ] ¿Qué comprobás antes de abrir el PR?
