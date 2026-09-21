// ==============================================
// Archivo: src/components/Board/Board.jsx
// Qué hace: dibuja las tres columnas (To Do / In Progress / Done) y dentro
//           de cada una las tarjetas de las tareas que tienen ese estado.
//           EJERCICIO 1 (render por columna, mensaje vacío, contador).
// Conceptos: map anidado, filter, key, props hacia abajo (onStatusChange,
//            onDelete), render condicional con ternario.
// ==============================================

import React from 'react';
import TaskCard from '../TaskCard/TaskCard';
import styles from './Board.module.css';

// Los tres estados posibles, en el orden en que se dibujan las columnas.
const COLUMNS = ['To Do', 'In Progress', 'Done'];

// Color de fondo de cada columna (clave = estado).
const COLUMN_COLORS = {
  'To Do': '#dbeafe',
  'In Progress': '#fef9c3',
  'Done': '#dcfce7',
};

// props.tasks: lista completa de tareas.
// props.onStatusChange(id, nuevoEstado): la llama TaskCard al cambiar el select.
// props.onDelete(id): la llama TaskCard al apretar el tacho.
function Board(props) {
  const tasks = props.tasks;

  return (
    <div className={styles.board}>
      {/* Recorremos los 3 estados y por cada uno dibujamos una columna */}
      {COLUMNS.map((status) => {
        // filter: nos quedamos solo con las tareas cuyo status es el de esta columna.
        const columnTasks = tasks.filter((tarea) => tarea.status === status);

        return (
          <div
            key={status}
            className={styles.column}
            style={{ backgroundColor: COLUMN_COLORS[status] }}
          >
            <div className={styles.columnHeader}>
              <h2 className={styles.columnTitle}>{status}</h2>
              {/* BONUS: cantidad de tareas de la columna */}
              <span className={styles.count}>{columnTasks.length}</span>
            </div>

            <div className={styles.cards}>
              {/* Si la columna está vacía mostramos un mensaje;
                  si no, una TaskCard por cada tarea (map). */}
              {columnTasks.length === 0 ? (
                <p className={styles.empty}>Sin tareas</p>
              ) : (
                columnTasks.map((tarea) => (
                  <TaskCard
                    key={tarea.id}
                    task={tarea}
                    onStatusChange={props.onStatusChange}
                    onDelete={props.onDelete}
                  />
                ))
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default Board;
