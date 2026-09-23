# Tema 15 — `useSearchParams`: el estado en la URL

> ⭐ Lo más nuevo del formato 2026sem2 y lo más probable del examen (lo pide el matutino).

## 15.1 Query params

```
/countries?q=uru&sort=population
          └──────────┬──────────┘
          q = "uru"     sort = "population"
```

| | Parámetro de ruta `:code` | Query param `?q=` |
|---|---|---|
| Ejemplo | `/countries/URY` | `/countries?q=uru` |
| Para | **qué** ver (identidad) | **cómo** verlo (filtro, orden, página) |
| ¿Obligatorio? | sí | no, opcional |
| Se lee con | `useParams()` ([tema 14](14-useparams-usenavigate.md)) | `useSearchParams()` |
| Se declara en `<Route>` | sí | **no** (la ruta sigue siendo `countries`) |

## 15.2 ¿Por qué no `useState`?

Con `useState` la búsqueda se pierde al **recargar** o **compartir el link**. El matutino pide:
*"al recargar la página o compartir el enlace se vea el mismo resultado"* → **la URL ES el estado**.

## 15.3 Leer

```jsx
import { useSearchParams } from 'react-router-dom';

const [searchParams, setSearchParams] = useSearchParams();

const query = searchParams.get('q') ?? '';               // string | null → default
const sort = searchParams.get('sort') ?? 'name';
const onlyFavorites = searchParams.get('fav') === '1';   // booleano
const page = Math.max(1, Number(searchParams.get('page')) || 1);   // número
```
- `.get()` → **string o `null`** → siempre `??`.
- **Validar valores raros** (`?sort=xyz`):
  ```jsx
  const sort = ['name', 'population', 'area'].includes(sortParam) ? sortParam : 'name';
  // o: Object.hasOwn(SORT_OPTIONS, sortParam ?? '') ? sortParam : DEFAULT_SORT
  ```

## 15.4 Escribir: `updateParam`

`setSearchParams({ q: 'uru' })` **borra los demás** (`sort` se pierde). Por eso:
```jsx
function updateParam(name, value) {
  setSearchParams((previous) => {
    const next = new URLSearchParams(previous);   // copia de los actuales
    if (value) next.set(name, value);             // poner/cambiar uno
    else next.delete(name);                       // vacío → sacarlo (URL limpia)
    return next;
  }, { replace: true });                          // no llenar el historial
}
```
- Forma funcional (tema 7.4).
- **`replace: true`**: sin él cada tecla es una entrada del historial ("atrás" borra letra por letra).

## 15.5 Controles "controlados por la URL" (tema 8)

```jsx
<input value={query} onChange={(e) => updateParam('q', e.target.value)} />

<select value={sort} onChange={(e) => updateParam('sort', e.target.value)}>
  <option value="name">Nombre (A-Z)</option>
  <option value="population">Población</option>
  <option value="area">Área</option>
</select>

<input type="checkbox" checked={onlyFavorites}
       onChange={(e) => updateParam('fav', e.target.checked ? '1' : '')} />
```
```
tecla "u" → updateParam('q','u') → URL ?q=u → re-render → get('q') = 'u' → input muestra "u" → lista recalculada
```

## 15.6 La lista visible se calcula (tema 9)

```jsx
const visibles = [...countries]
  .filter((c) => c.name.toLowerCase().includes(query.toLowerCase()))
  .sort(comparadorSegun(sort));
<p>Mostrando {visibles.length} de {countries.length} países</p>
```
**Ningún `useState`** para búsqueda, orden ni filtrados: datos (hook) + URL → cálculo.

## 15.7 Detalles y variantes

- **Paginación**: al cambiar la búsqueda volver a pág. 1 → en `updateParam`: `if (name !== 'page') next.delete('page');`
- **Filtro dependiente** (región → subregión): al cambiar región, `next.delete('subregion')`.
- `<Link to="?region=Asia">` cambia el query pero **borra los otros** → para conservarlos, `updateParam`.
- **Volver a la misma búsqueda desde el detalle**: `location.search` en el `state` del Link
  ([tema 14.7](14-useparams-usenavigate.md)); "Volver" → `` `/countries${location.state?.listSearch ?? ''}` ``.
- **Link que activa un filtro**: `<Link to="/countries?fav=1">★ Favoritos</Link>`.
- **Receta de filtro nuevo**: (1) leerlo de la URL, (2) control con `updateParam`, (3) condición en el filter,
  (4) agregarlo a las deps del `useMemo` si hay. Variantes V1-V4 en
  `parciales/simulacro-prueba2-2026sem2-matutino/APUNTES-PARCIAL.md`.

## 15.8 Resumen visual

```
                   ┌──────────────── URL ────────────────┐
                   │ /countries?q=uru&sort=population    │
                   └───────▲───────────────────┬─────────┘
        updateParam('q',…) │                   │ searchParams.get('q')
   <input onChange> ───────┘                   ▼
                                    query='uru', sort='population'
   datos de la API (hook) ─────────────────────┤
                                                ▼
                                visibles = filter + sort  (const)
                                                ▼
                              "Mostrando 3 de 250" + <ul>…</ul>
```

📂 **Verlo funcionando:** `parciales/simulacro-prueba2-2026sem2-matutino/web/src/components/PageCountryList/PageCountryList.jsx` ·
`.../utils/countries.js` · `.../components/Layout/Layout.jsx` (link `?fav=1`)

---

## ❓ Repaso

**Pregunta:** filtro por región en la URL (`?region=Asia`) con un `<select>` que tenga "Todas".
1) leer; 2) el select; 3) condición en el filter.

**Respuesta:**
```jsx
const region = searchParams.get('region') ?? '';

<select value={region} onChange={(e) => updateParam('region', e.target.value)}>
  <option value="">Todas</option>
  {regions.map((r) => <option key={r} value={r}>{r}</option>)}
</select>

if (region && country.region !== region) return false;   // dentro del filter
```
"Todas" con `value=""` → `updateParam` **borra** `region` de la URL → `region &&` no filtra.
Si hay `useMemo`, agregar `region` a sus dependencias.
