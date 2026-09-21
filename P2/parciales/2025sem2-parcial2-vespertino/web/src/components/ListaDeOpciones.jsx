// ==============================================
// Archivo: src/components/ListaDeOpciones.jsx
// Qué hace: componente REUTILIZABLE para las tres vistas de filtro
//   (/currencies, /languages, /timezones). Pide una lista a la API y muestra
//   cada elemento como un enlace a la vista de países filtrados.
//   Props:
//     props.titulo   -> texto del <h1>, ej: "Countries by currency"
//     props.url      -> URL de la API, ej: "/api/currencies"
//     props.rutaBase -> a dónde enlaza cada ítem, ej: "/currencies"
//                       (el enlace final es rutaBase + "/" + código)
// Trampa: las tres APIs devuelven formas distintas:
//     /api/currencies -> [{ code, name, symbol }]
//     /api/languages  -> [{ code, name }]
//     /api/timezones  -> ["UTC-03:00", ...]  (strings sueltos)
//   Por eso adentro hay una función que, según la forma del elemento,
//   calcula el código y el texto a mostrar.
// Conceptos: props, useEffect con [props.url], typeof, encodeURIComponent.
// ==============================================
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { obtenerJson } from '../services/api';

function ListaDeOpciones(props) {
  // Estado: elementos que devolvió la API (objetos o strings según la url).
  const [elementos, setElementos] = useState([]);
  const [estaCargando, setEstaCargando] = useState(true);
  const [mensajeDeError, setMensajeDeError] = useState('');

  // Efecto: pedir la lista. Dependencia [props.url] por si el componente se
  // reutiliza con otra url (en la práctica cada ruta tiene la suya).
  useEffect(() => {
    async function cargarElementos() {
      setEstaCargando(true);
      try {
        const datos = await obtenerJson(props.url);
        setElementos(datos);
        setMensajeDeError('');
      } catch (error) {
        console.error('Error cargando ' + props.url, error);
        setMensajeDeError('No se pudo cargar la lista.');
      }
      setEstaCargando(false);
    }
    cargarElementos();
  }, [props.url]);

  // Dado un elemento de la lista, devuelve su código (para armar el enlace).
  // Si es un string (zona horaria) el código es el string mismo.
  function obtenerCodigo(elemento) {
    if (typeof elemento === 'string') {
      return elemento;
    }
    return elemento.code;
  }

  // Dado un elemento, devuelve el texto a mostrar:
  //   zona horaria -> "UTC-03:00"
  //   lenguaje     -> "fra - French"
  //   moneda       -> "EUR - Euro - €"
  function obtenerTexto(elemento) {
    if (typeof elemento === 'string') {
      return elemento;
    }
    let texto = elemento.code + ' - ' + elemento.name;
    // Solo las monedas tienen símbolo; lo agregamos si existe.
    if (elemento.symbol !== undefined) {
      texto = texto + ' - ' + elemento.symbol;
    }
    return texto;
  }

  let contenido;
  if (mensajeDeError !== '') {
    contenido = <p className="mensaje-error">{mensajeDeError}</p>;
  } else if (estaCargando) {
    contenido = <p>Cargando...</p>;
  } else {
    contenido = (
      <ul className="lista">
        {/* .map: un <li> con Link por elemento. El código va en la URL con
            encodeURIComponent porque las zonas horarias tienen "+" y ":"
            ("UTC+01:00" -> "UTC%2B01%3A00"). useParams lo decodifica solo. */}
        {elementos.map((elemento) => (
          <li key={obtenerCodigo(elemento)} className="item-lista">
            <Link
              className="enlace-item enlace-centrado"
              to={props.rutaBase + '/' + encodeURIComponent(obtenerCodigo(elemento))}
            >
              {obtenerTexto(elemento)}
            </Link>
          </li>
        ))}
      </ul>
    );
  }

  return (
    <div className="pagina">
      <h1>{props.titulo}</h1>
      {contenido}
      <Link className="enlace-volver" to="/">Back to home</Link>
    </div>
  );
}

export default ListaDeOpciones;
