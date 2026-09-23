// ==============================================
// Archivo: src/context/TasksContext.js
// Qué hace: crea el contexto global de tareas (EJERCICIO 6).
//           El Provider está en TasksProvider.jsx: separarlos evita el aviso
//           de lint react-refresh/only-export-components (un .jsx no debe
//           exportar un componente y un contexto a la vez).
// ==============================================

import { createContext } from 'react';

// El valor por defecto solo se usa si algún componente consume el contexto
// SIN estar dentro del Provider. Lo dejamos con la misma forma
// ({ tasks, setTasks }) para que no explote.
export const TasksContext = createContext({
  tasks: [],
  setTasks: function () {},
});
