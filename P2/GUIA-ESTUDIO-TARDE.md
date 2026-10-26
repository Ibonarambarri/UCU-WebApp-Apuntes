# Guía para la tarde de estudio — Parcial 2 (React + Router + Context)

**Objetivo:** entender cada concepto lo suficiente para **adaptarlo** a lo que pidan y
llegar con todo el material ordenado. No hay que memorizar: se pueden llevar apuntes,
pero **sin internet y sin IA**, así que tus apuntes y tus simulacros resueltos
son tu única ayuda.

## Lo más importante: la pista del profe

"Traigan el simulacro matutino hecho, les va a servir mucho." Eso quiere decir:

- El examen casi seguro usa **la misma plantilla** (Vite + mock API + `fetchJSON` +
  CSS Modules + React Router v6) y probablemente **la misma app de países** con
  otros requisitos (el TODO de la plantilla dice "filtro por región" y la API
  trae `/api/regions`, que el simulacro dice que no se usa: **ese es el candidato
  número 1 del examen**).
- El simulacro vespertino (tatetí) tiene la misma plantilla y además trae los
  **hooks de los docentes** (`useFetchPlayers`, `useCreatePlayer`…). Son el
  "estilo oficial" y conviene copiarlos.
- La meta de hoy no es "haber visto" la solución. Es poder **rehacerla sola/o y
  cambiarla rápido**.

---

Qué es cada archivo y cómo correr cada proyecto: [README](README.md). Trampas, plan de 2 h y
checklist de entrega: [ESTRATEGIA-EXAMEN.md](ESTRATEGIA-EXAMEN.md).

---

## Plan de la tarde (~5 h con pausas)

### Bloque 0 — Preparar el entorno (10 min)

```bash
cd "parciales/simulacro-prueba2-2026sem2-matutino" && npm start
# abrir http://localhost:5173 y usar la app: buscar, ordenar, favorito, detalle, limítrofe, F5
```
Probar a mano `/countries?q=uru&sort=population` (F5), `/countries/XYZ`,
`/countries/ATA`, `/countries/AUS`. Así sabés **qué** hace la app antes de leer **cómo**.

### Bloque 1 — Entender la solución del matutino (60 min)

Con `…-matutino/APUNTES-PARCIAL.md` abierto, leé el código **en este orden**
(de lo simple a lo complejo), preguntándote en cada archivo "¿por qué así?":

1. `components/App/App.jsx` + `Layout/Layout.jsx` → rutas anidadas y `<Outlet />`.
2. `hooks/useFetchJSON.js` → el patrón `data/isLoading/error/refetch` (§2.4 de los apuntes).
3. `components/PageCountry/PageCountry.jsx` → `useParams`, los 4 estados, 404, limítrofes.
4. `utils/format.js` → mostrar los `null` (`—`).
5. `components/PageCountryList/PageCountryList.jsx` → **`useSearchParams`** (lo nuevo, §2.1) y `useMemo`.
6. `context/FavoritesContext.js` + `FavoritesProvider.jsx` + `FavoriteButton` → Context y PUT/DELETE.

**Autoevaluación:** tenés que poder explicar en voz alta:
- ¿Por qué la búsqueda no está en un `useState`?
- ¿Qué pasa si el `useEffect` del detalle tuviera `[]` y hago clic en un limítrofe?
- ¿Por qué `[...countries].sort()` y no `countries.sort()`?
- ¿Por qué el Context está en dos archivos?
- ¿Cómo sé si un error es un 404?

Si alguna no te sale, releé la sección de los apuntes del matutino o el tema de [`clase/`](clase/00-INDICE-CLASE.md) que corresponde (tabla "Concepto → tema" del [README](README.md)).

### ☕ Pausa (10 min)

### Bloque 2 — Rehacer el matutino SIN mirar, con reloj (90 min)

