# 04 — Context API a fondo

> Todo lo que se usó de `createContext` / `Provider` / `useContext` en los ejercicios
> (TA12-TA15, TA18, UT5.1.2) y en los parciales (Trello ej. 6, BarApp punto 5,
> las dos trivias). En **todos** los parciales de 2026 hay un ejercicio de Context.

---

## 0. Mapa mental en 30 segundos

```
src/contextos/ContextoX.jsx           ← 1) createContext + 2) componente Proveedor con useState
        │
main.jsx / App.jsx                    ← 3) <ProveedorX> envuelve a la app (arriba del router)
        │
cualquier componente, a cualquier profundidad
        └── const contexto = useContext(ContextoX);   ← 4) leer / llamar funciones
```

Tres pasos de código, siempre iguales:

```jsx
// 1) crear
const ContextoTema = createContext(null);
// 2) proveer
<ContextoTema.Provider value={{ modo: modo, setModo: setModo }}>{props.children}</ContextoTema.Provider>
// 3) consumir
const contexto = useContext(ContextoTema);   contexto.modo   contexto.setModo('dark')
```

---

## 1. Qué problema resuelve

### a) Prop drilling (pasar props por componentes que no las usan)

Sin contexto: `App` tiene `nombreUsuario` → se lo pasa a `Panel` (que no lo usa) → que se lo
pasa a `SaludoUsuario`. Con contexto, `SaludoUsuario` lo lee directo.
Ver `Ejers/UT4/TA12-contexto-usuario/src/componentes/Panel.jsx` y `SaludoUsuario.jsx`:
Panel no recibe ninguna prop.

### b) Estado que se pierde al cambiar de ruta

Cuando el router cambia de `/` a `/country/URY`, **desmonta** `Home`. Todo su `useState`
se destruye. Al volver a `/`, se monta un `Home` nuevo con el puntaje en 0.

El Provider está en `App`, **por encima del `BrowserRouter`**, así que nunca se desmonta y
el estado sobrevive. Es el motivo por el que el puntaje de la trivia y los "países visitados"
del viaje viven en un Context. Ver la cabecera de
`parciales/2025sem2-simulacro-matutino/web/src/context/ContextoPuntaje.jsx`.

### c) Una sola fuente de verdad

En el Trello, `Navbar` (barra de progreso), `AssigneesChart` y `BoardPage` necesitan **la
misma** lista de tareas. Si cada uno hiciera su propio `fetch` tendrían copias distintas y al
crear una tarea el progreso no cambiaría. Con el contexto hay una lista y todos la ven.
Ver `parciales/2026sem1-prueba2-vespertino/src/context/TasksContext.jsx`.

---

## 2. Paso 1: `createContext` en su propio archivo

```jsx
// src/contextos/ContextoUsuario.jsx  (Ejers/UT4/TA13-contexto-actualizar)
import { createContext } from 'react';

// El argumento es el VALOR POR DEFECTO: solo se usa si alguien hace useContext
// SIN estar dentro del Provider. Le damos la MISMA FORMA que el value real para
// que, si pasa, no explote al hacer contexto.nombre.
const ContextoUsuario = createContext({
  nombre: '',
  setNombre: function () {},
});

export default ContextoUsuario;
```

Va en **su propio archivo** para que el Provider y los consumidores importen **el mismo
objeto**. Si se crea dentro de `App.jsx` y se exporta desde ahí funciona, pero se mezcla y
Vite se queja (ver sección 10).

Dos estilos de export que aparecen en las soluciones (los dos valen):

| Estilo | Archivo | Import |
|---|---|---|
| `export default ContextoTema` (solo el contexto; el Provider está en App) | `Ejers/UT4/TA14-contexto-tema/src/contextos/ContextoTema.jsx` | `import ContextoTema from '../contextos/ContextoTema.jsx'` |
| `export { ContextoTema, ProveedorTema }` (contexto + componente proveedor) | `Ejers/UT5/UT5.1.2-paises-dark-mode/src/contextos/ContextoTema.jsx` | `import { ContextoTema, ProveedorTema } from '...'` |
| `export const TasksContext = ...; export function TasksProvider(props)` | `parciales/2026sem1-prueba2-vespertino/src/context/TasksContext.jsx` | `import { TasksContext, TasksProvider } from '...'` |

---

## 3. Paso 2: el Provider

### Forma simple: el estado vive en `App` y App pone el Provider (TA12-TA15, TA18)

