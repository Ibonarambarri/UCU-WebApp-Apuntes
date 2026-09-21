# TA02 - Card con children

## Enunciado

> Utilizando el componente creado anteriormente, modifíquelo para que en vez de mostrar la información utilizando props, use la prop children para renderizar la información solicitada.

## Cómo correrlo

```bash
cd TA02-card-children
npm run dev
```

Las dependencias están en la carpeta padre `UT4/node_modules`, no hace falta `npm install`.

## Archivos

- `index.html` -> página base con el `<div id="root">`.
- `src/main.jsx` -> monta `<App />`.
- `src/App.jsx` -> usa `<Card>...</Card>` 3 veces escribiendo el contenido adentro.
- `src/App.css` -> estilos generales.
- `src/componentes/Card.jsx` -> la Card ahora solo dibuja el marco y muestra `props.children`.
- `src/componentes/Card.css` -> estilo de la tarjeta (igual que en TA01).

## Explicación paso a paso

1. **Simplificar la Card**: ahora el componente no usa `props.titulo`, `props.descripcion`, etc. Solo devuelve `<div className="card">{props.children}</div>`.
2. **Escribir el contenido en el padre**: en `App.jsx`, en vez de `<Card titulo="..." />` (etiqueta que se cierra sola), escribimos `<Card> ... </Card>` con apertura y cierre, y adentro ponemos el `<h2>`, los `<p>`, etc.
3. **React arma `props.children` solo**: todo lo que queda entre la apertura y el cierre React lo mete en `props.children`. La Card lo recibe y lo pone donde escribimos `{props.children}`.

## Diferencia entre props "normales" y `props.children`

| | Props normales (TA01) | `props.children` (TA02) |
|---|---|---|
| Cómo se pasan | Como atributos: `<Card titulo="Hola" />` | Escribiendo adentro: `<Card><h2>Hola</h2></Card>` |
| Qué llega al hijo | `props.titulo === "Hola"` (un valor) | `props.children` (JSX, uno o varios elementos) |
| Quién decide la estructura | El **hijo** (la Card decide que el título va en un `<h2>`) | El **padre** (App decide qué elementos van adentro) |
| Cuándo conviene | Cuando todas las tarjetas tienen los mismos campos | Cuando el componente es un "contenedor" genérico (marco, modal, panel) |

Resumen: con props normales la Card es "rígida" pero muy fácil de usar; con `children` la Card es "flexible" (sirve para cualquier contenido) pero el padre tiene que escribir más.

Nota: `children` es una prop como cualquier otra, solo que React la llena automáticamente. Se accede con `props.children` y hay que respetar el nombre exacto en inglés.

## Qué concepto se practica

- **`props.children`**: la prop especial que contiene lo que se escribe entre la apertura y el cierre de un componente.
- **Componentes contenedor / de layout**: componentes que no saben qué van a mostrar, solo cómo enmarcarlo.
