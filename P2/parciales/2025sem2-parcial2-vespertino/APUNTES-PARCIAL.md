# Apuntes: Parcial 2 - 2025 sem2 (vespertino) - Buscador de países (9 rutas)

## 1. Resumen del enunciado

App React (Vite + react-router-dom) para navegar países. El inicio tiene 4 enlaces:
por moneda, por lenguaje, por zona horaria y todos los países. Las vistas "por X" muestran
la lista de monedas / lenguajes / zonas horarias de la base, y cada elemento enlaza a una
lista de países filtrada por ese valor. Todas las listas de países son iguales (bandera +
nombre, enlace al detalle) y solo cambian título y origen de datos. El detalle muestra
nombres, capital, monedas, lenguajes y zonas horarias con un botón para volver al inicio.
El enunciado dice explícitamente: "muchas vistas muy similares, debería ser posible
reutilizar bastante código" → eso es lo que evalúan.

### Tabla de rutas de la app

| # | Ruta                         | Componente en `App.jsx`                                     | Qué muestra                                        |
|---|------------------------------|-------------------------------------------------------------|----------------------------------------------------|
| 1 | `/`                          | `Home`                                                      | 4 enlaces                                           |
| 2 | `/countries`                 | `<ListaDePaises titulo="All countries" url="/api/countries" />` | Todos los países                                |
| 3 | `/countries/:cca3`           | `PaginaPais`                                                | Detalle + botón "Back to list"                      |
| 4 | `/currencies`                | `<ListaDeOpciones url="/api/currencies" rutaBase="/currencies" />` | Lista "EUR - Euro - €" con enlace            |
| 5 | `/currencies/:currencyCode`  | `PaisesPorMoneda` → `ListaDePaises`                         | Países con esa moneda                               |
| 6 | `/languages`                 | `<ListaDeOpciones url="/api/languages" rutaBase="/languages" />` | Lista "fra - French" con enlace                |
| 7 | `/languages/:languageCode`   | `PaisesPorLenguaje` → `ListaDePaises`                       | Países con ese lenguaje                             |
| 8 | `/timezones`                 | `<ListaDeOpciones url="/api/timezones" rutaBase="/timezones" />` | Lista "UTC-03:00" con enlace                   |
| 9 | `/timezones/:timezone`       | `PaisesPorZonaHoraria` → `ListaDePaises`                    | Países con esa zona horaria                         |

### Endpoints de la API (iguales al matutino, verificado con `diff` de `mock-routes.js`)

| Endpoint                                     | Devuelve                                     |
|----------------------------------------------|----------------------------------------------|
| `GET /api/countries`                         | **Solo códigos**: `["ABW","AFG",...]`        |
| `GET /api/countries?currency=EUR`            | Códigos filtrados (también `language=` y `timezone=`, combinables) |
| `GET /api/countries/URY`                     | Objeto completo del país                     |
| `GET /api/currencies`                        | `[{ code, name, symbol }]`                   |
| `GET /api/languages`                         | `[{ code, name }]`                           |
| `GET /api/timezones`                         | `["UTC-04:00", "UTC+01:00", ...]` (strings)  |
| `GET /flags/URY.svg`                         | Bandera (carpeta pública)                    |

Forma del objeto país: `name.common`, `name.official`, `name.nativeName` (OBJETO),
`capital` (array), `currencies` (OBJETO), `languages` (OBJETO), `timezones` (array), `flag.svg`.

## 2. Cómo correrlo

```bash
cd web
npm install
npm start          # http://localhost:5173
```

Si `npm install` avisa de `allow-scripts` con esbuild: `npm approve-scripts esbuild --yes && npm rebuild esbuild`.

## 3. Estructura de archivos que creé / modifiqué

