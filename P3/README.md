# P3 — Preparación Parcial 3 (DWYM, FIT-UCU)

Tercer parcial: **React Native + Expo (SDK 58) + Expo Router** (app móvil, que también corre en web).
Todo el código está escrito "estilo principiante" y comentado en español. **Este archivo es el único
punto de entrada**: qué hay, en qué orden estudiarlo, cómo correr cada cosa y dónde ver cada concepto.

Lo de React que **no cambia** (useState, useEffect, props, Context, hooks propios) sigue en
[`../P2/`](../P2/README.md): acá solo se repasa y se enlaza.

## ⭐ Para el examen (formato 2026sem2), empezar por acá

0. **[`PLAN-DE-RUTA-EXAMEN.md`](PLAN-DE-RUTA-EXAMEN.md)** — **el paso a paso DURANTE el examen** (basado en el simulacro): fases con tiempos, qué copiar de la solución, cómo comprobar cada paso.
1. **[`GUIA-ESTUDIO-TARDE.md`](GUIA-ESTUDIO-TARDE.md)** — el plan de estudio para la tarde anterior.
2. **[`CHULETA-EXAMEN.md`](CHULETA-EXAMEN.md)** — fragmentos para tener abiertos en el examen (HTML → RN, Expo Router, `fetchJSON`, FlatList, lint).
3. **[`ESTRATEGIA-EXAMEN.md`](ESTRATEGIA-EXAMEN.md)** — primeros 5 minutos, plan de 2 h, checklist antes de entregar y **todas las trampas**.
4. **[`parciales/simulacro-prueba3-2026sem2-matutino/APUNTES-PARCIAL.md`](parciales/simulacro-prueba3-2026sem2-matutino/APUNTES-PARCIAL.md)** — el simulacro Higher / Lower resuelto + **recetario de 17 variantes** probadas. El documento más importante.
5. **[`clase/`](clase/00-INDICE-CLASE.md)** — la teoría, un tema por archivo (01…18), de fácil a difícil.
6. **[`docs-offline/INDICE.md`](docs-offline/INDICE.md)** — documentación oficial (React Native, Expo SDK 58 + Expo Router, AsyncStorage) descargada, para consultar sin internet.

---

## Qué hay y dónde

| Archivo / carpeta | Qué es |
|---|---|
| [`PLAN-DE-RUTA-EXAMEN.md`](PLAN-DE-RUTA-EXAMEN.md) | Paso a paso del examen, con `SOL` = la solución del simulacro para copiar. |
| [`CHULETA-EXAMEN.md`](CHULETA-EXAMEN.md) | Fragmentos listos para copiar. |
| [`ESTRATEGIA-EXAMEN.md`](ESTRATEGIA-EXAMEN.md) | Formatos de cada año, primeros minutos, plan de 2 h, checklist, trampas por tema. |
| [`GUIA-ESTUDIO-TARDE.md`](GUIA-ESTUDIO-TARDE.md) | Plan de la tarde (~5 h): entender, rehacer con reloj, variantes, kit del examen. |
| [`clase/`](clase/00-INDICE-CLASE.md) | **La teoría.** 18 temas, cada uno con "📂 Verlo funcionando" y una pregunta de repaso. |
| [`parciales/simulacro-prueba3-2026sem2-matutino/`](parciales/simulacro-prueba3-2026sem2-matutino/APUNTES-PARCIAL.md) | **Simulacro 2026sem2 (EL MÁS IMPORTANTE)** — Higher / Lower de países: inicio con ranking, partida con la lógica en la API. Resuelto, lint limpio, probado en web, recetario V1–V17. Remoto `origin` = tu fork, `upstream` = el repo del curso. |
| `parciales/practica-matutino/` | **Plantilla limpia** del simulacro (sin resolver, ya con `npm install`) para practicar desde cero. |
| [`parciales/2026sem1-prueba3-vespertino/`](parciales/2026sem1-prueba3-vespertino/APUNTES-PARCIAL.md) | Prueba real 2026sem1 — Figuritas del Mundial: grupos → equipo → marcar figuritas (PATCH). ⚠️ El mock traía un bug (`/api/groups/H` → 500). |
| [`parciales/2026sem1-simulacro-prueba3-vespertino/`](parciales/2026sem1-simulacro-prueba3-vespertino/APUNTES-PARCIAL.md) | Simulacro 2026sem1 — Trivia de capitales con dificultad, `/game` y `/end`. |
| [`parciales/2025sem2-parcial3-matutino/`](parciales/2025sem2-parcial3-matutino/APUNTES-PARCIAL.md) | Parcial real 2025 — ¿mapa y bandera son del mismo país? Vidas según nivel, vista de fin. |
| [`parciales/2025sem2-parcial3-vespertino/`](parciales/2025sem2-parcial3-vespertino/APUNTES-PARCIAL.md) | Parcial real 2025 — ¿se habla este idioma? 3 vidas, meta según nivel, ganaste/perdiste. |
| [`parciales/2025sem2-simulacro-matutino/`](parciales/2025sem2-simulacro-matutino/APUNTES-PARCIAL.md) | Simulacro 2025 — mapa + 4 banderas, puntaje = aciertos − errores. |
| [`parciales/2025sem2-simulacro-vespertino/`](parciales/2025sem2-simulacro-vespertino/APUNTES-PARCIAL.md) | Simulacro 2025 — 9 banderas, elegir un limítrofe o "Ninguno". |
| [`parciales/2025sem1-parcial-rn/`](parciales/2025sem1-parcial-rn/APUNTES-PARCIAL.md) | Formato viejo (Expo 53 + json-server) — Task List: lista, detalle, crear, cambiar estado. Útil si piden **formularios crear/editar**. |
| [`parciales/2025sem1-simulacro-rn/`](parciales/2025sem1-simulacro-rn/APUNTES-PARCIAL.md) | Formato viejo — Backoffice Food App: comidas con stock y detalle de órdenes. |
| `docs-offline/` | Docs oficiales offline. Índice: [`docs-offline/INDICE.md`](docs-offline/INDICE.md). Las copias no entran al repo (`.gitignore`). |
| `visor-apuntes/` | Visor y buscador local (palabras clave + semántico) de todo este material + docs offline + la teoría de React del P2. |

