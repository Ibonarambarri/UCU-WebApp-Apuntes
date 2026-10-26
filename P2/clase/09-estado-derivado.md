# Tema 9 — Estado derivado: calcular, no guardar

> **Si algo se puede calcular a partir de otro estado (o props), NO es estado:
> se calcula en el render con un `const`.**

Cada re-render ejecuta la función entera (tema 3.1) → cualquier `const` calculado ahí
**siempre está al día**, sin hacer nada.

🧁 **Imagen:** el estado son los **ingredientes**; lo derivado es la **receta**. No guardás
"la torta" en la heladera: guardás harina y huevos y la hacés cuando la necesitás.

## 9.1 El error típico

```jsx
// ❌ MAL: estado duplicado
const [countries, setCountries] = useState([]);
const [query, setQuery] = useState('');
const [filtrados, setFiltrados] = useState([]);

useEffect(() => {
  setFiltrados(countries.filter((c) => c.name.includes(query)));
}, [countries, query]);
```
- **Dos fuentes de verdad** → se desincronizan.
- **Doble render** → un instante con datos incorrectos.
- Más código, más errores.

```jsx
// ✅ BIEN
const [countries, setCountries] = useState([]);
const [query, setQuery] = useState('');

const filtrados = countries.filter((c) => c.name.toLowerCase().includes(query.toLowerCase()));
```

## 9.2 Todo lo que se calcula en los parciales

**Matutino:**
```jsx
const visibles = [...countries.filter(cumpleFiltros)].sort(comparar);
<p>Mostrando {visibles.length} de {countries.length} países</p>
{visibles.length === 0 && <p>No se encontraron países para "{query}".</p>}
```

**Tatetí:**
```jsx
const jugados = matches.filter((m) => m.playerX === id || m.playerO === id).length;
```
`useTicTacToe` (escrito por los docentes) guarda **solo** `history`; todo lo demás se calcula:
```js
const state = history[history.length - 1];          // tablero actual
const isFinished = wonX || wonO || emptySquares === 0;
const activePlayer = isFinished ? null : countX > countO ? 'O' : 'X';
```

**Otros:**
- Barra de progreso (Trello): `porcentaje = hechas / total * 100`.
- Botón habilitado: `const canStart = playerXId && playerOId && playerXId !== playerOId;`
- ¿Es favorito?: `favorites.some((f) => f.code === code)`.

## 9.3 Cómo decidir: 3 preguntas

1. **¿Viene de afuera?** (API, lo que escribe el usuario, un clic) → **estado**.
2. **¿Cambia con el tiempo?** Si nunca cambia → constante fuera del componente.
3. **¿Se puede calcular de otro estado/props?** → **`const` en el render.**

| Dato | ¿Estado? |
|---|---|
| Países que llegaron de la API | ✅ estado |
| Texto del buscador | ✅ estado (o en la URL, tema 15) |
| Países filtrados y ordenados | ❌ se calcula |
| "Mostrando 3 de 250" | ❌ se calcula |
| Jugadores elegidos en los selects | ✅ estado |
| Ganador de la partida | ❌ se calcula desde `history` |
| Ganados / jugados | ❌ se calcula desde `matches` |

## 9.4 Si calcular es lento: `useMemo` (opcional)

```jsx
const visibles = useMemo(
  () => countries.filter((c) => …).sort((a, b) => …),
  [countries, query, sort],     // recalcula SOLO si cambia algo de esto
);
```
250 países es instantáneo → en el examen un `const` normal está perfecto. (Tema 17.)

## 9.5 Un solo estado, muchas cosas en pantalla

La trivia (`2025sem2-simulacro-matutino`) guarda **un** dato: qué bandera eligió el usuario.
```jsx
const [respuestaElegida, setRespuestaElegida] = useState(null);   // null = todavía no respondió

const yaRespondio = respuestaElegida !== null;
const acerto = respuestaElegida === paisCorrecto.cca3;
```
De ahí sale **todo**: `disabled={yaRespondio}` en los 4 botones, el mensaje "¡Bien!/Mal",
el mapa envuelto en `<Link>` solo si `yaRespondio`, y el botón "Otro desafío". Nueva ronda →
`setRespuestaElegida(null)` y todo vuelve solo.
❌ Tentación: `botonesDeshabilitados`, `mostrarMensaje`, `mostrarBoton` como 3 `useState` más
que hay que acordarse de cambiar juntos.

Mismo razonamiento para "qué fila se está editando": `idEditando` (tema 7.10) y en cada fila
`const estaEditando = t.id === idEditando;`.

📂 **Verlo funcionando:** `parciales/simulacro-prueba2-2026sem2-matutino/web/src/components/PageCountryList/PageCountryList.jsx` ·
`parciales/simulacro-prueba2-2026sem2-vespertino/web/src/pages/PagePlayers/PagePlayers.jsx` (ganados/jugados) ·
`parciales/2025sem2-simulacro-matutino/web/src/components/Home.jsx` (`respuestaElegida`)

---

## ❓ Repaso

**Pregunta:** mostrar "4 jugadores · 3 partidas jugadas en total". Un compañero propone:
```jsx
const [totalJugadores, setTotalJugadores] = useState(0);
const [totalPartidas, setTotalPartidas] = useState(0);
useEffect(() => {
  setTotalJugadores(players.length);
  setTotalPartidas(matches.length);
}, [players, matches]);
```

**Respuesta:** no hace falta ni `useState` ni `useEffect`; esos números salen de lo que ya tenés.
```jsx
const totalJugadores = players.length;
const totalPartidas = matches.length;

<p>{totalJugadores} jugadores · {totalPartidas} partidas jugadas en total</p>
// o directo: <p>{players.length} jugadores · {matches.length} partidas…</p>
```
La versión del compañero guarda el dato dos veces y muestra "0" un instante antes de que el efecto lo corrija.

**Pregunta para el examen:** antes de escribir un `useState` → *"¿esto lo puedo sacar de algo que ya tengo?"* Si sí → `const`.
