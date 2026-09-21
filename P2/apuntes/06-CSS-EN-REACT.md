# 06 — CSS en React (todo lo que se usó en ejercicios y parciales)

> Regla de oro del parcial: **el CSS no da puntos, pero puede quitarte tiempo.**
> Primero que funcione, después que se vea bien. Este archivo tiene todos los
> snippets listos para copiar y pegar, y explica las 3 formas de conectar CSS
> con React, cómo poner clases condicionales y los layouts que aparecen siempre.

---

## 1. Las tres formas de meter CSS en React

| Forma | Cómo se escribe | Cuándo usarla | Dónde verla |
|---|---|---|---|
| **CSS global** (archivo `.css` normal) | `import './App.css'` y `className="tarjeta"` | Ejercicios, parciales 2025 (`web/src/index.css`) | `Ejers/UT4/TA04-contador/src/componentes/Contador.css` |
| **CSS Modules** (`.module.css`) | `import styles from './X.module.css'` y `className={styles.tarjeta}` | **Parciales 2026** (lo exigen: "cada componente con su `.module.css`") | `parciales/2026sem1-prueba2-vespertino/src/components/TaskCard/TaskCard.module.css` |
| **Estilos inline** | `style={{ width: porcentaje + '%' }}` | Solo valores **calculados** (ancho de una barra, color de una columna) | `parciales/2026sem1-prueba2-vespertino/src/components/ProgressBar/ProgressBar.jsx` |

### 1.1 CSS global (la forma simple)

```jsx
// src/componentes/Contador.jsx
import './Contador.css';   // se importa UNA vez; las clases valen para toda la app

function Contador() {
  return <div className="contador">...</div>;   // className, NO class
}
```

```css
/* src/componentes/Contador.css */
.contador {
  text-align: center;
  padding: 16px;
}
```

⚠️ **Trampa**: en JSX el atributo es `className` (no `class`) y `htmlFor` (no
`for`). Si escribís `class` React tira un warning y en algunos casos no aplica.

⚠️ **Trampa**: el CSS global es global de verdad. Si dos archivos definen
`.tarjeta`, gana el que se importó último. Por eso en las plantillas 2026
piden CSS Modules.

### 1.2 CSS Modules (lo que exige el parcial 2026)

Un archivo que termina en `.module.css` es un módulo: Vite le cambia el nombre
a cada clase (`.card` pasa a ser algo como `_card_x7f2a`) para que **no choque**
con otras. Vos lo usás como si fuera un objeto JS.

```jsx
// src/components/CuentaCard/CuentaCard.jsx
import styles from './CuentaCard.module.css';   // "styles" es un objeto: { card: '_card_x7f2a', ... }

export function CuentaCard(props) {
  return (
    <li className={styles.card}>              {/* styles.card → la clase renombrada */}
      <h2 className={styles.client}>{props.cuenta.cliente}</h2>
      <ul className={styles.items}>...</ul>
      <p className={styles.total}>...</p>
    </li>
  );
}
```

```css
/* src/components/CuentaCard/CuentaCard.module.css
   (real: parciales/2026sem1-simulacro-vespertino/src/components/CuentaCard/CuentaCard.module.css) */
.card {
  border: 1px solid #e2e8f0;
  border-radius: 0.6rem;
  padding: 0.8rem;
  background: #fff;
  display: flex;
  flex-direction: column;
}
.client { margin: 0 0 0.6rem; font-size: 1.1rem; }
.items  { list-style: none; margin: 0; padding: 0; display: grid; gap: 0.25rem; }
.total  { margin: 0.75rem 0 0; padding: 0.35rem 0.6rem; border: 1px solid #cbd5e1;
          border-radius: 0.4rem; font-weight: 700; text-align: center; }
```

Reglas de CSS Modules que hay que saber:

