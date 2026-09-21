/* ============================================================
   SNIPPET 2 — DOM sin librerías
   ============================================================ */

/* --- Buscar --- */
document.getElementById('miId');
document.querySelector('.mi-clase');           // el primero
document.querySelectorAll('.mi-clase');        // NodeList → [...lista] para mapear

/* --- Crear y llenar --- */
const div = document.createElement('div');
div.className = 'tarjeta activa';              // reemplaza todas las clases
div.classList.add('activa');                   // agrega una
div.classList.remove('activa');
div.classList.toggle('activa');
div.textContent = 'hola';                      // texto seguro
div.id = 'x';
div.dataset.idItem = 42;                       // <div data-id-item="42">
div.style.backgroundColor = '#fff';            // camelCase, no background-color
div.style.visibility = 'hidden';               // oculta PERO sigue ocupando lugar
div.style.display = 'none';                    // oculta y saca del layout

/* --- Insertar --- */
padre.append(a, b, 'texto');                   // al final
padre.prepend(x);                              // al principio
padre.replaceChildren(...nuevos);              // ← EL BUENO: borra todo y pone
padre.replaceChildren();                       // vaciar
hijo.remove();                                 // borrarse a sí mismo

/* --- Eventos --- */
btn.addEventListener('click', () => hacerAlgo(item));
form.addEventListener('submit', (e) => { e.preventDefault(); });
input.addEventListener('input', (e) => console.log(e.target.value));

/* --- Inputs --- */
input.value;              // SIEMPRE string → Number(input.value)
input.value.trim();
checkbox.checked;         // boolean
select.value;
select.selectedIndex = 0; // resetear
form.reportValidity();    // dispara la validación HTML (required, min, max)

/* --- Esperar al DOM (elegí UNA) --- */
// 1. en el HTML:  <body onload="onLoad()">
// 2. en el HTML:  <script src="app.js" defer></script>
// 3. en el JS:    document.addEventListener('DOMContentLoaded', onLoad);

/* ============================================================
   PATRÓN: render completo desde un estado
   (así resolvés "favoritos que van primero", "filtros", etc.)
   ============================================================ */

let items = [];
const favoritos = new Set();

function render() {
  const ordenados = [
    ...items.filter((i) => favoritos.has(i.id)),
    ...items.filter((i) => !favoritos.has(i.id)),
  ];
  document.getElementById('lista').replaceChildren(...ordenados.map(itemEl));
}

function toggleFavorito(id) {
  if (favoritos.has(id)) favoritos.delete(id);
  else favoritos.add(id);
  render();                 // no toques el DOM a mano: volvé a dibujar todo
}

/* ============================================================
   Aleatorios (salió en genExp, dado, display LED, combos de color)
   ============================================================ */

// entero en [min, max]
const randomInt = (min, max) => min + Math.floor(Math.random() * (max - min + 1));

// elegir de una lista
const elegir = (lista) => lista[Math.floor(Math.random() * lista.length)];

// color hex aleatorio
const randomColor = () => `#${Array.from(
  { length: 3 },
  () => Math.floor(Math.random() * 256).toString(16).padStart(2, '0'),
).join('')}`;

// blanco o negro según el fondo
function contrastColor(r, g, b) {
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255 > 0.5 ? '#000000' : '#ffffff';
}