Los parciales anteriores vienen de `github.com/ucu-fit-dwym/historial-pruebas` (clonado en
`../P1/historial-pruebas`); el simulacro 2026sem2, de tu fork
`github.com/Ibonarambarri/simulacro-prueba3-2026sem2-matutino`. En cada carpeta el `README.md`
es el **enunciado oficial** sin tocar. Los repechajes (2025sem2, 2026sem1) son de React web y no
entran acá.

---

## Orden de estudio

Seguir [`GUIA-ESTUDIO-TARDE.md`](GUIA-ESTUDIO-TARDE.md). En resumen:

1. Usar la app del simulacro resuelta y leer su código con los `APUNTES-PARCIAL.md` al lado.
2. Temas 1–9 de [`clase/`](clase/00-INDICE-CLASE.md) (lo que cambia de web a RN y Expo Router).
3. Rehacer el simulacro en `parciales/practica-matutino/` con reloj, mirando solo la chuleta y `clase/`.
4. Practicar 3 variantes del recetario (§7 de los apuntes del simulacro).
5. Un parcial con la lógica en el cliente (`2026sem1-simulacro-prueba3-vespertino` o uno de `2025sem2-*`).
6. Repasar [`ESTRATEGIA-EXAMEN.md`](ESTRATEGIA-EXAMEN.md) §4 (trampas) y armar el kit del examen.

---

## Cómo correr cada cosa

| Tipo de proyecto | Comandos (desde `P3/`) | Puertos / URLs | Notas |
|---|---|---|---|
| **2026sem2** (simulacro y `practica-matutino`) | `cd parciales/simulacro-prueba3-2026sem2-matutino && npm install && npm start` → `w` | App y API en **8081** (`/api/...`) | `npm install` en la **raíz** (workspace). Lint: `npm run lint` y además `cd mobile && npx eslint .` (`expo lint` no revisa `hooks/` ni `common/`). La API escribe en `mobile/data/db/data.json` (volver al seed: `git checkout mobile/data/db/data.json`). |
| **2026sem1** (2) y **2025sem2** (4) | `cd parciales/<carpeta> && npm install && npm start` → `w` | **8081** | Sin workspace: el proyecto Expo está en la raíz de la carpeta. |
| **2025sem1** (formato viejo) | ver el `APUNTES-PARCIAL.md` de cada uno (json-server en una terminal + Expo en otra) | API json-server + Expo **8081** | La URL de la API va en `mobile/.env`; desde el celular, la **IP** de la compu. |
| **Visor de apuntes** | `cd visor-apuntes && npm start` | **5191** (el del P2 usa 5190) | Si cambiaron los `.md`: `npm run build-index` (segundos si ya hay caché). |
| **Docs offline** | abrir [`docs-offline/INDICE.md`](docs-offline/INDICE.md) (o buscar en el visor) | — | — |

- **Celular:** instalar **Expo Go**, misma red Wi-Fi que la compu, escanear el QR de `npm start`.
- **Metro no encuentra un archivo que acabás de crear** (`Unable to resolve`): `npx expo start -c`.
- Node usado: v26 (el curso pide v24 en `.tool-versions`; funciona igual).

---

## Concepto → tema de clase → dónde verlo funcionando

Rutas de código relativas a `P3/parciales/`. `SOL` = `simulacro-prueba3-2026sem2-matutino/mobile`.

