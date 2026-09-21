// ==============================================
// Archivo: src/services/taskService.js
// Qué hace: centraliza TODAS las llamadas HTTP a json-server para el
//           recurso "tasks". Los componentes nunca hacen fetch directo:
//           siempre llaman a estas funciones.
// Conceptos: fetch, async/await, métodos HTTP (GET, POST, PUT, DELETE),
//            respuesta.ok, JSON.stringify / response.json().
// ==============================================

// TRAMPA DEL PARCIAL: la plantilla venía con el puerto 3000, pero el script
// "npm run server" del package.json levanta json-server en el puerto 3001
// (y el enunciado del ejercicio 2 también dice 3001). Si no se unifica el
// puerto, todos los fetch fallan con "Failed to fetch" y la app queda vacía.
const API_URL = "http://localhost:3001/tasks";

// GET /tasks -> devuelve el array con todas las tareas.
export async function getTasks() {
  const response = await fetch(API_URL);
  // Siempre comprobamos response.ok: si el servidor respondió 404/500
  // fetch NO lanza error solo, hay que lanzarlo nosotros.
  if (!response.ok) throw new Error("Error al obtener las tareas");
  return response.json();
}

// GET /tasks/:id -> devuelve UNA tarea. Se usa en la página de edición.
export async function getTask(id) {
  const response = await fetch(`${API_URL}/${id}`);
  if (!response.ok) throw new Error("Tarea no encontrada");
  return response.json();
}

// POST /tasks -> crea una tarea nueva. json-server le asigna el id solo
// (en json-server 1.x el id es un STRING corto, por ejemplo "a1b2").
// Devuelve la tarea creada, ya con id.
export async function createTask(task) {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(task),
  });
  if (!response.ok) throw new Error("Error al crear la tarea");
  return response.json();
}

// PUT /tasks/:id -> REEMPLAZA la tarea completa. Por eso hay que mandar
// TODOS los campos (title, description, status, assignee), no solo el que
// cambió. Si se quisiera mandar solo un campo, habría que usar PATCH.
export async function updateTask(id, task) {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(task),
  });
  if (!response.ok) throw new Error("Error al actualizar la tarea");
  return response.json();
}

// DELETE /tasks/:id -> borra la tarea. No devuelve nada útil.
export async function deleteTask(id) {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) throw new Error("Error al eliminar la tarea");
}
