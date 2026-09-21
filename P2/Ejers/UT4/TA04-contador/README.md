# TA04 - Contador

## Enunciado

> Crear una aplicación en ReactJS, que muestre en pantalla un contador. Dicho contador debe aumentar / disminuir su valor en función de 2 botones. Cada vez que se haga click en alguno de ellos, la aplicación debe volver a renderizarse para mostrar la información actualizada.

## Cómo correrlo

```bash
cd TA04-contador
npm run dev
```

Las dependencias están en la carpeta padre `UT4/node_modules`, no hace falta `npm install`.

## Archivos

- `index.html` -> página base.
- `src/main.jsx` -> monta `<App />`.
- `src/App.jsx` -> título + `<Contador />`.
- `src/App.css` -> estilos generales.
- `src/componentes/Contador.jsx` -> el contador con su estado y sus dos botones.
- `src/componentes/Contador.css` -> estilo del contador.

## Explicación paso a paso

1. **Importar `useState`**: `import { useState } from 'react'`.
2. **Crear el estado**: `const [contador, setContador] = useState(0)`. `contador` es el valor actual, `setContador` es la función para cambiarlo. El `0` es el valor inicial.
3. **Dos funciones manejadoras**: `manejarClickAumentar` hace `setContador(contador + 1)` y `manejarClickDisminuir` hace `setContador(contador - 1)`.
4. **Conectar los botones**: `<button onClick={manejarClickAumentar}>+1</button>`. Se pasa la función **sin paréntesis**.
5. **Re-render automático**: cuando se llama a `setContador`, React vuelve a ejecutar la función `Contador()`, `contador` tiene el valor nuevo y el `<p>` lo muestra.

## Qué concepto se practica

- **useState**: la única forma de tener datos que al cambiar actualicen la pantalla. Una variable normal (`let`) no sirve porque React no se entera de que cambió.
- **Eventos en React**: `onClick` en camelCase, y recibe una función (no el resultado de llamarla).
- **Re-render**: cada `setEstado` hace que el componente se vuelva a dibujar con el valor nuevo.
