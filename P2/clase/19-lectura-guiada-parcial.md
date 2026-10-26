# Tema 19 — Lectura guiada de un parcial completo (el matutino)

Recorrido de `parciales/simulacro-prueba2-2026sem2-matutino/web/src/` marcando qué tema explica cada pieza.
Abrí los archivos mientras leés.

## 19.1 ¿Dónde vive cada dato? (la pregunta clave de cualquier app)

| Dato | Dónde vive | Por qué | Tema |
|---|---|---|---|
| Los 250 países | hook `useFetchCountries` | vienen de la API, los usa una página | [12](12-hooks-propios.md) |
| País del detalle | hook `useFetchCountry(code)` | depende de `:code` | [12](12-hooks-propios.md), [14](14-useparams-usenavigate.md) |
| Código del país | **URL** `/countries/:code` | identidad de la página | [14](14-useparams-usenavigate.md) |
| Búsqueda, orden, región, solo favoritos | **URL** `?q=&sort=` | sobrevivir a F5 / compartir | [15](15-usesearchparams.md) |
| Visibles, "Mostrando X de Y" | **ningún lado: se calculan** | salen de lo anterior | [9](09-estado-derivado.md) |
| Favoritos | **Context** `FavoritesProvider` | barra + listado + detalle | [16](16-context.md) |
| Búsqueda al "Volver" | `state` del `Link` | comodidad, no imprescindible | [14.7](14-useparams-usenavigate.md) |

Casi no hay `useState` en las páginas → solución corta y robusta.

## 19.2 `App.jsx` + `Layout.jsx` (temas 13, 16)

```jsx
<FavoritesProvider>                                                  {/* 16 */}
  <BrowserRouter future={{ … }}>                                     {/* 13 */}
    <Routes>
      <Route path="/" element={<Layout />}>                          {/* 13.5 Outlet */}
        <Route index element={<Navigate to="/countries" replace />} />
        <Route path="countries" element={<PageCountryList />} />
        <Route path="countries/:code" element={<PageCountry />} />   {/* 14 */}
        <Route path="*" element={<PageNotFound />} />
      </Route>
    </Routes>
  </BrowserRouter>
</FavoritesProvider>
```
`Layout`: barra con `<Link>` (13.3), `favorites.length` del Context (16), `<Outlet />`.

## 19.3 Datos: `hooks/useFetchJSON.js` (temas 7, 10, 11, 12, 17)

`useState` ×4 · `useEffect([url, reloadIndex])` · async adentro · `try/catch/finally` · `ignore` + limpieza ·
`refetch` con `useCallback`. Más `useFetchCountries` / `useFetchCountry(code)` / `useFetchRegions` de una línea.

## 19.4 Detalle: `PageCountry.jsx` (temas 2, 5, 12, 13, 14)

```jsx
const { code } = useParams();
const location = useLocation();
const { data: country, isLoading, error, refetch } = useFetchCountry(code);
const { data: allCountries } = useFetchCountries();
// ↑ todos los hooks arriba (7.6)
if (isLoading) return …;                                         // 5.3 d
if (error) { const notFound = error.message.includes(' 404 '); … }   // 11.3, 12.4
```
- Limítrofes: `borders.map` + `allCountries?.find(...)` + `??` (tema 2, repaso).
- `country.languages.map((l) => l.name)` (5.4: objetos no se dibujan).
- `formatNumber`/`formatText` para `null` (2.6).
- `<Link to={`/countries/${border.code}`}>` sin recargar (13.3) + hook con `[url]` (10.5).

## 19.5 Listado: `PageCountryList.jsx` (temas 2, 5, 8, 9, 15, 17)

```jsx
const [searchParams, setSearchParams] = useSearchParams();
const query = searchParams.get('q') ?? '';
const sort = Object.hasOwn(SORT_OPTIONS, sortParam ?? '') ? sortParam : DEFAULT_SORT;
function updateParam(name, value) { … }
const visibleCountries = useMemo(() => { /* filter + sort */ }, […]);
let content; if (isLoading) … else if (error) … else if (visibleCountries.length === 0) … else …
<input value={query} onChange={(e) => updateParam('q', e.target.value)} />
```
Dentro del `useMemo`: `filter` + `includes` (texto sin tildes con `normalizeText`), `sort` + `localeCompare`, nulls de área al final con `compareDescending` (definidas arriba del componente).

## 19.6 Favoritos (temas 6, 7, 11, 16, 18)

- `FavoritesContext.js` + `FavoritesProvider.jsx` (dos archivos por el lint).
- `toggleFavorite`: PUT (body objeto) / DELETE → spread / `filter`.
- `FavoriteButton`: `onClick={() => toggleFavorite(code)}`, `styles.active` condicional.

## 19.7 Seguir un evento de punta a punta

**Escribe "u":**
```
onChange → updateParam('q','u') → URL ?q=u → re-render → get('q')='u' → useMemo recalcula → "Mostrando 12 de 250"
```
**Estrella de Argentina:**
```
onClick → toggleFavorite('ARG') → await PUT → setFavorites([...list, nuevo]) → cambia el value
→ se redibujan todos los useFavorites: estrella ★ + contador de la barra
```
**Clic en "Brazil" (limítrofe):**
```
<Link> → /countries/BRA sin recargar → PageCountry NO se desmonta, code='BRA'
→ url cambió → efecto de nuevo (ignore=true en el de URY) → "Cargando…" → Brasil
```

## 19.8 Leer CUALQUIER parcial