```jsx
// Ejers/UT4/TA13-contexto-actualizar/src/App.jsx
function App() {
  const [nombre, setNombre] = useState('');

  // El value es un OBJETO con el estado Y la función para cambiarlo.
  const valorDelContexto = {
    nombre: nombre,
    setNombre: setNombre,
  };

  return (
    <ContextoUsuario.Provider value={valorDelContexto}>
      <Cabecera />
      <Formulario />
    </ContextoUsuario.Provider>
  );
}
```

### ✅ Forma recomendada para el parcial: componente `Proveedor` con `props.children`

El estado y las funciones viven en un componente propio, y el archivo del contexto queda
autocontenido. Es lo que se hizo en UT5.1.2, las dos trivias, Trello y BarApp.

```jsx
// ✅ PROVIDER PARA COPIAR EN EL PARCIAL (≈25 líneas)
// src/context/TasksContext.jsx — parciales/2026sem1-prueba2-vespertino
import { createContext, useState } from 'react';

// 1) El contexto, con valor por defecto de la misma forma que el value.
export const TasksContext = createContext({
  tasks: [],
  setTasks: function () {},
});

// 2) El Provider: componente normal que envuelve a la app.
//    Todo lo que esté adentro (props.children) puede hacer useContext(TasksContext).
export function TasksProvider(props) {
  // Estado global: la lista. Empieza vacía; una página la llena con fetch.
  const [tasks, setTasks] = useState([]);

  // Objeto que reciben todos los consumidores.
  const valorDelContexto = {
    tasks: tasks,
    setTasks: setTasks,
  };

  return (
    <TasksContext.Provider value={valorDelContexto}>
      {props.children}
    </TasksContext.Provider>
  );
}
```

`props.children` = todo lo que se escribió entre `<TasksProvider>` y `</TasksProvider>`.
Sin esa línea, el Provider no dibuja nada y la app queda en blanco.

### Variante con funciones en vez de `setEstado` (trivia)

En vez de exponer `setPuntaje`, se exponen funciones con nombre que describen la acción.
Más claro y evita que un componente ponga cualquier cosa:

```jsx
// parciales/2025sem2-simulacro-matutino/web/src/context/ContextoPuntaje.jsx
export function ProveedorPuntaje(props) {
  const [puntaje, setPuntaje] = useState(0);

  function sumarPunto() { setPuntaje(puntaje + 1); }
  function restarPunto() { setPuntaje(puntaje - 1); }

  const valorDelContexto = { puntaje: puntaje, sumarPunto: sumarPunto, restarPunto: restarPunto };

  return <ContextoPuntaje.Provider value={valorDelContexto}>{props.children}</ContextoPuntaje.Provider>;
}
```

⚠️ **Trampa `setEstado` asíncrono:** en el viaje por fronteras, después de descontar un error
hay que saber **en el mismo click** si quedó en 0 para ir a `/end`. Como `setEstado` no cambia
la variable en el momento, la función calcula el valor en una variable, lo setea y lo **devuelve**:

```jsx
// parciales/2025sem2-simulacro-vespertino/web/src/context/ContextoJuego.jsx
function descontarError() {
  const erroresQueQuedan = erroresRestantes - 1;
  setErroresRestantes(erroresQueQuedan);
  return erroresQueQuedan;          // quien llama decide: if (quedan === 0) navegar('/end')
}

function agregarPaisVisitado(cca3) {
  // Forma funcional: partimos SIEMPRE del último valor, nunca hacemos push.
  setPaisesVisitados((visitadosAnteriores) => {
    if (visitadosAnteriores.includes(cca3)) {
      return visitadosAnteriores;
    }
    return [...visitadosAnteriores, cca3];
  });
}
```

### ✅ Variante "Provider autosuficiente": carga sus datos con fetch (BarApp punto 5)

Cuando el dato global se ve en **todas** las rutas (NavBar con la recaudación), el Provider
hace su propio `fetch` al montar y expone una función `recargar()`:

