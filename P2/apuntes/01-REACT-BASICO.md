# 01 — React básico: componentes, JSX, props, estado, eventos y listas

> Todo lo de React "puro" que apareció en los ejercicios UT4/UT5 y en los 6
> parciales. Los hooks de efecto están en `02-HOOKS-USEEFFECT.md`, el router
> en `03-REACT-ROUTER.md`, el contexto en `04-CONTEXT.md`.
> Las rutas de ejemplo son relativas a `P2/`.

---

## 1. Qué es un componente

Un componente es **una función de JavaScript que devuelve JSX** (algo que
parece HTML). React la llama cada vez que necesita dibujar esa parte de la
pantalla. Cada vez que se llama se dice que el componente se **renderiza**.

```jsx
// Un componente. Nombre SIEMPRE con mayúscula inicial.
function Saludo() {
  return <h1>Hola!</h1>;
}

export default Saludo;
```

Reglas de oro:

| Regla | Por qué |
|---|---|
| El nombre empieza con **Mayúscula** (`Card`, `ListaTareas`) | React trata `<card>` como etiqueta HTML y `<Card>` como componente. |
| Devuelve **un solo elemento raíz** | `return <h1/><p/>` es error de sintaxis. Se envuelve en un `<div>` o un fragment `<>...</>`. |
| Un archivo por componente, `export default` al final | Para importarlo con `import Card from './componentes/Card.jsx'`. |
| Se usa como etiqueta: `<Card />` o `<Card>...</Card>` | La etiqueta se autocierra si no tiene hijos. |

Estructura mínima de una app Vite (la de todos los ejercicios):

```
index.html            <div id="root"></div> + <script type="module" src="/src/main.jsx">
src/main.jsx          createRoot(document.getElementById('root')).render(<App />)
src/App.jsx           componente raíz; importa los demás
src/componentes/*.jsx un archivo por componente
src/App.css           estilos (import './App.css' en App.jsx)
```

Ver: `Ejers/UT4/TA01-card-props/src/main.jsx` y `src/App.jsx`.

---

## 2. JSX: las reglas que hay que saber sí o sí

JSX se parece a HTML pero **es JavaScript**. Diferencias que sí salen:

| HTML | JSX | Motivo |
|---|---|---|
| `class="card"` | `className="card"` | `class` es palabra reservada de JS. |
| `<label for="x">` | `<label htmlFor="x">` | `for` es palabra reservada. |
| `onclick="f()"` | `onClick={f}` | camelCase, y se pasa la **función**, no un string. |
| `style="color: red"` | `style={{ color: 'red', fontSize: '20px' }}` | Un objeto JS dentro de `{}` (doble llave). Propiedades en camelCase. |
| `<img src="a.png">` | `<img src="a.png" />` | Toda etiqueta se cierra. |
| `<!-- comentario -->` | `{/* comentario */}` | Comentario JS dentro de llaves. |

**Las llaves `{}` meten JavaScript dentro del JSX**: variables, operaciones,
llamadas a funciones, ternarios, `.map(...)`.

```jsx
function Tarjeta(props) {
  const cantidad = 3;
  return (
    <div className="tarjeta">
      {/* variable */}
      <p>{props.titulo}</p>
      {/* operación */}
      <p>Total: {cantidad * 2}</p>
      {/* concatenación de strings dentro de un atributo */}
      <img src={'/flags/' + props.cca3 + '.svg'} alt={'Bandera de ' + props.nombre} />
      {/* ternario */}
      <p>{cantidad > 0 ? 'Hay elementos' : 'Vacío'}</p>
    </div>
  );
}
```

⚠️ **Trampa**: dentro de JSX no se puede escribir un `if` ni un `for`
directamente (`{ if (x) ... }` es error). Las opciones son: `if` con
`return` ANTES del `return` principal, un ternario, o calcular una variable
antes del `return` (ver sección 7).

