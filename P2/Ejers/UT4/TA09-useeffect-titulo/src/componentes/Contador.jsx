// ==============================================
// Archivo: src/componentes/Contador.jsx
// Qué hace: el mismo contador de TA04 (+1 / -1) pero además, cada vez que
// el contador cambia, actualiza el título del documento (lo que se ve en
// la pestaña del navegador) con useEffect.
// Conceptos: useState, useEffect, array de dependencias, document.title.
// ==============================================
import { useState, useEffect } from 'react';
import './Contador.css';

function Contador() {
  // Estado: el número que se muestra. Empieza en 0.
  const [contador, setContador] = useState(0);

  // Efecto: sincroniza el título de la pestaña con el contador.
  // Cambiar document.title NO es dibujar JSX, es tocar algo de "afuera" de
  // React (el navegador). Ese tipo de cosas van dentro de useEffect.
  //
  // Array de dependencias [contador]: le dice a React "ejecutá este efecto
  // la primera vez que se monta el componente Y cada vez que contador cambie".
  //   - Si pusiéramos []  -> se ejecutaría solo al montar y el título
  //                          quedaría fijo en "Contador: 0".
  //   - Si no pusiéramos nada -> se ejecutaría después de CADA render
  //                          (funciona, pero es innecesario y mala práctica).
  // Como al montar contador vale 0, el título por defecto es "Contador: 0".
  useEffect(function actualizarTitulo() {
    document.title = 'Contador: ' + contador;
  }, [contador]);

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
        <button onClick={manejarClickDisminuir}>-1</button>
        <button onClick={manejarClickAumentar}>+1</button>
      </div>

      <p className="contador-ayuda">Mirá el título de la pestaña del navegador.</p>
    </div>
  );
}

export default Contador;
