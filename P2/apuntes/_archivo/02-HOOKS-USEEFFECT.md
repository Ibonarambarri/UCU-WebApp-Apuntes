# 02 — Hooks: `useEffect` a fondo (y las reglas de todos los hooks)

> `useState` está en `01-REACT-BASICO.md` §5. `useContext` en `04-CONTEXT.md`.
> `useParams` / `useNavigate` en `03-REACT-ROUTER.md`. Acá: **`useEffect`**, que
> aparece en TODOS los parciales (cargar datos de la API al entrar a una
> página) y es donde más se falla.
> Rutas relativas a `P2/`.

---

## 1. Qué es un efecto y para qué sirve

Renderizar = devolver JSX. Todo lo que **no es dibujar JSX** pero tiene que
pasar "como consecuencia" de que el componente aparece o cambia, es un
**efecto secundario**:

| Efecto | Ejercicio / parcial |
|---|---|
| Pedir datos a una API con `fetch` | TA10, UT5, los 6 parciales |
| Cambiar `document.title` | TA09 |
| Arrancar un `setInterval` y pararlo al desmontar | TA11 |
| Guardar en `localStorage` | UT5.1.2 |
| Volver a pedir datos cuando cambia un parámetro de la URL o un filtro | UT5, parciales 2025 |
| Armar una ronda nueva de un juego | simulacro trivia |

Sintaxis:

```jsx
import { useState, useEffect } from 'react';

useEffect(function () {
  // 1) código del efecto: corre DESPUÉS de que React dibujó la pantalla
  ...
  // 2) (opcional) función de limpieza
  return function limpiar() { ... };
}, [dependencias]);   // 3) cuándo volver a correr
```

Se llama **después** del render (primero se ve la pantalla, después corre el
efecto). Por eso mientras el fetch está en el aire, la pantalla ya muestra
"Cargando...".

---

## 2. El array de dependencias: la tabla que hay que saberse

| Dependencias | Cuándo corre el efecto | Cuándo usarlo |
|---|---|---|
| `[]` (vacío) | **Una sola vez**, al montar | cargar datos iniciales, arrancar un intervalo |
| `[x]` / `[x, y]` | Al montar **y cada vez que `x` (o `y`) cambia** | `document.title` con `[contador]`; refetch con `[cca3]`, `[props.url]`, `[moneda, lenguaje, zona]`; `localStorage` con `[modo]` |
| *(sin array)* | Después de **cada render** | casi nunca. Con un fetch adentro → bucle infinito |

⚠️ **Trampa 1 — olvidar el `[]`**: el efecto hace `fetch` → `setUsuarios` →
re-render → el efecto corre de nuevo → `fetch` → ... infinito (se ve en la
pestaña Network como cientos de requests).

⚠️ **Trampa 2 — poner `[]` cuando dependía de algo**: el efecto corre una vez
con el valor inicial y **nunca se entera** de los cambios. Ejemplos reales:
- `document.title` con `[]` → la pestaña queda en "Contador: 0" para siempre (TA09).
- Detalle de país con `[]` → al ir de `/countries/UY` a `/countries/AR` sigue
  mostrando Uruguay (ver §7).

**Regla práctica**: todo valor de estado, prop o parámetro de URL que **se lee
dentro del efecto** va en el array. Las funciones setter (`setX`) no hace
falta ponerlas.

Ver: `Ejers/UT4/TA09-useeffect-titulo/src/componentes/Contador.jsx` (comentario
que compara las tres opciones).

---

## 3. ✅ Patrón para copiar: `document.title` (TA09)

```jsx
const [contador, setContador] = useState(0);

// Corre al montar (contador = 0 -> "Contador: 0") y cada vez que contador cambia.
useEffect(function actualizarTitulo() {
  document.title = 'Contador: ' + contador;
}, [contador]);
```

---

## 4. ✅ Patrón para copiar: `fetch` dentro de `useEffect` (el más importante)

