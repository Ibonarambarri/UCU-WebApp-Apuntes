# Tema 9 — Ciclo de vida de las pantallas: qué se monta, qué se queda y qué se pierde

Es el tema que **más diferencia** a P3 de P2 y el que más trampas tiene en los parciales.

## 9.1 En P2: cambiar de ruta = desmontar

Con React Router, ir de `/countries` a `/countries/URY` **desmonta** la lista y monta el detalle.
Volver monta la lista de nuevo → su `useEffect(…, [])` corre otra vez → datos frescos.

## 9.2 En un Stack, la pantalla de abajo NO se desmonta

```
router.push('/games/6')

   ┌──────────────┐
   │ /games/6     │  ← montada, visible
   ├──────────────┤
   │ /  (inicio)  │  ← SIGUE MONTADA (tapada): conserva su estado y NO vuelve a correr sus efectos
   └──────────────┘
```
| Acción | La de arriba | La de abajo |
|---|---|---|
| `push` | se **monta** | queda montada (pierde el foco) |
| `back` / `dismissTo` | se **desmonta** (pierde su estado) | gana el foco, **no** se vuelve a montar |
| `replace` | la vieja se desmonta, la nueva se monta | sin cambios |

Consecuencias en el simulacro:
- ✅ Al volver, el `TextInput` del nombre **sigue escrito** (bien).
- ❌ El **ranking** quedó como estaba antes de jugar: `useFetchRanking()` hizo su GET al montar y no
  lo repite → la partida que acabás de terminar no aparece.

## 9.3 `useFocusEffect` + `useCallback`: refrescar al volver

```jsx
import { useCallback } from 'react';
import { useFocusEffect } from 'expo-router';

const { data: ranking, error, refetch } = useFetchRanking();

useFocusEffect(
  useCallback(() => {
    refetch();                 // corre CADA VEZ que la pantalla gana el foco (también la 1ª)
  }, [refetch]),
);
```
- Es un `useEffect` que corre **al ganar el foco** (no solo al montar); el `return () => …`
  opcional corre al **perder** el foco.
- ⚠️ **Siempre envuelto en `useCallback`**: sin él, la función es nueva en cada render y el efecto se
  vuelve a ejecutar en cada render → pedidos en bucle.
- `refetch` del hook ya es estable (`useCallback` adentro de `useFetchJSON`) → va en las dependencias
  sin problema (el lint lo pide).
- Que en la primera visita se pida dos veces (montaje + foco) no importa.
- Sin hook propio: adentro del `useCallback` va el mismo `(async () => { … })()` de un `useEffect`.
- Solo querés saber si está visible: `const isFocused = useIsFocused();`.

## 9.4 Misma pantalla, otro parámetro: el estado viejo se queda

Si desde `/games/6` vas a `/games/7` **reusando la misma pantalla**, el componente **no se
desmonta**: solo cambia `id`. Todo su `useState` sigue con los valores de la partida 6.

¿Cuándo se reusa? Con `router.navigate(…)`, con un `<Link>` común (que hace `navigate`) o con
`router.setParams({ id })`, si la pantalla de arriba es la misma ruta `games/[id]`. Con `push` o
`replace` el Stack crea una pantalla nueva, pero **no te apoyes en eso**: el enunciado lo pide
explícitamente ("Jugar de nuevo… no quedarse con el resultado de la anterior") y la pantalla tiene
que andar bien aunque cambie el `id`.

Además, aunque la pantalla sea nueva o no, `useFetchJSON` tarda: hasta que llega la partida 7,
`data` **todavía es la 6** (si el componente se reusó).

| Estado | Con el `id` nuevo, hasta que se arregle |
|---|---|
| `data` de `useFetchGame(id)` | la partida **vieja** hasta que llega la nueva |
| `result` (respuesta del último guess) | "Incorrecto / Fin de la partida" **de la vieja** |
| `isGuessing`, `guessError` | lo que hayan quedado |

## 9.5 Solución A — estado derivado por `id` (la del simulacro)

Guardás lo que guardes, **solo lo usás si es de esta partida**:
```jsx
const { id } = useLocalSearchParams();
const { data: loadedGame, setData: setGame, error, refetch } = useFetchGame(id);
const [result, setResult] = useState(null);

const game = loadedGame && String(loadedGame.id) === String(id) ? loadedGame : null;
const roundResult = result && String(result.game.id) === String(id) ? result : null;

if (!game) return <StatusMessage loading text="Cargando partida…" />;   // vieja → "cargando"
```
Sin efectos para "resetear", sin parpadeo del resultado viejo. `String(...)` porque `id` es string
y `game.id` número (tema 8.3). El `ignore` de `useFetchJSON` evita que una respuesta lenta de la 6
pise a la 7.

## 9.6 Solución B — `key` para forzar a montar de cero

