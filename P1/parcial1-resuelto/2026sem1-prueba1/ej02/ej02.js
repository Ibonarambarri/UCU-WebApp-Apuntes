/*
# Ejercicio 02.

Implementar la función que toma una lista de datos de países como los del
archivo `americas.json` y retorna los códigos CCA2 de los países que usan una
moneda dada. Por ejemplo:

```js
import americas from "./americas.json";

countriesForCurrency(americas, "EUR") // Euro
```

debería devolver:

```js
["BL", "GF", "MF", "GP", "PM", "MQ"]
```

Si un elemento no tiene alguna de las propiedades requeridas, se debe arrojar un
error.
*/

export function countriesForCurrency(data, currency) {
  // Si `data` es undefined o null, `.filter` ya lanza un TypeError, que es lo
  // que pide el test (assert.throws).
  return data
    .filter((country) => {
      if (
        typeof country !== "object" || country === null
        || typeof country.cca2 !== "string"
        || typeof country.currencies !== "object" || country.currencies === null
      ) {
        throw new TypeError(
          `Formato inválido: se esperaba { cca2: string, currencies: object }, se recibió ${JSON.stringify(country)}.`,
        );
      }
      // Con currency === undefined, hasOwn da false => arreglo vacío.
      return Object.hasOwn(country.currencies, currency);
    })
    .map((country) => country.cca2);
}