⚠️ **Trampa**: `{}` no dibuja `true`, `false`, `null` ni `undefined` (no
aparece nada). Pero **sí dibuja el `0`**. Por eso `{lista.length && <p>...</p>}`
muestra un "0" cuando la lista está vacía. En este curso usamos ternario
con `null`, nunca `&&`.

Ver: `Ejers/UT4/TA01-card-props/src/componentes/Card.jsx`.

---

## 3. Props: pasar datos de padre a hijo

Las props son **los atributos que le ponés a la etiqueta del componente**.
Llegan al componente como **un solo objeto** llamado `props`.

```jsx
// PADRE: pasa los datos como atributos.
<Card
  titulo="Diseñar la base de datos"
  personaAsignada="Ana Pérez"
  fechaInicio="01/09/2026"
/>

// HIJO: los lee como props.nombreDelAtributo
function Card(props) {
  return (
    <div className="card">
      <h2>{props.titulo}</h2>
      <p><strong>Persona asignada:</strong> {props.personaAsignada}</p>
      <p><strong>Fecha de inicio:</strong> {props.fechaInicio}</p>
    </div>
  );
}
```

Puntos clave:

- Las props son **de solo lectura**: el hijo NUNCA hace `props.titulo = 'otro'`.
- Se puede pasar cualquier cosa: strings (`titulo="x"`), números/objetos/arrays
  (`pais={pais}`, `cantidad={3}`), y **funciones** (`alBorrar={borrarTarea}`).
  Todo lo que no es string va entre llaves.
- Si necesitás mostrar 3 tarjetas distintas, escribís `<Card .../>` 3 veces con
  props distintas (TA01). El componente es el molde; las props, el relleno.
- Guía del curso: `function Card(props)` y adentro `props.x`. Si querés variables
  cortas, hacelo en una línea aparte: `const titulo = props.titulo;`.

Ver: `Ejers/UT4/TA01-card-props/src/App.jsx` (3 Cards con datos distintos).

### 3.1 `props.children`: lo que va ENTRE la etiqueta de apertura y cierre

```jsx
// PADRE: escribe el contenido adentro de la etiqueta.
<Card>
  <h2>Programar el login</h2>
  <p>Crear el formulario de inicio de sesión.</p>
</Card>

// HIJO: no sabe qué le van a poner; solo dibuja el marco.
function Card(props) {
  return (
    <div className="card">
      {props.children}
    </div>
  );
}
```

| | Props normales (TA01) | `props.children` (TA02) |
|---|---|---|
| Quién decide la estructura interna | El hijo (`Card` decide que hay un `<h2>` y 3 `<p>`) | El padre (escribe el JSX que quiera adentro) |
| Uso típico | Datos fijos con formato fijo (tarjeta de tarea) | Contenedores genéricos: marco, modal, layout, **Provider de contexto**, **RutaProtegida** |
| Flexibilidad | Baja | Alta |

`children` es una prop más, pero React la rellena sola. **Aparece en TODOS los
parciales**: el `Provider` de un contexto y el componente `RutaProtegida`
reciben `props.children` y lo devuelven adentro.

Ver: `Ejers/UT4/TA02-card-children/src/componentes/Card.jsx`,
`Ejers/UT5/UT5.1.2-paises-dark-mode/src/contextos/ContextoTema.jsx` (Provider con children),
`Ejers/UT4/TA18-rutas-protegidas/src/componentes/RutaProtegida.jsx`.

---

## 4. Eventos

Se escriben en camelCase y reciben **la función** (sin paréntesis).

```jsx
function Contador() {
  // Se ejecuta al hacer click. "evento" llega solo si lo declarás.
  function manejarClickSumar() {
    setContador(contador + 1);
  }

  return <button onClick={manejarClickSumar}>+1</button>;
}
```

