// ==============================================
// Archivo: src/componentes/ListaTareas.jsx
// Qué hace: recibe el array de tareas por props y lo dibuja como una
// lista <ul>. Si no hay tareas muestra un mensaje.
// Conceptos: renderizar listas con .map, la prop key.
// ==============================================

function ListaTareas(props) {
  // Return temprano: si el array está vacío, mostramos un aviso y listo.
  if (props.tareas.length === 0) {
    return <p className="sin-tareas">Todavía no hay tareas. Agregá una!</p>;
  }

  return (
    <ul className="lista-tareas">
      {/* .map recorre el array y devuelve un <li> por cada tarea.
          key={tarea.id} es OBLIGATORIA: React la usa para saber qué <li>
          es cuál cuando la lista cambia. Usamos el id y NO el índice. */}
      {props.tareas.map((tarea) => (
        <li key={tarea.id} className="tarea">
          {tarea.texto}
        </li>
      ))}
    </ul>
  );
}

export default ListaTareas;
