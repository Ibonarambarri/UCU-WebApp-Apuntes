# Apuntes: Simulacro Parcial 3 - 2025sem2 (vespertino) - "¿Cuál es un país fronterizo?" (RESUELTO)

> Misma plantilla que las otras 3 trivias de 2025sem2, pero el juego es un
> "viaje": estás en un país, elegís un limítrofe entre 9 banderas y vas a ese
> país. Es la más interesante para practicar **dos `useEffect` encadenados**
> (lista → país actual) y **estilos según la respuesta** (verde/rojo/gris).
> Conceptos generales en el [parcial matutino §3](../2025sem2-parcial3-matutino/APUNTES-PARCIAL.md).

## 0. Cómo correrlo

```bash
cd P3/parciales/2025sem2-simulacro-vespertino
npm install
npm run web                       # o: npx expo start --web --port 8095
npm run lint                      # sin salida = OK
curl localhost:8081/api/countries/URY      # {"name":{"common":"Uruguay",...},"borders":["ARG","BRA"],...}
```
Ojo: esta plantilla **no trae `.prettierrc` ni prettier en el lint** (las otras 3 sí). La formateé con el `.prettierrc` del matutino.

## 1. Qué pide el enunciado → dónde está resuelto

| Requisito | Dónde | Cómo |
|---|---|---|
| Header "Bienvenido" / "Trivia de Países" con back | `app/_layout.jsx` | La plantilla traía `<Stack.Screen name="index" />` sin título |
| Nombre + Continuar | `app/index.jsx` | igual al simulacro matutino |
| Bandera del país actual, inicialmente al azar | `app/game.jsx` (1er `useEffect`) | `GET /api/countries` → `elegirAlAzar(lista)` |
| 9 banderas: algunas limítrofes + otras al azar, posiciones al azar | `armarOpciones(pais, todos)` | hasta 4 de `pais.borders` + relleno de no limítrofes, todo mezclado |
| Botones Salir y Ninguno | `app/game.jsx` | fila con `flexDirection: 'row'` |
| Puntaje y nombre visibles | `textoArriba` | "Tenés 4 puntos, Ramón. Estás en Uruguay." |
| Al responder: verde si bien, rojo si mal, **gris el resto** | `estiloSegunRespuesta()` | array de estilos |
| +1 / −1 | `responder()` | `setPuntaje(esCorrecta(r) ? puntaje + 1 : puntaje - 1)` |
| Proponer ir al país elegido (limítrofe o no) | `responder()` + `pregunta` | pide el detalle del tocado → "¿Vamos a Argentina?" |
| Salir → Vamos; todos los demás desactivados | render | `disabled={yaRespondio}`; `vamos()` cambia `codigoActual` |
| Ninguno = correcto si no tiene fronteras | `esCorrecta('ninguno')` | `pais.borders.length === 0`; "Vamos" lleva a un país al azar |
| Carga / error | `app/game.jsx` | returns tempranos "Cargando país..." / error + Salir |

## 2. Estructura de la solución

```
app/_layout.jsx      Stack: index ("Bienvenido") + game ("Trivia de Países")
app/index.jsx        Vista 1: nombre + Continuar
app/game.jsx         Vista 2: todo el juego
components/styles.js estilos nuevos: grid 3x3, flagButton, verde/rojo/gris, outlineButton
hooks/api.js         obtenerJson, urlBandera (+ hooks de la plantilla, sin usar)
app/api, app/static  (MOCK, no tocar)
```

`app/game.jsx`:
- Funciones fuera del componente: `mezclar`, `elegirAlAzar`, `armarOpciones`, `volverAlInicio`.
- Estado: `puntaje`, `todos` (250 códigos), `codigoActual`, `pais` (detalle), `opciones` (9 códigos), `cargando`, `error`, `elegido` (`null` / cca3 / `'ninguno'`), `nombreElegido`.
- Efecto 1 `[]`: lista → `setTodos` + `setCodigoActual(alAzar)`.
- Efecto 2 `[codigoActual, todos]`: detalle del actual → `setPais` + `setOpciones(armarOpciones(...))`.

## 3. Conceptos clave

### 3.1 Dos efectos encadenados

```jsx
useEffect(() => {                      // 1) una vez
  ... const lista = await obtenerJson('/api/countries');
  setTodos(lista);
  setCodigoActual(elegirAlAzar(lista));
}, []);

useEffect(() => {                      // 2) cada vez que cambia el país
  if (codigoActual === null || todos === null) return;
  ... const detalle = await obtenerJson(`/api/countries/${codigoActual}`);
  setPais(detalle);
  setOpciones(armarOpciones(detalle, todos));
}, [codigoActual, todos]);
```
"Vamos" solo hace `setCodigoActual(elegido)` → el efecto 2 se dispara solo. Es el mismo patrón que `useParams` + `useEffect([cca3])` del parcial 2.

### 3.2 Armar las 9 opciones

