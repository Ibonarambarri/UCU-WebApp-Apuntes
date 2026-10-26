# Simulacro prueba 3 2026sem2 — Higher / Lower

Simulacro de la tercera prueba del curso de Desarrollo Web y Mobile.

## Inicialización

Crear un _fork_ privado de este repositorio. Clonar el _fork_, ejecutar `npm i` en la raíz y completar el ejercicio en la carpeta `mobile`. La versión de desarrollo de la app se levanta haciendo `npm start` en la raíz, lo cual levanta tanto el _frontend_ con Expo como el _backend_ de prueba. Entregar mediante un _pull request_ al repo _forkeado_, dentro de los plazos establecidos.

Durante la prueba se podrá usar todo material presente en la computadora, pero no se podrá conectar a Internet, ni usar asistentes de IA.

```bash
npm install
npm start
```

La app se puede probar de cualquiera de estas formas:

- **Web**: apretar `w` en la terminal de Expo, o abrir <http://localhost:8081>.
- **Celular**: escanear el código QR con la app Expo Go (Android) o con la cámara
  (iOS). El celular tiene que estar en la misma red que la computadora.
- **Emulador**: apretar `a` (Android) o `i` (iOS), si hay uno instalado.

La API ya está implementada y no requiere conexión a Internet: se sirve desde el mismo servidor de desarrollo de Expo, con los datos de los 250 países en `mobile/data/db/data.json`.

## Ejercicio

Implementar el juego **Higher / Lower** de países. Se muestran dos países y hay que
adivinar si el segundo tiene **más** o **menos** que el primero. En cada ronda la
pregunta es por la **población** o por la **superficie**, según lo que sortee la API.
Cada acierto suma un punto y el país revelado pasa a ser el de referencia contra un
país nuevo. El primer error termina la partida.

Toda la lógica del juego (el sorteo de los países y del tipo de pregunta, la
corrección y el puntaje) ya está en la API: la aplicación crea la partida, manda las
respuestas y muestra lo que la API devuelve.

La plantilla ya trae la navegación con Expo Router y las dos pantallas a completar:
`mobile/app/index.jsx` y `mobile/app/games/[id].jsx`.

### 1. Inicio — `/`

- Un campo para el nombre del jugador y un botón **Jugar**, deshabilitado mientras
  el nombre esté vacío o tenga solamente espacios. Al jugar se crea la partida con
  `POST /api/games` y se navega a `/games/:id`.
- Un **ranking** con las mejores partidas, de `GET /api/ranking`: posición, jugador y
  puntaje.

### 2. Partida — `/games/:id`

- Al entrar se pide la partida con `GET /api/games/:id`. Como el estado vive en la
  API, **al recargar la app (o la página, en web) se sigue en la misma ronda**.
- Mostrar el jugador, el puntaje y los dos países con su bandera y su nombre.
- La pregunta de la ronda depende del campo `stat` de la partida, por ejemplo
  _¿Paraguay tiene más o menos habitantes que Uruguay?_ o _¿Paraguay tiene más o
  menos superficie que Uruguay?_
- Del país actual se muestra el valor de esa ronda con su unidad (`3.473.727
  habitantes` o `181.034 km²`); del siguiente, un `?`.
- Botones **Más** y **Menos**, que mandan `POST /api/games/:id/guess` con `higher` o
  `lower`. Mientras se espera la respuesta no se puede volver a responder.
- Con la respuesta se muestra el valor del país revelado y si se acertó o no:
  - Si se acertó, un botón **Siguiente** pasa a la próxima ronda, con la partida
    que devolvió la API.
  - Si no, la partida terminó: mostrar el puntaje final, un botón **Jugar de nuevo**
    que crea una partida nueva con el mismo jugador y un botón para volver al inicio.
- Si se entra a una partida que ya terminó, se muestra directamente su resultado,
  con los dos últimos países y sin los botones para responder.

### Casos a contemplar

- El resultado de una ronda se muestra con el tipo de pregunta **de esa ronda**,
  aunque la partida que devolvió la API ya traiga el de la siguiente.
- Una partida inexistente, por ejemplo `/games/9999`.
- Los valores se muestran con separador de miles (`3.473.727`). Hay superficies con
  decimales, como la del Vaticano (`0,44 km²`).
- **Jugar de nuevo** cambia de partida sin recargar la aplicación: la pantalla tiene
  que mostrar la partida nueva y no quedarse con el resultado de la anterior.
- Los estados de carga y de error de cada pedido a la API.
- `npm run lint` debe correr sin advertencias.

## API

Todos los códigos de país son **alpha-3** en mayúsculas (`URY`, `ARG`, `BRA`).

