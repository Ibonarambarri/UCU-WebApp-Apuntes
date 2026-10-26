# Plan de ruta del examen (basado en el simulacro Higher / Lower)

> Guía paso a paso para las ~2 h. Supone que el examen usa **la misma plantilla 2026sem2** que el
> simulacro (workspace + `mobile/`, Expo Router, API en `app/api/*+api.js`, `fetchJSON`). Cada paso
> dice **qué hacer**, **de dónde copiar**, **cómo comprobar** y **cuánto tiempo darle**.
>
> Regla de oro: **se puede usar todo lo que hay en la compu** → no escribas desde cero lo que ya
> tenés resuelto. **Copiá y adaptá.**

La solución que vas a copiar (la llamamos `SOL`):
```bash
SOL="/Users/ibonarambarri/Documents/Uni/Curso 5/UCU/WebApp/P3/parciales/simulacro-prueba3-2026sem2-matutino"
```
Pegá esa línea en la terminal al empezar: todos los comandos de abajo la usan.

---

## Resumen en una tabla

| Fase | Min. | Qué | Asegura |
|---|---|---|---|
| 0 | 0–10 | Arrancar + curl a la API + **comparar con el simulacro** | decide todo lo demás |
| 1 | 10–20 | Copiar infraestructura (hooks, format, StatusMessage, CountryCard) + pantallas registradas | base de todo |
| 2 | 20–40 | Pantalla de **inicio** (formulario + POST + lista) | crear, navegar, lista, carga/error |
| 3 | 40–80 | Pantalla **principal** (GET por id + acciones + fases) | el grueso de los puntos |
| 4 | 80–90 | **Casos a contemplar** + lint + **commit y push** | casos borde, lint, entrega segura |
| 5 | 90–110 | Lo nuevo del examen / opcionales (recetario) | opcionales |
| 6 | 110–120 | Estilos mínimos, revisión final, **Pull Request** | entrega |

Si en algún paso te trabás **más de 10 minutos** → anotalo, pasá al siguiente y volvé al final.

---

## FASE 0 — Arrancar y detectar las diferencias (0–10 min)

### Paso 0.1 · Clonar, instalar y levantar (3 min)
```bash
git clone <url-de-TU-fork>
cd <carpeta-del-repo>
npm install --prefer-offline          # en la RAÍZ; usa la caché de npm
npm start                             # Metro :8081 → apretar w
```
Si `npm install` falla sin internet → `diff package.json "$SOL/package.json"` y
`diff mobile/package.json "$SOL/mobile/package.json"`; si son iguales:
`cp -R "$SOL/node_modules" .`

✅ **Comprobar:** http://localhost:8081 abre la app y `curl -s localhost:8081/api/<algo>` devuelve JSON.

### Paso 0.2 · ⭐ Comparar el examen con el simulacro (5 min) — EL PASO MÁS IMPORTANTE
```bash
diff "$SOL/README.md" README.md | head -80                     # ¿qué cambió en el ENUNCIADO?
ls mobile/app mobile/app/api                                    # pantallas y endpoints
diff -r "$SOL/mobile/data" mobile/data | grep -E "^Only in|^diff"   # ¿cambió la lógica de la API?
diff "$SOL/mobile/common/fetch.js" mobile/common/fetch.js       # ¿fetchJSON igual? (¿hace el JSON.stringify?)
grep -rn TODO mobile/app mobile/components                      # qué hay que completar
```
Y **probá cada endpoint** con curl (los mocks pueden tener bugs: en 2026sem1 uno daba 500):
```bash
curl -s localhost:8081/api/ranking | head -c 400
curl -s -X POST localhost:8081/api/games -H 'Content-Type: application/json' -d '{"player":"Yo"}'
```
Anotá en un papel:
- [ ] Pantallas/rutas pedidas (¿siguen siendo `/` y `/games/:id`? ¿hay `/end`, `/ranking`, `/results/:id`?)
- [ ] Qué muestra cada pantalla y qué acciones tiene (botones → endpoint → método → body)
- [ ] Forma de cada respuesta (¿qué trae la respuesta de la acción? ¿datos de la ronda vieja y de la nueva?)
- [ ] "Casos a contemplar" (cada uno es un punto fácil)
- [ ] Qué es opcional

