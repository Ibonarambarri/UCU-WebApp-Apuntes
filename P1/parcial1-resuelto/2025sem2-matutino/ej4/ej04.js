/*
# Ejercicio 04 - Mini-Contacts API (resuelto)

Levantar la API con:  npx json-server db.json --port 3000
y servir esta página (por ejemplo con `npx json-server db.json -s .`).
*/

const API = 'http://localhost:3000/users';

// Orden de roles para Promote / Demote.
const ROLES = ['Viewer', 'Editor', 'Admin'];

function onLoad() {
  document.getElementById('add').addEventListener('click', addUser);
  loadUsers();
}

/* 1. Renderizar los usuarios en #users */
async function loadUsers() {
  const list = document.getElementById('users');
  try {
    const users = await fetchJSON(API);
    list.replaceChildren(...users.map(userElement));
  } catch (error) {
    console.error(error);
    list.replaceChildren();
  }
}

function userElement(user) {
  const li = document.createElement('li');

  const info = document.createElement('span');
  info.textContent = `${user.name} / ${user.role} / ${user.email}`;
  li.append(info, ' ');

  li.append(
    button('Promote', () => changeRole(user, +1)),
    button('Demote', () => changeRole(user, -1)),
    button('Delete', () => deleteUser(user)),
  );
  return li;
}

function button(label, onClick) {
  const b = document.createElement('button');
  b.textContent = label;
  b.addEventListener('click', onClick);
  return b;
}

/* 2. Crear un usuario con lo cargado en el formulario */
async function addUser() {
  const name = document.getElementById('name');
  const email = document.getElementById('email');
  const role = document.getElementById('role');

  if (!name.value.trim() || !email.value.trim()) {
    console.warn('Name y Email son obligatorios.');
    return;
  }

  try {
    await fetchJSON(API, {
      method: 'POST',
      body: JSON.stringify({
        name: name.value.trim(),
        email: email.value.trim(),
        role: role.value,
      }),
    });
    name.value = '';
    email.value = '';
    role.selectedIndex = 0;
    await loadUsers();
  } catch (error) {
    console.error(error);
  }
}

/* 3. Promote / Demote: PATCH que actualiza SOLO el campo role */
async function changeRole(user, delta) {
  const index = ROLES.indexOf(user.role);
  const nextIndex = Math.min(ROLES.length - 1, Math.max(0, index + delta));
  if (nextIndex === index) {
    return;
  }
  try {
    await fetchJSON(`${API}/${user.id}`, {
      method: 'PATCH',
      body: JSON.stringify({ role: ROLES[nextIndex] }),
    });
    await loadUsers();
  } catch (error) {
    console.error(error);
  }
}

/* 4. Delete */
async function deleteUser(user) {
  try {
    await fetchJSON(`${API}/${user.id}`, { method: 'DELETE' });
    await loadUsers();
  } catch (error) {
    console.error(error);
  }
}

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
