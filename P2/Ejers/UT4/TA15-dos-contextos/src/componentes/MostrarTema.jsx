// ==============================================
// Archivo: src/componentes/MostrarTema.jsx
// Qué hace: muestra el tema actual. Lee el tema del ContextoTema y el
// idioma del ContextoIdioma (para traducir la etiqueta y el nombre del tema).
// Conceptos: consumir dos contextos, className dinámico.
// ==============================================
import { useContext } from 'react';
import ContextoTema from '../contextos/ContextoTema.jsx';
import ContextoIdioma from '../contextos/ContextoIdioma.jsx';
import textos from '../textos.js';

function MostrarTema() {
  const contextoTema = useContext(ContextoTema);
  const contextoIdioma = useContext(ContextoIdioma);
  const textosDelIdioma = textos[contextoIdioma.idioma];

  // El nombre del tema también se traduce: textos.es.claro = 'claro', textos.en.claro = 'light'
  const nombreDelTema = textosDelIdioma[contextoTema.tema];

  // Clase según tema.
  const claseTarjeta = contextoTema.tema === 'claro' ? 'tarjeta tema-claro' : 'tarjeta tema-oscuro';

  return (
    <div className={claseTarjeta}>
      <p>
        {textosDelIdioma.temaActual}: <strong>{nombreDelTema}</strong>
      </p>
    </div>
  );
}

export default MostrarTema;
