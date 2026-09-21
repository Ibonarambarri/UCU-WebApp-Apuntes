# TA10 - Fetch de usuarios con useState y useEffect

## Enunciado (TA 10, UT4)

> Crear una aplicación en ReactJS, que utilizando useState y useEffect, llame a la siguiente API (https://jsonplaceholder.typicode.com/users) y muestre el nombre de usuario y el mail (de manera amigable) de la respuesta que obtiene. Dicha llamada debe hacerse sólo una vez, cuando el componente se renderice.

## Cómo correrlo

Las dependencias (react, vite) están instaladas una sola vez en la carpeta padre `UT4/`, así que **no hace falta `npm install` acá**.

```bash
cd TA10-fetch-usuarios
npm run dev
```

Abrir la URL que muestra Vite (normalmente http://localhost:5173).

## Archivos

```
TA10-fetch-usuarios/
  package.json                        -> nombre del proyecto y scripts dev/build
  vite.config.js                      -> plugin de React para Vite
  index.html                          -> el <div id="root"> donde se monta React
  src/main.jsx                        -> createRoot + render de <App />
  src/App.jsx                         -> título + <ListaUsuarios />
  src/App.css                         -> estilos
  src/componentes/ListaUsuarios.jsx   -> hace el fetch y maneja carga/error/lista
  src/componentes/TarjetaUsuario.jsx  -> muestra nombre y mail de UN usuario
```

## Explicación paso a paso

1. **Tres estados** en `ListaUsuarios`:
   - `usuarios` (array, empieza `[]`): lo que devuelve la API.
   - `estaCargando` (booleano, empieza `true`): para mostrar "Cargando...".
   - `mensajeError` (string, empieza `''`): para mostrar un error si falla.
2. **`useEffect(function () { ... }, [])`**: el array vacío de dependencias hace que el efecto se ejecute **una sola vez**, justo después del primer render (cuando el componente se "monta"). Si no pusiéramos el array, el efecto correría después de cada render y entraríamos en un bucle infinito (fetch -> setUsuarios -> render -> fetch -> ...).
3. **Función async adentro del useEffect**: el callback del `useEffect` no puede ser `async` porque React espera que devuelva `undefined` o una función de limpieza, y una función `async` siempre devuelve una Promesa. La solución es definir `async function cargarUsuarios()` adentro y llamarla en la línea siguiente.
4. **`fetch` + `await respuesta.json()`** dentro de un `try/catch`. Se comprueba `respuesta.ok` porque `fetch` no lanza error cuando el servidor responde 404 o 500; solo falla si no hay red.
5. **`finally`** pone `estaCargando` en `false` tanto si salió bien como si falló.
6. **Render condicional con `if` + `return` temprano**: primero "Cargando...", después el error, y si no hay ninguno de los dos, la lista.
7. **`.map` con `key={usuario.id}`** para dibujar una `TarjetaUsuario` por cada usuario. La tarjeta recibe `nombre` y `mail` por props y los muestra de forma amigable (el mail como enlace `mailto:`).

## Qué concepto se practica

- `useEffect` con `[]` para ejecutar código **solo al montar**.
- Por qué el callback del `useEffect` no puede ser `async` y cómo se resuelve.
- El patrón de tres estados `datos / estaCargando / mensajeError` para cualquier llamada a una API.
- `fetch` con `async/await`, `try/catch/finally` y comprobación de `respuesta.ok`.
- Renderizado condicional y listas con `.map` y `key`.