```jsx
// parciales/2026sem1-simulacro-vespertino/src/context/RecaudacionContext.jsx
import { createContext, useState, useEffect } from 'react';
import { cuentasApi, productosApi } from '../api/client.js';
import { totalRecaudado } from '../utils/cuentas.js';

export const RecaudacionContext = createContext({
  total: 0,
  recargar: function () {},
});

export function RecaudacionProvider(props) {
  const [total, setTotal] = useState(0);

  // Pide cuentas y productos y recalcula. async + try/catch: si la API está caída, total = 0.
  async function recargar() {
    try {
      const cuentas = await cuentasApi.listar();
      const productos = await productosApi.listar();
      setTotal(totalRecaudado(cuentas, productos));
    } catch (errorCapturado) {
      console.error('No se pudo calcular la recaudación:', errorCapturado);
      setTotal(0);
    }
  }

  // [] = una sola vez al cargar la app. Después, quien cree algo llama recargar() a mano.
  useEffect(() => {
    recargar();
  }, []);

  const valorDelContexto = { total: total, recargar: recargar };

  return (
    <RecaudacionContext.Provider value={valorDelContexto}>
      {props.children}
    </RecaudacionContext.Provider>
  );
}
```

Y en el formulario: `await cuentasApi.crear(...)` → `await recargar()` → `navigate('/cuentas')`.
Por qué así y no pasarle los datos desde `CuentasPage`: si el usuario entra directo a
`/productos`, `CuentasPage` nunca se montó y la NavBar mostraría $0.

**Alternativa Trello:** el Provider solo guarda `tasks/setTasks`; `BoardPage` hace el
`getTasks()` en su `useEffect` y llama `setTasks` del contexto. Las dos formas sirven; la
autosuficiente es mejor cuando el dato se muestra en la barra.

### Variante con `localStorage` (dark mode, UT5.1.2)

```jsx
// Ejers/UT5/UT5.1.2-paises-dark-mode/src/contextos/ContextoTema.jsx
function ProveedorTema(props) {
  // Función que decide el modo inicial. Se la pasamos a useState (sin paréntesis)
  // para que se ejecute UNA vez, no en cada render.
  function obtenerModoInicial() {
    const modoGuardado = localStorage.getItem('modo');   // null si nunca se guardó
    if (modoGuardado === 'dark') {
      return 'dark';
    }
    return 'light';
  }

  const [modo, setModo] = useState(obtenerModoInicial);

  // Cada vez que cambia el modo, lo guardamos. Al recargar, obtenerModoInicial lo recupera.
  useEffect(function () {
    localStorage.setItem('modo', modo);
  }, [modo]);

  const valorDelContexto = { modo: modo, setModo: setModo };

  return <ContextoTema.Provider value={valorDelContexto}>{props.children}</ContextoTema.Provider>;
}
```

`localStorage` solo guarda **strings**; para objetos/arrays `JSON.stringify` al guardar y
`JSON.parse` al leer.

---

## 4. Paso 3: consumir con `useContext`

```jsx
import { useContext } from 'react';
import { ContextoTema } from '../contextos/ContextoTema.jsx';

function SelectorDeModo() {
  // Devuelve el "value" del Provider más cercano hacia arriba.
  const contexto = useContext(ContextoTema);
  const modo = contexto.modo;
  const setModo = contexto.setModo;

  function manejarCambioDeModo(evento) {
    setModo(evento.target.value);       // cambia el estado del Provider -> se re-renderiza toda la app
  }

  return (
    <select value={modo} onChange={manejarCambioDeModo}>
      <option value="light">Claro</option>
      <option value="dark">Oscuro</option>
    </select>
  );
}
```

Ver `Ejers/UT5/UT5.1.2-paises-dark-mode/src/componentes/SelectorDeModo.jsx`.

- Es un **hook**: va arriba del componente, nunca dentro de `if`, bucles ni handlers.
- Se puede llamar **varias veces** en el mismo componente para contextos distintos
  (`Ejers/UT4/TA15-dos-contextos/src/componentes/Controles.jsx`).
- Cuando el `value` cambia, **todos** los componentes que hicieron `useContext` se
  re-renderizan, estén donde estén en el árbol.

---

## 5. Dónde poner el Provider (la trampa más común)

**Regla: un componente NO puede consumir un contexto que él mismo renderiza.** Si `App`
hace `useContext(X)`, el `<ProveedorX>` tiene que envolver a `<App />` desde **`main.jsx`**.

