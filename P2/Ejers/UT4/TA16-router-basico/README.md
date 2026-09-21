# TA16 - Navegación básica con React Router

## Enunciado (TA 16, UT4)

> Crear una aplicación con navegación entre tres páginas: Home, About, y Contact. Instalar React Router usando `npm install react-router-dom`. Crear los componentes Home, About, y Contact. Usar BrowserRouter, Routes, y Route para definir las rutas. Implementar enlaces (Link) para navegar entre estas páginas.

## Cómo correrlo

En un proyecto nuevo habría que instalar el router con:

```bash
npm install react-router-dom
```

En esta carpeta **no hace falta**, porque `react-router-dom` ya está instalado en el `node_modules` del padre `UT4/`.

```bash
cd TA16-router-basico
npm run dev
```

## Archivos

```
TA16-router-basico/
  package.json
  vite.config.js
  index.html
  src/main.jsx                          -> createRoot + <App />
  src/App.jsx                           -> BrowserRouter + Routes + Route
  src/App.css                           -> estilos de la barra y el contenido
  src/componentes/BarraNavegacion.jsx   -> NavLink a las tres páginas
  src/paginas/Home.jsx
  src/paginas/About.jsx
  src/paginas/Contact.jsx
  src/paginas/NoEncontrada.jsx          -> 404 (ruta "*")
```

## Explicación paso a paso

1. **`BrowserRouter`** envuelve toda la app en `App.jsx`. Es el que "escucha" la URL del navegador. Lo pusimos en App (y no en `main.jsx`) para que toda la configuración del router quede en un solo archivo; las dos opciones son válidas.
2. **`Routes` + `Route`**: dentro de `Routes` declaramos una `Route` por página con `path` (la URL) y `element` (el componente). `Routes` renderiza solo la primera que coincida.
3. **Ruta comodín `*`**: `<Route path="*" element={<NoEncontrada />} />` atrapa cualquier URL que no coincida con las anteriores y muestra el 404.
4. **`BarraNavegacion`** está fuera de `Routes`, por eso se ve en todas las páginas.
5. **`Link` vs `<a href>`**: un `<a href="/about">` le pide al navegador que cargue una página nueva desde el servidor: se recarga todo y se pierde el estado de React. `<Link to="/about">` solo cambia la URL (con la History API) y avisa al router, que dibuja el componente nuevo sin recargar. Por eso en React Router siempre se usa `Link`.
6. **`NavLink`**: es un `Link` que además sabe si está activo. Se le pasa a `className` una función que recibe `{ isActive }` y devuelve la clase. Así el enlace de la página actual se ve resaltado con `.enlace-activo`.

## Qué concepto se practica

- Configuración mínima de React Router: `BrowserRouter`, `Routes`, `Route`.
- Navegación sin recarga con `Link` y `NavLink`.
- Marcar el enlace activo con `isActive`.
- Página 404 con la ruta comodín `*`.
