// ==============================================
// Archivo: src/componentes/BotonCambiarTema.jsx
// Qué hace: botón que CAMBIA el tema llamando a la función del contexto.
// No recibe props.
// Conceptos: useContext para ejecutar una función compartida.
// ==============================================
import { useContext } from 'react';
import ContextoTema from '../contextos/ContextoTema.jsx';

function BotonCambiarTema() {
  // Sacamos { tema, cambiarTema } del contexto.
  const contexto = useContext(ContextoTema);

  // Al hacer click delegamos en la función que vive en App.
  function manejarClickCambiarTema() {
    contexto.cambiarTema();
  }

  return (
    <button onClick={manejarClickCambiarTema}>
      {/* Ternario: el texto del botón dice a qué tema vamos a pasar */}
      {contexto.tema === 'claro' ? 'Pasar a tema oscuro' : 'Pasar a tema claro'}
    </button>
  );
}

export default BotonCambiarTema;