En P2 ([tema 7.7](../../P2/clase/07-usestate.md)): si cambia la `key` de un componente, React lo
**desmonta y monta uno nuevo** → todo su estado vuelve al inicial. En RN es igual:
```jsx
// app/games/[id].jsx
export default function GameScreen() {
  const { id } = useLocalSearchParams();
  return <Game key={id} id={id} />;          // id distinto → Game NUEVO, estado limpio
}

function Game({ id }) {
  const { data: game, error } = useFetchGame(id);
  const [result, setResult] = useState(null);
  …                                          // acá ya no hace falta comparar ids
}
```
Más simple de razonar; desventaja: repite el pedido y se pierde todo (que es justo lo que se quiere).

❌ Lo que **no**: `useEffect(() => { setResult(null); }, [id])` "para resetear" — dibuja un render
con el resultado viejo y es estado sincronizado a mano (P2 [tema 9](../../P2/clase/09-estado-derivado.md)).

## 9.7 Recargar (F5 en web): el estado de React se pierde, el de la API no

Recargar la página = la app arranca de cero: **todo** `useState` y todo Context vuelven al valor
inicial, y la pila queda con **una sola** pantalla (`/games/6`, sin inicio abajo).

Por eso el enunciado dice "como el estado vive en la API, al recargar se sigue en la misma ronda":
- ✅ La pantalla se arma **desde `GET /api/games/:id`** (jugador, puntaje, países, `status`).
- ❌ No lleves el puntaje o la ronda en un `useState` propio "porque es más fácil": al recargar se pierde.
- Lo único local es lo transitorio (`result` de la ronda recién respondida, `isGuessing`).
- Sin pantalla abajo → "Volver al inicio" con `router.dismissTo('/')`, no `router.back()` (tema 8.2).
- Partida que ya terminó al entrar (`status !== 'playing'`) → mostrar el resultado directo, sin botones.

## 9.8 Por qué `router.replace` en "Jugar de nuevo"

```jsx
async function handlePlayAgain() {
  const newGame = await createGame(game.player);        // mismo jugador
  if (newGame) router.replace(`/games/${newGame.id}`);
}
```
| Con `push` | Con `replace` |
|---|---|
| pila: inicio → partida 6 (terminada) → partida 7 | pila: inicio → partida 7 |
| ← vuelve a la partida **terminada** | ← vuelve al **inicio** (lo esperable) |
| cada "jugar de nuevo" apila otra | la pila no crece |

Y aunque uses `replace`, la pantalla tiene que mostrar la partida nueva y no el resultado de la
anterior → 9.5 o 9.6.

## 9.9 Resumen: qué usar según el síntoma

| Síntoma | Causa | Arreglo |
|---|---|---|
| Al volver, la lista no se actualiza | la de abajo no se desmontó | `useFocusEffect(useCallback(() => refetch(), [refetch]))` |
| Pedidos infinitos al abrir la pantalla | `useFocusEffect` sin `useCallback` | envolver en `useCallback` |
| Cambia el `id` y se ve la partida/resultado anterior | misma instancia, estado viejo | derivado por id (9.5) o `key={id}` (9.6) |
| Al recargar se pierde el puntaje | estaba en `useState` | leerlo de la API |
| "Volver" no hace nada tras recargar | no hay pantalla abajo | `router.dismissTo('/')` |
| ← vuelve a la partida terminada | "Jugar de nuevo" con `push` | `router.replace` |

📂 **Verlo funcionando:** `parciales/simulacro-prueba3-2026sem2-matutino/mobile/app/index.jsx` (`useFocusEffect`
para el ranking) · `.../app/games/[id].jsx` (`game` y `roundResult` derivados por id, `replace`, `dismissTo`) ·
`.../hooks/useFetchJSON.js` (`ignore`) · `parciales/2025sem1-parcial-rn/mobile/app/index.jsx` (`useFocusEffect`
para la lista de tareas) · `.../README.md` del simulacro ("Casos a contemplar") · docs:
[focus-handling.mdx](../docs-offline/expo/docs/pages/router/reference/focus-handling.mdx) ·
[stack.mdx](../docs-offline/expo/docs/pages/router/advanced/stack.mdx)

---

## ❓ Repaso

**Pregunta:** en la pantalla de la partida tenés `const [result, setResult] = useState(null)`. Tocás
**Jugar de nuevo**, la URL pasa a `/games/7`, pero sigue apareciendo "Incorrecto — Fin de la
partida". ¿Por qué y cuáles son las dos formas de arreglarlo sin un `useEffect`?

**Respuesta:** la pantalla se reusó (o todavía no llegó la partida nueva): `result` y `data` son
de la partida 6. Arreglos:
```jsx
// A) usar el resultado solo si es de esta partida
const roundResult = result && String(result.game.id) === String(id) ? result : null;

// B) montar de cero cuando cambia el id
export default function GameScreen() {
  const { id } = useLocalSearchParams();
  return <Game key={id} id={id} />;
}
```
