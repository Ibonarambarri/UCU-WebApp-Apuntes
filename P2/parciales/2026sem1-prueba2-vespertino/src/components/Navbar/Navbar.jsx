// ==============================================
// Archivo: src/components/Navbar/Navbar.jsx
// Qué hace: barra superior fija en todas las páginas: logo (link a "/"),
//           la barra de progreso en el centro y el botón "+ Nueva Tarea".
// Conceptos: Link (navegar sin recargar), composición de componentes.
// ==============================================

import React from 'react';
import { Link } from 'react-router-dom';
import ProgressBar from '../ProgressBar/ProgressBar';
import styles from './Navbar.module.css';

// EJERCICIO 6: la plantilla le pasaba <Navbar tasks={tasks} /> pero no las
// usaba. Ahora no recibe nada: ProgressBar lee las tareas directamente del
// contexto, así la Navbar no necesita "transportar" props que no usa.
function Navbar() {
  return (
    <nav className={styles.navbar}>
      {/* Link en vez de <a>: cambia la URL sin recargar la página */}
      <Link to="/" className={styles.brand}>
        🗂️ Trello App
      </Link>
      <div className={styles.center}>
        <ProgressBar />
      </div>
      {/* Lleva a la ruta de creación (EJERCICIO 3) */}
      <Link to="/tasks/new" className={styles.newTaskBtn}>
        + Nueva Tarea
      </Link>
    </nav>
  );
}

export default Navbar;
