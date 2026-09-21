// ==============================================
// Archivo: src/componentes/TarjetaDePais.jsx
// Qué hace: muestra UN país de la lista (bandera + nombre) como una tarjeta
// clickeable que lleva a la página de detalle de ese país.
// Conceptos: props, Link de react-router.
// ==============================================
import { Link } from 'react-router-dom';

// Recibe por props el objeto país tal como viene de la API:
// { name, alpha2Code, flags: { png, svg } }
function TarjetaDePais(props) {
  // Sacamos el país de las props para escribir menos abajo.
  const pais = props.pais;

  return (
    <li className="tarjeta">
      {/*
        Link es como un <a href> pero NO recarga la página: solo cambia la
        URL y react-router renderiza la Route que corresponda.
        Armamos la ruta concatenando el código: /countries/UY
      */}
      <Link to={'/countries/' + pais.alpha2Code}>
        <img
          className="bandera-chica"
          src={pais.flags.png}
          alt={'Bandera de ' + pais.name}
        />
        <p className="nombre-de-pais">{pais.name}</p>
      </Link>
    </li>
  );
}

export default TarjetaDePais;