```jsx
import { useState, useEffect } from 'react';

function ListaUsuarios() {
  // Los tres estados que SIEMPRE acompañan a un fetch.
  const [usuarios, setUsuarios] = useState([]);        // los datos
  const [estaCargando, setEstaCargando] = useState(true); // true porque carga al montar
  const [mensajeError, setMensajeError] = useState('');   // '' = sin error

  useEffect(function () {
    // El callback del useEffect NO puede ser async (ver §5).
    // Definimos una función async ADENTRO y la llamamos.
    async function cargarUsuarios() {
      try {
        const respuesta = await fetch('https://jsonplaceholder.typicode.com/users');

        // fetch NO lanza error con 404/500: hay que comprobarlo a mano.
        if (!respuesta.ok) {
          throw new Error('La API respondió con el código ' + respuesta.status);
        }

        const datos = await respuesta.json();
        setUsuarios(datos);
      } catch (error) {
        // Sin red, JSON roto, o el Error que lanzamos arriba.
        setMensajeError('No se pudieron cargar los usuarios: ' + error.message);
      } finally {
        // Pase lo que pase, terminamos de cargar.
        setEstaCargando(false);
      }
    }

    cargarUsuarios();
  }, []);   // [] = una sola vez, al montar

  if (estaCargando) {
    return <p>Cargando usuarios...</p>;
  }
  if (mensajeError !== '') {
    return <p className="error">{mensajeError}</p>;
  }
  return (
    <ul>
      {usuarios.map(function (usuario) {
        return <li key={usuario.id}>{usuario.name} - {usuario.email}</li>;
      })}
    </ul>
  );
}
```

Ver: `Ejers/UT4/TA10-fetch-usuarios/src/componentes/ListaUsuarios.jsx`.

Variante con el fetch en un archivo de **servicio** (lo que se hace en los
parciales): el componente llama `await getTasks()` y el servicio es el que
hace `fetch` + `respuesta.ok` (`05-FETCH-API-JSON-SERVER.md`).
Ver `parciales/2026sem1-prueba2-vespertino/src/pages/BoardPage/BoardPage.jsx`
y `Ejers/UT5/UT5.1.1-paises-router/src/servicios/api.js`.

### Cuándo `estaCargando` empieza en `true` y cuándo en `false`
- Si el componente carga datos **al montar** → `useState(true)` (si no, en el
  primer render vería lista vacía un instante).
- Si carga **por una acción** (submit, click) → `useState(false)` y se pone en
  `true` dentro del handler.
- En un efecto que se **repite** (cambia el parámetro/filtro), poner
  `setEstaCargando(true)` y `setMensajeError('')` **al principio** de la función
  async, para limpiar lo del país anterior.

---

## 5. ⚠️ El callback del `useEffect` NO puede ser `async`

```jsx
// ❌ MAL
useEffect(async function () {
  const respuesta = await fetch(url);
}, []);
```

