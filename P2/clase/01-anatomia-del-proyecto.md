# Tema 1 — Cómo arranca una app de React

## El recorrido: 4 archivos en cadena

```
npm start
   │
   ▼
Vite (servidor de desarrollo) ──► sirve web/index.html en localhost:5173
   │                               y además responde /api/... (la API de mentira)
   ▼
index.html   tiene  <div id="root"></div>
             y      <script src="/src/main.jsx">
   │
   ▼
main.jsx     createRoot(document.getElementById('root')).render(<App />)
             "React: dibujá <App /> dentro de ese div"
   │
   ▼
App.jsx      decide QUÉ página mostrar según la URL (el router)
   │
   ▼
PageCountryList.jsx / PageCountry.jsx …  (las páginas)
```

**1. `npm start`** corre el script `start` del `package.json`, que ejecuta **Vite**. Vite:
- sirve tus archivos al navegador y traduce el JSX a JavaScript normal;
- recarga solo cuando guardás;
- **en la plantilla 2026 también simula el backend**: `web/vite.config.js` tiene el plugin
  `mockApi({ routes })`. Por eso `localhost:5173/api/countries` responde sin servidor aparte.

> Diferencia con los parciales viejos (2026sem1): ahí el backend era **json-server**,
> en otra terminal y otro puerto (3001). En el formato actual va todo junto: solo `npm start`.

**2. `index.html`**: casi vacío. Un `<div id="root">` y la carga de `main.jsx`. Toda la app
se dibuja dentro de ese div.

**3. `main.jsx`**: el punto de entrada de React.
```jsx
import { createRoot } from 'react-dom/client';
import './index.css';                               // CSS global
import App from './components/App/App.jsx';

createRoot(document.getElementById('root')).render(<App />);
```
Casi nunca se toca. Excepción: en parciales viejos el Provider del Context se ponía acá,
envolviendo `<App />` (tema 16).

**4. `App.jsx`**: el "recepcionista". Mira la URL y decide qué página mostrar. Es lo
**primero** que hay que abrir en un parcial para saber qué pantallas existen.

## `import` / `export`

Cada archivo es una caja cerrada: para usar algo de otro, ese otro lo **exporta** y vos lo **importás**.

```jsx
// Header.jsx
export default function Header({ title }) { … }   // export DEFAULT: uno por archivo

// fetch.js
export async function fetchJSON(url) { … }        // export CON NOMBRE: puede haber varios
```
```jsx
import Header from '../Header/Header.jsx';        // default → SIN llaves (el nombre lo elegís vos)
import { fetchJSON } from '../../utils/fetch.js'; // con nombre → CON llaves y nombre exacto
import styles from './Header.module.css';         // CSS Module: objeto con tus clases
```

**Regla:** ¿llaves o no? Mirá cómo está exportado. `export default` → sin llaves.
`export function` / `export const` → con llaves.

**Rutas:** `./` = esta carpeta, `../` = subir una. La ruta va **entre comillas** (es un string).
Desde `components/PageCountry/PageCountry.jsx` hasta `utils/fetch.js`: subir dos → `../../utils/fetch.js`.

## Estructura de la plantilla

```
web/
├── data/            ← API de mentira (NO tocar). mock-routes.js = qué endpoints hay
├── specs/           ← el diseño (design.svg)
└── src/
    ├── main.jsx     ← arranque
    ├── index.css    ← estilos globales
    ├── utils/       ← funciones sueltas (fetchJSON)
    ├── hooks/       ← hooks propios (useFetchPlayers…)
    └── components/
        └── Header/
            ├── Header.jsx          ← el componente
            └── Header.module.css   ← SUS estilos (solo lo afectan a él)
```
Convención: **una carpeta por componente**, con su `.jsx` y su `.module.css`. Respetala.

## Método para leer un parcial que no conocés

1. `README.md` → qué piden.
2. `data/mock-routes.js` → qué datos hay y con qué método (¡crear suele ser **PUT**!).
3. `App.jsx` → qué rutas / páginas existen.
4. Cada página, de arriba hacia abajo.

---

## ❓ Repaso

**Pregunta:** en el tatetí, `hooks/useFetchPlayers.js` exporta `export function useFetchPlayers() { … }`.
Estás en `pages/PagePlayers/PagePlayers.jsx`. ¿Cómo es el import?

**Respuesta:**
```js
import { useFetchPlayers } from '../../hooks/useFetchPlayers.js';
```
- Llaves porque es export **con nombre**.
- `../../`: salís de `PagePlayers/`, salís de `pages/`, entrás a `hooks/`.
- **Comillas** en la ruta (lo que faltó en clase) y `;` al final (el lint de la plantilla lo exige).
