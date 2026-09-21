// ==============================================
// Archivo: src/components/PaisesPorLenguaje.jsx
// Qué hace: ruta 7 "/languages/:languageCode". Lee el código de lenguaje de
//   la URL y reutiliza ListaDePaises con la url filtrada por language.
// Conceptos: useParams, reutilización de componentes, encodeURIComponent.
// ==============================================
import { useParams } from 'react-router-dom';
import ListaDePaises from './ListaDePaises';

function PaisesPorLenguaje() {
  // parametros.languageCode viene de ":languageCode" en la ruta.
  const parametros = useParams();
  const codigoDeLenguaje = parametros.languageCode;

  const url = '/api/countries?language=' + encodeURIComponent(codigoDeLenguaje);

  return (
    <ListaDePaises
      titulo={'Countries with language ' + codigoDeLenguaje}
      url={url}
    />
  );
}

export default PaisesPorLenguaje;
