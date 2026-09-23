# Clase: todos los conceptos del Parcial 2, de fácil a difícil

Apuntes de la clase particular (un archivo por tema). Cada tema termina con la
pregunta de repaso que se hizo en clase y su respuesta.

| # | Tema | Archivo | Estado |
|---|---|---|---|
| **Nivel 1 — Cimientos** | | | |
| 1 | Cómo arranca la app, `import` / `export`, carpetas | [01-anatomia-del-proyecto.md](01-anatomia-del-proyecto.md) | ✅ |
| 2 | El JavaScript que React usa sin parar | [02-javascript-para-react.md](02-javascript-para-react.md) | ✅ |
| 3 | Componentes y JSX | [03-componentes-y-jsx.md](03-componentes-y-jsx.md) | ✅ |
| 4 | Props, funciones como props, `children` | [04-props-y-children.md](04-props-y-children.md) | ✅ |
| 5 | Listas (`map` + `key`) y render condicional | [05-listas-y-condicionales.md](05-listas-y-condicionales.md) | ✅ |
| 6 | Eventos | [06-eventos.md](06-eventos.md) | ✅ |
| **Nivel 2 — Estado** | | | |
| 7 | `useState` e inmutabilidad | [07-usestate.md](07-usestate.md) | ✅ |
| 8 | Inputs y formularios controlados | [08-formularios-controlados.md](08-formularios-controlados.md) | ✅ |
| 9 | Estado derivado: calcular, no guardar | [09-estado-derivado.md](09-estado-derivado.md) | ✅ |
| **Nivel 3 — Datos** | | | |
| 10 | `useEffect`: dependencias y limpieza | [10-useeffect.md](10-useeffect.md) | ✅ |
| 11 | Hablar con la API: `fetch`, `async/await`, GET/PUT/DELETE | [11-api-fetch.md](11-api-fetch.md) | ✅ |
| 12 | Cargando / error / datos y hooks propios | [12-hooks-propios.md](12-hooks-propios.md) | ✅ |
| **Nivel 4 — Navegación** | | | |
| 13 | React Router: `Routes`, `Route`, `Link`, `Outlet`, `Navigate` | [13-router-rutas.md](13-router-rutas.md) | ✅ |
| 14 | `useParams` y `useNavigate` | [14-useparams-usenavigate.md](14-useparams-usenavigate.md) | ✅ |
| 15 | `useSearchParams` (estado en la URL) | [15-usesearchparams.md](15-usesearchparams.md) | ✅ |
| **Nivel 5 — Estado compartido** | | | |
| 16 | Context | [16-context.md](16-context.md) | ✅ |
| 17 | `useMemo`, `useCallback`, `useRef` | [17-usememo-usecallback-useref.md](17-usememo-usecallback-useref.md) | ✅ |
| **Nivel 6 — Terminaciones** | | | |
| 18 | CSS Modules y lint | [18-css-modules-y-lint.md](18-css-modules-y-lint.md) | ✅ |
| 19 | Lectura guiada de un parcial completo | [19-lectura-guiada-parcial.md](19-lectura-guiada-parcial.md) | ✅ |

**El ciclo de React en una línea** (todo lo demás es variación de esto):

```
evento → setAlgo(nuevo) → React vuelve a ejecutar el componente → pantalla nueva
```

## Material de consulta relacionado

- [`../README.md`](../README.md) — punto de entrada: qué hay, cómo correr cada proyecto, tabla concepto → tema → código.
- [`../CHULETA-EXAMEN.md`](../CHULETA-EXAMEN.md) — fragmentos para copiar en el examen.
- [`../ESTRATEGIA-EXAMEN.md`](../ESTRATEGIA-EXAMEN.md) — plan de 2 h, checklist de entrega y todas las trampas.
