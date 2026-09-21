// ==============================================
// Archivo: src/componentes/ListaTareas.jsx
// Qué hace: dibuja la lista de tareas. Cada tarea tiene un botón 🗑 que,
// al hacer click, avisa al padre qué id hay que borrar.
// Conceptos: .map con key, pasar el id al handler con una arrow inline.
// ==============================================

function ListaTareas(props) {
  // Return temprano: si el array está vacío, mostramos un aviso y listo.
  if (props.tareas.length === 0) {
    return <p className="sin-tareas">Todavía no hay tareas. Agregá una!</p>;
  }

  return (
    <ul className="lista-tareas">
      {/* .map recorre el array y devuelve un <li> por cada tarea.
          key={tarea.id} es OBLIGATORIA para que React identifique cada fila. */}
      {props.tareas.map((tarea) => (
        <li key={tarea.id} className="tarea">
          <span className="tarea-texto">{tarea.texto}</span>

          {/* Necesitamos pasarle el id de ESTA tarea a la función del padre.
              Por eso usamos una arrow function inline: al hacer click se
              ejecuta props.alBorrar(tarea.id). Si escribiéramos
              onClick={props.alBorrar(tarea.id)} se ejecutaría al renderizar. */}
          <button
            className="boton-borrar"
            onClick={() => props.alBorrar(tarea.id)}
            title="Borrar tarea"
          >
            🗑
          </button>
        </li>
      ))}
    </ul>
  );
}

export default ListaTareas;
