/* ============================================================
   SNIPPET 1 — fetch + CRUD contra json-server
   Copiar tal cual y cambiar los nombres.
   ============================================================ */

/* --- El helper que te dan en la prueba (2026). NO lo reescribas. --- */
async function fetchJSON(path, options) {
  const resource = new URL(path, window.location);
  const response = await window.fetch(resource, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });
  if (response.ok) {
    return await response.json();
  } else {
    throw new Error(`Error ${response.status}: ${response.statusText}`);
  }
}

/* --- Si NO te lo dan (2025), esta versión sirve con URL absoluta --- */
async function fetchJSONAbsoluto(url, options) {
  const response = await fetch(url, {
    ...options,
    headers: { 'Content-Type': 'application/json', ...options?.headers },
  });
  if (!response.ok) {
    throw new Error(`Error ${response.status}: ${response.statusText}`);
  }
  // DELETE a veces devuelve 204 sin cuerpo → .json() explotaría
  return response.status === 204 ? null : await response.json();
}

/* ============================================================
   Las 5 operaciones. `items` es el nombre de la entidad en db.json
   ============================================================ */

// LISTAR
const todos = await fetchJSON('/items');

// UNO SOLO
const uno = await fetchJSON(`/items/${id}`);

// CREAR — sin id, lo genera json-server
await fetchJSON('/items', {
  method: 'POST',
  body: JSON.stringify({ nombre: 'x', valor: 3 }),
});

// MODIFICAR UN CAMPO (lo que piden cuando dicen "actualizar SOLO el rol/stock")
await fetchJSON(`/items/${id}`, {
  method: 'PATCH',
  body: JSON.stringify({ stock: item.stock - 1 }),
});

// REEMPLAZAR ENTERO (cuando la consigna dice PUT)
await fetchJSON(`/items/${id}`, {
  method: 'PUT',
  body: JSON.stringify({ ...item, stock: item.stock - 1 }),
});

// BORRAR
await fetchJSON(`/items/${id}`, { method: 'DELETE' });

/* ============================================================
   ESQUELETO COMPLETO — sirve para el ej03/ej04 de cualquier año
   ============================================================ */

async function onLoad() {
  await loadItems();
}

async function loadItems() {
  const cont = document.getElementById('lista');
  try {
    const items = await fetchJSON('/items');
    // replaceChildren borra lo viejo y pone lo nuevo de una
    cont.replaceChildren(...items.map(itemElement));
  } catch (error) {
    console.error(error);
    cont.replaceChildren();
  }
}

function itemElement(item) {
  const li = document.createElement('li');

  const texto = document.createElement('span');
  texto.textContent = `${item.nombre} — ${item.valor}`;

  li.append(
    texto,
    boton('Editar', () => editar(item)),
    boton('Borrar', () => borrar(item)),
  );
  return li;
}

function boton(label, onClick, disabled = false) {
  const b = document.createElement('button');
  b.type = 'button';
  b.textContent = label;
  b.disabled = disabled;
  b.addEventListener('click', onClick);
  return b;
}

async function crear() {
  const nombre = document.getElementById('nombre');
  const valor = document.getElementById('valor');
  if (!nombre.value.trim()) return;

  try {
    await fetchJSON('/items', {
      method: 'POST',
      body: JSON.stringify({
        nombre: nombre.value.trim(),
        valor: Number(valor.value),   // ← ¡Number!
      }),
    });
    nombre.value = '';
    valor.value = '';
    await loadItems();                 // ← SIEMPRE recargar
  } catch (error) {
    console.error(error);
  }
}

async function editar(item) {
  try {
    await fetchJSON(`/items/${item.id}`, {
      method: 'PATCH',
      body: JSON.stringify({ valor: item.valor + 1 }),
    });
    await loadItems();
  } catch (error) {
    console.error(error);
  }
}

async function borrar(item) {
  try {
    await fetchJSON(`/items/${item.id}`, { method: 'DELETE' });
    await loadItems();
  } catch (error) {
    console.error(error);
  }
}

/* --- Formulario con submit --- */
document.getElementById('mi-form').addEventListener('submit', async (event) => {
  event.preventDefault();     // ← sin esto se recarga la página y perdés todo
  await crear();
});
