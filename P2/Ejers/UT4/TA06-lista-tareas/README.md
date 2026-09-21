# TA06 - Lista de tareas

## Enunciado

> Crear una aplicación en ReactJS, donde se le permite al usuario mediante un input ingresar una lista de tareas. Cada vez que se agrega una nueva tarea, el input debe quedar limpio, y la aplicación debe volver a renderizarse para mostrar la información actualizada.

## Cómo correrlo

```bash
cd TA06-lista-tareas
npm run dev
```

Las dependencias están en la carpeta padre `UT4/node_modules`, no hace falta `npm install`.

## Archivos

- `index.html` -> página base.
- `src/main.jsx` -> monta `<App />`.
- `src/App.jsx` -> estado `tareas` (array) y `proximoId`; función `agregarTarea`.
- `src/App.css` -> estilos del formulario y la lista.
- `src/componentes/FormularioTarea.jsx` -> input controlado + botón; `onSubmit` con `preventDefault`.
- `src/componentes/ListaTareas.jsx` -> recorre el array con `.map` y dibuja un `<li>` por tarea.

## Explicación paso a paso

1. **Estado del array en App**: `const [tareas, setTareas] = useState([])`. Cada tarea es un objeto `{ id, texto }`.
2. **Id incremental en estado**: `const [proximoId, setProximoId] = useState(1)`. Sirve para que cada tarea tenga un `id` único para la `key`.
3. **Formulario con `onSubmit`**: se usa un `<form>` en vez de un `onClick` en el botón, así también funciona apretar Enter. En `manejarEnvio` lo primero es `evento.preventDefault()` para que el navegador **no recargue la página**.
4. **Input controlado en el formulario**: `value={textoNuevaTarea}` + `onChange`. Al enviar, se llama `props.alAgregar(texto)` y después `setTextoNuevaTarea('')`: como el input es controlado, vaciar el estado lo deja limpio.
5. **Agregar sin mutar**: en `agregarTarea` se hace `setTareas([...tareas, nuevaTarea])`. El spread `...tareas` copia las tareas viejas en un array **nuevo** y se agrega la nueva al final.
6. **Mostrar la lista**: `props.tareas.map((tarea) => <li key={tarea.id}>{tarea.texto}</li>)`.

## Qué concepto se practica

- **Arrays en estado**: nunca `push`, `splice`, etc. sobre el array del estado. Siempre crear uno nuevo (`[...tareas, nueva]`, `filter`, `map`) y pasárselo a `setTareas`. Si se muta el array viejo, React compara y "ve" el mismo array, entonces no re-renderiza.
- **`evento.preventDefault()`** en `onSubmit`: sin esto el form recarga la página y se pierde todo.
- **`key`** en listas: tiene que ser única y estable. Usar un `id` propio, no el índice del array (el índice cambia cuando se borran elementos).
- **Limpiar el input** = poner el estado en `''`.
