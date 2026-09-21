// ==============================================
// Archivo: src/App.jsx
// Qué hace: igual que TA07 (agregar y borrar) y además permite EDITAR una
// tarea. Para editar hay dos estados nuevos: idEditando (qué tarea está en
// modo edición, o null si ninguna) y textoEditando (lo que se va
// escribiendo en el input de edición). Al guardar se usa .map para crear
// un array nuevo con esa tarea modificada.
// Conceptos: varios useState relacionados, map para modificar un elemento.
// ==============================================
import { useState } from 'react';
import FormularioTarea from './componentes/FormularioTarea.jsx';
import ListaTareas from './componentes/ListaTareas.jsx';
import './App.css';

function App() {
  // Estado: el array de tareas { id, texto }.
  const [tareas, setTareas] = useState([]);

  // Estado: el próximo id a usar.
  const [proximoId, setProximoId] = useState(1);

  // Estado: id de la tarea que está en modo edición. null = ninguna.
  const [idEditando, setIdEditando] = useState(null);

  // Estado: el texto del input de edición (es un input controlado).
  const [textoEditando, setTextoEditando] = useState('');

  // ---------- AGREGAR (igual que TA06) ----------
  function agregarTarea(texto) {
    const nuevaTarea = { id: proximoId, texto: texto };
    setTareas([...tareas, nuevaTarea]);
    setProximoId(proximoId + 1);
  }

  // ---------- BORRAR (igual que TA07) ----------
  function borrarTarea(idABorrar) {
    const tareasFiltradas = tareas.filter((tarea) => tarea.id !== idABorrar);
    setTareas(tareasFiltradas);

    // Si justo estábamos editando la tarea que se borró, salimos de edición.
    if (idABorrar === idEditando) {
      setIdEditando(null);
      setTextoEditando('');
    }
  }

  // ---------- EDITAR ----------

  // Click en ✏: ponemos esa tarea en modo edición y cargamos su texto
  // actual en el input para que el usuario lo modifique.
  function empezarEdicion(tarea) {
    setIdEditando(tarea.id);
    setTextoEditando(tarea.texto);
  }

  // Cada tecla en el input de edición.
  function manejarCambioTextoEditando(evento) {
    setTextoEditando(evento.target.value);
  }

  // Click en "Guardar": reemplazamos el texto de la tarea que tiene
  // id === idEditando y salimos del modo edición.
  function guardarEdicion() {
    // No guardamos un texto vacío.
    if (textoEditando.trim() === '') {
      return;
    }

    // .map devuelve un array NUEVO del mismo largo. Para cada tarea:
    // - si es la que estamos editando, devolvemos una COPIA con el texto nuevo
    //   ({ ...tarea, texto: ... } copia id y pisa texto)
    // - si no, devolvemos la misma tarea sin cambios.
    const tareasActualizadas = tareas.map((tarea) => {
      if (tarea.id === idEditando) {
        return { ...tarea, texto: textoEditando.trim() };
      }
      return tarea;
    });
    setTareas(tareasActualizadas);

    // Salimos del modo edición.
    setIdEditando(null);
    setTextoEditando('');
  }

  // Click en "Cancelar": salimos del modo edición sin tocar la tarea.
  function cancelarEdicion() {
    setIdEditando(null);
    setTextoEditando('');
  }

  return (
    <div className="app">
      <h1>TA08 - Editar tarea</h1>

      <FormularioTarea alAgregar={agregarTarea} />

      {/* La lista necesita bastantes cosas: los datos y todas las funciones */}
      <ListaTareas
        tareas={tareas}
        idEditando={idEditando}
        textoEditando={textoEditando}
        alBorrar={borrarTarea}
        alEmpezarEdicion={empezarEdicion}
        alCambiarTextoEditando={manejarCambioTextoEditando}
        alGuardar={guardarEdicion}
        alCancelar={cancelarEdicion}
      />

      <p className="contador-tareas">Total de tareas: {tareas.length}</p>
    </div>
  );
}

export default App;
