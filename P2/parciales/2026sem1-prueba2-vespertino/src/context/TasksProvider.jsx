// ==============================================
// Archivo: src/context/TasksProvider.jsx
// Qué hace: el Provider del contexto global de tareas (EJERCICIO 6).
//           El contexto en sí se crea en TasksContext.js.
//           Guarda la lista de tareas en UN SOLO lugar para que cualquier
//           componente (Navbar/ProgressBar, AssigneesChart, BoardPage, App)
//           lea y modifique la MISMA lista sin pasar props en cadena.
// Conceptos: createContext, Provider, useState, props.children, useContext.
// ==============================================

import { useState } from 'react';
import { TasksContext } from './TasksContext.js';

// El Provider es un componente normal que "envuelve" a la app.
//    Todo lo que esté dentro (props.children) puede hacer
//    useContext(TasksContext) y recibir { tasks, setTasks }.
export function TasksProvider(props) {
  // Estado global: la lista de tareas. Empieza vacía y BoardPage la llena
  // con getTasks() al montarse.
  const [tasks, setTasks] = useState([]);

  // Objeto que reciben todos los consumidores del contexto.
  const valorDelContexto = {
    tasks: tasks,
    setTasks: setTasks,
  };

  return (
    <TasksContext.Provider value={valorDelContexto}>
      {/* props.children = todo lo que se escribió entre <TasksProvider> y </TasksProvider> */}
      {props.children}
    </TasksContext.Provider>
  );
}
