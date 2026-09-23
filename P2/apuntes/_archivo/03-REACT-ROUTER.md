# 03 — React Router (react-router-dom) a fondo

> Todo lo que se usó de React Router en los ejercicios (TA16-TA18, UT5) y en
> los 6 parciales. Las plantillas de parcial traen **v6** (2025sem2, BarApp)
> o **v7** (Trello 2026). Para TODO lo que usamos (`BrowserRouter`, `Routes`,
> `Route`, `Link`, `NavLink`, `useParams`, `useNavigate`, `Navigate`,
> `Outlet`) **v6 y v7 son idénticos**. No hay que aprender dos cosas.

---

## 0. Mapa mental en 30 segundos

```
<BrowserRouter>                      ← escucha la URL del navegador (UNA sola vez, arriba de todo)
  <Navbar />                         ← FUERA de Routes: se ve en todas las páginas
  <Routes>                           ← mira la URL y dibuja SOLO la Route que coincide
    <Route path="/"           element={<Navigate to="/countries" replace />} />   ← redirección
    <Route path="/countries"  element={<ListaDePaises />} />
    <Route path="/countries/:cca2" element={<DetalleDePais />} />                 ← parámetro
    <Route path="*"           element={<NoEncontrado />} />                       ← 404
  </Routes>
</BrowserRouter>
```

| Quiero... | Uso |
|---|---|
| Un enlace clickeable | `<Link to="/ruta">` |
| Un enlace que se marque cuando estoy en esa página | `<NavLink to="/ruta" className={funcion}>` |
| Leer `:id` de la URL | `const parametros = useParams(); parametros.id` |
| Cambiar de página desde código (después de guardar, en un `onClick`) | `const navegar = useNavigate(); navegar('/ruta')` |
| Volver atrás | `navegar(-1)` |
| Redirigir desde el render (guardia, `/` → `/countries`) | `return <Navigate to="/x" replace />` |
| Página 404 | `<Route path="*" element={...} />` |

---

## 1. Instalación y dónde va el `BrowserRouter`

```bash
npm install react-router-dom
```

Hay **dos formas** de poner el `BrowserRouter` y las plantillas de parcial usan las dos.
Solo puede haber **uno** y tiene que envolver TODO lo que use rutas, `Link`, `useParams`, etc.

### Forma A: en `App.jsx` (ejercicios TA16-TA18, UT5, parciales 2025sem2, Trello 2026)

```jsx
// src/App.jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';

function App() {
  return (
    // BrowserRouter: "escucha" la URL del navegador y se la cuenta a Routes.
    <BrowserRouter>
      <BarraNavegacion />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="*" element={<NoEncontrada />} />
      </Routes>
    </BrowserRouter>
  );
}
```

Ver: `Ejers/UT4/TA16-router-basico/src/App.jsx`.

### Forma B: en `main.jsx` (plantilla BarApp 2026sem1-simulacro)

```jsx
// src/main.jsx
import { BrowserRouter } from 'react-router-dom';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <App />          {/* App solo tiene <Routes>, sin BrowserRouter */}
    </BrowserRouter>
  </StrictMode>,
);
```

```jsx
// src/App.jsx (BarApp) — OJO: acá NO se importa BrowserRouter
import { Route, Routes, Navigate } from 'react-router-dom';

export default function App() {
  return (
    <div>
      <NavBar />
      <Routes>
        <Route path="/" element={<Navigate to="/cuentas" replace />} />
        <Route path="/cuentas" element={<CuentasPage />} />
        <Route path="/cuentas/nueva" element={<NuevaCuentaPage />} />
      </Routes>
    </div>
  );
}
```

Ver: `parciales/2026sem1-simulacro-vespertino/src/main.jsx` y `src/App.jsx`.

> ⚠️ **Trampa:** en el parcial, ANTES de escribir rutas mirá `main.jsx`. Si el
> `BrowserRouter` ya está ahí y vos ponés otro en `App`, tenés dos routers
> anidados: no explota siempre, pero se comporta raro. Si NO está en ningún
> lado y usás `<Link>`, explota con `useHref() may be used only in the context of a <Router>`.

---

## 2. `Routes` y `Route`

