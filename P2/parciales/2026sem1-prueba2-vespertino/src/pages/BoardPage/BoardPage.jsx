// ==============================================
// Archivo: src/pages/BoardPage/BoardPage.jsx
// Qué hace: página principal ("/"). Al montarse pide las tareas a
//           json-server (EJERCICIO 2), las guarda en el estado global y
//           dibuja el tablero + el gráfico. También maneja el cambio de
//           estado de una tarea (PUT) y el borrado (DELETE).
// Conceptos: useEffect con [] (solo al montar), async/await + try/catch,
//            loading / error, find, map, spread para copiar objetos.
// ==============================================

import React, { useState, useEffect } from 'react';
import Board from '../../components/Board/Board';
import AssigneesChart from '../../components/AssigneesChart/AssigneesChart';
import {
  getTasks,
  updateTask,
  deleteTask,
} from '../../services/taskService';

import styles from './BoardPage.module.css';

// props.tasks / props.setTasks vienen de App, que a su vez los saca del
// contexto. (También podríamos hacer useContext acá directamente; se dejó
// como props porque así lo planteaba la plantilla.)
function BoardPage(props) {
  const tasks = props.tasks;
  const setTasks = props.setTasks;

  // Estado de carga: true mientras esperamos la respuesta de la API.
  const [loading, setLoading] = useState(false);
  // Mensaje de error si la API falla (null = no hay error).
  const [error, setError] = useState(null);

  // EJERCICIO 2: al montar la página, traemos las tareas de json-server.
  // Dependencias []: se ejecuta UNA sola vez, cuando el componente aparece.
  // La función async se declara adentro porque el callback del useEffect
  // no puede ser async directamente.
  useEffect(() => {
    async function cargarTareas() {
      setLoading(true);
      setError(null);
      try {
        const tareasDelServidor = await getTasks();
        setTasks(tareasDelServidor);
      } catch (errorCapturado) {
        setError(errorCapturado.message);
      } finally {
        // finally se ejecuta siempre, haya salido bien o mal.
        setLoading(false);
      }
    }

    cargarTareas();
  }, []);

  // Se ejecuta cuando en una TaskCard se cambia el <select> de estado.
  // Pasos: 1) buscar la tarea, 2) copiarla con el nuevo status,
  // 3) guardar en el backend con PUT, 4) actualizar el estado global.
  async function handleStatusChange(id, newStatus) {
    // find: devuelve la primera tarea cuyo id coincide (o undefined).
    const tareaEncontrada = tasks.find((tarea) => tarea.id === id);
    if (!tareaEncontrada) {
      return;
    }

    // NUNCA modificamos tareaEncontrada.status = ... directamente (sería
    // mutar el estado). Creamos una copia con spread y pisamos status.
    const tareaActualizada = { ...tareaEncontrada, status: newStatus };

    try {
      // PUT reemplaza el objeto entero, por eso mandamos la copia completa.
      const tareaGuardada = await updateTask(id, tareaActualizada);

      // Reemplazamos en la lista SOLO la tarea que cambió (map devuelve
      // un array nuevo, que es lo que React necesita para re-renderizar).
      const listaActualizada = tasks.map((tarea) =>
        tarea.id === id ? tareaGuardada : tarea
      );
      setTasks(listaActualizada);
    } catch (errorCapturado) {
      alert('No se pudo actualizar la tarea: ' + errorCapturado.message);
    }
  }

  // Se ejecuta al apretar el tacho en una TaskCard.
  // Primero borramos en el backend; si salió bien, la sacamos de la lista.
  async function handleDelete(id) {
    const confirmado = window.confirm('¿Eliminar esta tarea?');
    if (!confirmado) {
      return;
    }

    try {
      await deleteTask(id);
      // filter: nos quedamos con todas las tareas MENOS la borrada.
      const listaSinLaTarea = tasks.filter((tarea) => tarea.id !== id);
      setTasks(listaSinLaTarea);
    } catch (errorCapturado) {
      alert('No se pudo eliminar la tarea: ' + errorCapturado.message);
    }
  }

  // Return temprano mientras carga.
  if (loading) {
    return <p className={styles.status}>Cargando tareas...</p>;
  }

  // Return temprano si hubo error (por ejemplo json-server apagado).
  if (error) {
    return <p className={styles.error}>{error}</p>;
  }

  return (
    <main>
      {/* El tablero recibe la lista y las dos funciones que usan las tarjetas */}
      <Board
        tasks={tasks}
        onStatusChange={handleStatusChange}
        onDelete={handleDelete}
      />

      {/* El gráfico lee las tareas del contexto, no necesita props (EJERCICIO 6) */}
      <AssigneesChart />
    </main>
  );
}

export default BoardPage;
