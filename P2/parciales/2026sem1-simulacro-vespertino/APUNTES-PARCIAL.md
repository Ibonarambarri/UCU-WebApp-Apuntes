# Apuntes — Simulacro Parcial 2 2026 Sem1 Vespertino (BarApp)

Resolución comentada del simulacro. El enunciado original está en
`README.md` (no se modificó). Las pantallas están en `Screens.png`.

---

## 1. Resumen del enunciado

App de un bar con dos recursos en json-server: `productos` (`id`, `icono`,
`nombre`, `precio`) y `cuentas` (`id`, `cliente`, `productos[]` donde cada
item es `{ icono, nombre, cantidad }`, **sin precio y sin id de producto**:
el precio se busca por `nombre` en la lista de productos).

6 puntos, **con 5 de 6 se obtiene el 100%**.

| # | Punto | Qué hay que hacer | Dónde |
|---|-------|-------------------|-------|
| 1 | Componentes | Crear el componente que representa a un cliente con su cuenta (tarjeta) | `components/CuentaCard/` |
| 2 | Listado | Mostrar cuentas con cliente, productos, cantidades y **total al final** (usar `totalDeCuenta` de `utils`) | `pages/CuentasPage.jsx` |
| 3 | Router | Agregar rutas `cuentas` y `cuentas/nueva` | `App.jsx` |
| 4 | Formulario | Crear una cuenta nueva (`POST /cuentas`) | `pages/NuevaCuentaPage.jsx`, `api/client.js` |
| 5 | Context | Total de recaudación en un Context y mostrarlo arriba a la derecha (NavBar) | `context/RecaudacionContext.jsx`, `NavBar.jsx`, `main.jsx` |
| 6 | Redirección | Después de crear una comida o una cuenta, ir al listado (`useNavigate`) | `NuevaCuentaPage.jsx`, `NuevoProductoPage.jsx` |

### Tabla de rutas

| Ruta | Componente | Qué muestra |
|------|-----------|-------------|
| `/` | `<Navigate to="/cuentas" />` | Redirige al listado |
| `/cuentas` | `CuentasPage` | Tarjetas de cuentas con total |
| `/cuentas/nueva` | `NuevaCuentaPage` | Formulario de cuenta nueva |
| `/productos` | `ProductosPage` | Listado de productos (venía hecho) |
| `/productos/nuevo` | `NuevoProductoPage` | Formulario de producto (venía hecho) |

---

## 2. Cómo correrlo

```bash
npm install            # raíz (React + Vite)
cd BE && npm install   # json-server (BE/package.json lo creamos nosotros)
```

Dos terminales:

```bash
# Terminal 1 — API en el puerto 3001
cd BE && npm run dev          # = json-server db.json --port 3001
# (equivalente desde la raíz: npm run be)

# Terminal 2 — frontend en el puerto 5173
npm run dev
```

- API: `http://localhost:3001/cuentas` y `http://localhost:3001/productos`
- App: `http://localhost:5173` (redirige a `/cuentas`)

Si al instalar aparece el warning `allow-scripts ... esbuild`, ejecutar
`npm approve-scripts esbuild --yes && npm rebuild esbuild`.

---

## 3. Archivos tocados / creados

