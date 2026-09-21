// ==============================================
// Archivo: src/componentes/MostrarIdioma.jsx
// Qué hace: muestra el idioma actual. Solo consume el ContextoIdioma.
// Conceptos: useContext.
// ==============================================
import { useContext } from 'react';
import ContextoIdioma from '../contextos/ContextoIdioma.jsx';
import textos from '../textos.js';

function MostrarIdioma() {
  const contextoIdioma = useContext(ContextoIdioma);
  const textosDelIdioma = textos[contextoIdioma.idioma];

  return (
    <div className="tarjeta-idioma">
      <p>
        {textosDelIdioma.idiomaActual}: <strong>{textosDelIdioma.nombreIdioma}</strong> ({contextoIdioma.idioma})
      </p>
    </div>
  );
}

export default MostrarIdioma;
