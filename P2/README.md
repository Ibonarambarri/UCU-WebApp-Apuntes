# P2 — Preparación Parcial 2 (DWYM, FIT-UCU)

Segundo parcial: **React 19 + React Router v6 + Context** (UT4 + UT5). Todo el código está
escrito "estilo principiante" y comentado en español. **Este archivo es el único punto de
entrada**: qué hay, en qué orden estudiarlo, cómo correr cada cosa y dónde ver cada concepto.

## ⭐ Para el examen (formato 2026sem2), empezar por acá

0. **[`PLAN-DE-RUTA-EXAMEN.md`](PLAN-DE-RUTA-EXAMEN.md)** — **el paso a paso DURANTE el examen** (basado en el matutino): fases con tiempos, qué copiar de la solución, cómo comprobar cada paso.
1. **[`GUIA-ESTUDIO-TARDE.md`](GUIA-ESTUDIO-TARDE.md)** — el plan de estudio paso a paso para la tarde anterior.
2. **[`CHULETA-EXAMEN.md`](CHULETA-EXAMEN.md)** — la hoja de fragmentos para tener abierta en el examen.
3. **[`ESTRATEGIA-EXAMEN.md`](ESTRATEGIA-EXAMEN.md)** — primeros 5 minutos, plan de 2 h, checklist antes de entregar y **todas las trampas**.
4. **[`parciales/simulacro-prueba2-2026sem2-matutino/APUNTES-PARCIAL.md`](parciales/simulacro-prueba2-2026sem2-matutino/APUNTES-PARCIAL.md)** — el simulacro de países resuelto + **recetario de variantes**. El documento más importante.
5. **[`clase/`](clase/00-INDICE-CLASE.md)** — la teoría, un tema por archivo (01…19), de fácil a difícil.
6. **[`docs-offline/INDICE.md`](docs-offline/INDICE.md)** — documentación oficial (React, React Router v6, MDN) descargada, para consultar sin internet.

---

## Qué hay y dónde

