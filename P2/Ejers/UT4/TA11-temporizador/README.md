# TA11 - Temporizador con useEffect y limpieza

## Enunciado (TA 11, UT4)

> Crear una aplicación en ReactJS que muestre un temporizador que se incremente automáticamente cada segundo utilizando useEffect, y muestre dicho valor en pantalla. Tome las precauciones necesarias para que, cuando el componente sea desmontado, dicho temporizador no quede corriendo.

## Cómo correrlo

Las dependencias están en la carpeta padre `UT4/`, **no hace falta `npm install` acá**.

```bash
cd TA11-temporizador
npm run dev
```

Abrir la consola del navegador (F12) para ver los mensajes de "montado" / "desmontado".

## Archivos

```
TA11-temporizador/
  package.json
  vite.config.js
  index.html
  src/main.jsx                        -> createRoot + <StrictMode> + <App />
  src/App.jsx                         -> botón Montar/Desmontar + <Temporizador />
  src/App.css                         -> estilos
  src/componentes/Temporizador.jsx    -> setInterval en useEffect + limpieza
```

## Explicación paso a paso

1. **Estado `segundos`** con `useState(0)`.
2. **`useEffect` con `[]`**: al montar, arrancamos `setInterval(..., 1000)` y guardamos el id que devuelve en `idIntervalo`. Con `[]` el intervalo se crea una sola vez.
3. **Forma funcional del setState**: dentro del intervalo hacemos `setSegundos(function (valorAnterior) { return valorAnterior + 1; })`. **Por qué:** la función del `setInterval` se creó en el primer render, cuando `segundos` valía `0`. Si escribiéramos `setSegundos(segundos + 1)`, esa función "recuerda" el `0` de siempre (closure vieja) y el contador quedaría clavado en 1. Con la forma funcional, React nos pasa el valor más reciente cada vez.
4. **Función de limpieza**: el `useEffect` devuelve `function limpiar() { clearInterval(idIntervalo); }`. React la ejecuta cuando el componente se desmonta. Sin ella, el intervalo seguiría corriendo aunque el componente ya no esté en pantalla (fuga de memoria).
5. **Botón "Montar/Desmontar" en App**: con un estado `estaMontado` y un ternario, quitamos el `<Temporizador />` del árbol. Al quitarlo, React llama a `limpiar()` y en la consola aparece "se ejecuta clearInterval". Si volvemos a montarlo, arranca desde 0 (el estado se crea de nuevo).

## Sobre el doble montado de StrictMode

En `main.jsx` envolvemos la app en `<StrictMode>`. **Solo en desarrollo**, StrictMode monta cada componente, lo desmonta y lo vuelve a montar de inmediato. Por eso en la consola se ve al principio:

```
Temporizador montado: arranca el setInterval
Temporizador desmontado: se ejecuta clearInterval
Temporizador montado: arranca el setInterval
```

Esto es a propósito: React lo hace para comprobar que la limpieza del efecto está bien hecha. Si **no** limpiáramos el intervalo, quedarían dos intervalos corriendo y el contador subiría de a 2 por segundo. Como sí limpiamos, queda uno solo y sube de a 1. En producción (`npm run build`) StrictMode no hace nada.

## Qué concepto se practica

- `useEffect` con función de limpieza (`return function limpiar() {...}`).
- `setInterval` / `clearInterval` y por qué hay que guardar el id.
- Forma funcional de `setEstado` para evitar el problema de las closures viejas.
- Ciclo de vida montar/desmontar y qué pasa con los efectos.
- El doble montado de `StrictMode` en desarrollo.
