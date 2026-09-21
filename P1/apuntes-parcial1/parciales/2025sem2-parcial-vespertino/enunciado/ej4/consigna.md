## Ejercicio 4 — Mini-Products API

**Objetivo:** Consumir una API para listar, crear, reemplazar (PUT) y borrar productos. Además, un botón “Buy 1” que actualice el `stock` (opcional, recomendado para cubrir ambos métodos).

### Consigna (obligatoria)

1. Al inicializar la página: renderizar los datos del db.json como elementos de la lista `#products` con `title`, `price`, `stock`, `category`, y botones **Buy 1** y **Delete**.
2. Al hacer click en el botón `#add-product`: crear un producto, con los valores ingresados en los inputs `#title`, `#price`, `#stock`, `#category`. Tras éxito, **actualizar la UI**.
3. Al hacer click en el botón **Delete**: quitar el producto de la lista, si la operación es exitosa.
4. Al hacer click en el botón **Buy 1**: decrementar `stock` (`{ "stock": stock - 1 }`).
