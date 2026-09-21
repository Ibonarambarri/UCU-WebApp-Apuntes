/*
# Ejercicio 04 - Gestor de Tareas CRUD (resuelto)

Levantar la API con:  npx json-server db.json
(la página se puede abrir con `npx json-server db.json -s .` y entrar a
http://localhost:3000/ej04.html)
*/

const API_URL = 'http://localhost:3000/tasks';
const taskList = document.getElementById('task-list');
const form = document.getElementById('task-form');
const input = document.getElementById('task-input');

/* GET: obtiene el listado de tareas y actualiza la vista. */
async function loadTasks() {
  try {
    const tasks = await fetchJSON(API_URL);
    taskList.replaceChildren(...tasks.map(taskElement));
  } catch (error) {
    console.error(error);
    taskList.replaceChildren();
  }
}

/* Construye el <li> de una tarea. */
function taskElement(task) {
  const li = document.createElement('li');
  li.className = task.completed ? 'completed' : '';

  const title = document.createElement('div');
  title.className = 'task-title';
  title.textContent = task.title;

  const actions = document.createElement('div');
  actions.className = 'task-actions';
  actions.append(
    button(task.completed ? '↩︎ Reabrir' : '✔ Completar', () => toggleComplete(task)),
    button('🗑 Borrar', () => deleteTask(task)),
  );

  li.append(title, actions);
  return li;
}

function button(label, onClick) {
  const b = document.createElement('button');
  b.type = 'button';
  b.textContent = label;
  b.addEventListener('click', onClick);
  return b;
}

/* PATCH: cambia el estado de la tarea y actualiza la vista. */
async function toggleComplete(task) {
  try {
    await fetchJSON(`${API_URL}/${task.id}`, {
      method: 'PATCH',
      body: JSON.stringify({ completed: !task.completed }),
    });
    await loadTasks();
  } catch (error) {
    console.error(error);
  }
}

/* DELETE: elimina la tarea y actualiza la vista. */
async function deleteTask(task) {
  try {
    await fetchJSON(`${API_URL}/${task.id}`, { method: 'DELETE' });
    await loadTasks();
  } catch (error) {
    console.error(error);
  }
}

/* POST: maneja el submit del formulario y crea la nueva tarea. */
form.addEventListener('submit', async (event) => {
  event.preventDefault();               // evita que se recargue la página
  const title = input.value.trim();
  if (!title) {
    return;
  }
  try {
    await fetchJSON(API_URL, {
      method: 'POST',
      body: JSON.stringify({ title, completed: false }),
    });
    input.value = '';
    await loadTasks();
  } catch (error) {
    console.error(error);
  }
});

async function fetchJSON(url, options) {
  const response = await fetch(url, {
    ...options,
    headers: { 'Content-Type': 'application/json', ...options?.headers },
  });
  if (!response.ok) {
    throw new Error(`Error ${response.status}: ${response.statusText}`);
  }
  return response.status === 204 ? null : await response.json();
}

loadTasks();
