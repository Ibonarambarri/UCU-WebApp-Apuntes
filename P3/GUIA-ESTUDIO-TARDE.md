# Guía para la tarde de estudio — Parcial 3 (React Native + Expo Router)

**Objetivo:** pasar lo que ya sabés de React web (P2) a React Native y llegar con todo el material
ordenado. No hay que memorizar: se pueden usar apuntes, pero **sin internet y sin IA**, así que tus
apuntes y tus simulacros resueltos son tu única ayuda.

## Lo más importante: el simulacro

En el P2 la pista fue "traigan el simulacro hecho" y el examen usó la misma plantilla. Para el P3
apostamos a lo mismo:

- El examen casi seguro usa **la misma plantilla 2026sem2** (workspace con `mobile/`, Expo SDK 58,
  Expo Router, API en `app/api/*+api.js`, `fetchJSON`, `expoDevServerUri`, `Button`, `styles.js`) y
  probablemente **otro juego o pantalla con datos de países** (los 4 parciales de 2025sem2 y el
  simulacro de 2026sem1 fueron trivias de países).
- La lógica pesada (azar, puntaje, corrección) ahora **vive en la API**: la app crea, manda
  respuestas y muestra lo que vuelve. Lo difícil es **qué mostrar en cada fase** y los "casos a
  contemplar" (recargar, cambiar de partida sin recargar, formato de números, errores).
- La meta de hoy no es "haber visto" la solución: es poder **rehacerla y cambiarla rápido**.

Qué es cada archivo y cómo correr cada proyecto: [README](README.md). Trampas y checklist:
[ESTRATEGIA-EXAMEN.md](ESTRATEGIA-EXAMEN.md). Paso a paso del día: [PLAN-DE-RUTA-EXAMEN.md](PLAN-DE-RUTA-EXAMEN.md).

---

## Plan de la tarde (~5 h con pausas)

### Bloque 0 — Preparar el entorno (10 min)

```bash
cd parciales/simulacro-prueba3-2026sem2-matutino && npm start    # w → http://localhost:8081
```
Usá la app: nombre vacío (botón deshabilitado), jugar, acertar → Siguiente, **F5 a mitad de
partida**, perder, Jugar de nuevo, Volver al inicio (¿apareció tu puntaje en el ranking?),
`/games/1` (partida terminada), `/games/9999`. Así sabés **qué** hace antes de leer **cómo**.
Si podés, abrila también en el celular con **Expo Go** (misma red Wi-Fi).

### Bloque 1 — Lo que cambia de web a RN (45 min)

Leé rápido [`clase/`](clase/00-INDICE-CLASE.md) temas **1 a 9** (son cortos: lo de React que sigue
igual ya lo sabés). Lo que tenés que poder hacer sin mirar:
- Traducir `div/p/img/input/button/ul` a `View/Text/Image/TextInput/Button/FlatList`.
- Un `StyleSheet` con una fila (`flexDirection: 'row'`).
- Una pantalla nueva en Expo Router (archivo en `app/` + `Stack.Screen` en `_layout`) y navegar con `router.push` y `<Link>`.

### Bloque 2 — Entender la solución del simulacro (45 min)

Con `parciales/simulacro-prueba3-2026sem2-matutino/APUNTES-PARCIAL.md` abierto, leé el código en
este orden ([tema 18](clase/18-lectura-guiada-parcial.md) es la lectura guiada):

1. `README.md` (enunciado) + `mobile/data/games.js` (qué devuelve cada endpoint).
2. `mobile/app/_layout.jsx` → el `Stack`.
3. `mobile/hooks/useFetchJSON.js`, `useCreateGame.js` → el patrón de datos.
4. `mobile/app/index.jsx` → TextInput, botón deshabilitado, FlatList, `useFocusEffect`.
5. `mobile/app/games/[id].jsx` → fases, `result.stat` vs `game.stat`, estado derivado por id.
6. `mobile/common/format.js`, `components/CountryCard.jsx`.

**Autoevaluación** (en voz alta):
- ¿Por qué el ranking se refresca con `useFocusEffect` y no con `useEffect`?
- ¿Por qué el resultado se muestra con `result.stat` y no con `game.stat`?
- ¿Qué pasaría en "Jugar de nuevo" si no comparara `game.id` con el `id` de la URL?
- ¿Por qué `router.dismissTo('/')` y no `router.back()`?
- ¿Por qué la imagen necesita `expoDevServerUri` y `width`/`height`?
- ¿Por qué no puedo hacer `setResult(null)` directo en un `useEffect`?

### ☕ Pausa (10 min)

### Bloque 3 — Rehacer el simulacro SIN mirar, con reloj (90 min)

En `parciales/practica-matutino/` (plantilla limpia, ya con `npm install`). Cronómetro de
**90 minutos**. Solo podés mirar [`CHULETA-EXAMEN.md`](CHULETA-EXAMEN.md) y `clase/`, **no** la solución:

1. (10') Copiar/escribir `useFetchJSON` y `format.js`.
2. (20') Inicio: nombre + Jugar (POST → navegar) + ranking.
3. (30') Partida: GET, 404, dos países, pregunta, Más/Menos deshabilitados mientras espera.
4. (15') Resultado: Siguiente / fin de partida / Jugar de nuevo / Volver.
5. (10') Casos: partida terminada al entrar, F5, formato de números, ranking actualizado al volver.
6. (5') `npm run lint` limpio.

Recién al terminar comparás con la solución. **Anotá en papel lo que te trabó.**

### ☕ Pausa (15 min)

### Bloque 4 — Variantes (45 min)

Sobre tu práctica (o sobre la resuelta), hacé **3 variantes** del recetario (sección de variantes de
los apuntes del simulacro). Las más probables primero: una **pantalla nueva** (ranking aparte o
detalle de partida), algo de **estado local** (vidas, temporizador, historial de rondas) y algo de
**persistencia** (AsyncStorage para recordar el nombre). ≤15 min cada una.

### Bloque 5 — Otro formato: trivia en el cliente (40 min)

Los parciales anteriores tienen la lógica del juego **en la app** (azar, vidas, puntaje). Si el
examen se parece a eso, te sirve haberlo visto:
1. (10') Leé `parciales/2026sem1-simulacro-prueba3-vespertino/APUNTES-PARCIAL.md` (trivia con `/game` y `/end`).
2. (30') Elegí **uno** de `parciales/2025sem2-*` y releé su `app/game.jsx` con los apuntes al lado
   (azar fuera del render, vidas, `router.push({ pathname, params })`).

### Bloque 6 — Repaso de trampas y kit del examen (25 min)

- [ ] Leer [`ESTRATEGIA-EXAMEN.md`](ESTRATEGIA-EXAMEN.md) §4 (todas las trampas).
- [ ] Que todo esté **local**: probar `npm install --prefer-offline` en una copia de `practica-matutino`.
- [ ] Carpeta `P3/` completa en la compu (no en la nube), con los `node_modules` del simulacro instalados.
- [ ] Visor de apuntes funcionando sin internet: `cd visor-apuntes && npm start` → http://localhost:5191.
- [ ] Docs offline: [`docs-offline/INDICE.md`](docs-offline/INDICE.md).
- [ ] Tener abiertos: `PLAN-DE-RUTA-EXAMEN.md`, `CHULETA-EXAMEN.md`, los apuntes del simulacro y la
      solución en el editor.
- [ ] Saber hacer fork, clone, push y **Pull Request**.
- [ ] Anotar al principio de la chuleta tus 3–5 "cosas que me trabaron" del Bloque 3.