| Método   | Ruta                        | Descripción |
| -------- | --------------------------- | ----------- |
| `POST`   | `/api/games`                | Crea una partida. Recibe `{ "player": "Bruno" }` y responde la partida nueva, con dos países sorteados. Responde `400` si falta el nombre o está vacío. |
| `GET`    | `/api/games/:id`            | La partida. Responde `404` si no existe. |
| `POST`   | `/api/games/:id/guess`      | Responde la ronda actual. Recibe `{ "guess": "higher" }` o `{ "guess": "lower" }`. Responde `400` si la respuesta no es ninguna de las dos y `409` si la partida ya terminó. |
| `GET`    | `/api/ranking`              | Las 10 mejores partidas terminadas, como `[{ "id": 1, "player": "Ayrton Senna", "score": 7, "finishedAt": "…" }]`, ordenadas por puntaje de mayor a menor. |
| `DELETE` | `/api/games/:id`            | _(No se usa en el ejercicio)_ Borra una partida. |

Una partida tiene esta forma (`GET /api/games/6`):

```json
{
  "id": 6,
  "player": "Bruno",
  "status": "playing",
  "score": 2,
  "stat": "area",
  "current": { "code": "URY", "name": "Uruguay", "flag": "🇺🇾", "flagUrl": "/static/flags/URY.png", "population": 3473727, "area": 181034 },
  "next": { "code": "PRY", "name": "Paraguay", "flag": "🇵🇾", "flagUrl": "/static/flags/PRY.png" },
  "createdAt": "2026-10-24T11:30:46.726Z",
  "finishedAt": null
}
```

- `status` es `playing` mientras se juega y `lost` cuando se erra. Si se acertaran
  todos los países, la partida terminaría con `won`.
- `stat` es el tipo de pregunta de la ronda actual: `population` (habitantes) o
  `area` (superficie en km²). La API lo sortea en cada ronda nueva.
- Mientras la partida está en curso, `next` **no trae la población ni la
  superficie**: la respuesta recién se conoce al contestar. Cuando la partida
  terminó, `next` es el país en el que se erró y sí las trae, y `stat` es el tipo de
  la ronda en la que se erró.
- Si los dos valores son iguales, cualquier respuesta es correcta.
- La bandera viene como emoji (`flag`) y como imagen PNG (`flagUrl`). Los emojis de
  banderas no se ven en todas las plataformas (por ejemplo en Windows), así que se
  recomienda usar la imagen.

`POST /api/games/6/guess` con `{ "guess": "higher" }` responde:

```json
{
  "guess": "higher",
  "stat": "area",
  "correct": true,
  "revealed": { "code": "PRY", "name": "Paraguay", "flag": "🇵🇾", "flagUrl": "/static/flags/PRY.png", "population": 7132530, "area": 406752 },
  "game": {
    "id": 6,
    "player": "Bruno",
    "status": "playing",
    "score": 3,
    "stat": "population",
    "current": { "code": "PRY", "name": "Paraguay", "flag": "🇵🇾", "flagUrl": "/static/flags/PRY.png", "population": 7132530, "area": 406752 },
    "next": { "code": "ISL", "name": "Iceland", "flag": "🇮🇸", "flagUrl": "/static/flags/ISL.png" },
    "createdAt": "2026-10-24T11:30:46.726Z",
    "finishedAt": null
  }
}
```

- `stat` es el tipo de la ronda que **se acaba de responder**, y `revealed` es el
  país que estaba oculto, ahora con sus valores.
- `game` es la partida ya actualizada: si se acertó, el país revelado pasó a ser
  `current`, hay un `next` nuevo y `game.stat` es el tipo de la ronda siguiente,
  que puede ser distinto.

La API está implementada en `mobile/app/api` y `mobile/data/games.js`, y los datos en
`mobile/data/db/data.json`, validados por `mobile/data/db/schema.json`. **No es
necesario modificar ninguno de esos archivos**, pero se pueden leer para entender las
respuestas. El _seed_ trae cinco partidas terminadas, para que el ranking no arranque
vacío. Los 10 países sin superficie en el dataset no participan del juego.

## Útiles

La interacción con la API puede realizarse mediante la función `fetchJSON`, disponible
en `mobile/common/fetch.js`. Cuando la respuesta no es exitosa lanza un `Error` con la
propiedad `status` (por ejemplo `404`).

En el celular la app no corre en el mismo servidor que la API, así que las rutas
relativas no alcanzan para las imágenes. La función `expoDevServerUri` de
`mobile/common/utils.js` arma la URL completa, por ejemplo
`<Image source={{ uri: expoDevServerUri(country.flagUrl) }} />`. `fetchJSON` ya la usa
internamente.

El módulo `mobile/common/styles.js` tiene estilos que se pueden usar o modificar a
gusto, y `mobile/components/Button.jsx` es un botón simple.

La carpeta `bruno` tiene una colección de [Bruno](https://www.usebruno.com/) con
todos los _endpoints_ y sus casos de error, para probar la API por separado mientras
corre `npm start`.

## Diseño

El diseño es libre, siempre que se cumpla la consigna. Como guía se incluye un boceto
en `specs/mock-higher-lower.excalidraw`.
