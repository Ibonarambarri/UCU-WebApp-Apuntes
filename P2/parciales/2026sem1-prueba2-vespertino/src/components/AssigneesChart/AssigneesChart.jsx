// ==============================================
// Archivo: src/components/AssigneesChart/AssigneesChart.jsx
// Qué hace: gráfico de barras horizontales con la cantidad de tareas
//           "Done" por persona. EJERCICIO 6: lee las tareas del contexto.
// Conceptos: useContext, filter, contar por clave con un objeto,
//            Object.entries, sort, map.
// ==============================================

import React, { useContext } from 'react';
import { TasksContext } from '../../context/TasksContext';
import styles from './AssigneesChart.module.css';

function AssigneesChart() {
  // EJERCICIO 6: la lista global de tareas viene del contexto.
  const contexto = useContext(TasksContext);
  const tasks = contexto.tasks;

  // Solo nos interesan las tareas terminadas que tienen persona asignada
  // (assignee vacío "" se descarta porque "" es falsy).
  const doneTasks = tasks.filter(
    (tarea) => tarea.status === 'Done' && tarea.assignee
  );

  // Contamos cuántas tareas Done tiene cada persona.
  // Resultado: { "Ana García": 2, "Carlos Pérez": 1 }.
  // Versión con for (equivalente al reduce que traía la plantilla):
  const countByAssignee = {};
  for (const tarea of doneTasks) {
    const nombre = tarea.assignee;
    if (countByAssignee[nombre] === undefined) {
      countByAssignee[nombre] = 0;
    }
    countByAssignee[nombre] = countByAssignee[nombre] + 1;
  }
  // La plantilla lo hacía así con reduce (hace exactamente lo mismo):
  // const countByAssignee = doneTasks.reduce((acc, task) => {
  //   acc[task.assignee] = (acc[task.assignee] || 0) + 1;
  //   return acc;
  // }, {});
  // "acc" es el acumulador (el objeto que se va llenando) y arranca en {}.

  // Object.entries convierte el objeto en array de pares [nombre, cantidad]
  // para poder ordenarlo y recorrerlo con map.
  // sort con (b - a) ordena de mayor a menor cantidad.
  const entries = Object.entries(countByAssignee).sort(
    (parA, parB) => parB[1] - parA[1]
  );

  // El máximo es el primero (ya está ordenado). Sirve para que la barra
  // más larga ocupe el 100% y las demás sean proporcionales.
  const maxCount = entries.length > 0 ? entries[0][1] : 1;

  // Return temprano: nadie completó nada todavía.
  if (entries.length === 0) {
    return (
      <section className={styles.section}>
        <h2 className={styles.title}>Tareas completadas por persona</h2>
        <p className={styles.empty}>Aún no hay tareas completadas.</p>
      </section>
    );
  }

  return (
    <section className={styles.section}>
      <h2 className={styles.title}>Tareas completadas por persona</h2>
      <div className={styles.chart}>
        {/* Una fila por persona: nombre, barra proporcional y número */}
        {entries.map((par) => {
          const assignee = par[0];
          const count = par[1];
          return (
            <div key={assignee} className={styles.row}>
              <span className={styles.name}>{assignee}</span>
              <div className={styles.barTrack}>
                <div
                  className={styles.bar}
                  style={{ width: `${(count / maxCount) * 100}%` }}
                />
              </div>
              <span className={styles.countLabel}>{count}</span>
            </div>
          );
        })}
      </div>
    </section>
  );
}

export default AssigneesChart;