| Archivo / carpeta | Qué es |
|---|---|
| [`CHULETA-EXAMEN.md`](CHULETA-EXAMEN.md) | Fragmentos listos para copiar: router, query params, `fetchJSON`, hooks, formularios, Context, CSS, lint. |
| [`ESTRATEGIA-EXAMEN.md`](ESTRATEGIA-EXAMEN.md) | Primeros 5 minutos, plan de ataque por formato, checklist de entrega, trampas agrupadas por tema. |
| [`GUIA-ESTUDIO-TARDE.md`](GUIA-ESTUDIO-TARDE.md) | Plan de la tarde (~5 h): entender, rehacer con reloj, variantes, kit del examen. |
| [`clase/`](clase/00-INDICE-CLASE.md) | **La teoría.** Un `.md` por tema, cada uno con "📂 Verlo funcionando" y una pregunta de repaso. |
| [`parciales/simulacro-prueba2-2026sem2-matutino/`](parciales/simulacro-prueba2-2026sem2-matutino/APUNTES-PARCIAL.md) | **Simulacro 2026sem2 (EL MÁS IMPORTANTE)** — Country Explorer: listado + detalle, query params, favoritos. Resuelto (+ filtro por región como extra), lint limpio, recetario de 16 variantes. |
| [`parciales/simulacro-prueba2-2026sem2-vespertino/`](parciales/simulacro-prueba2-2026sem2-vespertino/APUNTES-PARCIAL.md) | Simulacro 2026sem2 — Tatetí: inicio, jugar, jugadores con estadísticas. Misma plantilla + hooks de los docentes (el "estilo oficial"). Resuelto + variantes. |
| `parciales/practica-matutino/`, `parciales/practica-vespertino/` | **Plantillas limpias** (sin resolver, ya con `npm install`) para practicar desde cero. |
| [`parciales/2026sem1-prueba2-vespertino/`](parciales/2026sem1-prueba2-vespertino/APUNTES-PARCIAL.md) | Prueba real 2026sem1 — Tablero tipo Trello. 6 ejercicios sobre plantilla con TODOs, json-server, CSS Modules, Context, Router. |
| [`parciales/2026sem1-simulacro-vespertino/`](parciales/2026sem1-simulacro-vespertino/APUNTES-PARCIAL.md) | Simulacro 2026sem1 — BarApp (cuentas de un bar). 6 puntos, json-server, Context, Router. |
| [`parciales/2025sem2-parcial2-matutino/`](parciales/2025sem2-parcial2-matutino/APUNTES-PARCIAL.md) | Parcial real 2025 — buscador de países con 3 filtros `<select>`. App desde casi cero, mock API en Vite. |
| [`parciales/2025sem2-parcial2-vespertino/`](parciales/2025sem2-parcial2-vespertino/APUNTES-PARCIAL.md) | Parcial real 2025 — países con 9 rutas (por moneda/idioma/zona horaria); evalúa reutilizar componentes. |
| [`parciales/2025sem2-simulacro-matutino/`](parciales/2025sem2-simulacro-matutino/APUNTES-PARCIAL.md) | Simulacro 2025 — trivia: adivinar la bandera por el mapa. Azar, puntaje en Context. |
| [`parciales/2025sem2-simulacro-vespertino/`](parciales/2025sem2-simulacro-vespertino/APUNTES-PARCIAL.md) | Simulacro 2025 — viaje por países fronterizos. Juego con estado global, dificultad, `/end`. |
| `Ejers/` | Ejercicios de clase resueltos, uno por carpeta (`UT4/TA01…TA18`, `UT5/UT5.1.1`, `UT5.1.2`). Los enunciados originales (`TA_UT4.docx`, `Ejer_UT5_*.png`) siguen ahí. |
| `docs-offline/` | Documentación oficial offline. Índice: [`docs-offline/INDICE.md`](docs-offline/INDICE.md). |
| `visor-apuntes/` | Visor y buscador local de todo este material + docs offline (ver "Cómo correr"). |
| `apuntes/_archivo/` | Los "súper apuntes" viejos por temática (00…09). **Archivados**: su contenido ya vive en `clase/` y en `ESTRATEGIA-EXAMEN.md`. |

Los parciales vienen de `github.com/ucu-fit-dwym/historial-pruebas` (clonado en
`../P1/historial-pruebas`); en cada carpeta el `README.md` es el **enunciado oficial** sin
tocar. **Descartado a propósito:** `2025sem1/parcial2` (real y simulacro) son de React Native +
Expo (app móvil), fuera de UT4-UT5.

---

## Orden de estudio

**Para mañana (2026sem2):** seguir [`GUIA-ESTUDIO-TARDE.md`](GUIA-ESTUDIO-TARDE.md). En resumen:

1. Usar la app del simulacro matutino resuelta y leer su código con los `APUNTES-PARCIAL.md` al lado.
2. Rehacerlo en `parciales/practica-matutino/` con reloj, mirando solo la chuleta y `clase/`.
3. Practicar 3 variantes del recetario (§4 de los apuntes del matutino).
4. Tatetí: la página `/players` en `parciales/practica-vespertino/`.
5. Repasar [`ESTRATEGIA-EXAMEN.md`](ESTRATEGIA-EXAMEN.md) (trampas) y armar el kit del examen.

**Si algo de teoría no se entiende:** el tema correspondiente de [`clase/`](clase/00-INDICE-CLASE.md)
(la tabla de abajo dice cuál) y después el código de "📂 Verlo funcionando".

**Si sobra tiempo, parciales viejos** (otro formato: json-server / `fetch` a pelo), en este orden:
`2026sem1-prueba2-vespertino` (formulario crear/editar + Context) → `2026sem1-simulacro-vespertino` →
`2025sem2-parcial2-matutino` y `-vespertino` (router + fetch desde cero) → los dos simulacros
2025sem2 (lógica de juego, azar, estado global).

---

## Cómo correr cada cosa

