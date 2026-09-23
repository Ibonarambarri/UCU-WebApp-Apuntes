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

Implementar un explorador de países con dos pantallas.

### 1. Listado de países — `/countries`

- Mostrar todos los países con su bandera, nombre, capital, región y población.
- **Búsqueda** por nombre, filtrada del lado del cliente sobre la lista ya cargada
- **Orden** por nombre (A-Z), población (mayor a menor) y área (mayor a menor).
- **Favoritos** _(opcional)_: cada país del listado permite marcarlo y desmarcarlo,
  y un control permite ver solamente los favoritos. Los favoritos se guardan en la
  API, por lo que deben sobrevivir a un refresh de la página.
- El estado de búsqueda y orden debe quedar reflejado en la URL como _query params_
  (por ejemplo `/countries?q=uru&sort=population`), de modo que al recargar la
  página o compartir el enlace se vea el mismo resultado.
- Indicar cuántos países se están mostrando sobre el total, y avisar cuando la
  búsqueda no deja ninguno.
- Cada país del listado enlaza a su pantalla de detalle.

### 2. Detalle de un país — `/countries/:code`

- Mostrar nombre, nombre nativo, bandera, capital, región, subregión, población,
  área, densidad de población, idiomas, monedas, husos horarios y dominio de
  primer nivel.
- _(Opcional)_ Permitir marcarlo y desmarcarlo como favorito, igual que en el listado.
- Listar los **países limítrofes** por su nombre y bandera. Al hacer clic en uno se
  navega al detalle de ese país, sin recargar la aplicación.
- Volver al listado.

### Casos a contemplar

- Países sin países limítrofes (son 84 de 250).
- Países sin capital (son 5).
- Un código de país inexistente en la URL, por ejemplo `/countries/XYZ`.
- Los estados de carga y de error de cada pedido a la API.
- `npm run lint` debe correr sin advertencias.

## API

Todos los códigos de país son **alpha-3** en mayúsculas (`URY`, `ARG`, `BRA`), que es
el mismo formato en el que vienen los países limítrofes en el campo `borders`.

| Método   | Ruta                        | Descripción |
| -------- | --------------------------- | ----------- |
| `GET`    | `/api/countries`            | Listado de los 250 países, con los campos `code`, `name`, `flag`, `capital`, `region`, `subregion`, `population` y `area`. |
| `GET`    | `/api/countries/:code`      | Datos completos de un país. Responde `404` si el código no existe. |
| `GET`    | `/api/regions`              | _(No se usa en el ejercicio)_ Regiones disponibles, ordenadas alfabéticamente. |
| `GET`    | `/api/favorites`            | _(Parte opcional)_ Favoritos guardados, como `[{ "code": "URY", "date": "…" }]`. |
| `PUT`    | `/api/favorites`            | _(Parte opcional)_ Agrega un favorito. Recibe `{ "code": "URY" }`. Responde `400` si falta el código y `404` si el país no existe. Si ya era favorito, no lo duplica. |
| `DELETE` | `/api/favorites/:code`      | _(Parte opcional)_ Quita un favorito. Responde `404` si no estaba marcado. |

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

La interacción con la API puede realizarse mediante la función fetchJSON, disponible en web/src/utils/fetch.js. Por defecto, la función realiza pedidos GET. Para utilizar otros métodos HTTP necesarios para el ejercicio, como PUT o DELETE, se puede proporcionar el parámetro opcional options, indicando allí el método y, cuando corresponda, el cuerpo (body) del pedido.

## Diseño

El diseño de la aplicación es libre, siempre que se cumplan los requisitos establecidos en la consigna. Como guía, se incluye un diseño en specs/design.svg, que puede utilizarse como referencia.

