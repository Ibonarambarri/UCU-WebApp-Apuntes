# Simulacro 2026sem2 MATUTINO — Country Explorer (RESUELTO)

> El profe dijo que lo traigamos hecho porque "nos va a servir mucho en el examen".
> Traducción: **el examen probablemente es esta misma app (o muy parecida) con
> otros requisitos.** Por eso este archivo tiene la solución explicada y, al final,
> un **recetario de variantes** con código listo para adaptar.

Cómo correrlo: ver [README principal](../../README.md#cómo-correr-cada-cosa) (formato 2026sem2: `npm install` + `npm start`). `npm run lint` tiene que salir sin nada.

---

## 1. Qué pedía el enunciado → dónde está resuelto

| Requisito | Dónde | Cómo |
|---|---|---|
| Listado con bandera, nombre, capital, región, población | `components/CountryCard/CountryCard.jsx` | Una `<li>` por país; `formatNumber` pone los puntos de miles |
| Búsqueda por nombre (del lado del cliente) | `utils/countries.js` → `filterAndSortCountries` | `filter` + `includes` sobre texto normalizado (sin tildes, minúsculas) |
| Orden nombre A-Z / población ↓ / área ↓ | `utils/countries.js` → `sortCountries` | `[...array].sort(...)`; `localeCompare` para texto; los `null` van al final |
| Búsqueda y orden **en la URL** (`?q=uru&sort=population`) | `PageCountryList.jsx` | `useSearchParams` (la URL es el estado, no hay `useState`) |
| "Mostrando X de 250" + aviso sin resultados | `PageCountryList.jsx` | `visibleCountries.length` / `countries.length`; `StatusMessage` |
| Cada país enlaza a su detalle | `CountryCard.jsx` | `<Link to={`/countries/${code}`}>` |
| Detalle: todos los campos | `components/PageCountry/PageCountry.jsx` | `useParams` → `useFetchCountry(code)`; componente `Fact` para cada par etiqueta/valor |
| Limítrofes con nombre y bandera, navegables sin recargar | `PageCountry.jsx` | Los códigos se buscan en el listado completo; `<Link>` (no `<a>`) |
| Volver al listado | `PageCountry.jsx` | `<Link>`; además recuerda la búsqueda (va en el `state` del link) |
| Favoritos (opcional) en listado y detalle, persisten | `context/FavoritesProvider.jsx` + `FavoriteButton` | Context global; `PUT /api/favorites` y `DELETE /api/favorites/:code` |
| Ver solo favoritos | `PageCountryList.jsx` | checkbox → `?fav=1`; y el link "★ Favoritos" de la barra |
| **EXTRA**: filtro por región | `PageCountryList.jsx` + `hooks/useFetchRegions.js` | `<select>` con `/api/regions` → `?region=Americas` |
| Sin fronteras (84) / sin capital (5) | `PageCountry.jsx`, `utils/format.js` | mensaje "no tiene fronteras"; `formatText(null)` → `—` |
| Código inexistente `/countries/XYZ` | `PageCountry.jsx` | la API da 404 → `fetchJSON` tira Error → mensaje "País no encontrado" |
| Carga y error de cada pedido | `hooks/useFetchJSON.js` + `StatusMessage` | `isLoading`, `error`, botón "Reintentar" (`refetch`) |
| `npm run lint` sin advertencias | todo | ver trampas de lint más abajo |

### Mapa de archivos (`web/src/`)

```
main.jsx                      (sin tocar)
utils/fetch.js                (DADO: fetchJSON)
utils/format.js               formatNumber / formatText / formatList (todo contempla null)
utils/countries.js            SORT_OPTIONS, normalizeText, sortCountries, filterAndSortCountries
hooks/useFetchJSON.js         hook genérico GET → { data, isLoading, error, refetch }
hooks/useFetchCountries.js    GET /api/countries
hooks/useFetchCountry.js      GET /api/countries/:code
hooks/useFetchRegions.js      GET /api/regions  (extra)
context/FavoritesContext.js   createContext + useFavorites()
context/FavoritesProvider.jsx estado de favoritos + toggleFavorite (PUT/DELETE)
components/App/App.jsx        Provider + Router + rutas
components/Layout/            barra superior + <Outlet />
components/Header/            (DADO) título h1 + children
components/PageCountryList/   página /countries
components/PageCountry/       página /countries/:code
components/CountryCard/       una fila del listado
components/FavoriteButton/    la estrella ☆/★
components/StatusMessage/     cartel de cargando / error / vacío
components/PageNotFound/      ruta *
```

---

## 2. Decisiones de ESTE código (lo específico; la teoría está en clase/)

### 2.1 La URL como estado — `PageCountryList.jsx`

Búsqueda (`q`), orden (`sort`), región (`region`) y "solo favoritos" (`fav=1`) viven en la
URL, **no** en `useState`: así sobreviven a F5, se pueden compartir y "Volver" los recupera.
Teoría: `useSearchParams` ([tema 15](../../clase/15-usesearchparams.md)).

- `updateParam(name, value)` copia los params (`new URLSearchParams(previous)`) antes de
  `set`/`delete` → no borra los demás; `{ replace: true }` → no llena el historial por tecla.
- `?sort=xyz` inválido → se valida con `Object.hasOwn(SORT_OPTIONS, sort)` y cae al default.
- "Volver al listado" en `PageCountry` recuerda la búsqueda: va en el `state` del `<Link>`.

### 2.2 Lista visible = derivada + `useMemo`

`visibleCountries = useMemo(() => countries ? filterAndSortCountries(countries, { query, region, onlyFavorites, isFavorite, sort }) : [], [countries, query, region, onlyFavorites, isFavorite, sort])`.
Ningún `useState` para la lista filtrada → [tema 9](../../clase/09-estado-derivado.md);
`useMemo` ([tema 17](../../clase/17-usememo-usecallback-useref.md)) es opcional con 250 países.

### 2.3 Orden en `utils/countries.js`

`sortCountries` ordena una **copia** (`[...array].sort`) → [tema 2](../../clase/02-javascript-para-react.md).
`compareDescending` manda los `null` al final (10 países con `area`/`populationDensity` null);
texto con `localeCompare` y `normalizeText` (sin tildes, minúsculas).

### 2.4 Hook de fetch — `hooks/useFetchJSON.js`

Genérico `{ data, isLoading, error, refetch }` (mismo estilo que los hooks de los docentes del
tatetí); un endpoint nuevo = 1 línea: `export function useFetchRegions() { return useFetchJSON('/api/regions'); }`.
Tiene `url` en dependencias (→ [tema 10](../../clase/10-useeffect.md), misma ruta otro
parámetro al clickear un limítrofe), `ignore` en la limpieza y `refetch` con contador.
Teoría del patrón: ([tema 12](../../clase/12-hooks-propios.md)).

### 2.5 Limítrofes: códigos → nombre y bandera — `PageCountry.jsx`

`borders` trae solo códigos. Elegí pedir `/api/countries` (lista completa) y buscar con
`allCountries?.find((c) => c.code === borderCode)` (1 pedido; si todavía no llegó, muestra el
código). Alternativa: componente `BorderItem` con su propio `useFetchCountry(code)` (N pedidos).

### 2.6 Favoritos — `context/FavoritesContext.js` + `FavoritesProvider.jsx` + `FavoriteButton`

Context ([tema 16](../../clase/16-context.md)) porque 3 lugares (barra, listado, detalle) usan los mismos
datos. `PUT /api/favorites` con `body: { code }` y `DELETE /api/favorites/:code` con
`fetchJSON` → [tema 11](../../clase/11-api-fetch.md); tras la respuesta se actualiza la copia
local (`setFavorites((list) => [...list, favorite])` / `filter`).
Dos archivos (contexto+hook en `.js`, Provider en `.jsx`) por el lint `react-refresh/only-export-components`.

### 2.7 404 vs error de red

`fetchJSON` tira `"GET /api/countries/XYZ failed with 404 Not Found!"` → con
`error.message.includes(' 404 ')` muestro "País no encontrado"; cualquier otro error →
"No se pudo cargar" + "Reintentar" (`refetch`).

---

## 3. Trampas encontradas (y cómo las esquivé)

1. **Lint `react-refresh/only-export-components`**: un `.jsx` que exporta un componente
   **y** un hook/contexto da warning. → Contexto + hook en `FavoritesContext.js`,
   componente Provider en `FavoritesProvider.jsx`.
2. **Lint `react-hooks/exhaustive-deps`**: todo lo que uses dentro de `useEffect`/`useMemo`/`useCallback`
   va en las dependencias. No lo apagues con `// eslint-disable`, arreglalo.
3. **Lint `semi: always`**: punto y coma en todas las sentencias.
4. **Lint `no-unused-vars`**: imports que no usás = error (ej. dejar `Outlet` importado si ya no lo usás).
5. **Hooks antes de cualquier `return`**: en `PageCountry` todos los `useX()` están arriba,
   antes de los `if (isLoading) return …`. (Regla de los hooks.)
6. **`area` y `populationDensity` null** en 10 países (GUF, GLP, …) → mostrar `—`, ordenar al final.
7. **Antártida (ATA)**: sin capital y `currencies: []` → `formatList([])` da `—`.
8. **Población 0** (BVT, HMD): `formatNumber(0)` da "0" (ojo: `if (!value)` trataría 0 como vacío).
9. **`/countries/ury` en minúscula**: la API lo acepta (hace `toUpperCase`), no hay que hacer nada.
10. **La base de datos se modifica de verdad**: marcar favoritos escribe en `web/data/db/data.json`.
    Si querés dejarlo como estaba: `git checkout web/data/db/data.json`.
11. **Warning de React Router en consola** ("v7_relativeSplatPath"): se silencia con
    `future={{ v7_startTransition: true, v7_relativeSplatPath: true }}`. Es solo aviso.

---

## 4. RECETARIO DE VARIANTES PROBABLES EN EL EXAMEN

Todas se enchufan en la solución que ya tenés. Receta general para un filtro nuevo:
**(1)** leerlo de la URL, **(2)** control que llama `updateParam`, **(3)** condición en
`filterAndSortCountries`, **(4)** agregarlo a las dependencias del `useMemo`.

### V1. Filtro por región (ya hecho) — `?region=Americas`

Ya está. Si piden región **con links** en vez de select: `<Link to="?region=Asia">Asia</Link>`
(un `to` que empieza con `?` cambia solo los query params... pero **borra los otros**;
si querés conservarlos usá `updateParam`).

### V2. Subregión dependiente de la región

```jsx
const subregion = searchParams.get('subregion') ?? '';
// opciones: subregiones únicas de los países de esa región
const subregions = countries
  ? [...new Set(countries.filter((c) => c.region === region).map((c) => c.subregion))].sort()
  : [];
// al cambiar la región, borrar la subregión (si no queda una combinación imposible)
function changeRegion(value) {
  setSearchParams((prev) => {
    const next = new URLSearchParams(prev);
    if (value) next.set('region', value); else next.delete('region');
    next.delete('subregion');
    return next;
  }, { replace: true });
}
// en el filter:  if (subregion && country.subregion !== subregion) return false;
```

### V3. Orden ascendente / descendente — `?dir=asc`

```js
const dir = searchParams.get('dir') === 'asc' ? 'asc' : 'desc';
let sorted = sortCountries(filtered, sort);
if (dir === 'asc' && sort !== 'name') sorted = sorted.reverse(); // reverse sobre la COPIA ya ordenada
```
(con nulls: mejor invertir el signo dentro de `compareDescending` para que los null sigan al final).

### V4. Paginación — `?page=2`, 20 por página

```jsx
const PAGE_SIZE = 20;
const page = Math.max(1, Number(searchParams.get('page')) || 1);
const totalPages = Math.max(1, Math.ceil(visibleCountries.length / PAGE_SIZE));
const pageCountries = visibleCountries.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

<button disabled={page <= 1} onClick={() => updateParam('page', String(page - 1))}>Anterior</button>
<span>Página {page} de {totalPages}</span>
<button disabled={page >= totalPages} onClick={() => updateParam('page', String(page + 1))}>Siguiente</button>
```
Detalle fino: cuando cambia la búsqueda, volver a página 1 → en `updateParam` hacer `next.delete('page')` si `name !== 'page'`.

### V5. Página propia de favoritos — `/favorites`

```jsx
// App.jsx
<Route path="favorites" element={<PageFavorites />} />

// PageFavorites.jsx
const { favorites } = useFavorites();                 // [{ code, date }]
const { data: countries, isLoading, error } = useFetchCountries();
const favoriteCountries = (countries ?? [])
  .filter((c) => favorites.some((f) => f.code === c.code));
// mostrar la fecha: new Date(f.date).toLocaleDateString('es-UY')
// ordenar por fecha (más nuevo primero): [...favorites].sort((a, b) => b.date.localeCompare(a.date))
```

### V6. Filtro por población mínima / máxima (input numérico)

```jsx
const minPop = Number(searchParams.get('minPop')) || 0;
<input type="number" min="0" value={searchParams.get('minPop') ?? ''}
       onChange={(e) => updateParam('minPop', e.target.value)} />
// filter: if (country.population < minPop) return false;
```

### V7. Estadísticas de lo mostrado (total, promedio, conteo por región)

```js
let totalPopulation = 0;
const countByRegion = {};
for (const country of visibleCountries) {
  totalPopulation += country.population;
  countByRegion[country.region] = (countByRegion[country.region] ?? 0) + 1;
}
// Object.entries(countByRegion).map(([region, count]) => <li key={region}>{region}: {count}</li>)
```

### V8. País al azar

```jsx
const navigate = useNavigate();
function goRandom() {
  const random = countries[Math.floor(Math.random() * countries.length)];
  navigate(`/countries/${random.code}`);
}
```

### V9. Página por región reutilizando componentes — `/regions/:region`

```jsx
<Route path="regions/:region" element={<PageRegion />} />
// PageRegion: const { region } = useParams(); filtrar countries por region y
// renderizar <CountryCard> para cada uno (REUTILIZAR, que es lo que evalúan).
// Links de regiones desde /api/regions: regions.map((r) => <Link to={`/regions/${encodeURIComponent(r)}`}>{r}</Link>)
```
Ojo "Antarctic Ocean" tiene espacio → `encodeURIComponent` en el link; `useParams` ya lo devuelve decodificado.

### V10. Datos de los limítrofes más completos (población, capital) / "comparar"

La lista `/api/countries` ya trae `capital`, `population`, `area` → en el `borders.map`
de `PageCountry` usar `found.population` etc. Para comparar con el país actual:
`found.population > country.population ? 'más poblado' : 'menos poblado'`.

### V11. Cosas que SOLO trae el detalle (idiomas, monedas, independiente, husos)

El listado **no** trae `languages`, `currencies`, `independent`, `timezones`, `borders`.
Si piden filtrar el listado por eso, hay que pedir el detalle de cada país
(250 pedidos: `Promise.all(countries.map((c) => fetchJSON(`/api/countries/${c.code}`)))`) —
es raro que lo pidan; leé bien qué campos trae cada endpoint (tabla de la API del README).

### V12. Mostrar la cantidad de vecinos en el listado / ordenar por cantidad de vecinos

Mismo problema que V11 (el listado no trae `borders`). Mismo remedio.

### V13. Modo oscuro / preferencia persistente (Context + localStorage)

Ver `Ejers/UT5/UT5.1.2-paises-dark-mode/src/contextos/ContextoTema.jsx` + [tema 10](../../clase/10-useeffect.md) (localStorage).
```js
const [dark, setDark] = useState(() => localStorage.getItem('dark') === '1');
useEffect(() => { localStorage.setItem('dark', dark ? '1' : '0'); }, [dark]);
```

### V14. Favoritos "optimistas" (cambia la estrella antes de que responda la API)

```js
setFavorites((list) => [...list, { code, date: new Date().toISOString() }]); // antes del await
try { await fetchJSON(...); } catch (err) {
  setFavorites((list) => list.filter((f) => f.code !== code));               // deshacer si falla
  setError(err);
}
```

### V15. Vista grilla / lista (toggle) — `?view=grid`

```jsx
const view = searchParams.get('view') === 'grid' ? 'grid' : 'list';
<ul className={view === 'grid' ? styles.grid : styles.list}>…</ul>
/* .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 16px; } */
```

### V16. Búsqueda también por capital o por código

```js
const text = normalizeText(`${country.name} ${country.capital ?? ''} ${country.code}`);
if (normalizedQuery && !text.includes(normalizedQuery)) return false;
```
(`capital ?? ''` porque hay 5 null → `normalizeText(null)` rompe.)

---

## 5. Si en el examen me trabo: orden de prioridades

1. Rutas + listado que muestra datos (aunque feo).
2. Detalle con los campos + limítrofes con `<Link>`.
3. Casos borde: sin capital, sin fronteras, 404, loading/error.
4. Búsqueda + orden **en la URL**.
5. "Mostrando X de Y" y "sin resultados".
6. `npm run lint` limpio.
7. Opcionales (favoritos) y estilos.

Probar a mano antes de entregar: `/countries?q=uru&sort=population` + F5,
`/countries/XYZ`, `/countries/ATA` (sin capital), `/countries/AUS` (sin fronteras),
clic en un limítrofe, "Volver".
