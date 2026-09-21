# Qué se preguntó en cada parcial 1

## Tabla cruda

| Año / turno | Ej 1 | Ej 2 | Ej 3 | Ej 4 |
|---|---|---|---|---|
| 2025sem2 simulacro | Grilla de comidas (emojis) | `genExp(n)` → expresión aleatoria | `fetch` a restcountries + favoritos que reordenan | CRUD tareas (json-server) |
| 2025sem2 matutino | Menú Los Pollos Hermanos (`@font-face`, 3 secciones) | Biblioteca: `prestarLibro`, `buscarLibros` | Display LED 7 segmentos (click → dígito random) | CRUD users: POST, PATCH rol, DELETE |
| 2025sem2 vespertino | CV de Voldemort (2 columnas, timeline) | Biblioteca: `devolverLibro`, `listarLibrosPrestados` | Dado (click → 1..6, pips) | CRUD products: POST, PUT stock, DELETE |
| 2026sem1 simulacro | Menú Internacional (tarjetas 2 col.) | `fieldListToObject` **+ tests automáticos** | Lista de colores + form que hace POST | — |
| 2026sem1 prueba | Programa Apollo (grilla 12 tarjetas) | `countriesForCurrency` **+ tests automáticos** | Combos de color 👍/👎 + historial | — |

## Lo que se repite (apostá a esto)

1. **Siempre hay un maquetado HTML+CSS puro desde una imagen.** Sin JS, sin
   frameworks. Y desde 2026 **siempre piden que sea responsivo**.
2. **Siempre hay una función pura sobre arrays/objetos.** Desde 2026 viene con
   `ej0X.test.js` que no podés modificar → la nota es binaria, o pasan o no.
3. **Siempre hay DOM + `fetch`.** En 2025 eran dos ejercicios separados (uno de
   DOM puro, otro de API); en 2026 se fusionaron en uno solo con `json-server`.
4. El helper `fetchJSON(path, options)` **te lo dan escrito** en 2026. No lo
   reescribas, usalo.
5. El emoji como imagen aparece en 3 de 5. Nunca piden imágenes reales salvo
   cuando te dan `/assets`.

## Tendencia 2025 → 2026

- Menos ejercicios (4 → 3) pero más exigentes.
- Aparecen los **tests automáticos**: los tests son la consigna real. Leelos
  antes de escribir una línea.
- El ejercicio de API dejó de ser "consumí una API pública" y pasó a ser
  "json-server local" (porque en la prueba no hay internet).
- El maquetado dejó de ser pixel-perfect con assets y pasó a ser
  grilla-responsiva-con-emojis. Más fácil de acertar.

## Los tests te dicen exactamente qué validar

En los dos ejercicios con tests, el patrón de asserts fue idéntico:

1. que exportes una función con ese nombre exacto
2. **caso vacío** → `[]` o `{}`
3. 2-4 casos normales con `deepEqual`
4. caso "no encontrado" → vacío, no `undefined`
5. argumento faltante → vacío
6. `assert.throws` con `undefined` / `null`
7. `assert.throws` con datos mal formados

Si tu función cubre esos 7, pasás.
