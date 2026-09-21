# Apuntes: Simulacro parcial 2 (2025 sem 2, vespertino) — "Flag Trivia" (viaje por fronteras)

## 1. Resumen del enunciado

- En `/` hay 3 botones de dificultad: Fácil (8 errores), Medio (5), Difícil (3). Al presionar uno se guarda el contador de errores, se vacía la lista de visitados y se **redirige** a `/:cca3` de un país al azar.
- En `/:cca3` se muestra nombre + bandera del país actual y **9 botones** con banderas: algunos son **fronterizos** (`borders`) y el resto países al azar, mezclados. Debajo, botón **"Ninguno"** y un texto con países visitados y errores restantes.
- Regla: es correcto presionar un fronterizo **no visitado**; cualquier otra cosa es un error. Siempre se navega al país elegido. "Ninguno" es correcto solo si ninguna de las 9 opciones era un fronterizo no visitado; luego se navega a un país no visitado al azar.
- Si se comete el último error permitido → `/end`, que lista los países visitados y tiene un botón para volver al inicio.
- API: `GET /api/countries` → array de cca3; `GET /api/countries/URY` → objeto con `borders: ["ARG","BRA"]`, `flag.svg: "/flags/URY.svg"`. 86 países tienen `borders` vacío (islas).

| Ruta | Componente | Qué muestra |
|------|------------|-------------|
| `/` | `Home.jsx` | 3 botones de dificultad; inicializa el Context y navega |
| `/:cca3` | `PaginaPais.jsx` | País actual, 9 banderas, "Ninguno", visitados y errores |
| `/end` | `PaginaFinal.jsx` | Lista de visitados + "Volver al inicio" |

## 2. Cómo correrlo

```bash
cd web
npm install        # instala react, react-router-dom, vite y lowdb (lo usa el mock)
npm start          # = vite. Abrir http://localhost:5173
```

Si `npm install` avisa de `allow-scripts` para esbuild: `npm approve-scripts esbuild --yes && npm rebuild esbuild`.

## 3. Estructura de archivos creados

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

## 4. Dónde estaba lo difícil

### a) Estado compartido entre 3 rutas → Context
`erroresRestantes`, `paisesVisitados` y `dificultad` los escribe `Home`, los usa `PaginaPais` y los muestra `PaginaFinal`. Cada cambio de ruta **desmonta** el componente anterior y destruye su `useState`. Por eso viven en `ContextoJuego`, cuyo `Provider` está en `App` por encima del `BrowserRouter` (nunca se desmonta). Los componentes lo leen con `useContext(ContextoJuego)`.

### b) LA trampa: `useEffect` con dependencia `[cca3]`
De `/URY` a `/ARG` es la **misma ruta** `/:cca3` con otro parámetro. React Router **no desmonta** `PaginaPais`: reutiliza la instancia y solo cambia lo que devuelve `useParams()`. Con `useEffect(..., [])` el fetch se haría una sola vez y la página quedaría clavada en el primer país. Con `[cca3]` el efecto se vuelve a ejecutar en cada país.

### c) Redirecciones: `useNavigate` vs `<Navigate>`
- Desde código (en un handler, después de un `await`): `const navegar = useNavigate(); navegar('/' + cca3);`
- Desde el JSX (render condicional): `if (contexto.dificultad === '') return <Navigate to="/" replace />;` — cubre el caso "recargó la página en `/URY`" (el Context vuelve a su valor inicial). Los hooks van todos **antes** de ese `return`.

### d) `setEstado` es asíncrono → no leer el valor recién seteado
Al descontar un error necesito saber si quedó en 0 **en el mismo click**. `contexto.erroresRestantes` todavía tiene el valor viejo después de `setErroresRestantes`. Solución: `descontarError()` calcula `erroresRestantes - 1`, lo setea y **lo devuelve**; el handler usa el valor devuelto para decidir `/end`.

### e) Orden de los `setEstado` del Context: forma funcional
`Home` hace `setPaisesVisitados([])` y navega; `PaginaPais` monta y llama `agregarPaisVisitado(cca3)`. Para que el agregado se aplique **sobre** el array ya vaciado se usa `setPaisesVisitados((anterior) => [...anterior, cca3])`. Nunca `push` sobre el estado (mutación → React no se entera).

### f) Armar las 9 opciones
1. `cantidadDeFronterizos = Math.floor(Math.random() * (Math.min(borders.length, 9) + 1))` (puede ser 0 → "Ninguno" es la respuesta).
2. `mezclarArray(borders).slice(0, cantidad)` para elegir cuáles.
3. Relleno con `elegirVariosDistintos(codigos, 9 - cantidad, [cca3, ...borders])`: se excluyen todos los fronterizos para que el relleno no sea correcto "de casualidad".
4. `mezclarArray` del total. La imagen es `/flags/CCA3.svg` directo (lo garantiza el enunciado), no hace falta pedir cada país.

