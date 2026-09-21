# TA18 - Rutas protegidas (autenticación con Context + Router)

## Enunciado (TA 18, UT4)

> Crear rutas protegidas que solo permitan el acceso a usuarios autenticados. Crear una ruta protegida que redirija al Home si un usuario no cumple con cierta condición. Crear rutas que se encuentren protegidas por este mecanismo, así como públicas que no lo estén.

## Cómo correrlo

Las dependencias (incluido `react-router-dom`) están en la carpeta padre `UT4/`, **no hace falta `npm install` acá**.

```bash
cd TA18-rutas-protegidas
npm run dev
```

Probar: entrar a `/perfil` sin login (te devuelve a `/`), hacer Login con cualquier nombre, entrar a `/perfil` y `/panel`, hacer Logout.

## Archivos

```
TA18-rutas-protegidas/
  package.json
  vite.config.js
  index.html
  src/main.jsx                                  -> createRoot + <App />
  src/App.jsx                                   -> estado de sesión + Provider + rutas
  src/App.css                                   -> estilos
  src/contextos/ContextoAutenticacion.jsx       -> { estaLogueado, nombreUsuario, iniciarSesion, cerrarSesion }
  src/componentes/RutaProtegida.jsx             -> deja pasar o <Navigate to="/" replace />
  src/componentes/BarraNavegacion.jsx           -> Login o Perfil/Panel/Logout según sesión
  src/paginas/Home.jsx                          -> pública
  src/paginas/Login.jsx                         -> pública, formulario que llama iniciarSesion
  src/paginas/Perfil.jsx                        -> privada
  src/paginas/Panel.jsx                         -> privada
  src/paginas/NoEncontrada.jsx                  -> 404
```

## Explicación paso a paso

1. **Contexto de autenticación**: `ContextoAutenticacion` publica `{ estaLogueado, nombreUsuario, iniciarSesion, cerrarSesion }`. El estado vive en `App` con dos `useState`. `iniciarSesion(nombre)` pone `estaLogueado` en `true`; `cerrarSesion()` lo vuelve a `false`.
2. **Provider por fuera del BrowserRouter** en `App`, para que la barra, las páginas y `RutaProtegida` puedan leer el contexto.
3. **`RutaProtegida`** recibe la página como `props.children`. Lee `estaLogueado` del contexto:
   - si es `false`, devuelve `<Navigate to="/" replace />`: un componente que al renderizarse cambia la URL al Home. `replace` evita que la ruta privada quede en el historial (si no, el botón "atrás" volvería a `/perfil` y sería redirigido de nuevo).
   - si es `true`, devuelve `props.children` (la página).
4. **Declarar rutas públicas y privadas** en `Routes`:
   ```jsx
   <Route path="/" element={<Home />} />            // pública
   <Route path="/login" element={<Login />} />      // pública
   <Route path="/perfil" element={<RutaProtegida><Perfil /></RutaProtegida>} />  // privada
   <Route path="/panel" element={<RutaProtegida><Panel /></RutaProtegida>} />    // privada
   ```
5. **Login**: formulario con input controlado. En `onSubmit` hacemos `evento.preventDefault()`, llamamos `contexto.iniciarSesion(nombreEscrito)` y `navegar('/perfil')`. La "condición" para estar autenticado es haber escrito un nombre.
6. **Barra de navegación**: con `useContext` decide qué mostrar. Sin sesión: Home y Login. Con sesión: Home, Perfil, Panel, el saludo y el botón Logout, que llama `cerrarSesion()` y navega a `/`.

## Alternativa con `<Outlet />`

En vez de envolver cada página con `<RutaProtegida>...</RutaProtegida>`, se puede hacer una **ruta padre sin path** que agrupe las privadas:

```jsx
// RutaProtegida.jsx
function RutaProtegida() {
  const contexto = useContext(ContextoAutenticacion);
  if (!contexto.estaLogueado) {
    return <Navigate to="/" replace />;
  }
  return <Outlet />; // acá se dibuja la ruta hija que coincida
}

// App.jsx
<Route element={<RutaProtegida />}>
  <Route path="/perfil" element={<Perfil />} />
  <Route path="/panel" element={<Panel />} />
</Route>
```

`<Outlet />` es el "hueco" donde React Router pone la ruta hija. Ventaja: se protegen muchas rutas de una sola vez. El resultado es el mismo que con `children`; elegimos `children` porque es más fácil de leer al principio.

## Qué concepto se practica

- Combinar Context (estado global de sesión) con Router.
- Componente "guardia" con `props.children`.
- `<Navigate to="/" replace />` para redirigir desde JSX y por qué `replace`.
- Rutas públicas vs privadas y navbar condicional.
- Alternativa con rutas anidadas y `<Outlet />`.
