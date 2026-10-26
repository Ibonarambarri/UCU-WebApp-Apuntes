# Tema 1 — Anatomía de un proyecto Expo (plantilla 2026sem2)

## 1.1 La foto general

En P2 había `web/` (Vite + React) y la API aparte. En P3 hay **una sola app**, `mobile/`, que es
**a la vez** el frontend (React Native) y el backend (rutas `+api.js` que sirve el propio Expo).

```
simulacro-prueba3-2026sem2-matutino/
├── package.json          ← raíz: "workspaces": ["mobile"] + scripts que delegan en mobile
├── .tool-versions        ← nodejs 24.21.0 (para asdf / mise)
├── bruno/                ← colección de Bruno para probar la API sola
├── specs/                ← boceto .excalidraw del diseño
└── mobile/
    ├── package.json      ← "main": "expo-router/entry" + dependencias (expo ~58, react 19.3, RN 0.88)
    ├── app.json          ← nombre, ícono, "web": { "output": "server" } (necesario para +api)
    ├── babel.config.js   ┐
    ├── jsconfig.json     ├ los TRES configuran el alias @/  (ver 1.4)
    ├── eslint.config.js  ┘
    ├── app/              ← RUTAS: cada archivo = una pantalla (tema 7)
    │   ├── _layout.jsx   ← el <Stack> que envuelve todo
    │   ├── index.jsx     ← "/"            ← A COMPLETAR
    │   ├── games/[id].jsx← "/games/6"     ← A COMPLETAR
    │   ├── api/…+api.js  ← BACKEND: /api/games, /api/ranking… (no tocar)
    │   └── static/[...path]+api.js ← sirve las banderas en /static/flags/URY.png
    ├── common/           ← fetch.js (fetchJSON), utils.js (expoDevServerUri), styles.js
    ├── components/       ← Button.jsx (y lo que agregues: StatusMessage, CountryCard…)
    ├── hooks/            ← (lo creás vos: useFetchJSON, useCreateGame…)
    ├── data/             ← la "base de datos": db/data.json, games.js, mock-db.js (no tocar)
    └── assets/images/    ← ícono, splash
```
**Regla de oro:** lo tuyo va en `app/index.jsx`, `app/games/[id].jsx`, `components/`, `hooks/`,
`common/`. **No toques** `app/api/`, `app/static/`, `data/`.

## 1.2 Workspaces: por qué `npm i` y `npm start` en la RAÍZ

```json
// package.json (raíz)
"workspaces": ["mobile"],
"scripts": {
  "start": "npm run start --workspace mobile",   // → en mobile corre "expo start"
  "lint":  "npm run lint --workspace mobile"     // → "expo lint"
}
```
- `npm i` en la raíz instala **todo** (las dependencias de `mobile` quedan en el `node_modules` de la raíz).
- ⚠️ **No hagas `npm i` dentro de `mobile/`** ni agregues paquetes: no hay internet y te desarmás el `package-lock`.

## 1.3 Quién arranca la app

| Web (P2, Vite) | Mobile (P3, Expo) |
|---|---|
| `index.html` → `main.jsx` → `createRoot(...).render(<App />)` | `"main": "expo-router/entry"` → Expo Router lee `app/` |
| Router armado a mano en `App.jsx` | Las rutas **son los archivos** de `app/` |
| `npm run dev` → `localhost:5173` | `npm start` → Metro en `localhost:8081` |

No hay `App.jsx` ni `main.jsx`: el "componente raíz" es `app/_layout.jsx`.

## 1.4 El alias `@/`

```js
import { styles } from '@/common/styles';      // en vez de '../../common/styles'
import Button from '@/components/Button';
```
`@/` = la carpeta `mobile/`. Funciona porque está configurado **en tres lugares**:

| Archivo | Para quién | Qué dice |
|---|---|---|
| `babel.config.js` | **Metro** (que la app compile) | `module-resolver` con `alias: { '@': '.' }` |
| `jsconfig.json` | **VS Code** (autocompletar, Cmd+clic) | `"paths": { "@/*": ["./*"] }` |
| `eslint.config.js` | **`npm run lint`** (que no diga *"Unable to resolve path"*) | `'import/resolver': { alias: { map: [['@', '.']] } }` |

