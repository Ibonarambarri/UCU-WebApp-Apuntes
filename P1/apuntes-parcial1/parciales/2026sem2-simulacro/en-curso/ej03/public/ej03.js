/*
# Ejercicio 03.

Reemplazar este código con lo necesario para implementar lo solicitado en el
ejercicio.
*/

const PROMPTS = [
  "Explicame flexbox como si tuviera 5 años",
  "Escribí un mensaje para pedir prórroga del parcial",
  "Generá un plan de estudio para la prueba de DWYM",
  "¿Por qué mi CSS funciona en mi máquina y en la tuya no?",
  "Resumí este PDF de 300 páginas en un tweet",
  "Convertí este for anidado en algo que no dé vergüenza",
];

const MODELOS = [
  { nombre: "ChatGPT", emoji: "🤖" },
  { nombre: "Claude", emoji: "🧠" },
  { nombre: "Gemini", emoji: "✨" },
  { nombre: "Copilot", emoji: "💻" },
  { nombre: "Llama", emoji: "🦙" },
  { nombre: "DeepSeek", emoji: "🔍" },
];

function elegirAlAzar(array) {
  return array[Math.floor(Math.random() * array.length)];
}

// Combinación que se está mostrando en este momento.
let currentCombo = null;

async function onLoad() {
  newCombo();
  await loadHistory();
}

function onWinA() {
  return saveCombo("A");
}

function onWinB() {
  return saveCombo("B");
}

/* Genera una combinación aleatoria y la muestra en el recuadro #preview. */
function newCombo() {

  const a = elegirAlAzar(MODELOS);
  let b = elegirAlAzar(MODELOS);

  while (a === b) {
    b = elegirAlAzar(MODELOS);
  }

  currentCombo = {
    prompt: elegirAlAzar(PROMPTS),
    modeloA: a.nombre,
    modeloB: b.nombre,
  };
  const prompt = document.getElementById('prompt')
  prompt.textContent = currentCombo.prompt;
  const model_a = document.getElementById('modelo-a');
  model_a.textContent = a.nombre;
  const model_a_emo = document.getElementById('emo-a');
  model_a_emo.textContent = a.emoji;
  const model_b = document.getElementById('modelo-b');
  model_b.textContent = b.nombre;
  const model_b_emo = document.getElementById('emo-b');
  model_b_emo.textContent = b.emoji;


}

/* Envía la combinación actual con el veredicto, y refresca todo. */
async function saveCombo(result) {
  try {
    await fetchJSON('/duelos', {
      method: 'POST',
      body: JSON.stringify({ ...currentCombo, result: result }),
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
    const duelos = await fetchJSON('/duelos');
    history.replaceChildren(...duelos.map(comboElement));
  } catch (error) {
    console.error(error);
    history.replaceChildren();
  }
}

/* Construye el <div class="combo"> de una combinación guardada. */
function comboElement(duelos) {
  const div = document.createElement('div');
  div.className = 'duelo';

  const prompt_spam = document.createElement('span');
  prompt_spam.className = 'duelo-prompt';
  prompt_spam.textContent = duelos.prompt;

  if (duelos.result == "A") {
    const verdict = document.createElement('span');
    verdict.className = 'duelo-resultado';
    verdict.textContent = `${duelos.modeloA} 🏆 vs ${duelos.modeloB}`;
    div.append(prompt_spam, verdict);
  } else {
    const verdict = document.createElement('span');
    verdict.className = 'duelo-resultado';
    verdict.textContent = `${duelos.modeloA} vs ${duelos.modeloB} 🏆`;
    div.append(prompt_spam, verdict);
  }

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
