// ==============================================
// Archivo: src/pages/TaskFormPage/TaskFormPage.jsx
// Qué hace: UNA sola página que sirve para crear (EJERCICIO 4, ruta
//           /tasks/new) y para editar (EJERCICIO 5, ruta /tasks/:id/edit).
//           Si hay :id en la URL -> modo edición: carga la tarea con GET,
//           rellena el formulario y al guardar hace PUT.
//           Si no hay :id -> modo creación: al guardar hace POST.
//           Incluye la validación del BONUS (título obligatorio).
// Conceptos: useParams, useNavigate, formulario controlado con un solo
//            handleChange usando [name], useEffect que depende de [id],
//            async/await + try/catch, return temprano.
// ==============================================

import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getTask, createTask, updateTask } from '../../services/taskService';
import styles from './TaskFormPage.module.css';

// Opciones del <select> de estado.
const STATUS_OPTIONS = ['To Do', 'In Progress', 'Done'];

// props.onSave(tareaGuardada, isEditing): función de App que actualiza la
// lista global después de guardar en el backend.
function TaskFormPage(props) {
  const onSave = props.onSave;

  // useParams devuelve los parámetros de la URL. En /tasks/7/edit -> id = "7"
  // (SIEMPRE es string). En /tasks/new -> id = undefined.
  const { id } = useParams();
  // useNavigate devuelve una función para cambiar de ruta desde código.
  const navigate = useNavigate();
  // Si hay id estamos editando; si no, creando. Boolean(undefined) = false.
  const isEditing = Boolean(id);

  // Estado del formulario: UN objeto con todos los campos. Cada input tiene
  // name igual a la clave del objeto (title, description, status, assignee).
  const [form, setForm] = useState({
    title: '',
    description: '',
    status: 'To Do',
    assignee: '',
  });
  // Mensaje de error de validación o de la API ('' = sin error).
  const [error, setError] = useState('');
  // true mientras cargamos la tarea en modo edición.
  const [loading, setLoading] = useState(false);

  // EJERCICIO 5, paso 1 y 2: si estamos editando, pedimos la tarea a la API
  // y llenamos el formulario con sus datos.
  // Dependencias [id]: se vuelve a ejecutar si cambia el id de la URL
  // (por ejemplo si se navega de /tasks/1/edit a /tasks/2/edit).
  useEffect(() => {
    async function cargarTarea() {
      setLoading(true);
      try {
        const tarea = await getTask(id);
        setForm({
          title: tarea.title,
          description: tarea.description,
          status: tarea.status,
          // assignee puede venir undefined en el db.json -> usamos ''.
          assignee: tarea.assignee ? tarea.assignee : '',
        });
      } catch (errorCapturado) {
        setError('No se encontró la tarea.');
      } finally {
        setLoading(false);
      }
    }

    // Solo cargamos si hay id; en modo creación no hay nada que pedir.
    if (isEditing) {
      cargarTarea();
    }
  }, [id]);

  // UN solo handler para todos los inputs. Usa el atributo name del input
  // como clave: [name] es "clave calculada". Copiamos el form anterior con
  // spread y pisamos solo el campo que cambió.
  function handleChange(evento) {
    const name = evento.target.name;
    const value = evento.target.value;
    setForm({ ...form, [name]: value });
  }

  // Al enviar el formulario (botón submit o Enter).
  async function handleSubmit(evento) {
    // Evita que el navegador recargue la página (comportamiento por defecto).
    evento.preventDefault();
    setError('');

    // BONUS: validación. trim() saca espacios; "   " cuenta como vacío.
    if (!form.title.trim()) {
      setError('El título es obligatorio.');
      return;
    }

    // Regla de negocio: no se puede avanzar de estado sin persona asignada.
    if (form.status !== 'To Do' && !form.assignee.trim()) {
      setError('Debés asignar una persona antes de cambiar el estado.');
      return;
    }

    try {
      let tareaGuardada;
      if (isEditing) {
        // EJERCICIO 5, paso 4: PUT reemplaza el objeto entero, así que
        // mandamos todos los campos + el id.
        tareaGuardada = await updateTask(id, { ...form, id: id });
      } else {
        // EJERCICIO 4: POST crea la tarea; json-server le pone el id.
        tareaGuardada = await createTask(form);
      }
      // Avisamos a App para que actualice la lista global (contexto).
      onSave(tareaGuardada, isEditing);
      // Volvemos al tablero.
      navigate('/');
    } catch (errorCapturado) {
      setError('Error al guardar la tarea. Intentá de nuevo.');
    }
  }

  // Return temprano mientras se carga la tarea a editar.
  if (loading) {
    return <p className={styles.status}>Cargando tarea...</p>;
  }

  return (
    <main className={styles.container}>
      <h1 className={styles.heading}>
        {isEditing ? 'Editar tarea' : 'Nueva tarea'}
      </h1>
      <form className={styles.form} onSubmit={handleSubmit}>
        {/* Mensaje de error, solo si hay (ternario con null) */}
        {error ? <p className={styles.error}>{error}</p> : null}

        {/* Cada input es "controlado": value viene del estado y onChange lo
            actualiza. name debe coincidir con la clave del objeto form. */}
        <label className={styles.label}>
          Título <span className={styles.required}>*</span>
          <input
            className={styles.input}
            type="text"
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="Título de la tarea"
            required
          />
        </label>

        <label className={styles.label}>
          Descripción
          <textarea
            className={styles.textarea}
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Descripción opcional"
            rows={3}
          />
        </label>

        <label className={styles.label}>
          Estado
          <select
            className={styles.select}
            name="status"
            value={form.status}
            onChange={handleChange}
          >
            {/* Una <option> por cada estado posible */}
            {STATUS_OPTIONS.map((estado) => (
              <option key={estado} value={estado}>
                {estado}
              </option>
            ))}
          </select>
        </label>

        <label className={styles.label}>
          Persona asignada
          <input
            className={styles.input}
            type="text"
            name="assignee"
            value={form.assignee}
            onChange={handleChange}
            placeholder="Nombre de la persona"
          />
        </label>

        <div className={styles.buttons}>
          <button type="submit" className={styles.submitBtn}>
            {isEditing ? 'Guardar cambios' : 'Crear tarea'}
          </button>
          {/* type="button" para que NO dispare el submit del form */}
          <button
            type="button"
            className={styles.cancelBtn}
            onClick={() => navigate('/')}
          >
            Cancelar
          </button>
        </div>
      </form>
    </main>
  );
}

export default TaskFormPage;
