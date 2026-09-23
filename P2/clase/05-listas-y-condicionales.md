# Tema 5 — Listas (`map` + `key`) y render condicional

## 5.1 `map` convierte datos en JSX

```jsx
<ul>
  {countries.map((country) => (
    <CountryCard key={country.code} country={country} />
  ))}
</ul>
```
"Por cada país, dame una `<CountryCard>`." React sabe dibujar un array de elementos.

⚠️ **Paréntesis vs llaves** después de la flecha:
```jsx
{countries.map((country) => ( <JSX /> ))}          // paréntesis → return implícito

{countries.map((country) => {                      // llaves → podés calcular antes…
  const esFavorito = isFavorite(country.code);
  return <CountryCard key={country.code} country={country} fav={esFavorito} />;  // …pero return OBLIGATORIO
})}
```
Llaves **sin** `return` → la lista sale **vacía** y no hay error. (`PagePlayers` usa la forma con llaves para calcular `getStats`.)

## 5.2 `key` = el DNI de cada elemento

- ✅ El **id de los datos**: `key={country.code}`, `key={player.id}`.
- ⚠️ `key={index}` solo si la lista **nunca** se reordena ni se borra.
  (Caso válido: las 9 casillas del tablero del tatetí.)
- Va en el elemento **de más afuera del `map`**.
- Si falta: funciona, pero la consola avisa *"Each child in a list should have a unique key prop"*.

⚠️ **Por qué el índice falla:** React usa la `key` para saber **qué fila es cuál** entre un render
y el siguiente. Si borrás la fila 0, la que era 1 pasa a tener `key={0}` → React cree que es la
misma fila de antes y le deja el estado de la otra (ej.: un input en modo edición muestra el texto
de la fila borrada). Sin id en los datos: una combinación única, ej. `key={zona}` (el propio string).

**Lógica por fila:** con llaves en el `map` podés decidir qué dibujar en cada una (TA08, modo edición):
```jsx
{tareas.map((tarea) => {
  if (tarea.id === idEditando) return <li key={tarea.id}>…input + Guardar…</li>;
  return <li key={tarea.id}>{tarea.texto} …✏ 🗑</li>;
})}
```

## 5.3 Render condicional: 4 herramientas

**a) `&&` — esto o nada**
```jsx
{favoritesError && <StatusMessage type="error" text={favoritesError.message} />}
```
⚠️ `{lista.length && <p>…</p>}` con lista vacía **muestra "0"**. Usar `{lista.length > 0 && …}`.
Por eso la guía del curso (y las soluciones de `Ejers/` y parciales 2025) prefiere el **ternario con
`null`**: `{visible ? <p>Hola</p> : null}`. Las dos formas valen; elegí una y no te olvides del `> 0`.

**b) Ternario — esto o aquello**
```jsx
{borders.length === 0
  ? <p>Este país no tiene fronteras terrestres.</p>
  : <ul>{borders.map(…)}</ul>}
```

**c) Variable + `if` antes del `return` — 3+ casos (el más usado)**
```jsx
let content;
if (isLoading)               content = <p>Cargando…</p>;
else if (error)              content = <p>Error: {error.message}</p>;
else if (lista.length === 0) content = <p>No hay resultados.</p>;
else                         content = <ul>{lista.map(…)}</ul>;

return <div><Header title="Países" />{content}</div>;
```
(`PageCountryList.jsx`, `PagePlay.jsx`.) El título y los controles quedan siempre; cambia solo lo de abajo.

**d) `return` temprano — cuando cambia TODA la pantalla**
```jsx
if (isLoading) return <p>Cargando país…</p>;
if (error)     return <p>País no encontrado</p>;
return ( /* la página completa */ );
```
(`PageCountry.jsx`.) ⚠️ **Todos los hooks antes del primer `return`** (tema 7.6).

## 5.4 Qué dibuja React con cada valor

| Valor en `{ }` | Se ve |
|---|---|
| `'texto'`, `42` | el texto / número |
| `0` | **"0"** (¡ojo con `&&`!) |
| `null`, `undefined`, `false`, `true` | nada |
| array de JSX | cada elemento |
| objeto `{…}` | 💥 *"Objects are not valid as a React child"* |

Ejemplo del último: `{country.languages}` explota (array de **objetos**).
Solución: `{country.languages.map((l) => l.name).join(', ')}`.

📂 **Verlo funcionando:** `Ejers/UT4/TA08-editar-tarea/src/componentes/ListaTareas.jsx` (map con dos modos),
`parciales/simulacro-prueba2-2026sem2-matutino/web/src/components/PageCountryList/PageCountryList.jsx` (variable `content`),
`parciales/simulacro-prueba2-2026sem2-matutino/web/src/components/PageCountry/PageCountry.jsx` (return temprano).

---

## ❓ Repaso

**Pregunta:** con `players` (array de `{ id, name }`): si está vacío → "Todavía no hay jugadores."; si no → `<ul>` con un `<li>` por nombre. Con ternario.

**Respuesta:**
```jsx
{players.length === 0 ? (
  <p>Todavía no hay jugadores.</p>
) : (
  <ul>
    {players.map((player) => (
      <li key={player.id}>{player.name}</li>
    ))}
  </ul>
)}
```
- `players.length === 0` como condición.
- Paréntesis en cada rama del ternario (JSX multilínea).
- `key={player.id}` en el `<li>` (lo de más afuera del map).
- Paréntesis después de la flecha → return implícito.
