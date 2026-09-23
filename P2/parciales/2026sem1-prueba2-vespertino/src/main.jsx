// ==============================================
// Archivo: src/main.jsx
// Qué hace: punto de entrada. Monta <App /> dentro del div#root.
//           Envolvemos <App /> con <TasksProvider> (EJERCICIO 6) para que
//           TODA la app, incluido el propio App, pueda usar el contexto.
// Conceptos: createRoot, StrictMode, Provider de contexto.
// ==============================================

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import { TasksProvider } from './context/TasksProvider.jsx';
import './index.css';

// Decisión: el Provider va ACÁ (afuera de App) y no adentro de App, porque
// App también necesita hacer useContext(TasksContext) para handleSave.
// Un componente NO puede consumir un contexto que él mismo renderiza.
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <TasksProvider>
      <App />
    </TasksProvider>
  </React.StrictMode>
);