```
web/src/
├── components/
│   ├── App.jsx                  # Las 9 rutas. Las rutas 2, 4, 6 y 8 usan los componentes
│   │                            #   reutilizables DIRECTAMENTE con props distintas.
│   ├── Home.jsx                 # 4 <Link>
│   ├── ListaDePaises.jsx        # REUTILIZABLE: props.titulo + props.url → fetch → lista de ItemPais
│   ├── ListaDeOpciones.jsx      # REUTILIZABLE: props.titulo + props.url + props.rutaBase → lista de Links
│   ├── ItemPais.jsx             # Un país: fetch propio para el nombre, bandera por url, Link al detalle
│   ├── PaisesPorMoneda.jsx      # useParams().currencyCode → <ListaDePaises url="/api/countries?currency=..."/>
│   ├── PaisesPorLenguaje.jsx    # useParams().languageCode → <ListaDePaises url="/api/countries?language=..."/>
│   ├── PaisesPorZonaHoraria.jsx # useParams().timezone → <ListaDePaises url="/api/countries?timezone=..."/>
│   ├── PaginaPais.jsx           # Detalle con useParams + Object.keys + useNavigate('/')
│   └── ApiRef.jsx               # (plantilla, sin tocar)
├── services/
│   └── api.js                   # obtenerJson(url) genérico + obtenerPais(cca3)
└── index.css                    # Estilos mínimos
```

### Cómo se logra la reutilización (lo que evalúan)

- **`ListaDePaises`** no sabe qué filtro se aplicó: solo recibe `titulo` y `url`. Hace el
  fetch a `props.url` en un `useEffect` con dependencia `[props.url]` y pinta un `ItemPais` por
  código. Lo usan 4 rutas distintas.
- Las rutas con parámetro necesitan leer la URL con `useParams`, y eso solo se puede hacer
  dentro de un componente. Por eso hay 3 componentes "envoltorio" de ~10 líneas
  (`PaisesPorMoneda`, etc.) que leen el parámetro, arman la url de la API y devuelven
  `<ListaDePaises titulo=... url=... />`. No tienen estado ni fetch propio.
- **`ListaDeOpciones`** hace lo mismo para las 3 listas de filtros. Como las 3 APIs devuelven
  formas distintas (`{code,name,symbol}`, `{code,name}` y strings), tiene dos funciones
  internas `obtenerCodigo(elemento)` y `obtenerTexto(elemento)` que usan `typeof elemento
  === 'string'` para decidir. Recibe `rutaBase` para armar el enlace `rutaBase + '/' + codigo`.
- **`api.js`** tiene un `obtenerJson(url)` único que comprueba `respuesta.ok` y lanza `Error`.

## 4. Dónde estaba lo difícil (trampas)

1. **La lista devuelve solo códigos.** `GET /api/countries?...` responde `["BEL","FRA"]`.
   Para mostrar el nombre cada `ItemPais` hace su propio fetch a `/api/countries/BEL` en un
   `useEffect([props.cca3])`. Mientras carga muestra el código. La bandera se arma con
   `/flags/BEL.svg` sin esperar.
2. **Dependencia `[props.url]` en `ListaDePaises`.** Si vas de `/currencies/EUR` a
   `/currencies/USD` (misma `<Route>`), React Router NO desmonta el componente: solo cambia la
   prop. Sin la dependencia el efecto no se re-ejecuta y se queda la lista vieja. Lo probé:
   con la dependencia, cambia correctamente (36 países EUR → 20 países USD).
3. **`+` en la zona horaria.** Dos lugares:
   - En el **Link**: `'/timezones/' + encodeURIComponent('UTC+01:00')` → `/timezones/UTC%2B01%3A00`.
     `useParams()` lo devuelve ya decodificado: `"UTC+01:00"`.
   - En el **query string de la API**: hay que volver a codificar:
     `'/api/countries?timezone=' + encodeURIComponent(zonaHoraria)`. Si se manda el `+` crudo
     el servidor lo lee como espacio y devuelve `[]` (verificado con curl).
4. **Las tres listas de filtros tienen formas distintas.** Monedas y lenguajes son objetos
   con `code`; zonas horarias son strings sueltos. Un componente genérico tiene que
   contemplarlo (con `typeof`) o hacer 3 componentes casi iguales (menos puntos por repetir).
5. **`currencies`, `languages`, `name.nativeName` son OBJETOS.** `Object.keys(objeto)` +
   `for...of` para armar arrays de texto. `capital` y `timezones` sí son arrays → `join(', ')`.
