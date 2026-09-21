// ==============================================
// Archivo: src/components/ProgressBar/ProgressBar.jsx
// Qué hace: barra de progreso de la Navbar. Calcula qué porcentaje de las
//           tareas está en "Done". EJERCICIO 6: las tareas salen del contexto.
// Conceptos: useContext, filter, Math.round, estilos inline dinámicos.
// ==============================================

import React, { useContext } from 'react';
import { TasksContext } from '../../context/TasksContext';
import styles from './ProgressBar.module.css';

function ProgressBar() {
  // EJERCICIO 6: leemos la lista global. Como es la MISMA lista que usa
  // BoardPage, cada vez que se crea/edita/borra una tarea esta barra se
  // actualiza sola (el Provider re-renderiza a todos los consumidores).
  const contexto = useContext(TasksContext);
  const tasks = contexto.tasks;

  // Total de tareas y cuántas están terminadas.
  const total = tasks.length;
  // filter: nos quedamos con las que tienen status "Done" y contamos.
  const done = tasks.filter((tarea) => tarea.status === 'Done').length;
  // Evitamos dividir por cero cuando todavía no hay tareas.
  const percentage = total === 0 ? 0 : Math.round((done / total) * 100);

  return (
    <div className={styles.container}>
      <span className={styles.label}>
        Progreso del proyecto: {done}/{total} tareas completadas ({percentage}%)
      </span>
      <div className={styles.track}>
        {/* El ancho de la barra verde es el porcentaje calculado */}
        <div
          className={styles.fill}
          style={{ width: `${percentage}%` }}
          role="progressbar"
          aria-valuenow={percentage}
          aria-valuemin={0}
          aria-valuemax={100}
        />
      </div>
    </div>
  );
}

export default ProgressBar;
