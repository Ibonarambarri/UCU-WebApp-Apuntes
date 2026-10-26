# Insumo para tema 18 — CSS Modules y lint

> Material destilado de los apuntes viejos (apuntes/_archivo/06-CSS-EN-REACT.md y 08-SETUP-VITE-Y-ENTORNO.md §5) para integrar al escribir el tema. No duplica CHULETA-EXAMEN.md ni los temas 01-11.

Ya en la chuleta (no repetir): import de módulo, `styles.card`, clase condicional con template string, `style` inline
calculado y los snippets `.list` `.grid` `.row` `.card` `.primary` → [CHULETA §8](../../CHULETA-EXAMEN.md);
tabla de mensajes de lint → [CHULETA §9](../../CHULETA-EXAMEN.md). `className`/`htmlFor`/`style={{}}` → [tema 3 §3.2](../03-componentes-y-jsx.md).

Regla de oro: **el CSS no da puntos, pero te puede comer el tiempo.** Primero que funcione, después que se vea.

---

## 1. Las tres formas

| Forma | Cómo | Cuándo | Ejemplo |
|---|---|---|---|
| CSS global | `import './App.css'` + `className="tarjeta"` | ejercicios, parciales 2025 (`web/src/index.css`) | `Ejers/UT4/TA04-contador/src/componentes/Contador.css` |
| **CSS Modules** | `import styles from './X.module.css'` + `className={styles.x}` | **plantillas 2026** (lo exigen: un `.module.css` por componente) | `parciales/2026sem1-prueba2-vespertino/src/components/TaskCard/TaskCard.module.css` |
| Inline | `style={{ width: … }}` | solo valores **calculados** | `parciales/2026sem1-prueba2-vespertino/src/components/ProgressBar/ProgressBar.jsx` |

⚠️ El CSS global es global de verdad: si dos archivos definen `.tarjeta`, gana el último importado. Por eso Modules.
⚠️ Si una clase global "no se ve", revisá que el `.css` esté importado en algún archivo que se renderice.

## 2. Reglas de CSS Modules

| Regla | Detalle |
|---|---|
| Vite renombra cada clase (`.card` → `_card_x7f2a`) | `className="card"` escrito a mano **no aplica nada** |
| Nombres en **camelCase** | `.columnHeader` ✅ · `.column-header` obliga a `styles['column-header']` |
| Clase inexistente = `undefined` | sin error: simplemente no se ve (revisar el nombre en el `.module.css`) |
| Combinar dos | `` `${styles.card} ${styles.selected}` `` o `styles.card + ' ' + styles.selected` |
| Archivo al lado del componente | `components/TaskCard/TaskCard.jsx` + `TaskCard.module.css` |
| Import con **mayúsculas exactas** | `./Navbar.module.css` ≠ `NavBar.module.css`: en Mac anda, en Linux/corrector *"Failed to resolve import"* (trampa BarApp, `parciales/2026sem1-simulacro-vespertino/src/components/NavBar/NavBar.jsx`) |
| Global en la plantilla | `index.css` solo para lo global (fuente, fondo, reset de `button/input/select`) |

## 3. Inline: objeto JS en camelCase

```jsx
<div className={styles.fill} style={{ width: `${percentage}%` }} />
<div className={styles.column} style={{ backgroundColor: COLUMN_COLORS[status] }}>
```
`background-color` → `backgroundColor`, `border-left` → `borderLeft`; números sin unidad = `px`.

## 4. Clases condicionales (el patrón que evalúan)

Calcular el string **antes** del `return` (o ternario inline):
```jsx
let claseDelModo = 'modo-light';
if (modo === 'dark') claseDelModo = 'modo-dark';
<div className={'aplicacion ' + claseDelModo}>
```
- **Por props**: el padre decide `'correcta' | 'incorrecta' | ''` y el botón hace
  `className={'boton-bandera ' + props.claseDeResultado}`; CSS `.boton-bandera.correcta { border-color: #2e8b57; }`
  (`parciales/2025sem2-simulacro-matutino/web/src/components/BotonBandera.jsx`, `.../index.css`).
- **Por la URL**: `NavLink` con `className={({ isActive }) => …}` (insumo de router, tema 13).
- **Por datos**: vista grilla/lista `className={view === 'grid' ? styles.grid : styles.list}` (variante V15 del matutino).

## 5. Dark mode: una clase en el raíz + selectores descendientes

```css
.aplicacion { min-height: 100vh; transition: background-color 0.3s, color 0.3s; }   /* si no, el fondo no cubre la ventana */
.modo-light { background-color: #f4f4f4; color: #222; }
.modo-dark  { background-color: #121212; color: #eee; }
.modo-dark .tarjeta { background-color: #222; border-color: #444; }   /* cambia todo lo de adentro */
.modo-dark a { color: #8ab4f8; }
```
Con `body { margin: 0; }`. Ver `Ejers/UT5/UT5.1.2-paises-dark-mode/src/App.css`; variante en la tarjeta misma
(`.tarjeta.tema-oscuro`): `Ejers/UT4/TA14-contexto-tema/src/App.css`.

