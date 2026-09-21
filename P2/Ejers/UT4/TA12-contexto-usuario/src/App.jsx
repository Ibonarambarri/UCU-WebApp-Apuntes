// ==============================================
// Archivo: src/App.jsx
// Qué hace: guarda el nombre del usuario en un estado y lo "publica" en el
// contexto con <ContextoUsuario.Provider value={...}>. Todo lo que esté
// adentro del Provider puede leer ese valor con useContext.
// Conceptos: useState, Context.Provider, value.
// ==============================================
import { useState } from 'react';
import ContextoUsuario from './contextos/ContextoUsuario.jsx';
import Panel from './componentes/Panel.jsx';
import './App.css';

function App() {
  // Estado: el nombre del usuario. Lo cargamos acá, en App, como pide el
  // enunciado. (Podría venir de un fetch o de un login; acá es fijo.)
  const [nombreUsuario, setNombreUsuario] = useState('Ibon');

  return (
    // Provider: todo componente que esté ADENTRO (a cualquier profundidad)
    // puede leer "value" con useContext(ContextoUsuario).
    // Fijate que Panel NO recibe ninguna prop con el nombre.
    <ContextoUsuario.Provider value={nombreUsuario}>
      <div className="contenedor">
        <h1>TA12 - Contexto de usuario</h1>
        <p>App guarda el nombre en el contexto. Nadie recibe props.</p>
        <Panel />
      </div>
    </ContextoUsuario.Provider>
  );
}

export default App;
