# Simulacro parcial 2 2025sem1

Simulacro del segundo parcial del curso de Desarrollo Web y Mobile.

## Inicialización

Crear un _fork_ privado de este repositorio. Clonar el _fork_ y ejecutar `npm i` en las carpetas `/api` y `/mobile`.

## Backoffice de la Food App

El ejercicio se trata de implementar una aplicación _mobile_ para el _backoffice_ de la _Food App_ realizada en clase. Se deben tener dos páginas:

### Resumen de stock y precios de comidas

La pantalla muestra las comidas disponibles con su precio y unidades en _stock_. El título debe ser _Comidas_ y se debe mostrar un botón por comida que muestre: ícono (emoji), nombre, precio y unidades en stock (suma de las cantidades de las órdenes). Un click en el botón de una comida lleva al usuario a la página de detalle.

### Detalle de órdenes de comidas

La pantalla muestra el ícono y el nombre de la comida en el título. Debajo se muestra el precio, y un listado con las órdenes con fecha y cantidad.

### Datos

Se proveen datos de prueba en la carpeta `/api/data.json`. Usando el `json-server` se pueden usar las siguientes operaciones:

+ `GET /foods`: obtiene la lista de comidas.

```js
[{ "id": number, "icon": string, "name": string, "price": number }]
```

+ `GET /foods/:food_id`: obtiene una comida por _id_.

```js
{ "id": number, "icon": string, "name": string, "price": number }
```

+ `GET /orders?food=:food_id`: obtiene las órdenes de una comida por _id_.

```js
{ "id": number, "food": number, "date": string, "count": number },
```

