// ==============================================
// Archivo: src/api/client.js
// Qué hace: centraliza TODAS las llamadas HTTP a json-server. Hay una
//           función genérica fetchJson() y dos "APIs" (cuentasApi y
//           productosApi) con una función por operación REST.
// Conceptos: fetch, async/await, respuesta.ok, métodos HTTP, JSON.stringify.
// ==============================================

// TRAMPA: la plantilla traía 3000, pero la carpeta BE no tenía package.json
// (hubo que crearlo) y la colección de Bruno y el proxy de vite.config.js
// usan 3001. Lo importante es que este puerto sea EL MISMO que el del script
// "dev" de BE/package.json. En esta máquina el 3000 estaba ocupado por otro
// proceso, así que se unificó todo en 3001.
const BASE = 'http://localhost:3001'

// Función genérica: recibe la ruta ("/cuentas") y opciones de fetch
// (method, body...). Arma la URL, agrega el header JSON, comprueba
// respuesta.ok y devuelve el JSON ya parseado.
export async function fetchJson(ruta, opciones = {}) {
  const respuesta = await fetch(`${BASE}${ruta}`, {
    headers: { 'Content-Type': 'application/json', ...opciones.headers },
    ...opciones,
  })
  // fetch NO lanza error con 404/500: hay que lanzarlo nosotros.
  if (!respuesta.ok) {
    const texto = await respuesta.text()
    throw new Error(texto || `Error HTTP ${respuesta.status}`)
  }
  // 204 = "No Content" (por ejemplo algunos DELETE): no hay JSON que leer.
  if (respuesta.status === 204) return null
  return respuesta.json()
}

// Operaciones sobre el recurso /cuentas.
export const cuentasApi = {
  // GET /cuentas -> array con todas las cuentas. (TODO resuelto)
  listar: async function () {
    const cuentas = await fetchJson('/cuentas')
    return cuentas
  },

  // GET /cuentas/:id -> una cuenta.
  obtener: (id) => fetchJson(`/cuentas/${id}`),

  // POST /cuentas -> crea una cuenta. json-server le asigna el id (string).
  // cuerpo = { cliente, productos: [{ icono, nombre, cantidad }] }.
  // (TODO resuelto)
  crear: async function (cuerpo) {
    const cuentaCreada = await fetchJson('/cuentas', {
      method: 'POST',
      body: JSON.stringify(cuerpo),
    })
    return cuentaCreada
  },

  // PUT /cuentas/:id -> reemplaza la cuenta ENTERA (hay que mandar todo).
  reemplazar: (id, cuerpo) =>
    fetchJson(`/cuentas/${id}`, {
      method: 'PUT',
      body: JSON.stringify(cuerpo),
    }),

  // PATCH /cuentas/:id -> modifica SOLO los campos enviados.
  actualizar: (id, cuerpo) =>
    fetchJson(`/cuentas/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(cuerpo),
    }),

  // DELETE /cuentas/:id
  borrar: (id) =>
    fetchJson(`/cuentas/${id}`, {
      method: 'DELETE',
    }),
}

// Operaciones sobre el recurso /productos (venían hechas en la plantilla).
export const productosApi = {
  listar: () => fetchJson('/productos'),
  obtener: (id) => fetchJson(`/productos/${id}`),
  crear: (cuerpo) =>
    fetchJson('/productos', { method: 'POST', body: JSON.stringify(cuerpo) }),
  reemplazar: (id, cuerpo) =>
    fetchJson(`/productos/${id}`, {
      method: 'PUT',
      body: JSON.stringify(cuerpo),
    }),
  actualizar: (id, cuerpo) =>
    fetchJson(`/productos/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(cuerpo),
    }),
  borrar: (id) =>
    fetchJson(`/productos/${id}`, { method: 'DELETE' }),
}
