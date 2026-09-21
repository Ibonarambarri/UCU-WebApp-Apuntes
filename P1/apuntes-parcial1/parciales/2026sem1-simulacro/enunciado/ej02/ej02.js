/*
# Ejercicio 02.

Implementar la función que toma una secuencia de objetos con la forma 
`{ field: string, value: any }` y devuelve un objeto con una propiedad por cada
`field` con el valor correspondiente a `value`. Por ejemplo:

```js
fieldListToObject([
  { field: "comida", value: "Fondue de queso" },
  { field: "país", value: "Suiza" },
  { field: "descripción",
    value: "Queso cremoso y perfectamente derretido, servido en un ritual compartido para mojar y saborear."
  },
]) 
```

debería devolver:

```js
{
  comida: "Fondue de queso",
  país: "Suiza",
  descripción: "Queso cremoso y perfectamente derretido, servido en un ritual compartido para mojar y saborear."
}
*/

export function fieldListToObject(fieldList) {
  //TODO Sustituir este código por la implementación correcta.
  // throw new Error("La función fieldListToObject no está implementada");
  if (fieldList === undefined || fieldList === null) {
    throw new Error("El argumento no puede ser undefined o null.");
  }
}

