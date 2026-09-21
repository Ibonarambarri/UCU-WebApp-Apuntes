// ==============================================
// Archivo: src/App.jsx
// Qué hace: igual que TA06 (agregar tareas) y además permite borrar una
// tarea. Para borrar se usa .filter, que devuelve un array NUEVO sin la
// tarea con ese id.
// Conceptos: array en estado, spread para agregar, filter para borrar.
// ==============================================
import { useState } from 'react';
import FormularioTarea from './componentes/FormularioTarea.jsx';
import ListaTareas from './componentes/ListaTareas.jsx';
import './App.css';

function App() {
  // Estado: el array de tareas. Cada tarea es un objeto { id, texto }.
  const [tareas, setTareas] = useState([]);

  // Estado: el próximo id a usar (en estado para que no se reinicie).
  const [proximoId, setProximoId] = useState(1);

  // La llama el formulario con el texto de la nueva tarea.
  function agregarTarea(texto) {
    const nuevaTarea = { id: proximoId, texto: texto };
    // Array nuevo = copia de las viejas + la nueva (nunca push).
    setTareas([...tareas, nuevaTarea]);
    setProximoId(proximoId + 1);
  }

  // La llama la lista con el id de la tarea a borrar.
  function borrarTarea(idABorrar) {
    // .filter devuelve un array NUEVO con las tareas que cumplen la condición.
    // Nos quedamos con todas las que tienen un id DISTINTO al que borramos.
    const tareasFiltradas = tareas.filter((tarea) => tarea.id !== idABorrar);
    setTareas(tareasFiltradas);
  }

  return (
    <div className="app">
      <h1>TA07 - Borrar tarea</h1>

      <FormularioTarea alAgregar={agregarTarea} />

      {/* Le pasamos a la lista el array y la función de borrar */}
      <ListaTareas tareas={tareas} alBorrar={borrarTarea} />

      <p className="contador-tareas">Total de tareas: {tareas.length}</p>
    </div>
  );
}

export default App;