```jsx
<Routes>
  {/* path: la URL. element: el JSX a dibujar (¡con < />, es un elemento, no el nombre!) */}
  <Route path="/" element={<Home />} />
  <Route path="/countries" element={<ListaDePaises />} />

  {/* Se le pueden pasar props al elemento como a cualquier componente */}
  <Route
    path="/countries"
    element={<ListaDePaises titulo="All countries" url="/api/countries" />}
  />
</Routes>
```

- `Routes` dibuja **solo una** `Route`: la que mejor coincida con la URL (v6/v7 eligen
  la más específica automáticamente, el orden casi no importa, pero por claridad poné
  `/end` antes de `/:cca3` — ver `parciales/2025sem2-simulacro-vespertino/web/src/components/App.jsx`).
- `element={<X />}` — **no** `component={X}` (eso era v5, y no compila la idea en v6/v7).
- Podés pasar el mismo componente a dos rutas: Trello usa `TaskFormPage` para
  `/tasks/new` y `/tasks/:id/edit` (sección 8).

✅ **Patrón para copiar** (parcial 2025sem2 vespertino, 9 rutas reutilizando 2 componentes):
`parciales/2025sem2-parcial2-vespertino/web/src/components/App.jsx`.

---

## 3. `Link` vs `<a href>`

```jsx
import { Link } from 'react-router-dom';

<Link to="/countries">Ir a la lista</Link>
<Link to={'/countries/' + pais.alpha2Code}>{pais.name}</Link>   {/* ruta armada con datos */}
<Link className="boton" to="/">Back to home</Link>              {/* acepta className */}
```

| `<a href="/about">` | `<Link to="/about">` |
|---|---|
| Pide la página al servidor → **recarga todo** | Solo cambia la URL y `Routes` redibuja |
| Se pierde **todo el estado** de React (`useState`) | El estado de los componentes que siguen montados se conserva |
| Se pierde **todo el Context** (puntaje, visitados, tema…) | El Provider (arriba del router) sigue vivo |
| Para enlaces externos (`https://...`) sí se usa `<a>` | Solo para rutas internas |

⚠️ En el simulacro de trivia, si el link al país fuera un `<a>` el puntaje volvería a 0.
Ver `parciales/2025sem2-simulacro-matutino/web/src/context/ContextoPuntaje.jsx` (comentario de cabecera).

---

## 4. `NavLink`: marcar el enlace activo

`NavLink` es un `Link` que sabe si la URL actual coincide con su `to`. Su `className`
puede ser **una función** que recibe `{ isActive }`:

```jsx
// Ejers/UT4/TA16-router-basico/src/componentes/BarraNavegacion.jsx
import { NavLink } from 'react-router-dom';

// NavLink llama a esta función con un objeto; isActive es true si estamos en esa ruta.
function elegirClase(datosDelEnlace) {
  if (datosDelEnlace.isActive) {
    return 'enlace enlace-activo';
  }
  return 'enlace';
}

<NavLink to="/" className={elegirClase}>Home</NavLink>
<NavLink to="/about" className={elegirClase}>About</NavLink>
```

Con CSS Modules (plantilla BarApp) es lo mismo pero devolviendo `styles.active`:
`parciales/2026sem1-simulacro-vespertino/src/components/NavBar/NavBar.jsx`.

⚠️ **Trampa BarApp:** el `NavLink` apuntaba a `/cuentas` pero la página vivía en `/`.
Estando en `/` el enlace "Cuentas" nunca se marcaba activo. Solución: `/` redirige a
`/cuentas` (sección 7) y la página vive en una sola ruta.

---

## 5. Rutas con parámetro y `useParams`

```jsx
// En App: los dos puntos indican que ":cca2" es una variable
<Route path="/countries/:cca2" element={<DetalleDePais />} />
<Route path="/producto/:id" element={<DetalleProducto />} />
<Route path="/tasks/:id/edit" element={<TaskFormPage />} />
```

```jsx
// En el componente de la página
import { useParams } from 'react-router-dom';

function DetalleDePais() {
  // useParams devuelve un objeto cuyas claves son los nombres puestos en el path.
  // Si la URL es /countries/UY -> parametros.cca2 === "UY"
  const parametros = useParams();
  const cca2 = parametros.cca2;
  ...
}
```

### ⚠️ Trampa 1: `useParams` devuelve SIEMPRE strings

