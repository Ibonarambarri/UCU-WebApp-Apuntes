# Tema 10 — `useEffect`: hacer cosas "fuera" de React

## 10.1 Para qué existe

Un componente **recibe datos y devuelve JSX**. Pero a veces hay que hacer algo **que no es dibujar**
(un **efecto**):
- **pedir datos a la API** (95 % de los parciales);
- `document.title`, `setInterval`, `localStorage`.

**No puede ir suelto en el cuerpo**: el cuerpo corre en **cada** render → fetch → setState →
re-render → fetch… ♾️

`useEffect` = *"ejecutá esto **después** de dibujar, y **solo cuando** cambie lo que te indico"*.

## 10.2 Forma y orden en el tiempo

```jsx
import { useEffect } from 'react';

useEffect(() => {
  // el efecto
}, [dependencias]);
```
```
1. React ejecuta el componente → JSX → se DIBUJA
2. DESPUÉS ejecuta el efecto
3. Si el efecto hace setAlgo → re-render → paso 1
4. En el nuevo render mira las dependencias: ¿cambió alguna? → efecto de nuevo; si no → nada
```
Por eso la 1ª vez siempre se ve el estado inicial (`data = null` → "Cargando…").

## 10.3 El array de dependencias

```jsx
useEffect(() => { … }, []);        // SOLO la primera vez (al montar)
useEffect(() => { … }, [code]);    // la 1ª vez Y cada vez que code cambie
useEffect(() => { … });            // después de CADA render (casi nunca lo querés)
```
**Regla:** va **todo lo que el efecto usa y puede cambiar** (props, estado, variables).
Lint: *"React Hook useEffect has a missing dependency"* → **no ignorarlo**, casi siempre es un bug.

## 10.4 Pedir datos

```jsx
const [data, setData] = useState(null);

useEffect(() => {
  (async () => {
    const json = await fetchJSON('/api/countries');
    setData(json);
  })();
}, []);
```
⚠️ La función del efecto **no puede ser `async`** (`useEffect(async () => …)` → error: React
espera que devuelva nada o una limpieza, no una promesa). Se define una async **adentro** y se llama:
```jsx
useEffect(() => {
  async function cargar() {
    setData(await fetchJSON('/api/countries'));
  }
  cargar();
}, []);
```

## 10.5 ⭐ Trampa del detalle: mismo componente, otro parámetro

```jsx
const { code } = useParams();
useEffect(() => {
  fetchJSON(`/api/countries/${code}`).then(setCountry);
}, []);            // ❌ clic en un limítrofe → URL dice ARG, pantalla sigue en URY
}, [code]);        // ✅
```
De `/countries/URY` a `/countries/ARG` React **no desmonta** el componente: solo cambia `code`.
**Si el efecto usa un parámetro de la URL, ese parámetro va en las dependencias.**
Mismo caso con una **prop**: `ListaDePaises` reutilizable de `/currencies/EUR` → `/currencies/USD`
necesita `[props.url]`; el formulario de Trello `/tasks/1/edit` → `/tasks/2/edit`, `[id]`.

## 10.6 Limpieza (cleanup)

El efecto puede **devolver una función**: React la corre **antes del próximo efecto** y **al desmontar**.

**a) Temporizadores** (`Ejers/UT4/TA11-temporizador`):
```jsx
useEffect(() => {
  const id = setInterval(() => setSegundos((s) => s + 1), 1000);  // forma funcional (tema 7.4)
  return () => clearInterval(id);
}, []);
```
Con `setSegundos(segundos + 1)` quedaría clavado en 1 (la "foto" del primer render).
Sin el `clearInterval`, al desmontar y volver a montar quedan **dos** intervalos y cuenta de a 2.

**b) Respuestas viejas que llegan tarde** (`useFetchJSON.js` del matutino):
```jsx
useEffect(() => {
  let ignore = false;
  (async () => {
    const json = await fetchJSON(url);
    if (!ignore) setData(json);
  })();
  return () => { ignore = true; };
}, [url]);
```
Clic en ARG y enseguida BRA: si ARG responde tarde, no pisa a BRA. Es un plus, no suele ser obligatorio.

## 10.7 Bucle infinito

```jsx
useEffect(() => { setCount(count + 1); }, [count]);   // ♾️
```
Otras causas: efecto **sin array** con un setState; dependencia que es un **objeto/array creado en
el render** (es "nuevo" cada vez). Síntomas: pestaña colgada, miles de pedidos en Network,
*"Maximum update depth exceeded"*.

## 10.8 "Mi efecto corre dos veces" (StrictMode)