| Archivo | Estado | Qué hace | Punto |
|---------|--------|----------|-------|
| `BE/package.json` | **creado** | Script `dev` = `json-server db.json --port 3001` + dependencia `json-server`. Sin esto `cd BE && npm install && npm run dev` del README falla | (setup) |
| `src/api/client.js` | modificado | `BASE` → 3001; implementados `cuentasApi.listar()` (GET `/cuentas`) y `cuentasApi.crear(cuerpo)` (POST `/cuentas`) | 2, 4 |
| `src/context/RecaudacionContext.jsx` | modificado | `RecaudacionContext` + `RecaudacionProvider`: estado `total`, función `recargar()` que hace GET de cuentas y productos y calcula `totalRecaudado(...)`; `useEffect([])` que llama `recargar()` al montar | 5 |
| `src/main.jsx` | modificado | Envuelve `<App />` con `<RecaudacionProvider>` (adentro de `BrowserRouter`) | 5 |
| `src/App.jsx` | modificado | Rutas `/cuentas`, `/cuentas/nueva`; `/` redirige con `<Navigate>` | 3 |
| `src/components/NavBar/NavBar.jsx` | modificado | Import del CSS corregido (`NavBar.module.css`); `total` desde `useContext(RecaudacionContext)`, formateado con `formatoPrecio` | 5 |
| `src/components/CuentaCard/CuentaCard.jsx` | **creado** | Tarjeta de una cuenta: cliente, `map` de consumos (`icono nombre x cantidad subtotal`), total con `totalDeCuenta` | 1, 2 |
| `src/components/CuentaCard/CuentaCard.module.css` | **creado** | Estilos de la tarjeta (CSS Module) | 1 |
| `src/pages/CuentasPage.jsx` | modificado | `useEffect([])` que carga **cuentas y productos**, loading/error, `map` de `CuentaCard` | 2 |
| `src/pages/CuentasPage.module.css` | modificado | `.list` en grid de varias columnas (como el bosquejo) | 1 |
| `src/pages/NuevaCuentaPage.jsx` | modificado | Formulario controlado (cliente, producto, icono, cantidad) con un solo `handleChange`; validación; `cuentasApi.crear` → `recargar()` → `navigate('/cuentas')` | 4, 5, 6 |
| `src/pages/NuevaCuentaPage.module.css` | modificado | Agregada clase `.error` | 4 |
| `src/pages/NuevoProductoPage.jsx` | comentado | Venía hecho; se agregó `recargar()` después del POST y comentarios | 6 |
| `src/utils/cuentas.js` | comentado | Venía hecho (usa `reduce`); se comentó y se dejó al lado la versión con `for` | 2, 5 |

---

## 4. Dónde estaba lo difícil (trampas)

### Trampa 1: `BE/` no tiene `package.json`
El README dice `cd BE && npm install && npm run dev`, pero la carpeta solo
tiene `db.json`. Hay que crearlo a mano:

```json
{
  "name": "be",
  "private": true,
  "scripts": { "dev": "json-server db.json --port 3001" },
  "devDependencies": { "json-server": "^1.0.0-beta.3" }
}
```

(Se instala la 1.0.0-beta.15. En json-server 1.x el flag `--watch` no hace
falta; el comando es `json-server <archivo> --port <n>`.)

### Trampa 2: el puerto del cliente no coincide con nada
`client.js` decía `http://localhost:3000`, pero la colección de Bruno y el
proxy de `vite.config.js` usan 3001, y el BE no tenía puerto definido. Regla:
**el `BASE` de `client.js` y el `--port` del script del BE tienen que ser el
mismo número**. Se unificó todo en **3001** (además en esta máquina el 3000
estaba ocupado por otro proceso: si la API "no responde", hacer
`lsof -i :3000` antes de volverse loco).

### Trampa 3: `import styles from './Navbar.module.css'` con el archivo `NavBar.module.css`
En macOS y Windows funciona porque el sistema de archivos ignora las
mayúsculas. En Linux (y en cualquier CI/servidor) falla con
`Cannot find module`. El import tiene que ser **idéntico** al nombre del
archivo. Revisar siempre mayúsculas en imports.

### Trampa 4: `/` y `/cuentas` mostraban lo mismo
La plantilla tenía `CuentasPage` en `/` pero el `NavLink` apunta a
`/cuentas`: estando en `/` el link "Cuentas" no se marcaba como activo y la
ruta pedida (`cuentas`) no existía. Solución: `<Route path="/"
element={<Navigate to="/cuentas" replace />} />` y la página vive solo en
`/cuentas`. (Dejar las dos rutas con el mismo componente también "anda", pero
duplica y el link activo queda mal.)

