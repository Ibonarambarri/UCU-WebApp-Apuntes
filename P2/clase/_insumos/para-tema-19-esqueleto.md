# Insumo para tema 19 — Lectura guiada de un parcial completo (esqueleto)

> Material destilado de los apuntes viejos (apuntes/_archivo/09-PATRONES-DE-PARCIAL.md secciones (a), (b) y (d)) para integrar al escribir el tema. No duplica CHULETA-EXAMEN.md ni los temas 01-11.

Plan de ataque de 2 h, primeros 5 minutos, checklist y trampas → `ESTRATEGIA-EXAMEN.md` (raíz de P2). Este insumo es
solo el **mapa** para la lectura guiada: qué se pidió, qué formatos hay, y qué pieza del esqueleto está dónde.

---

## 1. Qué se pidió cada año

| Prueba | Carpeta (`parciales/…`) | Router | Datos | Context | Form | Juego |
|---|---|---|---|---|---|---|
| **Simulacro 2026sem2 mat.** (países) | `simulacro-prueba2-2026sem2-matutino` | `/countries`, `/countries/:code` + query params | `fetchJSON` GET + PUT/DELETE favoritos | sí (favoritos, opcional) | buscador/select por URL | no |
| **Simulacro 2026sem2 vesp.** (tatetí) | `simulacro-prueba2-2026sem2-vespertino` | `/`, `/play`, `/players` | hooks de los docentes, crear = PUT | no | alta de jugador + selects | sí (tablero dado) |
| Prueba 2 2026sem1 (Trello) | `2026sem1-prueba2-vespertino` | `/`, `/tasks/new`, `/tasks/:id/edit` | json-server GET/POST/PUT/DELETE | sí (ej. 6) | crear + editar | no |
| Simulacro 2026sem1 (BarApp) | `2026sem1-simulacro-vespertino` | `/cuentas`, `/cuentas/nueva` | json-server GET/POST | sí (total en NavBar) | crear | no |
| Parcial 2025sem2 mat. | `2025sem2-parcial2-matutino` | `/`, `/country/:cca3` | mock Vite, query combinado | no | 3 selects | no |
| Parcial 2025sem2 vesp. | `2025sem2-parcial2-vespertino` | **9 rutas** | mock Vite | no | no | no |
| Simulacro 2025sem2 mat. | `2025sem2-simulacro-matutino` | `/`, `/country/:cca3` | mock Vite | sí (puntaje) | no | azar |
| Simulacro 2025sem2 vesp. | `2025sem2-simulacro-vespertino` | `/`, `/end`, `/:cca3` | mock Vite | sí (juego) | no | azar |

**Siempre**: rutas + `Link` + `useParams`, fetch con cargando/error, `map` con `key`, página de detalle por parámetro.
**Casi siempre**: Context, formulario controlado, `<select>` con opciones de la API.

## 2. Los formatos

| | **2026sem2 (el del examen)** | 2026sem1 | 2025sem2 |
|---|---|---|---|
| Backend | mock API **dentro de Vite** (`web/data/mock-routes.js`), mismo puerto | json-server aparte (3001), 2 terminales | mock dentro de Vite |
| Correr | `npm install` + `npm start` en la raíz | `npm run server` + `npm run dev` | `cd web && npm start` |
| Pedidos | `fetchJSON` **dado** (tira en no-2xx, body objeto) | service propio con `fetch` + `response.ok` | `fetch` a pelo |
| Crear | **PUT** | POST | — |
| Estilos | CSS Modules | CSS Modules exigido | CSS global libre |
| Enunciado | requisitos + "casos a contemplar" + opcionales; diseño en `specs/design.svg` | 6 ejercicios con TODOs (5/6 = 100 %) | app desde casi cero |
| Lint | `npm run lint` limpio es requisito | — | — |
| Router | v6 con `future` flags, Layout + `Outlet` | v7 (Trello) / v6 | v6 |
| Entrega | fork + PR | fork + PR | fork + PR |

## 3. Esqueleto 2026sem2: qué archivo, en qué orden, dónde está explicado

Recorrido recomendado del matutino resuelto (`parciales/simulacro-prueba2-2026sem2-matutino/web/src/`):

| Orden | Archivo | Pieza | Explicación |
|---|---|---|---|
| 1 | `components/App/App.jsx` + `Layout/Layout.jsx` | Provider + Router + Layout con `<Outlet />` | [CHULETA §1](../../CHULETA-EXAMEN.md), insumo tema 13 |
| 2 | `utils/fetch.js` (dado) + `hooks/useFetchJSON.js` | pedidos y hook genérico | [tema 11](../11-api-fetch.md), CHULETA §3, insumo tema 12 |
| 3 | `components/PageCountry/PageCountry.jsx` | detalle: `useParams`, 4 estados, 404, limítrofes | [tema 10 §10.5](../10-useeffect.md), CHULETA §4 |
| 4 | `utils/countries.js` + `utils/format.js` | filtrar/ordenar sin mutar, `null` → `—` | [tema 9](../09-estado-derivado.md), [tema 2](../02-javascript-para-react.md), CHULETA §6 |
| 5 | `components/PageCountryList/PageCountryList.jsx` | `useSearchParams` + `useMemo` | CHULETA §2, insumos 15 y 17 |
| 6 | `context/FavoritesContext.js` + `FavoritesProvider.jsx` + `FavoriteButton` | Context en 2 archivos, PUT/DELETE | CHULETA §7, insumo tema 16 |