## 6. Reset mínimo

```css
*, *::before, *::after { box-sizing: border-box; }   /* el padding no agranda las cajas */
body { margin: 0; font-family: system-ui, sans-serif; }
h1, h2, h3 { margin: 0; }
```
(`parciales/2026sem1-prueba2-vespertino/src/index.css`.)

## 7. Layouts que se repiten (además de los de la chuleta)

```css
/* Navbar: marca a la izquierda, botón a la derecha, centro que se estira */
.navbar { display: flex; align-items: center; justify-content: space-between; gap: 16px; padding: 12px 24px; }
.center { flex: 1; display: flex; justify-content: center; }

/* Grilla de N columnas fijas (9 banderas) */
.grilla { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; max-width: 520px; margin: 16px auto; }

/* Columnas tipo Trello */
.board  { display: flex; gap: 20px; overflow-x: auto; align-items: flex-start; }
.column { flex: 1; min-width: 260px; display: flex; flex-direction: column; gap: 12px; }

/* Formulario vertical: label arriba, input abajo */
.form  { max-width: 420px; display: grid; gap: 0.8rem; }
.field { display: grid; gap: 0.3rem; font-weight: 600; }
.error { color: #b91c1c; margin: 0; }

/* Barra de progreso: track + fill (el ancho va inline) */
.track { height: 10px; background: #ddd; border-radius: 5px; overflow: hidden; }
.fill  { height: 100%; background: #4ade80; transition: width 0.6s; }

/* Imágenes que no se deforman / bandera + mapa en línea */
.banderaChica { width: 120px; height: 80px; object-fit: cover; }
.detalle { display: flex; gap: 24px; align-items: flex-start; }

/* Contenedor centrado, lista sin viñetas, botones */
.pagina { max-width: 700px; margin: 0 auto; padding: 16px; }
ul.lista { list-style: none; padding: 0; margin: 0; }
button { cursor: pointer; }  button:disabled { opacity: 0.5; cursor: default; }
```
Tip: `<input>` **adentro** del `<label>` → no hace falta `htmlFor`/`id`.
Ver: `parciales/2026sem1-prueba2-vespertino/src/components/Navbar/Navbar.module.css`, `.../Board/Board.module.css`,
`.../ProgressBar/ProgressBar.module.css`, `parciales/2026sem1-simulacro-vespertino/src/pages/NuevaCuentaPage.module.css`,
`parciales/2025sem2-simulacro-vespertino/web/src/index.css`, `Ejers/UT5/UT5.1.1-paises-router/src/App.css`.

## 8. Chuleta de propiedades

| Quiero… | CSS |
|---|---|
| Fila / fila con extremos | `display: flex; gap` / `+ justify-content: space-between; align-items: center` |
| Columna | `display: flex; flex-direction: column; gap` |
| Que un hijo se estire | `flex: 1` |
| Grilla automática / de N | `repeat(auto-fill, minmax(180px, 1fr))` / `repeat(3, 1fr)` |
| Centrar bloque | `max-width; margin: 0 auto` |
| Fondo a toda la ventana | `min-height: 100vh` + `body { margin: 0 }` |
| Link sin subrayado | `text-decoration: none; color: inherit` |
| Redondeo y sombra | `border-radius: 8px; box-shadow: 0 1px 4px rgba(0,0,0,.12)` |

## 9. Lint (lo que no está en la chuleta)

- Correrlo: `npm run lint` (plantillas 2026sem2, tiene que dar 0 errores y 0 warnings) o `npx eslint src` (2025).
- `react-hooks/exhaustive-deps`: **arreglarlo, no apagarlo** con `// eslint-disable`; casi siempre es un bug (tema 10 §10.3).
- `react-refresh/only-export-components`: Context y Provider en archivos separados (insumo tema 16 §16.8).
- `semi: always` en la plantilla 2026sem2: punto y coma en **todas** las sentencias.
- `no-unused-vars`: imports que quedaron sin usar (p. ej. `Outlet` después de refactorizar) → error.

Warnings de **consola** que NO son errores tuyos:

| Mensaje | Qué hacer |
|---|---|
| `React Router Future Flag Warning: v7_startTransition / v7_relativeSplatPath` | nada (o las `future` flags en `BrowserRouter`) |
| `Can't perform a React state update on an unmounted component` | ignorable (o limpieza con `ignore`) |
| Efecto/fetch dos veces en desarrollo | StrictMode, normal ([tema 10 §10.8](../10-useeffect.md)) |