| Evento | Dónde | Qué da `evento` |
|---|---|---|
| `onClick` | botones, links, cualquier elemento | `evento.target` = elemento clickeado |
| `onChange` | `<input>`, `<textarea>`, `<select>` | `evento.target.value` = **valor completo actual** (no la tecla) |
| `onSubmit` | `<form>` | hay que llamar `evento.preventDefault()` |

### 4.1 `onClick={f}` vs `onClick={f()}` — la trampa número uno

```jsx
<button onClick={manejarClick}>OK</button>      // ✅ pasa la función; se llama al click
<button onClick={manejarClick()}>OK</button>    // ❌ la EJECUTA en cada render.
```

Si `manejarClick` hace un `setEstado`, la versión con paréntesis produce el
error **"Too many re-renders. React limits the number of renders to prevent
an infinite loop"**.

### 4.2 Pasar argumentos al handler (única arrow inline permitida)

Cuando el handler necesita un dato de la fila (el id a borrar), no se puede
escribir `onClick={props.alBorrar(tarea.id)}` (se ejecutaría en el render).
Se envuelve en una arrow function:

```jsx
{/* Arrow inline: crea una función nueva que, AL CLICK, llama a alBorrar con el id */}
<button onClick={() => props.alBorrar(tarea.id)}>🗑</button>
```

Ver: `Ejers/UT4/TA07-borrar-tarea/src/componentes/ListaTareas.jsx`.

### 4.3 `onSubmit` + `preventDefault()`

```jsx
function manejarEnvio(evento) {
  // Sin esto el navegador RECARGA la página y se pierde TODO el estado.
  evento.preventDefault();
  // ...validar y avisar al padre...
}

<form onSubmit={manejarEnvio}>
  <input value={texto} onChange={manejarCambio} />
  {/* type="submit" (o sin type) dispara el onSubmit; Enter también */}
  <button type="submit">Agregar</button>
  {/* type="button" NO dispara el submit: para "Cancelar" */}
  <button type="button" onClick={cancelar}>Cancelar</button>
</form>
```

Ver: `Ejers/UT4/TA06-lista-tareas/src/componentes/FormularioTarea.jsx`,
`parciales/2026sem1-prueba2-vespertino/src/pages/TaskFormPage/TaskFormPage.jsx`.

---

## 5. `useState`: el estado

**Estado = datos que, cuando cambian, hacen que React vuelva a dibujar.** Una
variable normal (`let x = 0`) vuelve a su valor inicial en cada render y
cambiarla no redibuja nada.

```jsx
import { useState } from 'react';

function Contador() {
  //          valor actual, función para cambiarlo   valor inicial
  const [contador, setContador] = useState(0);
  ...
}
```

- `useState(inicial)` devuelve un array de 2: el valor y el setter. Se
  "desarma" con `const [a, setA] = ...` (es la única destructuración que
  usamos siempre).
- **La ÚNICA forma de cambiar el estado es con el setter.** `contador = 5` no
  hace nada visible.
- Cada `setX(...)` **pide un re-render** del componente (y de sus hijos).
- Se pueden tener tantos `useState` como haga falta, uno por dato.

### 5.1 Tipos de estado que salieron

| Tipo | Ejemplo | Dónde |
|---|---|---|
| número | `useState(0)` contador, `useState(1)` próximo id | TA04, TA06 |
| string | `useState('')` texto de un input, mensaje de error | TA03, TA10 |
| booleano | `useState(true)` visible/oculto, `estaCargando` | TA05, TA10 |
| `null` | `useState(null)` "todavía nada": país cargado, `idEditando` | TA08, UT5 |
| array | `useState([])` lista de tareas, países, usuarios | TA06, TA10 |
| objeto | `useState({ title: '', status: 'To Do' })` formulario completo | Trello, BarApp |

### 5.2 Estado booleano: alternar

```jsx
const [textoVisible, setTextoVisible] = useState(true);

function manejarClickAlternar() {
  setTextoVisible(!textoVisible);  // invierte
}
```
Ver: `Ejers/UT4/TA05-mostrar-ocultar/src/App.jsx`.

