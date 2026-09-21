// ==============================================
// Archivo: src/components/ItemPais.jsx
// Qué hace: muestra UN ítem de una lista de países (bandera + nombre) con
//   enlace a /countries/:cca3.
// Por qué existe: la API de lista (GET /api/countries...) devuelve SOLO
//   códigos cca3 ("URY"), no el nombre. Entonces cada ítem pide por su cuenta
//   el detalle (GET /api/countries/URY) para saber el nombre. Mientras carga,
//   muestra el código. La bandera no necesita el fetch: es /flags/URY.svg.
// Conceptos: props, useState, useEffect con dependencia, fetch, Link.
// ==============================================
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { obtenerPais } from '../services/api';

// Recibe props.cca3 (código de tres letras del país).
function ItemPais(props) {
  // Estado: nombre del país. null hasta que llega la respuesta.
  const [nombre, setNombre] = useState(null);

  // Efecto: pedir el país al aparecer el componente.
  // Dependencia [props.cca3]: si cambia el código, volvemos a pedir.
  useEffect(() => {
    async function cargarNombre() {
      try {
        const pais = await obtenerPais(props.cca3);
        setNombre(pais.name.common);
      } catch (error) {
        // Si falla dejamos el código como nombre para que se vea algo.
        console.error('No se pudo cargar el país ' + props.cca3, error);
        setNombre(props.cca3);
      }
    }
    cargarNombre();
  }, [props.cca3]);

  // Ternario comentado: si ya tenemos nombre lo mostramos, si no el código.
  const textoAMostrar = nombre !== null ? nombre : props.cca3;

  return (
    <li className="item-lista">
      <Link to={'/countries/' + props.cca3} className="enlace-item">
        {/* La bandera se arma con el código, no hace falta esperar al fetch */}
        <img
          className="bandera-chica"
          src={'/flags/' + props.cca3 + '.svg'}
          alt={'Bandera de ' + textoAMostrar}
        />
        <span className="texto-item">{textoAMostrar}</span>
      </Link>
    </li>
  );
}

export default ItemPais;
