# Segunda prueba 2026sem2

Segunda prueba del curso de Desarrollo Web y Mobile.

## Inicialización

Crear un _fork_ privado de este repositorio. Clonar el _fork_ y completar el ejercicio en la carpeta `web`. Entregar mediante un _pull request_ al repo _forkeado_, dentro de los plazos establecidos.

Durante la prueba se podrá usar todo material presente en la computadora, pero no se podrá conectar a Internet, ni usar asistentes de IA.

```bash
npm install
npm start
```

La aplicación queda disponible en <http://localhost:5173>. La API ya está implementada y no requiere conexión a Internet: se sirve desde el mismo servidor de desarrollo, con los datos de los 250 países en `web/data/db/data.json`.

## Ejercicio

Implementar un explorador de países con dos pantallas y una barra de navegación
compartida.

### 1. Listado de países — `/countries`

- Mostrar todos los países con su bandera, nombre, capital, región y población.
- La búsqueda, el orden y los filtros por región, idioma y moneda se resuelven
  **del lado del cliente**, sobre la lista que devuelve `GET /api/countries`, que se
  pide una sola vez.
- **Búsqueda** por nombre.
- **Orden** por nombre (A-Z), población (mayor a menor) y área (mayor a menor).
- **Filtro por región**, **por idioma** y **por moneda**. Las opciones de cada uno
  salen de `GET /api/regions`, `GET /api/languages` y `GET /api/currencies`, que ya
  vienen ordenadas y, en el caso de idiomas y monedas, con el nombre, el nombre
  nativo o el símbolo y la cantidad de países de cada valor.
- Los filtros se combinan entre sí: por ejemplo, el español se habla en 24 países,
  20 de ellos en `Americas`, y buscando `guat` entre esos 20 queda solamente
  Guatemala.
- **Favoritos**: cada país del listado permite marcarlo y desmarcarlo, y un control
  permite ver solamente los favoritos. Los favoritos se guardan en la API, por lo
  que deben sobrevivir a un refresh de la página.
- **Botón para limpiar los filtros**, que deja la búsqueda, el orden, los tres
  filtros y el de favoritos como al principio y la URL en `/countries`, sin _query
  params_. El botón se oculta o se deshabilita cuando no hay ningún filtro activo.
- Todo el estado de la pantalla (búsqueda, orden, los tres filtros y el de
  favoritos) debe quedar reflejado en la URL como _query params_ (por ejemplo
  `/countries?q=gu&region=Americas&language=es&sort=population`), de modo que al
  recargar la página o compartir el enlace se vea el mismo resultado.
- Indicar cuántos países se están mostrando sobre el total.
- **Estados vacíos**: cuando los filtros no dejan ningún país hay que avisarlo y
  ofrecer limpiar los filtros. El caso de tener el filtro de favoritos activo sin
  ningún favorito marcado lleva su propio mensaje, porque no se resuelve igual.
- Cada país del listado enlaza a su pantalla de detalle.

### 2. Detalle de un país — `/countries/:code`

- Mostrar nombre, nombre nativo, bandera, capital, región, subregión, población,
  área, densidad de población, idiomas, monedas, husos horarios y dominio de
  primer nivel.
- La **región, el idioma y la moneda son navegables**: al hacer clic en cualquiera
  de ellos se vuelve al listado filtrado por ese valor, por ejemplo
  `/countries?region=Americas` o `/countries?language=es`. Un país con varios
  idiomas o varias monedas tiene un enlace por cada uno.
- Listar los **países limítrofes** por su nombre y bandera. Al hacer clic en uno se
  navega al detalle de ese país, sin recargar la aplicación.
- Permitir marcarlo y desmarcarlo como **favorito**, igual que en el listado.
- Volver al listado. Si se llegó desde el listado, se deben conservar los filtros
  con los que se estaba mirando.

### 3. Un país al azar — `/countries/random`

- Muestra el detalle de un país elegido al azar entre los 250, con
  `GET /api/countries/random`, y se ve igual que la pantalla de detalle: desde ahí
  se puede seguir navegando a los limítrofes, a la región, al idioma o a la moneda.
- La URL se queda en `/countries/random`, así que **cada recarga sortea otro país**.
- El acceso de la barra de navegación también tiene que sortear otro país cuando ya
  se está parado en `/countries/random`, aunque la URL no cambie.
- El país que sale entra en la barra de últimos visitados, igual que cualquier otro.

### 4. Barra de navegación — últimos países visitados

- Una barra compartida por todas las pantallas muestra los **últimos 3 países que
  visitó el usuario**, con su bandera, del más reciente al más antiguo y sin
  repetidos: si se vuelve a entrar a uno que ya estaba, pasa al frente en lugar de
  duplicarse.
