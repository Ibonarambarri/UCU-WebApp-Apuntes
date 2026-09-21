# UT5.1.1 - Lista de países con React Router

## Enunciado

Extender la app de la lista de países con countries.dev. Agregar al proyecto
react-router:

- Ruta `/countries` muestra la lista de países con nombre y bandera.
- Ruta `/countries/:cca2` muestra el detalle de un país.
- Ruta `/` redirige a `/countries`.
- Diseño queda a discreción del equipo.

## Cómo correrlo

Las dependencias (react, react-dom, react-router-dom, vite) están instaladas
UNA sola vez en la carpeta padre `UT5/node_modules`. No hace falta hacer
`npm install` acá: Node las encuentra subiendo de carpeta.

```bash
cd UT5.1.1-paises-router
npx vite            # servidor de desarrollo, abre http://localhost:5173
npx vite build      # genera la carpeta dist/ para producción
```

## Estructura de archivos

```
UT5.1.1-paises-router/
  package.json                    -> nombre y scripts (sin dependencias)
  vite.config.js                  -> plugin de React para Vite
  index.html                      -> <div id="root"> y carga de src/main.jsx
  src/
    main.jsx                      -> monta <App /> en #root
    App.jsx                       -> BrowserRouter + Routes (define las rutas)
    App.css                       -> estilos: grilla, tarjetas, detalle
    servicios/
      api.js                      -> obtenerListaDePaises() y obtenerPaisPorCodigo(codigo)
    paginas/
      ListaDePaises.jsx           -> ruta /countries (lista + buscador)
      DetalleDePais.jsx           -> ruta /countries/:cca2 (detalle)
      NoEncontrado.jsx            -> ruta * (404 propio)
    componentes/
      TarjetaDePais.jsx           -> una tarjeta con bandera + nombre + Link
```

## La API (countries.dev)

- Lista: `GET https://countries.dev/countries?fields=name,alpha2Code,flags`
  devuelve un array de 250 objetos `{ name, alpha2Code, flags: { png, svg } }`.
  El parámetro `fields` hace que la respuesta sea liviana.
- Detalle: `GET https://countries.dev/alpha/UY` devuelve un objeto con
  `name`, `nativeName`, `capital`, `region`, `subregion`, `population`,
  `flag` (emoji), `flags`, `languages[]`, `currencies[]`, `borders[]`,
  `timezones[]`, etc. Si el código no existe responde **404**.

## Explicación paso a paso

### 1. Las rutas (`App.jsx`)

`BrowserRouter` envuelve toda la app y "escucha" la URL. Adentro, `Routes`
elige UNA `Route` según la URL actual:

| path              | element                              | qué hace                            |
|-------------------|--------------------------------------|-------------------------------------|
| `/`               | `<Navigate to="/countries" replace />` | redirige                          |
| `/countries`      | `<ListaDePaises />`                  | lista                               |
| `/countries/:cca2`| `<DetalleDePais />`                  | detalle; `:cca2` es un parámetro    |
| `*`               | `<NoEncontrado />`                   | cualquier otra URL                  |

**`Navigate`** es un componente que al renderizarse cambia la URL. Con
**`replace`** la entrada `/` se reemplaza en el historial (en vez de agregar
una nueva), así el botón "atrás" no vuelve a `/` y entra en un bucle.

### 2. Servicio de API (`servicios/api.js`)

Dos funciones `async` que hacen `fetch`, comprueban `respuesta.ok` y devuelven
el JSON. `obtenerPaisPorCodigo` detecta el `status === 404` y lanza
`new Error('País no encontrado')` para que la página muestre ese mensaje.
Separar el fetch en un archivo aparte evita repetir URLs y hace que las páginas
sean más cortas.

### 3. Lista (`paginas/ListaDePaises.jsx`)

- Tres estados clásicos de un fetch: `paises`, `estaCargando`, `mensajeError`.
- `useEffect(..., [])` se ejecuta una sola vez al montar. Como `useEffect` no
  acepta funciones `async`, se define `cargarPaises` adentro y se llama.
- `try / catch / finally`: en `try` pedimos y guardamos, en `catch` guardamos
  el mensaje de error, en `finally` apagamos `estaCargando` pase lo que pase.
- Antes de guardar, ordenamos con `.sort` usando `localeCompare` sobre `name`.
- Buscador: input controlado (`value` + `onChange`). La lista visible es
  `paises.filter(...)` comparando en minúsculas. No se guarda la lista
  filtrada en un estado: se calcula en cada render a partir de `paises` y
  `textoDeBusqueda`.
- `.map` convierte cada país en una `<TarjetaDePais key={pais.alpha2Code} />`.

### 4. Tarjeta (`componentes/TarjetaDePais.jsx`)

Recibe `props.pais` y renderiza un `<Link to={'/countries/' + pais.alpha2Code}>`
con la bandera (`flags.png`) y el nombre. `Link` no recarga la página: solo
cambia la URL y `Routes` renderiza `DetalleDePais`.

### 5. Detalle (`paginas/DetalleDePais.jsx`)

- `useParams()` devuelve `{ cca2: 'UY' }` (la clave se llama igual que en el
  `path` de la `Route`).
- `useEffect(..., [cca2])`: se vuelve a ejecutar cada vez que cambia el código.
  Si fuera `[]`, al ir de `/countries/UY` a `/countries/AR` react-router
  reutiliza el mismo componente y el efecto NO se repetiría: quedaría mostrando
  Uruguay.
- Dentro del efecto se reinician `estaCargando` y `mensajeError` antes de pedir.
- Si la API responde 404 el `catch` guarda "País no encontrado" y se muestra
  con un enlace a la lista.
- Campos opcionales (`borders`, `capital`, `languages`...): se resuelven con
  `if` explícitos antes del `return`, sin `?.` ni `&&`.
- Población con `toLocaleString('es-UY')` para separadores de miles.
- `useNavigate()` devuelve una función; `navegar(-1)` es el botón "atrás".
  Además hay un `Link` fijo a `/countries`.

### 6. CSS (`App.css`)

La lista es un `<ul>` con `display: grid` y
`grid-template-columns: repeat(auto-fill, minmax(180px, 1fr))`: crea tantas
columnas de al menos 180px como entren en el ancho. Cada `<li>` es una
`.tarjeta`.

## Qué se practica

- Configurar react-router: `BrowserRouter`, `Routes`, `Route`, `Link`.
- Redirección con `Navigate` y el significado de `replace`.
- Rutas con parámetros (`:cca2`) y lectura con `useParams`.
- Navegación programática con `useNavigate`.
- Ruta comodín `*` para una página 404 propia.
- Fetch con `async/await`, `try/catch/finally` y comprobación de `ok` y `404`.
- Estados de carga y error con return temprano.
- Ordenar con `sort` + `localeCompare`, filtrar con `filter`, listar con `map`
  y `key`.
- Dependencias de `useEffect`: `[]` vs `[cca2]`.