### 5.3 NUNCA mutar el estado (arrays y objetos)

React decide si redibujar comparando **si el valor es otro**. Si hacés
`tareas.push(nueva)` el array sigue siendo *el mismo* objeto en memoria →
React no ve cambio → no redibuja. Hay que crear **uno nuevo**.

```jsx
// ❌ MAL: muta
tareas.push(nueva);           setTareas(tareas);
tarea.texto = 'otro';         setTareas(tareas);

// ✅ BIEN: crea uno nuevo
setTareas([...tareas, nueva]);                                  // agregar
setTareas(tareas.filter((tarea) => tarea.id !== idABorrar));    // borrar
setTareas(tareas.map((tarea) => {                               // editar
  if (tarea.id === idEditando) {
    return { ...tarea, texto: textoNuevo };  // copia con un campo pisado
  }
  return tarea;
}));
setForm({ ...form, [name]: value });                            // objeto
```

Ver: `Ejers/UT4/TA08-editar-tarea/src/App.jsx` (`agregarTarea`, `borrarTarea`, `guardarEdicion`).

### 5.4 El setter es asíncrono (y "encola")

```jsx
setContador(contador + 1);
console.log(contador);   // ⚠️ sigue mostrando el valor VIEJO
```

React aplica el cambio después de que termina tu función. Consecuencias:

1. Si necesitás **decidir algo con el valor nuevo en el mismo click**, calculá
   el valor en una variable y usala:
   ```jsx
   const erroresQueQuedan = erroresRestantes - 1;
   setErroresRestantes(erroresQueQuedan);
   if (erroresQueQuedan === 0) {
     navegar('/end');
   }
   ```
   Ver: `parciales/2025sem2-simulacro-vespertino/web/src/context/ContextoJuego.jsx` (`descontarError`).

2. **Forma funcional del setter**: si el nuevo valor depende del anterior y no
   estás seguro de tener el valor fresco (setInterval, varios sets seguidos),
   pasale una función:
   ```jsx
   setSegundos(function (valorAnterior) {
     return valorAnterior + 1;
   });
   ```
   Ver: `Ejers/UT4/TA11-temporizador/src/componentes/Temporizador.jsx` y la
   explicación de la "closure vieja" en `02-HOOKS-USEEFFECT.md`.

### 5.5 Valor inicial con función (se calcula una sola vez)

```jsx
function obtenerModoInicial() {
  const modoGuardado = localStorage.getItem('modo');
  if (modoGuardado === 'dark') {
    return 'dark';
  }
  return 'light';
}
const [modo, setModo] = useState(obtenerModoInicial);   // sin paréntesis!
```
Ver: `Ejers/UT5/UT5.1.2-paises-dark-mode/src/contextos/ContextoTema.jsx`.

---

## 6. Inputs controlados (formularios)

Un input **controlado** es uno cuyo valor **vive en el estado**: `value`
sale del estado y `onChange` lo actualiza. React es la única fuente de verdad.

```jsx
const [textoDelInput, setTextoDelInput] = useState('');

function manejarCambioDeTexto(evento) {
  setTextoDelInput(evento.target.value);
}

<input type="text" value={textoDelInput} onChange={manejarCambioDeTexto} />
<p>Escribiste: {textoDelInput}</p>
```

Ventajas: validar en vivo, limpiar el input con `setTexto('')` (TA06), rellenar
un formulario con datos que vienen de la API (editar tarea, Trello).

⚠️ **`value` sin `onChange`** → el input queda congelado y la consola avisa:
*"You provided a `value` prop to a form field without an `onChange` handler..."*.

### 6.1 Cada tipo de campo

