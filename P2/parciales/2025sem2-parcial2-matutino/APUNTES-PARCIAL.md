# Apuntes: Parcial 2 - 2025 sem2 (matutino) - Buscador de países

## 1. Resumen del enunciado

App React (Vite + react-router-dom) para buscar países. La página de inicio muestra una
lista de países (bandera + nombre) con tres `<select>` de filtro (moneda, lenguaje y zona
horaria) que se llenan desde la API. Al cambiar un filtro se vuelve a pedir la lista con
query string (`?currency=EUR&language=fra&timezone=UTC%2B01:00`), y se pueden combinar.
Al cliquear un país se va a su página de detalle (nombres, capital, monedas, lenguajes,
zonas horarias) con un botón para volver al inicio.

### Tabla de rutas de la app

| Ruta            | Componente   | Qué muestra                                              |
|-----------------|--------------|----------------------------------------------------------|
| `/`             | `Home`       | 3 selects de filtro + lista de países (bandera + nombre)  |
| `/country/:cca3`| `PaginaPais` | Detalle de un país + botón "Back to list"                |
| `/ref/api`      | `ApiRef`     | Venía en la plantilla, no es parte de la entrega         |

### Endpoints de la API (mock dentro de Vite, mismo puerto)

| Endpoint                                  | Devuelve                                            |
|-------------------------------------------|-----------------------------------------------------|
| `GET /api/countries`                      | **Solo códigos**: `["ABW","AFG",...]`               |
| `GET /api/countries?currency=EUR&language=fra&timezone=UTC%2B01:00` | Lo mismo, filtrado (los filtros se combinan con AND) |
| `GET /api/countries/URY`                  | Objeto completo del país                            |
| `GET /api/currencies`                     | `[{ code, name, symbol }]`                          |
| `GET /api/languages`                      | `[{ code, name }]`                                  |
| `GET /api/timezones`                      | `["UTC-04:00", "UTC+01:00", ...]`                   |
| `GET /flags/URY.svg`                      | Imagen SVG de la bandera (carpeta pública)          |

Forma del objeto país (lo importante):

```js
{
  cca3: "URY",
  name: {
    common: "Uruguay",
    official: "Oriental Republic of Uruguay",
    nativeName: { spa: { official: "República Oriental del Uruguay", common: "Uruguay" } } // OBJETO
  },
  capital: ["Montevideo"],                                  // ARRAY
  currencies: { UYU: { name: "Uruguayan peso", symbol: "$" } }, // OBJETO
  languages: { spa: "Spanish" },                            // OBJETO
  timezones: ["UTC-03:00"],                                 // ARRAY
  flag: { svg: "/flags/URY.svg" }
}
```

## 2. Cómo correrlo

```bash
cd web
npm install
npm start          # levanta Vite en http://localhost:5173
```

Si `npm install` avisa de `allow-scripts` con esbuild: `npm approve-scripts esbuild --yes && npm rebuild esbuild`.

## 3. Estructura de archivos que creé / modifiqué

```
web/src/
├── components/
│   ├── App.jsx          # Router: "/" -> Home, "/country/:cca3" -> PaginaPais
│   ├── Home.jsx         # Página de inicio: 3 selects + lista. 2 useEffect (opciones, países)
│   ├── ItemPais.jsx     # Un ítem de la lista: pide SU país para saber el nombre, muestra bandera + Link
│   ├── PaginaPais.jsx   # Detalle: useParams + fetch + recorrer objetos + botón useNavigate('/')
│   └── ApiRef.jsx       # (plantilla, sin tocar)
├── services/
│   └── api.js           # Todas las funciones fetch: obtenerMonedas, obtenerLenguajes,
│                        #   obtenerZonasHorarias, obtenerPaises(moneda, lenguaje, zona), obtenerPais(cca3)
└── index.css            # Estilos mínimos (tarjetas, banderas, filtros en fila)
```

- **`api.js`**: función auxiliar `obtenerJson(url)` que hace `fetch`, comprueba `respuesta.ok`
  y devuelve el JSON. `obtenerPaises` arma el query string a mano solo con los filtros no vacíos.
- **`Home.jsx`**: 3 estados para las listas de opciones, 3 estados para el valor elegido de cada
  select, 1 estado con los códigos de países, más `estaCargando` y `mensajeDeError`.
- **`ItemPais.jsx`**: recibe `props.cca3`, hace su propio `useEffect` + `obtenerPais` y guarda
  `name.common`. La bandera se muestra con `/flags/${cca3}.svg` sin esperar el fetch.
- **`PaginaPais.jsx`**: `useParams().cca3`, `useEffect([cca3])`, returns tempranos para error y
  cargando, `Object.keys` + `for...of` para `nativeName`, `currencies` y `languages`.

## 4. Dónde estaba lo difícil (trampas)

1. **La lista devuelve solo códigos.** `GET /api/countries` responde `["ARG","BRA",...]`, sin
   nombre ni bandera. Para mostrar el nombre hay que pedir `GET /api/countries/ARG` por cada
   ítem. Solución simple: componente `ItemPais` que recibe `cca3` y hace su propio fetch en un
   `useEffect`. Mientras carga muestra el código. Con 250 países son 250 requests, pero es un
   mock local y es lo que el enunciado espera. La bandera no necesita el fetch: la URL es
   siempre `/flags/CCA3.svg`.
2. **`currencies`, `languages` y `name.nativeName` son OBJETOS, no arrays.** No se puede hacer
   `.map` directo. Hay que usar `Object.keys(objeto)` y recorrer las claves con `for...of`
   (o `.map` sobre las keys). En cambio `capital` y `timezones` sí son arrays → `.join(', ')`.
