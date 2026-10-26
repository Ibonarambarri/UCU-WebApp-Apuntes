# Plan de ruta del examen (basado en el simulacro matutino)

> Guía paso a paso para las ~2 h. Supone que el examen es **muy parecido al matutino** (Country
> Explorer: listado + detalle + URL + favoritos). Cada paso dice **qué hacer**, **de dónde copiar**,
> **cómo comprobar que quedó bien** y **cuánto tiempo darle**.
>
> Regla de oro: **se puede usar todo lo que hay en la compu** → no escribas desde cero lo que ya
> tenés resuelto. **Copiá y adaptá.**

La solución que vas a copiar (la llamamos `SOL` en todo el plan):
```bash
SOL="/Users/ibonarambarri/Documents/Uni/Curso 5/UCU/WebApp/P2/parciales/simulacro-prueba2-2026sem2-matutino"
```
Pegá esa línea en la terminal al empezar: todos los comandos de abajo la usan.

---

## Resumen en una tabla

| Fase | Min. | Qué | Puntos que asegura |
|---|---|---|---|
| 0 | 0–10 | Arrancar + **comparar el enunciado con el del simulacro** | — (decide todo lo demás) |
| 1 | 10–20 | Copiar la "infraestructura" (hooks, utils, StatusMessage, Layout) | base de todo |
| 2 | 20–45 | **Detalle** `/countries/:code` + casos borde | detalle, limítrofes, sin capital, sin fronteras, 404, carga/error |
| 3 | 45–75 | **Listado** + búsqueda + orden **en la URL** + contador | listado, query params, "Mostrando X de Y", sin resultados |
| 4 | 75–85 | Lint + prueba manual + **commit y push** | lint sin advertencias, entrega segura |
| 5 | 85–105 | Opcionales (favoritos) y variantes nuevas | opcionales |
| 6 | 105–120 | Estilos, revisión final, **Pull Request** | presentación, entrega |

Si en algún paso te trabás **más de 10 minutos** → anotalo, pasá al siguiente y volvé al final.

---

## FASE 0 — Arrancar y detectar las diferencias (0–10 min)

### Paso 0.1 · Clonar, instalar y levantar (3 min)
```bash
git clone <url-de-TU-fork>
cd <carpeta-del-repo>
npm install --prefer-offline          # usa la caché: funciona sin internet
npm start                             # http://localhost:5173
```
Si `npm install` falla sin internet → `cp -R "$SOL/node_modules" .` (el `package.json` del simulacro era idéntico; comprobalo con `diff package.json "$SOL/package.json"`).

✅ **Comprobar:** `localhost:5173` abre y `localhost:5173/api/countries` devuelve JSON.

### Paso 0.2 · ⭐ Comparar el examen con el simulacro (5 min) — EL PASO MÁS IMPORTANTE
```bash
diff "$SOL/README.md" README.md                        # ¿qué cambió en el ENUNCIADO?
diff "$SOL/web/data/mock-routes.js" web/data/mock-routes.js   # ¿cambió la API?
diff "$SOL/web/data/db/schema.json" web/data/db/schema.json   # ¿cambiaron los datos?
diff -r "$SOL/web/src" web/src | grep -E "^Only in|^diff"     # ¿qué trae la plantilla?
```
Con esto sabés **exactamente** qué es igual y qué es nuevo. Anotá en un papel:
- [ ] Rutas pedidas (¿siguen siendo `/countries` y `/countries/:code`? ¿hay otra?)
- [ ] Campos a mostrar en listado y detalle (¿alguno nuevo?)
- [ ] Filtros / orden pedidos (¿región? ¿subregión? ¿paginación?) → buscar en el **recetario** (§4 de `parciales/simulacro-prueba2-2026sem2-matutino/APUNTES-PARCIAL.md`)
- [ ] Endpoints nuevos o que cambiaron de método (¿crear sigue siendo **PUT**?)
- [ ] "Casos a contemplar" (cada uno es un punto fácil)
- [ ] Qué es **opcional**

### Paso 0.3 · Elegir escenario (1 min)

| Si el diff muestra… | Escenario | Qué hacer |
|---|---|---|
| Mismo enunciado con pocos cambios (un filtro más, un campo más, una ruta más) | **A — Casi igual** | Fase 1 atajo: copiar todo `src/` y adaptar |
| Misma API de países pero pantallas distintas | **B — Parecido** | Fases 1 → 6 en orden, copiando pieza por pieza |
| Otra app (otros datos, p. ej. tatetí) | **C — Distinto** | Mismo orden de fases; copiar hooks/utils/StatusMessage y seguir la estructura, mirando el simulacro vespertino |