```js
function armarOpciones(pais, todos) {
  const limitrofes = mezclar(pais.borders).slice(0, MAXIMO_LIMITROFES);      // hasta 4
  const noLimitrofes = todos.filter((c) => c !== pais.cca3 && !pais.borders.includes(c));
  const relleno = mezclar(noLimitrofes).slice(0, CANTIDAD_OPCIONES - limitrofes.length);
  return mezclar([...limitrofes, ...relleno]);
}
function mezclar(lista) { return [...lista].sort(() => Math.random() - 0.5); }   // COPIA ([...]) porque sort modifica
```
Las opciones se arman **en el efecto y se guardan en estado**. Si las calcularas en el render, cada `setState` (por ejemplo al tocar una bandera) las volvería a mezclar y saltarían de lugar.

### 3.3 Verde / rojo / gris

```js
function estiloSegunRespuesta(estiloBase, valor) {
  if (!yaRespondio) return estiloBase;
  if (valor !== elegido) return [estiloBase, styles.greyButton];
  return [estiloBase, esCorrecta(valor) ? styles.correctButton : styles.wrongButton];
}
// se usa igual para las banderas (valor = cca3) y para "Ninguno" (valor = 'ninguno')
```

### 3.4 Grilla 3×3 en React Native (no hay CSS grid)

```js
grid: { width: 270, flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 10 },
flagButton: { width: 80, height: 60, ... },          // 3*80 + 2*10 = 260 ≤ 270 → 3 por fila
```
Alternativa: `FlatList` con `numColumns={3}` (necesita `keyExtractor`).

### 3.5 Pedido "al tocar" (async en un handler)

```js
async function responder(respuesta) {
  setElegido(respuesta);
  setPuntaje(esCorrecta(respuesta) ? puntaje + 1 : puntaje - 1);
  setNombreElegido(null);
  if (respuesta !== 'ninguno') {
    try {
      const detalle = await obtenerJson(`/api/countries/${respuesta}`);
      setNombreElegido(detalle.name.common);
    } catch { setNombreElegido(respuesta); }        // si falla, el código
  }
}
// mientras llega: "¿Vamos a ...?"
```

## 4. Trampas / casos borde

1. **86 países sin fronteras** (sobre todo islas: `ABW`, `AUS`, `JPN`, `ISL`, `VIR`) → las 9 son no limítrofes y la correcta es **Ninguno**.
2. **Países con más de 9 fronteras** (`CHN` 16, `RUS` 14, `BRA` 10, `DEU`/`COD` 9): si pusieras todas no entran en 9 o no queda ninguna "trampa" → tope `MAXIMO_LIMITROFES = 4`.
3. **"Ninguno" y después "Vamos"**: no hay país elegido → se va a uno al azar distinto del actual.
4. **No repetir el país actual entre las opciones** (`c !== pais.cca3`).
5. **`sort` modifica el array original**: `mezclar` copia con `[...lista]` (si no, desordenás `pais.borders` del estado).
6. **Datos coherentes**: todos los códigos de `borders` existen en `data.json` (lo chequeé), así que todas las banderas existen.
7. **Plantilla rota**: `app/index.jsx` sin `onPress`, `styles.normalText`/`errorText` sin definir, `trivia/index.jsx` con `name` hardcodeado; ruta `/game` según enunciado.
8. **Puntaje negativo** válido.
9. **Lint**: efecto 2 depende de `codigoActual` **y** `todos` (usa los dos). Funciones auxiliares fuera del componente → no son dependencias.

## 5. Variantes probables (con código)

### V1. Mostrar el nombre de cada país debajo de su bandera

```js
// en el efecto 2, después de armar opciones:
const detalles = await Promise.all(opciones.map((c) => obtenerJson(`/api/countries/${c}`)));
setNombres(Object.fromEntries(detalles.map((d) => [d.cca3, d.name.common])));
// render: <Text>{nombres[cca3] ?? cca3}</Text>
```

### V2. Seleccionar TODOS los limítrofes (multi-selección + "Confirmar")

```js
const [marcados, setMarcados] = useState([]);
function alternar(cca3) {
  setMarcados(marcados.includes(cca3) ? marcados.filter((c) => c !== cca3) : [...marcados, cca3]);
}
// confirmar: correctos = opciones.filter((c) => pais.borders.includes(c));
// acierto si marcados.length === correctos.length && marcados.every((c) => correctos.includes(c))
```

### V3. Historial del viaje (FlatList de países visitados)

```jsx
const [visitados, setVisitados] = useState([]);   // en vamos(): setVisitados([...visitados, pais.name.common])
<FlatList data={visitados} keyExtractor={(item, i) => `${i}-${item}`}
          renderItem={({ item, index }) => <Text>{index + 1}. {item}</Text>} />
```

### V4. Meta: llegar a un país destino (ej. "llegá a Uruguay")

```js
const DESTINO = 'URY';
// en el efecto 2: if (codigoActual === DESTINO) setGano(true);
// solo dejar "ir" si era limítrofe: en vamos(), if (!esCorrecta(elegido)) quedarse en el mismo país
```

### V5. Ruta con el país en la URL (`/game/[cca3]`) en vez de estado

```jsx
// app/game/[cca3].jsx
const { cca3, nombre } = useLocalSearchParams();
// vamos(): router.replace({ pathname: '/game/[cca3]', params: { cca3: elegido, nombre } });
// (replace para no apilar 50 pantallas; con push el back recorre el viaje al revés)
```
El puntaje ahí ya no puede vivir en el componente (se re-monta) → Context o params.