3. **El `+` de las zonas horarias.** `UTC+01:00` en una URL: el `+` se interpreta como espacio y
   el servidor recibe `UTC 01:00` → devuelve `[]`. Hay que usar `encodeURIComponent(valor)`
   que lo convierte en `UTC%2B01:00`. (Lo comprobé con curl: sin codificar devuelve lista vacía.)
4. **Filtros combinados y opción "Todas".** El value `""` significa sin filtro. Al armar la URL
   solo se agregan los parámetros que no están vacíos, si no el mock filtra por string vacío.
   Se arma con un array de partes `clave=valor` y `.join('&')`.
5. **`useEffect` con dependencias de los filtros.** El efecto que pide la lista lleva
   `[monedaElegida, lenguajeElegido, zonaHorariaElegida]` en el array de dependencias: así se
   ejecuta al montar y cada vez que cambia cualquiera de los tres. El efecto que carga las
   opciones de los selects lleva `[]` porque solo hace falta una vez.
6. **Select controlado.** `value={estado}` + `onChange={handler}` con `setEstado(evento.target.value)`.
   Si no se pone `value` React avisa de componente no controlado.
7. **Casos borde en los datos.** Hay países con `capital: []`, `currencies: {}`, `languages: {}`
   y `nativeName: {}` (por ejemplo Antártida `ATA`). Si se hace `capital[0]` da `undefined`.
   Solución: función `unirOGuion(lista)` que devuelve `"-"` si está vacía.
8. **Código inexistente → 404.** `obtenerJson` lanza un `Error` si `!respuesta.ok`, y el
   `try/catch` del componente lo convierte en un mensaje. Sin esto `respuesta.json()` devuelve
   `{ error: "..." }` y explota al leer `pais.name.common`.
9. **Sin `&&` para render.** Usé una variable `contenidoDeLaLista` con `if/else if` o returns
   tempranos (`if (pais === null) return <p>Cargando...</p>`) en vez de `{pais && ...}`.

## 5. Lo más importante para repetir en el parcial

### Fetch en useEffect (patrón base)

```jsx
const [datos, setDatos] = useState(null);

useEffect(() => {
  async function cargar() {
    try {
      const respuesta = await fetch('/api/countries/' + cca3);
      if (!respuesta.ok) {
        throw new Error('Error ' + respuesta.status);
      }
      const json = await respuesta.json();
      setDatos(json);
    } catch (error) {
      console.error(error);
    }
  }
  cargar();
}, [cca3]); // se vuelve a ejecutar si cambia cca3
```

### Leer parámetro de la ruta y navegar por código

```jsx
import { useParams, useNavigate } from 'react-router-dom';

const parametros = useParams();   // ruta "/country/:cca3"
const cca3 = parametros.cca3;
const navegar = useNavigate();
function manejarClickVolver() { navegar('/'); }
```

### Link con parámetro

```jsx
<Link to={'/country/' + cca3}>...</Link>
```

### Select controlado llenado desde la API

```jsx
const [monedaElegida, setMonedaElegida] = useState('');
function manejarCambioDeMoneda(evento) { setMonedaElegida(evento.target.value); }

<select value={monedaElegida} onChange={manejarCambioDeMoneda}>
  <option value="">Todas</option>
  {listaDeMonedas.map((moneda) => (
    <option key={moneda.code} value={moneda.code}>{moneda.code} - {moneda.name}</option>
  ))}
</select>
```

### Query string solo con filtros no vacíos

```js
const partes = [];
if (moneda !== '') partes.push('currency=' + encodeURIComponent(moneda));
if (lenguaje !== '') partes.push('language=' + encodeURIComponent(lenguaje));
if (zona !== '') partes.push('timezone=' + encodeURIComponent(zona));
let url = '/api/countries';
if (partes.length > 0) url = url + '?' + partes.join('&');
```

### Recorrer un objeto (currencies / languages / nativeName)

```js
const textos = [];
for (const codigo of Object.keys(pais.currencies)) {
  const moneda = pais.currencies[codigo];
  textos.push(moneda.name + ' (' + moneda.symbol + ')');
}
// textos.join(', ')  ->  "Euro (€)"
```

### Lista con .map y key

```jsx
<ul>
  {codigos.map((cca3) => <ItemPais key={cca3} cca3={cca3} />)}
</ul>
```

## 6. Plan de ataque en 2 horas

| Tiempo   | Paso |
|----------|------|
| 0-10 min | `npm install`, `npm start`, abrir `/ref/api` y probar los endpoints en el navegador. Mirar el JSON de un país para ver qué es objeto y qué es array. |
| 10-20 min| `App.jsx` con las dos rutas y componentes vacíos (`Home`, `PaginaPais`) que muestren un `<h1>`. Comprobar que navegan. |
| 20-40 min| `services/api.js` con `obtenerJson` y las 5 funciones. `Home` que pide `/api/countries` sin filtros y muestra la lista de códigos. |
| 40-55 min| `ItemPais`: bandera + fetch del nombre + `Link`. Ver que la lista muestra nombres. |
| 55-80 min| `PaginaPais`: `useParams`, fetch, mostrar nombres/capital/monedas/lenguajes/zonas (Object.keys). Botón volver con `useNavigate`. |
| 80-105 min| Los tres selects: cargar opciones, estados controlados, `useEffect` con dependencias, armar query string con `encodeURIComponent`. Probar combinando filtros y con una zona horaria con `+`. |
| 105-120 min| Manejo de cargando/error, casos borde (arrays vacíos), CSS mínimo, comentarios, README. |

Consejo: primero que TODO funcione feo, después el CSS. El CSS es opcional según el enunciado.
