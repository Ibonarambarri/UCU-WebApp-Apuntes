# TA12 - Contexto de usuario (createContext + useContext)

## Enunciado (TA 12, UT4)

> Crear un contexto en una aplicación React que guarde el nombre de un usuario. Usar los hooks necesarios para que dentro del App.jsx, dicha información sea cargada en el contexto, y dentro de un componente, se muestre el nombre de dicho usuario, obtenido desde el contexto (no se pueden usar props).

## Cómo correrlo

Las dependencias están en la carpeta padre `UT4/`, **no hace falta `npm install` acá**.

```bash
cd TA12-contexto-usuario
npm run dev
```

## Archivos

```
TA12-contexto-usuario/
  package.json
  vite.config.js
  index.html
  src/main.jsx                          -> createRoot + <App />
  src/App.jsx                           -> useState con el nombre + Provider
  src/App.css                           -> estilos
  src/contextos/ContextoUsuario.jsx     -> createContext('')
  src/componentes/Panel.jsx             -> componente intermedio (no toca el nombre)
  src/componentes/SaludoUsuario.jsx     -> useContext y muestra el nombre
```

## Explicación paso a paso

1. **Crear el contexto** en `src/contextos/ContextoUsuario.jsx` con `createContext('')`. El argumento es el valor por defecto que se usa solo si no hay Provider por encima. Se exporta para que App y los componentes importen el mismo objeto.
2. **Cargar el valor en App**: `App` tiene un estado `nombreUsuario` y envuelve todo su JSX en `<ContextoUsuario.Provider value={nombreUsuario}>`. Todo lo que está adentro del Provider puede leer `value`.
3. **Componente intermedio `Panel`**: no recibe ni pasa ninguna prop. Está solo para demostrar que el contexto "salta" niveles (App -> Panel -> SaludoUsuario).
4. **Leer el valor en `SaludoUsuario`**: `const nombreUsuario = useContext(ContextoUsuario);`. React busca hacia arriba el Provider más cercano y devuelve su `value`.

Sin contexto habríamos tenido que hacer `<Panel nombre={nombreUsuario} />` y dentro `<SaludoUsuario nombre={props.nombre} />`: eso se llama *prop drilling* y es justo lo que el contexto evita.

## Qué concepto se practica

- `createContext` en su propio archivo (para poder importarlo desde cualquier lado).
- `Contexto.Provider` con `value` en el componente padre.
- `useContext(Contexto)` en un componente anidado varios niveles abajo.
- Evitar el *prop drilling*.