```jsx
// Ejers/UT4/TA17-router-params/src/paginas/DetalleProducto.jsx
const idBuscado = Number(parametros.id);   // "2" -> 2, porque los ids de la lista son números

const productoEncontrado = productos.find(function (producto) {
  return producto.id === idBuscado;         // sin Number(), "2" === 2 es false
});

if (productoEncontrado === undefined) {
  return <h1>Producto no encontrado</h1>;   // return temprano
}
```

**Pero con json-server 1.x los ids ya son strings** (`"id": "4"`): ahí **NO** hay que
convertir; se compara directo `tarea.id === id`. Regla: mirá `db.json` y comparás con el
mismo tipo. Ver `parciales/2026sem1-prueba2-vespertino/src/pages/BoardPage/BoardPage.jsx`.

### ⚠️ Trampa 2: misma ruta, distinto parámetro → el componente NO se desmonta

De `/countries/UY` a `/countries/AR` (o de `/URY` a `/ARG` en la trivia, o de
`/currencies/EUR` a `/currencies/USD`) React Router **reutiliza** el mismo componente y
solo cambia lo que devuelve `useParams()`. Si el `useEffect` que carga los datos tiene
`[]` como dependencias, **no se vuelve a ejecutar** y la página queda mostrando el país viejo.

```jsx
// ✅ Patrón para copiar — Ejers/UT5/UT5.1.1-paises-router/src/paginas/DetalleDePais.jsx
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
}, [cca2]);   // <- LA dependencia clave: cambia el parámetro, se vuelve a pedir
```

Lo mismo con una prop: `ListaDePaises` recibe `props.url` y depende de `[props.url]`
(`parciales/2025sem2-parcial2-vespertino/web/src/components/ListaDePaises.jsx`).

### ⚠️ Trampa 3: `useParams` solo funciona dentro del componente que renderiza la `Route`

En el parcial vespertino 2025 hay un componente genérico `ListaDePaises` (recibe `titulo` + `url`).
Para las rutas con parámetro se necesita un **envoltorio** chiquito que lea el parámetro y arme la url:

```jsx
// parciales/2025sem2-parcial2-vespertino/web/src/components/PaisesPorZonaHoraria.jsx
function PaisesPorZonaHoraria() {
  const parametros = useParams();
  const zonaHoraria = parametros.timezone;                       // ya viene decodificada: "UTC+01:00"
  const url = '/api/countries?timezone=' + encodeURIComponent(zonaHoraria);  // volver a codificar para la API
  return <ListaDePaises titulo={'Countries with timezone ' + zonaHoraria} url={url} />;
}
```

### ⚠️ Trampa 4: parámetros con caracteres raros (`UTC+01:00`)

- En el `Link` hay que codificar: `to={'/timezones/' + encodeURIComponent(zona)}` → `/timezones/UTC%2B01%3A00`.
- `useParams()` **ya devuelve decodificado** (`"UTC+01:00"`).
- Al meterlo en un **query string** de la API hay que **volver a codificar**: en `?timezone=UTC+01:00`
  el `+` se interpreta como espacio y la API devuelve `[]`. Con `%2B` funciona.

Ver `parciales/2025sem2-parcial2-vespertino/web/src/components/ListaDeOpciones.jsx`.

---

## 6. `useNavigate`: cambiar de página desde código

```jsx
import { useNavigate } from 'react-router-dom';

function PaginaPais() {
  // Devuelve una FUNCIÓN. Se llama dentro del componente (es un hook), nunca dentro de un if.
  const navegar = useNavigate();

  function manejarClickVolver() {
    navegar(-1);          // como el botón "atrás" del navegador
  }

  function manejarClickInicio() {
    navegar('/');         // ir a una ruta
  }
  ...
}
```

### Después de guardar en el backend (Trello / BarApp)

```jsx
// parciales/2026sem1-simulacro-vespertino/src/pages/NuevaCuentaPage.jsx
async function handleSubmit(evento) {
  evento.preventDefault();
  ...validaciones...
  try {
    await cuentasApi.crear(cuentaNueva);   // 1) POST
    await recargar();                      // 2) actualizar el total del contexto
    navigate('/cuentas');                  // 3) recién ahora redirigir (SIEMPRE después del await)
  } catch (errorCapturado) {
    setError('Error al crear la cuenta: ' + errorCapturado.message);
  }
}
```

⚠️ Si ponés `navigate()` **antes** del `await`, la lista se muestra sin el registro nuevo.

### En un juego: navegar a un país al azar