### Trampa 5: dónde vive el total (Context)
La NavBar se ve en TODAS las rutas, así que el total no puede depender de
que `CuentasPage` haya cargado. Decisión: el **Provider hace sus propios
fetch** de cuentas y productos en un `useEffect([])`, calcula
`totalRecaudado(cuentas, productos)` y expone `{ total, recargar }`. Quien
cambia datos (crear cuenta / crear producto) llama `await recargar()` antes
de navegar. Es más simple que compartir las listas enteras por contexto y
evita tener copias distintas de las cuentas en NavBar y CuentasPage.

Alternativa válida: que el contexto guarde `cuentas` y `productos` y que
`CuentasPage` los lea de ahí en vez de hacer fetch propio. Más "elegante"
pero más código; en un parcial de 2 horas, lo simple gana.

### Trampa 6: la cuenta NO trae precios
`cuentas[].productos[]` es `{ icono, nombre, cantidad }`. Para el total hay
que cargar **también** `/productos` y buscar el precio por `nombre`
(`productos.find((p) => p.nombre === consumo.nombre)`). Por eso
`CuentasPage` hace dos fetch y le pasa `productos` a cada `CuentaCard`.
Consecuencia: en el formulario, el nombre del producto tiene que escribirse
**igual** que en `/productos` (si no, vale $0).

### Trampa 7: la forma del objeto que se manda en el POST
El README lo dice explícito: `{ cliente, productos: [{ icono, nombre,
cantidad }] }`. La colección Bruno de ejemplo usa otros nombres (`consumos`,
`emoji`, `item`) — está desactualizada, **manda el README + db.json**. Y
`cantidad` tiene que ser número: los inputs siempre devuelven string →
`Number(formulario.cantidad)`.

### Trampa 8: redirigir después del `await`
`navigate('/cuentas')` va **después** de `await cuentasApi.crear(...)` (y de
`await recargar()`). Si se pone antes, se navega sin haber guardado, y si
falla el POST el usuario no se entera.

### Trampa 9: ids string
json-server 1.x usa ids string (`"1"`, `"xeUHnuz"`). Comparar siempre con
`===` entre strings, nunca `Number(id)`.

### Trampa 10: CSS Modules
Cada componente nuevo lleva su `.module.css` y se usa `styles.card`, nunca
`className="card"` (Vite renombra las clases).

---

## 5. Lo más importante para repetir en el parcial

### Cliente HTTP genérico + funciones por recurso
```js
const BASE = 'http://localhost:3001'

export async function fetchJson(ruta, opciones = {}) {
  const respuesta = await fetch(`${BASE}${ruta}`, {
    headers: { 'Content-Type': 'application/json' },
    ...opciones,
  })
  if (!respuesta.ok) throw new Error(`Error HTTP ${respuesta.status}`)
  if (respuesta.status === 204) return null
  return respuesta.json()
}

export const cuentasApi = {
  listar: async function () { return await fetchJson('/cuentas') },
  obtener: (id) => fetchJson(`/cuentas/${id}`),
  crear: async function (cuerpo) {
    return await fetchJson('/cuentas', { method: 'POST', body: JSON.stringify(cuerpo) })
  },
  reemplazar: (id, cuerpo) => fetchJson(`/cuentas/${id}`, { method: 'PUT', body: JSON.stringify(cuerpo) }),
  actualizar: (id, cuerpo) => fetchJson(`/cuentas/${id}`, { method: 'PATCH', body: JSON.stringify(cuerpo) }),
  borrar: (id) => fetchJson(`/cuentas/${id}`, { method: 'DELETE' }),
}
```

### Provider que carga datos y expone un valor calculado
```jsx
export const RecaudacionContext = createContext({ total: 0, recargar: function () {} })

export function RecaudacionProvider(props) {
  const [total, setTotal] = useState(0)

  async function recargar() {
    try {
      const cuentas = await cuentasApi.listar()
      const productos = await productosApi.listar()
      setTotal(totalRecaudado(cuentas, productos))
    } catch (errorCapturado) {
      setTotal(0)
    }
  }

  useEffect(() => { recargar() }, [])   // una vez al montar

  return (
    <RecaudacionContext.Provider value={{ total: total, recargar: recargar }}>
      {props.children}
    </RecaudacionContext.Provider>
  )
}
// main.jsx: <BrowserRouter><RecaudacionProvider><App /></RecaudacionProvider></BrowserRouter>
// consumidor: const contexto = useContext(RecaudacionContext); contexto.total
```

