/*
# Ejercicio 02.

Implementar la función que toma una lista de datos de modelos de IA como los del
archivo `modelos.json` y retorna las siglas de los modelos que soportan una
capacidad dada. Por ejemplo:

```js
import modelos from "./modelos.json";

modelosPorCapacidad(modelos, "web") // Búsqueda web
```

debería devolver:

```js
["GPT", "GRK", "PPX"]
```

Si un elemento no tiene alguna de las propiedades requeridas, se debe arrojar un
error.
*/

export function modelosPorCapacidad(data, capacidad) {
  // Si no nos pasan un array, no podemos trabajar: error.
  if (!Array.isArray(data)) {
    throw new TypeError("El primer argumento debe ser un array de modelos.");
  }

  const siglas = [];

  for (const modelo of data) {
    // Cada modelo tiene que tener sigla (texto) y capacidades (arreglo).
    if (typeof modelo !== "object" || modelo === null || typeof modelo.sigla !== "string" || !Array.isArray(modelo.capacidades)) {
      throw new TypeError("Cada modelo debe tener sigla y capacidades.");
    }

    // Si el modelo soporta la capacidad pedida, guardamos su sigla.
    if (modelo.capacidades.includes(capacidad)) {
      siglas.push(modelo.sigla);
    }
  }

  return siglas;
}