| Situación | Dónde va el Provider | Ejemplo |
|---|---|---|
| Solo lo consumen hijos de App (App no lo usa) | Dentro del `return` de App | `Ejers/UT4/TA13-contexto-actualizar/src/App.jsx` |
| App también lo usa (elige la clase CSS, define `handleSave`) | En `main.jsx`, envolviendo `<App />` | `Ejers/UT5/UT5.1.2-paises-dark-mode/src/main.jsx`, `parciales/2026sem1-prueba2-vespertino/src/main.jsx` |
| Lo usan varias rutas (estado que sobrevive a la navegación) | Por **fuera** del `BrowserRouter` (o dentro, pero fuera de `Routes`) | `parciales/2025sem2-simulacro-vespertino/web/src/components/App.jsx` |
| Lo usa la Navbar y el guardia de rutas | Por fuera del `BrowserRouter` | `Ejers/UT4/TA18-rutas-protegidas/src/App.jsx` |

```jsx
// main.jsx (Trello) — el Provider AFUERA de App porque App hace useContext
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <TasksProvider>
      <App />
    </TasksProvider>
  </React.StrictMode>
);
```

```jsx
// main.jsx (BarApp) — BrowserRouter afuera, Provider adentro, App adentro de los dos
<BrowserRouter>
  <RecaudacionProvider>
    <App />
  </RecaudacionProvider>
</BrowserRouter>
```

¿Provider dentro o fuera del `BrowserRouter`? **Da igual** mientras esté por encima de
`<Routes>`; ninguno de los dos se desmonta. Si el Provider necesita `useNavigate`, tiene que
ir **dentro** del router.

⚠️ Síntoma de Provider mal ubicado: `useContext` devuelve el valor por defecto
(`null` o `{ tasks: [] }`) y nada cambia al llamar `setX`. Si el default era `null`, explota
con `Cannot read properties of null (reading 'modo')`.

---

## 6. Varios contextos (TA15)

Providers anidados. El orden **no importa** porque cada `useContext(X)` busca solo el
Provider de `X`:

```jsx
// Ejers/UT4/TA15-dos-contextos/src/App.jsx
<ContextoTema.Provider value={valorTema}>
  <ContextoIdioma.Provider value={valorIdioma}>
    <Titulo />
    <Controles />       {/* hace useContext de los dos */}
    <MostrarTema />
    <MostrarIdioma />
  </ContextoIdioma.Provider>
</ContextoTema.Provider>
```

Cada contexto en su archivo: `src/contextos/ContextoTema.jsx`, `src/contextos/ContextoIdioma.jsx`.

---

## 7. Contexto de tema + clases CSS (TA14, UT5.1.2)

El contexto guarda `'light' | 'dark'`; el componente raíz elige una clase con `if` y el CSS
cuelga de ella:

```jsx
// Ejers/UT5/UT5.1.2-paises-dark-mode/src/App.jsx
const contexto = useContext(ContextoTema);
let claseDelModo = 'modo-light';
if (contexto.modo === 'dark') {
  claseDelModo = 'modo-dark';
}
return <div className={'aplicacion ' + claseDelModo}>...</div>;
```

```css
.modo-light { background: #f5f5f5; color: #222; }
.modo-dark  { background: #121212; color: #eee; }
.modo-dark .tarjeta { background: #222; }   /* selector descendiente: cambia todo lo de adentro */
```

En TA14 el consumidor es una tarjeta que elige su propia clase
(`Ejers/UT4/TA14-contexto-tema/src/componentes/TarjetaConTema.jsx`) y un botón que llama
`setTema` (`BotonCambiarTema.jsx`). Más sobre CSS en `06-CSS-EN-REACT.md`.

---

## 8. Contexto de autenticación + rutas protegidas (TA18)

`value = { estaLogueado, nombreUsuario, iniciarSesion, cerrarSesion }`.
Lo consumen la barra (muestra Login o Logout), la página Login y `RutaProtegida`.
Código completo en `03-REACT-ROUTER.md` sección 11 y en
`Ejers/UT4/TA18-rutas-protegidas/src/contextos/ContextoAutenticacion.jsx`.

---

## 9. Qué contexto se usó en cada ejercicio/parcial

