// ==============================================
// Archivo: src/componentes/TarjetaUsuario.jsx
// Qué hace: muestra "de manera amigable" el nombre y el mail de UN usuario.
// Recibe los datos por props desde ListaUsuarios.
// Conceptos: props, componente de presentación (no tiene estado).
// ==============================================

function TarjetaUsuario(props) {
  return (
    <div className="tarjeta-usuario">
      {/* Nombre completo del usuario, viene de props.nombre */}
      <h3>{props.nombre}</h3>

      {/* Mail como enlace "mailto:" para que se pueda clickear */}
      <p>
        Correo: <a href={'mailto:' + props.mail}>{props.mail}</a>
      </p>
    </div>
  );
}

export default TarjetaUsuario;