| Concepto | Tema | Verlo en código |
|---|---|---|
| Estructura de la plantilla, alias `@/`, Metro | [1](clase/01-anatomia-proyecto-expo.md) | `SOL/app/_layout.jsx`, `SOL/babel.config.js` |
| Qué de React sigue igual / qué cambia | [2](clase/02-react-que-sigue-igual.md) | `SOL/app/index.jsx` |
| `View`, `Text`, `Image` + `expoDevServerUri`, `TextInput`, botones | [3](clase/03-componentes-core.md) | `SOL/components/CountryCard.jsx`, `SOL/components/Button.jsx` |
| `ActivityIndicator` + mensaje de error con Reintentar | [3](clase/03-componentes-core.md), [11](clase/11-hooks-de-datos.md) | `SOL/components/StatusMessage.jsx` |
| `StyleSheet`, filas, arrays de estilos | [4](clase/04-estilos-stylesheet-flexbox.md) | `SOL/common/styles.js`, `SOL/components/CountryCard.jsx` |
| Grilla con `flexWrap` / colores verde-rojo-gris por estado | [4](clase/04-estilos-stylesheet-flexbox.md) | `2025sem2-simulacro-vespertino/app/game.jsx` |
| `FlatList` con `keyExtractor` + `renderItem({ item, index })` | [5](clase/05-listas-flatlist.md) | `SOL/app/index.jsx` (ranking) |
| `TextInput` controlado + botón deshabilitado derivado | [6](clase/06-formularios-textinput.md) | `SOL/app/index.jsx` |
| Formulario crear/editar compartido | [6](clase/06-formularios-textinput.md) | `2025sem1-parcial-rn/mobile/components/TaskForm.jsx` |
| Pantallas por archivo, `Stack`, `Stack.Screen` con título dinámico | [7](clase/07-expo-router-archivos-y-layouts.md) | `SOL/app/_layout.jsx`, `SOL/app/games/[id].jsx` |
| Rutas `/game` y `/end` en vez de la de la plantilla | [7](clase/07-expo-router-archivos-y-layouts.md) | `2026sem1-simulacro-prueba3-vespertino/app/end.jsx` |
| `useLocalSearchParams`, `router.push/replace/dismissTo` | [8](clase/08-navegar-y-parametros.md) | `SOL/app/games/[id].jsx` |
| Pasar datos por params (`router.push({ pathname, params })`) | [8](clase/08-navegar-y-parametros.md) | `2025sem2-parcial3-matutino/app/index.jsx` → `app/game.jsx` |
| `<Link asChild>` de lista a detalle | [8](clase/08-navegar-y-parametros.md) | `2026sem1-prueba3-vespertino/app/index.jsx` |
| `useFocusEffect` (refrescar al volver) | [9](clase/09-ciclo-de-vida-pantallas.md) | `SOL/app/index.jsx` |
| Misma pantalla con otro id: estado derivado por id | [9](clase/09-ciclo-de-vida-pantallas.md), [12](clase/12-logica-de-juego-y-estado.md) | `SOL/app/games/[id].jsx` |
| API routes `+api.js`, `mock-db`, códigos 400/404/409 | [10](clase/10-api-fetchjson-y-api-routes.md) | `SOL/app/api/`, `SOL/data/games.js` |
| `fetchJSON` (body objeto, `error.status`) | [10](clase/10-api-fetchjson-y-api-routes.md) | `SOL/common/fetch.js` |
| PATCH con la lista completa y `setData` con la respuesta | [10](clase/10-api-fetchjson-y-api-routes.md), [11](clase/11-hooks-de-datos.md) | `2026sem1-prueba3-vespertino/app/teams/[code].jsx` |
| Hook genérico `{ data, setData, isLoading, error, refetch }` | [11](clase/11-hooks-de-datos.md) | `SOL/hooks/useFetchJSON.js` |
| Hook de acción `useCreateX` (`isCreating`, devuelve o null) | [11](clase/11-hooks-de-datos.md) | `SOL/hooks/useCreateGame.js` |
| Fases de una partida (jugando / resultado / terminada), `result.stat` vs `game.stat` | [12](clase/12-logica-de-juego-y-estado.md) | `SOL/app/games/[id].jsx` |
| Ronda de trivia: pedidos encadenados + `Promise.all` + azar fuera del render | [12](clase/12-logica-de-juego-y-estado.md) | `2026sem1-simulacro-prueba3-vespertino/hooks/useTriviaRound.js` |
| Vidas / dificultad / puntaje en el cliente | [12](clase/12-logica-de-juego-y-estado.md) | `2025sem2-parcial3-matutino/app/game.jsx` |
| Separador de miles y decimales a mano | [13](clase/13-formatear-datos.md) | `SOL/common/format.js` |
| Fechas legibles | [13](clase/13-formatear-datos.md) | `2025sem1-simulacro-rn/mobile/lib/format.js` |
| Context con el Provider en `_layout` | [14](clase/14-context-en-rn.md) | recetario V16 (apuntes del simulacro) |
| AsyncStorage (recordar el nombre, mejor puntaje) | [15](clase/15-asyncstorage.md) | recetario V6 y V7 (apuntes del simulacro) |
| `Platform.OS`, `Alert` (no anda en web), `Modal`, vibración | [16](clase/16-plataforma-y-extras.md) | recetario V14, V15, V17 |
| `expo lint`, React Compiler, `set-state-in-effect` | [17](clase/17-lint-y-react-compiler.md) | `SOL/eslint.config.js` |
| Un parcial completo leído de punta a punta | [18](clase/18-lectura-guiada-parcial.md) | `simulacro-prueba3-2026sem2-matutino/` |
