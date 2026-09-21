/*
============================================================
 Referencia completa: DOM + fetch contra json-server.
 Cubre GET, POST, PATCH, PUT y DELETE.
============================================================
*/

// Estado local que NO vive en la API (filtros, selección, favoritos…).
let onlyPending = false;

/* ---------- Arranque ---------------------------------------------------- */
async function onLoad() {
  // El form tiene un submit real → hay que frenarlo.
  document.getElementById('task-form')
    .addEventListener('submit', onSubmit);

  document.getElementById('only-pending')
    .addEventListener('change', (event) => {
      onlyPending = event.target.checked;
      loadTasks();
    });

  await loadTasks();
}

/* ---------- GET: leer y dibujar ----------------------------------------- */
async function loadTasks() {
  const list = document.getElementById('tasks');
  try {
    const tasks = await fetchJSON('/tasks');

    const visibles = onlyPending ? tasks.filter((t) => !t.done) : tasks;
    // Las pendientes primero, y dentro de cada grupo por prioridad descendente.
    const ordenadas = [...visibles].sort((a, b) =>
      Number(a.done) - Number(b.done) || b.priority - a.priority);

    // replaceChildren: borra lo anterior y pone lo nuevo en una sola llamada.
    list.replaceChildren(...ordenadas.map(taskElement));

    document.getElementById('counter').textContent =
      `${tasks.filter((t) => !t.done).length} pendientes de ${tasks.length}`;
  } catch (error) {
    console.error(error);
    list.replaceChildren();
  }
}

/* ---------- Construcción de un <li> ------------------------------------- */
function taskElement(task) {
  const li = document.createElement('li');
  if (task.done) {
    li.classList.add('done');
  }

  const check = document.createElement('input');
  check.type = 'checkbox';
  check.checked = task.done;
  check.addEventListener('change', () => toggleDone(task));

  const title = document.createElement('span');
  title.className = 'task-title';
  title.textContent = task.title;      // textContent, nunca innerHTML

  const badge = document.createElement('span');
  badge.className = 'badge';
  badge.textContent = `P${task.priority}`;

  const actions = document.createElement('span');
  actions.className = 'task-actions';
  actions.append(
    boton('▲', () => changePriority(task, +1), task.priority >= 5),
    boton('▼', () => changePriority(task, -1), task.priority <= 1),
    boton('✎', () => renameTask(task)),
    boton('✕', () => deleteTask(task)),
  );

  li.append(check, title, badge, actions);
  return li;
}

function boton(label, onClick, disabled = false) {
  const b = document.createElement('button');
  b.type = 'button';
  b.textContent = label;
  b.disabled = disabled;
  b.addEventListener('click', onClick);
  return b;
}

/* ---------- POST: crear -------------------------------------------------- */
async function onSubmit(event) {
  event.preventDefault();              // ← sin esto la página se recarga

  const title = document.getElementById('title');
  const priority = document.getElementById('priority');
  if (!title.value.trim()) {
    return;
  }

  try {
    await fetchJSON('/tasks', {
      method: 'POST',
      body: JSON.stringify({
        title: title.value.trim(),
        priority: Number(priority.value),   // ← los inputs devuelven string
        done: false,
        // OJO: no se manda `id`, json-server lo genera solo.
      }),
    });
    title.value = '';                   // limpiar el formulario
    priority.value = '3';
    await loadTasks();                  // ← recargar SIEMPRE
  } catch (error) {
    console.error(error);
  }
}

/* ---------- PATCH: cambiar un solo campo -------------------------------- */
async function toggleDone(task) {
  try {
    await fetchJSON(`/tasks/${task.id}`, {
      method: 'PATCH',
      body: JSON.stringify({ done: !task.done }),
    });
    await loadTasks();
  } catch (error) {
    console.error(error);
  }
}

async function changePriority(task, delta) {
  const priority = Math.min(5, Math.max(1, task.priority + delta));
  if (priority === task.priority) {
    return;
  }
  try {
    await fetchJSON(`/tasks/${task.id}`, {
      method: 'PATCH',
      body: JSON.stringify({ priority }),
    });
    await loadTasks();
  } catch (error) {
    console.error(error);
  }
}

/* ---------- PUT: reemplazar el objeto entero ---------------------------- */
async function renameTask(task) {
  // window.prompt sirve para practicar; en la prueba usá un input del HTML.
  const title = window.prompt('Nuevo título:', task.title);
  if (title === null || !title.trim()) {
    return;
  }
  try {
    await fetchJSON(`/tasks/${task.id}`, {
      method: 'PUT',
      body: JSON.stringify({ ...task, title: title.trim() }),
    });
    await loadTasks();
  } catch (error) {
    console.error(error);
  }
}

/* ---------- DELETE ------------------------------------------------------ */
async function deleteTask(task) {
  try {
    await fetchJSON(`/tasks/${task.id}`, { method: 'DELETE' });
    await loadTasks();
  } catch (error) {
    console.error(error);
  }
}

/* ---------- El helper que dan en la prueba ------------------------------ */
async function fetchJSON(path, options) {
  const resource = new URL(path, window.location);
  const response = await window.fetch(resource, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });
  if (response.ok) {
    return await response.json();
  } else {
    throw new Error(`Error ${response.status}: ${response.statusText}`);
  }
}
