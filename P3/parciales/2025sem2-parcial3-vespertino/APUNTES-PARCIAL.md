# Apuntes: Parcial 3 - 2025sem2 (vespertino) - Trivia "¿en este país se habla X?" (RESUELTO)

> Misma plantilla y misma app que el [parcial matutino](../2025sem2-parcial3-matutino/APUNTES-PARCIAL.md)
> (Expo Router + API mock adentro). Cambian la pregunta, la regla de victoria
> (meta de preguntas con 3 vidas fijas) y el Fin (ganaste / perdiste).
> Los conceptos generales (Stack, params, `expoDevServerUri`, `Image`, estilos)
> están explicados en el matutino §3; acá va lo específico.

## 0. Cómo correrlo

```bash
cd P3/parciales/2025sem2-parcial3-vespertino
npm install
npm run web                      # o: npx expo start --web --port 8093
npm run lint                     # sin salida = OK
curl "localhost:8081/api/countries/random?n=2"
```
La API solo lee `app/api/data.json` (no escribe nada).

## 1. Qué pide el enunciado → dónde está resuelto

| Requisito | Dónde | Cómo |
|---|---|---|
| Header "Bienvenido" en `/` y "Trivia de Países" con back en la otra | `app/_layout.jsx` | Dos `Stack.Screen` con `options.title` |
| Nombre del jugador | `app/index.jsx` | `TextInput` controlado; botones deshabilitados si está vacío |
| Fácil 6 / Medio 9 / Difícil 12 preguntas; siempre 3 vidas | `app/index.jsx` (`NIVELES`) + `app/game.jsx` (`VIDAS_TOTALES = 3`) | `router.push({ pathname: '/game', params: { nombre, preguntas } })` |
| Bandera **o** mapa del país (50%) | `app/game.jsx` → `pedirPregunta()` | `mostrarMapa = Math.random() < 0.5 && Boolean(pais.map)` |
| Idioma: 50% uno del país (al azar), 50% uno de otro país al azar | `pedirPregunta()` | `Object.values(pais.languages)` + `elegirAlAzar` |
| Sí / No / Salir; ❤️ y 💀 arriba con el nombre | `app/game.jsx` | igual que el matutino |
| Al responder: bien/mal, puntaje, Salir → Continuar | `responder()` | botón apretado verde/rojo; mensaje "Correcto: en Norway no se habla Dutch." |
| Continuar → otra pregunta, o Fin si no quedan vidas **o** se llegó a la meta | `continuar()` | `if (vidasQueQuedan <= 0 \|\| correctas >= meta) setTerminado(true)` |
| Fin perdiste: "contestaste X, tenías que llegar a N" / ganaste: felicitar | bloque `if (terminado)` | `const gano = correctas >= meta;` → 😞 o 🎉 |
| "Volver a jugar" lleva a la Bienvenida | `volverAlInicio()` | `router.canGoBack() ? router.back() : router.replace('/')` |
| Carga / error | `app/game.jsx` | `cargando`, `error`, "Reintentar" |

## 2. Estructura de la solución

```
app/_layout.jsx      Stack: index ("Bienvenido") + game ("Trivia de Países")
app/index.jsx        Vista 1: nombre + 3 niveles (6/9/12 preguntas)
app/game.jsx         Vista 2 (Juego) + Vista 3 (Fin)
components/styles.js estilos (+ bigImage, Sí/No, verde/rojo, normalText/errorText que faltaban)
hooks/api.js         obtenerJson, urlBandera, urlMapa + hooks de la plantilla (sin usar)
hooks/useFetch.js    (DADO, sin usar)
app/api, app/static  (MOCK, no tocar)
```

`pedirPregunta()` (fuera del componente):
1. `random?n=2` → `pais` (el de la pregunta) y `otroPais`.
2. Detalle de los dos con `Promise.all`.
3. Moneda 1: ¿bandera o mapa?  Moneda 2: ¿idioma propio o del otro?
4. `seHabla = idiomasDelPais.includes(idioma)` ← la verdad, calculada.

## 3. Conceptos clave específicos

### 3.1 `languages` es un OBJETO → `Object.values`

```js
// pais.languages = { nld: 'Dutch', pap: 'Papiamento' }
const idiomasDelPais = Object.values(pais.languages || {});   // ['Dutch', 'Papiamento']
function elegirAlAzar(lista) {
  return lista[Math.floor(Math.random() * lista.length)];
}
```
(`Object.keys` daría los códigos `['nld','pap']`; `Object.entries` los pares.)

### 3.2 La respuesta correcta NO es la moneda

```js
const usarIdiomaPropio = Math.random() < 0.5;
...
const seHabla = idiomasDelPais.includes(idioma);   // ✔
// ✘ const seHabla = usarIdiomaPropio;
```
Si el país es Uruguay y el "otro" es Argentina, el idioma del otro es "Spanish"... que en Uruguay **también** se habla. Con la moneda como verdad, el juego diría "Incorrecto" a quien contestó bien.

