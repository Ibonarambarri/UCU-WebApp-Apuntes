# Tema 12 — Cargando / error / datos y hooks propios

## 12.1 El problema: las mismas 15 líneas en cada página

Con los temas 10 y 11, cada página que pide datos repite `useState` ×3 + `useEffect` + `async` +
`try/catch/finally`. En 4 páginas = 4 copias; un bug se arregla en 4 lugares.

## 12.2 Hook propio = función `use…` que usa otros hooks

Saca **lógica** repetida de los componentes (como un componente saca JSX repetido).
Es el "estilo oficial" de los docentes (`web/src/hooks/` del tatetí):

```js
export function useFetchPlayers() {
  const [data, setData] = useState(null);             // datos (null = no llegaron)
  const [isLoading, setIsLoading] = useState(false);  // ¿pidiendo?
  const [error, setError] = useState(null);           // ¿falló?
  const [reloadIndex, setReloadIndex] = useState(0);  // contador para "volver a pedir"

  useEffect(() => {
    (async () => {
      setIsLoading(true);
      try {
        setData(await fetchJSON('/api/players'));
        setError(null);
      } catch (err) {
        setError(err);
      } finally {
        setIsLoading(false);
      }
    })();
  }, [reloadIndex]);

  const refetch = useCallback(() => setReloadIndex((index) => index + 1), []);
  return { data, isLoading, error, refetch };
}
```
Nada nuevo: `useState` (tema 7) + `useEffect` con async adentro (tema 10) + `fetchJSON` con
try/catch (tema 11), **empaquetado**. En el componente queda una línea:
```jsx
const { data: players, isLoading, error, refetch } = useFetchPlayers();
```

## 12.3 Qué devuelve

| Devuelve | Valor | Para |
|---|---|---|
| `data` | `null` hasta que llega; luego el JSON | dibujar |
| `isLoading` | `true` mientras pide | "Cargando…", `disabled` |
| `error` | `null` o un `Error` (`.message`) | "No se pudo cargar…" |
| `refetch` | función | volver a pedir (después de crear, "Reintentar") |

**`refetch`**: suma 1 a `reloadIndex` → cambió una dependencia → el efecto corre otra vez → nuevo GET.
(`useCallback` solo hace que `refetch` sea siempre la misma función → tema 17.)

### ¿`isLoading` arranca en `true` o `false`?
- Carga **al montar** → `useState(true)` (si no, un instante se ve "No hay resultados").
- Carga **por una acción** (submit, clic) → `useState(false)` y `setIsLoading(true)` en el handler.
- Efecto que **se repite** (cambia `:code`, filtro, `reloadIndex`) → al principio: `setIsLoading(true); setError(null);`.

⚠️ **"Cargando…" eterno** = falta `finally { setIsLoading(false); }`. Diagnóstico en **Network**:
pedido en rojo → red/puerto; 404 → URL de la API mal.

## 12.4 La página: 4 estados

```jsx
const { data: players, error, refetch } = useFetchPlayers();

let content;
if (error)                        content = <p>Error: {error.message} <button onClick={refetch}>Reintentar</button></p>;
else if (!players)                content = <p>Cargando…</p>;            // solo la PRIMERA vez
else if (players.length === 0)    content = <p>Todavía no hay jugadores.</p>;
else                              content = <ul>{players.map((p) => <li key={p.id}>{p.name}</li>)}</ul>;
```
**`!data` en vez de `isLoading`**: en un `refetch` `isLoading` vuelve a `true` un instante y la lista
**parpadea**. Con `!data` se sigue viendo la lista vieja hasta que llega la nueva.

**Dos pedidos** (tatetí: players + matches) → contemplar ambos:
```jsx
if (playersError || matchesError) → error
else if (!players || !matches)    → cargando
else                              → datos
```

**404 vs "se cayó"** (reintentar solo tiene sentido si NO es 404):
```jsx
if (error?.message.includes(' 404 ')) content = <p>País no encontrado</p>;
else if (error) content = <StatusMessage type="error" text="No se pudo cargar">…Reintentar…</StatusMessage>;
```

## 12.5 Hook con parámetro (detalle)

```js
export function useFetchCountry(code) {
  …  useEffect(() => { … fetchJSON(`/api/countries/${code}`) … }, [code, reloadIndex]);  // tema 10.5
}
const { code } = useParams();
const { data: country, isLoading, error } = useFetchCountry(code);
```
`useFetchPlayerMatches(id)` del tatetí empieza con `if (!id) return;` → sin id no pide.

## 12.6 Hook genérico `useFetchJSON(url)` (matutino)

```js
export function useFetchJSON(url) { /* igual, con fetchJSON(url) y [url, reloadIndex] */ }

export function useFetchCountries() { return useFetchJSON('/api/countries'); }
export function useFetchCountry(code) { return useFetchJSON(`/api/countries/${code}`); }
export function useFetchRegions() { return useFetchJSON('/api/regions'); }
```
**Examen:** copiar `useFetchJSON.js` → cada endpoint nuevo = 1 línea (código completo en
[CHULETA §3](../CHULETA-EXAMEN.md)). Si la plantilla **ya trae hooks**, usar los suyos.

## 12.7 Hooks para modificar (`useCreatePlayer`)

No corren al entrar a la página sino **cuando el usuario hace algo** → sin `useEffect`; devuelven una
**función** para llamar desde un handler (tema 10.9):
```js
export function useCreatePlayer() {
  const [isCreating, setIsCreating] = useState(false);
  const createPlayer = useCallback(async ({ name }) => {
    setIsCreating(true);
    try {
      return await fetchJSON('/api/players', { method: 'PUT', body: { name } });
    } finally {
      setIsCreating(false);        // sin catch: el error SUBE al componente
    }
  }, []);
  return { isCreating, createPlayer };
}
```
- `isCreating` → deshabilitar el botón (tema 8.3).
- El componente atrapa: `try { await createPlayer(...) } catch (err) { setCreateError(err) }`.
- "Borrar jugador" → copiar como `useDeletePlayer`, cambiar método y URL.

## 12.8 Reglas

- Nombre con **`use`** → el lint aplica las reglas de hooks (tema 7.6): arriba, nunca en un `if`.
- **Cada componente que llama al hook tiene su propia copia** del estado: `PagePlayers` y `PagePlay`
  con `useFetchPlayers()` = **dos pedidos** independientes. Datos **compartidos** entre páginas → Context (tema 16).
- Un archivo por hook en `src/hooks/`, con `export function useAlgo`.

📂 **Verlo funcionando:** `parciales/simulacro-prueba2-2026sem2-vespertino/web/src/hooks/useFetchPlayers.js` ·
`.../hooks/useCreatePlayer.js` · `.../pages/PagePlayers/PagePlayers.jsx` (`!data`, dos pedidos, crear + refetch) ·
`parciales/simulacro-prueba2-2026sem2-matutino/web/src/hooks/useFetchJSON.js` · `.../components/PageCountry/PageCountry.jsx` (404)

---

## ❓ Repaso

**Pregunta:** con `useFetchJSON(url)`: 1) hook `useFetchMatches()` para `GET /api/matches`;
2) usarlo renombrando `data` a `matches`; 3) condición de "Cargando…" sin parpadeo.

**Respuesta:**
```js
export function useFetchMatches() {
  return useFetchJSON('/api/matches');
}

const { data: matches, isLoading, error, refetch } = useFetchMatches();

if (!matches) content = <p>Cargando…</p>;     // !matches, NO isLoading
```
