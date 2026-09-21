// ==============================================
// Archivo: src/main.jsx
// Qué hace: es el punto de entrada. Busca el <div id="root"> del index.html
// y le pide a React que dibuje ahí el componente <App />.
// En este ejercicio envolvemos App en <StrictMode> a propósito: en
// desarrollo, StrictMode monta -> desmonta -> vuelve a montar cada
// componente para comprobar que la limpieza del useEffect está bien hecha.
// ==============================================
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';

// Buscamos el elemento del HTML donde va a vivir la app.
const elementoRaiz = document.getElementById('root');

// Creamos la "raíz" de React y renderizamos App dentro.
// StrictMode no afecta al build de producción, solo ayuda en desarrollo.
const raiz = createRoot(elementoRaiz);
raiz.render(
  <StrictMode>
    <App />
  </StrictMode>
);