### 3.3 Dos formas de terminar

```js
function continuar() {
  if (vidasQueQuedan <= 0 || correctas >= meta) setTerminado(true);
  else { setRespuesta(null); setRonda(ronda + 1); }
}
// Fin:
const gano = correctas >= meta;
```
Interpretación elegida: **"preguntas respondidas" = respondidas BIEN**; cada error cuesta una vida.
Si el profe dice que cuentan todas (bien o mal), cambiá `correctas` por `respondidas` en esas dos líneas y en el texto de "Perdiste".

### 3.4 Mostrar bandera o mapa con la misma `Image`

```jsx
<Image
  source={{ uri: pregunta.mostrarMapa ? urlMapa(cca3) : urlBandera(cca3) }}
  style={styles.bigImage}
  contentFit="contain"
/>
```

### 3.5 Mensaje que dice la verdad (haya acertado o no)

```js
mensaje = (acerto ? 'Correcto' : 'Incorrecto') + `: en ${nombrePais} ` +
          (pregunta.seHabla ? 'se habla ' : 'no se habla ') + `${pregunta.idioma}.`;
```

## 4. Trampas / casos borde

1. **Antártida (`ATA`) no tiene idiomas** (`languages: {}`): si es el país de la pregunta, se usa sí o sí un idioma del otro (y la respuesta es "No"); si es el "otro", se usa uno propio. Sin esto, `elegirAlAzar([])` = `undefined` → "¿se habla undefined?".
2. **8 países sin mapa** (`FSM, JEY, MHL, MNP, PSE, TUV, UMI, UNK`): a esos se les muestra la bandera (`&& Boolean(pais.map)`).
3. **Idioma compartido** (§3.2).
4. **`hooks/useFetch.js` de la plantilla devuelve `loading`, no `isLoading`**: la pantalla trivia de la plantilla leía `isLoading` → nunca mostraba "Loading". Además `useFetch` no vuelve a poner `loading = true` cuando cambia la URL, y si le pasás `params` como objeto literal (`{}`) se re-ejecuta en cada render (objeto nuevo = dependencia nueva). Por eso usé `obtenerJson` + `useEffect` propio.
5. **Params como string**: `Number(params.preguntas)`; si falta → 6.
6. **Ruta `/game` vs `app/trivia/` de la plantilla**: hice `app/game.jsx` (como dice el enunciado) y borré `trivia/`.
7. **El último acierto que llega a la meta** no salta directo al Fin: se ve "Correcto…" y Continuar lleva al Fin.
8. **Lint**: sin warnings (efecto con `[ronda]`, `pedirPregunta` fuera del componente).

## 5. Variantes probables (con código)

### V1. "Respondidas" cuentan todas (bien o mal)

```js
if (vidasQueQuedan <= 0 || respondidas >= meta) setTerminado(true);
const gano = respondidas >= meta && vidasQueQuedan > 0;
```

### V2. Opción múltiple: "¿Qué idioma se habla en este país?" con 4 botones

```js
const codigos = await obtenerJson('/api/countries/random?n=4');
const paises = await Promise.all(codigos.map((c) => obtenerJson(`/api/countries/${c}`)));
const correcto = elegirAlAzar(Object.values(paises[0].languages));
const opciones = [correcto, ...paises.slice(1).map((p) => elegirAlAzar(Object.values(p.languages)))]
  .filter((x) => x !== undefined)
  .sort(() => Math.random() - 0.5);
// ojo: puede haber repetidos (dos países con "English") → new Set(opciones)
```

### V3. Pregunta por moneda o capital en vez de idioma

```js
// currencies = { UYU: { name: 'Uruguayan peso', symbol: '$' } }
const monedas = Object.values(pais.currencies || {}).map((m) => m.name);
// capital = ['Montevideo']  (ARRAY, puede estar vacío)
const capitales = pais.capital || [];
```

### V4. Mostrar ambos (bandera y mapa) cuando acierta, como "premio"

```jsx
{respuesta !== null && (
  <View style={styles.row}>
    <Image source={{ uri: urlBandera(cca3) }} style={styles.flagImage} contentFit="contain" />
    {pregunta.pais.map && <Image source={{ uri: urlMapa(cca3) }} style={styles.mapImage} contentFit="contain" />}
  </View>
)}
```

### V5. Vida extra cada 3 aciertos seguidos

```js
const [racha, setRacha] = useState(0);
// en responder():
if (esCorrecta) {
  const nueva = racha + 1;
  setRacha(nueva);
  if (nueva % 3 === 0 && vidasPerdidas > 0) setVidasPerdidas(vidasPerdidas - 1);
} else {
  setRacha(0);
}
```

### V6. Fin en pantalla aparte

Igual que la V2 del matutino: `router.replace({ pathname: '/fin', params: { nombre, correctas, meta, gano: gano ? '1' : '0' } })` y en `fin.jsx` comparar `params.gano === '1'` (los booleanos también llegan como string).
