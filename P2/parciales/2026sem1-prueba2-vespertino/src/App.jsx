// ==============================================
// Archivo: src/App.jsx
// Qué hace: componente raíz. Define el router (EJERCICIO 3) con las tres
//           rutas, muestra la Navbar en todas las páginas y define
//           handleSave, que actualiza la lista global cuando el formulario
//           crea o edita una tarea.
// Conceptos: BrowserRouter / Routes / Route, useContext, props a páginas.
// ==============================================

import React, { useContext } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar/Navbar';
import BoardPage from './pages/BoardPage/BoardPage';
import TaskFormPage from './pages/TaskFormPage/TaskFormPage';
import { TasksContext } from './context/TasksContext';
import styles from './App.module.css';

function App() {
  // EJERCICIO 6: antes la plantilla tenía acá un useState([]) local.
  // Ahora la lista vive en el contexto (TasksProvider, en main.jsx) y App
  // solo la "lee". Así Navbar, BoardPage y AssigneesChart ven la misma lista.
  const contexto = useContext(TasksContext);
  const tasks = contexto.tasks;
  const setTasks = contexto.setTasks;

  // La llama TaskFormPage después de guardar en el backend (POST o PUT).
  // savedTask: la tarea tal como la devolvió json-server (con id).
  // isEditing: true si vino de /tasks/:id/edit, false si vino de /tasks/new.
  // Objetivo: que el tablero muestre el cambio SIN volver a pedir todo a la API.
  function handleSave(savedTask, isEditing) {
    if (isEditing) {
      // Edición: recorremos la lista y reemplazamos SOLO la tarea con ese id.
      // map devuelve un array NUEVO (nunca modificamos el estado a mano).
      const listaActualizada = tasks.map((tarea) =>
        tarea.id === savedTask.id ? savedTask : tarea
      );
      setTasks(listaActualizada);
    } else {
      // Creación: copiamos la lista con spread y agregamos la nueva al final.
      setTasks([...tasks, savedTask]);
    }
  }

  return (
    <BrowserRouter>
      {/* La Navbar está fuera de <Routes>, por eso se ve en todas las páginas */}
      <Navbar />
      <div className={styles.content}>
        <Routes>
          {/* Tablero principal */}
          <Route
            path="/"
            element={<BoardPage tasks={tasks} setTasks={setTasks} />}
          />
          {/* EJERCICIO 3: crear tarea. Sin :id -> TaskFormPage sabe que es "nueva" */}
          <Route
            path="/tasks/new"
            element={<TaskFormPage onSave={handleSave} />}
          />
          {/* EJERCICIO 3: editar tarea. :id lo lee TaskFormPage con useParams() */}
          <Route
            path="/tasks/:id/edit"
            element={<TaskFormPage onSave={handleSave} />}
          />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