### Paso 0.3 · Elegir escenario (1 min)

| Si el diff muestra… | Escenario | Qué hacer |
|---|---|---|
| Mismo juego con cambios chicos (una pantalla más, un dato más, vidas, temporizador) | **A — Casi igual** | Copiar `SOL/mobile/{app,hooks,common,components}` y adaptar con el recetario |
| Misma plantilla, otro juego/otros datos (otra API) | **B — Parecido** | Fases 1 → 6, copiando la infraestructura y la *forma* de las pantallas |
| Trivia con la lógica en el cliente (azar, vidas, puntaje en la app) | **C — Estilo 2025** | Igual que B, mirando además `parciales/2026sem1-simulacro-prueba3-vespertino/` y `parciales/2025sem2-*` |

---

## FASE 1 — Infraestructura (10–20 min)

### Escenario A (atajo)
```bash
cp -R "$SOL/mobile/hooks" mobile/
cp "$SOL/mobile/common/format.js" mobile/common/
cp "$SOL/mobile/components/StatusMessage.jsx" "$SOL/mobile/components/CountryCard.jsx" mobile/components/
cp "$SOL/mobile/app/index.jsx" mobile/app/
cp "$SOL/mobile/app/games/[id].jsx" mobile/app/games/
cd mobile && npx expo start -c        # ⚠️ Metro no ve archivos nuevos sin reiniciar
```
✅ La app del simulacro anda en la plantilla nueva. Ahora **adaptá solo las diferencias** del paso 0.2
(recetario: `parciales/simulacro-prueba3-2026sem2-matutino/APUNTES-PARCIAL.md` §7). Commit apenas ande lo básico.

### Escenario B / C (copiar solo lo genérico)
```bash
mkdir -p mobile/hooks
cp "$SOL/mobile/hooks/useFetchJSON.js" mobile/hooks/
cp "$SOL/mobile/hooks/useCreateGame.js" mobile/hooks/useCreateX.js      # renombrar adentro (createX, URL, body)
cp "$SOL/mobile/common/format.js" mobile/common/
cp "$SOL/mobile/components/StatusMessage.jsx" mobile/components/
```
Y un hook de **1 línea** por endpoint GET ([tema 11](clase/11-hooks-de-datos.md)):
```js
// mobile/hooks/useFetchX.js
import { useFetchJSON } from './useFetchJSON';
export function useFetchX(id) { return useFetchJSON(`/api/x/${id}`); }
```
Si la plantilla **ya trae hooks** (`hooks/api.js` en 2025), usalos o reemplazalos por `useFetchJSON` si les falta algo (error, refetch, `expoDevServerUri`).

Registrá **todas** las pantallas del enunciado en `mobile/app/_layout.jsx` con su título
([tema 7](clase/07-expo-router-archivos-y-layouts.md)) y creá los archivos vacíos (`export default function X() { return <Text>X</Text>; }`).
Si el enunciado pide una ruta distinta a la de la plantilla, **creá la del enunciado**.

✅ **Comprobar:** se puede navegar a todas las URLs del enunciado escribiéndolas en el navegador.
`npm run lint` limpio. Reiniciaste Metro con `-c` si creaste archivos.

---

## FASE 2 — Pantalla de inicio (20–40 min)

Base: `SOL/mobile/app/index.jsx`.

| Paso | Qué | Dónde está explicado |
|---|---|---|
| 2.1 | `TextInput` controlado (`value` + `onChangeText`) | [tema 6](clase/06-formularios-textinput.md) |
| 2.2 | Botón deshabilitado como **estado derivado**: `const canPlay = name.trim() !== '' && !isCreating` | [tema 6](clase/06-formularios-textinput.md) |
| 2.3 | `handlePlay`: `await createX(...)` → si volvió algo, `router.push(`/x/${nuevo.id}`)`; error en pantalla | [tema 8](clase/08-navegar-y-parametros.md), [11](clase/11-hooks-de-datos.md) |
| 2.4 | Lista con `useFetchX()` + 4 estados (error+Reintentar / cargando / vacío / `FlatList`) | [tema 5](clase/05-listas-flatlist.md), [11](clase/11-hooks-de-datos.md) |
| 2.5 | `useFocusEffect(useCallback(() => { refetch(); }, [refetch]))` → lista actualizada al volver | [tema 9](clase/09-ciclo-de-vida-pantallas.md) |

