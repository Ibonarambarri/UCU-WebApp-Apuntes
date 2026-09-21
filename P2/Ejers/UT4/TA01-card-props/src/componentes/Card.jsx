// ==============================================
// Archivo: src/componentes/Card.jsx
// Qué hace: muestra una "tarjeta" con los datos de una tarea/proyecto.
// Recibe TODA la información por props (título, descripción, persona
// asignada, fecha de inicio y fecha de fin).
// Conceptos: componente funcional, props, JSX, CSS importado.
// ==============================================
import './Card.css';

// Componente Card. "props" es un objeto con todo lo que el padre nos pasa.
// NO hacemos destructuring en la firma: usamos props.titulo, props.descripcion, etc.
function Card(props) {
  return (
    <div className="card">
      {/* El título va destacado arriba de todo */}
      <h2 className="card-titulo">{props.titulo}</h2>

      {/* La descripción es un texto libre */}
      <p className="card-descripcion">{props.descripcion}</p>

      {/* Los datos "cortos" los mostramos como pares etiqueta: valor */}
      <p className="card-dato">
        <strong>Persona asignada:</strong> {props.personaAsignada}
      </p>
      <p className="card-dato">
        <strong>Fecha de inicio:</strong> {props.fechaInicio}
      </p>
      <p className="card-dato">
        <strong>Fecha de fin:</strong> {props.fechaFin}
      </p>
    </div>
  );
}

export default Card;
