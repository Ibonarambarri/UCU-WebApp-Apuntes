# Apuntes — Simulacro Parcial 2 2026 Sem1 Vespertino (BarApp)

Resolución comentada del simulacro. El enunciado original está en
`README.md` (no se modificó). Las pantallas están en `Screens.png`.

> Formato viejo (json-server + `fetch` a pelo + cliente propio), no el 2026sem2.

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
| 5 | Context | Total de recaudación en un Context y mostrarlo arriba a la derecha (NavBar) | `context/RecaudacionContext.js` + `context/RecaudacionProvider.jsx`, `NavBar.jsx`, `main.jsx` |
| 6 | Redirección | Después de crear una comida o una cuenta, ir al listado (`useNavigate`) | `NuevaCuentaPage.jsx`, `NuevoProductoPage.jsx` |

### Tabla de rutas

| Ruta | Componente | Qué muestra |
|------|-----------|-------------|
| `/` | `<Navigate to="/cuentas" />` | Redirige al listado |
| `/cuentas` | `CuentasPage` | Tarjetas de cuentas con total |
| `/cuentas/nueva` | `NuevaCuentaPage` | Formulario de cuenta nueva |
| `/productos` | `ProductosPage` | Listado de productos (venía hecho) |
| `/productos/nuevo` | `NuevoProductoPage` | Formulario de producto (venía hecho) |

`BrowserRouter` está en **`main.jsx`** (no en `App.jsx`); `NavBar` con `NavLink` fuera de `<Routes>`.

---

## 2. Cómo correrlo (difiere: dos installs y BE aparte)

`npm install` en la raíz **y** `cd BE && npm install` (el `BE/package.json` lo creamos nosotros, ver trampa 1).
Dos terminales: `cd BE && npm run dev` (o `npm run be` desde la raíz) → json-server en **3001**; y `npm run dev` → 5173
(redirige a `/cuentas`). API: `http://localhost:3001/cuentas` y `/productos`.
Resto: [README principal](../../README.md#cómo-correr-cada-cosa).

---

## 3. Archivos tocados / creados

| Archivo | Estado | Qué hace | Punto |
|---------|--------|----------|-------|
| `BE/package.json` | **creado** | Script `dev` = `json-server db.json --port 3001` + dependencia `json-server`. Sin esto `cd BE && npm install && npm run dev` del README falla | (setup) |
| `src/api/client.js` | modificado | `BASE` → 3001; implementados `cuentasApi.listar()` (GET `/cuentas`) y `cuentasApi.crear(cuerpo)` (POST `/cuentas`). Trae `fetchJson(ruta, opciones)` genérico que maneja el 204 | 2, 4 |
| `src/context/RecaudacionContext.js` + `RecaudacionProvider.jsx` | modificado | `RecaudacionContext` (`.js`) + `RecaudacionProvider` (`.jsx`, separados por el lint): estado `total`, función `recargar()` que hace GET de cuentas y productos y calcula `totalRecaudado(...)`; `useEffect([])` que llama `recargar()` al montar | 5 |
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

`ProductosPage.jsx` y `NuevoProductoPage.jsx` (venían hechos) son el **modelo a copiar** para `CuentasPage` y
`NuevaCuentaPage`; `utils/cuentas.js` ya trae `totalDeCuenta` y `totalRecaudado`: usarlas.

---

## 4. Dónde estaba lo difícil (trampas de ESTE parcial)

### Trampa 1: `BE/` no tiene `package.json`
El README dice `cd BE && npm install && npm run dev`, pero la carpeta solo tiene `db.json`. Crearlo a mano:

```json
{
  "name": "be",
  "private": true,
  "scripts": { "dev": "json-server db.json --port 3001" },
  "devDependencies": { "json-server": "^1.0.0-beta.3" }
}
```

(Se instala la 1.0.0-beta.15. En json-server 1.x el comando es `json-server <archivo> --port <n>`, sin `--watch`.)

### Trampa 2: el puerto del cliente no coincide con nada
`client.js` decía `http://localhost:3000`, pero la colección de Bruno y el proxy de `vite.config.js` usan 3001, y el
BE no tenía puerto. Se unificó todo en **3001** (además el 3000 estaba ocupado en esta máquina: `lsof -i :3000`).
El proxy `/api → 3001` de `vite.config.js` existe pero la solución no lo usa (URL completa en `client.js`).

### Trampa 3: `import styles from './Navbar.module.css'` con el archivo `NavBar.module.css`
En macOS/Windows anda (ignoran mayúsculas); en Linux/CI falla con `Cannot find module`. Import **idéntico** al archivo.

### Trampa 4: `/` y `/cuentas` mostraban lo mismo
La plantilla tenía `CuentasPage` en `/` pero el `NavLink` apunta a `/cuentas`: el link no se marcaba activo y la ruta
pedida no existía. Solución: `<Route path="/" element={<Navigate to="/cuentas" replace />} />`.

### Trampa 5: dónde vive el total (Context)
La NavBar se ve en TODAS las rutas: el total no puede depender de que `CuentasPage` haya cargado (si entrás directo a
`/productos` mostraría $0). El **Provider hace sus propios fetch** en `useEffect([])` y expone `{ total, recargar }`;
quien crea algo hace `await recargar()` antes de navegar. Alternativa válida (más código): el contexto guarda
`cuentas` y `productos` y `CuentasPage` los lee de ahí. (Context: [tema 16](../../clase/16-context.md).)

### Trampa 6: la cuenta NO trae precios
`cuentas[].productos[]` es `{ icono, nombre, cantidad }`. Para el total hay que cargar **también** `/productos` y
buscar el precio por `nombre`; por eso `CuentasPage` hace dos fetch y le pasa `productos` a cada `CuentaCard`:
```js
const producto = productos.find((p) => p.nombre === consumo.nombre);
const precio = producto ? Number(producto.precio) : 0;
const subtotal = precio * Number(consumo.cantidad);
```
Consecuencia: en el formulario el nombre tiene que escribirse **igual** que en `/productos` (si no, vale $0).

### Trampa 7: la forma del objeto del POST
El README dice `{ cliente, productos: [{ icono, nombre, cantidad }] }`. La colección Bruno usa otros nombres
(`consumos`, `emoji`, `item`): está desactualizada, **manda el README + `db.json`**. Y `cantidad` como número:
`Number(formulario.cantidad)` → [tema 6](../../clase/06-eventos.md).

### Trampa 8: ids string
json-server 1.x usa ids string (`"1"`, `"xeUHnuz"`): comparar strings con `===`, nunca `Number(id)`.

---

## 5. Conceptos clave

- Formulario con un `handleChange` por `[name]` + POST + `await recargar()` + `navigate` → [tema 8](../../clase/08-formularios-controlados.md) §8.4.
- Dos fetch al montar con `useEffect([])` → [tema 10](../../clase/10-useeffect.md).
- Cliente genérico `fetchJson` + `response.ok` + 204 → [tema 11](../../clase/11-api-fetch.md).
- `reduce` vs `for` en `utils/cuentas.js` → [tema 2](../../clase/02-javascript-para-react.md).
- Redirección `/` → `/cuentas` con `<Navigate replace>`, `NavLink` activo ([tema 13](../../clase/13-router-rutas.md)); `useNavigate` ([tema 14](../../clase/14-useparams-usenavigate.md)).
- Provider autosuficiente con `recargar()` ([tema 16](../../clase/16-context.md)); CSS Modules por componente ([tema 18](../../clase/18-css-modules-y-lint.md)).
