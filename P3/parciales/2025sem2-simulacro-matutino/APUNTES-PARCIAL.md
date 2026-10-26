# Apuntes: Simulacro Parcial 3 - 2025sem2 (matutino) - "¿Cuál es la bandera del país del mapa?" (RESUELTO)

> Primera de las 4 trivias de 2025sem2 (misma plantilla Expo Router + API mock
> adentro). Es la más simple: 2 vistas, sin vidas ni Fin. Los parciales reales
> ([matutino](../2025sem2-parcial3-matutino/APUNTES-PARCIAL.md) y
> [vespertino](../2025sem2-parcial3-vespertino/APUNTES-PARCIAL.md)) le agregaron
> niveles, vidas con emojis y pantalla de Fin.

## 0. Cómo correrlo

```bash
cd P3/parciales/2025sem2-simulacro-matutino
npm install
npm run web                       # o: npx expo start --web --port 8094
npm run lint                      # sin salida = OK
curl "localhost:8081/api/countries/random?n=4"
```

## 1. Qué pide el enunciado → dónde está resuelto

| Requisito | Dónde | Cómo |
|---|---|---|
| Header "Bienvenido" en `/`; pantalla "Trivia de Países" con back | `app/_layout.jsx` | `Stack.Screen` `index` y `game` con `options.title` |
| Pedir nombre + botón Continuar → siguiente pantalla | `app/index.jsx` | `TextInput` controlado; `router.push({ pathname: '/game', params: { nombre } })`; también con Enter (`onSubmitEditing`) |
| Nombre en la otra vista | `app/game.jsx` | `const { nombre } = useLocalSearchParams();` |
| Mapa de un país al azar | `app/game.jsx` → `pedirDesafio()` | `random?n=4`, uno de los 4 es el correcto |
| 4 botones con banderas: 1 correcta + 3 al azar, **posición aleatoria** | `pedirDesafio()` | `posicionCorrecta = Math.floor(Math.random() * 4)` |
| Puntaje = correctas − incorrectas | `elegir()` | `setPuntaje(puntaje ± 1)` |
| Al tocar: decir bien/mal, ajustar puntaje, botón para otro desafío | `elegir()` / `otroDesafio()` | bandera tocada verde/rojo; "Salir" → "Continuar" que hace `setRonda(ronda + 1)` |
| Carga / error | `app/game.jsx` | `cargando`, `error`, "Reintentar" |

## 2. Estructura de la solución

```
app/_layout.jsx      Stack: index ("Bienvenido") + game ("Trivia de Países")
app/index.jsx        Vista 1: nombre + Continuar (deshabilitado si está vacío)
app/game.jsx         Vista 2: mapa + 4 banderas + mensaje + puntaje + Salir/Continuar
components/styles.js estilos (+ bigMapCard, flagButton, verde/rojo, normalText/errorText que faltaban)
hooks/api.js         obtenerJson, urlBandera, urlMapa + hooks de la plantilla (sin usar)
app/api, app/static  (MOCK, no tocar)
```

`app/game.jsx`:
- `pedirDesafio()` (async, fuera del componente): `random?n=4` → elige posición correcta → pide el detalle del correcto (nombre + ver que tenga `map`; si no, repite).
- Estado: `puntaje`, `desafio` (`{ opciones, paisCorrecto }`), `elegida` (cca3 o `null`), `cargando`, `error`, `ronda`.
- `useEffect(..., [ronda])` con `ignorar`.

## 3. Conceptos clave

### 3.1 Posición aleatoria de la correcta

```js
const codigos = await obtenerJson('/api/countries/random?n=4');   // ya vienen mezclados
const posicionCorrecta = Math.floor(Math.random() * codigos.length); // 0..3
const paisCorrecto = await obtenerJson(`/api/countries/${codigos[posicionCorrecta]}`);
```
Alternativa: pedir 1 correcto + 3 otros y mezclar: `[correcto, ...otros].sort(() => Math.random() - 0.5)`.
Lo importante: **mezclar al pedir, guardar en estado**, no en el render.

