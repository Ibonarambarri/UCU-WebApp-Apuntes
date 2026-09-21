// ==============================================
// Archivo: src/App.jsx
// Qué hace: guarda la lista de tareas en estado. El formulario le avisa
// cuando hay que agregar una y la lista se re-renderiza sola.
// Conceptos: array en estado, crear array nuevo con spread (nunca push),
// id incremental guardado en estado.
// ==============================================
import { useState } from 'react';
import FormularioTarea from './componentes/FormularioTarea.jsx';
import ListaTareas from './componentes/ListaTareas.jsx';
import './App.css';

function App() {
  // Estado: el array de tareas. Cada tarea es un objeto { id, texto }.
  const [tareas, setTareas] = useState([]);

  // Estado: el próximo id a usar. Lo guardamos en estado para que sobreviva
  // a los re-renders (una variable normal volvería a 1 en cada render).
  const [proximoId, setProximoId] = useState(1);

  // La llama el formulario con el texto de la nueva tarea.
  function agregarTarea(texto) {
    // Armamos el objeto de la nueva tarea.
    const nuevaTarea = { id: proximoId, texto: texto };

    // NUNCA tareas.push(nuevaTarea): eso modifica el array viejo y React no
    // detecta el cambio. Hay que crear un array NUEVO: copiamos las tareas
    // que ya había con ...tareas y agregamos la nueva al final.
    setTareas([...tareas, nuevaTarea]);

    // Avanzamos el id para la próxima tarea.
    setProximoId(proximoId + 1);
  }

  return (
    <div className="app">
      <h1>TA06 - Lista de tareas</h1>

      {/* Le pasamos al formulario la función que agrega */}
      <FormularioTarea alAgregar={agregarTarea} />

      {/* Le pasamos a la lista el array del estado */}
      <ListaTareas tareas={tareas} />

      <p className="contador-tareas">Total de tareas: {tareas.length}</p>
    </div>
  );
}

export default App;
