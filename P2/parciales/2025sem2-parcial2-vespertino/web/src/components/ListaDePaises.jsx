// ==============================================
// Archivo: src/components/ListaDePaises.jsx
// Qué hace: componente REUTILIZABLE que muestra un título y una lista de
//   países (bandera + nombre con enlace al detalle).
//   Lo usan 4 rutas: /countries, /currencies/:code, /languages/:code y
//   /timezones/:tz. Lo único que cambia entre ellas es el título y la URL
//   de la API, así que eso lo recibe por props:
//     props.titulo -> texto del <h1>
//     props.url    -> URL de la API a pedir, ej: "/api/countries?currency=EUR"
// Conceptos: props, useEffect con dependencia [props.url], fetch, .map.
// ==============================================
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { obtenerJson } from '../services/api';
import ItemPais from './ItemPais';

function ListaDePaises(props) {
  // Estado: array de códigos cca3 que devolvió la API: ["ARG", "BRA", ...]
  const [codigosDePaises, setCodigosDePaises] = useState([]);
  // Estado: true mientras esperamos la respuesta.
  const [estaCargando, setEstaCargando] = useState(true);
  // Estado: mensaje si la API falla.
  const [mensajeDeError, setMensajeDeError] = useState('');

  // Efecto: pedir la lista de códigos.
  // Dependencia [props.url]: MUY IMPORTANTE. Si el usuario va de
  // /currencies/EUR a /currencies/USD, React Router reutiliza este mismo
  // componente y solo cambia la prop url. Gracias a la dependencia el efecto
  // se vuelve a ejecutar y pide la lista nueva.
  useEffect(() => {
    async function cargarPaises() {
      setEstaCargando(true);
      try {
        const codigos = await obtenerJson(props.url);
        setCodigosDePaises(codigos);
        setMensajeDeError('');
      } catch (error) {
        console.error('Error cargando ' + props.url, error);
        setMensajeDeError('No se pudo cargar la lista de países.');
      }
      setEstaCargando(false);
    }
    cargarPaises();
  }, [props.url]);

  // Decidimos qué mostrar con if/else en vez de && dentro del JSX.
  let contenido;
  if (mensajeDeError !== '') {
    contenido = <p className="mensaje-error">{mensajeDeError}</p>;
  } else if (estaCargando) {
    contenido = <p>Cargando países...</p>;
  } else if (codigosDePaises.length === 0) {
    contenido = <p>No hay países para mostrar.</p>;
  } else {
    contenido = (
      <ul className="lista">
        {/* .map: un ItemPais por cada código. key obligatoria en listas. */}
        {codigosDePaises.map((cca3) => (
          <ItemPais key={cca3} cca3={cca3} />
        ))}
      </ul>
    );
  }

  return (
    <div className="pagina">
      <h1>{props.titulo}</h1>
      {contenido}
      {/* Enlace para volver al inicio, útil en todas las listas */}
      <Link className="enlace-volver" to="/">Back to home</Link>
    </div>
  );
}

export default ListaDePaises;
