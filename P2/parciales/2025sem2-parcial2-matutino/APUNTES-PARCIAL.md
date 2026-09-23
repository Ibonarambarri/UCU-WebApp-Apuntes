# Apuntes: Parcial 2 - 2025 sem2 (matutino) - Buscador de países

> Formato 2025 (app desde casi cero, mock API en Vite, `fetch` a pelo). No es el formato 2026sem2.

Cómo correrlo: ver [README principal](../../README.md#cómo-correr-cada-cosa) (formato 2025: `cd web && npm install && npm start`).

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

## 2. Archivos creados / modificados

```
web/src/
├── components/
│   ├── App.jsx          # Router: "/" -> Home, "/country/:cca3" -> PaginaPais
│   ├── Home.jsx         # Página de inicio: 3 selects + lista. 2 useEffect (opciones, países)
│   ├── ItemPais.jsx     # Un ítem de la lista: pide SU país para saber el nombre, muestra bandera + Link
│   ├── PaginaPais.jsx   # Detalle: useParams + fetch + recorrer objetos + botón useNavigate('/')
│   └── ApiRef.jsx       # (plantilla, sin tocar)
├── services/
│   └── api.js           # obtenerJson(url) + obtenerMonedas, obtenerLenguajes,
│                        #   obtenerZonasHorarias, obtenerPaises(moneda, lenguaje, zona), obtenerPais(cca3)
└── index.css            # Estilos mínimos (tarjetas, banderas, filtros en fila)
```

- **`Home.jsx`**: 3 estados para las listas de opciones, 3 para el valor elegido de cada select, 1 con los
  códigos de países, más `estaCargando` y `mensajeDeError`. Efecto de opciones con `[]`; efecto de la lista
  con `[monedaElegida, lenguajeElegido, zonaHorariaElegida]` (no hace falta llamar al fetch desde el `onChange`).
- **`ItemPais.jsx`**: recibe `props.cca3`, hace su propio `useEffect([props.cca3])` + `obtenerPais` y guarda
  `name.common`; mientras carga muestra el código. La bandera sale directo de `/flags/${cca3}.svg`.
- **`PaginaPais.jsx`**: `useParams().cca3`, `useEffect([cca3])`, returns tempranos, `Object.keys` + `for...of`
  para `nativeName`, `currencies` y `languages`.

## 3. Trampas de ESTE parcial

1. **La lista devuelve solo códigos** (`["ARG","BRA",...]`) → `ItemPais` con fetch propio por ítem
   (250 requests a un mock local: es lo que el enunciado espera).
2. **`currencies`, `languages` y `name.nativeName` son OBJETOS** → `Object.keys(obj)` + `for...of`;
   `capital` y `timezones` son arrays → `.join(', ')`.
3. **El `+` de las zonas horarias**: `UTC+01:00` sin codificar llega como `UTC 01:00` → `[]`.
   `encodeURIComponent(valor)` → `UTC%2B01%3A00` (comprobado con curl).
4. **Filtros combinados y opción "Todas"**: value `""` = sin filtro; solo se agregan al query string los
   no vacíos (si no, el mock filtra por string vacío). Array de partes `clave=valor` + `.join('&')`:
   ```js
   const partes = [];
   if (moneda !== '') partes.push('currency=' + encodeURIComponent(moneda));
   if (lenguaje !== '') partes.push('language=' + encodeURIComponent(lenguaje));
   if (zona !== '') partes.push('timezone=' + encodeURIComponent(zona));
   let url = '/api/countries';
   if (partes.length > 0) url = url + '?' + partes.join('&');
   ```
5. **Casos borde**: `capital: []`, `currencies: {}`, `languages: {}`, `nativeName: {}` (ej. Antártida `ATA`)
   → `unirOGuion(lista)` devuelve `"-"`.
6. **Código inexistente → 404**: sin `respuesta.ok`, `respuesta.json()` da `{ error: "..." }` y explota al leer
   `pais.name.common` → [tema 11](../../clase/11-api-fetch.md).

## 4. Conceptos clave

- Selects controlados con opciones de la API → [tema 8](../../clase/08-formularios-controlados.md).
- `useEffect` con dependencias de los filtros / de `cca3` → [tema 10](../../clase/10-useeffect.md).
- `fetch` a pelo + `respuesta.ok` + `encodeURIComponent` → [tema 11](../../clase/11-api-fetch.md).
- `Object.keys` sobre objetos, `join` en arrays → [tema 2](../../clase/02-javascript-para-react.md).
- Render condicional con variable `contenidoDeLaLista` / returns tempranos → [tema 5](../../clase/05-listas-y-condicionales.md).
- `useParams` / `useNavigate('/')` ([tema 14](../../clase/14-useparams-usenavigate.md)).