Y del tatetí (`parciales/simulacro-prueba2-2026sem2-vespertino/web/src/`): `hooks/` (estilo de los docentes) →
`pages/PagePlayers/PagePlayers.jsx` (lista con estadísticas + form + `refetch`, [tema 8 §8.3](../08-formularios-controlados.md)) →
`pages/PagePlay/PagePlay.jsx` + `components/TicTacToeGame/TicTacToeGame.jsx` (hijo avisa al padre con `onFinish`,
[tema 4 §4.3](../04-props-y-children.md); `useRef`/`useCallback`, insumo tema 17).

## 4. Piezas de los formatos viejos (solo para reconocerlas)

No repetir código: cada pieza ya está explicada en otro lado.

| Pieza | Formato | Dónde verla | Explicación |
|---|---|---|---|
| `main.jsx` con Provider envolviendo `<App />` (App hace `useContext`) | 2026sem1 | `parciales/2026sem1-prueba2-vespertino/src/main.jsx` | insumo tema 16 §16.3 |
| `App` con `handleSave(saved, isEditing)` que actualiza la lista global (map/spread) | 2026sem1 | `parciales/2026sem1-prueba2-vespertino/src/App.jsx` | [tema 7 §7.5](../07-usestate.md) |
| Service GET/POST/PUT/DELETE con `fetch` + `response.ok` | 2026sem1 | `parciales/2026sem1-prueba2-vespertino/src/services/taskService.js`, `parciales/2026sem1-simulacro-vespertino/src/api/client.js` | [tema 11](../11-api-fetch.md) (formatos anteriores) |
| Lista reutilizable `titulo` + `url` + envoltorios con `useParams` | 2025 | `parciales/2025sem2-parcial2-vespertino/web/src/components/ListaDePaises.jsx`, `.../PaisesPorMoneda.jsx` | [tema 4](../04-props-y-children.md), insumo tema 14 §14.2 |
| Detalle con `useEffect([cca2])` y `try/catch/finally` | UT5 | `Ejers/UT5/UT5.1.1-paises-router/src/paginas/DetalleDePais.jsx` | [tema 10](../10-useeffect.md) |
| Formulario crear/editar en una página (`Boolean(id)`, `handleChange` con `[name]`) | 2026sem1 | `parciales/2026sem1-prueba2-vespertino/src/pages/TaskFormPage/TaskFormPage.jsx` | [tema 8 §8.4-8.5](../08-formularios-controlados.md), insumo 14 §14.4 |
| Provider "tonto" `{ tasks, setTasks }` | 2026sem1 | `parciales/2026sem1-prueba2-vespertino/src/context/TasksContext.jsx` | insumo tema 16 §16.5 |
| Provider autosuficiente `{ total, recargar }` | 2026sem1 | `parciales/2026sem1-simulacro-vespertino/src/context/RecaudacionContext.jsx` | insumo tema 16 §16.5 |
| Ruta protegida | UT4 | `Ejers/UT4/TA18-rutas-protegidas/src/componentes/RutaProtegida.jsx` | insumo tema 13 §13.7 |
| Borrar con `window.confirm` → DELETE → `filter`; cambiar estado: `find` → `{ ...t, status }` → PUT → `map` | 2026sem1 | `parciales/2026sem1-prueba2-vespertino/src/pages/BoardPage/BoardPage.jsx` | [tema 7 §7.5](../07-usestate.md), [tema 11](../11-api-fetch.md) |
| Azar: elegir, mezclar, elegir varios distintos | 2025 | `parciales/2025sem2-simulacro-matutino/web/src/utils/azar.js` | [tema 2](../02-javascript-para-react.md) (azar) |

## 5. Preguntas para la lectura guiada (sugeridas)

- ¿Dónde vive cada dato (estado local, URL, Context, API) y por qué ahí?
- ¿Qué se **calcula** en el render y qué se **guarda**?
- ¿Qué efecto depende de qué, y qué pasaría con `[]`?
- ¿Cómo se entera la pantalla después de un PUT/DELETE (refetch vs actualizar el estado)?
- Si el enunciado agregara "filtro por región" o "página `/favorites`", ¿qué archivos tocarías? (recetario §4 del
  APUNTES-PARCIAL del matutino).
