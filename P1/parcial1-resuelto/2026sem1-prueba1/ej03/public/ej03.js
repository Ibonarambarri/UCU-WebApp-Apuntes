/*
# Ejercicio 03 - resuelto.

Al cargar la página se genera una combinación aleatoria de color de texto y
color de fondo. El usuario la aprueba (👍) o la rechaza (👎); en ambos casos la
combinación se envía por POST a la API, se genera una nueva combinación y se
recarga el historial.
*/

// Combinación que se está mostrando en este momento.
let currentCombo = null;

async function onLoad() {
  newCombo();
  await loadHistory();
}

function onApprove() {
  return saveCombo(true);
}

function onReject() {
  return saveCombo(false);
}

/* Genera una combinación aleatoria y la muestra en el recuadro #preview. */
function newCombo() {
  currentCombo = {
    backgroundColor: randomColor(),
    textColor: randomColor(),
  };
  const preview = document.getElementById('preview');
  preview.style.backgroundColor = currentCombo.backgroundColor;
  preview.style.color = currentCombo.textColor;
}

/* Envía la combinación actual con el veredicto, y refresca todo. */
async function saveCombo(approved) {
  try {
    await fetchJSON('/combos', {
      method: 'POST',
      body: JSON.stringify({ ...currentCombo, approved }),
    });
    newCombo();
    await loadHistory();
  } catch (error) {
    console.error(error);
  }
}

/* Pide el historial a la API y lo vuelve a dibujar dentro de #history. */
async function loadHistory() {
  const history = document.getElementById('history');
  try {
    const combos = await fetchJSON('/combos');
    history.replaceChildren(...combos.map(comboElement));
  } catch (error) {
    console.error(error);
    history.replaceChildren();
  }
}

/* Construye el <div class="combo"> de una combinación guardada. */
function comboElement(combo) {
  const div = document.createElement('div');
  div.className = 'combo';
  div.style.backgroundColor = combo.backgroundColor;
  div.style.color = combo.textColor;

  const colors = document.createElement('span');
  colors.className = 'combo-colors';
  colors.textContent = `${combo.backgroundColor} / ${combo.textColor}`;

  const verdict = document.createElement('span');
  verdict.className = 'combo-verdict';
  verdict.textContent = combo.approved ? '👍' : '👎';

  div.append(colors, verdict);
  return div;
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
