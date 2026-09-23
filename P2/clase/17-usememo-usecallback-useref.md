# Tema 17 — `useMemo`, `useCallback`, `useRef`

## 17.0 La idea que los une

Cada render ejecuta el componente **desde cero**: cada `const` se recalcula y cada función se crea
**nueva**. Casi siempre da igual; estos hooks son para cuando no.

| Hook | Recuerda entre renders | ¿Redibuja al cambiar? | Uso típico |
|---|---|---|---|
| `useState` | un valor | **sí** | todo lo que se ve |
| `useMemo` | el **resultado** de un cálculo | — | lista filtrada/ordenada |
| `useCallback` | una **función** | — | `refetch`, handler en deps de un efecto |
| `useRef` | un valor mutable (`.current`) | **no** | "ya lo hice", guardas |

## 17.1 `useMemo`: no repetir un cálculo

```jsx
const visibleCountries = useMemo(
  () => filterAndSortCountries(countries, { query, region, sort }),
  [countries, query, region, sort],          // recalcula SOLO si cambia algo de esto
);
```
- Devuelve el **resultado**, no una función.
- Deps como en `useEffect`: **todo lo que usa**. ⚠️ Falta `region` → el select cambia y la lista no.
- **Optimización, no cambia el resultado.** Con 250 países un `const` da lo mismo.

👉 Examen: si complica, `const` (tema 9). Si usás `useMemo`, **cada filtro nuevo a sus deps**.

## 17.2 `useCallback`: que una función sea "la misma"

Solo importa cuando la función está en las **dependencias de un efecto**:
```jsx
// PagePlay.jsx
const handleFinish = useCallback(({ history, winner }) => {
  createMatch({ playerX: …, playerO: …, history, winner });
}, [createMatch, selectedPlayers]);
<TicTacToeGame onFinish={handleFinish} />

// TicTacToeGame.jsx
useEffect(() => {
  if (isFinished) onFinish({ history, winner });
}, [isFinished, winner, history, onFinish]);   // ← onFinish en deps
```
Sin `useCallback`: cada render del padre crea un `handleFinish` nuevo → el efecto del hijo se
re-ejecuta → podría guardar dos veces.

Dónde aparece: `refetch = useCallback(() => setReloadIndex((i) => i + 1), [])` en los hooks de los
docentes, `createPlayer`/`createMatch`, `isFavorite`/`toggleFavorite` del `FavoritesProvider`
(ahí además el `value` va en `useMemo`: pulido, no obligatorio).

Lint *"missing dependency: 'cargar'"* con una función del componente → **moverla dentro del
efecto** (más simple) o envolverla en `useCallback`.

👉 Examen: reconocerlo; escribirlo solo si el lint lo pide.

## 17.3 `useRef`: caja que sobrevive y NO redibuja

```jsx
const hasReportedRef = useRef(false);

useEffect(() => {
  if (isFinished && !hasReportedRef.current) {
    hasReportedRef.current = true;           // NO provoca re-render
    onFinish({ history, winner });           // se guarda UNA sola vez
  }
}, [isFinished, winner, history, onFinish]);
```
- Leer/escribir con **`.current`**.
- Para recordar lo que **no se muestra**: "ya guardé", id de un `setInterval`.
- Otro uso: `ref={inputRef}` → `inputRef.current.focus()`.
- ⚠️ No para algo visible: cambiarlo no actualiza la pantalla (para eso `useState`).

## 17.4 Extra: `key` para empezar de cero

```jsx
<TicTacToeGame key={gameNumber} … />      // setGameNumber((n) => n + 1) → componente nuevo, estado limpio
```
Alternativa a dejar de dibujarlo (tema 7.7) para "Revancha" / "Jugar de nuevo".

## 17.5 Para el examen

| Hook | ¿Escribirlo? |
|---|---|
| `useMemo` | Opcional (`const` alcanza). Si lo usás, deps completas. |
| `useCallback` | Solo si el lint lo pide; si no, reconocerlo. |
| `useRef` | Solo para guardas "una sola vez". |

📂 **Verlo funcionando:** `parciales/simulacro-prueba2-2026sem2-matutino/web/src/components/PageCountryList/PageCountryList.jsx` (useMemo) ·
`parciales/simulacro-prueba2-2026sem2-vespertino/web/src/pages/PagePlay/PagePlay.jsx` (useCallback) ·
`.../components/TicTacToeGame/TicTacToeGame.jsx` (useRef)

---

## ❓ Repaso

**Pregunta:** ¿`useState`, `useMemo`, `useRef` o `const`?
1) número de jugadas mostrado en pantalla; 2) jugadores ordenados por victorias (de `players` y
`matches`); 3) marca "ya envié el email" (no se muestra); 4) `players.length` para "4 jugadores".

**Respuesta:**
1. `useState` si nada más lo tiene… **pero en el tatetí es `const jugadas = history.length - 1`** (se deriva, tema 9).
2. `useMemo` o `const` (se calcula; nunca `useState`).
3. `useRef` (recordar sin mostrar → sin redibujar).
4. `const`.
