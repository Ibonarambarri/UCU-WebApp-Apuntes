# Tema 11 — Hooks de datos: `useFetchJSON`, hooks por endpoint y `useCreateX`

> Es **el mismo** tema 12 de P2 ([`../../P2/clase/12-hooks-propios.md`](../../P2/clase/12-hooks-propios.md)).
> Cambian dos detalles: el error trae `.status` y el hook devuelve también `setData`.

## 11.1 `useFetchJSON(url)`: el GET genérico

```js
// hooks/useFetchJSON.js (simulacro)
export function useFetchJSON(url) {
  const [data, setData] = useState(null);             // null = todavía no llegó
  const [isLoading, setIsLoading] = useState(true);   // true: carga al montar
  const [error, setError] = useState(null);
  const [reloadIndex, setReloadIndex] = useState(0);  // +1 = "volvé a pedir"

  useEffect(() => {
    let ignore = false;                               // ← bandera (11.2)
    (async () => {
      setIsLoading(true);                             // setState DENTRO del async (tema 17.4)
      setError(null);
      try {
        const json = await fetchJSON(url);
        if (!ignore) setData(json);
      } catch (err) {
        if (!ignore) setError(err);
      } finally {
        if (!ignore) setIsLoading(false);
      }
    })();
    return () => { ignore = true; };                  // limpieza
  }, [url, reloadIndex]);

  const refetch = useCallback(() => setReloadIndex((i) => i + 1), []);
  return { data, setData, isLoading, error, refetch };
}
```

| Devuelve | Valor | Para |
|---|---|---|
| `data` | `null` → el JSON | dibujar |
| `setData` | función | **reemplazar** los datos con lo que devolvió un POST (11.6) |
| `isLoading` | `true` mientras pide | spinner chico, `disabled` |
| `error` | `null` o `Error` con **`.status`** | 404 vs "se cayó" (11.5) |
| `refetch` | función estable (`useCallback`) | Reintentar, `useFocusEffect` (tema 9.3) |

## 11.2 La bandera `ignore`: respuestas que llegan tarde

```
/games/6 → GET 6 sale …                    "Jugar de nuevo" → /games/7 → GET 7 sale
                                            limpieza del efecto de 6: ignore = true
… llega 6 (tarde) → if (!ignore) NO guarda    llega 7 → se guarda ✅
```
Sin `ignore`, la respuesta vieja **pisa** la nueva y ves la partida anterior. En RN pasa más
seguido que en web: las pantallas de un `Stack` **no se desmontan** al ir para adelante, y
`router.replace` a la misma ruta con otro `id` reusa el componente → cambia `url` → corre el efecto.

## 11.3 Un hook de 1 línea por endpoint

```js
// hooks/useFetchRanking.js
export function useFetchRanking() { return useFetchJSON('/api/ranking'); }
// hooks/useFetchGame.js
export function useFetchGame(id) { return useFetchJSON(`/api/games/${id}`); }   // 404 → error.status
```
Uso, renombrando `data` (para no tener cinco `data`):
```js
const { data: ranking, error: rankingError, refetch } = useFetchRanking();
const { data: loadedGame, setData: setGame, error, refetch } = useFetchGame(id);
```
Parámetros con espacios o símbolos → `encodeURIComponent(code)` (2026sem1: `useFetchTeam`).

## 11.4 La pantalla: 4 estados (y `!data` en vez de `isLoading`)

```jsx
let rankingContent;
if (rankingError)              rankingContent = <StatusMessage error={rankingError} text="No se pudo cargar el ranking." onRetry={refetch} />;
else if (!ranking)             rankingContent = <StatusMessage loading text="Cargando ranking…" />;
else if (ranking.length === 0) rankingContent = <Text>Todavía no hay partidas terminadas.</Text>;
else                           rankingContent = <FlatList data={ranking} … />;
```
- **Orden:** error → cargando → vacío → datos.
- **`!ranking`, no `isLoading`:** el inicio hace `refetch()` cada vez que gana foco
  (`useFocusEffect`, tema 9.3). Con `isLoading` la lista **parpadea** ("Cargando…" un instante cada
  vez que volvés); con `!ranking` se sigue viendo la vieja hasta que llega la nueva.
- ⚠️ Pantalla entera: **todos los hooks arriba**, después los `return` tempranos (tema 17.3).

| Quiero… | Uso |
|---|---|
| Spinner + texto | `<StatusMessage loading text="…" />` (`ActivityIndicator`, tema 3.7) |
| Error + botón | `<StatusMessage error={error} text="…" onRetry={refetch} />` |
| Error sin reintentar (404) | `<Text style={styles.errorText}>…</Text>` + "Volver al inicio" |
| Dos pedidos | `if (e1 \|\| e2) … else if (!d1 \|\| !d2) …` |

## 11.5 404 vs "se cayó"

