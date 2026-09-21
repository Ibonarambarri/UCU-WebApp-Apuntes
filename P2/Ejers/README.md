# Ejercicios resueltos — UT4 y UT5

## Cómo están organizados

- Cada ejercicio tiene **su propia carpeta** con un mini-proyecto Vite completo
  (`index.html`, `vite.config.js`, `src/`, `README.md` con el enunciado y la explicación).
- Para no tener 20 carpetas `node_modules`, las dependencias (react, react-dom,
  react-router-dom, vite) se instalan **una sola vez** en `UT4/` y en `UT5/`.
  Node busca `node_modules` subiendo por las carpetas padre, así que desde
  cualquier ejercicio `npm run dev` funciona.

```bash
cd UT4            # o UT5
npm install       # solo la primera vez (ya está hecho)
cd TA06-lista-tareas
npm run dev       # http://localhost:5173
```

## UT4 — React: componentes, estado, efectos, contexto y router (TA1 a TA18)

| Carpeta | Tema |
|---|---|
| `UT4/TA01-card-props` | Componente con props, reutilizado 3 veces |
| `UT4/TA02-card-children` | `props.children` |
| `UT4/TA03-input-controlado` | Input controlado (`value` + `onChange`) |
| `UT4/TA04-contador` | `useState` + botones |
| `UT4/TA05-mostrar-ocultar` | Estado booleano y render condicional |
| `UT4/TA06-lista-tareas` | Formulario + array en estado + `map` con `key` |
| `UT4/TA07-borrar-tarea` | Borrar con `filter` |
| `UT4/TA08-editar-tarea` | Editar con `map` y "modo edición" |
| `UT4/TA09-useeffect-titulo` | `useEffect` con dependencias (`document.title`) |
| `UT4/TA10-fetch-usuarios` | `useEffect` + `fetch` a una API (cargando / error) |
| `UT4/TA11-temporizador` | `setInterval` + función de limpieza |
| `UT4/TA12-contexto-usuario` | `createContext` + `useContext` (solo lectura) |
| `UT4/TA13-contexto-actualizar` | Contexto con valor y función para cambiarlo |
| `UT4/TA14-contexto-tema` | Tema claro/oscuro con contexto y clases CSS |
| `UT4/TA15-dos-contextos` | Dos providers anidados (idioma + tema) |
| `UT4/TA16-router-basico` | `BrowserRouter`, `Routes`, `Route`, `Link`, `NavLink` |
| `UT4/TA17-router-params` | `useParams` (`/producto/:id`) |
| `UT4/TA18-rutas-protegidas` | Rutas protegidas con `Navigate` + contexto de auth |

## UT5 — App de países con router y dark mode

| Carpeta | Tema |
|---|---|
| `UT5/UT5.1.1-paises-router` | Lista `/countries`, detalle `/countries/:cca2`, `/` redirige. API real `countries.dev` |
| `UT5/UT5.1.2-paises-dark-mode` | Lo anterior + contexto de tema, selector en todas las páginas, clases CSS y `localStorage` |
