# UT5.1.2 - Lista de países con dark mode (Context + localStorage)

## Enunciado

Extender la app anterior de países (UT5.1.1) con un dark mode:

- Definir un contexto para guardar el estado del modo actual.
- Mostrar en todas las páginas un selector de modo (light o dark).
- Definir clases de CSS para ambos modos.
- Elegir las clases en función del modo del contexto.
- Extra: guardar el modo elegido por el usuario en el localStorage y tomarlo
  de ahí al cargar la app.

## Cómo correrlo

Las dependencias están instaladas una sola vez en `UT5/node_modules` (carpeta
padre). No hace falta `npm install` acá.

```bash
cd UT5.1.2-paises-dark-mode
npx vite            # servidor de desarrollo, abre http://localhost:5173
npx vite build      # genera dist/ para producción
```

## Estructura de archivos

```
UT5.1.2-paises-dark-mode/
  package.json                    -> nombre y scripts (sin dependencias)
  vite.config.js                  -> plugin de React para Vite
  index.html                      -> <div id="root"> y carga de src/main.jsx
  src/
    main.jsx                      -> monta <ProveedorTema><App /></ProveedorTema>
    App.jsx                       -> lee el contexto, elige la clase del modo, define rutas
    App.css                       -> reglas .modo-light / .modo-dark + grilla, tarjetas
    contextos/
      ContextoTema.jsx            -> createContext + ProveedorTema (estado + localStorage)
    componentes/
      Encabezado.jsx              -> barra superior visible en TODAS las páginas
      SelectorDeModo.jsx          -> <select> light/dark que usa useContext
      TarjetaDePais.jsx           -> una tarjeta con bandera + nombre + Link
    servicios/
      api.js                      -> obtenerListaDePaises() y obtenerPaisPorCodigo(codigo)
    paginas/
      ListaDePaises.jsx           -> ruta /countries (lista + buscador)
      DetalleDePais.jsx           -> ruta /countries/:cca2 (detalle)
      NoEncontrado.jsx            -> ruta * (404 propio)
```

Las páginas, la tarjeta y el servicio de API son idénticos a UT5.1.1 (ver su
README para la explicación de rutas, `useParams`, fetch, etc.). Acá se explica
solo lo nuevo.

## Explicación paso a paso: el flujo completo del dark mode

```
localStorage ──(al arrancar)──> estado "modo" en ProveedorTema
                                       │
                                       │ value={ modo, setModo }
                                       ▼
                              ContextoTema.Provider
                                 │              │
                     useContext  │              │  useContext
                                 ▼              ▼
                            App.jsx        SelectorDeModo
                     (elige la clase)     (cambia el modo)
                                 │              │
                                 ▼              │ setModo('dark')
                 <div className="aplicacion modo-dark">
                                 │
                                 ▼
                    App.css: .modo-dark .tarjeta { ... }
                                                │
                       useEffect [modo] ────────┘
                                 ▼
                    localStorage.setItem('modo', modo)
```

### 1. El contexto (`contextos/ContextoTema.jsx`)

- `createContext(null)` crea el contexto. El valor por defecto (`null`) solo se
  usa si alguien hace `useContext` fuera del proveedor; no es lo importante.
- `ProveedorTema` es un componente normal que:
  1. Tiene el estado `modo` con `useState`. Para el valor inicial le pasamos una
     **función** (`obtenerModoInicial`) que lee `localStorage.getItem('modo')`.
     Pasar la función (y no llamarla) hace que se ejecute solo en el primer
     render. Con un `if` explícito: si lo guardado es `'dark'` arranca en dark,
     en cualquier otro caso (incluido `null`) arranca en `'light'`.
  2. Tiene un `useEffect` con dependencias `[modo]` que hace
     `localStorage.setItem('modo', modo)`. Se ejecuta al montar y cada vez que
     el modo cambia, así siempre queda guardado el último elegido.
  3. Renderiza `<ContextoTema.Provider value={{ modo, setModo }}>` y adentro
     `props.children` (todo lo que le pongan entre las etiquetas).
- Exporta las dos cosas: `ContextoTema` (para `useContext`) y `ProveedorTema`
  (para envolver la app).

### 2. Envolver la app (`main.jsx`)

```jsx
<ProveedorTema>
  <App />
</ProveedorTema>
```

Trampa: `App` usa `useContext(ContextoTema)`, así que el proveedor tiene que
estar **por fuera** de `App`. Si lo pusiéramos dentro del `return` de `App`,
el `useContext` de `App` recibiría `null` y explotaría al leer `contexto.modo`.

### 3. Elegir la clase CSS (`App.jsx`)

```jsx
const contexto = useContext(ContextoTema);
let claseDelModo = 'modo-light';
if (contexto.modo === 'dark') {
  claseDelModo = 'modo-dark';
}
<div className={'aplicacion ' + claseDelModo}>
```

Se concatena la clase fija con la del modo. Al cambiar el estado del contexto,
`App` se re-renderiza y el `div` raíz cambia de clase.

### 4. El selector en todas las páginas (`Encabezado.jsx` + `SelectorDeModo.jsx`)

- `SelectorDeModo` hace `useContext(ContextoTema)` para obtener `modo` y
  `setModo`. Es un `<select>` controlado: `value={modo}` y en `onChange`
  llama a `setModo(evento.target.value)`.
- `Encabezado` contiene el título y el selector. En `App.jsx` se renderiza
  **dentro de `BrowserRouter` pero fuera de `Routes`**: así aparece siempre,
  sin importar la ruta, y aun así puede usar `Link`.

### 5. Las clases CSS (`App.css`)

Las reglas que dependen del modo se escriben con un selector descendiente:

```css
.modo-light { background-color: #f4f4f4; color: #222; }
.modo-dark  { background-color: #121212; color: #eee; }

.modo-light .tarjeta { background-color: #fff; color: #222; }
.modo-dark  .tarjeta { background-color: #222; color: #eee; }
```

Como `.modo-dark` está en el contenedor raíz, TODOS los `.tarjeta`, `.detalle`,
`.boton`, inputs, etc. de adentro cambian a la vez. El contenedor tiene
`min-height: 100vh` para que el fondo cubra toda la ventana.

### 6. Persistencia (localStorage)

- **Guardar**: `useEffect(() => localStorage.setItem('modo', modo), [modo])`
  dentro del proveedor.
- **Leer**: en el valor inicial de `useState`, con `getItem`. `localStorage`
  solo guarda strings; como el modo ya es un string no hace falta
  `JSON.stringify` / `JSON.parse` (sí haría falta para objetos o arrays).

## Qué se practica

- `createContext` / `Provider` / `useContext`: compartir estado sin pasar props
  nivel por nivel.
- Patrón "componente proveedor" con `props.children`.
- Dónde poner el proveedor (por fuera de quien lo consume).
- Clases CSS condicionales con `if` + concatenación de strings.
- Selectores descendientes en CSS para temas (`.modo-dark .tarjeta`).
- Componentes fuera de `<Routes>` que se ven en todas las páginas.
- `localStorage.getItem` / `setItem` con `useState` (valor inicial con función)
  y `useEffect` con dependencia.
