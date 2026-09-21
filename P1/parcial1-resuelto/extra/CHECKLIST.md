# Checklist de la prueba

## Antes de escribir nada (5 min)

- [ ] `git clone` del fork, y **`npm install` en el ejercicio de API ya mismo**
      (si no hay internet y no está `node_modules`, avisá al docente enseguida).
- [ ] Abrí los 3 ejercicios y leé todo. Empezá por el que te salga más rápido.
- [ ] En el ejercicio con tests: **leé `ej0X.test.js` completo antes de
      implementar**. Ahí está la consigna real.

## Ejercicio de maquetado

- [ ] Mirá la imagen y contá: ¿cuántas columnas? ¿hay marco exterior? ¿footer?
- [ ] Escribí primero **todo el HTML** con clases semánticas, después el CSS.
- [ ] `* { box-sizing: border-box }` de entrada.
- [ ] La grilla: `grid-template-columns: repeat(auto-fit, minmax(280px, 1fr))`.
      Con eso ya cumplís "responsivo".
- [ ] Achicá la ventana antes de entregar. Que no aparezca scroll horizontal.
- [ ] No borres el `<link rel="stylesheet">` ni renombres archivos.

## Ejercicio de función pura

- [ ] `export function nombreExacto(...)` — el nombre lo dice el test.
- [ ] Corré `node ejXX/ejXX.test.js` **después de cada cambio**.
- [ ] Cubrí: vacío, normal, no-encontrado, sin-argumento, null/undefined (throw),
      formato inválido (throw).
- [ ] Si no encuentra nada devolvé `[]` / `{}`, **nunca** `undefined`.
- [ ] No modifiques el archivo de tests (te lo dicen y lo revisan).

## Ejercicio DOM + API

- [ ] `npm start` y abrí `http://localhost:3000/`.
- [ ] Escribí `loadX()` primero y verificá que se pinte la lista.
- [ ] Recién ahí el POST/PATCH/DELETE.
- [ ] **Después de cada operación exitosa, `await loadX()`.**
- [ ] Consola del navegador abierta todo el tiempo (F12).
- [ ] Antes de entregar, recargá la página: lo que guardaste tiene que seguir ahí.

## Errores que cuestan puntos (todos salieron en correcciones)

| Error | Fix |
|---|---|
| La página se recarga al enviar el form | `event.preventDefault()` |
| Se duplican los elementos al recargar | `replaceChildren` en vez de `append` |
| Mandás `id` en el POST | json-server lo genera él |
| `"5" + 1 === "51"` | `Number(input.value)` |
| `onclick="fn()"` no anda | el script es `type="module"` → usá `addEventListener` |
| `document.getElementById(...)` da `null` | el script corre antes del DOM → `defer` o `body onload` |
| `.sort()` te desordena el array original | `[...arr].sort(...)` |
| `import x from './d.json' assert {...}` falla | en Node nuevo es `with { type: 'json' }` |
| Todo blanco y sin error | mirá la consola: casi siempre es un typo en un id |

## Entrega

- [ ] `git add -A && git commit -m "..." && git push`
- [ ] **Pull request al repo forkeado** (es lo que dice el README y es parte de
      la consigna).
- [ ] Revisá que el PR tenga tus commits antes de irte.