```jsx
// parciales/2025sem2-simulacro-vespertino/web/src/components/Home.jsx (idea)
function manejarClickDificultad(nombre, erroresPermitidos) {
  contextoJuego.iniciarJuego(nombre, erroresPermitidos);
  const codigoAlAzar = elegirAlAzar(codigosDePaises);
  navegar('/' + codigoAlAzar);
}
```

| `Link` | `useNavigate` |
|---|---|
| Declarativo, en el JSX, el usuario hace click | Imperativo, en una función, cuando **vos** decidís (tras un `await`, tras validar) |
| Botón "Volver a la lista" | "Volver" a lo anterior (`navegar(-1)`), redirigir tras crear |

---

## 7. `<Navigate>`: redirigir desde el render

Es un **componente**: cuando se renderiza, cambia la URL. Se usa cuando la decisión es parte
del render (no de un click):

```jsx
// Ruta raíz que manda a otra ruta — Ejers/UT5/UT5.1.2-paises-dark-mode/src/App.jsx
<Route path="/" element={<Navigate to="/countries" replace />} />
```

```jsx
// Guardia dentro de una página — parciales/2025sem2-simulacro-vespertino/web/src/components/PaginaPais.jsx
// Si el usuario recargó la página en /URY, el contexto se vació: no hay dificultad -> a elegir.
if (contextoJuego.dificultad === '') {
  return <Navigate to="/" replace />;
}
```

**`replace`**: reemplaza la entrada actual del historial en vez de agregar una nueva. Sin
`replace`, apretar "atrás" vuelve a `/` que redirige otra vez a `/countries` → **bucle**
donde nunca se puede salir. Poné `replace` siempre que redirigís.

⚠️ `<Navigate>` va **después de todos los hooks** del componente (los hooks no pueden ir
después de un `return` condicional): primero `useParams`, `useContext`, `useState`,
`useEffect`… y recién después `if (...) return <Navigate />`.

---

## 8. Página única para crear y editar (`/tasks/new` y `/tasks/:id/edit`)

Patrón del Trello 2026 (formato más probable):

```jsx
// App.jsx
<Route path="/tasks/new"       element={<TaskFormPage onSave={handleSave} />} />
<Route path="/tasks/:id/edit"  element={<TaskFormPage onSave={handleSave} />} />
```

```jsx
// parciales/2026sem1-prueba2-vespertino/src/pages/TaskFormPage/TaskFormPage.jsx
const { id } = useParams();            // en /tasks/7/edit -> "7"; en /tasks/new -> undefined
const navigate = useNavigate();
const isEditing = Boolean(id);         // Boolean(undefined) = false

// Si editamos, cargamos la tarea existente para rellenar el formulario.
useEffect(() => {
  if (isEditing) { ...getTask(id) -> setForm(...) }
}, [id]);

async function handleSubmit(e) {
  e.preventDefault();
  ...
  if (isEditing) {
    saved = await updateTask(id, { ...form, id });   // PUT
  } else {
    saved = await createTask(form);                  // POST
  }
  onSave(saved, isEditing);   // avisar a App para actualizar la lista global
  navigate('/');
}
```

---

## 9. Ruta comodín `*` (404)

```jsx
<Route path="*" element={<NoEncontrada />} />   // cualquier URL que no coincidió antes
```

Y la página tiene un `Link` a la raíz: `Ejers/UT4/TA16-router-basico/src/paginas/NoEncontrada.jsx`.
No lo piden en los parciales pero son 2 líneas y queda prolijo.

---

## 10. Componentes que se ven en todas las páginas

Todo lo que esté **dentro de `BrowserRouter` pero fuera de `Routes`** se renderiza siempre:
la barra de navegación, el encabezado con el selector de tema, el total de recaudación…

```jsx
<BrowserRouter>
  <Encabezado />        {/* siempre visible, puede usar Link porque está dentro del router */}
  <main>
    <Routes>...</Routes>
  </main>
</BrowserRouter>
```

Ver `Ejers/UT5/UT5.1.2-paises-dark-mode/src/App.jsx` y `parciales/2026sem1-prueba2-vespertino/src/App.jsx` (`<Navbar />`).

---

## 11. Rutas protegidas (TA18)

Un componente **guardia** que recibe la página como `props.children`, mira el contexto de
autenticación y decide: mostrarla o redirigir.

