// ==============================================
// Archivo: src/App.jsx
// Qué hace: guarda el tema actual ('claro' u 'oscuro') en un estado, lo
// publica en el contexto junto con una función para alternarlo, y aplica
// la clase CSS del tema al contenedor principal.
// Conceptos: useState, Provider con value objeto, clases CSS dinámicas.
// ==============================================
import { useState } from 'react';
import ContextoTema from './contextos/ContextoTema.jsx';
import BotonCambiarTema from './componentes/BotonCambiarTema.jsx';
import TarjetaConTema from './componentes/TarjetaConTema.jsx';
import './App.css';

function App() {
  // Estado: el tema actual. Solo puede valer 'claro' u 'oscuro'.
  const [tema, setTema] = useState('claro');

  // Alterna entre los dos temas. La compartimos por contexto para que
  // cualquier componente pueda cambiar el tema sin recibir props.
  function cambiarTema() {
    if (tema === 'claro') {
      setTema('oscuro');
    } else {
      setTema('claro');
    }
  }

  // Objeto que se comparte con todos los consumidores del contexto.
  const valorDelContexto = {
    tema: tema,
    cambiarTema: cambiarTema,
  };

  // Elegimos la clase CSS del contenedor con un if según el tema.
  let claseContenedor = 'contenedor tema-claro';
  if (tema === 'oscuro') {
    claseContenedor = 'contenedor tema-oscuro';
  }

  return (
    <ContextoTema.Provider value={valorDelContexto}>
      {/* El contenedor cambia de clase (y por lo tanto de colores) con el tema */}
      <div className={claseContenedor}>
        <h1>TA14 - Contexto de tema</h1>

        {/* Componente 1: cambia el tema */}
        <BotonCambiarTema />

        {/* Componente 2: cambia su estilo según el tema */}
        <TarjetaConTema />
      </div>
    </ContextoTema.Provider>
  );
}

export default App;
