# Apuntes: Parcial 2 - 2025 sem2 (vespertino) - Buscador de países (9 rutas)

> Formato 2025 (app desde casi cero, mock API en Vite, `fetch` a pelo). No es el formato 2026sem2.

Cómo correrlo: ver [README principal](../../README.md#cómo-correr-cada-cosa) (formato 2025: `cd web && npm install && npm start`).

## 1. Resumen del enunciado

App React (Vite + react-router-dom) para navegar países. El inicio tiene 4 enlaces:
por moneda, por lenguaje, por zona horaria y todos los países. Las vistas "por X" muestran
la lista de monedas / lenguajes / zonas horarias de la base, y cada elemento enlaza a una
lista de países filtrada por ese valor. Todas las listas de países son iguales (bandera +
nombre, enlace al detalle) y solo cambian título y origen de datos. El detalle muestra
nombres, capital, monedas, lenguajes y zonas horarias con un botón para volver al inicio.
El enunciado dice explícitamente: "muchas vistas muy similares, debería ser posible
reutilizar bastante código" → **eso es lo que evalúan**.

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

API: idéntica al [parcial matutino 2025](../2025sem2-parcial2-matutino/APUNTES-PARCIAL.md) (verificado con `diff` de
`mock-routes.js`): `/api/countries` devuelve solo códigos (filtros `currency=`, `language=`, `timezone=` combinables),
`/api/countries/URY` el objeto, `/api/currencies` `[{code,name,symbol}]`, `/api/languages` `[{code,name}]`,
`/api/timezones` strings sueltos, `/flags/URY.svg`.

## 2. Archivos creados / modificados

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

- **`ListaDePaises`** no sabe qué filtro se aplicó: recibe `titulo` y `url`, hace el fetch a `props.url` en un
  `useEffect([props.url])` y pinta un `ItemPais` por código. Lo usan 4 rutas.
- Las rutas con parámetro necesitan `useParams`, que solo funciona dentro del componente que renderiza la `<Route>`
  (no en `App.jsx`). Por eso hay 3 **envoltorios** de ~10 líneas, sin estado ni fetch propio:
  ```jsx
  function PaisesPorMoneda() {
    const parametros = useParams();               // ruta "/currencies/:currencyCode"
    const codigo = parametros.currencyCode;
    const url = '/api/countries?currency=' + encodeURIComponent(codigo);
    return <ListaDePaises titulo={'Countries with currency ' + codigo} url={url} />;
  }
  ```
- **`ListaDeOpciones`** hace lo mismo para las 3 listas de filtros. Como las APIs devuelven formas distintas
  (`{code,name,symbol}`, `{code,name}` y strings), tiene `obtenerCodigo(elemento)` / `obtenerTexto(elemento)` que usan
  `typeof elemento === 'string'`. Recibe `rutaBase` para armar `rutaBase + '/' + codigo`.
- Consejo: empezar por `ListaDePaises` genérico desde el principio; generalizar después cuesta más.

## 3. Trampas de ESTE parcial

1. **La lista devuelve solo códigos** → cada `ItemPais` hace su fetch a `/api/countries/BEL` con
   `useEffect([props.cca3])`; bandera directa `/flags/BEL.svg`.
2. **Dependencia `[props.url]` en `ListaDePaises`**: de `/currencies/EUR` a `/currencies/USD` el componente NO se
   desmonta; sin la dependencia queda la lista vieja (probado: 36 países EUR → 20 USD) → [tema 10](../../clase/10-useeffect.md) §10.5.
3. **`+` en la zona horaria, en dos lugares**:
   - En el **Link**: `'/timezones/' + encodeURIComponent('UTC+01:00')` → `/timezones/UTC%2B01%3A00`.
     `useParams()` lo devuelve ya decodificado: `"UTC+01:00"`.
   - En el **query string de la API** hay que volver a codificar; con el `+` crudo el servidor lee espacio → `[]`.
4. **Las tres listas de filtros tienen formas distintas** → `typeof` en un solo componente (3 casi iguales = menos puntos).
5. **Objetos vs arrays** y **casos borde** (`ATA`: `capital: []`, `currencies: {}`…) igual que el
   [matutino](../2025sem2-parcial2-matutino/APUNTES-PARCIAL.md#3-trampas-de-este-parcial) → `unirOGuion(lista)`.

## 4. Conceptos clave

- Componente reutilizable por props (`titulo`, `url`, `rutaBase`) → [tema 4](../../clase/04-props-y-children.md) y [tema 3](../../clase/03-componentes-y-jsx.md) §3.6.
- `useEffect([props.url])` → [tema 10](../../clase/10-useeffect.md).
- `obtenerJson` con `respuesta.ok`, `encodeURIComponent` → [tema 11](../../clase/11-api-fetch.md).
- `typeof`, `Object.keys` → [tema 2](../../clase/02-javascript-para-react.md).
- 9 rutas, envoltorios con `useParams`, `useNavigate('/')` ([tema 13](../../clase/13-router-rutas.md), [tema 14](../../clase/14-useparams-usenavigate.md)).
