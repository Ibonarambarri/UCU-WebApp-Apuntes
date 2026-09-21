/*
# Ejercicio 03 - resuelto.

Obtiene la lista de países de la API pública y la muestra con bandera, código y
nombre común. Cada tarjeta tiene un ícono de favorito: los favoritos se
muestran primero y con un estilo distinto.
*/

const API_URL = 'https://restcountries.com/v3.1/all?fields=cca2,name,flags';

// Estado de la página.
let countries = [];               // [{ cca2, name, flag, alt }]
const favorites = new Set();      // códigos cca2 marcados como favoritos

async function showCountries() {
  try {
    const data = await fetchJSON(API_URL);
    countries = data
      .map((country) => ({
        cca2: country.cca2,
        name: country.name.common,
        flag: country.flags.png,
        alt: country.flags.alt ?? `Flag of ${country.name.common}`,
      }))
      // Orden alfabético "original" por nombre común.
      .sort((a, b) => a.name.localeCompare(b.name));
    render();
  } catch (error) {
    console.error(error);
    document.getElementById('countries').textContent =
      'No se pudieron cargar los países.';
  }
}

/* Dibuja la lista: primero los favoritos, luego el resto (ambos alfabéticos). */
function render() {
  const ordered = [
    ...countries.filter((c) => favorites.has(c.cca2)),
    ...countries.filter((c) => !favorites.has(c.cca2)),
  ];

  const ul = document.createElement('ul');
  ul.append(...ordered.map(countryElement));
  document.getElementById('countries').replaceChildren(ul);
}

function countryElement(country) {
  const isFavorite = favorites.has(country.cca2);

  const li = document.createElement('li');

  const container = document.createElement('div');
  container.className = isFavorite ? 'country-container favorite-card' : 'country-container';

  const header = document.createElement('div');
  header.className = 'card-header';

  const img = document.createElement('img');
  img.src = country.flag;
  img.alt = country.alt;

  const star = document.createElement('span');
  star.className = 'favorite';
  star.textContent = isFavorite ? '❤️' : '♡';
  star.title = isFavorite ? 'Quitar de favoritos' : 'Marcar como favorito';
  star.addEventListener('click', () => toggleFavorite(country.cca2));

  header.append(img, star);

  const p = document.createElement('p');
  p.textContent = `${country.cca2}: ${country.name}`;

  container.append(header, p);
  li.append(container);
  return li;
}

function toggleFavorite(cca2) {
  if (favorites.has(cca2)) {
    favorites.delete(cca2);
  } else {
    favorites.add(cca2);
  }
  render();
}

async function fetchJSON(url, options) {
  const response = await fetch(url, options);
  if (!response.ok) {
    throw new Error(`Error ${response.status}: ${response.statusText}`);
  }
  return await response.json();
}