- Cada uno es un enlace a su detalle, y también va ahí el acceso a `/countries/random`.
- La lista se comparte con **Context API**: los componentes que la leen o la
  actualizan no la reciben por props desde `App`.
- Sobrevive a un refresh de la página, y hay que guardar lo necesario para
  dibujarla (bandera y nombre) sin volver a pedirle nada a la API.

### Casos a contemplar

- Países sin países limítrofes (son 84 de 250).
- Países sin capital (son 5) y países sin área (son 10, que además hay que ordenar).
- Países con más de un idioma (son 83) o con más de una moneda (son 19).
- Un código de país inexistente en la URL, por ejemplo `/countries/XYZ`.
- Una combinación de filtros que no deja ningún país, por ejemplo moneda `JPY` en
  la región `Africa`, y el filtro de favoritos activo sin ningún favorito marcado.
- La primera visita, con la barra de últimos países todavía vacía, y la segunda,
  con un solo país en la barra.
- Las regiones no son las cinco de siempre: el dataset trae ocho, con `Antarctic`,
  `Antarctic Ocean` y `Polar` con un solo país cada una.
- Los estados de carga y de error de cada pedido a la API.
- `npm run lint` debe correr sin advertencias.

## API

Todos los códigos de país son **alpha-3** en mayúsculas (`URY`, `ARG`, `BRA`), que es
el mismo formato en el que vienen los países limítrofes en el campo `borders`. Los
códigos de idioma son ISO 639-1 en minúsculas (`es`, `en`) y los de moneda ISO 4217
en mayúsculas (`UYU`, `EUR`).

| Método   | Ruta                        | Descripción |
| -------- | --------------------------- | ----------- |
| `GET`    | `/api/countries`            | Listado de los 250 países, con los campos `code`, `name`, `flag`, `capital`, `region`, `subregion`, `population`, `area`, `languages` y `currencies`. Con esto alcanza para buscar, ordenar y filtrar sin volver a pedir nada. |
| `GET`    | `/api/countries/random`     | Los datos completos de uno de los 250 países, elegido al azar en cada pedido. |
| `GET`    | `/api/countries/:code`      | Datos completos de un país: agrega `alpha2Code`, `nativeName`, `populationDensity`, `independent`, `borders`, `timezones` y `topLevelDomain`. Responde `404` si el código no existe. |
| `GET`    | `/api/regions`              | Las 8 regiones del dataset, ordenadas alfabéticamente. |
| `GET`    | `/api/languages`            | Los 122 idiomas, como `[{ "code": "es", "name": "Spanish", "nativeName": "Español", "countries": 24 }]`, ordenados por nombre. |
| `GET`    | `/api/currencies`           | Las 163 monedas, como `[{ "code": "UYU", "name": "Uruguayan peso", "symbol": "$", "countries": 1 }]`, ordenadas por código. |
| `GET`    | `/api/favorites`            | Favoritos guardados, como `[{ "code": "URY", "date": "…" }]`. |
| `PUT`    | `/api/favorites`            | Agrega un favorito. Recibe `{ "code": "URY" }`. Responde `400` si falta el código y `404` si el país no existe. Si ya era favorito, no lo duplica. |
| `DELETE` | `/api/favorites/:code`      | Quita un favorito. Responde `404` si no estaba marcado. |

Ejemplo de respuesta de `GET /api/countries/URY`:

```json
{
  "code": "URY",
  "alpha2Code": "UY",
  "name": "Uruguay",
  "nativeName": "Uruguay",
  "flag": "🇺🇾",
  "capital": "Montevideo",
  "region": "Americas",
  "subregion": "South America",
  "population": 3473727,
  "area": 181034,
  "populationDensity": 19.19,
  "independent": true,
  "borders": ["ARG", "BRA"],
  "languages": [{ "code": "es", "name": "Spanish", "nativeName": "Español" }],
  "currencies": [{ "code": "UYU", "name": "Uruguayan peso", "symbol": "$" }],
  "timezones": ["UTC-03:00"],
  "topLevelDomain": [".uy"]
}
```

La API está implementada en `web/data/mock-routes.js` y los datos en
`web/data/db/data.json`, validados por `web/data/db/schema.json`. **No es necesario
modificar ninguno de esos archivos**, pero se pueden leer para entender las respuestas.

La carpeta `bruno` tiene una colección de [Bruno](https://www.usebruno.com/) con
todos los _endpoints_ y sus casos de error, para probar la API por separado mientras
corre `npm start`.
