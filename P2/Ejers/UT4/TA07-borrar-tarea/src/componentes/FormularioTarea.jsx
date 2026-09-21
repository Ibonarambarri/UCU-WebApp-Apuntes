// ==============================================
// Archivo: src/componentes/FormularioTarea.jsx
// Qué hace: formulario con un input controlado y un botón "Agregar".
// Al enviar, avisa al padre (App) con el texto de la nueva tarea.
// El texto del input lo guarda este componente en su propio estado,
// porque nadie más lo necesita hasta que se envía.
// Conceptos: form + onSubmit, evento.preventDefault(), input controlado,
// limpiar el input después de agregar.
// ==============================================
import { useState } from 'react';

function FormularioTarea(props) {
  // Estado: lo que el usuario está escribiendo ahora en el input.
  const [textoNuevaTarea, setTextoNuevaTarea] = useState('');

  // Se ejecuta con cada tecla: copiamos el texto del input al estado.
  function manejarCambioDeTexto(evento) {
    setTextoNuevaTarea(evento.target.value);
  }

  // Se ejecuta al enviar el formulario (click en "Agregar" o Enter).
  function manejarEnvio(evento) {
    // MUY IMPORTANTE: sin esto el navegador recarga la página entera
    // (comportamiento por defecto de un <form>) y perdemos todo el estado.
    evento.preventDefault();

    // No agregamos tareas vacías (trim saca los espacios de los costados).
    if (textoNuevaTarea.trim() === '') {
      return;
    }

    // Avisamos al padre pasándole el texto. El padre decide qué hacer.
    props.alAgregar(textoNuevaTarea.trim());

    // Limpiamos el input: como es controlado, basta con vaciar el estado.
    setTextoNuevaTarea('');
  }

  return (
    <form className="formulario-tarea" onSubmit={manejarEnvio}>
      <input
        type="text"
        value={textoNuevaTarea}
        onChange={manejarCambioDeTexto}
        placeholder="Nueva tarea..."
      />
      {/* type="submit" hace que el click dispare el onSubmit del form */}
      <button type="submit">Agregar</button>
    </form>
  );
}

export default FormularioTarea;