6. **Casos borde en los datos.** Hay países con `capital: []`, `currencies: {}`, `languages: {}`,
   `nativeName: {}` (ej: `ATA` Antártida). Auxiliar `unirOGuion(lista)` que devuelve `"-"`.
7. **404 en código inexistente.** `obtenerJson` lanza `Error` si `!respuesta.ok`; el `try/catch`
   del componente lo convierte en mensaje. Sin esto `pais.name.common` explota.
8. **`useParams` solo funciona dentro de un componente renderizado por una `<Route>`.** No se
   puede llamar en `App.jsx` para armar la url; por eso existen los envoltorios.
9. **Sin `&&` para render.** Variable `contenido` con `if / else if / else` y returns tempranos.

## 5. Lo más importante para repetir en el parcial

### Componente reutilizable que recibe la URL por props

```jsx
function ListaDePaises(props) {
  const [codigos, setCodigos] = useState([]);
  useEffect(() => {
    async function cargar() {
      try {
        const datos = await obtenerJson(props.url);
        setCodigos(datos);
      } catch (error) { console.error(error); }
    }
    cargar();
  }, [props.url]); // si cambia la url, se vuelve a pedir
  return (
    <div>
      <h1>{props.titulo}</h1>
      <ul>{codigos.map((cca3) => <ItemPais key={cca3} cca3={cca3} />)}</ul>
    </div>
  );
}
```

### Envoltorio con useParams que reutiliza el componente

```jsx
function PaisesPorMoneda() {
  const parametros = useParams();               // ruta "/currencies/:currencyCode"
  const codigo = parametros.currencyCode;
  const url = '/api/countries?currency=' + encodeURIComponent(codigo);
  return <ListaDePaises titulo={'Countries with currency ' + codigo} url={url} />;
}
```

### Ruta que usa el componente reutilizable directamente

```jsx
<Route path="/countries" element={<ListaDePaises titulo="All countries" url="/api/countries" />} />
<Route path="/currencies/:currencyCode" element={<PaisesPorMoneda />} />
```

### Link con parámetro codificado

```jsx
<Link to={'/timezones/' + encodeURIComponent(zona)}>{zona}</Link>
```

### Fetch con comprobación de ok

```js
async function obtenerJson(url) {
  const respuesta = await fetch(url);
  if (!respuesta.ok) { throw new Error('Error ' + respuesta.status); }
  return await respuesta.json();
}
```

### Recorrer objeto

```js
const textos = [];
for (const codigo of Object.keys(pais.currencies)) {
  textos.push(pais.currencies[codigo].name + ' (' + pais.currencies[codigo].symbol + ')');
}
```

### Volver al inicio con botón

```jsx
const navegar = useNavigate();
function manejarClickVolver() { navegar('/'); }
<button onClick={manejarClickVolver}>Back to list</button>
```

## 6. Plan de ataque en 2 horas

| Tiempo     | Paso |
|------------|------|
| 0-10 min   | `npm install`, `npm start`, probar los endpoints en `/ref/api`. Mirar un país en JSON. |
| 10-20 min  | `App.jsx` con las 9 rutas apuntando a componentes vacíos con `<h1>`. `Home` con los 4 `Link`. Verificar que navegan. |
| 20-40 min  | `api.js` (`obtenerJson`, `obtenerPais`). `ListaDePaises` con `titulo` + `url` mostrando códigos. Usarlo en `/countries`. |
| 40-55 min  | `ItemPais` con bandera + fetch del nombre + `Link` a `/countries/:cca3`. |
| 55-75 min  | `PaginaPais` (useParams, Object.keys, useNavigate). |
| 75-95 min  | `ListaDeOpciones` con `typeof` y `encodeURIComponent`; usarlo en `/currencies`, `/languages`, `/timezones`. |
| 95-105 min | Los 3 envoltorios `PaisesPor...` que arman la url y reutilizan `ListaDePaises`. Probar una zona horaria con `+`. |
| 105-120 min| Cargando/error, casos borde, CSS mínimo, comentarios, README. |

Consejo: empezar por `ListaDePaises` genérico desde el principio. Si primero se hace una
lista "a mano" para `/countries` y después se intenta generalizar, se pierde tiempo.
