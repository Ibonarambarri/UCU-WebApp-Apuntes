# CHULETA DE EXAMEN — Parcial 2 (formato 2026sem2)

Tenerla abierta al lado del editor durante el examen. Todo está probado en los
simulacros resueltos:
- Países: `parciales/simulacro-prueba2-2026sem2-matutino/web/src/`
- Tatetí: `parciales/simulacro-prueba2-2026sem2-vespertino/web/src/`

---

## 0. Primeros 5 minutos y entrega

→ Movido a [ESTRATEGIA-EXAMEN.md §1](ESTRATEGIA-EXAMEN.md#1-primeros-5-minutos-sin-internet)
(comandos sin internet, qué leer primero) y [§3](ESTRATEGIA-EXAMEN.md#3-checklist-final-antes-de-entregar) (commit, push, PR).

---

## 1. Router (react-router-dom v6)

> → ver [tema 13](clase/13-router-rutas.md) (Routes, Link, Outlet, Navigate) y [tema 14](clase/14-useparams-usenavigate.md) (useParams, useNavigate).

```jsx
import { BrowserRouter, Routes, Route, Navigate, Outlet, Link, useParams, useNavigate, useSearchParams, useLocation } from 'react-router-dom';

<BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
  <Routes>
    <Route path="/" element={<Layout />}>                      {/* Layout tiene <Outlet /> */}
      <Route index element={<Navigate to="/countries" replace />} />   {/* o <PageHome /> */}
      <Route path="countries" element={<PageList />} />
      <Route path="countries/:code" element={<PageDetail />} />
      <Route path="*" element={<PageNotFound />} />
    </Route>
  </Routes>
</BrowserRouter>
```

| Quiero… | Uso |
|---|---|
| Link que navega sin recargar | `<Link to={`/countries/${c.code}`}>` (NUNCA `<a href>`) |
| Navegar desde código (después de guardar, botón) | `const navigate = useNavigate(); navigate('/players');` / `navigate(-1)` |
| Leer `:code` | `const { code } = useParams();` (siempre **string**) |
| Leer/escribir `?q=…` | `useSearchParams` (ver §2) |
| Redirigir | `<Navigate to="/" replace />` |
| Pasar datos invisibles a la próxima página | `<Link to="…" state={{ from: 'x' }}>` → `useLocation().state?.from` |
| Botón con estilo que navega | `<Link className={styles.button} to="/">Main menu</Link>` |

**Misma ruta, otro parámetro** (`/countries/URY` → `/countries/ARG`): el componente NO se
desmonta → el `useEffect` del fetch necesita `[code]` en las dependencias.

---

## 2. Query params (`?q=uru&sort=population`)

> → ver [tema 15](clase/15-usesearchparams.md) (`useSearchParams`).

```jsx
const [searchParams, setSearchParams] = useSearchParams();
const q = searchParams.get('q') ?? '';                         // string | null → default
const page = Number(searchParams.get('page')) || 1;            // números: convertir

function updateParam(name, value) {
  setSearchParams((prev) => {
    const next = new URLSearchParams(prev);                    // copia: conserva los demás
    if (value) next.set(name, value); else next.delete(name);
    return next;
  }, { replace: true });
}

<input value={q} onChange={(e) => updateParam('q', e.target.value)} />
<select value={sort} onChange={(e) => updateParam('sort', e.target.value)}>…</select>
<input type="checkbox" checked={onlyFav} onChange={(e) => updateParam('fav', e.target.checked ? '1' : '')} />
```

---

## 3. Pedidos a la API con `fetchJSON` (DADO en `utils/fetch.js`)

> → ver [tema 11](clase/11-api-fetch.md); hooks propios: [tema 12](clase/12-hooks-propios.md).

```js
import { fetchJSON } from '../../utils/fetch.js';
await fetchJSON('/api/countries');                                          // GET
await fetchJSON('/api/favorites', { method: 'PUT', body: { code } });       // body como OBJETO
await fetchJSON(`/api/favorites/${code}`, { method: 'DELETE' });
```
- `fetchJSON` ya hace `JSON.stringify(body)` y pone el header. **No stringifiques vos.**
- Si la respuesta no es 2xx **tira un Error** con el status en el mensaje:
  `error.message.includes(' 404 ')` → "no encontrado".
- Ids del tatetí son strings (`"1"`); códigos de países alpha-3 en mayúsculas.

### Hook de GET (patrón de los docentes) — copiar y cambiar la URL

```js
import { useCallback, useEffect, useState } from 'react';
import { fetchJSON } from '../utils/fetch.js';

export function useFetchJSON(url) {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(Boolean(url));
  const [error, setError] = useState(null);
  const [reloadIndex, setReloadIndex] = useState(0);

  useEffect(() => {
    if (!url) return;
    let ignore = false;
    (async () => {
      setIsLoading(true); setError(null); setData(null);
      try { const json = await fetchJSON(url); if (!ignore) setData(json); }
      catch (err) { if (!ignore) setError(err); }
      finally { if (!ignore) setIsLoading(false); }
    })();
    return () => { ignore = true; };
  }, [url, reloadIndex]);

  const refetch = useCallback(() => setReloadIndex((i) => i + 1), []);
  return { data, isLoading, error, refetch };
}
```

### Hook de "crear" (PUT) — patrón `useCreatePlayer`

```js
export function useCreateThing() {
  const [isCreating, setIsCreating] = useState(false);
  const createThing = useCallback(async (body) => {
    setIsCreating(true);
    try { return await fetchJSON('/api/things', { method: 'PUT', body }); }
    finally { setIsCreating(false); }
  }, []);
  return { isCreating, createThing };
}
```

---

## 4. Página con los 4 estados (cargando / error / vacío / datos)

> → ver [tema 5](clase/05-listas-y-condicionales.md) (render condicional); [tema 12](clase/12-hooks-propios.md).

```jsx
const { data: items, isLoading, error, refetch } = useFetchItems();

let content;
if (isLoading) content = <p>Cargando…</p>;
else if (error) content = <p>Error: {error.message} <button onClick={refetch}>Reintentar</button></p>;
else if (visible.length === 0) content = <p>No se encontraron resultados para "{q}".</p>;
else content = <ul>{visible.map((it) => <Item key={it.id} item={it} />)}</ul>;

return (<div><Header title="…" />{/* controles */}{content}</div>);
```
**Todos los hooks ARRIBA, antes de cualquier `return` temprano.**

---

## 5. Formulario controlado + crear + refrescar lista

> → ver [tema 8](clase/08-formularios-controlados.md).

```jsx
const [name, setName] = useState('');
const { isCreating, createPlayer } = useCreatePlayer();
const { data: players, refetch } = useFetchPlayers();

async function handleSubmit(event) {
  event.preventDefault();                           // si no, recarga la página
  if (!name.trim()) return;
  try {
    await createPlayer({ name: name.trim() });
    setName('');
    refetch();                                      // la lista no se entera sola
  } catch (err) { setError(err); }
}

<form onSubmit={handleSubmit}>
  <input value={name} onChange={(e) => setName(e.target.value)} />
  <button type="submit" disabled={!name.trim() || isCreating}>Add</button>
</form>
```

---

## 6. Arrays (filtrar, ordenar, contar)

> → ver [tema 2](clase/02-javascript-para-react.md) y [tema 9](clase/09-estado-derivado.md).

```js
const visible = items.filter((c) => c.name.toLowerCase().includes(q.toLowerCase()));
const sorted = [...visible].sort((a, b) => a.name.localeCompare(b.name));   // COPIA antes de sort
const byPopDesc = [...visible].sort((a, b) => b.population - a.population);
const found = list.find((c) => c.code === code);                            // undefined si no está
const exists = list.some((f) => f.code === code);                           // boolean
const unique = [...new Set(list.map((c) => c.region))].sort();
const page = list.slice((n - 1) * 20, n * 20);
const text = arr.length ? arr.join(', ') : '—';
let total = 0; for (const c of list) total += c.population;                 // en vez de reduce
const counts = {}; for (const c of list) counts[c.region] = (counts[c.region] ?? 0) + 1;
Object.entries(counts).map(([key, value]) => …);
(3473727).toLocaleString('es-UY');                                           // "3.473.727"
new Date(iso).toLocaleDateString('es-UY');
const random = list[Math.floor(Math.random() * list.length)];
```
- `null`: `value ?? '—'` (ojo: `value || '—'` convierte el 0 en guion).
- Estado derivado (filtrados, ordenados, stats): **calcular en el render**, no `useState` + `useEffect`.
  Si es pesado: `useMemo(() => …, [deps])`.

---

## 7. Context (estado compartido entre páginas)

> → ver [tema 16](clase/16-context.md).

**Dos archivos** (si no, warning de lint `react-refresh/only-export-components`):

```js
// context/ThingsContext.js
import { createContext, useContext } from 'react';
export const ThingsContext = createContext(null);
export function useThings() { return useContext(ThingsContext); }
```
```jsx
// context/ThingsProvider.jsx
export default function ThingsProvider({ children }) {
  const [things, setThings] = useState([]);
  useEffect(() => { fetchJSON('/api/things').then(setThings).catch(() => {}); }, []);
  const value = { things, setThings };
  return <ThingsContext.Provider value={value}>{children}</ThingsContext.Provider>;
}
```
```jsx
// App.jsx: envolver TODO (fuera o dentro del BrowserRouter; fuera es más simple)
<ThingsProvider><BrowserRouter>…</BrowserRouter></ThingsProvider>
// en cualquier componente:
const { things } = useThings();
```

---

## 8. CSS Modules (la plantilla los usa)

> → ver [tema 18](clase/18-css-modules-y-lint.md).

```jsx
import styles from './Card.module.css';
<div className={styles.card}>
<div className={`${styles.card} ${active ? styles.active : ''}`}>      // clase condicional
<div style={{ width: `${percent}%` }}>                                  // inline calculado
```
```css
.list { display: flex; flex-direction: column; gap: 16px; }
.grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 16px; }
.row  { display: flex; align-items: center; justify-content: space-between; }
.card { border: 1px solid #ccc; border-radius: 12px; padding: 16px; }
.primary { background: #111; color: #fff; border: 1px solid #111; border-radius: 8px; }
```

---

## 9. Lint: errores típicos y arreglo

> → ver [tema 18](clase/18-css-modules-y-lint.md) y [ESTRATEGIA §4 (trampas de lint)](ESTRATEGIA-EXAMEN.md#4-trampas-todas-deduplicadas).

| Mensaje | Arreglo |
|---|---|
| `Missing semicolon` | poner `;` |
| `'x' is defined but never used` | borrar el import/variable (los que empiezan con Mayúscula o `_` se ignoran) |
| `React Hook useEffect has a missing dependency: 'x'` | agregar `x` al array (si es una función del componente, envolverla en `useCallback` o moverla dentro del efecto) |
| `React Hook "useX" is called conditionally` | mover el hook arriba, antes de `if`/`return` |
| `Fast refresh only works when a file only exports components` | separar el contexto/hook del Provider en otro archivo `.js` |

---

## 10. Errores que ya vi cometer

→ Movido a [ESTRATEGIA-EXAMEN.md §4 — Trampas](ESTRATEGIA-EXAMEN.md#4-trampas-todas-deduplicadas)
(todas las trampas juntas, agrupadas por tema).