---

## FASE 1 — Infraestructura (10–20 min)

### Escenario A (atajo): copiar toda la solución y adaptar
```bash
cp -R "$SOL/web/src/." web/src/        # pisa src con la solución completa
npm run lint                           # tiene que dar limpio
```
✅ Probá todas las URLs de la Fase 4. Luego **saltá directo a adaptar las diferencias** que anotaste
en el paso 0.2, usando el recetario de variantes. Commit apenas funcione lo básico.

### Escenario B (misma API de países): copiar la base completa
⚠️ En la solución **casi todo importa el Context de favoritos** (la barra, la tarjeta, la estrella y
las dos páginas). Si copiás archivos sueltos sin él, Vite tira *"Failed to resolve import"*. Por eso
se copia la base entera de una vez:
```bash
cd web/src
mkdir -p hooks context components/StatusMessage components/Layout components/FavoriteButton components/CountryCard components/PageNotFound
cp "$SOL/web/src/hooks/"* hooks/                                   # useFetchJSON + 1 hook por endpoint
cp "$SOL/web/src/utils/format.js" utils/
cp "$SOL/web/src/context/"* context/                               # FavoritesContext.js + FavoritesProvider.jsx
cp "$SOL/web/src/components/StatusMessage/"* components/StatusMessage/
cp "$SOL/web/src/components/Layout/"* components/Layout/
cp "$SOL/web/src/components/FavoriteButton/"* components/FavoriteButton/
cp "$SOL/web/src/components/CountryCard/"* components/CountryCard/
cp "$SOL/web/src/components/PageNotFound/"* components/PageNotFound/
cp "$SOL/web/src/components/App/App.jsx" components/App/           # Provider + Router + rutas
cd ../..
```
Si el `App.jsx` de la plantilla nueva trae **rutas distintas**, no lo pises: agregale a mano
`<FavoritesProvider>` alrededor del `BrowserRouter`, `<Layout />` como ruta padre y las rutas que pida
el enunciado ([tema 13.5](clase/13-router-rutas.md), [16.4](clase/16-context.md)). Borrá los imports
que queden sin usar (`Outlet`, `styles`) o el lint falla.

**Si la API del examen NO tiene `/api/favorites`:** no copies `context/` ni `FavoriteButton/`, y
borrá en `Layout.jsx` y `CountryCard.jsx` las líneas que usan `useFavorites` / `<FavoriteButton>`.

| Archivo de la solución | Necesita también… |
|---|---|
| `App.jsx` | `context/FavoritesProvider.jsx`, `Layout/`, `PageNotFound/`, `PageCountryList/`, `PageCountry/` |
| `Layout.jsx` | `context/FavoritesContext.js` (y el Provider en App) |
| `CountryCard.jsx` | `FavoriteButton/`, `utils/format.js` |
| `FavoriteButton.jsx` | `context/FavoritesContext.js` |
| `PageCountry.jsx` | `Header/` (viene en la plantilla), `FavoriteButton/`, `StatusMessage/`, `useFetchCountry`, `useFetchCountries`, `utils/format.js` |
| `PageCountryList.jsx` | `CountryCard/`, `StatusMessage/`, `useFetchCountries`, `useFetchRegions`, `context/` (el filtrado y el orden están dentro del propio archivo) |

### Escenario C (otra app): solo lo genérico
```bash
mkdir -p web/src/hooks web/src/components/StatusMessage
cp "$SOL/web/src/hooks/useFetchJSON.js" web/src/hooks/
cp "$SOL/web/src/utils/format.js" web/src/utils/
cp "$SOL/web/src/components/StatusMessage/"* web/src/components/StatusMessage/
```
Y un hook de **1 línea** por endpoint ([tema 12.6](clase/12-hooks-propios.md)):
```js
// web/src/hooks/useFetchPlayers.js
import { useFetchJSON } from './useFetchJSON.js';
export function useFetchPlayers() { return useFetchJSON('/api/players'); }
```
Si la plantilla **ya trae hooks** (como el tatetí), usá los suyos y guiate por el simulacro vespertino.

✅ **Comprobar:** `npm start` sin errores en la terminal ni en la consola del navegador; `npm run lint` limpio.

---

## FASE 2 — Página de detalle `/countries/:code` (20–45 min)

**Por qué primero el detalle:** es autocontenido y cubre la mayoría de los "casos a contemplar"
(404, sin capital, sin fronteras, carga, error).

Copiar como base: `cp "$SOL/web/src/components/PageCountry/"* web/src/components/PageCountry/`
y adaptar campos. Si preferís escribirlo, este es el orden:

