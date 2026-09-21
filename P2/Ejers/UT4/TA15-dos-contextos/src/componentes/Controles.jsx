// ==============================================
// Archivo: src/componentes/Controles.jsx
// Qué hace: dos botones, uno cambia el tema y otro el idioma. Consume LOS
// DOS contextos a la vez: se puede llamar useContext varias veces en el
// mismo componente, una por contexto.
// Conceptos: consumir varios contextos.
// ==============================================
import { useContext } from 'react';
import ContextoTema from '../contextos/ContextoTema.jsx';
import ContextoIdioma from '../contextos/ContextoIdioma.jsx';
import textos from '../textos.js';

function Controles() {
  // Un useContext por cada contexto que necesitamos.
  const contextoTema = useContext(ContextoTema);
  const contextoIdioma = useContext(ContextoIdioma);

  // Textos traducidos para las etiquetas de los botones.
  const textosDelIdioma = textos[contextoIdioma.idioma];

  function manejarClickTema() {
    contextoTema.cambiarTema();
  }

  function manejarClickIdioma() {
    contextoIdioma.cambiarIdioma();
  }

  return (
    <div className="controles">
      <button onClick={manejarClickTema}>{textosDelIdioma.cambiarTema}</button>
      <button onClick={manejarClickIdioma}>{textosDelIdioma.cambiarIdioma}</button>
    </div>
  );
}

export default Controles;
