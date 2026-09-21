// ==============================================
// Archivo: src/App.jsx
// Qué hace: guarda en estado lo que el usuario escribe en el componente
// Input y lo muestra en un párrafo aparte. El estado vive ACÁ (en App) y
// el Input solo lo recibe por props.
// Conceptos: useState, evento onChange, evento.target.value, input controlado.
// ==============================================
import { useState } from 'react';
import Input from './componentes/Input.jsx';
import './App.css';

function App() {
  // Estado: el texto que el usuario escribió. Empieza vacío.
  // Cada vez que cambia, React vuelve a renderizar App (y por lo tanto el <p>).
  const [textoDelInput, setTextoDelInput] = useState('');

  // Se ejecuta cada vez que el usuario escribe una tecla en el input.
  // "evento" es el evento del navegador; evento.target es el <input> y
  // evento.target.value es el texto completo que tiene ahora.
  function manejarCambioDeTexto(evento) {
    setTextoDelInput(evento.target.value);
  }

  return (
    <div className="app">
      <h1>TA03 - Input controlado</h1>

      {/* Le pasamos al Input el valor actual y la función para cambiarlo */}
      <Input
        etiqueta="Escribí un texto:"
        valor={textoDelInput}
        alCambiar={manejarCambioDeTexto}
      />

      {/* Párrafo aparte que muestra lo mismo que hay en el estado.
          Si el estado está vacío, avisamos que todavía no se escribió nada
          (ternario con null NO, acá siempre mostramos algo distinto). */}
      <p className="resultado">
        {textoDelInput === ''
          ? 'Todavía no escribiste nada.'
          : 'Escribiste: ' + textoDelInput}
      </p>
    </div>
  );
}

export default App;
