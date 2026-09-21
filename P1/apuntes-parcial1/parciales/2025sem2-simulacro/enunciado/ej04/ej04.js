const API_URL = 'http://localhost:3000/tasks';
const taskList = document.getElementById('task-list');
const form = document.getElementById('task-form');
const input = document.getElementById('task-input');

// Cargar y mostrar tareas al iniciar - GET
async function loadTasks() {
    console.error("¡No se ha implementado la función loadTasks!");
}


// Añadir tarea al enviar el formulario - manejar envío del formulario + POST
form.addEventListener('submit', async (e) => {
  console.error("¡No se ha implementado la función addEventListener!");
});

// Renderizar tarea en el DOM
function renderTask(task) {
  const li = document.createElement('li');
  if (task.completed) li.classList.add('completed');

  const content = document.createElement('div');
  content.className = 'task-content';

  const title = document.createElement('span');
  title.className = 'task-title';
  title.textContent = task.title;

  const actions = document.createElement('div');
  actions.className = 'task-actions';

  const completeBtn = document.createElement('button');
  completeBtn.textContent = task.completed ? '⟳' : '✓';
  completeBtn.onclick = () => toggleComplete(task);

  const deleteBtn = document.createElement('button');
  deleteBtn.textContent = '🗑️';
  deleteBtn.onclick = () => deleteTask(task.id, li);

  actions.appendChild(completeBtn);
  actions.appendChild(deleteBtn);

  content.appendChild(title);
  li.appendChild(content);
  li.appendChild(actions);

  taskList.appendChild(li);
}


// Actualizar tarea - PATCH
async function toggleComplete(task) {
  console.error("¡No se ha implementado la función toggleComplete!");
}

// Eliminar tarea - DELETE
async function deleteTask(id, li) {
    console.error("¡No se ha implementado la función deleteTask!");
}

// Inicializar
loadTasks();
