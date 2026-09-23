# Tema 6 — Eventos

## 6.1 Cómo se conecta un evento

```jsx
<button onClick={handleClick}>Guardar</button>
```
- camelCase: `onClick`, `onChange`, `onSubmit`.
- Recibe una **función**:

```jsx
onClick={handleClick}          // ✅ pasa la función
onClick={() => borrar(id)}     // ✅ flecha: cuando hay que pasar argumentos
onClick={handleClick()}        // ❌ la EJECUTA al dibujar
```
⚠️ Si esa función hace un `setAlgo`, la versión con paréntesis entra en bucle (dibujar → set →
dibujar…) y React corta con *"Too many re-renders. React limits the number of renders to prevent
an infinite loop"*. Si ves ese mensaje, buscá un `onX={f(...)}` sin flecha.

## 6.2 El objeto `event` (solo 3 cosas importan)

```jsx
// 1) Lo escrito en un input / elegido en un select
<input onChange={(event) => setName(event.target.value)} />
<select onChange={(event) => setPlayerXId(event.target.value)}>

// 2) Checkbox: .checked (NO .value)
<input type="checkbox" onChange={(event) => setSoloFavs(event.target.checked)} />

// 3) Formulario: frenar la recarga de la página
function handleSubmit(event) {
  event.preventDefault();      // SIEMPRE, primera línea
  …
}
<form onSubmit={handleSubmit}>
```
- `event.target` = el elemento que disparó el evento.
- `event.target.value` es el **valor completo** del campo en ese momento (`"Uru"`), no la tecla que apretaste.
- ⚠️ `event.target.value` es **siempre string** (también en `type="number"` y selects con ids).
  Número → `Number(event.target.value)`.
- ⚠️ Sin `preventDefault()` el form **recarga la página** y se pierde el estado.

## 6.3 Los tres del examen

| Evento | Dónde | Para qué |
|---|---|---|
| `onClick` | `button` (y cualquier elemento) | acciones: estrella, borrar, jugar |
| `onChange` | `input`, `select`, `textarea`, checkbox | cada cambio (**cada tecla**) |
| `onSubmit` | `form` | Enter en el input **o** botón `type="submit"` |

Un `<button>` dentro de un `<form>` **envía por defecto**. Para uno que no envíe
("Cancelar"): `type="button"`.

📂 **Verlo funcionando:** `Ejers/UT4/TA04-contador/src/componentes/Contador.jsx` (`onClick`),
`Ejers/UT4/TA07-borrar-tarea/src/componentes/ListaTareas.jsx` (flecha para pasar el id),
`parciales/simulacro-prueba2-2026sem2-vespertino/web/src/components/PlayersSelection/PlayersSelection.jsx` (`onChange` de select + `onSubmit`).

---

## ❓ Repaso

**Pregunta:** el `onChange` de un `<input>` que guarda lo escrito en `const [q, setQ] = useState('')`.

**Respuesta:**
```jsx
<input value={q} onChange={(event) => setQ(event.target.value)} />
```
El `value={q}` lo hace **controlado** (el input siempre muestra lo que dice el estado) → tema 8.
