// ==============================================
// Archivo: src/components/PaisesPorZonaHoraria.jsx
// Qué hace: ruta 9 "/timezones/:timezone". Lee la zona horaria de la URL y
//   reutiliza ListaDePaises con la url filtrada por timezone.
// Trampa: la zona horaria tiene un "+" (UTC+01:00). useParams ya nos la
//   devuelve decodificada ("UTC+01:00"), pero al meterla en el QUERY STRING
//   de la API hay que volver a codificarla con encodeURIComponent, porque en
//   un query string el "+" se interpreta como espacio y el filtro no
//   encontraría nada (devolvería []).
// Conceptos: useParams, reutilización de componentes, encodeURIComponent.
// ==============================================
import { useParams } from 'react-router-dom';
import ListaDePaises from './ListaDePaises';

function PaisesPorZonaHoraria() {
  // parametros.timezone viene de ":timezone" en la ruta, ya decodificado.
  const parametros = useParams();
  const zonaHoraria = parametros.timezone;

  // "UTC+01:00" -> "UTC%2B01%3A00" dentro del query string.
  const url = '/api/countries?timezone=' + encodeURIComponent(zonaHoraria);

  return (
    <ListaDePaises
      titulo={'Countries with timezone ' + zonaHoraria}
      url={url}
    />
  );
}

export default PaisesPorZonaHoraria;
