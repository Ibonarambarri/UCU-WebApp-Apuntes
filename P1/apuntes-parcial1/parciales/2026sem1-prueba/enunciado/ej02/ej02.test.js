// Tests automáticos, por favor no modificar.
// Ejecutar con `node ej02/ej02.test.js` para correr los tests.
import assert from "node:assert";
import { countriesForCurrency } from "./ej02.js";
import americas from "./americas.json" with { type: "json" };

console.log('Ejecutando tests para countriesForCurrency...');

assert.ok(
  typeof countriesForCurrency === "function",
  "El código debe exportar una función llamada countriesForCurrency.",
);
assert.ok(
  Array.isArray(americas) && americas.every((item) => (
    typeof item === "object" && item !== null
    && typeof item.cca2 === "string"
    && typeof item.currencies === "object" && item.currencies !== null
  )),
  "El archivo americas.json debe tener el formato correcto.",
)

assert.deepEqual(
  countriesForCurrency([], "x"),
  [],
  "Para el arreglo vacío debe devolver un arreglo vacío.",
);
assert.deepEqual(
  countriesForCurrency(americas, "EUR"),
  ['BL', 'GF', 'MF', 'GP', 'PM', 'MQ'],
  "Para la moneda EUR debe devolver los códigos CCA2 correctos.",
);
assert.deepEqual(
  countriesForCurrency(americas, "USD"),
  ['US', 'BQ', 'SV', 'PA', 'BS', 'TC', 'EC', 'VG', 'VI', 'PR', 'UM'],
  "Para la moneda USD debe devolver los códigos CCA2 correctos.",
);
assert.deepEqual(
  countriesForCurrency(americas, "UYU"),
  ['UY'],
  "Para la moneda UYU debe devolver los códigos CCA2 correctos.",
);
assert.deepEqual(
  countriesForCurrency(americas, "UYN"),
  [],
  "Para la moneda UYN debe devolver los códigos CCA2 correctos.",
);
assert.deepEqual(
  countriesForCurrency(americas),
  [],
  "Debe devolver un arreglo vacío cuando no se pasa la moneda.",
);

assert.throws(
  () => {
    countriesForCurrency(undefined, 'ARS');
    countriesForCurrency(null, 'BRL');
  },
  "Se debe fallar si el primer argumento es undefined o null.",
);

assert.throws(
  () => {countriesForCurrency([{}], "CLP")},
  "Se debe fallar si los datos no son del formato esperado.",
);

console.log('Tests para countriesForCurrency finalizados correctamente.');
