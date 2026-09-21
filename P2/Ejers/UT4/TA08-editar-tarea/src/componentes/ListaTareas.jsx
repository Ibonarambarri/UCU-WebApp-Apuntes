// ==============================================
// Archivo: src/componentes/ListaTareas.jsx
// Qué hace: dibuja la lista de tareas. Cada tarea puede estar en modo
// "normal" (texto + botones ✏ y 🗑) o en modo "edición" (input + botones
// Guardar y Cancelar). Solo una tarea puede estar en edición a la vez:
// la que tiene el id igual a props.idEditando.
// Conceptos: render condicional dentro de un .map, dos modos por fila.
// ==============================================

function ListaTareas(props) {
  // Return temprano: si no hay tareas, mostramos un aviso.
  if (props.tareas.length === 0) {
    return <p className="sin-tareas">Todavía no hay tareas. Agregá una!</p>;
  }

  return (
    <ul className="lista-tareas">
      {/* Recorremos el array. Para cada tarea decidimos si dibujamos la
          versión "en edición" o la versión "normal". */}
      {props.tareas.map((tarea) => {
        // ¿Esta fila es la que se está editando?
        const estaEditando = tarea.id === props.idEditando;

        // ----- MODO EDICIÓN -----
        if (estaEditando) {
          return (
            <li key={tarea.id} className="tarea tarea-editando">
              {/* Input controlado: el texto vive en App (props.textoEditando) */}
              <input
                type="text"
                value={props.textoEditando}
                onChange={props.alCambiarTextoEditando}
              />
              {/* Guardar: no necesita argumento, App ya sabe qué id se edita */}
              <button className="boton-guardar" onClick={props.alGuardar}>
                Guardar
              </button>
              <button className="boton-cancelar" onClick={props.alCancelar}>
                Cancelar
              </button>
            </li>
          );
        }

        // ----- MODO NORMAL -----
        return (
          <li key={tarea.id} className="tarea">
            <span className="tarea-texto">{tarea.texto}</span>

            <span className="tarea-botones">
              {/* Arrow inline para pasar la tarea completa al padre
                  (necesita el id y el texto actual para arrancar la edición) */}
              <button
                className="boton-editar"
                onClick={() => props.alEmpezarEdicion(tarea)}
                title="Editar tarea"
              >
                ✏
              </button>
              {/* Arrow inline para pasar el id a borrar */}
              <button
                className="boton-borrar"
                onClick={() => props.alBorrar(tarea.id)}
                title="Borrar tarea"
              >
                🗑
              </button>
            </span>
          </li>
        );
      })}
    </ul>
  );
}

export default ListaTareas;
