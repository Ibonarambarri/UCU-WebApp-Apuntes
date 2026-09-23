# Apuntes: Simulacro parcial 2 (2025 sem 2, vespertino) — "Flag Trivia" (viaje por fronteras)

> Formato 2025 (mock API en Vite, `fetch` a pelo). No es el formato 2026sem2.

Cómo correrlo: ver [README principal](../../README.md#cómo-correr-cada-cosa) (formato 2025: `cd web && npm install && npm start`).

## 1. Resumen del enunciado

- En `/` hay 3 botones de dificultad: Fácil (8 errores), Medio (5), Difícil (3). Al presionar uno se guarda el contador de errores, se vacía la lista de visitados y se **redirige** a `/:cca3` de un país al azar.
- En `/:cca3` se muestra nombre + bandera del país actual y **9 botones** con banderas: algunos son **fronterizos** (`borders`) y el resto países al azar, mezclados. Debajo, botón **"Ninguno"** y un texto con países visitados y errores restantes.
- Regla: es correcto presionar un fronterizo **no visitado**; cualquier otra cosa es un error. Siempre se navega al país elegido. "Ninguno" es correcto solo si ninguna de las 9 opciones era un fronterizo no visitado; luego se navega a un país no visitado al azar.
- Si se comete el último error permitido → `/end`, que lista los países visitados y tiene un botón para volver al inicio.
- API: `GET /api/countries` → array de cca3; `GET /api/countries/URY` → objeto con `borders: ["ARG","BRA"]`, `flag.svg: "/flags/URY.svg"`. 86 países tienen `borders` vacío (islas).

| Ruta | Componente | Qué muestra |
|------|------------|-------------|
| `/` | `Home.jsx` | 3 botones de dificultad; inicializa el Context y navega |
| `/end` | `PaginaFinal.jsx` | Lista de visitados + "Volver al inicio" |
| `/:cca3` | `PaginaPais.jsx` | País actual, 9 banderas, "Ninguno", visitados y errores |

## 2. Archivos creados

```
web/src/
├── components/
│   ├── App.jsx              Router con "/", "/end" y "/:cca3", envuelto en ProveedorJuego
│   ├── Home.jsx             3 botones; iniciarJuego() del Context + useNavigate('/' + cca3AlAzar)
│   ├── PaginaPais.jsx       useParams + useEffect [cca3]; arma 9 opciones; reglas del juego; <Navigate>
│   ├── PaginaFinal.jsx      Lista paisesVisitados del Context; botón volver (useNavigate('/'))
│   └── BotonBandera.jsx     Botón "tonto" con <img>; avisa al padre con alPresionar(cca3)
├── context/
│   └── ContextoJuego.jsx    dificultad, erroresRestantes, paisesVisitados + iniciarJuego,
│                            agregarPaisVisitado, descontarError
├── services/
│   └── api.js               obtenerCodigosDePaises(), obtenerPais(cca3)
├── utils/
│   └── azar.js              elegirAlAzar, mezclarArray, elegirVariosDistintos
└── index.css                Grilla 3x3 para las banderas, estilos simples
```

## 3. Dónde estaba lo difícil (propio de este parcial)

### a) Estado compartido entre 3 rutas → `ContextoJuego`
`erroresRestantes`, `paisesVisitados` y `dificultad` los escribe `Home`, los usa `PaginaPais` y los muestra
`PaginaFinal`. Cada cambio de ruta desmonta el componente anterior → viven en el Context, con el `Provider` en `App`
por encima del `BrowserRouter`. (Context: [tema 16](../../clase/16-context.md).)

### b) De `/URY` a `/ARG`: `useEffect([cca3])`
Misma ruta `/:cca3`, otro parámetro: `PaginaPais` NO se desmonta; con `[]` quedaría clavado en el primer país
→ [tema 10](../../clase/10-useeffect.md) §10.5.

### c) Guardia si recargó en `/URY`
El Context vuelve a su valor inicial → `if (contexto.dificultad === '') return <Navigate to="/" replace />;`, con
todos los hooks **antes** de ese `return` ([tema 13](../../clase/13-router-rutas.md)). Desde un handler: `navegar('/' + cca3)`.

### d) Decidir el fin del juego en el mismo click
`setErroresRestantes` no cambia la variable al instante → `descontarError()` calcula, setea y **devuelve**
(→ [tema 7](../../clase/07-usestate.md) §7.3):
```jsx
function descontarError() { const quedan = erroresRestantes - 1; setErroresRestantes(quedan); return quedan; }
// handler:
const erroresQueQuedan = contexto.descontarError();
if (erroresQueQuedan <= 0) { navegar('/end'); } else { navegar(rutaDestino); }
```

### e) Visitados con setter funcional
`Home` hace `setPaisesVisitados([])` y navega; `PaginaPais` monta y llama `agregarPaisVisitado(cca3)`. Para aplicar
el agregado **sobre** el array ya vaciado: `setPaisesVisitados((anterior) => anterior.includes(cca3) ? anterior : [...anterior, cca3])`
→ [tema 7](../../clase/07-usestate.md) §7.4.

### f) Armar las 9 opciones
1. `cantidadDeFronterizos = Math.floor(Math.random() * (Math.min(borders.length, 9) + 1))` (puede ser 0 → "Ninguno" es la respuesta).
2. `mezclarArray(borders).slice(0, cantidad)` para elegir cuáles.
3. Relleno con `elegirVariosDistintos(codigos, 9 - cantidad, [cca3, ...borders])`: se excluyen todos los fronterizos para que el relleno no sea correcto "de casualidad".
4. `mezclarArray` del total. La imagen es `/flags/CCA3.svg` directo, no hace falta pedir cada país.

### g) Lógica de "Ninguno"
Recorrer las opciones y preguntar `borders.includes(codigo) && !visitados.includes(codigo)`; si alguna cumple,
"Ninguno" es error. Destino: `elegirAlAzar(codigos.filter(no visitado))`. Se decide **con datos** (`borders` y
`visitados`), no con "cuántos fronterizos puse".

### h) Islas
86 países con `borders: []`: las 9 opciones son relleno y la única jugada correcta es "Ninguno". El código nunca
asume que hay fronterizos.

### i) Orden de rutas
`/end` y `/:cca3` conviven: React Router 6 elige la más específica (`/end`). Igual conviene ponerla antes.

## 4. Conceptos clave

- Setter asíncrono y forma funcional → [tema 7](../../clase/07-usestate.md).
- `useEffect([cca3])` → [tema 10](../../clase/10-useeffect.md).
- Azar (`elegirAlAzar`, `mezclarArray`, `elegirVariosDistintos`) → [tema 2](../../clase/02-javascript-para-react.md).
- `useNavigate` vs `<Navigate replace>` ([tema 13](../../clase/13-router-rutas.md), [tema 14](../../clase/14-useparams-usenavigate.md)); Context de juego ([tema 16](../../clase/16-context.md)).
