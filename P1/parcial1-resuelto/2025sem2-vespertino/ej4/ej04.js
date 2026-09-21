/*
# Ejercicio 04 - Mini-Products API (resuelto)

Levantar con:  npx json-server db.json -s .
*/

const API = 'http://localhost:3000/products';

function onLoad() {
  document.getElementById('add-product').addEventListener('click', addProduct);
  loadProducts();
}

/* 1. Renderizar los productos en #products */
async function loadProducts() {
  const list = document.getElementById('products');
  try {
    const products = await fetchJSON(API);
    list.replaceChildren(...products.map(productElement));
  } catch (error) {
    console.error(error);
    list.replaceChildren();
  }
}

function productElement(product) {
  const li = document.createElement('li');

  const info = document.createElement('span');
  info.textContent =
    `${product.title} — $${product.price} — stock: ${product.stock} — ${product.category}`;

  li.append(
    info,
    button('Buy 1', () => buyOne(product), product.stock <= 0),
    button('Delete', () => deleteProduct(product)),
  );
  return li;
}

function button(label, onClick, disabled = false) {
  const b = document.createElement('button');
  b.textContent = label;
  b.disabled = disabled;
  b.addEventListener('click', onClick);
  return b;
}

/* 2. Crear un producto con los valores del formulario */
async function addProduct() {
  const fields = ['title', 'price', 'stock', 'category']
    .map((id) => document.getElementById(id));

  if (fields.some((f) => f.value.trim() === '')) {
    console.warn('Todos los campos son obligatorios.');
    return;
  }

  const [title, price, stock, category] = fields;
  try {
    await fetchJSON(API, {
      method: 'POST',
      body: JSON.stringify({
        title: title.value.trim(),
        price: Number(price.value),
        stock: Number(stock.value),
        category: category.value.trim(),
      }),
    });
    fields.forEach((f) => { f.value = ''; });
    await loadProducts();
  } catch (error) {
    console.error(error);
  }
}

/* 3. Delete */
async function deleteProduct(product) {
  try {
    await fetchJSON(`${API}/${product.id}`, { method: 'DELETE' });
    await loadProducts();
  } catch (error) {
    console.error(error);
  }
}

/* 4. Buy 1: PUT reemplaza el producto entero con el stock decrementado.
   (Con PATCH alcanzaría con enviar { stock: product.stock - 1 }.) */
async function buyOne(product) {
  if (product.stock <= 0) {
    return;
  }
  try {
    await fetchJSON(`${API}/${product.id}`, {
      method: 'PUT',
      body: JSON.stringify({ ...product, stock: product.stock - 1 }),
    });
    await loadProducts();
  } catch (error) {
    console.error(error);
  }
}

async function fetchJSON(url, options) {
  const response = await fetch(url, {
    ...options,
    headers: { 'Content-Type': 'application/json', ...options?.headers },
  });
  if (!response.ok) {
    throw new Error(`Error ${response.status}: ${response.statusText}`);
  }
  return response.status === 204 ? null : await response.json();
}