| Regla | Ejemplo |
|---|---|
| Nombres de clase en **camelCase**, sin guiones | `.columnHeader` ✅ · `.column-header` ❌ (habría que escribir `styles['column-header']`) |
| Una clase inexistente da `undefined` (no hay error, simplemente no aplica) | si escribís `styles.tarjeta` y en el css está `.card`, no se ve nada |
| Combinar dos clases: **concatenar strings** | `className={styles.card + ' ' + styles.selected}` |
| Clase condicional | `className={estaActiva ? styles.active : ''}` |
| El archivo va **al lado** del componente, en su carpeta | `components/TaskCard/TaskCard.jsx` + `TaskCard.module.css` |
| El import tiene que coincidir **exactamente** en mayúsculas | `NavBar.module.css` ≠ `Navbar.module.css` (en Mac anda, en Linux/el corrector explota) |

⚠️ **Trampa real del simulacro 2026 (BarApp)**: `NavBar.jsx` importaba
`./Navbar.module.css` pero el archivo se llamaba `NavBar.module.css`. Ver
`parciales/2026sem1-simulacro-vespertino/src/components/NavBar/NavBar.jsx`.

### 1.3 Estilos inline: solo para valores calculados

`style` recibe un **objeto JS** (por eso las dobles llaves) con las propiedades
en camelCase y valores string o número.

```jsx
{/* Barra de progreso: el ancho depende del porcentaje calculado */}
<div className={styles.fill} style={{ width: `${percentage}%` }} />

{/* Columna del tablero: color según el estado (objeto COLUMN_COLORS) */}
<div className={styles.column} style={{ backgroundColor: COLUMN_COLORS[status] }}>

{/* Borde izquierdo de la tarjeta según estado */}
<div style={{ borderLeft: `4px solid ${STATUS_COLORS[task.status] || '#e2e8f0'}` }}>
```

Ver: `parciales/2026sem1-prueba2-vespertino/src/components/Board/Board.jsx` y
`.../components/TaskCard/TaskCard.jsx`.

⚠️ `background-color` → `backgroundColor`, `font-size` → `fontSize`,
`border-left` → `borderLeft`. Los números sin unidad se interpretan como `px`.

---

## 2. Clases condicionales (cambiar el estilo según el estado)

Este es **el** patrón de CSS que evalúan: "elegir la clase en función del
contexto/estado". Se hace con un `if` o un ternario **antes** del `return`.

### 2.1 Con `if` explícito (tema claro/oscuro en el contenedor raíz)

```jsx
// Ejers/UT5/UT5.1.2-paises-dark-mode/src/App.jsx
const contexto = useContext(ContextoTema);
const modo = contexto.modo;                 // 'light' o 'dark'

// Elegimos la clase CSS según el modo con un if explícito.
let claseDelModo = 'modo-light';
if (modo === 'dark') {
  claseDelModo = 'modo-dark';
}

return (
  // Concatenamos la clase fija con la del modo → "aplicacion modo-dark"
  <div className={'aplicacion ' + claseDelModo}>
    ...
  </div>
);
```

### 2.2 Con ternario (tarjeta con tema)

```jsx
// Ejers/UT4/TA14-contexto-tema/src/componentes/TarjetaConTema.jsx
const claseTarjeta = contexto.tema === 'claro' ? 'tarjeta tema-claro' : 'tarjeta tema-oscuro';
return <div className={claseTarjeta}>...</div>;
```

### 2.3 Clase que viene por props (botón correcto/incorrecto de la trivia)

```jsx
// parciales/2025sem2-simulacro-matutino/web/src/components/BotonBandera.jsx
const claseDeResultado = props.claseDeResultado;   // "", "correcta" o "incorrecta"
return (
  <button
    className={'boton-bandera ' + claseDeResultado}
    disabled={estaDeshabilitado}
    onClick={manejarClick}
  >
    <img className="imagen-bandera" src={imagenSrc} alt={textoAlternativo} />
  </button>
);
```