### Cargar dos listas al montar
```jsx
useEffect(() => {
  async function cargar() {
    try {
      setCuentas(await cuentasApi.listar())
      setProductos(await productosApi.listar())
    } catch (errorCapturado) {
      setError(errorCapturado.message)
    } finally {
      setCargando(false)
    }
  }
  cargar()
}, [])
```

### Formulario controlado + POST + recargar + useNavigate
```jsx
const navigate = useNavigate()
const [formulario, setFormulario] = useState({ cliente: '', nombre: '', icono: '', cantidad: '1' })

function handleChange(evento) {
  const name = evento.target.name
  const value = evento.target.value
  setFormulario({ ...formulario, [name]: value })
}

async function handleSubmit(evento) {
  evento.preventDefault()
  if (!formulario.cliente.trim()) { setError('Falta el cliente'); return }
  try {
    await cuentasApi.crear({
      cliente: formulario.cliente,
      productos: [{ icono: formulario.icono, nombre: formulario.nombre, cantidad: Number(formulario.cantidad) }],
    })
    await recargar()
    navigate('/cuentas')
  } catch (errorCapturado) {
    setError(errorCapturado.message)
  }
}
// <input name="cliente" value={formulario.cliente} onChange={handleChange} />
```

### Redirección de ruta
```jsx
import { Navigate } from 'react-router-dom'
<Route path="/" element={<Navigate to="/cuentas" replace />} />
```

### Buscar un precio por nombre (sin id de referencia)
```js
const producto = productos.find((p) => p.nombre === consumo.nombre)
const precio = producto ? Number(producto.precio) : 0
const subtotal = precio * Number(consumo.cantidad)
```

---

## 6. Plan de ataque (2 horas, con 5/6 alcanza el 100%)

1. **(10 min) Setup y lectura.** Crear `BE/package.json`, `npm install` en
   raíz y en `BE`, levantar json-server y abrir `http://localhost:3001/cuentas`
   en el navegador. Corregir `BASE` en `client.js` para que apunte al mismo
   puerto. Leer `db.json` (forma de los datos), `utils/cuentas.js` (ya trae
   `totalDeCuenta` y `totalRecaudado`: ¡usarlas!), y `ProductosPage.jsx`
   (es el modelo a copiar para `CuentasPage`).
2. **(5 min) Punto 3 — rutas.** Dos `<Route>` + `<Navigate>` en `/`. Ya se
   puede navegar con los links.
3. **(10 min) `cuentasApi.listar` y `crear`** en `client.js` copiando las
   de `productosApi`.
4. **(25 min) Puntos 1 y 2 — listado.** Copiar el `useEffect` de
   `ProductosPage`, agregar el segundo fetch de productos, crear
   `CuentaCard` con su `.module.css`, usar `totalDeCuenta` para el total.
5. **(20 min) Puntos 4 y 6 — formulario.** Copiar `NuevoProductoPage`:
   estado con 4 campos, `handleChange`, `handleSubmit` con POST y
   `navigate('/cuentas')`. Probar que aparece en el listado.
6. **(20 min) Punto 5 — Context.** Provider con `total` + `recargar`,
   envolver en `main.jsx`, `useContext` en `NavBar`, llamar `recargar()`
   después de crear. Probar creando una cuenta: el número de arriba cambia.
7. **(10 min) Revisar.** Corregir el import `NavBar.module.css`, consola sin
   errores, recargar en cada ruta, `npm run build`.

Si se acaba el tiempo, el punto 5 es el que más se puede dejar (los otros 5
dan el 100%), pero el Provider son ~25 líneas y vale la pena intentarlo.
