# CLAUDE.md — Preparación Parcial 3 (DWYM, FIT-UCU)

## Contexto

- Estudiante de **Desarrollo Web y Mobile** (FIT-UCU, Uruguay, 2026sem2) preparando el **Parcial 3**:
  **React Native + Expo SDK 58 + Expo Router**. Examen de ~2 h, **sin internet ni IA**, pero puede
  usar todo lo que tenga en la compu. Entrega por Pull Request a su fork.
- Ya aprobó/preparó el **P2 (React web + React Router + Context)**: domina useState, useEffect, props,
  hooks propios, Context. Material del P2 en `../P2/` (su teoría en `../P2/clase/`).
- En la clase y en el chat: español, explicaciones directas, enfocadas en **lo que cambia** respecto de React web.

## Mapa del material (todo en `P3/`)

| Qué | Dónde |
|---|---|
| Punto de entrada | `README.md` |
| Paso a paso durante el examen | `PLAN-DE-RUTA-EXAMEN.md` |
| Fragmentos para copiar / trampas / plan de estudio | `CHULETA-EXAMEN.md`, `ESTRATEGIA-EXAMEN.md`, `GUIA-ESTUDIO-TARDE.md` |
| Teoría (registro escrito de la clase), 18 temas | `clase/00-INDICE-CLASE.md` … `clase/18-lectura-guiada-parcial.md` |
| **Simulacro 2026sem2 resuelto** (Higher / Lower) + recetario V1–V17 | `parciales/simulacro-prueba3-2026sem2-matutino/` (`APUNTES-PARCIAL.md`) — `origin` = fork del usuario, `upstream` = repo del curso |
| Plantilla limpia para practicar | `parciales/practica-matutino/` |
| Parciales anteriores resueltos | `parciales/2026sem1-*`, `parciales/2025sem2-*`, `parciales/2025sem1-*` (formato viejo) |
| Docs offline (RN, Expo SDK 58, AsyncStorage) | `docs-offline/INDICE.md` |
| Visor/buscador | `visor-apuntes/` → `npm start` → http://localhost:5191 (`npm run build-index` si cambian los .md). Depende de archivos NO versionados (node_modules, public/models, public/ort, public/data, docs-offline): en un clon nuevo hay que regenerarlos con internet |

Correr el simulacro: `cd parciales/simulacro-prueba3-2026sem2-matutino && npm start` → `w` (puerto 8081).
Lint: `npm run lint` **y** `cd mobile && npx eslint .` (expo lint no mira `hooks/` ni `common/`).

## Formato de la clase (cómo darla)

1. **Un tema por mensaje**, siguiendo `clase/NN-*.md` como guion. Explicar con ejemplos del código
   del simulacro y comparando con lo que ya sabe del P2. No volcar el archivo entero: resumir lo esencial y las trampas.
2. Dejar espacio para dudas ("¿Alguna duda de este tema?").
3. Cerrar **cada tema con una pregunta de repaso** (la del "❓ Repaso" del archivo o una parecida).
   **No dar la respuesta**: esperar a que conteste, corregir y recién ahí pasar al siguiente tema.
4. Después de cada tema, **actualizar la sección "Progreso" de este archivo** (tema, si respondió bien, dudas que tuvo).
5. Al terminar el nivel 3 (tema 13): proponer hacer el simulacro con reloj (90 min) en
   `parciales/practica-matutino/` mirando solo la chuleta (Bloque 3 de la guía).

## Temario

| Nivel | Temas |
|---|---|
| 1 · De web a RN | 1 Anatomía proyecto Expo · 2 Qué sigue igual / qué cambia · 3 Componentes core · 4 Estilos y flexbox · 5 FlatList · 6 Formularios TextInput |
| 2 · Navegación | 7 Expo Router archivos y layouts · 8 Navegar y parámetros · 9 Ciclo de vida de pantallas ⭐ |
| 3 · Datos | 10 API `+api.js` y `fetchJSON` · 11 Hooks de datos · 12 Lógica de juego / estados ⭐ · 13 Formatear datos |
| 4 · Estado compartido | 14 Context en RN · 15 AsyncStorage |
| 5 · Terminaciones | 16 Plataforma y extras · 17 Lint y React Compiler ⭐ · 18 Lectura guiada del simulacro |

## Progreso (actualizar después de cada tema)

| Tema | Estado | Notas |
|---|---|---|
| 1 Anatomía proyecto Expo | 🟡 explicado, **falta que responda la pregunta** | Pregunta pendiente: puso `useFetchRanking.js` en `mobile/app/hooks/` → 1) ¿qué está mal y dónde va? 2) ¿import con `@/`? 3) ¿qué hacés si Metro dice `Unable to resolve`? (Respuesta esperada: va en `mobile/hooks/` porque todo en `app/` es ruta; `import { useFetchRanking } from '@/hooks/useFetchRanking';`; `cd mobile && npx expo start -c`.) |
| 2–18 | ⬜ pendiente | |

**Próximo paso al retomar:** pedirle la respuesta a la pregunta del Tema 1 (o recordársela), corregir y dar el **Tema 2**.

## Pendientes fuera de la clase

- 2026-10-26: `P3/` commiteado y pusheado al repo WebApp (`origin` = github.com/Ibonarambarri/UCU-WebApp-Apuntes, antes Desarrollo-Web-y-Mobile-UCU).
- La solución del simulacro está en la rama `solucion` del fork, con PR abierto: https://github.com/Ibonarambarri/simulacro-prueba3-2026sem2-matutino/pull/1
- El repo del simulacro tiene su propio `.git` dentro de `P3/parciales/…`: para versionar cambios suyos en WebApp hay que apartar ese `.git` un momento al hacer `git add` (mismo truco que en P2).
