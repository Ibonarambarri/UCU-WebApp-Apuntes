# TA15 - Dos contextos: idioma y tema

## Enunciado (TA 15, UT4)

> Crear dos contextos diferentes: uno para gestionar el idioma de la aplicación y otro para gestionar el tema (oscuro/claro). Se tiene que proporcionar estos dos contextos a tu aplicación de manera que los componentes puedan consumir tanto el idioma como el tema. Crear un componente que muestre el tema actual y otro que muestre el idioma actual.

## Cómo correrlo

Las dependencias están en la carpeta padre `UT4/`, **no hace falta `npm install` acá**.

```bash
cd TA15-dos-contextos
npm run dev
```

## Archivos

```
TA15-dos-contextos/
  package.json
  vite.config.js
  index.html
  src/main.jsx                          -> createRoot + <App />
  src/App.jsx                           -> dos estados + dos Providers anidados
  src/App.css                           -> .tema-claro / .tema-oscuro
  src/textos.js                         -> diccionario { es: {...}, en: {...} }
  src/contextos/ContextoTema.jsx        -> createContext({ tema, cambiarTema })
  src/contextos/ContextoIdioma.jsx      -> createContext({ idioma, cambiarIdioma })
  src/componentes/Titulo.jsx            -> usa idioma
  src/componentes/Controles.jsx         -> usa los dos (botones para cambiarlos)
  src/componentes/MostrarTema.jsx       -> muestra el tema actual (usa los dos)
  src/componentes/MostrarIdioma.jsx     -> muestra el idioma actual (usa idioma)
```

## Explicación paso a paso

1. **Dos archivos de contexto**, uno por responsabilidad. Cada uno con su `createContext` y su valor por defecto.
2. **App** tiene dos estados (`tema`, `idioma`) y dos funciones para alternarlos. Arma un objeto `valorTema` y otro `valorIdioma`.
3. **Providers anidados**:
   ```jsx
   <ContextoTema.Provider value={valorTema}>
     <ContextoIdioma.Provider value={valorIdioma}>
       ...
     </ContextoIdioma.Provider>
   </ContextoTema.Provider>
   ```
   **El orden de anidación no importa** porque son contextos independientes: cada `useContext(X)` busca hacia arriba solo el Provider de `X`. Se podría poner Idioma afuera y Tema adentro y todo seguiría igual.
4. **Diccionario `textos.js`**: un objeto con una clave por idioma. Los componentes hacen `textos[contextoIdioma.idioma]` y leen de ahí las etiquetas.
5. **Consumir varios contextos en un componente**: se llama `useContext` una vez por contexto (ver `Controles` y `MostrarTema`). Es totalmente válido.
6. `MostrarTema` muestra el tema actual (con la clase CSS correspondiente) y `MostrarIdioma` muestra el idioma actual, como pide el enunciado.

## Qué concepto se practica

- Varios contextos independientes en una misma app.
- Anidar Providers (y entender que el orden no importa).
- Llamar `useContext` varias veces en el mismo componente.
- Traducción simple con un diccionario de textos por idioma.