Con `<React.StrictMode>` en `main.jsx`, **en desarrollo** React monta-desmonta-monta para detectar
efectos sin limpieza → dos pedidos iguales. Normal; en producción no pasa. La plantilla 2026 no lo usa.

## 10.9 Cuándo NO usar `useEffect`

| Quiero… | ¿`useEffect`? |
|---|---|
| Pedir datos al entrar a la página | ✅ |
| Volver a pedir cuando cambia `:code` | ✅ con `[code]` |
| Filtrar la lista según el buscador | ❌ `const` en el render (tema 9) |
| Guardar en la API cuando el usuario hace clic | ❌ en el **handler** (`onClick`/`onSubmit`) |
| Timer / `document.title` / `localStorage` | ✅ |

**Si algo pasa porque el usuario hizo algo → va en el manejador del evento, no en un efecto.**

## 10.10 Patrones cortos que salieron

**a) `document.title`** (TA09): la dependencia es el valor que se muestra.
```jsx
useEffect(() => { document.title = `Contador: ${contador}`; }, [contador]);
```
Con `[]` la pestaña queda en "Contador: 0" para siempre.

**b) Efectos que dependen de filtros** (`2025sem2-parcial2-matutino`, 3 `<select>`): dos efectos separados.
```jsx
useEffect(() => { /* cargar monedas, lenguajes y zonas para los <select> */ }, []);   // una vez
useEffect(() => { /* pedir la lista con ?currency=…&language=… */ }, [moneda, lenguaje, zona]);
```
El `onChange` del select **solo hace `setMoneda`**: el efecto reacciona solo. No llames al fetch desde el `onChange`.

**c) "Estado gatillo"** (trivia `2025sem2-simulacro-matutino`): un número que solo existe para
estar en las dependencias y "rearmar" algo sin recargar.
```jsx
const [numeroDeRonda, setNumeroDeRonda] = useState(1);
useEffect(() => { /* elegir país al azar y opciones */ }, [numeroDeRonda]);
// botón "Otro desafío":
setNumeroDeRonda(numeroDeRonda + 1);
```
⚠️ Nunca `window.location.reload()`: recarga toda la app y se pierden el estado y el Context.
(La plantilla 2026sem2 hace lo mismo con `reloadIndex` para su `refetch`.)

**d) `localStorage`** (dark mode, UT5.1.2): leer **una vez** al arrancar y guardar **cada vez que cambia**.
```jsx
function obtenerModoInicial() {
  return localStorage.getItem('modo') === 'dark' ? 'dark' : 'light';   // null la 1ª vez
}
const [modo, setModo] = useState(obtenerModoInicial);                  // tema 7.9
useEffect(() => { localStorage.setItem('modo', modo); }, [modo]);
```
Solo guarda **strings**: arrays/objetos con `JSON.stringify` al guardar y `JSON.parse` al leer
(`JSON.parse(null)` da `null` → chequear antes).

## 10.11 El ciclo completo de una página con datos

```
1. Render inicial   → isLoading/data=null → "Cargando…"
2. Corre el efecto  → fetch(...)
3. Llega respuesta  → setData(...) + setIsLoading(false)
4. Re-render        → la lista
5. Cambia una dep.  → limpieza del efecto anterior → vuelve a 2
6. Se desmonta      → corre la limpieza (clearInterval, ignore = true)
```

📂 **Verlo funcionando:** `Ejers/UT4/TA11-temporizador/src/componentes/Temporizador.jsx` ·
`parciales/simulacro-prueba2-2026sem2-matutino/web/src/hooks/useFetchJSON.js` ·
`parciales/2025sem2-simulacro-matutino/web/src/components/Home.jsx` (estado gatillo)

---

## ❓ Repaso

**Pregunta:** ¿qué 2 errores tiene?
```jsx
function PagePlayer() {
  const { id } = useParams();
  const [matches, setMatches] = useState(null);
  useEffect(async () => {
    const json = await fetchJSON(`/api/players/${id}/matches`);
    setMatches(json);
  });
}
```

**Respuesta:**
1. **Sin array de dependencias → bucle infinito** (efecto → setMatches → render → efecto…).
   Y la dependencia correcta es **`[id]`** (no `[]`), para que cambie al navegar entre jugadores.
2. **`async` directo en el efecto** → devuelve una promesa → error. La async va adentro.

```jsx
useEffect(() => {
  let ignore = false;
  (async () => {
    const json = await fetchJSON(`/api/players/${id}/matches`);
    if (!ignore) setMatches(json);
  })();
  return () => { ignore = true; };
}, [id]);
```
