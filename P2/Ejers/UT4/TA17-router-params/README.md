# TA17 - Contenido dinámico con parámetros de URL (useParams)

## Enunciado (TA 17, UT4)

> Mostrar contenido dinámico basado en parámetros de la URL. Crear una ruta para mostrar información de un producto usando un ID en la URL, por ejemplo: /product/:id. Usar useParams para acceder al parámetro id en la URL. Mostrar el contenido del producto dinámicamente basado en el ID.

## Cómo correrlo

Las dependencias (incluido `react-router-dom`) están en la carpeta padre `UT4/`, **no hace falta `npm install` acá**.

```bash
cd TA17-router-params
npm run dev
```

Probar: `/productos`, `/producto/1`, `/producto/3`, `/producto/99` (no existe) y `/loquesea` (404).

## Archivos

```
TA17-router-params/
  package.json
  vite.config.js
  index.html
  src/main.jsx                          -> createRoot + <App />
  src/App.jsx                           -> rutas, incluida /producto/:id
  src/App.css                           -> estilos
  src/datos/productos.js                -> array fijo de productos (id numérico)
  src/componentes/BarraNavegacion.jsx   -> NavLink Home / Productos
  src/paginas/Home.jsx
  src/paginas/ListaProductos.jsx        -> .map con Link a '/producto/' + id
  src/paginas/DetalleProducto.jsx       -> useParams + Number + .find + useNavigate
  src/paginas/NoEncontrada.jsx          -> 404
```

## Explicación paso a paso

1. **Datos**: `productos.js` exporta un array de objetos con `id` numérico.
2. **Ruta con parámetro**: `<Route path="/producto/:id" element={<DetalleProducto />} />`. El `:id` es un segmento dinámico: `/producto/1`, `/producto/2`, `/producto/abc` coinciden todas con esta Route.
3. **Lista con Links dinámicos**: `ListaProductos` recorre el array con `.map` y arma cada enlace con `to={'/producto/' + producto.id}`.
4. **Leer el parámetro**: en `DetalleProducto`, `const parametros = useParams();` devuelve `{ id: '2' }`.
5. **Trampa: useParams devuelve STRINGS**. `parametros.id` es `"2"`, no `2`. Como los ids de la lista son números, `"2" === 2` es `false` y `.find` no encontraría nada. Por eso hacemos `const idBuscado = Number(parametros.id);` antes de comparar.
6. **Buscar con `.find`**: devuelve el primer producto cuyo `id === idBuscado`, o `undefined` si no hay ninguno.
7. **Producto inexistente**: con un `if (productoEncontrado === undefined)` y `return` temprano mostramos "Producto no encontrado" (por ejemplo en `/producto/99`).
8. **Botón volver**: `const navegar = useNavigate();` y en el click `navegar(-1)`, que equivale al botón "atrás" del navegador. `useNavigate` sirve para cambiar de página desde código en vez de con un Link.

## Qué concepto se practica

- Rutas dinámicas con `:parametro`.
- `useParams` y la conversión de string a número con `Number()`.
- `.find` para buscar por id y manejar el caso `undefined`.
- `useNavigate` para navegar por código (`navegar(-1)` o `navegar('/ruta')`).
- Construir URLs de `Link` concatenando datos.