```jsx
if (error) {
  return (
    <View style={styles.container}>
      {error.status === 404 ? (
        <Text style={styles.errorText}>La partida {id} no existe.</Text>   // reintentar no sirve
      ) : (
        <StatusMessage error={error} text="No se pudo cargar la partida." onRetry={refetch} />
      )}
      <Button title="Volver al inicio" onPress={() => router.dismissTo('/')} />
    </View>
  );
}
```
`error.status` lo pone `fetchJSON` (tema 10.3). Si es un error de red, `status` es `undefined`.

## 11.6 Hooks de acción: `useCreateGame`

No corren al montar: **devuelven una función** que llamás desde un `onPress`. Sin `useEffect`.

```js
// hooks/useCreateGame.js (simulacro)
export function useCreateGame() {
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState(null);

  async function createGame(player) {
    setIsCreating(true);
    setError(null);
    try {
      return await fetchJSON('/api/games', { method: 'POST', body: { player } });  // la partida
    } catch (err) {
      setError(err);
      return null;                    // ← el componente pregunta if (game)
    } finally {
      setIsCreating(false);
    }
  }
  return { createGame, isCreating, error };
}
```
```jsx
const { createGame, isCreating, error: createError } = useCreateGame();
async function handlePlay() {
  const game = await createGame(trimmedPlayer);
  if (game) router.push(`/games/${game.id}`);       // null = falló, el error ya está en createError
}
<Button title={isCreating ? 'Creando…' : 'Jugar'} onPress={handlePlay} disabled={!canPlay} />
{createError && <Text style={styles.errorText}>No se pudo crear la partida.</Text>}
```
- **Por qué un hook aparte:** se usa en **dos** pantallas (Jugar en el inicio, Jugar de nuevo al final).
- **Dos estilos válidos**: este (atrapa y devuelve `null`) o el de P2 (`finally` sin `catch`, el
  error sube y el componente hace `try/catch`). Elegí uno y sé consistente.
- Sin `useCallback`: con `reactCompiler: true` no hace falta (tema 17.5).

## 11.7 Usar la respuesta de un POST sin volver a pedir (`setData`)

`POST …/guess` responde `{ guess, stat, correct, revealed, game }`, y `game` **ya es** la partida
actualizada. Pedirla de nuevo con `refetch()` es un GET de más (y un "Cargando…" de más):

```js
function handleNext() {
  setGame(roundResult.game);    // = setData del useFetchGame: reemplaza la partida
  setResult(null);              // vuelve a "jugando"
}
```

| Después de modificar… | Opción |
|---|---|
| La API devuelve el objeto actualizado | **`setData(respuesta)`** (guess, PATCH de figuritas 2026sem1) |
| La API no devuelve nada útil / cambió una lista | `refetch()` (más simple; si dudás, esto) |
| Cambió algo que se ve en **otra** pantalla | `useFocusEffect` + `refetch` en esa pantalla (ranking) |

## 11.8 Formatos anteriores

- **2025sem1** `lib/api.js`: `useFetch(path)` con `reload` hecho con `useCallback` y efecto `[reload]`.
- **2025sem2 / 2026sem1 (plantilla)**: `makeFetchJSONHook(resource)` — fábrica de hooks con
  `// eslint-disable-next-line react-hooks/exhaustive-deps` y `fetch` sin `expoDevServerUri`
  (**en el celular no anda**). Las soluciones lo reemplazan por `useFetchJSON` u `obtenerJson`.

📂 **Verlo funcionando:** `parciales/simulacro-prueba3-2026sem2-matutino/mobile/hooks/useFetchJSON.js` ·
`.../hooks/useFetchGame.js` · `.../hooks/useCreateGame.js` · `.../components/StatusMessage.jsx` ·
`.../app/index.jsx` (`!ranking`, crear + navegar) · `.../app/games/[id].jsx` (404, `setGame`) ·
`parciales/2026sem1-prueba3-vespertino/hooks/useFetchJSON.js` · `.../app/teams/[code].jsx` (PATCH + `setTeam`)

---

## ❓ Repaso

**Pregunta:** 1) Hook para `GET /api/games/:id/history`. 2) ¿Por qué esto muestra la partida
**anterior** al tocar "Jugar de nuevo"?
```js
useEffect(() => {
  (async () => setData(await fetchJSON(url)))();
}, [url]);
```

**Respuesta:**
```js
export function useFetchHistory(id) {
  return useFetchJSON(`/api/games/${id}/history`);
}
```
2. No tiene bandera `ignore`: si el GET de la partida vieja llega **después** del de la nueva, lo
guarda igual y la pisa. Falta `let ignore = false; … if (!ignore) setData(json); … return () => { ignore = true; };`.
(Además no maneja errores: sin `try/catch`, un 404 queda en "Cargando…" para siempre.)
