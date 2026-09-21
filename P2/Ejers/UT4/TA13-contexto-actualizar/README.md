# TA13 - Actualizar el contexto desde cualquier componente

## Enunciado (TA 13, UT4)

> Partiendo de la TA anterior, añadir la capacidad de actualizar el valor del nombre de usuario desde cualquier componente. Para eso, crear un componente input donde el usuario pueda escribir su nombre, y hacer que el valor del contexto se actualice en tiempo real.

## Cómo correrlo

Las dependencias están en la carpeta padre `UT4/`, **no hace falta `npm install` acá**.

```bash
cd TA13-contexto-actualizar
npm run dev
```

## Archivos

```
TA13-contexto-actualizar/
  package.json
  vite.config.js
  index.html
  src/main.jsx                          -> createRoot + <App />
  src/App.jsx                           -> estado + Provider con { nombre, setNombre }
  src/App.css                           -> estilos
  src/contextos/ContextoUsuario.jsx     -> createContext({ nombre, setNombre })
  src/componentes/Cabecera.jsx          -> rama 1 (intermedio) -> SaludoUsuario
  src/componentes/SaludoUsuario.jsx     -> LEE contexto.nombre
  src/componentes/Formulario.jsx        -> rama 2 (intermedio) -> InputNombre
  src/componentes/InputNombre.jsx       -> ESCRIBE con contexto.setNombre
```

Árbol de componentes:

```
App (Provider)
 ├── Cabecera
 │    └── SaludoUsuario   (lee)
 └── Formulario
      └── InputNombre     (escribe)
```

## Explicación paso a paso

1. **El value del Provider ahora es un objeto**: `{ nombre: nombre, setNombre: setNombre }`. En la TA12 pasábamos solo el string y los hijos podían leerlo pero no cambiarlo. Al meter también la función `setNombre` (que viene del `useState` de App), cualquier componente puede llamarla.
2. **Cómo se propaga el cambio**: `InputNombre` llama `contexto.setNombre(evento.target.value)`. Ese `setNombre` cambia el estado de **App**. App se re-renderiza, crea un `valorDelContexto` nuevo y el Provider avisa a todos los que hicieron `useContext(ContextoUsuario)`, que también se re-renderizan. Así `SaludoUsuario` muestra el nombre nuevo aunque esté en otra rama del árbol y nadie le haya pasado props.
3. **Input controlado**: `value={contexto.nombre}` y `onChange={manejarCambioNombre}`. El contexto es la única fuente de la verdad; el input solo refleja lo que hay ahí.
4. **Ramas distintas**: `SaludoUsuario` y `InputNombre` no son padre/hijo. Con props habría que "subir" el dato hasta App y "bajarlo" por la otra rama; con contexto no hace falta.

## Qué concepto se practica

- Contexto con value objeto `{ estado, setEstado }` para lectura y escritura.
- El estado sigue viviendo en un solo lugar (App); el contexto solo lo reparte.
- Input controlado conectado a un contexto.
- Comunicación entre componentes "hermanos" sin pasar por props.
