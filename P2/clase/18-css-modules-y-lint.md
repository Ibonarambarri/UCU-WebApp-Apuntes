# Tema 18 — CSS Modules y lint

> **Regla de oro:** el CSS no da puntos, pero te come el tiempo. **Primero que funcione, después que se vea.**
> El lint **sí** es requisito: *"`npm run lint` debe correr sin advertencias"*.

## 18.1 Tres formas de poner estilos

| Forma | Cómo | Cuándo |
|---|---|---|
| CSS global | `import './index.css'` + `className="card"` | solo lo global (fuente, fondo, reset); ejercicios y 2025 |
| **CSS Modules** | `import styles from './Card.module.css'` + `className={styles.card}` | **todo lo demás en 2026** |
| Inline | `style={{ width: `${pct}%` }}` | solo valores **calculados** |

Global: si dos archivos definen `.card` gana el último cargado. Si una clase global "no se ve", revisá
que el `.css` esté importado en algo que se renderice.

## 18.2 Cómo funciona CSS Modules

```css
/* CountryCard.module.css */
.card { border: 1px solid #ccc; border-radius: 16px; padding: 16px; }
.name { font-size: 1.3em; font-weight: 500; }
```
```jsx
import styles from './CountryCard.module.css';
<li className={styles.card}><span className={styles.name}>{country.name}</span></li>
```
Vite **renombra** cada clase (`.card` → `_card_x7f2a`); `styles` = `{ card: '_card_x7f2a', … }`.

| Regla | Si no |
|---|---|
| `className={styles.card}`, no `"card"` | no aplica nada |
| camelCase (`.columnHeader`) | `.column-header` → `styles['column-header']` |
| Nombre bien escrito | `styles.crad` = `undefined` → sin error, no se ve |
| Import con **mayúsculas exactas** | `NavBar` ≠ `Navbar`: Mac anda, Linux/corrector *"Failed to resolve import"* (BarApp) |
| Archivo al lado del componente | `CountryCard/CountryCard.jsx` + `CountryCard.module.css` |

## 18.3 Clases condicionales

```jsx
<button className={`${styles.star} ${active ? styles.active : ''}`}>      // dos, una condicional
<ul className={view === 'grid' ? styles.grid : styles.list}>             // una u otra
<NavLink className={({ isActive }) => (isActive ? styles.active : '')}>  // por la URL (tema 13.4)
```
```css
.star { color: #999; }
.star.active { color: #e6a700; }     /* solo con las DOS clases */
```
Por props (trivia 2025): el padre decide `'correcta' | 'incorrecta' | ''` y el botón hace
`className={'boton-bandera ' + props.claseDeResultado}`.

## 18.4 Inline: solo lo calculado

```jsx
<div className={styles.fill} style={{ width: `${percentage}%` }} />          // barra de progreso (Trello)
<div style={{ backgroundColor: COLUMN_COLORS[status] }} />
```
Objeto JS en camelCase (`background-color` → `backgroundColor`); números sin unidad = `px`.

## 18.5 Layouts que cubren casi todo

```css
.row    { display: flex; align-items: center; justify-content: space-between; gap: 16px; }  /* fila con extremos */
.column { display: flex; flex-direction: column; gap: 12px; }                              /* columna */
.grid   { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 16px; }
.page   { max-width: 960px; margin: 0 auto; padding: 24px; }                               /* centrado */
.card   { border: 1px solid #ccc; border-radius: 12px; padding: 16px; }
.grow   { flex: 1; }                                                                       /* ocupa lo que sobra */

.list { list-style: none; padding: 0; margin: 0; }
a { text-decoration: none; color: inherit; }
button:disabled { opacity: 0.5; cursor: default; }
```
Más, de parciales viejos:
```css
.grilla { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; }         /* N fijas (9 banderas) */
.board  { display: flex; gap: 20px; overflow-x: auto; align-items: flex-start; }       /* columnas Trello */
.form   { max-width: 420px; display: grid; gap: 0.8rem; }                               /* form vertical */
.track  { height: 10px; background: #ddd; border-radius: 5px; overflow: hidden; }      /* barra: track… */
.fill   { height: 100%; background: #4ade80; transition: width 0.6s; }                 /* …y relleno */
.bandera { width: 120px; height: 80px; object-fit: cover; }                             /* imagen sin deformar */
```
**Leer un diseño:** ¿una al lado de otra? → flex fila. ¿Una debajo de otra? → flex columna. ¿Cuadrícula? → grid.
Tip: `<input>` **dentro** del `<label>` → no hace falta `htmlFor`/`id`.