| Dónde | Contexto | `value` | Provider en | Por qué |
|---|---|---|---|---|
| TA12 | `ContextoUsuario` | `nombreUsuario` (string) | App | solo lectura, sin props |
| TA13 | `ContextoUsuario` | `{ nombre, setNombre }` | App | escribir desde cualquier hijo |
| TA14 | `ContextoTema` | `{ tema, setTema }` | App | clases CSS según tema |
| TA15 | `ContextoTema` + `ContextoIdioma` | dos objetos | App, anidados | dos contextos |
| TA18 | `ContextoAutenticacion` | `{ estaLogueado, nombreUsuario, iniciarSesion, cerrarSesion }` | App, fuera del router | rutas protegidas |
| UT5.1.2 | `ContextoTema` + `ProveedorTema` | `{ modo, setModo }` + localStorage | main.jsx | App elige la clase |
| Trivia mat. | `ContextoPuntaje` / `ProveedorPuntaje` | `{ puntaje, sumarPunto, restarPunto }` | App, fuera del router | sobrevive a `/country/:cca3` |
| Viaje vesp. | `ContextoJuego` / `ProveedorJuego` | `{ dificultad, erroresRestantes, paisesVisitados, iniciarJuego, agregarPaisVisitado, descontarError }` | App, fuera del router | 3 rutas comparten el juego |
| Trello 2026 (ej. 6) | `TasksContext` / `TasksProvider` | `{ tasks, setTasks }` | main.jsx | ProgressBar, AssigneesChart, App y BoardPage ven la misma lista |
| BarApp 2026 (pto 5) | `RecaudacionContext` / `RecaudacionProvider` | `{ total, recargar }` con fetch propio | main.jsx (dentro del router) | NavBar muestra el total en todas las rutas |

---

## 10. Detalles que salen en la práctica

- **`value` siempre como objeto** (aunque hoy tengas un solo dato): mañana agregás una función
  sin cambiar los consumidores. Excepción TA12 (solo lectura de un string) por simplicidad.
- **Warning de eslint `react-refresh/only-export-components`**: aparece cuando un archivo
  exporta un componente (el Provider) **y** algo que no lo es (el contexto). No rompe nada.
  Se apaga con `// eslint-disable-next-line react-refresh/only-export-components` arriba del
  `export const ContextoX` (ver `parciales/2025sem2-simulacro-vespertino/web/src/context/ContextoJuego.jsx`).
- **Provider + useEffect que carga datos**: se ejecuta una vez al cargar la app (dos en
  desarrollo por StrictMode; es normal).
- **Actualizar la lista global sin refetch** (Trello `handleSave` en `App.jsx`):
  crear → `setTasks([...tasks, savedTask])`; editar → `setTasks(tasks.map(t => t.id === savedTask.id ? savedTask : t))`;
  borrar → `setTasks(tasks.filter(t => t.id !== id))`.
- El contexto **no reemplaza a las props** para cosas locales (un `TaskCard` sigue recibiendo
  `task` por props). Contexto = lo global (lista compartida, tema, sesión, puntaje).

---

## 11. Plantilla mínima para escribir de memoria en el parcial

```jsx
// src/context/ContextoDatos.jsx
import { createContext, useState, useEffect } from 'react';
import { obtenerTodos } from '../services/api.js';

export const ContextoDatos = createContext({ datos: [], setDatos: function () {}, recargar: function () {} });

export function ProveedorDatos(props) {
  const [datos, setDatos] = useState([]);

  async function recargar() {
    try {
      const lista = await obtenerTodos();
      setDatos(lista);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    recargar();
  }, []);

  const valor = { datos: datos, setDatos: setDatos, recargar: recargar };

  return <ContextoDatos.Provider value={valor}>{props.children}</ContextoDatos.Provider>;
}
```

```jsx
// src/main.jsx
<ProveedorDatos>
  <App />
</ProveedorDatos>

// cualquier componente
const contexto = useContext(ContextoDatos);
contexto.datos.length      contexto.recargar()
```

---

## Checklist de repaso

1. ¿Cuáles son los 3 pasos del Context y en qué archivo va cada uno?
2. ¿Por qué el puntaje de la trivia no puede vivir en el `useState` de `Home`?
3. ¿Qué pasa si `App` hace `useContext(X)` y el Provider está dentro del `return` de `App`?
4. ¿Qué forma le doy al valor por defecto de `createContext` y por qué?
5. ¿Qué es `props.children` dentro del Provider y qué pasa si lo olvido?
6. ¿Cuándo conviene que el Provider haga su propio `fetch`? ¿Qué función expone?
7. ¿Cómo hago que después de un POST la NavBar muestre el total nuevo?
8. Necesito saber en el mismo click si los errores quedaron en 0. ¿Cómo lo resuelvo?
9. ¿Importa el orden al anidar dos Providers?
10. ¿Cómo persisto el modo oscuro entre recargas?
11. Escribí de memoria el `TasksProvider` (≈20 líneas).
