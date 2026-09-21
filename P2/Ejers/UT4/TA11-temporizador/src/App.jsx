// ==============================================
// Archivo: src/App.jsx
// Qué hace: muestra el Temporizador y un botón para montarlo/desmontarlo.
// El botón sirve para DEMOSTRAR que, al desmontar, el setInterval se
// limpia y no sigue corriendo (mirar la consola del navegador).
// Conceptos: renderizado condicional, montar/desmontar componentes.
// ==============================================
import { useState } from 'react';
import Temporizador from './componentes/Temporizador.jsx';
import './App.css';

function App() {
  // Estado: si es true el Temporizador está en pantalla (montado),
  // si es false lo sacamos del árbol (desmontado).
  const [estaMontado, setEstaMontado] = useState(true);

  // Invierte el estado en cada click.
  function manejarClickMontarDesmontar() {
    setEstaMontado(!estaMontado);
  }

  return (
    <div className="contenedor">
      <h1>TA11 - Temporizador con useEffect</h1>

      {/* El texto del botón depende del estado actual */}
      <button onClick={manejarClickMontarDesmontar}>
        {estaMontado ? 'Desmontar temporizador' : 'Montar temporizador'}
      </button>

      {/* Ternario: si está montado dibujamos el Temporizador, si no, nada.
          Cuando pasa de true a false React DESMONTA el componente y ejecuta
          la función de limpieza de su useEffect. */}
      {estaMontado ? <Temporizador /> : <p className="aviso">Temporizador desmontado. Mirá la consola: no debería seguir imprimiendo.</p>}
    </div>
  );
}

export default App;
