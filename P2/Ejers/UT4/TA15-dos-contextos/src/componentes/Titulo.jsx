// ==============================================
// Archivo: src/componentes/Titulo.jsx
// Qué hace: muestra el título de la app traducido según el contexto de idioma.
// Conceptos: useContext + diccionario de textos.
// ==============================================
import { useContext } from 'react';
import ContextoIdioma from '../contextos/ContextoIdioma.jsx';
import textos from '../textos.js';

function Titulo() {
  // Solo necesitamos el idioma.
  const contextoIdioma = useContext(ContextoIdioma);

  // textos['es'] o textos['en'] según el idioma actual.
  const textosDelIdioma = textos[contextoIdioma.idioma];

  return <h1>{textosDelIdioma.titulo}</h1>;
}

export default Titulo;