✅ **Comprobar:**
- Nombre vacío o solo espacios → botón deshabilitado.
- Crear → navega a la pantalla nueva con el id correcto en la URL.
- Lista con datos; con la API caída (Ctrl+C) → mensaje de error + Reintentar.
- Ir y volver → la lista se actualiza.

💾 `git add -A && git commit -m "Inicio" && git push`

---

## FASE 3 — Pantalla principal `/x/:id` (40–80 min)

Base: `SOL/mobile/app/games/[id].jsx` (la lectura guiada está en [tema 18](clase/18-lectura-guiada-parcial.md)).

| Paso | Qué | Dónde está explicado |
|---|---|---|
| 3.1 | `const { id } = useLocalSearchParams();` (string) + `<Stack.Screen options={{ title }} />` | [tema 8](clase/08-navegar-y-parametros.md), [7](clase/07-expo-router-archivos-y-layouts.md) |
| 3.2 | **Todos los hooks arriba**: `useFetchX(id)`, `useState` de la acción (`result`, `isSending`, `sendError`) | [tema 11](clase/11-hooks-de-datos.md), [17](clase/17-lint-y-react-compiler.md) |
| 3.3 | `if (error)` → 404 con `error.status === 404` ("no existe") / otro → Reintentar; `if (!data)` → cargando | [tema 10](clase/10-api-fetchjson-y-api-routes.md) |
| 3.4 | Mostrar los datos (tarjetas con `Image` + `expoDevServerUri` + tamaño) | [tema 3](clase/03-componentes-core.md), [4](clase/04-estilos-stylesheet-flexbox.md) |
| 3.5 | Acción: `handleX` con `try/catch/finally`, botones `disabled={isSending}` | [tema 12](clase/12-logica-de-juego-y-estado.md) |
| 3.6 | **Fases** con variables derivadas (jugando / resultado / terminado) — leer bien qué dato es de la ronda respondida y cuál de la siguiente | [tema 12](clase/12-logica-de-juego-y-estado.md) |
| 3.7 | "Siguiente": `setData(result.game); setResult(null)` (usar la respuesta, no re-pedir) | [tema 11](clase/11-hooks-de-datos.md) |
| 3.8 | Fin: puntaje final + "Jugar de nuevo" (`createX` + `router.replace`) + "Volver" (`router.dismissTo('/')`) | [tema 8](clase/08-navegar-y-parametros.md), [9](clase/09-ciclo-de-vida-pantallas.md) |
| 3.9 | Entrar a algo ya terminado → mostrar el resultado directamente, sin botones de acción | [tema 12](clase/12-logica-de-juego-y-estado.md) |

✅ **Comprobar (cada una):**
- Crear y jugar una ronda → resultado correcto; "Siguiente" → ronda nueva.
- **F5 a mitad de partida** → sigue en la misma ronda.
- El resultado se muestra con el tipo de pregunta **de esa ronda** aunque la siguiente sea otro.
- Perder → fin + puntaje final; "Jugar de nuevo" → partida nueva **sin** el resultado viejo.
- "Volver al inicio" después de un F5 → funciona (no depende del historial).
- Entrar a una partida terminada (en el simulacro: `/games/1`) → muestra el resultado.
- `/games/9999` → "no existe".

💾 `git add -A && git commit -m "Pantalla principal" && git push`

---

## FASE 4 — Casos, lint y entrega segura (80–90 min)

1. Releer los **casos a contemplar** del README y probarlos uno por uno (formato de números con
   `formatNumber`/`formatStat`, decimales con coma, carga y error de **cada** pedido).
2. Lint:
```bash
npm run lint                     # desde la raíz
cd mobile && npx eslint . && cd ..   # expo lint NO mira hooks/ ni common/
```
Arreglar con la tabla de [tema 17](clase/17-lint-y-react-compiler.md) (lo típico: `;`, imports sin usar,
`set-state-in-effect`, dependencias, hooks después de un `return`).

