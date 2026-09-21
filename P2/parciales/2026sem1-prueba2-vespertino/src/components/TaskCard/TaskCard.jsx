// ==============================================
// Archivo: src/components/TaskCard/TaskCard.jsx
// Qué hace: tarjeta de UNA tarea: título, descripción, persona asignada,
//           link a editar, botón borrar y un <select> para cambiar estado.
//           (Venía hecho en la plantilla; se agregaron comentarios.)
// Conceptos: props, Link con parámetro en la URL, eventos onChange/onClick,
//            "levantar" eventos al padre con funciones recibidas por props.
// ==============================================

import React from 'react';
import { Link } from 'react-router-dom';
import styles from './TaskCard.module.css';

// Color del borde izquierdo según el estado.
const STATUS_COLORS = {
  'To Do': '#dbeafe',
  'In Progress': '#fef9c3',
  'Done': '#dcfce7',
};

// Opciones del <select> de estado.
const STATUS_OPTIONS = ['To Do', 'In Progress', 'Done'];

// props.task: la tarea a mostrar.
// props.onStatusChange(id, nuevoEstado) y props.onDelete(id): funciones del
// padre (BoardPage, vía Board). La tarjeta NO hace fetch: solo avisa.
function TaskCard({ task, onStatusChange, onDelete }) {
  // Al cambiar el <select>: regla de negocio -> una tarea sin persona
  // asignada no puede salir de "To Do". Si pasa eso, avisamos y volvemos
  // el select al valor anterior.
  function handleStatusChange(e) {
    const newStatus = e.target.value;
    if (newStatus !== 'To Do' && !task.assignee) {
      alert('No se puede cambiar el estado sin una persona asignada.');
      e.target.value = task.status;
      return;
    }
    // Avisamos al padre; él hace el PUT y actualiza la lista global.
    onStatusChange(task.id, newStatus);
  }

  return (
    <div
      className={styles.card}
      style={{ borderLeft: `4px solid ${STATUS_COLORS[task.status] || '#e2e8f0'}` }}
    >
      <div className={styles.header}>
        <h3 className={styles.title}>{task.title}</h3>
        <div className={styles.actions}>
          {/* Link a la ruta de edición con el id de ESTA tarea (EJERCICIO 3/5) */}
          <Link to={`/tasks/${task.id}/edit`} className={styles.editBtn}>
            ✏️
          </Link>
          {/* Arrow inline para pasarle el id al padre al hacer click */}
          <button className={styles.deleteBtn} onClick={() => onDelete(task.id)}>
            🗑️
          </button>
        </div>
      </div>
      <p className={styles.description}>{task.description}</p>
      {/* Render condicional: solo se muestra si hay assignee (plantilla usa &&) */}
      {task.assignee && (
        <span className={styles.assignee}>👤 {task.assignee}</span>
      )}
      {/* Select controlado: su value es el status actual de la tarea */}
      <select
        className={styles.statusSelect}
        value={task.status}
        onChange={handleStatusChange}
      >
        {STATUS_OPTIONS.map((s) => (
          <option key={s} value={s}>
            {s}
          </option>
        ))}
      </select>
    </div>
  );
}

export default TaskCard;
