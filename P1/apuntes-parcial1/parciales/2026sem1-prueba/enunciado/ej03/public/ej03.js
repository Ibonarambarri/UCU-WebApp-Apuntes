/*
# Ejercicio 03.

Reemplazar este código con lo necesario para implementar lo solicitado en el
ejercicio.
*/
function onLoad() {
  console.log(`La función onLoad se ejecuta cuando la página se ha cargado
    completamente.`);
}

function onApprove() {
  console.log(`La función onApprove no está implementada aún.`);
}

function onReject() {
  console.log(`La función onReject no está implementada aún.`);
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

function randomColor() {
  return `#${Array.from(
    { length: 3 },
    () => Math.floor(Math.random() * 256).toString(16).padStart(2, '0'),
  ).join('')}`;
}
