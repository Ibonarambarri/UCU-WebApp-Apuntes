# 00 — Índice de los apuntes del Parcial 2 (React · Router · Context)

Todo lo que hay en `P2/apuntes/` sale de resolver los 18 ejercicios de UT4, los
2 de UT5 y los 6 parciales/simulacros de segundo parcial de años anteriores.
Cada concepto está explicado en un `.md` **y** tiene un archivo de código real
donde verlo funcionando (rutas relativas a `P2/`).

---

## Los archivos y en qué orden leerlos

| # | Archivo | Qué tiene | Cuándo leerlo |
|---|---|---|---|
| 1 | [`09-PATRONES-DE-PARCIAL.md`](09-PATRONES-DE-PARCIAL.md) | Qué se pidió cada año, formato más probable, **plan de ataque de 2 h**, esqueleto completo para copiar (App + service + lista + detalle + formulario + provider), las **25 trampas**, checklist de entrega. | **Primero.** Da el mapa de todo. |
| 2 | [`01-REACT-BASICO.md`](01-REACT-BASICO.md) | JSX, componentes, props, `children`, eventos, `useState`, listas con `key`, inputs controlados, formularios, CRUD en memoria, errores clásicos. | Base. Si algo de acá no lo sabés, lo demás no se entiende. |
| 3 | [`02-HOOKS-USEEFFECT.md`](02-HOOKS-USEEFFECT.md) | `useEffect` a fondo: dependencias, fetch adentro, cleanup, timers, StrictMode, forma funcional del setter, efectos que dependen de `useParams`. | Después del básico. |
| 4 | [`03-REACT-ROUTER.md`](03-REACT-ROUTER.md) | `BrowserRouter/Routes/Route`, `Link`/`NavLink`, `useParams`, `useNavigate`, `Navigate`, `*`, `Outlet`, rutas protegidas, tablas de rutas de cada parcial. | Sale en el 100 % de los parciales. |
| 5 | [`04-CONTEXT.md`](04-CONTEXT.md) | `createContext`, Provider con `props.children`, `useContext`, dónde poner el Provider, provider autosuficiente con fetch, contexto + `localStorage`, contexto de juego/auth/tema. | Sale en 5 de 6 parciales (siempre como último ejercicio). |
| 6 | [`05-FETCH-API-JSON-SERVER.md`](05-FETCH-API-JSON-SERVER.md) | Service con GET/POST/PUT/PATCH/DELETE, json-server 1.x, mock API de Vite (2025), forma de los datos de países, curl, trampas de puertos e ids. | Antes de tocar cualquier backend. |
| 7 | [`06-CSS-EN-REACT.md`](06-CSS-EN-REACT.md) | CSS global vs **CSS Modules** vs inline, clases condicionales, dark mode, navbar, grilla, columnas Trello, tarjeta, formulario, barra de progreso. | Cuando ya funciona todo y hay que "que se vea". |
| 8 | [`07-JAVASCRIPT-USADO.md`](07-JAVASCRIPT-USADO.md) | `map/filter/find/includes/sort`, spread, `Object.keys`, `for...of` en vez de `reduce`, `async/await`, `fetch`, `JSON`, `encodeURIComponent`, `localStorage`, `Math.random`, ids string vs number. | Consulta rápida cuando un método no te sale. |
| 9 | [`08-SETUP-VITE-Y-ENTORNO.md`](08-SETUP-VITE-Y-ENTORNO.md) | Crear proyecto, correr cada plantilla (tabla de comandos y puertos), json-server, warnings normales, **todos los errores de arranque que salieron** y su fix, checklist de los primeros 5 minutos. | La noche anterior y los primeros 10 minutos del parcial. |

---

## Estructura de `P2/` y cómo correr cada cosa en 3 comandos

```
P2/
├── Ejers/                  ← ejercicios de clase resueltos, uno por carpeta
│   ├── UT4/TA01..TA18/     ← React: props, estado, efectos, contexto, router
│   └── UT5/UT5.1.1, UT5.1.2/ ← app de países con router y dark mode (API countries.dev)
├── parciales/              ← 6 parciales/simulacros resueltos + APUNTES-PARCIAL.md en cada uno
│   ├── 2026sem1-prueba2-vespertino/     (Trello)   ← formato MÁS PROBABLE
│   ├── 2026sem1-simulacro-vespertino/   (BarApp)
│   ├── 2025sem2-parcial2-matutino/      (países + 3 selects)
│   ├── 2025sem2-parcial2-vespertino/    (países, 9 rutas)
│   ├── 2025sem2-simulacro-matutino/     (trivia mapa → bandera)
│   └── 2025sem2-simulacro-vespertino/   (viaje por fronteras)
└── apuntes/                ← este índice y los 9 .md
```

```bash
# Un ejercicio (las deps están instaladas UNA vez en Ejers/UT4 y Ejers/UT5)
cd P2/Ejers/UT4/TA06-lista-tareas && npm run dev          # http://localhost:5173

# Un parcial 2026 (dos terminales: backend 3001 + vite 5173)
cd P2/parciales/2026sem1-prueba2-vespertino && npm install && npm run server   # terminal 1
npm run dev                                                                       # terminal 2

# Un parcial 2025 (la API es un plugin de Vite en el mismo puerto)
cd P2/parciales/2025sem2-parcial2-matutino/web && npm install && npm start      # http://localhost:5173
```

