# Apuntes: Simulacro parcial 2 (2025 sem 2, matutino) — "Country Trivia"

## 1. Resumen del enunciado

- App React con dos rutas. En `/` se elige un país al azar, se muestra su **mapa** y 4 botones con **banderas** (la correcta + 3 al azar, en orden aleatorio).
- Al presionar una bandera: se avisa bien/mal, se ajusta el **puntaje** (correctas − incorrectas), se **deshabilitan** los botones, el mapa pasa a ser un **enlace** a la página del país y aparece un botón para **otro desafío** (sin recargar la página).
- En `/country/:cca3` se muestra el nombre común (título), bandera y mapa en una línea, nombres oficiales (inglés + idiomas oficiales), capital, monedas, zonas horarias y un enlace para volver.
- API (mock en el mismo servidor de Vite): `GET /api/countries` → `["ABW","AFG",...]`; `GET /api/countries/URY` → objeto país. Imágenes en `/flags/URY.svg` y `/maps/URY.svg`.
- Trampas de datos: `currencies`, `languages` y `name.nativeName` son **objetos**; `capital`, `timezones`, `borders` son **arrays**; 8 países no tienen `map`, 4 no tienen capital, 56 tienen `flag.alt` vacío.

| Ruta | Componente | Qué muestra |
|------|------------|-------------|
| `/` | `Home.jsx` | Mapa + 4 banderas + puntaje + botón "Otro desafío" |
| `/country/:cca3` | `PaginaPais.jsx` | Detalle del país + enlace "Volver al inicio" |

## 2. Cómo correrlo

```bash
cd web
npm install        # instala react, react-router-dom, vite y lowdb (lo usa el mock)
npm start          # = vite. Abrir http://localhost:5173
```

Si `npm install` avisa de `allow-scripts` para esbuild: `npm approve-scripts esbuild --yes && npm rebuild esbuild`.

## 3. Estructura de archivos creados

```
web/src/
├── components/
│   ├── App.jsx              Router (BrowserRouter/Routes/Route) envuelto en ProveedorPuntaje
│   ├── Home.jsx             La trivia: useEffect [numeroDeRonda], azar, 4 BotonBandera, puntaje
│   ├── BotonBandera.jsx     Botón "tonto" con una <img>; avisa al padre con alPresionar(cca3)
│   └── PaginaPais.jsx       Detalle: useParams, useEffect [cca3], Object.keys sobre objetos
├── context/
│   └── ContextoPuntaje.jsx  createContext + ProveedorPuntaje (puntaje, sumarPunto, restarPunto)
├── services/
│   └── api.js               obtenerCodigosDePaises(), obtenerPais(cca3) con fetch + respuesta.ok
├── utils/
│   └── azar.js              elegirAlAzar, mezclarArray, elegirVariosDistintos
└── index.css                Estilos simples (flex para banderas y para bandera+mapa)
```

## 4. Dónde estaba lo difícil

### a) Azar y mezclado
- Elegir uno: `lista[Math.floor(Math.random() * lista.length)]`.
- Elegir 3 distintos y distintos del correcto: un `while` que saca candidatos y los descarta con `includes` si ya están.
- Mezclar: **copiar** el array (`slice()`) y hacer intercambios en un `for` de atrás hacia adelante. Nunca `sort(() => Math.random() - 0.5)` (no mezcla bien) ni mutar el array del estado.

### b) El puntaje se perdía al navegar → Context
Cuando el usuario hace click en el mapa y va a `/country/URY`, el router **desmonta** `Home`; su `useState` se destruye. Al volver a `/`, `Home` se monta de cero con puntaje 0. Solución: el puntaje vive en `ContextoPuntaje`, cuyo `Provider` está en `App` (por encima del `BrowserRouter`), que nunca se desmonta. `Home` lo lee con `useContext`.
Detalle: el enlace de vuelta es un `<Link>`, no un `<a href>`; el `<a>` recargaría la página y el Context volvería a 0.

### c) "Otro desafío" sin recargar la página
Estado `numeroDeRonda` en las dependencias del `useEffect`: `useEffect(() => {...}, [numeroDeRonda])`. El botón hace `setNumeroDeRonda(numeroDeRonda + 1)` y React vuelve a ejecutar el efecto → nuevo país, nuevas opciones. Nada de `window.location.reload()`.

### d) `useEffect` + `async`
La función del `useEffect` no puede ser `async`. Se define `async function cargarRonda() {...}` adentro y se llama. `try/catch/finally`, y `finally` para apagar `estaCargando`.

