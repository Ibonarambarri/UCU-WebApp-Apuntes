# TA08 - Editar tarea

## Enunciado

> Utilizando como base la TA 7, agregar una manera de poder editar una tarea.

## Cómo correrlo

```bash
cd TA08-editar-tarea
npm run dev
```

Las dependencias están en la carpeta padre `UT4/node_modules`, no hace falta `npm install`.

## Archivos

- `index.html` -> página base.
- `src/main.jsx` -> monta `<App />`.
- `src/App.jsx` -> estados `tareas`, `proximoId`, `idEditando`, `textoEditando` y las funciones agregar / borrar / empezarEdicion / guardarEdicion / cancelarEdicion.
- `src/App.css` -> estilos (TA07 + modo edición).
- `src/componentes/FormularioTarea.jsx` -> igual que en TA06.
- `src/componentes/ListaTareas.jsx` -> cada fila se dibuja en modo normal o en modo edición.

## Explicación paso a paso

1. **Dos estados nuevos en App**:
   - `idEditando`: el id de la tarea que se está editando, o `null` si ninguna. Así solo una fila a la vez está en edición.
   - `textoEditando`: el texto del input de edición (input controlado).
2. **Empezar a editar** (click en ✏): `empezarEdicion(tarea)` hace `setIdEditando(tarea.id)` y `setTextoEditando(tarea.texto)`. Cargamos el texto actual para que el usuario lo modifique en vez de arrancar en blanco.
3. **La lista decide qué dibujar**: dentro del `.map`, `const estaEditando = tarea.id === props.idEditando`. Si es `true` devuelve un `<li>` con input + Guardar + Cancelar; si no, el `<li>` normal con texto + ✏ + 🗑. (Acá el `.map` usa llaves `{ }` y `return` porque tiene lógica adentro, no solo JSX.)
4. **Guardar**: `guardarEdicion()` hace un `tareas.map(...)` que devuelve, para la tarea con `id === idEditando`, una copia con el texto nuevo (`{ ...tarea, texto: textoEditando }`) y para el resto la misma tarea. Luego `setTareas(...)` y se limpia `idEditando` / `textoEditando`.
5. **Cancelar**: solo pone `idEditando` en `null` y vacía `textoEditando`. La tarea queda como estaba.
6. **Detalle**: si se borra la tarea que estaba en edición, también salimos del modo edición para no dejar el estado inconsistente.

## Qué concepto se practica

- **Modificar un elemento de un array en estado con `map`**: devuelve un array nuevo del mismo largo; se reemplaza solo el elemento que coincide. Nunca `tareas[indice].texto = ...` (mutación).
- **Copiar un objeto con spread**: `{ ...tarea, texto: nuevo }` crea un objeto nuevo con los mismos campos y pisa `texto`.
- **Estado "de UI"** (`idEditando`, `textoEditando`) separado del **estado "de datos"** (`tareas`).
- **Render condicional dentro de un `.map`** con `if` + dos `return`, cada uno con su `key`.
- **Muchas props hacia un hijo**: es normal que un componente de lista reciba varias funciones del padre; el hijo nunca modifica el estado, solo avisa.