```jsx
{/* texto */}
<input type="text" value={nombre} onChange={manejarNombre} />

{/* textarea: también value/onChange (no se pone el texto adentro) */}
<textarea value={descripcion} onChange={manejarDescripcion} rows={3} />

{/* select: value en el <select>, y una <option> por opción (con key) */}
<select value={monedaElegida} onChange={manejarCambioDeMoneda}>
  <option value="">Currency (todas)</option>
  {listaDeMonedas.map((moneda) => (
    <option key={moneda.code} value={moneda.code}>{moneda.code} - {moneda.name}</option>
  ))}
</select>

{/* number: evento.target.value SIEMPRE es string -> convertir */}
<input type="number" value={cantidad} onChange={manejarCantidad} min="1" />
// al usarlo: Number(cantidad)

{/* checkbox: usa checked, no value */}
<input type="checkbox" checked={acepta} onChange={manejarAcepta} />
// handler: setAcepta(evento.target.checked)
```

Ver: `parciales/2025sem2-parcial2-matutino/web/src/components/Home.jsx` (3 selects controlados).

### 6.2 Formulario con varios campos: UN objeto + UN `handleChange`

En vez de 4 `useState` y 4 handlers, se guarda todo en un objeto y se usa el
atributo `name` de cada input como clave:

```jsx
const [form, setForm] = useState({
  title: '',
  description: '',
  status: 'To Do',
  assignee: '',
});

// UN solo handler para todos los inputs.
function handleChange(evento) {
  const name = evento.target.name;    // "title", "status", ...
  const value = evento.target.value;
  // [name] es "clave calculada": la clave del objeto es el VALOR de name.
  // Copiamos el form anterior y pisamos solo ese campo.
  setForm({ ...form, [name]: value });
}

<input name="title" value={form.title} onChange={handleChange} />
<select name="status" value={form.status} onChange={handleChange}>...</select>
```

Requisito: **`name` debe coincidir exactamente con la clave del objeto.**

Ver: `parciales/2026sem1-prueba2-vespertino/src/pages/TaskFormPage/TaskFormPage.jsx`,
`parciales/2026sem1-simulacro-vespertino/src/pages/NuevaCuentaPage.jsx`.

### 6.3 Validar antes de enviar

```jsx
function handleSubmit(evento) {
  evento.preventDefault();
  setError('');
  // trim() saca espacios: "   " cuenta como vacío
  if (form.title.trim() === '') {
    setError('El título es obligatorio.');
    return;                 // no seguimos
  }
  // ... POST / avisar al padre / navegar
}
{error !== '' ? <p className="error">{error}</p> : null}
```

---

## 7. Render condicional (sin `&&`)

Tres formas, de la más clara a la más compacta:

**a) `if` + `return` temprano** — para "cargando" / "error" / "lista vacía":
```jsx
if (estaCargando) {
  return <p>Cargando países...</p>;
}
if (mensajeError !== '') {
  return <p className="error">{mensajeError}</p>;
}
if (props.tareas.length === 0) {
  return <p>Todavía no hay tareas.</p>;
}
return ( ...render normal... );
```
⚠️ Los `return` tempranos van **después de todos los hooks** (`useState`,
`useEffect`, `useParams`...). Un hook después de un `return` condicional rompe
la regla de los hooks.

**b) Ternario con `null`** — para mostrar u ocultar un trozo dentro del JSX:
```jsx
{textoVisible ? <p>Hola!</p> : null}
{paisesFiltrados.length === 0 ? <p>No hay países que coincidan.</p> : null}
{yaRespondio ? <button onClick={siguienteRonda}>Otro desafío</button> : null}
```

**c) Variable calculada con `if / else if / else`** — cuando hay 3+ casos:
```jsx
let contenidoDeLaLista;
if (mensajeDeError !== '') {
  contenidoDeLaLista = <p className="mensaje-error">{mensajeDeError}</p>;
} else if (estaCargando) {
  contenidoDeLaLista = <p>Cargando países...</p>;
} else if (codigosDePaises.length === 0) {
  contenidoDeLaLista = <p>No hay países que cumplan con los filtros.</p>;
} else {
  contenidoDeLaLista = <ul>{...}</ul>;
}
return <div>{contenidoDeLaLista}</div>;
```
Ver: `parciales/2025sem2-parcial2-matutino/web/src/components/Home.jsx`.