Reset mínimo (en `index.css`):
```css
*, *::before, *::after { box-sizing: border-box; }
body { margin: 0; font-family: system-ui, sans-serif; }
```

**Dark mode** (UT5.1.2): clase en el raíz + selectores descendientes.
```css
.aplicacion { min-height: 100vh; }
.modo-dark { background-color: #121212; color: #eee; }
.modo-dark .tarjeta { background-color: #222; }
```

| Quiero… | CSS |
|---|---|
| Hijo que se estire | `flex: 1` |
| Grilla automática / de N | `repeat(auto-fill, minmax(180px, 1fr))` / `repeat(3, 1fr)` |
| Centrar bloque | `max-width; margin: 0 auto` |
| Fondo a toda la ventana | `min-height: 100vh` + `body { margin: 0 }` |
| Sombra | `box-shadow: 0 1px 4px rgba(0,0,0,.12)` |

## 18.6 Lint

ESLint revisa el código **sin ejecutarlo**. `npm run lint` → **sin ningún mensaje**.

| Mensaje | Arreglo |
|---|---|
| `Missing semicolon` | `;` (regla `semi: always`) |
| `'x' is defined but never used` | borrar el import/variable (ej. `Outlet` tras refactorizar) |
| `React Hook useEffect has a missing dependency: 'x'` | agregar `x` al array (tema 10.3); función del componente → moverla adentro o `useCallback` (tema 17.2) |
| `React Hook "useX" is called conditionally` | hook arriba, antes de `if`/`return` (tema 7.6) |
| `Fast refresh only works when a file only exports components` | separar contexto/hook del Provider (tema 16.3) |

⚠️ **No apagar reglas** con `// eslint-disable…`: casi siempre es un bug real.
**Correrlo cada vez que terminás una parte**, no solo al final.

## 18.7 Consola del navegador

| Mensaje | ¿Tuyo? |
|---|---|
| `React Router Future Flag Warning…` | no (o flags `future`, tema 13.9) |
| `Download the React DevTools…` | no |
| Pedidos dobles en desarrollo | no, StrictMode (tema 10.8) |
| `Each child in a list should have a unique "key"` | **sí** (tema 5.2) |
| `A component is changing an uncontrolled input to be controlled` | **sí** (tema 8.1) |
| `Objects are not valid as a React child` | **sí** (tema 5.4) |

📂 **Verlo funcionando:** `parciales/simulacro-prueba2-2026sem2-matutino/web/src/components/CountryCard/CountryCard.module.css` ·
`.../FavoriteButton/FavoriteButton.jsx` (clase condicional) · `parciales/2026sem1-prueba2-vespertino/src/components/ProgressBar/ProgressBar.jsx` (inline) ·
`Ejers/UT5/UT5.1.2-paises-dark-mode/src/App.css` (dark mode) · `parciales/simulacro-prueba2-2026sem2-matutino/web/eslint.config.js` (reglas)

---

## ❓ Repaso

**Pregunta:** 1) ¿Por qué no aplica estilos?
```jsx
import styles from './PlayerRow.module.css';
<li className="row">{player.name}</li>
```
2) `className` para agregar `winner` al ganador. 3) Lint: *"missing dependency: 'id'"*. ¿Qué hacés?

**Respuesta:**
1. Con Modules la clase real es `_row_x7f2a` → `className={styles.row}`.
2. `` className={`${styles.row} ${isWinner ? styles.winner : ''}`} ``
3. Agregar `id` a las dependencias (`[id]`). Es el bug del tema 10.5; no se apaga la regla.
