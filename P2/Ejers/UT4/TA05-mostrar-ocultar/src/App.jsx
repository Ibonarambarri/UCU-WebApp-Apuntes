// ==============================================
// Archivo: src/App.jsx
// Qué hace: muestra un botón que al hacer click hace aparecer o desaparecer
// un texto. Se guarda en estado un booleano (true = visible, false = oculto)
// y se decide en el JSX si se dibuja el párrafo o no.
// Conceptos: useState con booleano, render condicional con ternario.
// ==============================================
import { useState } from 'react';
import './App.css';

function App() {
  // Estado: indica si el texto está visible o no. Empieza visible (true).
  const [textoVisible, setTextoVisible] = useState(true);

  // Se ejecuta al hacer click en el botón. Invierte el booleano:
  // si estaba en true pasa a false y viceversa.
  function manejarClickAlternar() {
    setTextoVisible(!textoVisible);
  }

  return (
    <div className="app">
      <h1>TA05 - Mostrar / ocultar texto</h1>

      {/* El texto del botón cambia según el estado, para que el usuario
          sepa qué va a pasar al hacer click. */}
      <button onClick={manejarClickAlternar}>
        {textoVisible ? 'Ocultar texto' : 'Mostrar texto'}
      </button>

      {/* Render condicional: si textoVisible es true dibujamos el párrafo,
          si es false devolvemos null (React no dibuja nada con null). */}
      {textoVisible ? (
        <p className="texto">Hola! Este es el texto que aparece y desaparece.</p>
      ) : null}
    </div>
  );
}

export default App;
