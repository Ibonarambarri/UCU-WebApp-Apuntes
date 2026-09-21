# TA05 - Mostrar / ocultar texto

## Enunciado

> Crear una aplicación en ReactJS donde al hacer click en un botón, un texto aparece o desaparece.

## Cómo correrlo

```bash
cd TA05-mostrar-ocultar
npm run dev
```

Las dependencias están en la carpeta padre `UT4/node_modules`, no hace falta `npm install`.

## Archivos

- `index.html` -> página base.
- `src/main.jsx` -> monta `<App />`.
- `src/App.jsx` -> el botón, el estado booleano y el párrafo condicional.
- `src/App.css` -> estilos del botón y del texto.

(Es tan chico que no hace falta una carpeta `componentes/`.)

## Explicación paso a paso

1. **Estado booleano**: `const [textoVisible, setTextoVisible] = useState(true)`.
2. **Función que alterna**: `manejarClickAlternar` hace `setTextoVisible(!textoVisible)`. El `!` invierte el valor.
3. **Render condicional con ternario**: en el JSX escribimos
   `{textoVisible ? <p>...</p> : null}`. Si es `true` React dibuja el `<p>`; si es `false` devuelve `null` y React no dibuja nada.
4. **Botón con texto dinámico**: `{textoVisible ? 'Ocultar texto' : 'Mostrar texto'}` para que diga lo que va a hacer.

## Qué concepto se practica

- **Estado booleano** y cómo invertirlo con `!`.
- **Render condicional**: en JSX no se puede usar `if` adentro de las llaves, por eso se usa el ternario `condicion ? <A/> : null`. (Otra opción es hacer el `if` antes del `return` y guardar el JSX en una variable.)
- **`null` en JSX no dibuja nada**: es la forma limpia de "no mostrar" un elemento.
