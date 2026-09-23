// ==============================================
// Archivo: src/main.jsx
// Qué hace: punto de entrada. Monta <App /> en el div#root, envuelto en
//           BrowserRouter (rutas) y en RecaudacionProvider (PUNTO 5: total
//           global disponible en toda la app, incluida la NavBar).
// Conceptos: createRoot, StrictMode, BrowserRouter, Provider de contexto.
// ==============================================

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import { RecaudacionProvider } from './context/RecaudacionProvider.jsx';
import './index.css';

// El Provider va ADENTRO del BrowserRouter y AFUERA de App: así cualquier
// componente (NavBar, páginas) puede usar tanto el router como el contexto.
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <RecaudacionProvider>
        <App />
      </RecaudacionProvider>
    </BrowserRouter>
  </StrictMode>,
);