```css
/* parciales/2025sem2-simulacro-matutino/web/src/index.css */
.boton-bandera { padding: 6px; background-color: white; border: 3px solid #ccc; border-radius: 6px; cursor: pointer; }
.boton-bandera:disabled { cursor: default; }
/* Después de responder: verde la correcta, rojo la elegida incorrecta */
.boton-bandera.correcta   { border-color: #2e8b57; }
.boton-bandera.incorrecta { border-color: #c0392b; }
```

El padre (Home) decide qué string mandar en `claseDeResultado` con un `if`:
si ya respondió y esta bandera es la correcta → `'correcta'`; si es la que
eligió y está mal → `'incorrecta'`; si no → `''`.

### 2.4 `NavLink` activo (clase según la URL)

```jsx
// Ejers/UT4/TA16-router-basico/src/componentes/BarraNavegacion.jsx
// NavLink llama a esta función y le pasa { isActive: true/false }
function elegirClase(datosDelEnlace) {
  if (datosDelEnlace.isActive) {
    return 'enlace enlace-activo';
  }
  return 'enlace';
}

<NavLink to="/about" className={elegirClase}>About</NavLink>
```

```css
.enlace        { color: #fff; text-decoration: none; padding: 6px 12px; border-radius: 4px; }
.enlace-activo { background-color: #007bff; font-weight: bold; }
```

Con CSS Modules (plantilla BarApp):
```jsx
<NavLink className={({ isActive }) => (isActive ? styles.active : '')} to="/cuentas">Cuentas</NavLink>
```
(Esta arrow function viene de la plantilla; la versión con `function` es la de arriba.)

---

## 3. Dark mode completo (clase en el raíz + selectores descendientes)

La idea: **una sola clase en el contenedor raíz** y todas las reglas que
dependen del modo se escriben como `.modo-dark .algo { }`. Al cambiar la clase
del raíz, cambian todos los hijos a la vez.

```css
/* Ejers/UT5/UT5.1.2-paises-dark-mode/src/App.css (resumido) */

/* Sin margen para que el fondo cubra toda la pantalla */
body { margin: 0; font-family: Arial, Helvetica, sans-serif; }

/* Contenedor raíz: al menos toda la altura de la ventana */
.aplicacion {
  min-height: 100vh;          /* si no, el fondo oscuro termina donde termina el contenido */
  padding: 16px;
  box-sizing: border-box;
  transition: background-color 0.3s, color 0.3s;   /* cambio suave */
}

/* ---------- MODO CLARO ---------- */
.modo-light { background-color: #f4f4f4; color: #222; }

/* ---------- MODO OSCURO ---------- */
.modo-dark  { background-color: #121212; color: #eee; }

/* Reglas que dependen del modo: selector descendiente */
.modo-light .tarjeta { background-color: #fff; color: #222; border-color: #ddd; }
.modo-dark  .tarjeta { background-color: #222; color: #eee; border-color: #444; }

.modo-light a { color: #1a4fb0; }
.modo-dark  a { color: #8ab4f8; }

.modo-dark .buscador,
.modo-dark select { background-color: #2a2a2a; color: #eee; border-color: #555; }

.modo-light .mensaje-error { color: #b00020; }
.modo-dark  .mensaje-error { color: #ff6b6b; }
```

✅ **Patrón para copiar** (JSX + contexto): ver sección 2.1. El selector de modo
es un `<select value={modo} onChange={...}>` en un `Encabezado` que está fuera
de `<Routes>` (así aparece en todas las páginas):
`Ejers/UT5/UT5.1.2-paises-dark-mode/src/componentes/SelectorDeModo.jsx`.

Variante TA14: la clase de tema va en la tarjeta misma (`.tarjeta.tema-oscuro`),
ver `Ejers/UT4/TA14-contexto-tema/src/App.css`.

---

## 4. Reset básico (poner siempre al principio)