Si `npm install` avisa de `allow-scripts` (esbuild): `npm approve-scripts esbuild --yes && npm rebuild esbuild`.

---

## Tabla: concepto → dónde está explicado → dónde verlo en código

| Concepto | Explicado en | Verlo en código (relativo a `P2/`) |
|---|---|---|
| Componente + props | `01` | `Ejers/UT4/TA01-card-props/src/componentes/Card.jsx` |
| `props.children` | `01` | `Ejers/UT4/TA02-card-children/src/componentes/Card.jsx` |
| Input controlado (`value` + `onChange`) | `01` | `Ejers/UT4/TA03-input-controlado/src/componentes/Input.jsx` |
| `useState` + eventos `onClick` | `01` | `Ejers/UT4/TA04-contador/src/componentes/Contador.jsx` |
| Render condicional (ternario / `null`) | `01` | `Ejers/UT4/TA05-mostrar-ocultar/src/App.jsx` |
| Formulario con `onSubmit` + `preventDefault` | `01` | `Ejers/UT4/TA06-lista-tareas/src/componentes/FormularioTarea.jsx` |
| Lista con `map` + `key` | `01` | `Ejers/UT4/TA06-lista-tareas/src/componentes/ListaTareas.jsx` |
| Agregar al array (spread) | `01`, `07` | `Ejers/UT4/TA06-lista-tareas/src/App.jsx` |
| Borrar con `filter` | `01`, `07` | `Ejers/UT4/TA07-borrar-tarea/src/App.jsx` |
| Editar con `map` + "modo edición" | `01` | `Ejers/UT4/TA08-editar-tarea/src/App.jsx` |
| `useEffect` con dependencias (`document.title`) | `02` | `Ejers/UT4/TA09-useeffect-titulo/src/componentes/Contador.jsx` |
| `useEffect` + `fetch` + loading/error | `02`, `05` | `Ejers/UT4/TA10-fetch-usuarios/src/componentes/ListaUsuarios.jsx` |
| `setInterval` + función de limpieza + setter funcional | `02` | `Ejers/UT4/TA11-temporizador/src/componentes/Temporizador.jsx` |
| `createContext` + `useContext` (solo lectura) | `04` | `Ejers/UT4/TA12-contexto-usuario/src/contextos/ContextoUsuario.jsx` |
| Contexto con valor **y** setter (`{ nombre, setNombre }`) | `04` | `Ejers/UT4/TA13-contexto-actualizar/src/componentes/InputNombre.jsx` |
| Contexto de tema + clase CSS condicional | `04`, `06` | `Ejers/UT4/TA14-contexto-tema/src/componentes/TarjetaConTema.jsx` |
| Dos Providers anidados | `04` | `Ejers/UT4/TA15-dos-contextos/src/App.jsx` |
| `BrowserRouter` / `Routes` / `Route` / ruta `*` | `03` | `Ejers/UT4/TA16-router-basico/src/App.jsx` |
| `Link` vs `<a>`, `NavLink` activo | `03`, `06` | `Ejers/UT4/TA16-router-basico/src/componentes/BarraNavegacion.jsx` |
| `useParams` (string → `Number()`) + `find` | `03`, `07` | `Ejers/UT4/TA17-router-params/src/paginas/DetalleProducto.jsx` |
| Rutas protegidas (`Navigate` + `props.children`, alternativa `Outlet`) | `03`, `04` | `Ejers/UT4/TA18-rutas-protegidas/src/componentes/RutaProtegida.jsx` |
| `<Navigate to replace />` para redirigir `/` | `03` | `Ejers/UT5/UT5.1.1-paises-router/src/App.jsx` |
| Service `api.js` con `respuesta.ok` y 404 | `05` | `Ejers/UT5/UT5.1.1-paises-router/src/servicios/api.js` |
| Detalle con `useEffect([cca2])` (misma ruta, distinto parámetro) | `02`, `03` | `Ejers/UT5/UT5.1.1-paises-router/src/paginas/DetalleDePais.jsx` |
| Lista filtrada calculada en el render (`filter`, no estado) | `02`, `07` | `Ejers/UT5/UT5.1.1-paises-router/src/paginas/ListaDePaises.jsx` |
| Contexto + `localStorage` (dark mode persistente) | `04`, `07` | `Ejers/UT5/UT5.1.2-paises-dark-mode/src/contextos/ContextoTema.jsx` |
| Selector de modo fuera de `<Routes>` (en todas las páginas) | `03`, `04` | `Ejers/UT5/UT5.1.2-paises-dark-mode/src/componentes/SelectorDeModo.jsx` |
| Dark mode: clase en el raíz + selectores descendientes | `06` | `Ejers/UT5/UT5.1.2-paises-dark-mode/src/App.css` |
| **json-server** GET/POST/PUT/DELETE en un service | `05`, `09` | `parciales/2026sem1-prueba2-vespertino/src/services/taskService.js` |
| Provider de lista global (`TasksProvider`) | `04`, `09` | `parciales/2026sem1-prueba2-vespertino/src/context/TasksContext.jsx` |
| Provider envolviendo `<App>` en `main.jsx` | `04` | `parciales/2026sem1-prueba2-vespertino/src/main.jsx` |
| Formulario crear/editar en una página (`Boolean(id)`, `handleChange` con `[name]`, `useNavigate`) | `01`, `03`, `09` | `parciales/2026sem1-prueba2-vespertino/src/pages/TaskFormPage/TaskFormPage.jsx` |
| Columnas con `map` anidado + `filter` + mensaje vacío | `01`, `06` | `parciales/2026sem1-prueba2-vespertino/src/components/Board/Board.jsx` |
| Barra de progreso (`style` inline calculado) | `06` | `parciales/2026sem1-prueba2-vespertino/src/components/ProgressBar/ProgressBar.jsx` |
| `reduce` reescrito con `for...of` | `07` | `parciales/2026sem1-prueba2-vespertino/src/components/AssigneesChart/AssigneesChart.jsx` |
| Borrar + cambiar estado con PUT desde la lista | `05`, `09` | `parciales/2026sem1-prueba2-vespertino/src/pages/BoardPage/BoardPage.jsx` |
| Provider autosuficiente (fetch propio + `recargar()`) | `04`, `09` | `parciales/2026sem1-simulacro-vespertino/src/context/RecaudacionContext.jsx` |
| `BE/package.json` para json-server (trampa) | `05`, `08` | `parciales/2026sem1-simulacro-vespertino/BE/package.json` |
| Tarjeta con CSS Modules + `find` por nombre | `06`, `07` | `parciales/2026sem1-simulacro-vespertino/src/components/CuentaCard/CuentaCard.jsx` |
| `<select>` controlado con opciones de la API + filtros combinados | `01`, `05` | `parciales/2025sem2-parcial2-matutino/web/src/components/Home.jsx` |
| Query string con `encodeURIComponent` (el `+` de `UTC+01:00`) | `05`, `07` | `parciales/2025sem2-parcial2-matutino/web/src/services/api.js` |
| Lista que devuelve solo códigos → `ItemPais` con fetch propio | `05`, `09` | `parciales/2025sem2-parcial2-matutino/web/src/components/ItemPais.jsx` |
| Objetos vs arrays (`Object.keys` sobre `currencies`, `languages`, `nativeName`) | `05`, `07` | `parciales/2025sem2-parcial2-matutino/web/src/components/PaginaPais.jsx` |
| Componente reutilizable (`props.titulo` + `props.url`, `useEffect([props.url])`) | `03`, `09` | `parciales/2025sem2-parcial2-vespertino/web/src/components/ListaDePaises.jsx` |
| Envoltorio con `useParams` que reutiliza la lista | `03` | `parciales/2025sem2-parcial2-vespertino/web/src/components/PaisesPorMoneda.jsx` |
| Azar: `elegirAlAzar`, `mezclarArray`, `elegirVariosDistintos` | `07`, `09` | `parciales/2025sem2-simulacro-matutino/web/src/utils/azar.js` |
| Estado que sobrevive al navegar (puntaje en Context) | `04` | `parciales/2025sem2-simulacro-matutino/web/src/context/ContextoPuntaje.jsx` |
| "Otro desafío" sin recargar (estado gatillo en dependencias) | `02` | `parciales/2025sem2-simulacro-matutino/web/src/components/Home.jsx` |
| Botón con clase correcta/incorrecta por props | `06` | `parciales/2025sem2-simulacro-matutino/web/src/components/BotonBandera.jsx` |
| Contexto de juego (errores, visitados) + `<Navigate>` si no hay dificultad | `04`, `03` | `parciales/2025sem2-simulacro-vespertino/web/src/context/ContextoJuego.jsx`, `.../components/PaginaPais.jsx` |
| `setEstado` asíncrono: calcular antes de decidir | `02` | `parciales/2025sem2-simulacro-vespertino/web/src/context/ContextoJuego.jsx` |

---

## Si solo tenés 1 hora, leé esto

1. **`09-PATRONES-DE-PARCIAL.md` sección (d)**: el esqueleto (main + App con router, service, lista, detalle, formulario, provider). Son 6 bloques; si los podés escribir de memoria, el parcial 2026 está hecho.
2. **`09` sección (e)**: las 25 trampas. Sobre todo: puerto del backend, ids string, `useEffect([param])`, Provider en `main.jsx`, `fetch` no lanza en 404, `preventDefault`, `navigate` después del `await`.
3. **`04-CONTEXT.md` "Provider para copiar"**: ~25 líneas que valen 1 ejercicio de 6.
4. **`08-SETUP-VITE-Y-ENTORNO.md` §7**: los primeros 5 minutos (install, README, TODOs, puertos, curl).
5. Abrí `parciales/2026sem1-prueba2-vespertino/APUNTES-PARCIAL.md` y recorré el código resuelto siguiendo la tabla "archivo → ejercicio". Es el formato que más probablemente te toque.