### g) Lógica de "Ninguno"
Recorrer las opciones con un `for` y preguntar `borders.includes(codigo) && !visitados.includes(codigo)`; si alguna cumple, "Ninguno" es error. El destino es `elegirAlAzar(codigos.filter(no visitado))`. La respuesta correcta se decide **con datos** (`borders` y `visitados`), no con "cuántos fronterizos puse".

### h) Islas
86 países tienen `borders: []`. Ahí las 9 opciones son relleno y la única jugada correcta es "Ninguno". Por eso el código nunca asume que hay fronterizos.

### i) Orden de rutas
`/end` y `/:cca3` conviven: React Router 6 elige la más específica (`/end`) aunque el orden no importe. Igual conviene poner `/end` antes para que sea evidente.

## 5. Lo más importante para repetir en el parcial

```jsx
// Context con estado + funciones (crear, proveer, consumir)
export const ContextoJuego = createContext(null);
export function ProveedorJuego(props) {
  const [erroresRestantes, setErroresRestantes] = useState(0);
  const [paisesVisitados, setPaisesVisitados] = useState([]);
  function agregarPaisVisitado(cca3) {
    setPaisesVisitados((anterior) => anterior.includes(cca3) ? anterior : [...anterior, cca3]);
  }
  function descontarError() { const quedan = erroresRestantes - 1; setErroresRestantes(quedan); return quedan; }
  return <ContextoJuego.Provider value={{ erroresRestantes, paisesVisitados, agregarPaisVisitado, descontarError }}>{props.children}</ContextoJuego.Provider>;
}
// App: <ProveedorJuego><BrowserRouter><Routes>...</Routes></BrowserRouter></ProveedorJuego>
// Componente: const contexto = useContext(ContextoJuego);
```

```jsx
// useEffect que depende del parámetro de la URL
const parametros = useParams();
const cca3 = parametros.cca3;
useEffect(() => {
  async function cargar() { try { ... } catch (error) { ... } finally { ... } }
  cargar();
}, [cca3]);   // ← sin esto, al navegar de /URY a /ARG no se recarga nada
```

```jsx
// Redirigir desde código y desde el JSX
const navegar = useNavigate();
navegar('/' + codigoElegido);              // en un handler
if (contexto.dificultad === '') { return <Navigate to="/" replace />; }   // en el render
```

```jsx
// Decidir el fin del juego en el mismo click
const erroresQueQuedan = contexto.descontarError();
if (erroresQueQuedan <= 0) { navegar('/end'); } else { navegar(rutaDestino); }
```

```js
// Elegir N distintos excluyendo algunos
function elegirVariosDistintos(lista, cantidad, excluidos) {
  const elegidos = [];
  while (elegidos.length < cantidad) {
    const candidato = lista[Math.floor(Math.random() * lista.length)];
    if (!excluidos.includes(candidato) && !elegidos.includes(candidato)) { elegidos.push(candidato); }
  }
  return elegidos;
}
```

```jsx
// Lista con .map y key única
{contexto.paisesVisitados.map((cca3) => <li key={cca3}>{cca3}</li>)}
```

## 6. Plan de ataque (2 horas)

1. **0–10 min**: `npm install`, `npm start`, mirar `mock-routes.js` y `/api/countries/URY` (forma de `borders` y `flag`).
2. **10–20 min**: `services/api.js` y `utils/azar.js` (elegirAlAzar, mezclarArray, elegirVariosDistintos).
3. **20–35 min**: `ContextoJuego.jsx` con los 3 estados y las 3 funciones; `App.jsx` con Provider + 3 rutas; `Home.jsx` con los 3 botones que hacen `iniciarJuego` + `navegar`.
4. **35–75 min**: `PaginaPais.jsx`: `useParams`, `useEffect [cca3]`, cargar país y armar 9 opciones, render con título/bandera/9 botones/"Ninguno"/textos. Probar que al hacer click cambia la URL **y** el país (dependencia `[cca3]`).
5. **75–95 min**: reglas: `esFronterizoNoVisitado`, `resolverJugada` (descontar error y `/end`), lógica de "Ninguno" con destino no visitado. `<Navigate>` si no hay dificultad.
6. **95–110 min**: `PaginaFinal.jsx` (lista + volver), CSS grilla 3x3.
7. **110–120 min**: casos borde (islas sin fronteras, cca3 inválido, recargar en `/URY`), comentarios y README.