1. README → qué piden. 2. `mock-routes.js` → datos. 3. `App.jsx` → páginas.
4. **Tabla "dónde vive cada dato"** (19.1). 5. Cada página: hooks → estados de carga → cálculos → JSX.

Preguntas guía: ¿qué se **calcula** y qué se **guarda**? ¿Qué efecto depende de qué (y qué pasa con `[]`)?
¿Cómo se entera la pantalla después de un PUT/DELETE (refetch o actualizar estado)? Si agregan "filtro por región"
o "`/favorites`", ¿qué archivos toco? (recetario §4 del APUNTES-PARCIAL del matutino).

### Qué se pidió cada año

| Prueba | Carpeta (`parciales/…`) | Router | Datos | Context | Form | Juego |
|---|---|---|---|---|---|---|
| **Sim. 2026sem2 mat.** (países) | `simulacro-prueba2-2026sem2-matutino` | `/countries`, `/:code` + query | `fetchJSON` + PUT/DELETE | sí (opcional) | buscador/select por URL | no |
| **Sim. 2026sem2 vesp.** (tatetí) | `simulacro-prueba2-2026sem2-vespertino` | `/`, `/play`, `/players` | hooks docentes, PUT | no | alta + selects | sí |
| Prueba 2026sem1 (Trello) | `2026sem1-prueba2-vespertino` | `/`, `/tasks/new`, `/tasks/:id/edit` | json-server CRUD | sí | crear + editar | no |
| Sim. 2026sem1 (BarApp) | `2026sem1-simulacro-vespertino` | `/cuentas`, `/cuentas/nueva` | json-server GET/POST | sí | crear | no |
| Parcial 2025sem2 mat. | `2025sem2-parcial2-matutino` | `/`, `/country/:cca3` | mock Vite | no | 3 selects | no |
| Parcial 2025sem2 vesp. | `2025sem2-parcial2-vespertino` | 9 rutas | mock Vite | no | no | no |
| Sim. 2025sem2 mat. | `2025sem2-simulacro-matutino` | `/`, `/country/:cca3` | mock Vite | sí (puntaje) | no | azar |
| Sim. 2025sem2 vesp. | `2025sem2-simulacro-vespertino` | `/`, `/end`, `/:cca3` | mock Vite | sí (juego) | no | azar |

**Siempre:** rutas + `Link` + `useParams`, fetch con cargando/error, `map` + `key`, detalle por parámetro.
**Casi siempre:** Context, formulario controlado, `<select>` con opciones de la API.

### Los otros parciales solo cambian dónde vive cada cosa

| Pieza | Dónde verla | Tema |
|---|---|---|
| Tablero en hook `useTicTacToe`, `onFinish` al padre, estadísticas calculadas | `parciales/simulacro-prueba2-2026sem2-vespertino/web/src/` | 4.3, 9, 17 |
| Provider en `main.jsx` (App hace `useContext`) | `parciales/2026sem1-prueba2-vespertino/src/main.jsx` | 16.4 |
| Crear/editar misma página (`Boolean(id)`, `[name]`) | `parciales/2026sem1-prueba2-vespertino/src/pages/TaskFormPage/TaskFormPage.jsx` | 8.4-8.5, 14.8 |
| Borrar (DELETE → `filter`) y cambiar estado (PUT → `map`) | `parciales/2026sem1-prueba2-vespertino/src/pages/BoardPage/BoardPage.jsx` | 7.5, 11 |
| Provider autosuficiente `{ total, recargar }` | `parciales/2026sem1-simulacro-vespertino/src/context/RecaudacionProvider.jsx` | 16.6 |
| Lista reutilizable `titulo` + `url` + envoltorios | `parciales/2025sem2-parcial2-vespertino/web/src/components/ListaDePaises.jsx` | 4, 14.1 |
| Puntaje en Context + estado gatillo | `parciales/2025sem2-simulacro-matutino/web/src/context/ContextoPuntaje.jsx` | 16.1, 10.10 c |
| Azar (elegir, mezclar) | `parciales/2025sem2-simulacro-matutino/web/src/utils/azar.js` | 2 |

Formatos (backend, comandos, `fetchJSON` vs service, PUT vs POST) y plan de ataque → `ESTRATEGIA-EXAMEN.md`.

---

## ❓ Pregunta final

**Pregunta:** qué pasa, en orden, al recargar (F5) en `/countries?q=arg&sort=population` hasta ver la lista.

**Respuesta:**
```
1. Navegador pide la URL a Vite → no es un archivo → devuelve index.html                  [1]
2. index.html → main.jsx → render(<App />)                                                 [1]
3. App → FavoritesProvider: useEffect([]) → GET /api/favorites                            [16]
4. BrowserRouter lee la URL → Routes elige Layout + hija "countries"                       [13]
5. Layout: barra ("Favoritos (0)" por ahora) + <Outlet /> = PageCountryList
6. PageCountryList 1er render: useFetchCountries → data=null → "Cargando…";
   useSearchParams → q='arg', sort='population' (¡de la URL!) → el input ya muestra "arg" [12, 15]
7. Después de dibujar corren los efectos → GET /api/countries (+ /api/regions)             [10]
8. mock-routes.js responde → fetchJSON devuelve el array                                   [11]
9. setData(250) + setIsLoading(false) → re-render                                          [7]
10. useMemo: cambió countries → filtra 'arg' y ordena por población                        [9, 17]
11. "Mostrando 1 de 250" + Argentina
12. (En paralelo llegan los favoritos → barra y estrellas se actualizan)
```
**Clave:** búsqueda y orden no estaban en un `useState` que se pierde: estaban en la URL.
