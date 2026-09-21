/*
# Ejercicio 03 - resuelto.

Muestra los colores guardados en la API y permite agregar nuevos con el
formulario.
*/

async function onLoad() {
  await loadColors();
}

/* Pide los colores a la API y los dibuja dentro de #colors. */
async function loadColors() {
  const container = document.getElementById('colors');
  try {
    const colors = await fetchJSON('/colors');
    container.replaceChildren(...colors.map(colorElement));
  } catch (error) {
    console.error(error);
    container.replaceChildren();
  }
}

/* Construye el <div class="color"> de un color. */
function colorElement({ red, green, blue }) {
  const rgb = `rgb(${red}, ${green}, ${blue})`;
  const div = document.createElement('div');
  div.className = 'color';
  div.style.backgroundColor = rgb;
  div.style.color = contrastColor(red, green, blue);
  div.textContent = rgb;
  return div;
}

/* Blanco o negro según qué tanto contraste con el fondo (luminancia). */
function contrastColor(red, green, blue) {
  const luminance = (0.299 * red + 0.587 * green + 0.114 * blue) / 255;
  return luminance > 0.5 ? '#000000' : '#ffffff';
}

/* Envía el color del formulario a la API y recarga la lista. */
async function onAddColor() {
  const form = document.getElementById('color-form');
  if (!form.reportValidity()) {
    return;
  }
  const color = {
    red: Number(document.getElementById('red').value),
    green: Number(document.getElementById('green').value),
    blue: Number(document.getElementById('blue').value),
  };
  try {
    await fetchJSON('/colors', {
      method: 'POST',
      body: JSON.stringify(color),
    });
    await loadColors();
  } catch (error) {
    console.error(error);
  }
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
