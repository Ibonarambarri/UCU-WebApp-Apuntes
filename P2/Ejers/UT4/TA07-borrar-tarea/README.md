# TA07 - Borrar tarea

## Enunciado

> Utilizando como base la TA 6, agregar (de la manera que le parezca más amigable a nivel de UI) una manera de poder borrar una tarea.

## Cómo correrlo

```bash
cd TA07-borrar-tarea
npm run dev
```

Las dependencias están en la carpeta padre `UT4/node_modules`, no hace falta `npm install`.

## Archivos

- `index.html` -> página base.
- `src/main.jsx` -> monta `<App />`.
- `src/App.jsx` -> estado `tareas`, funciones `agregarTarea` y `borrarTarea`.
- `src/App.css` -> estilos (los de TA06 + el botón de borrar).
- `src/componentes/FormularioTarea.jsx` -> igual que en TA06.
- `src/componentes/ListaTareas.jsx` -> cada `<li>` tiene un botón 🗑 que llama a `props.alBorrar(tarea.id)`.

## Explicación paso a paso

1. **Elegir la UI**: un botón 🗑 al lado de cada tarea es lo más claro: se ve qué tarea se va a borrar.
2. **Función `borrarTarea(idABorrar)` en App**: usa `tareas.filter((tarea) => tarea.id !== idABorrar)`. `filter` recorre el array y arma uno **nuevo** solo con las tareas cuyo id es distinto al que queremos borrar. Después `setTareas(tareasFiltradas)`.
3. **Pasar la función a la lista**: `<ListaTareas tareas={tareas} alBorrar={borrarTarea} />`.
4. **Botón dentro del `.map`**: `onClick={() => props.alBorrar(tarea.id)}`. Como hay que pasarle un argumento (el id de esa fila), se usa una arrow inline. Es la excepción permitida de la guía de estilo.

## Qué concepto se practica

- **Borrar de un array en estado con `filter`**: nunca `splice`. `filter` no modifica el original, devuelve uno nuevo.
- **Pasar argumentos a un handler**: `onClick={() => funcion(argumento)}`. Si se escribe `onClick={funcion(argumento)}` la función se ejecuta en el render (y si además cambia el estado, se genera un bucle infinito).
- **Comunicación hijo -> padre**: el hijo no borra nada, solo llama a la función que le pasó el padre con el id. El único que toca el estado es quien lo tiene (App).
- **Por qué la `key` con id y no con índice**: al borrar la tarea del medio, los índices de las siguientes cambian; el id no.