También sirve para **clases CSS condicionales**:
```jsx
let claseDelModo = 'modo-light';
if (modo === 'dark') {
  claseDelModo = 'modo-dark';
}
<div className={'aplicacion ' + claseDelModo}>
```

---

## 8. Listas con `.map` y `key`

Para dibujar un array se usa `.map`, que transforma cada elemento en un
trozo de JSX. **Cada elemento devuelto necesita `key` única y estable.**

```jsx
<ul>
  {props.tareas.map((tarea) => (
    <li key={tarea.id}>{tarea.texto}</li>
  ))}
</ul>
```

Con lógica adentro (dos modos por fila), llaves y `return`:
```jsx
{props.tareas.map((tarea) => {
  const estaEditando = tarea.id === props.idEditando;
  if (estaEditando) {
    return <li key={tarea.id}>...input + Guardar/Cancelar...</li>;
  }
  return <li key={tarea.id}>...texto + ✏ 🗑...</li>;
})}
```
Ver: `Ejers/UT4/TA08-editar-tarea/src/componentes/ListaTareas.jsx`.

### ¿Qué usar como `key`?
| Key | ¿Sirve? |
|---|---|
| `tarea.id`, `usuario.id`, `pais.alpha2Code`, `cca3`, `moneda.code` | ✅ único y no cambia |
| un string único del propio dato (`zona` = "UTC-03:00") | ✅ |
| el índice del `map` (`(x, indice) => <li key={indice}>`) | ⚠️ solo si la lista nunca se reordena ni se borra del medio. Al borrar del medio los índices se corren y React confunde filas (inputs con el texto de otra fila). |

Sin `key` la consola dice: *"Each child in a list should have a unique "key" prop."*

### Id incremental para elementos creados en memoria
```jsx
const [proximoId, setProximoId] = useState(1);   // en estado, no en let
function agregarTarea(texto) {
  const nuevaTarea = { id: proximoId, texto: texto };
  setTareas([...tareas, nuevaTarea]);
  setProximoId(proximoId + 1);
}
```
(Cuando los datos vienen de json-server, el id lo pone el servidor.)

Ver: `Ejers/UT4/TA06-lista-tareas/src/App.jsx`.

---

## 9. Lifting state up: el hijo NO cambia el estado, llama al padre

El estado vive en el componente **más alto que necesita compartirlo**. Los
hijos reciben por props (a) los datos y (b) funciones para pedir cambios.

```
App  (estado: tareas)
 ├─ FormularioTarea   props.alAgregar(texto)   -> App hace setTareas
 └─ ListaTareas       props.tareas, props.alBorrar(id), props.alEmpezarEdicion(tarea)
```

```jsx
// App.jsx
function agregarTarea(texto) { setTareas([...tareas, { id: proximoId, texto: texto }]); }
<FormularioTarea alAgregar={agregarTarea} />

// FormularioTarea.jsx
function manejarEnvio(evento) {
  evento.preventDefault();
  props.alAgregar(textoNuevaTarea.trim());   // avisa al padre
  setTextoNuevaTarea('');                     // su propio estado local
}
```

Convención usada: props-función con prefijo `al...` (`alAgregar`, `alBorrar`,
`alGuardar`) o en inglés `on...` (`onSave`, `onDelete`, `onStatusChange`) en las
plantillas de los parciales.

Cuándo el estado es local del hijo: si nadie más lo necesita (el texto del input
mientras se escribe vive en `FormularioTarea`; recién al enviar sube).

Cuándo pasar a **Context**: si hay que compartir entre ramas lejanas o entre
rutas distintas → `04-CONTEXT.md`.

Ver: `Ejers/UT4/TA06-lista-tareas/`, `Ejers/UT4/TA08-editar-tarea/`.