```css
/* index.css o App.css */
*,
*::before,
*::after {
  box-sizing: border-box;   /* el padding no agranda las cajas */
}

body {
  margin: 0;                /* el navegador pone 8px por defecto */
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  background-color: #f0f4f8;
  color: #1e293b;
}

h1, h2, h3 { margin: 0; }
```

(Es el `index.css` real de `parciales/2026sem1-prueba2-vespertino/src/index.css`.)

---

## 5. Layouts que se repiten en TODOS los parciales

### 5.1 Navbar (flex + space-between)

```css
/* parciales/2026sem1-prueba2-vespertino/src/components/Navbar/Navbar.module.css */
.navbar {
  display: flex;
  align-items: center;
  justify-content: space-between;   /* marca a la izquierda, botón a la derecha */
  background-color: #0052cc;
  padding: 12px 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  gap: 16px;
}
.brand { font-size: 1.3rem; font-weight: 700; color: #fff; text-decoration: none; }
.center { flex: 1; display: flex; justify-content: center; }   /* lo del medio se estira */
.newTaskBtn {
  background-color: #fff; color: #0052cc; border: none;
  padding: 8px 16px; border-radius: 4px; font-weight: 600;
  cursor: pointer; text-decoration: none;
}
.newTaskBtn:hover { background-color: #e6f0ff; }
```

Versión global simple (barra oscura con enlaces):
`Ejers/UT4/TA16-router-basico/src/App.css` → `.barra { display: flex; gap: 8px; background-color: #333; padding: 10px; }`.

### 5.2 Grilla de tarjetas (auto-fill)

```css
/* Ejers/UT5/UT5.1.1-paises-router/src/App.css */
.grilla-de-paises {
  display: grid;
  /* tantas columnas de mínimo 180px como entren; se reparten el ancho */
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 16px;
  list-style: none;    /* si la grilla es un <ul> */
  padding: 0;
  margin: 0;
}
```

Grilla fija de 3 columnas (9 banderas del simulacro vespertino):
```css
/* parciales/2025sem2-simulacro-vespertino/web/src/index.css */
.grilla-banderas {
  display: grid;
  grid-template-columns: repeat(3, 1fr);   /* 3 columnas iguales */
  gap: 12px;
  max-width: 520px;
  margin: 16px auto;
}
```

### 5.3 Columnas tipo Trello (3 columnas con flex)

```css
/* parciales/2026sem1-prueba2-vespertino/src/components/Board/Board.module.css */
.board {
  display: flex;
  gap: 20px;
  padding: 24px;
  overflow-x: auto;          /* si no entran, scroll horizontal */
  align-items: flex-start;   /* cada columna tiene su propia altura */
}
.column {
  flex: 1;                   /* las 3 columnas se reparten el ancho */
  min-width: 260px;
  border-radius: 8px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.columnHeader { display: flex; align-items: center; justify-content: space-between; }
.count { background-color: rgba(0,0,0,0.1); border-radius: 999px; padding: 2px 8px; font-size: 0.8rem; font-weight: 700; }
.cards { display: flex; flex-direction: column; gap: 10px; }
.empty { font-size: 0.85rem; color: #94a3b8; text-align: center; font-style: italic; }
```

El color de fondo de cada columna va **inline** porque depende del estado:
`style={{ backgroundColor: COLUMN_COLORS[status] }}`.

### 5.4 Tarjeta

```css
/* parciales/2026sem1-prueba2-vespertino/src/components/TaskCard/TaskCard.module.css */
.card {
  background-color: #fff;
  border-radius: 6px;
  padding: 14px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.12);
  display: flex;
  flex-direction: column;
  gap: 8px;
  transition: box-shadow 0.2s;
}
.card:hover { box-shadow: 0 4px 12px rgba(0, 0, 0, 0.18); }
.header { display: flex; align-items: flex-start; justify-content: space-between; gap: 8px; }
.title { font-size: 0.95rem; font-weight: 600; margin: 0; flex: 1; }
.description { font-size: 0.82rem; color: #64748b; margin: 0; }
```