Desde `app/games/[id].jsx` la ruta relativa sería `../../common/styles` → usá siempre `@/`.

## 1.5 `npm start`: Metro y las 3 formas de ver la app

`npm start` levanta **Metro** (el empaquetador de Expo, como Vite) en el **puerto 8081**: sirve la
app **y** la API (`http://localhost:8081/api/ranking`).

| Tecla / acción | Qué abre |
|---|---|
| `w` | **Web** en el navegador (`http://localhost:8081`). Lo más rápido para el examen. |
| QR con **Expo Go** (Android) o la cámara (iOS) | La app en tu celular (misma red Wi-Fi) |
| `a` / `i` | Emulador Android / simulador iOS (si hay uno instalado) |
| `r` | Recargar la app |
| `j` | Abrir el debugger (React Native DevTools) |

En web, F12 funciona como en P2 (consola, Network). En el celular, los `console.log` salen **en la
terminal** de Metro.

## 1.6 Cuando Metro "no encuentra" un archivo nuevo

Creaste `hooks/useFetchGame.js` y aparece *"Unable to resolve module @/hooks/useFetchGame"*, o una
pantalla nueva en `app/` no aparece:
1. Revisá el nombre (mayúsculas, `.js` vs `.jsx`, `export` vs `export default`).
2. Cortá Metro (`Ctrl+C`) y arrancalo **limpiando la caché**:
```bash
cd mobile
npx expo start -c        # -c = --clear: borra la caché de Metro
```
(o `npm start` de nuevo en la raíz si con reiniciar alcanza). ⚠️ Puerto 8081 ocupado → otro Metro
quedó abierto en otra terminal: cerralo.

## 1.7 `.tool-versions`

```
nodejs 24.21.0
```
Le dice a **asdf** / **mise** qué Node usar. Si tenés otro Node y algo falla raro al instalar,
`node -v` es lo primero que se mira. No lo edites.

## 1.8 De dónde salió esta plantilla (para leer las viejas)

| Prueba | Estructura | Diferencias |
|---|---|---|
| 2025sem1 | raíz con workspaces `api` + `mobile` | API = servidor aparte; imports relativos |
| 2025sem2 y 2026sem1 | **un solo proyecto** (sin `mobile/`), SDK 54 | `app/api/` adentro; `ThemeProvider` de `@react-navigation/native` |
| **2026sem2** | raíz + `mobile/`, **SDK 58** | `ThemeProvider` y `DefaultTheme` se importan de **`expo-router`** |

⚠️ Si copiás de una prueba vieja, cambiá `from '@react-navigation/native'` por `from 'expo-router'`
(ese paquete no está en el `package.json` de 2026sem2).

## 1.9 Qué se entrega

1. **Fork privado** del repo → clonar el fork → `npm i` en la raíz.
2. Trabajar en `mobile/`, commits chicos.
3. Antes de entregar: `npm run lint` **sin warnings** (regla `semi: always`: punto y coma siempre).
4. **Pull request** al repo forkeado, dentro del plazo.

📂 **Verlo funcionando:** `parciales/simulacro-prueba3-2026sem2-matutino/package.json` (workspaces) ·
`.../mobile/babel.config.js` + `jsconfig.json` + `eslint.config.js` (alias) · `.../mobile/app/` (rutas + api) ·
`.../README.md` (enunciado: cómo levantar y probar) · docs:
[get-started/start-developing.mdx](../docs-offline/expo/docs/pages/get-started/start-developing.mdx)

---

## ❓ Repaso

**Pregunta:** creaste `mobile/hooks/useFetchRanking.js` con `export function useFetchRanking()`, lo
importás en `app/index.jsx` y Metro dice *"Unable to resolve module"*. ¿Qué revisás y en qué orden?

**Respuesta:**
1. El import: `import { useFetchRanking } from '@/hooks/useFetchRanking';` (llaves porque es
   `export` con nombre; ruta con `@/`, sin extensión).
2. Que el archivo esté en `mobile/hooks/` (no en la raíz del repo ni en `app/hooks/`: todo lo que
   está en `app/` se vuelve una ruta).
3. Reiniciar Metro limpiando la caché: `cd mobile && npx expo start -c`.
