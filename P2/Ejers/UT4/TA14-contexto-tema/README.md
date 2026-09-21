# TA14 - Contexto de tema (claro / oscuro)

## Enunciado (TA 14, UT4)

> Crear un contexto que gestione un tema (oscuro o claro) en una aplicación ReactJS. Para ello, crear dos componentes: uno que cambie el tema y otro que cambie su estilo en función del tema actual. Implementar dos estilos diferentes para los temas y cambiar entre ellos cuando el contexto se actualice.

## Cómo correrlo

Las dependencias están en la carpeta padre `UT4/`, **no hace falta `npm install` acá**.

```bash
cd TA14-contexto-tema
npm run dev
```

## Archivos

```
TA14-contexto-tema/
  package.json
  vite.config.js
  index.html
  src/main.jsx                            -> createRoot + <App />
  src/App.jsx                             -> estado tema + Provider + clase del contenedor
  src/App.css                             -> .tema-claro y .tema-oscuro
  src/contextos/ContextoTema.jsx          -> createContext({ tema, cambiarTema })
  src/componentes/BotonCambiarTema.jsx    -> CAMBIA el tema (llama contexto.cambiarTema)
  src/componentes/TarjetaConTema.jsx      -> LEE el tema y elige su clase CSS
```

## Explicación paso a paso

1. **Contexto** `ContextoTema` con value `{ tema, cambiarTema }`.
2. **App** tiene el estado `tema` (`'claro'` u `'oscuro'`) y la función `cambiarTema()` que lo alterna con un `if`. Publica ambos en el Provider.
3. **Dos estilos en CSS**: `.tema-claro` (fondo blanco, texto oscuro) y `.tema-oscuro` (fondo oscuro, texto claro). Son clases normales; lo único que hace React es decidir cuál poner.
4. **`BotonCambiarTema`**: hace `useContext(ContextoTema)` y en el click llama `contexto.cambiarTema()`. Esto cambia el estado en App -> App se re-renderiza -> el Provider reparte el valor nuevo.
5. **`TarjetaConTema`**: hace `useContext(ContextoTema)` y elige su `className` con un ternario: `contexto.tema === 'claro' ? 'tarjeta tema-claro' : 'tarjeta tema-oscuro'`. Al cambiar el contexto, se re-renderiza con la otra clase y cambia de colores.
6. El contenedor principal en App también elige su clase con un `if`, para que el fondo de toda la página cambie.

## Qué concepto se practica

- Un contexto que comparte un estado y una función para modificarlo.
- Separar "quien cambia" (botón) de "quien reacciona" (tarjeta) sin props.
- Clases CSS dinámicas con `if` / ternario en `className`.
- Re-render automático de todos los consumidores cuando cambia el `value`.