💾 `git add -A && git commit -m "Lint limpio y casos" && git push` → **lo obligatorio ya está entregado.**

---

## FASE 5 — Lo nuevo del examen / opcionales (90–110 min)

Buscar en el **recetario** (`parciales/simulacro-prueba3-2026sem2-matutino/APUNTES-PARCIAL.md` §7):

| Si piden… | Variante |
|---|---|
| Títulos/estilo del header, sacar la flecha | V1 |
| Fechas en el ranking, medallas | V2 |
| Tocar un ítem de la lista → ver su detalle | V3 |
| Deslizar para refrescar | V4 |
| Ranking en otra pantalla o con pestañas (Tabs) | V5 |
| Recordar el nombre / datos en el celular | V6 (AsyncStorage) |
| Mejor puntaje personal | V7 |
| Validaciones del nombre (largo, caracteres) | V8 |
| Mostrar ambos valores, colores verde/rojo | V9 |
| Historial de rondas | V10 |
| Vidas / dificultad | V11 |
| Tiempo por ronda | V12 |
| Pantalla de resultado aparte (`/end`, `/results/:id`) | V13 |
| Borrar (DELETE) con confirmación | V14 |
| Confirmar antes de salir | V15 |
| Tema oscuro / Context | V16 |
| Algo distinto en web vs celular, vibración | V17 |

Si es un juego con la lógica **en el cliente** (azar, vidas): mirar
`parciales/2026sem1-simulacro-prueba3-vespertino/` y `parciales/2025sem2-*/app/game.jsx`.

💾 Commit + push después de **cada** opcional que funcione.

---

## FASE 6 — Estilos y cierre (110–120 min)

1. Acercarse al boceto con `StyleSheet` (filas, tarjetas, colores). **No más de 10 min.**
2. Lint otra vez (los dos comandos).
3. Última pasada por las comprobaciones ✅ de las Fases 2 y 3.
4. 💾 `git add -A && git commit -m "Estilos y ajustes finales" && git push`
5. **Pull Request** en tu fork antes de la hora. Abrirlo y verificar que muestra los commits.

---

## Si algo sale mal

| Síntoma | Ir a |
|---|---|
| `Unable to resolve "…"` con el archivo creado | `cd mobile && npx expo start -c` ([tema 1](clase/01-anatomia-proyecto-expo.md)) |
| `Text strings must be rendered within a <Text>` | texto suelto / `{0 && …}` ([tema 2](clase/02-react-que-sigue-igual.md)) |
| La imagen no aparece | `width`/`height` + `expoDevServerUri` ([tema 3](clase/03-componentes-core.md)) |
| "Cargando…" eterno | `finally { setX(false) }`; probar el endpoint con curl ([tema 11](clase/11-hooks-de-datos.md)) |
| POST da 400 | body como objeto con `fetchJSON` (o `JSON.stringify` si el `fetchJSON` de la plantilla no lo hace) ([tema 10](clase/10-api-fetchjson-y-api-routes.md)) |
| La lista no se actualiza al volver | `useFocusEffect` ([tema 9](clase/09-ciclo-de-vida-pantallas.md)) |
| "Jugar de nuevo" muestra lo anterior | derivar por id / `router.replace` ([tema 9](clase/09-ciclo-de-vida-pantallas.md), [12](clase/12-logica-de-juego-y-estado.md)) |
| `Cannot read properties of null` | `?.` (también dentro de handlers: React Compiler) ([tema 17](clase/17-lint-y-react-compiler.md)) |
| `Avoid calling setState() directly within an effect` | estado derivado o setState dentro del `async` ([tema 17](clase/17-lint-y-react-compiler.md)) |
| `router.back()` no hace nada | `router.dismissTo('/')` ([tema 8](clase/08-navegar-y-parametros.md)) |
| Todas las trampas | [ESTRATEGIA-EXAMEN.md §4](ESTRATEGIA-EXAMEN.md) |

**Material para tener abierto:** este plan · [CHULETA-EXAMEN.md](CHULETA-EXAMEN.md) · el `SOL` en el editor ·
el visor (`cd P3/visor-apuntes && npm start` → http://localhost:5191) · [docs offline](docs-offline/INDICE.md).
