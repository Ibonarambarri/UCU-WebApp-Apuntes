/*
# Ejercicio 03.

Reemplazar este código con lo necesario para implementar lo solicitado en el
ejercicio.
*/
function onLoad() {
  console.log(`La función onLoad se ejecuta cuando la página se ha cargado
    completamente.`);
}

function onAddColor() {
    console.log(`La función onAddColor no está implementada aún.`);
}

async function fetchJSON(path, options) {
  const resource = new URL(path, window.location);
  const response = await window.fetch(resource, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  })
  if (response.ok) {
    return await response.json();
  } else {
    throw new Error(`Error ${response.status}: ${response.statusText}`);
  }
}