### e) Objetos vs arrays
- `name.nativeName` = `{ spa: { official, common } }` → `Object.keys(pais.name.nativeName)` para recorrer; el nombre del idioma sale de `pais.languages[clave]`.
- `currencies` = `{ UYU: { name, symbol } }` → `Object.keys` y `moneda.name + ' (' + moneda.symbol + ')'`.
- `capital` y `timezones` son arrays → `join(', ')` (y contemplar array vacío).

### f) Datos incompletos del mock
- Países sin `map`: en `Home` se vuelve a sortear hasta encontrar uno con mapa (`while (paisElegido === null)`); en `PaginaPais` se muestra un texto si no hay.
- `flag.alt` vacío: se arma un `alt` de reserva (`'Bandera de ' + nombre`).

### g) Estado "ya respondió"
Un solo estado `respuestaElegida` (null o cca3) alcanza para: deshabilitar los botones, mostrar el mensaje bien/mal, envolver el mapa en el `Link` y mostrar el botón "Otro desafío". Se resetea a `null` al empezar la ronda.

## 5. Lo más importante para repetir en el parcial

```jsx
// fetch con async/await + try/catch, siempre comprobando respuesta.ok
export async function obtenerPais(cca3) {
  const respuesta = await fetch('/api/countries/' + cca3);
  if (!respuesta.ok) { throw new Error('Error ' + respuesta.status); }
  return await respuesta.json();
}
```

```jsx
// useEffect que se repite cuando cambia un estado "gatillo"
const [numeroDeRonda, setNumeroDeRonda] = useState(1);
useEffect(() => {
  async function cargar() { try { ... } catch (error) { ... } finally { ... } }
  cargar();
}, [numeroDeRonda]);          // ← botón: setNumeroDeRonda(numeroDeRonda + 1)
```

```jsx
// Context: crear, proveer, consumir
export const ContextoPuntaje = createContext(null);
export function ProveedorPuntaje(props) {
  const [puntaje, setPuntaje] = useState(0);
  return <ContextoPuntaje.Provider value={{ puntaje, sumarPunto, restarPunto }}>{props.children}</ContextoPuntaje.Provider>;
}
// en App: <ProveedorPuntaje><BrowserRouter>...</BrowserRouter></ProveedorPuntaje>
// en Home: const contexto = useContext(ContextoPuntaje); contexto.puntaje
```

```jsx
// Router con parámetro y lectura del parámetro
<Route path="/country/:cca3" element={<PaginaPais />} />
const parametros = useParams(); const cca3 = parametros.cca3;
<Link to={'/country/' + pais.cca3}>...</Link>
```

```js
// Mezclar sin mutar
function mezclarArray(lista) {
  const copia = lista.slice();
  for (let indice = copia.length - 1; indice > 0; indice = indice - 1) {
    const indiceAlAzar = Math.floor(Math.random() * (indice + 1));
    const temporal = copia[indice]; copia[indice] = copia[indiceAlAzar]; copia[indiceAlAzar] = temporal;
  }
  return copia;
}
```

```jsx
// Recorrer un objeto en JSX
{Object.keys(pais.currencies).map((codigo) => (
  <li key={codigo}>{pais.currencies[codigo].name} ({pais.currencies[codigo].symbol})</li>
))}
```

```jsx
// Render condicional sin && : ternario con null
{yaRespondio ? <button onClick={manejarClickOtroDesafio}>Otro desafío</button> : null}
```

## 6. Plan de ataque (2 horas)

1. **0–10 min**: `npm install`, `npm start`, leer `mock-routes.js`, probar `/api/countries/URY` en el navegador y mirar la forma de los datos (¡objetos vs arrays!).
2. **10–20 min**: `services/api.js` (2 funciones) y `utils/azar.js` (3 funciones). Probarlas en la consola mentalmente.
3. **20–30 min**: `App.jsx` con las dos rutas y un `PaginaPais` mínimo (`useParams` + título) para validar el router.
4. **30–70 min**: `Home.jsx`: useEffect que arma la ronda, 4 `BotonBandera`, estado `respuestaElegida`, mensaje, botones deshabilitados, `Link` en el mapa, botón "Otro desafío" con `numeroDeRonda`. Puntaje primero con `useState` local.
5. **70–85 min**: mover el puntaje a `ContextoPuntaje` y probar: responder, ir al país, volver, ver que el puntaje sigue.
6. **85–105 min**: completar `PaginaPais`: nombres oficiales (`Object.keys(nativeName)`), capital, monedas, zonas horarias, enlace de vuelta; CSS mínimo (flex).
7. **105–120 min**: casos borde (país sin mapa, alt vacío, error de fetch), comentarios y README.
