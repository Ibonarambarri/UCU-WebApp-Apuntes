// ==============================================
// Archivo: src/components/PaisesPorMoneda.jsx
// Qué hace: ruta 5 "/currencies/:currencyCode". Lee el código de moneda de
//   la URL y reutiliza ListaDePaises pasándole el título y la url de la API
//   con el filtro. No tiene fetch propio: todo lo hace ListaDePaises.
// Conceptos: useParams, reutilización de componentes, encodeURIComponent.
// ==============================================
import { useParams } from 'react-router-dom';
import ListaDePaises from './ListaDePaises';

function PaisesPorMoneda() {
  // parametros.currencyCode viene de ":currencyCode" en la ruta.
  const parametros = useParams();
  const codigoDeMoneda = parametros.currencyCode;

  // Armamos la url de la API con el filtro en el query string.
  const url = '/api/countries?currency=' + encodeURIComponent(codigoDeMoneda);

  return (
    <ListaDePaises
      titulo={'Countries with currency ' + codigoDeMoneda}
      url={url}
    />
  );
}

export default PaisesPorMoneda;