| Paso | Qué | Dónde está explicado |
|---|---|---|
| 2.1 | `const { code } = useParams();` | [tema 14.1](clase/14-useparams-usenavigate.md) |
| 2.2 | `useFetchCountry(code)` (+ `useFetchCountries()` para los nombres de los limítrofes) — **todos los hooks arriba** | [tema 12](clase/12-hooks-propios.md), [7.6](clase/07-usestate.md) |
| 2.3 | `if (isLoading) return …` y `if (error)` distinguiendo **404** (`error.message.includes(' 404 ')`) | [tema 12.4](clase/12-hooks-propios.md) |
| 2.4 | Campos: nombre, nativo, bandera, capital, región, subregión, población, área, densidad | usar `formatText` / `formatNumber` (contemplan `null`) |
| 2.5 | Listas de objetos → `languages.map((l) => l.name)`, monedas `name (symbol)`, husos, dominio → `formatList` | [tema 5.4](clase/05-listas-y-condicionales.md) |
| 2.6 | Limítrofes: `borders.map(code => allCountries?.find(...))` → `<Link to={`/countries/${b.code}`}>` | [tema 2 repaso](clase/02-javascript-para-react.md), [13.3](clase/13-router-rutas.md) |
| 2.7 | `borders.length === 0` → "Este país no tiene fronteras terrestres." | [tema 5.3](clase/05-listas-y-condicionales.md) |
| 2.8 | `<Link to="/countries">← Volver al listado</Link>` | [tema 13.3](clase/13-router-rutas.md) |

✅ **Comprobar (cada una):**
- `/countries/URY` → todos los datos, limítrofes Argentina y Brasil.
- Clic en "Argentina" → cambia **sin recargar** y muestra Argentina (si no cambia: falta `[code]`/`[url]` en el efecto).
- `/countries/ATA` → capital `—`, monedas `—`, sin fronteras.
- `/countries/GUF` → área y densidad `—`.
- `/countries/AUS` → "no tiene fronteras terrestres".
- `/countries/XYZ` → "País no encontrado".
- `/countries/ury` (minúscula) → funciona.

💾 `git add -A && git commit -m "Detalle de país" && git push`

---

## FASE 3 — Listado `/countries` (45–75 min)

Copiar como base: `PageCountryList/` y `CountryCard/` del `SOL` (búsqueda y orden están **dentro** de `PageCountryList.jsx`), o escribir en este orden:

| Paso | Qué | Dónde está explicado |
|---|---|---|
| 3.1 | `useFetchCountries()` + lista con `map` + `key={c.code}` → `<CountryCard>` (bandera, nombre, capital, región, población, link al detalle) | [tema 5](clase/05-listas-y-condicionales.md), [4](clase/04-props-y-children.md) |
| 3.2 | Estados: cargando / error (+ Reintentar) / vacío / lista con la variable `content` | [tema 12.4](clase/12-hooks-propios.md) |
| 3.3 | `useSearchParams` + función **`updateParam`** (copiar de CHULETA §2) | [tema 15.4](clase/15-usesearchparams.md) |
| 3.4 | Buscador: `const query = searchParams.get('q') ?? ''` + `<input value={query} onChange={(e) => updateParam('q', e.target.value)} />` | [tema 15.5](clase/15-usesearchparams.md) |
| 3.5 | Orden: `sort` validado (`name`/`population`/`area`) + `<select>` | [tema 15.3](clase/15-usesearchparams.md) |
| 3.6 | Lista visible **calculada**: `filter` (texto normalizado) + `[...].sort` (nulls de área al final) | [tema 9](clase/09-estado-derivado.md), `useMemo` de `PageCountryList.jsx` |
| 3.7 | "Mostrando {visibles.length} de {countries.length} países" | [tema 9](clase/09-estado-derivado.md) |
| 3.8 | Sin resultados: `No se encontraron países para "{query}".` | [tema 5.3](clase/05-listas-y-condicionales.md) |
| 3.9 | Filtros nuevos del enunciado → receta: leer de la URL → control con `updateParam` → condición en el filter → deps del `useMemo` | [tema 15.7](clase/15-usesearchparams.md) + recetario |

✅ **Comprobar:**
- `/countries` → "Mostrando 250 de 250".
- Escribir "uru" → la URL pasa a `?q=uru` y la lista se filtra.
- Elegir "Población" → `?q=uru&sort=population` (**no se pierde `q`**).
- **F5** → mismo resultado, input con "uru" y select en "Población".
- "xyz" → mensaje de sin resultados.
- `?sort=area` → los `null` al final; `?sort=cualquiercosa` → no rompe (usa el default).
- Clic en un país → detalle; "Volver" → listado.

