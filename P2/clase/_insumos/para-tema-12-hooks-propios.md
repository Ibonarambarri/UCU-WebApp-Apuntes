# Insumo para tema 12 — Cargando / error / datos y hooks propios

> Material destilado de los apuntes viejos (apuntes/_archivo/01-REACT-BASICO.md §11, 02-HOOKS-USEEFFECT.md §4 y 13) y de los simulacros 2026sem2 para integrar al escribir el tema. No duplica CHULETA-EXAMEN.md ni los temas 01-11.

Ya cubierto en otro lado (no repetir, linkear):
- Hook genérico `useFetchJSON` y hook de crear `useCreateThing` → [CHULETA §3](../../CHULETA-EXAMEN.md).
- Página con los 4 estados (variable `content`) → [CHULETA §4](../../CHULETA-EXAMEN.md) y [tema 5 §5.3](../05-listas-y-condicionales.md).
- `try/catch/finally`, `ignore` para respuestas viejas → [tema 11 §11.4](../11-api-fetch.md), [tema 10 §10.6](../10-useeffect.md).

---

## 1. Los tres estados que siempre acompañan a un pedido

| Estado | Inicial | Para qué |
|---|---|---|
| `data` / `countries` | `null` (o `[]`) | los datos; `null` = "todavía no llegaron" |
| `isLoading` / `estaCargando` | ver §2 | mostrar "Cargando…", `disabled={isLoading}` en botones |
| `error` / `mensajeError` | `null` (o `''`) | mostrar el error + botón "Reintentar" |

Otros estados de UI que salieron (no son de fetch, pero siguen la misma idea "un estado alimenta varias cosas"):
- `idEditando = null` → qué fila está en modo edición (TA08).
- `respuestaElegida = null` → trivia 2025: con un solo estado se deshabilitan los botones, se muestra bien/mal, el mapa pasa a ser `Link` y aparece "Otro desafío" (todo derivado, tema 9).

## 2. ¿`isLoading` arranca en `true` o en `false`?

- Carga **al montar** → `useState(true)`. Si no, en el primer render se ve "No hay resultados" un instante.
- Carga **por una acción** (submit, clic) → `useState(false)` y `setIsLoading(true)` dentro del handler.
- Efecto que **se repite** (cambia `:code`, un filtro, `reloadIndex`) → al principio de la función async:
  `setIsLoading(true); setError(null);` para limpiar lo del pedido anterior.

⚠️ **"Cargando…" eterno**: falta el `finally { setIsLoading(false); }` (o el `catch` no lo apaga). Diagnóstico:
pestaña **Network** → si el pedido está en rojo es puerto/red; si es 404, la URL de la API está mal.

## 3. Hooks propios: sacar el fetch del componente

Un **hook propio** es una función que empieza con `use` y adentro usa otros hooks. Los docentes lo
usan en la plantilla del tatetí (`web/src/hooks/`) — es "el estilo oficial":

```
useFetchX()   → { data, isLoading, error, refetch }   (GET)
useCreateX()  → { isCreating, createX }               (PUT; createX es async y TIRA si falla)
```

- `refetch` = `setReloadIndex((i) => i + 1)`; `reloadIndex` está en las dependencias del efecto → vuelve a pedir.
- Con un hook genérico `useFetchJSON(url)`, **un endpoint nuevo = 1 línea**:
  ```js
  export function useFetchRegions() { return useFetchJSON('/api/regions'); }
  ```
- El hook devuelve un objeto → en el componente se renombra: `const { data: players, refetch } = useFetchPlayers();`
- Reglas de los hooks (tema 7 §7.6) valen igual: los hooks propios se llaman arriba de todo, nunca en un `if`.

Ver: `parciales/simulacro-prueba2-2026sem2-vespertino/web/src/hooks/useFetchPlayers.js`,
`.../hooks/useCreatePlayer.js`, `parciales/simulacro-prueba2-2026sem2-matutino/web/src/hooks/useFetchJSON.js`,
`.../hooks/useFetchRegions.js`.

## 4. `!data` vs `isLoading`: que no parpadee en un refetch

```jsx
let list;
if (error) list = <p>Error: {error.message}</p>;
else if (!data) list = <p>Loading…</p>;      // solo la PRIMERA vez
else list = <ul>{…}</ul>;                    // en un refetch se sigue viendo la lista vieja
```
Si se pregunta `isLoading`, cada `refetch()` (después de agregar un jugador) borra la lista y muestra
"Loading…" un instante. Ver `parciales/simulacro-prueba2-2026sem2-vespertino/web/src/pages/PagePlayers/PagePlayers.jsx`.

## 5. Distinguir 404 de "se cayó"

```jsx
if (error?.message.includes(' 404 ')) content = <p>País no encontrado</p>;
else if (error) content = <StatusMessage type="error" text="No se pudo cargar">…Reintentar…</StatusMessage>;
```
Reintentar solo tiene sentido si **no** es 404. Ver `parciales/simulacro-prueba2-2026sem2-matutino/web/src/components/PageCountry/PageCountry.jsx` y `.../StatusMessage/StatusMessage.jsx` (caja genérica con `children`).

(El resumen visual del ciclo de vida de una página con datos se integra en el [tema 10](../10-useeffect.md); acá solo linkearlo.)
