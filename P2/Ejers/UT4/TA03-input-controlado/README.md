# TA03 - Input controlado

## Enunciado

> Crear un componente Input, en ReactJS, que permita al usuario ingresar información. Utilizar ese input para, en un párrafo aparte, mostrar la información que el usuario escribe.

## Cómo correrlo

```bash
cd TA03-input-controlado
npm run dev
```

Las dependencias están en la carpeta padre `UT4/node_modules`, no hace falta `npm install`.

## Archivos

- `index.html` -> página base.
- `src/main.jsx` -> monta `<App />`.
- `src/App.jsx` -> tiene el estado `textoDelInput` y muestra el párrafo.
- `src/App.css` -> estilos del input y del párrafo.
- `src/componentes/Input.jsx` -> componente Input, recibe `valor` y `alCambiar` por props.

## Explicación paso a paso

1. **El estado vive en App**: `const [textoDelInput, setTextoDelInput] = useState('')`. Empieza como string vacío.
2. **Función que actualiza el estado**: `manejarCambioDeTexto(evento)` hace `setTextoDelInput(evento.target.value)`. `evento.target` es el `<input>` del navegador y `.value` es su texto actual.
3. **El componente Input es "tonto"**: no tiene `useState`. Recibe por props `valor` (lo que tiene que mostrar) y `alCambiar` (la función a llamar cuando el usuario escribe) y las conecta a `value` y `onChange` del `<input>`.
4. **El párrafo aparte** lee el mismo estado: `{textoDelInput}`. Como el estado cambia en cada tecla, React re-renderiza y el párrafo se actualiza solo.

## Qué es un input controlado

Un input es **controlado** cuando su `value` sale de un estado de React y su `onChange` actualiza ese estado. Así React es la "única fuente de verdad": lo que se ve en pantalla es siempre lo que hay en el estado.

Trampa típica: si ponés `value={algo}` pero NO ponés `onChange`, el input queda bloqueado (no se puede escribir) y React muestra un warning en consola.

## Qué concepto se practica

- **useState** para guardar texto.
- **Input controlado**: `value` + `onChange`.
- **Levantar el estado** (lifting state up): el estado está en el padre y el hijo lo recibe por props, así el padre puede usar el texto en otro lugar (el párrafo).
- **`htmlFor`** en vez de `for` en el `<label>` (igual que `className` en vez de `class`).