Tarjeta "ítem de lista" con bandera a la izquierda y nombre a la derecha
(parcial 2025 matutino):
```css
/* parciales/2025sem2-parcial2-matutino/web/src/index.css */
.item-pais  { border: 1px solid #333; border-radius: 8px; margin-bottom: 8px; background-color: white; }
.enlace-pais {
  display: flex; align-items: center; justify-content: space-between;
  padding: 8px 12px; text-decoration: none; color: #222;   /* el Link ocupa todo el ítem */
}
```

### 5.5 Formulario vertical

```css
/* parciales/2026sem1-simulacro-vespertino/src/pages/NuevaCuentaPage.module.css */
.form  { max-width: 420px; display: grid; gap: 0.8rem; }      /* un campo debajo del otro */
.field { display: grid; gap: 0.3rem; font-weight: 600; }      /* label arriba, input abajo */
.input { border: 1px solid #cbd5e1; border-radius: 0.5rem; padding: 0.55rem 0.65rem; }
.btn   { border: 0; border-radius: 0.5rem; background: #0f172a; color: #fff; padding: 0.6rem 0.8rem; cursor: pointer; }
.error { margin: 0; color: #b91c1c; }                          /* mensaje de validación */
```

```jsx
<form className={styles.form} onSubmit={handleSubmit}>
  {error ? <p className={styles.error}>{error}</p> : null}
  <label className={styles.field}>
    Cliente
    <input className={styles.input} name="cliente" value={form.cliente} onChange={handleChange} />
  </label>
  <button className={styles.btn} type="submit">Guardar cuenta</button>
</form>
```

Tip: si el `<input>` está **adentro** del `<label>` no hace falta `htmlFor`/`id`.

### 5.6 Botones

```css
button, .boton {
  padding: 8px 14px;
  font-size: 15px;
  cursor: pointer;            /* manito */
  border: 1px solid #888;
  border-radius: 6px;
}
button:hover    { opacity: 0.85; }
button:disabled { cursor: default; opacity: 0.5; }   /* mientras carga o ya respondió */
```

Botón que parece enlace y enlace que parece botón: a un `<Link>` se le pueden
poner las mismas clases (`.newTaskBtn` de la Navbar es un `<Link>`).

### 5.7 Filtros en fila (3 selects)

```css
/* parciales/2025sem2-parcial2-matutino/web/src/index.css */
.filtros { display: flex; gap: 8px; margin-bottom: 16px; }
.filtros select { flex: 1; padding: 6px; }     /* mismo ancho los tres */
```

### 5.8 Lista sin viñetas

```css
.lista { list-style: none; padding: 0; margin: 0; }
```
Siempre que uses `<ul>` para tarjetas/ítems, si no quedan los puntitos y la sangría.

### 5.9 Imágenes de bandera / mapa

```css
/* Bandera chica en la lista: ancho fijo y recorte para que todas midan igual */
.bandera-chica  { width: 120px; height: 80px; object-fit: cover; border: 1px solid #ccc; }
/* Bandera grande en el detalle: responsive con tope */
.bandera-grande { width: 100%; max-width: 320px; border: 1px solid #ccc; }
/* Bandera y mapa en la misma línea (simulacro matutino) */
.detalle-pais   { display: flex; gap: 24px; align-items: flex-start; }
```

### 5.10 Barra de progreso (track + fill inline)

```css
/* parciales/2026sem1-prueba2-vespertino/src/components/ProgressBar/ProgressBar.module.css */
.track { width: 100%; height: 10px; background-color: rgba(255,255,255,0.3); border-radius: 5px; overflow: hidden; }
.fill  { height: 100%; background-color: #4ade80; border-radius: 5px; transition: width 0.6s ease-in-out; }
```
```jsx
<div className={styles.track}>
  <div className={styles.fill} style={{ width: `${percentage}%` }} />
</div>
```