| Tipo de proyecto | Comandos (desde `P2/`) | Puertos / URLs | Notas |
|---|---|---|---|
| **2026sem2** (simulacros y `practica-*`) | `cd parciales/simulacro-prueba2-2026sem2-matutino && npm install && npm start` | App y API en **5173** (`/api/...`) | `npm run lint` desde la misma carpeta. La API es un plugin de Vite (`web/data/mock-routes.js`); sin internet: `npm install --prefer-offline`. |
| **2026sem1 prueba** (Trello) | `cd parciales/2026sem1-prueba2-vespertino && npm install` → terminal 1: `npm run server` · terminal 2: `npm run dev` | API json-server **3001** (`/tasks`) · app **5173** | `npm start` levanta los dos con `concurrently`. |
| **2026sem1 simulacro** (BarApp) | `cd parciales/2026sem1-simulacro-vespertino && npm install && (cd BE && npm install)` → terminal 1: `npm run be` · terminal 2: `npm run dev` | API **3001** (`/cuentas`, `/productos`) · app **5173** (redirige a `/cuentas`) | `BE/package.json` lo creamos nosotros (la plantilla no lo traía). |
| **2025sem2** (los 4) | `cd parciales/2025sem2-parcial2-matutino/web && npm install && npm start` | App y API en **5173** (`/api/...`, `/flags/URY.svg`) | La API solo existe con `npm start` (no con `vite preview`). |
| **Ejercicios** `Ejers/` | `cd Ejers/UT4/TA06-lista-tareas && npm run dev` | **5173** (el 2º que abras usa 5174) | Las dependencias están instaladas **una vez** en `Ejers/UT4` y `Ejers/UT5` (Node busca `node_modules` subiendo carpetas). Si las borraste: `cd Ejers/UT4 && npm install`. |
| **Visor de apuntes** | `cd visor-apuntes && npm start` | **5190** | Si cambiaron los `.md`: `npm run build-index` (2–7 min). |
| **Docs offline** | abrir [`docs-offline/INDICE.md`](docs-offline/INDICE.md) (o buscar en el visor) | — | — |