```jsx
// Ejers/UT4/TA18-rutas-protegidas/src/componentes/RutaProtegida.jsx
import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import ContextoAutenticacion from '../contextos/ContextoAutenticacion.jsx';

function RutaProtegida(props) {
  const contexto = useContext(ContextoAutenticacion);

  // No logueado -> redirigir (replace para que la ruta privada no quede en el historial)
  if (!contexto.estaLogueado) {
    return <Navigate to="/" replace />;
  }

  // Logueado -> mostrar la página que nos pasaron como hijo
  return props.children;
}
```

```jsx
// Ejers/UT4/TA18-rutas-protegidas/src/App.jsx
<ContextoAutenticacion.Provider value={valorDelContexto}>   {/* POR FUERA del router */}
  <BrowserRouter>
    <BarraNavegacion />
    <Routes>
      <Route path="/" element={<Home />} />                  {/* pública */}
      <Route path="/login" element={<Login />} />            {/* pública */}
      <Route path="/perfil" element={<RutaProtegida><Perfil /></RutaProtegida>} />   {/* privada */}
      <Route path="/panel"  element={<RutaProtegida><Panel /></RutaProtegida>} />    {/* privada */}
    </Routes>
  </BrowserRouter>
</ContextoAutenticacion.Provider>
```

El Provider va por **fuera** del `BrowserRouter` para que la barra, las páginas y el guardia
lo lean. La página `Login` llama `contexto.iniciarSesion(nombre)` y luego `navegar('/perfil')`.

### Alternativa con `<Outlet />` (rutas anidadas)

```jsx
function RutaProtegida() {
  const contexto = useContext(ContextoAutenticacion);
  if (!contexto.estaLogueado) {
    return <Navigate to="/" replace />;
  }
  return <Outlet />;   // "acá va la ruta hija que coincida"
}

// En App: una ruta PADRE sin path que envuelve varias privadas de una sola vez
<Route element={<RutaProtegida />}>
  <Route path="/perfil" element={<Perfil />} />
  <Route path="/panel" element={<Panel />} />
</Route>
```

`Outlet` también sirve para layouts (una ruta padre con navbar + `<Outlet />` y las hijas
adentro). No hizo falta en ningún parcial; con "fuera de `Routes`" alcanza.

---

## 12. Tabla de rutas de cada parcial (qué piden)

### 2025sem2 parcial matutino (países con 3 `<select>`)
| Ruta | Componente | Qué muestra |
|---|---|---|
| `/` | `Home` | 3 selects (moneda / lenguaje / zona) + lista de países (bandera + nombre, `Link` a `/country/:cca3`) |
| `/country/:cca3` | `PaginaPais` | Nombres, capital, monedas, lenguajes, zonas + botón volver (`useNavigate`) |

### 2025sem2 parcial vespertino (países, 9 rutas)
| Ruta | Componente | Notas |
|---|---|---|
| `/` | `Home` | 4 `Link` |
| `/countries` | `ListaDePaises titulo url="/api/countries"` | reutilizable |
| `/countries/:cca3` | `PaginaPais` | detalle |
| `/currencies` | `ListaDeOpciones url="/api/currencies" rutaBase="/currencies"` | reutilizable |
| `/currencies/:currencyCode` | `PaisesPorMoneda` → `ListaDePaises` | envoltorio con `useParams` |
| `/languages` | `ListaDeOpciones` | |
| `/languages/:languageCode` | `PaisesPorLenguaje` → `ListaDePaises` | |
| `/timezones` | `ListaDeOpciones` | `encodeURIComponent` en el Link |
| `/timezones/:timezone` | `PaisesPorZonaHoraria` → `ListaDePaises` | re-codificar para la API |

### 2025sem2 simulacro matutino (trivia mapa → bandera)
| Ruta | Componente | Notas |
|---|---|---|
| `/` | `Home` | mapa + 4 banderas + puntaje (Context) + "Otro desafío" (estado gatillo, sin recargar) |
| `/country/:cca3` | `PaginaPais` | nombre, bandera + mapa, datos, `Link` a `/` |

### 2025sem2 simulacro vespertino (viaje por fronteras)
| Ruta | Componente | Notas |
|---|---|---|
| `/` | `Home` | 3 dificultades → `iniciarJuego` + `navegar('/' + azar)` |
| `/end` | `PaginaFinal` | visitados + botón inicio (va antes de `/:cca3`) |
| `/:cca3` | `PaginaPais` | `useEffect([cca3])`, `<Navigate to="/">` si no hay dificultad, `navegar('/end')` al último error |