En `parciales/practica-matutino/` (plantilla limpia). Ponete un cronómetro de
**90 minutos** (los apuntes de parciales anteriores hablan de un examen de ~2 h, así que te queda margen). Reglas: **solo** podés mirar la
`CHULETA-EXAMEN.md` y la teoría de `clase/`, **no** la solución. Seguí el orden de
prioridades (§5 de los apuntes del matutino):

1. (15') Detalle `/countries/:code` con todos los campos + estados.
2. (15') Limítrofes con `<Link>` + volver.
3. (20') Listado + búsqueda + orden.
4. (15') Pasar búsqueda y orden a la URL (`useSearchParams`).
5. (10') "Mostrando X de Y", sin resultados, casos borde.
6. (15') Favoritos (aunque sea sin Context: un hook en cada página alcanza).
7. `npm run lint` limpio.

Al terminar, **recién ahí** comparás con la solución. Anotá en un papel lo que te
trabó, porque eso es lo que tenés que repasar.

> Si te pasás del tiempo: está bien, pero registrá **dónde** se te fue el tiempo.

### ☕ Pausa (15 min)

### Bloque 3 — Variantes (45 min)

Sobre tu versión de práctica (o sobre la resuelta), implementá **3 variantes** del
recetario (§4 de los apuntes del matutino). En este orden, porque son las más probables:

1. **V1/V2** filtro por región (+ subregión dependiente).
2. **V4** paginación con `?page=`, o **V5** página `/favorites`.
3. **V7** estadísticas, o **V9** `/regions/:region` reutilizando `CountryCard`.

Tratá de hacer cada una en ≤15 min. Lo que se evalúa es la velocidad para adaptar.

### Bloque 4 — Tatetí vespertino (40 min)

1. (10') Leé `…-vespertino/APUNTES-PARCIAL.md` y los **hooks dados** (`web/src/hooks/`):
   ese es el estilo de los docentes (`useCreateX` con `isCreating`, `useFetchX` con `refetch`).
2. (30') En `parciales/practica-vespertino/`, hacé **solo** la página `/players`
   (lista con ganados/jugados + formulario para agregar + `refetch`). Es lo que tiene
   más concepto: estadísticas con `filter`, formulario controlado, crear con PUT y refrescar.

### Bloque 5 — Repaso rápido de lo viejo (25 min)

Solo leer, no programar:
- `parciales/2026sem1-prueba2-vespertino/APUNTES-PARCIAL.md` → último parcial real
  (Context + formulario crear/editar). Sirve si el examen trae un **formulario de edición**.
- [`ESTRATEGIA-EXAMEN.md`](ESTRATEGIA-EXAMEN.md) §4: **todas las trampas**, agrupadas por tema.

### Bloque 6 — Armar el kit del examen (20 min)

- [ ] Que la compu tenga todo **local** (el examen es sin internet): probar
      `npm install --prefer-offline` en una carpeta `practica-*` (plan B si falla:
      [ESTRATEGIA §1](ESTRATEGIA-EXAMEN.md#1-primeros-5-minutos-sin-internet)).
- [ ] Carpeta `P2/` completa en la compu (no en la nube).
- [ ] Tener abiertos/a mano: `CHULETA-EXAMEN.md`, `ESTRATEGIA-EXAMEN.md`, `…-matutino/APUNTES-PARCIAL.md`
      y el proyecto matutino resuelto en el editor (para copiar componentes enteros:
      `useFetchJSON.js`, `format.js`, `StatusMessage`, `FavoritesProvider`…).
- [ ] Saber hacer el fork, el clone y el **Pull Request** (git + GitHub): la entrega es por PR.
- [ ] Anotar al principio de la chuleta tus 3–5 "cosas que me trabaron" del Bloque 2.

---

## Estrategia durante el examen

→ En [ESTRATEGIA-EXAMEN.md](ESTRATEGIA-EXAMEN.md): primeros 10 minutos (§1), reglas y plan de
2 h (§2), checklist antes de entregar (§3).
