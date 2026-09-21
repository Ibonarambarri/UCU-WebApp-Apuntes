# TA01 - Card con props

## Enunciado

> Crear un componente Card, en ReactJS, que usando props despliegue la siguiente información: Título, Descripción, Persona asignada, Fecha inicio, Fecha de fin. Utilizar dicho componente para renderizar 3 Cards con diferente información. El componente debe tener un estilo asociado, pero dicho estilo queda a decisión del alumno.

## Cómo correrlo

```bash
cd TA01-card-props
npm run dev
```

Las dependencias (react, vite) están instaladas en la carpeta padre `UT4/node_modules`, no hace falta `npm install` acá.

## Archivos

- `index.html` -> página base con el `<div id="root">`.
- `src/main.jsx` -> monta `<App />` en el `root`.
- `src/App.jsx` -> usa el componente `Card` 3 veces con datos distintos.
- `src/App.css` -> estilos de la página y del contenedor de tarjetas.
- `src/componentes/Card.jsx` -> el componente Card, recibe todo por props.
- `src/componentes/Card.css` -> estilo de la tarjeta.

## Explicación paso a paso

1. **Crear el componente `Card`**: es una función `function Card(props)` que devuelve JSX. Dentro se usa `props.titulo`, `props.descripcion`, `props.personaAsignada`, `props.fechaInicio` y `props.fechaFin` para mostrar cada dato.
2. **Darle estilo**: se importa `./Card.css` desde el propio componente. Las clases `card`, `card-titulo`, etc. se aplican con `className` (en JSX no se usa `class`).
3. **Usar la Card desde `App`**: se importa `Card` y se escribe `<Card titulo="..." descripcion="..." ... />` tres veces con valores diferentes. Cada atributo que ponemos en la etiqueta llega al componente dentro del objeto `props`.
4. **Renderizar**: `main.jsx` hace `createRoot(document.getElementById('root')).render(<App />)`.

## Qué concepto se practica

- **Props**: es la forma de pasar datos de un componente padre a uno hijo. Son de solo lectura: el hijo nunca modifica `props`.
- **Reutilización**: el mismo componente sirve para muchas tarjetas, solo cambian los datos que recibe.
- **Nombres de props en camelCase**: `personaAsignada`, `fechaInicio` (no `persona-asignada`).
