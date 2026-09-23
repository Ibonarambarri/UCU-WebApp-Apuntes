# Apuntes: Simulacro parcial 2 (2025 sem 2, matutino) — "Country Trivia"

> Formato 2025 (mock API en Vite, `fetch` a pelo). No es el formato 2026sem2.

Cómo correrlo: ver [README principal](../../README.md#cómo-correr-cada-cosa) (formato 2025: `cd web && npm install && npm start`).

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

## 2. Archivos creados

```
web/src/
├── components/
│   ├── App.jsx              Router (BrowserRouter/Routes/Route) envuelto en ProveedorPuntaje
│   ├── Home.jsx             La trivia: useEffect [numeroDeRonda], azar, 4 BotonBandera, puntaje
│   ├── BotonBandera.jsx     Botón "tonto" con una <img>; avisa al padre con alPresionar(cca3); clase correcta/incorrecta por props
│   └── PaginaPais.jsx       Detalle: useParams, useEffect [cca3], Object.keys sobre objetos
├── context/
│   └── ContextoPuntaje.jsx  createContext + ProveedorPuntaje (puntaje, sumarPunto, restarPunto)
├── services/
│   └── api.js               obtenerCodigosDePaises(), obtenerPais(cca3) con fetch + respuesta.ok
├── utils/
│   └── azar.js              elegirAlAzar, mezclarArray, elegirVariosDistintos
└── index.css                Estilos simples (flex para banderas y para bandera+mapa)
```

## 3. Dónde estaba lo difícil (propio de este parcial)

### a) Azar y mezclado (`utils/azar.js`)
Elegir 3 distintos del correcto con un `while` + `includes`; mezclar una **copia** (Fisher-Yates), nunca
`sort(() => Math.random() - 0.5)` → [tema 2](../../clase/02-javascript-para-react.md).

### b) El puntaje se perdía al navegar → Context
Al ir a `/country/URY` el router **desmonta** `Home` y su `useState` se destruye. El puntaje vive en
`ContextoPuntaje`, con el `Provider` en `App` por encima del `BrowserRouter` (nunca se desmonta). El enlace de vuelta
es `<Link>`: un `<a href>` recargaría la página y el Context volvería a 0. (Context: [tema 16](../../clase/16-context.md).)

### c) "Otro desafío" sin recargar → estado gatillo
`numeroDeRonda` en las dependencias: `useEffect(() => {...}, [numeroDeRonda])`; el botón hace
`setNumeroDeRonda(numeroDeRonda + 1)`. Nada de `window.location.reload()` → [tema 10](../../clase/10-useeffect.md).

### d) Datos incompletos del mock
- Países sin `map`: en `Home` se vuelve a sortear hasta encontrar uno con mapa (`while (paisElegido === null)`); en `PaginaPais` se muestra un texto si no hay.
- `flag.alt` vacío: `alt` de reserva (`'Bandera de ' + nombre`).
- `name.nativeName` = `{ spa: { official, common } }` → `Object.keys(pais.name.nativeName)`; el nombre del idioma sale de `pais.languages[clave]`.

### e) Un solo estado "ya respondió"
`respuestaElegida` (null o cca3) alcanza para: deshabilitar los botones, mostrar el mensaje bien/mal, envolver el mapa
en el `Link`, elegir la clase de cada `BotonBandera` y mostrar "Otro desafío". Se resetea a `null` al empezar la ronda
→ [tema 9](../../clase/09-estado-derivado.md).

## 4. Conceptos clave

- Botón "tonto" que avisa al padre (`alPresionar(cca3)`) → [tema 4](../../clase/04-props-y-children.md).
- `useEffect` con estado gatillo y con `[cca3]` → [tema 10](../../clase/10-useeffect.md).
- `fetch` + `respuesta.ok` → [tema 11](../../clase/11-api-fetch.md).
- Ternario con `null` para "Otro desafío" → [tema 5](../../clase/05-listas-y-condicionales.md).
- Context que sobrevive a la navegación ([tema 16](../../clase/16-context.md)); `<Link>` vs `<a>` ([tema 13](../../clase/13-router-rutas.md)).