- Si `npm install` avisa `allow-scripts … esbuild`: `npm approve-scripts esbuild --yes && npm rebuild esbuild`.
- Node usado: v26 (funciona igual con v24, que es la que pide el curso en `.tool-versions`).
- Problemas de arranque (puertos, `EADDRINUSE`, imports con mayúsculas…): [ESTRATEGIA §4.1](ESTRATEGIA-EXAMEN.md#4-trampas-todas-deduplicadas).

---

## Concepto → tema de clase → dónde verlo funcionando

Rutas de código relativas a `P2/`.

| Concepto | Tema | Verlo en código |
|---|---|---|
| Arranque `index.html` → `main.jsx` → `App.jsx`, `import`/`export` | [1](clase/01-anatomia-del-proyecto.md) | `parciales/simulacro-prueba2-2026sem2-matutino/web/src/main.jsx` |
| Componente + props | [3](clase/03-componentes-y-jsx.md), [4](clase/04-props-y-children.md) | `Ejers/UT4/TA01-card-props/src/componentes/Card.jsx` |
| `children` | [4](clase/04-props-y-children.md) | `Ejers/UT4/TA02-card-children/src/componentes/Card.jsx` |
| Función como prop (el hijo avisa al padre: `onFinish`) | [4](clase/04-props-y-children.md) | `parciales/simulacro-prueba2-2026sem2-vespertino/web/src/components/TicTacToeGame/TicTacToeGame.jsx` |
| Componente reutilizable (`props.titulo` + `props.url`) | [4](clase/04-props-y-children.md), [10](clase/10-useeffect.md) | `parciales/2025sem2-parcial2-vespertino/web/src/components/ListaDePaises.jsx` |
| Envoltorio con `useParams` que reutiliza la lista | [4](clase/04-props-y-children.md), [14](clase/14-useparams-usenavigate.md) | `parciales/2025sem2-parcial2-vespertino/web/src/components/PaisesPorMoneda.jsx` |
| Render condicional (ternario / `null` / variable `content`) | [5](clase/05-listas-y-condicionales.md) | `Ejers/UT4/TA05-mostrar-ocultar/src/App.jsx` |
| Lista con `map` + `key` | [5](clase/05-listas-y-condicionales.md) | `Ejers/UT4/TA06-lista-tareas/src/componentes/ListaTareas.jsx` |
| Columnas con `map` anidado + `filter` + mensaje vacío | [5](clase/05-listas-y-condicionales.md) | `parciales/2026sem1-prueba2-vespertino/src/components/Board/Board.jsx` |
| `useState` + `onClick` | [6](clase/06-eventos.md), [7](clase/07-usestate.md) | `Ejers/UT4/TA04-contador/src/componentes/Contador.jsx` |
| Agregar al array (spread) | [7](clase/07-usestate.md) | `Ejers/UT4/TA06-lista-tareas/src/App.jsx` |
| Borrar con `filter` | [7](clase/07-usestate.md) | `Ejers/UT4/TA07-borrar-tarea/src/App.jsx` |
| Editar con `map` + "modo edición" | [5](clase/05-listas-y-condicionales.md), [7](clase/07-usestate.md) | `Ejers/UT4/TA08-editar-tarea/src/App.jsx` |
| `setEstado` asíncrono: calcular antes de decidir | [7](clase/07-usestate.md) | `parciales/2025sem2-simulacro-vespertino/web/src/context/ContextoJuego.jsx` |
| Input controlado (`value` + `onChange`) | [8](clase/08-formularios-controlados.md) | `Ejers/UT4/TA03-input-controlado/src/componentes/Input.jsx` |
| Formulario con `onSubmit` + `preventDefault` | [6](clase/06-eventos.md), [8](clase/08-formularios-controlados.md) | `Ejers/UT4/TA06-lista-tareas/src/componentes/FormularioTarea.jsx` |
| Formulario de alta + `refetch` (2026sem2) | [8](clase/08-formularios-controlados.md) | `parciales/simulacro-prueba2-2026sem2-vespertino/web/src/pages/PagePlayers/PagePlayers.jsx` |
| Formulario crear/editar (`Boolean(id)`, `handleChange` con `[name]`) | [8](clase/08-formularios-controlados.md), [14](clase/14-useparams-usenavigate.md) | `parciales/2026sem1-prueba2-vespertino/src/pages/TaskFormPage/TaskFormPage.jsx` |
| `<select>` controlado con opciones de la API + filtros combinados | [8](clase/08-formularios-controlados.md), [10](clase/10-useeffect.md) | `parciales/2025sem2-parcial2-matutino/web/src/components/Home.jsx` |
| Estado derivado: filtrar/ordenar sin `useState` | [9](clase/09-estado-derivado.md) | `parciales/simulacro-prueba2-2026sem2-matutino/web/src/components/PageCountryList/PageCountryList.jsx` |
| Lista filtrada calculada en el render | [9](clase/09-estado-derivado.md) | `Ejers/UT5/UT5.1.1-paises-router/src/paginas/ListaDePaises.jsx` |
| `useEffect` con dependencias (`document.title`) | [10](clase/10-useeffect.md) | `Ejers/UT4/TA09-useeffect-titulo/src/componentes/Contador.jsx` |
| `useEffect` + `fetch` + loading/error | [10](clase/10-useeffect.md), [11](clase/11-api-fetch.md) | `Ejers/UT4/TA10-fetch-usuarios/src/componentes/ListaUsuarios.jsx` |
| `setInterval` + limpieza + setter funcional | [10](clase/10-useeffect.md) | `Ejers/UT4/TA11-temporizador/src/componentes/Temporizador.jsx` |
| Detalle con `useEffect([cca2])` (misma ruta, otro parámetro) | [10](clase/10-useeffect.md), [14](clase/14-useparams-usenavigate.md) | `Ejers/UT5/UT5.1.1-paises-router/src/paginas/DetalleDePais.jsx` |
| Detalle 2026sem2: `useParams`, 404, casos borde, limítrofes | [10](clase/10-useeffect.md), [14](clase/14-useparams-usenavigate.md) | `parciales/simulacro-prueba2-2026sem2-matutino/web/src/components/PageCountry/PageCountry.jsx` |
| "Otro desafío" sin recargar (estado gatillo) | [10](clase/10-useeffect.md) | `parciales/2025sem2-simulacro-matutino/web/src/components/Home.jsx` |
| `fetchJSON` dado (GET, PUT con body objeto, DELETE) | [11](clase/11-api-fetch.md) | `parciales/simulacro-prueba2-2026sem2-matutino/web/src/utils/fetch.js` |
| Service con `fetch` a pelo, `response.ok` y 404 | [11](clase/11-api-fetch.md) | `Ejers/UT5/UT5.1.1-paises-router/src/servicios/api.js` |
| json-server: GET/POST/PUT/DELETE en un service | [11](clase/11-api-fetch.md) | `parciales/2026sem1-prueba2-vespertino/src/services/taskService.js` |
| Borrar + cambiar estado con PUT desde la lista | [11](clase/11-api-fetch.md) | `parciales/2026sem1-prueba2-vespertino/src/pages/BoardPage/BoardPage.jsx` |
| `BE/package.json` para json-server (trampa) | [11](clase/11-api-fetch.md) | `parciales/2026sem1-simulacro-vespertino/BE/package.json` |
| Query string con `encodeURIComponent` (`UTC+01:00`) | [11](clase/11-api-fetch.md) | `parciales/2025sem2-parcial2-matutino/web/src/services/api.js` |
| Lista que devuelve solo códigos → ítem con fetch propio | [11](clase/11-api-fetch.md) | `parciales/2025sem2-parcial2-matutino/web/src/components/ItemPais.jsx` |
| Objetos vs arrays (`Object.keys` sobre `currencies`, `languages`) | [2](clase/02-javascript-para-react.md) | `parciales/2025sem2-parcial2-matutino/web/src/components/PaginaPais.jsx` |
| Azar: elegir, mezclar, elegir varios distintos | [2](clase/02-javascript-para-react.md) | `parciales/2025sem2-simulacro-matutino/web/src/utils/azar.js` |
| `reduce` reescrito con `for...of` | [2](clase/02-javascript-para-react.md) | `parciales/2026sem1-prueba2-vespertino/src/components/AssigneesChart/AssigneesChart.jsx` |
| Formatear `null`, números, listas | [2](clase/02-javascript-para-react.md) | `parciales/simulacro-prueba2-2026sem2-matutino/web/src/utils/format.js` |
| Hook genérico `{ data, isLoading, error, refetch }` | [12](clase/12-hooks-propios.md) | `parciales/simulacro-prueba2-2026sem2-matutino/web/src/hooks/useFetchJSON.js` |
| Hooks de los docentes (`useFetchX`, `useCreateX` con `isCreating`) | [12](clase/12-hooks-propios.md) | `parciales/simulacro-prueba2-2026sem2-vespertino/web/src/hooks/useCreatePlayer.js` |
| `BrowserRouter` / `Routes` / `Route` / ruta `*` | [13](clase/13-router-rutas.md) | `Ejers/UT4/TA16-router-basico/src/App.jsx` |
| Layout con `<Outlet />` y rutas anidadas | [13](clase/13-router-rutas.md) | `parciales/simulacro-prueba2-2026sem2-matutino/web/src/components/Layout/Layout.jsx` |
| `Link` vs `<a>`, `NavLink` activo | [13](clase/13-router-rutas.md) | `Ejers/UT4/TA16-router-basico/src/componentes/BarraNavegacion.jsx` |
| `<Navigate to replace />` para redirigir `/` | [13](clase/13-router-rutas.md) | `Ejers/UT5/UT5.1.1-paises-router/src/App.jsx` |
| Rutas protegidas (`Navigate` + `children`) | [13](clase/13-router-rutas.md), [16](clase/16-context.md) | `Ejers/UT4/TA18-rutas-protegidas/src/componentes/RutaProtegida.jsx` |
| `useParams` (string → `Number()`) + `find` | [14](clase/14-useparams-usenavigate.md) | `Ejers/UT4/TA17-router-params/src/paginas/DetalleProducto.jsx` |
| Contexto de juego + `<Navigate>` si no hay dificultad | [14](clase/14-useparams-usenavigate.md), [16](clase/16-context.md) | `parciales/2025sem2-simulacro-vespertino/web/src/components/PaginaPais.jsx` |
| `useSearchParams` (búsqueda y orden en la URL) + `useMemo` | [15](clase/15-usesearchparams.md), [17](clase/17-usememo-usecallback-useref.md) | `parciales/simulacro-prueba2-2026sem2-matutino/web/src/components/PageCountryList/PageCountryList.jsx` |
| `createContext` + `useContext` (solo lectura) | [16](clase/16-context.md) | `Ejers/UT4/TA12-contexto-usuario/src/contextos/ContextoUsuario.jsx` |
| Contexto con valor **y** setter | [16](clase/16-context.md) | `Ejers/UT4/TA13-contexto-actualizar/src/componentes/InputNombre.jsx` |
| Dos Providers anidados | [16](clase/16-context.md) | `Ejers/UT4/TA15-dos-contextos/src/App.jsx` |
| Context en dos archivos (lint) + PUT/DELETE de favoritos | [16](clase/16-context.md), [18](clase/18-css-modules-y-lint.md) | `parciales/simulacro-prueba2-2026sem2-matutino/web/src/context/FavoritesProvider.jsx` |
| Provider de lista global en `main.jsx` | [16](clase/16-context.md) | `parciales/2026sem1-prueba2-vespertino/src/context/TasksProvider.jsx` |
| Provider autosuficiente (fetch propio + `recargar()`) | [16](clase/16-context.md) | `parciales/2026sem1-simulacro-vespertino/src/context/RecaudacionProvider.jsx` |
| Estado que sobrevive al navegar (puntaje en Context) | [16](clase/16-context.md) | `parciales/2025sem2-simulacro-matutino/web/src/context/ContextoPuntaje.jsx` |
| Contexto + `localStorage` (dark mode persistente) | [10](clase/10-useeffect.md), [16](clase/16-context.md) | `Ejers/UT5/UT5.1.2-paises-dark-mode/src/contextos/ContextoTema.jsx` |
| Selector de modo fuera de `<Routes>` | [13](clase/13-router-rutas.md), [16](clase/16-context.md) | `Ejers/UT5/UT5.1.2-paises-dark-mode/src/componentes/SelectorDeModo.jsx` |
| `useRef` como guarda (guardar la partida una sola vez) | [17](clase/17-usememo-usecallback-useref.md) | `parciales/simulacro-prueba2-2026sem2-vespertino/web/src/components/TicTacToeGame/TicTacToeGame.jsx` |
| Contexto de tema + clase CSS condicional | [16](clase/16-context.md), [18](clase/18-css-modules-y-lint.md) | `Ejers/UT4/TA14-contexto-tema/src/componentes/TarjetaConTema.jsx` |
| Dark mode: clase en el raíz + selectores descendientes | [18](clase/18-css-modules-y-lint.md) | `Ejers/UT5/UT5.1.2-paises-dark-mode/src/App.css` |
| Tarjeta con CSS Modules + `find` por nombre | [18](clase/18-css-modules-y-lint.md) | `parciales/2026sem1-simulacro-vespertino/src/components/CuentaCard/CuentaCard.jsx` |
| Barra de progreso (`style` inline calculado) | [18](clase/18-css-modules-y-lint.md) | `parciales/2026sem1-prueba2-vespertino/src/components/ProgressBar/ProgressBar.jsx` |
| Botón con clase correcta/incorrecta por props | [18](clase/18-css-modules-y-lint.md) | `parciales/2025sem2-simulacro-matutino/web/src/components/BotonBandera.jsx` |
| Un parcial completo leído de punta a punta | [19](clase/19-lectura-guiada-parcial.md) | `parciales/simulacro-prueba2-2026sem2-matutino/` |