### 2026sem1 prueba 2 (Trello) — Ejercicio 3
| Ruta | Componente |
|---|---|
| `/` | `BoardPage` |
| `/tasks/new` | `TaskFormPage onSave={handleSave}` |
| `/tasks/:id/edit` | `TaskFormPage onSave={handleSave}` (mismo componente, `Boolean(id)`) |

`BrowserRouter` en `App.jsx`, `Navbar` fuera de `Routes`, `useNavigate('/')` tras guardar,
`Link` a `/tasks/:id/edit` en cada tarjeta.

### 2026sem1 simulacro (BarApp) — Punto 3 y 6
| Ruta | Componente |
|---|---|
| `/` | `<Navigate to="/cuentas" replace />` |
| `/cuentas` | `CuentasPage` |
| `/cuentas/nueva` | `NuevaCuentaPage` → `navigate('/cuentas')` tras POST |
| `/productos` | `ProductosPage` (venía) |
| `/productos/nuevo` | `NuevoProductoPage` → `navigate('/productos')` |

`BrowserRouter` en **`main.jsx`**; `NavBar` con `NavLink` fuera de `Routes`.

---

## 13. Errores clásicos y cómo se ven

| Síntoma | Causa | Arreglo |
|---|---|---|
| `useHref() may be used only in the context of a <Router> component` | Un `Link`/`NavLink`/`useNavigate` fuera del `BrowserRouter` (por ejemplo Navbar renderizada arriba del router) | Mover el `BrowserRouter` más arriba (a `main.jsx`) o el componente adentro |
| `useParams()` devuelve `{}` / `parametros.id` es `undefined` | El nombre en `path` no coincide (`:cca3` vs `parametros.cca2`), o el componente no es el que renderiza la `Route` | Mismo nombre en `path` y en `useParams`; envoltorio si es genérico |
| La página no cambia al ir de `/x/A` a `/x/B` | `useEffect` con `[]` | Dependencia `[parametro]` |
| `.find` no encuentra nada | `"2" === 2` | `Number(parametros.id)` (o no convertir si los ids son strings) |
| Atrás entra en bucle | Redirección sin `replace` | `<Navigate replace />` / `navegar('/x', { replace: true })` |
| El enlace de la Navbar nunca se marca activo | La página está en `/` y el `NavLink` apunta a `/cuentas` | `/` redirige a `/cuentas` |
| Al hacer click se recarga toda la página y se pierde el puntaje | Usaste `<a href>` | `<Link to>` |
| `Rendered more hooks than during the previous render` | `return <Navigate />` antes de un hook | Todos los hooks arriba, los `return` condicionales abajo |
| Pantalla en blanco sin error | `element={Home}` en vez de `element={<Home />}` | Poner el elemento JSX |
| Al recargar `/countries/UY` da 404 del servidor | Estás en `vite preview`/servidor estático sin fallback | En `npm run dev` Vite lo maneja; en producción hay que configurar el servidor (no aplica al parcial) |
| El filtro por `UTC+01:00` devuelve `[]` | El `+` se leyó como espacio | `encodeURIComponent` al armar el query string |

---

## Checklist de repaso

1. ¿Dónde puede ir el `BrowserRouter` y cómo sé cuál usa la plantilla?
2. ¿Por qué un `<a href="/about">` es un error en una app con Context?
3. ¿Qué devuelve `useParams()` en `/producto/3`? ¿De qué tipo?
4. Voy de `/countries/UY` a `/countries/AR` y sigo viendo Uruguay. ¿Qué falta?
5. ¿Cuándo uso `useNavigate` y cuándo `<Navigate>`? ¿Para qué sirve `replace`?
6. ¿Cómo hago que un formulario redirija a la lista solo si el POST salió bien?
7. ¿Cómo comparto un mismo componente entre `/tasks/new` y `/tasks/:id/edit`?
8. ¿Por qué `ListaDePaises` genérico necesita un componente envoltorio para `/currencies/:code`?
9. ¿Qué pasa con `UTC+01:00` en un `Link` y en un query string?
10. Escribí de memoria el componente `RutaProtegida` con `props.children`.
11. ¿Dónde va la Navbar para que se vea en todas las páginas y pueda usar `Link`?
12. ¿`element={Home}` o `element={<Home />}`?
