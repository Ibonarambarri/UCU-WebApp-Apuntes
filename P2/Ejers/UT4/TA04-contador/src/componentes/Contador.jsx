// ==============================================
// Archivo: src/componentes/Contador.jsx
// Qué hace: muestra un número y dos botones para subirlo y bajarlo.
// Cada click cambia el estado y React vuelve a renderizar el componente
// para mostrar el número actualizado.
// Conceptos: useState, eventos onClick, re-render.
// ==============================================
import { useState } from 'react';
import './Contador.css';

function Contador() {
  // Estado: el número que se muestra. Empieza en 0.
  // setContador es la ÚNICA forma de cambiarlo y provoca un re-render.
  // (Si hiciéramos "let contador = 0; contador++" la pantalla NO cambiaría.)
  const [contador, setContador] = useState(0);

  // Se ejecuta al hacer click en "+1".
  function manejarClickAumentar() {
    setContador(contador + 1);
  }

  // Se ejecuta al hacer click en "-1".
  function manejarClickDisminuir() {
    setContador(contador - 1);
  }

  return (
    <div className="contador">
      {/* Mostramos el valor actual del estado */}
      <p className="contador-valor">{contador}</p>

      <div className="contador-botones">
        {/* OJO: onClick={manejarClickDisminuir} SIN paréntesis. Le pasamos la
            función para que React la llame al hacer click. Si pusiéramos
            manejarClickDisminuir() se ejecutaría en cada render. */}
        <button onClick={manejarClickDisminuir}>-1</button>
        <button onClick={manejarClickAumentar}>+1</button>
      </div>
    </div>
  );
}

export default Contador;
