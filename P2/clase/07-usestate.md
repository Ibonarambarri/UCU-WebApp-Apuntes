# Tema 7 — `useState`: la memoria del componente

## 7.1 Por qué una variable normal no alcanza

```jsx
function Contador() {
  let count = 0;
  return <button onClick={() => { count = count + 1; }}>{count}</button>;
}
```
Clic → **sigue en 0**:
1. Cambiar una variable **no le avisa a React** que redibuje.
2. Aunque redibujara, la función corre **desde el principio** y `let count = 0` resetea.

## 7.2 `useState`

```jsx
import { useState } from 'react';

function Contador() {
  const [count, setCount] = useState(0);
  //      ↑ valor   ↑ para cambiarlo      ↑ valor inicial (solo la 1ª vez)
  return <button onClick={() => setCount(count + 1)}>{count}</button>;
}
```
- **Recuerda** el valor entre re-renders (React lo guarda afuera de tu función).
- **Llamar al setter avisa a React** → vuelve a dibujar.

```
clic → setCount(1) → React vuelve a llamar Contador() → useState devuelve 1 → pantalla muestra 1
```
**Toda app de React es esto repetido: evento → set → re-render → pantalla nueva.**

## 7.3 El estado es una "foto" (trampa del valor viejo)

```jsx
function handleClick() {
  setCount(count + 1);
  console.log(count);      // ⚠️ muestra el valor VIEJO
}
```
El setter **no cambia la variable al instante**: pide un re-render; el valor nuevo aparece en
la **próxima** ejecución. Si necesitás el nuevo, **calculalo en una variable**:
```jsx
const nuevo = count + 1;
setCount(nuevo);
if (nuevo === 10) alert('¡Llegaste a 10!');
```
("Calcular antes de decidir" — `2025sem2-simulacro-vespertino`.)

## 7.4 Setter con función (forma funcional)

```jsx
setCount((previo) => previo + 1);
```
Recibe **el valor más reciente**. Usala cuando el nuevo depende del anterior, sobre todo en
código asíncrono / `setInterval` o si llamás al setter varias veces seguidas.
En la plantilla: `setReloadIndex((index) => index + 1)`; en el matutino:
`setFavorites((list) => [...list, favorite])`.

## 7.5 Arrays y objetos: NUNCA modificar, SIEMPRE reemplazar

React compara **si es el mismo objeto**. Si modificás el original, React no se entera:
```jsx
tareas.push(nueva); setTareas(tareas);   // ❌
```
Las **3 recetas** (cubren todo CRUD):
```jsx
// AGREGAR
setTareas([...tareas, nueva]);

// BORRAR  (todas MENOS esa)
setTareas(tareas.filter((t) => t.id !== id));

// EDITAR  (misma lista, esa reemplazada por una copia modificada)
setTareas(tareas.map((t) => (t.id === id ? { ...t, estado: 'hecho' } : t)));
```
Objetos:
```jsx
setForm({ ...form, titulo: 'nuevo' });
```
(Trello `2026sem1-prueba2-vespertino`: crear/borrar/mover tareas. `FavoritesProvider` del matutino.)

## 7.6 Reglas de los hooks

Cualquier `use…` (useState, useEffect, useParams, tus useFetch…):
1. Solo **dentro de un componente** (o de otro hook).
2. **Siempre, en el mismo orden, arriba de todo.** Nunca dentro de `if`, `for`, ni **después
   de un `return` temprano**.

```jsx
function PageCountry() {
  const { code } = useParams();                   // ✅ hooks arriba
  const { data, isLoading } = useFetchCountry(code);
  if (isLoading) return <p>Cargando…</p>;         // return tempranos después
  …
}
```
React identifica cada hook por **su posición**. Lint: *"React Hook is called conditionally"*.
En el navegador: *"Rendered more hooks than during the previous render"* (un hook quedó después de un `return` temprano).

## 7.7 Estado propio por componente; se pierde al desmontar

- 3 `<Contador />` → 3 `count` independientes.
- Cuando un componente deja de dibujarse (**se desmonta**), su estado **se borra**.

Tatetí, "Play again" sin recargar: `PagePlay` pone `selectedPlayers` en `null` → deja de
dibujar `<TicTacToeGame>` → el tablero (en su `useTicTacToe`) desaparece → la próxima partida
arranca vacía. (El compañero usó `window.location.reload()`: funciona pero está mal.)

## 7.8 ¿Qué va en el estado?

Lo que **cambia con el tiempo y no se puede calcular** de otra cosa:
- ✅ texto de un input, jugadores elegidos, si terminó la partida, datos de la API.
- ❌ lista **filtrada**, **total**, "cuántos ganó" → se **calculan** ([tema 9](09-estado-derivado.md)).

## 7.9 Qué valor inicial darle

| Tipo | Ejemplo | Para qué |
|---|---|---|
| número | `useState(0)` | contador, puntaje, `proximoId` |
| string | `useState('')` | texto de un input, mensaje de error |
| booleano | `useState(false)` | visible/oculto, `isCreating` |
| `null` | `useState(null)` | "todavía nada": país cargado, fila que se edita |
| array | `useState([])` | lista de tareas, favoritos |
| objeto | `useState({ title: '', status: 'To Do' })` | formulario de varios campos (tema 8) |

```jsx
setVisible(!visible);                                 // alternar un booleano
const [modo, setModo] = useState(obtenerModoInicial); // función SIN paréntesis: corre 1 sola vez
```
(El valor inicial con función se usa para leer `localStorage` al arrancar, [tema 10](10-useeffect.md).)

## 7.10 CRUD en memoria: lo que completa las 3 recetas

```jsx
// LEER uno
const tarea = tareas.find((t) => t.id === id);        // undefined si no está

// Id propio cuando no hay backend: en ESTADO (un let volvería a 1 en cada render)
const [proximoId, setProximoId] = useState(1);
setTareas([...tareas, { id: proximoId, texto }]);
setProximoId(proximoId + 1);

// "Modo edición" por fila: guardar QUÉ fila se edita, no un booleano por tarea
const [idEditando, setIdEditando] = useState(null);   // null = ninguna
{tareas.map((t) => (t.id === idEditando
  ? <li key={t.id}><input … /> <button>Guardar</button></li>
  : <li key={t.id}>{t.texto} <button onClick={() => setIdEditando(t.id)}>✏</button></li>))}
```
Con backend el id lo pone el servidor y los cambios van primero a la API ([tema 11](11-api-fetch.md)).

📂 **Verlo funcionando:** `Ejers/UT4/TA04-contador/src/componentes/Contador.jsx` ·
`Ejers/UT4/TA08-editar-tarea/src/App.jsx` (agregar/borrar/editar + `idEditando`) ·
`parciales/simulacro-prueba2-2026sem2-matutino/web/src/context/FavoritesProvider.jsx`

---

## ❓ Repaso

**Pregunta:** con `const [favoritos, setFavoritos] = useState([])` (ej. `['URY', 'ARG']`),
una línea para: 1) agregar `'BRA'`; 2) quitar `'ARG'`.

**Respuesta:**
```jsx
setFavoritos([...favoritos, 'BRA']);                        // copia + el nuevo
setFavoritos(favoritos.filter((code) => code !== 'ARG'));   // todos MENOS 'ARG'
```
`filter` se queda con lo que da `true` → por eso `!==`.
