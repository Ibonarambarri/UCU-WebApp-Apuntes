# TA09 - useEffect y título de la pestaña

## Enunciado

> Utilizando como base la TA 4, utilizar useEffect para que cada vez que el contador cambie, el título de su documento (lo que se muestra en la tab) cambie. Por defecto, debe ser "Contador: 0".

## Cómo correrlo

```bash
cd TA09-useeffect-titulo
npm run dev
```

Las dependencias están en la carpeta padre `UT4/node_modules`, no hace falta `npm install`.

## Archivos

- `index.html` -> página base; el `<title>` inicial ya dice `Contador: 0`.
- `src/main.jsx` -> monta `<App />`.
- `src/App.jsx` -> título + `<Contador />`.
- `src/App.css` -> estilos generales.
- `src/componentes/Contador.jsx` -> el contador de TA04 + el `useEffect` que cambia `document.title`.
- `src/componentes/Contador.css` -> estilo del contador.

## Explicación paso a paso

1. **Importar `useEffect`** junto con `useState`: `import { useState, useEffect } from 'react'`.
2. **Escribir el efecto** dentro del componente, después del `useState`:
   ```jsx
   useEffect(function actualizarTitulo() {
     document.title = 'Contador: ' + contador;
   }, [contador]);
   ```
   El primer argumento es la función que se ejecuta; el segundo es el **array de dependencias**.
3. **Por qué `[contador]`**: React ejecuta el efecto después del primer render (montaje) y después de cada render en el que `contador` haya cambiado. Con `[]` se ejecutaría solo una vez y el título quedaría en "Contador: 0" para siempre; sin array se ejecutaría después de cada render (funciona pero es desprolijo).
4. **El valor por defecto "Contador: 0"** sale solo: al montar, `contador` vale `0` y el efecto pone `document.title = 'Contador: 0'`. Además el `index.html` ya trae ese `<title>` para que coincida incluso antes de que React arranque.
5. **Los botones** son idénticos a TA04.

## Qué concepto se practica

- **useEffect**: sirve para hacer "efectos secundarios", cosas que no son dibujar JSX: cambiar `document.title`, hacer un `fetch`, poner un `setInterval`, etc. Se ejecuta **después** de que React dibuja.
- **Array de dependencias**:
  - `[contador]` -> al montar + cada vez que `contador` cambia.
  - `[]` -> solo al montar (típico para un `fetch` inicial).
  - sin array -> después de cada render (casi nunca se quiere).
- **`document.title`** es una propiedad del navegador, no de React. Por eso no va en el JSX sino en un efecto.