---

## 10. Componentes reutilizables (lo que evalúan en el parcial vespertino 2025)

Si varias pantallas son iguales salvo por un título y una URL, **un componente
que recibe eso por props** y páginas envoltorio de 10 líneas:

```jsx
// ListaDePaises.jsx: recibe props.titulo y props.url, hace el fetch.
function ListaDePaises(props) {
  const [codigosDePaises, setCodigosDePaises] = useState([]);
  useEffect(() => {
    async function cargarPaises() { ... await obtenerJson(props.url) ... }
    cargarPaises();
  }, [props.url]);     // <- si cambia la url, vuelve a pedir
  return (<div><h1>{props.titulo}</h1><ul>...</ul></div>);
}

// PaisesPorMoneda.jsx: página envoltorio que lee el parámetro y arma la url.
function PaisesPorMoneda() {
  const parametros = useParams();
  const url = '/api/countries?currency=' + encodeURIComponent(parametros.currencyCode);
  return <ListaDePaises titulo={'Países con moneda ' + parametros.currencyCode} url={url} />;
}
```

Otros reutilizables que salieron: `ItemPais` (bandera + nombre + Link),
`BotonBandera`, `TarjetaDePais`, `Card`, `TaskCard`, `CuentaCard`.

Ver: `parciales/2025sem2-parcial2-vespertino/web/src/components/ListaDePaises.jsx`,
`.../PaisesPorMoneda.jsx`, `.../ListaDeOpciones.jsx`.

---

## 11. Estados de UI que siempre conviene tener

| Estado | Inicial | Para qué |
|---|---|---|
| `estaCargando` / `loading` | `true` si carga al montar, `false` si carga por acción | mostrar "Cargando..." y deshabilitar botones (`disabled={estaCargando}`) |
| `mensajeError` / `error` | `''` o `null` | mostrar el error del fetch o de validación |
| `idEditando` | `null` | qué fila está en modo edición (null = ninguna) |
| `respuestaElegida` | `null` | en la trivia: null = todavía no respondió; alimenta deshabilitar botones, mensaje, link y botón "otra ronda" |
| `numeroDeRonda` | `1` | "estado gatillo" para forzar que un `useEffect` vuelva a correr |
| `textoDeBusqueda` | `''` | filtro en vivo; la lista filtrada NO se guarda en estado, se calcula en el render |

```jsx
// Lista derivada: se recalcula sola en cada render, no hace falta otro estado.
const paisesFiltrados = paises.filter(function (pais) {
  return pais.name.toLowerCase().includes(textoDeBusqueda.toLowerCase());
});
```
Ver: `Ejers/UT5/UT5.1.1-paises-router/src/paginas/ListaDePaises.jsx`.

---

## 12. CRUD en memoria — resumen para copiar

```jsx
const [tareas, setTareas] = useState([]);

// CREAR
setTareas([...tareas, nuevaTarea]);

// LEER una
const tareaEncontrada = tareas.find((tarea) => tarea.id === id);   // undefined si no está

// EDITAR una (copia con un campo pisado)
const tareaActualizada = { ...tareaEncontrada, status: newStatus };
setTareas(tareas.map((tarea) => (tarea.id === id ? tareaActualizada : tarea)));

// BORRAR
setTareas(tareas.filter((tarea) => tarea.id !== id));
```

Con backend (json-server) es lo mismo pero **primero `await` al fetch y
después actualizás el estado** con el objeto que devolvió el servidor
(`05-FETCH-API-JSON-SERVER.md`). Ver
`parciales/2026sem1-prueba2-vespertino/src/pages/BoardPage/BoardPage.jsx`
(`handleStatusChange`, `handleDelete`).

---

## 13. Errores clásicos y cómo se ven en consola

