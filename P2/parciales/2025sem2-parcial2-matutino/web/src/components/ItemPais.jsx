// ==============================================
// Archivo: src/components/ItemPais.jsx
// Qué hace: muestra UN ítem de la lista de países (bandera + nombre) y al
//   cliquearlo lleva a /country/:cca3.
// Por qué existe: la API de lista (GET /api/countries) devuelve SOLO códigos
//   cca3 ("URY"), no el nombre. Entonces cada ítem tiene que pedir por su
//   cuenta el detalle del país (GET /api/countries/URY) para saber el nombre.
//   Mientras carga, mostramos el código como texto provisorio.
// Conceptos: props, useState, useEffect con dependencia, fetch, Link.
// ==============================================
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { obtenerPais } from '../services/api';

// Recibe props.cca3 (el código de tres letras del país).
function ItemPais(props) {
  // Estado: el nombre del país. Empieza en null porque todavía no lo pedimos.
  const [nombre, setNombre] = useState(null);

  // Efecto: cuando el componente aparece (o cambia el cca3) pedimos el país.
  // Dependencia [props.cca3]: si el padre reutiliza este componente con otro
  // código, hay que volver a pedir los datos.
  useEffect(() => {
    async function cargarNombre() {
      try {
        const pais = await obtenerPais(props.cca3);
        setNombre(pais.name.common);
      } catch (error) {
        // Si falla, dejamos el código como nombre para que igual se vea algo.
        console.error('No se pudo cargar el país ' + props.cca3, error);
        setNombre(props.cca3);
      }
    }
    cargarNombre();
  }, [props.cca3]);

  // Mientras nombre es null mostramos el código (texto provisorio).
  // Ternario con comentario: si ya hay nombre lo mostramos, si no el código.
  const textoAMostrar = nombre !== null ? nombre : props.cca3;

  return (
    // Link de react-router: navega sin recargar la página.
    // El <li> queda fuera para que Home controle la lista.
    <li className="item-pais">
      <Link to={'/country/' + props.cca3} className="enlace-pais">
        {/* La bandera NO necesita esperar el fetch: la URL se arma con el código */}
        <img
          className="bandera-chica"
          src={'/flags/' + props.cca3 + '.svg'}
          alt={'Bandera de ' + textoAMostrar}
        />
        <span className="nombre-pais">{textoAMostrar}</span>
      </Link>
    </li>
  );
}

export default ItemPais;
