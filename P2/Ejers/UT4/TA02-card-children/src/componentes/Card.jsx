// ==============================================
// Archivo: src/componentes/Card.jsx
// Qué hace: muestra una "tarjeta". A diferencia de TA01, la Card NO sabe
// qué datos va a mostrar: solo dibuja el marco (borde, sombra, fondo) y
// adentro renderiza lo que el padre escribió ENTRE <Card> y </Card>.
// Ese contenido llega en una prop especial llamada props.children.
// Conceptos: props.children, componente "contenedor".
// ==============================================
import './Card.css';

function Card(props) {
  return (
    <div className="card">
      {/* props.children es TODO lo que el padre puso entre <Card> y </Card>.
          Puede ser texto, un elemento o varios elementos. */}
      {props.children}
    </div>
  );
}

export default Card;