### 3.2 Botones con imagen adentro

```jsx
{desafio.opciones.map((cca3) => (
  <TouchableOpacity key={cca3} style={estilo} disabled={yaRespondio} onPress={() => elegir(cca3)}>
    <Image source={{ uri: urlBandera(cca3) }} style={styles.smallFlagImage} contentFit="contain" />
  </TouchableOpacity>
))}
```
- `key` = el código (único). Las 4 opciones son distintas porque `random` no repite.
- `onPress={() => elegir(cca3)}` (función flecha), **no** `onPress={elegir(cca3)}` (eso la ejecuta al renderizar).

### 3.3 Colorear la elegida

```js
let estilo = styles.flagButton;
if (yaRespondio && cca3 === elegida) {
  estilo = [styles.flagButton, acerto ? styles.correctButton : styles.wrongButton];
}
```

### 3.4 Estado que sobrevive entre desafíos

`puntaje` **no** se resetea en `otroDesafio()`: solo `elegida` y `ronda`. Como es la misma pantalla (no se navega), el estado sigue. Si saliera y volviera a entrar (back + Continuar), la pantalla se desmonta y arranca de 0. Para que persista: Context (en `_layout`) o AsyncStorage.

## 4. Trampas / casos borde

1. **8 países sin mapa** (`FSM, JEY, MHL, MNP, PSE, TUV, UMI, UNK`) → si el correcto es uno de esos, se repite el pedido (`while (true)` + `return` cuando hay `map`).
2. **Ruta `/game`** (enunciado) vs `app/trivia/` (plantilla): hice `app/game.jsx`, borré `trivia/`.
3. **No dejar responder dos veces**: `disabled={yaRespondio}` en las 4 banderas (si no, sumás puntos infinitos).
4. **Puntaje negativo** es válido ("Tenés -2 puntos").
5. **`styles.normalText`/`errorText` no existían** en la plantilla.
6. **Plantilla con relativos**: los hooks `useFetch…` usan `/api/...` relativo (no anda en el celular) y no se pueden "recargar" → `obtenerJson` con `expoDevServerUri` + `useEffect([ronda])`.
7. **Lint** sin warnings.

## 5. Variantes probables (con código)

### V1. Mostrar el nombre del país debajo de cada bandera al responder

```js
// en pedirDesafio: pedir el detalle de las 4
const paises = await Promise.all(codigos.map((c) => obtenerJson(`/api/countries/${c}`)));
// en el render: {yaRespondio && <Text>{pais.name.common}</Text>}
```

### V2. Invertir: bandera arriba, 4 mapas como opciones

Cambiar `urlMapa` ↔ `urlBandera`; ojo: ahora las **4** opciones tienen que tener mapa → pedir detalle de las 4 y filtrar las que tienen `map` (o pedir más, `n=8`, y quedarte con 4 que tengan).

### V3. Cantidad de opciones elegida en la Bienvenida (2/4/6)

```jsx
router.push({ pathname: '/game', params: { nombre, opciones: 6 } });
// game: const n = Number(params.opciones) || 4;  ... random?n=${n}
// fila que salta de línea: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 10 }
```

### V4. Mostrar la correcta en verde cuando erraste

```js
if (yaRespondio && cca3 === desafio.paisCorrecto.cca3) estilo = [styles.flagButton, styles.correctButton];
if (yaRespondio && cca3 === elegida && !acerto) estilo = [styles.flagButton, styles.wrongButton];
```

### V5. Racha y mejor puntaje (Context compartido entre pantallas)

```jsx
// _layout.jsx:  <PuntajeProvider><Stack>…</Stack></PuntajeProvider>
const { mejor, setMejor } = usePuntaje();
// al responder bien: if (puntaje + 1 > mejor) setMejor(puntaje + 1);
// Bienvenida: <Text>Mejor puntaje: {mejor}</Text>
```