💾 `git add -A && git commit -m "Listado con búsqueda y orden en la URL" && git push`

---

## FASE 4 — Lint, prueba completa y entrega segura (75–85 min)

```bash
npm run lint
```
Arreglar todo con la tabla de [tema 18.6](clase/18-css-modules-y-lint.md) (lo típico: `;`, imports sin
usar, dependencias de `useEffect`, Context y Provider en el mismo archivo).

✅ Consola del navegador **sin** errores rojos ni `key` warnings. Repetir las pruebas de las Fases 2 y 3.

💾 `git add -A && git commit -m "Lint limpio" && git push` → **a partir de acá lo obligatorio ya está entregado.**

---

## FASE 5 — Opcionales y lo nuevo del examen (85–105 min)

### 5.1 Favoritos (si lo piden, aunque sea opcional)
En el escenario B ya los copiaste en la Fase 1 (Context + `FavoriteButton` + Provider en App). Solo falta:
1. Confirmar que `<FavoritesProvider>` envuelve el `BrowserRouter` en `App.jsx` ([tema 16.4](clase/16-context.md)).
2. Confirmar que está `<FavoriteButton code={country.code} />` en `CountryCard` y en el `Header` del detalle.
3. "Solo favoritos": checkbox con `updateParam('fav', checked ? '1' : '')` + condición en el filter
   (`isFavorite` a las deps del `useMemo`).
4. Revisar en `mock-routes.js` que sigan siendo `PUT /api/favorites` y `DELETE /api/favorites/:code`.

✅ Marcar una estrella → F5 → sigue marcada. El contador de la barra se actualiza solo.

### 5.2 Lo nuevo que apareció en el diff del paso 0.2
Buscar en el **recetario de variantes** (`parciales/simulacro-prueba2-2026sem2-matutino/APUNTES-PARCIAL.md` §4):

| Si piden… | Variante |
|---|---|
| Filtro por región / subregión | V1 (ya hecho en el SOL) / V2 |
| Orden ascendente/descendente | V3 |
| Paginación | V4 |
| Página `/favorites` | V5 |
| Población mínima/máxima | V6 |
| Estadísticas (total, promedio, por región) | V7 |
| País al azar | V8 |
| `/regions/:region` reutilizando componentes | V9 |
| Datos de limítrofes (población, capital) | V10 |
| Filtrar por idiomas/monedas (el listado no los trae) | V11 |
| Grilla/lista, búsqueda por capital o código | V15 / V16 |

💾 Commit + push después de **cada** opcional que funcione.

---

## FASE 6 — Estilos y cierre (105–120 min)

1. Abrir `specs/design.svg` (arrastrarlo al navegador) y acercar el diseño con CSS Modules:
   barra, tarjetas, detalle ([tema 18.5](clase/18-css-modules-y-lint.md)). **No gastar más de 10 min.**
2. `npm run lint` otra vez (el CSS no rompe el lint, pero los cambios en JSX sí pueden).
3. Última pasada por todas las comprobaciones ✅.
4. 💾 `git add -A && git commit -m "Estilos y ajustes finales" && git push`
5. **Pull Request** en GitHub, en **tu fork**, antes de la hora. Verificar que el PR muestra los commits.

---

## Si algo sale mal

| Síntoma | Ir a |
|---|---|
| Pantalla en blanco | consola del navegador; `element={<X />}` ([13.9](clase/13-router-rutas.md)) |
| "Cargando…" eterno | pestaña Network; `finally { setIsLoading(false) }` ([12.3](clase/12-hooks-propios.md)) |
| El limítrofe cambia la URL pero no la pantalla | dependencias `[code]` / `[url]` ([10.5](clase/10-useeffect.md)) |
| La búsqueda se pierde al elegir orden | `updateParam` con `new URLSearchParams(prev)` ([15.4](clase/15-usesearchparams.md)) |
| PUT da 400 | no hacer `JSON.stringify` con `fetchJSON` ([11.3](clase/11-api-fetch.md)) |
| `Cannot read properties of null` | `?.` / `??` o Provider mal ubicado ([2.6](clase/02-javascript-para-react.md), [16.4](clase/16-context.md)) |
| `Objects are not valid as a React child` | mostrar `.name` de cada objeto ([5.4](clase/05-listas-y-condicionales.md)) |
| Todas las trampas | [ESTRATEGIA-EXAMEN.md](ESTRATEGIA-EXAMEN.md) |

**Material para tener abierto:** este plan · [CHULETA-EXAMEN.md](CHULETA-EXAMEN.md) · el `SOL` en el editor ·
el visor (`cd P2/visor-apuntes && npm start` → `localhost:5190`).