Una función `async` **siempre devuelve una Promise**. React espera que el
callback devuelva `undefined` o una **función de limpieza**; al recibir una
Promise avisa (*"Warning: useEffect must not return anything besides a
function"* / errores tipo *"destroy is not a function"*). Solución: función
async **adentro** y llamarla en la línea siguiente (patrón de §4).

---

## 6. Función de limpieza: `setInterval` / `clearInterval` (TA11)

Si el efecto "deja algo corriendo" (un intervalo, un timeout, un listener),
hay que **pararlo cuando el componente se desmonta**. Para eso el efecto
devuelve una función.

```jsx
function Temporizador() {
  const [segundos, setSegundos] = useState(0);

  // [] : un solo intervalo, creado al montar.
  useEffect(function () {
    // setInterval ejecuta la función cada 1000 ms y devuelve un id numérico.
    const idIntervalo = setInterval(function () {
      // FORMA FUNCIONAL obligatoria (ver §6.1).
      setSegundos(function (valorAnterior) {
        return valorAnterior + 1;
      });
    }, 1000);

    // FUNCIÓN DE LIMPIEZA: React la llama al desmontar (y antes de volver a
    // correr el efecto si cambiaran las dependencias).
    return function limpiar() {
      clearInterval(idIntervalo);
    };
  }, []);

  return <p>{segundos} segundos</p>;
}
```

Sin la limpieza: el intervalo sigue vivo "en el aire" tras desmontar, intenta
hacer `setSegundos` de un componente que no existe, consume memoria; y si el
componente se vuelve a montar, hay **dos** intervalos y el contador sube de a 2.

Ver: `Ejers/UT4/TA11-temporizador/src/componentes/Temporizador.jsx` y
`src/App.jsx` (botón Montar/Desmontar para verlo en consola).

### 6.1 ⚠️ La "closure vieja": por qué `setSegundos(segundos + 1)` se clava en 1

La función que le pasás a `setInterval` se crea **en el primer render**, cuando
`segundos` valía `0`. Esa función "recuerda" ese `0` para siempre (eso es una
closure). Entonces cada segundo hace `0 + 1 = 1`, `0 + 1 = 1`, ... y el
contador queda en 1.

Con la forma funcional `setSegundos(function (valorAnterior) { return
valorAnterior + 1; })` React te pasa **siempre el valor más reciente**, sin
importar cuándo se creó la función. **Regla: dentro de un intervalo/timeout,
setter siempre en forma funcional.**

### 6.2 StrictMode: "mi efecto corre dos veces"

`main.jsx` envuelve la app en `<React.StrictMode>` (las plantillas de 2026 lo
traen). **Solo en desarrollo**, React monta → desmonta → vuelve a montar cada
componente para detectar limpiezas mal hechas. En consola se ve
"montado / desmontado / montado" y un fetch al montar se dispara dos veces.

- No es un bug tuyo. En `vite build` (producción) corre una sola vez.
- Si tu limpieza está bien, queda **un solo** intervalo. Si el temporizador
  sube de a 2, la limpieza falta.
- No hay que "arreglarlo" sacando StrictMode en el parcial.

---

## 7. Efectos que dependen de `useParams`: misma ruta, distinto parámetro

```jsx
function DetalleDePais() {
  const parametros = useParams();
  const cca2 = parametros.cca2;          // "/countries/:cca2"
  const [pais, setPais] = useState(null);
  const [estaCargando, setEstaCargando] = useState(true);
  const [mensajeError, setMensajeError] = useState('');

  // [cca2]: al montar Y cada vez que cambia el código de la URL.
  useEffect(function () {
    async function cargarPais() {
      setEstaCargando(true);     // reiniciamos por si venimos de otro país
      setMensajeError('');
      try {
        const paisDeLaApi = await obtenerPaisPorCodigo(cca2);
        setPais(paisDeLaApi);
      } catch (error) {
        setMensajeError(error.message);
      } finally {
        setEstaCargando(false);
      }
    }
    cargarPais();
  }, [cca2]);
  ...
}
```

⚠️ **Por qué no `[]`**: al navegar de `/countries/UY` a `/countries/AR`, React
Router **no desmonta** `DetalleDePais` (es la misma `<Route>`); solo cambia lo
que devuelve `useParams`. Con `[]` el efecto no vuelve a correr y la página
sigue mostrando Uruguay. Lo mismo pasa en:
- `/currencies/EUR` → `/currencies/USD` con un componente reutilizable →
  dependencia `[props.url]` (parcial vespertino 2025).
- `/URY` → `/ARG` en el juego de fronteras → dependencia `[cca3]` (hay un
  botón de bandera que navega a otro país en la **misma** ruta).
- `/tasks/1/edit` → `/tasks/2/edit` → dependencia `[id]` (Trello).

Ver: `Ejers/UT5/UT5.1.1-paises-router/src/paginas/DetalleDePais.jsx`,
`parciales/2025sem2-parcial2-vespertino/web/src/components/ListaDePaises.jsx`,
`parciales/2025sem2-simulacro-vespertino/web/src/components/PaginaPais.jsx`.

---

## 8. Efectos que dependen de filtros (parcial matutino 2025)

Dos efectos separados, cada uno con sus dependencias:

```jsx
// Efecto 1: opciones de los <select>. No cambian nunca -> [].
useEffect(function () {
  async function cargarOpciones() {
    const monedas = await obtenerMonedas();
    const lenguajes = await obtenerLenguajes();
    const zonasHorarias = await obtenerZonasHorarias();
    setListaDeMonedas(monedas);
    setListaDeLenguajes(lenguajes);
    setListaDeZonasHorarias(zonasHorarias);
  }
  cargarOpciones();
}, []);

// Efecto 2: la lista de países. Se repite cada vez que cambia CUALQUIER filtro.
useEffect(function () {
  async function cargarPaises() {
    setEstaCargando(true);
    const codigos = await obtenerPaises(monedaElegida, lenguajeElegido, zonaHorariaElegida);
    setCodigosDePaises(codigos);
    setEstaCargando(false);
  }
  cargarPaises();
}, [monedaElegida, lenguajeElegido, zonaHorariaElegida]);
```

El `<select>` controlado hace `setMonedaElegida(evento.target.value)` → cambia
la dependencia → el efecto vuelve a pedir la lista. **No hace falta llamar al
fetch desde el `onChange`**: el efecto reacciona solo.

Ver: `parciales/2025sem2-parcial2-matutino/web/src/components/Home.jsx`.

---

## 9. "Estado gatillo": forzar que un efecto vuelva a correr (trivia)

Para "otra ronda" sin recargar la página: un estado numérico que solo sirve
para estar en las dependencias.

```jsx
const [numeroDeRonda, setNumeroDeRonda] = useState(1);

// Arma una ronda: elige país al azar, distractores, mezcla. Depende de [numeroDeRonda].
useEffect(function () {
  async function armarRonda() { ... }
  armarRonda();
}, [numeroDeRonda]);

// El botón solo incrementa; el efecto hace el resto.
function manejarClickOtroDesafio() {
  setRespuestaElegida(null);
  setNumeroDeRonda(numeroDeRonda + 1);
}
```

Nunca `window.location.reload()`: recarga toda la app y se pierde el estado
(puntaje) y el Context.

Ver: `parciales/2025sem2-simulacro-matutino/web/src/components/Home.jsx`.

---

## 10. `localStorage` + `useEffect` (UT5.1.2)

Leer **una sola vez** al iniciar (función inicial de `useState`) y guardar
**cada vez que cambia** (efecto con `[modo]`):

```jsx
function obtenerModoInicial() {
  const modoGuardado = localStorage.getItem('modo');   // null si nunca se guardó
  if (modoGuardado === 'dark') {
    return 'dark';
  }
  return 'light';
}
const [modo, setModo] = useState(obtenerModoInicial);

useEffect(function () {
  localStorage.setItem('modo', modo);
}, [modo]);
```

`localStorage` guarda **solo strings**; para objetos/arrays,
`JSON.stringify` al guardar y `JSON.parse` al leer (`07-JAVASCRIPT-USADO.md`).

Ver: `Ejers/UT5/UT5.1.2-paises-dark-mode/src/contextos/ContextoTema.jsx`.

---

## 11. Cosas que NO van en un `useEffect`

| Situación | Qué hacer en vez de un efecto |
|---|---|
| Lista filtrada por un buscador | Calcularla en el render: `const filtrados = paises.filter(...)`. Un efecto que hace `setFiltrados` es redundante y suele generar bucles. |
| Total / porcentaje / conteo a partir del estado | Variable calculada en el render (`ProgressBar`: `done / total`). |
| Reaccionar a un click | Va en el handler (`onClick`), no en un efecto que mira un estado "clickeado". |
| Fetch después de un submit (POST) | En el handler `async function handleSubmit`, con `await`, y después `navigate(...)`. |
| Decidir con el valor recién seteado | Calcular en variable antes del `set` (`01-REACT-BASICO.md` §5.4). |

Regla: el efecto es para **sincronizar con algo externo** (API, navegador,
timers, storage), no para "reaccionar a estado" que podés calcular.

---

## 12. Reglas de los hooks (todos: `useState`, `useEffect`, `useContext`, `useParams`, `useNavigate`)

1. **Solo dentro de componentes** (funciones con mayúscula) o de hooks propios.
   No en funciones sueltas, no en `api.js`.
2. **Siempre en el nivel superior** del componente: nunca dentro de `if`, `for`,
   `map`, ni después de un `return` temprano. React los identifica **por el
   orden** en que se llaman; si el orden cambia entre renders explota:
   *"Rendered more hooks than during the previous render"*.
   ```jsx
   function Pagina() {
     const parametros = useParams();          // ✅ arriba
     const [pais, setPais] = useState(null);  // ✅ arriba
     useEffect(...);                          // ✅ arriba
     if (pais === null) {                     // ✅ el return temprano va DESPUÉS
       return <p>Cargando...</p>;
     }
     ...
   }
   ```
3. Se importan de `'react'` (`useState`, `useEffect`, `useContext`,
   `createContext`) o de `'react-router-dom'` (`useParams`, `useNavigate`,
   `Link`, `Navigate`...).
4. Los hooks de router y `useContext` **necesitan estar debajo** del
   `BrowserRouter` / `Provider` correspondiente (si no: *"useNavigate() may be
   used only in the context of a <Router> component"*, o el contexto devuelve
   `null`). Detalles en `03-REACT-ROUTER.md` y `04-CONTEXT.md`.

---

## 13. Resumen visual del ciclo de vida de una página con datos

```
1. Render inicial     -> estaCargando=true  -> pantalla: "Cargando..."
2. useEffect corre    -> fetch(...)
3. Respuesta llega    -> setDatos(...) + setEstaCargando(false)
4. Re-render          -> pantalla: la lista
5. Cambia [dep]       -> vuelve a 2 (con setEstaCargando(true) al principio)
6. Se desmonta        -> corre la función de limpieza (si la hay)
```

---

## Checklist de repaso

1. ¿Cuándo corre un efecto con `[]`, con `[x]` y sin array? ¿Qué pasa con un fetch sin array?
2. ¿Por qué no se puede poner `async` directo en el callback del `useEffect`? Escribí el patrón correcto.
3. Escribí de memoria el fetch con `estaCargando`, `mensajeError`, `try/catch/finally` y `respuesta.ok`.
4. ¿Qué devuelve el efecto para limpiar un `setInterval`? ¿Cuándo la llama React?
5. ¿Por qué `setSegundos(segundos + 1)` dentro del intervalo se clava en 1? ¿Cómo se arregla?
6. ¿Qué hace StrictMode en desarrollo y cómo sabés si tu limpieza está bien?
7. Vas de `/countries/UY` a `/countries/AR` y sigue Uruguay. ¿Qué falta?
8. En la página con 3 filtros, ¿qué va en las dependencias del efecto que pide la lista? ¿Hay que llamar al fetch desde el `onChange`?
9. ¿Qué es un "estado gatillo" y para qué se usó en la trivia?
10. ¿Cómo se lee `localStorage` una sola vez y se guarda cada vez que cambia el modo?
11. ¿La lista filtrada por el buscador se guarda con `useEffect` + `setFiltrados`? ¿Por qué no?
12. ¿Dónde tienen que estar los `return` tempranos respecto de los hooks y por qué?