| Qué hiciste | Qué ves | Arreglo |
|---|---|---|
| `onClick={f()}` con `setEstado` adentro | `Too many re-renders. React limits the number of renders...` | `onClick={f}` o `onClick={() => f(arg)}` |
| `value={x}` sin `onChange` | Input congelado + warning *"You provided a `value` prop to a form field without an `onChange` handler"* | agregar `onChange` |
| `tareas.push(...)` y `setTareas(tareas)` | No pasa nada en pantalla | `setTareas([...tareas, nueva])` |
| `.map` sin `key` | *"Each child in a list should have a unique "key" prop"* | `key={elemento.id}` |
| `useState`/`useEffect` dentro de un `if`, un `for` o después de un `return` | *"Rendered more hooks than during the previous render"* / *"React Hook is called conditionally"* | todos los hooks arriba de todo, siempre en el mismo orden |
| componente `function card()` en minúscula | No se renderiza, o *"The tag <card> is unrecognized in this browser"* | `function Card()` |
| olvidar `export default Card` | *"does not provide an export named 'default'"* | agregar el export |
| `import Card from './componentes/Card'` sin `.jsx` en Vite | Suele funcionar, pero el curso lo escribe con `.jsx`; si falla, poner la extensión | `'./componentes/Card.jsx'` |
| `class=` / `for=` en JSX | Warning *"Invalid DOM property `class`. Did you mean `className`?"* | `className`, `htmlFor` |
| dos elementos raíz en el `return` | *"Adjacent JSX elements must be wrapped in an enclosing tag"* | envolver en `<div>` o `<>...</>` |
| `useEffect(async () => {...})` | *"destroy is not a function"* / warning de Promise | función async adentro y llamarla |
| `{lista.length && <p/>}` con lista vacía | aparece un `0` en pantalla | ternario con `null` |
| `useParams` / `Link` fuera del `BrowserRouter` | *"useNavigate() may be used only in the context of a <Router> component"* | mover el Provider/Router más arriba (`03-REACT-ROUTER.md`) |
| `useContext` devuelve `null` y explota | *"Cannot read properties of null (reading 'modo')"* | el Provider tiene que envolver al componente (`04-CONTEXT.md`) |
| `<form>` sin `preventDefault` | la página parpadea y se vacía todo | `evento.preventDefault()` primera línea del `onSubmit` |
| `<button>` dentro de un `<form>` que no debía enviar | dispara el submit | `type="button"` |

---

## Checklist de repaso

1. ¿Por qué un componente tiene que empezar con mayúscula y devolver un solo elemento raíz?
2. ¿Cómo escribís `class`, `for` y `style="color:red"` en JSX?
3. ¿Qué diferencia hay entre `onClick={f}` y `onClick={f()}`? ¿Qué error da el segundo?
4. ¿Cómo le pasás un argumento (el id de la fila) a un handler?
5. ¿Qué es `props.children`? Nombrá dos componentes del parcial que lo usan.
6. ¿Por qué `tareas.push(x)` no redibuja? Escribí agregar, editar y borrar sin mutar.
7. ¿Qué imprime `console.log(contador)` justo después de `setContador(contador + 1)`? ¿Cómo decidís algo con el valor nuevo?
8. ¿Cuándo usás la forma funcional `setX(function (anterior) {...})`?
9. ¿Qué dos props hacen "controlado" a un input? ¿Y a un checkbox?
10. Escribí de memoria un `handleChange` único para un formulario con `title`, `status`, `assignee`.
11. ¿Cómo mostrás "Cargando..." / error / lista vacía sin usar `&&`? ¿Dónde van los `return` tempranos respecto de los hooks?
12. ¿Por qué el índice del `map` es mala `key`? ¿Qué usás en países, tareas, monedas?
13. ¿Dónde vive el estado de la lista de tareas y cómo agrega el formulario una tarea nueva?
14. ¿Cómo hacés que una misma lista sirva para `/countries`, `/currencies/:code` y `/languages/:code`?
15. ¿La lista filtrada por el buscador va en `useState`? ¿Por qué no?
