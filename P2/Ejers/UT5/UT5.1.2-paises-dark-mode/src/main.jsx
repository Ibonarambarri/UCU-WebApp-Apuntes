// ==============================================
// Archivo: src/main.jsx
// Qué hace: punto de entrada. Busca el <div id="root"> del index.html y
// renderiza adentro la App envuelta en el ProveedorTema.
// Conceptos: createRoot, StrictMode, Provider de contexto.
// ==============================================
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ProveedorTema } from './contextos/ContextoTema.jsx';
import App from './App.jsx';

// Tomamos el div del index.html donde va a vivir toda la app.
const elementoRaiz = document.getElementById('root');

// ProveedorTema envuelve a App: así App (y todos sus hijos) pueden hacer
// useContext(ContextoTema). Si App no usara el contexto, el proveedor
// podría ir adentro de App; como App SÍ lo usa, tiene que ir afuera.
createRoot(elementoRaiz).render(
  <StrictMode>
    <ProveedorTema>
      <App />
    </ProveedorTema>
  </StrictMode>
);