### 5.11 Mensajes de estado (cargando / error / vacío)

```css
.mensaje-error { color: #b00020; font-weight: bold; }
.cargando      { color: #666; font-style: italic; }
.vacio         { color: #94a3b8; text-align: center; font-style: italic; }
```
```jsx
// Elegir qué mostrar con if/else (sin &&) — parciales/2025sem2-parcial2-vespertino/.../ListaDePaises.jsx
let contenido;
if (mensajeDeError !== '') {
  contenido = <p className="mensaje-error">{mensajeDeError}</p>;
} else if (estaCargando) {
  contenido = <p>Cargando países...</p>;
} else if (codigosDePaises.length === 0) {
  contenido = <p>No hay países para mostrar.</p>;
} else {
  contenido = <ul className="lista">...</ul>;
}
```

### 5.12 Contenedor centrado

```css
.pagina { max-width: 700px; margin: 0 auto; padding: 16px; }
```

---

## 6. Chuleta de propiedades que aparecen

| Quiero... | CSS |
|---|---|
| Poner cosas en fila | `display: flex; gap: 8px;` |
| Fila con extremos separados | `display: flex; justify-content: space-between; align-items: center;` |
| Columna | `display: flex; flex-direction: column; gap: 8px;` |
| Que un hijo se estire | `flex: 1;` |
| Grilla automática | `display: grid; grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); gap: 16px;` |
| Grilla de N columnas | `grid-template-columns: repeat(3, 1fr);` |
| Centrar bloque | `max-width: 700px; margin: 0 auto;` |
| Fondo a toda la ventana | `min-height: 100vh;` en el raíz + `body { margin: 0 }` |
| Sacar subrayado de Link | `text-decoration: none; color: inherit;` |
| Redondear y sombra | `border-radius: 8px; box-shadow: 0 1px 4px rgba(0,0,0,0.12);` |
| Manito en botón | `cursor: pointer;` |
| Deshabilitado | `button:disabled { opacity: 0.5; cursor: default; }` |
| Imagen que no se deforma | `width: 120px; height: 80px; object-fit: cover;` |
| Transición suave | `transition: background-color 0.3s, color 0.3s;` |

---

## 7. ⚠️ Trampas de CSS en React (resumen)

1. `class` → `className`, `for` → `htmlFor`.
2. `style` recibe objeto: `style={{ backgroundColor: 'red' }}`, camelCase.
3. CSS Modules: nombres en camelCase, `styles.x`, un archivo por componente, import con mayúsculas exactas.
4. Clase condicional: calcular el string **antes** del `return` con `if`/ternario y concatenar con `' '`.
5. Dark mode: `min-height: 100vh` en el raíz o el fondo oscuro no cubre la ventana.
6. `<ul>` con tarjetas: `list-style: none; padding: 0;` o quedan viñetas.
7. Un `<Link>` se estiliza igual que un `<a>` (es un `<a>` por debajo): `text-decoration: none`.
8. Si algo "no se ve", revisá que el `.css` esté importado en algún archivo que se renderice (global) o que el nombre de la clase exista en el módulo.

---

## Checklist de repaso

- [ ] ¿Cuál es la diferencia entre `import './App.css'` e `import styles from './App.module.css'`?
- [ ] ¿Por qué `.column-header` no funciona bien con CSS Modules y qué hay que hacer?
- [ ] ¿Cómo combino una clase fija con una condicional en `className`?
- [ ] ¿Dónde va la clase `modo-dark` y cómo se escriben las reglas de los hijos?
- [ ] ¿Por qué el ancho de la barra de progreso va en `style` y no en una clase?
- [ ] Escribí de memoria una grilla `auto-fill` de tarjetas de 180px.
- [ ] Escribí de memoria una navbar con marca a la izquierda y botón a la derecha.
- [ ] ¿Qué pasa si importo `./Navbar.module.css` y el archivo se llama `NavBar.module.css`?
