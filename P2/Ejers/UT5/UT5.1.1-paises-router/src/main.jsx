// ==============================================
// Archivo: src/main.jsx
// Qué hace: punto de entrada. Busca el <div id="root"> del index.html y
// renderiza adentro el componente App.
// Conceptos: createRoot, StrictMode.
// ==============================================
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';

// Tomamos el div del index.html donde va a vivir toda la app.
const elementoRaiz = document.getElementById('root');

// StrictMode no cambia nada visual: solo avisa en consola de errores comunes
// (en desarrollo ejecuta los efectos dos veces para detectar problemas).
createRoot(elementoRaiz).render(
  <StrictMode>
    <App />
  </StrictMode>
);
