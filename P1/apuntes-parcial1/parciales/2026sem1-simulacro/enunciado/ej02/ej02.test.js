// Tests automáticos, por favor no modificar.
// Ejecutar con `node ej02/ej02.test.js` para correr los tests.
import assert from "node:assert";
import { fieldListToObject } from "./ej02.js";

console.log('Ejecutando tests para fieldListToObject...');

assert.equal(
  typeof fieldListToObject,
  "function",
  "El código debe exportar una función llamada fieldListToObject.",
);

assert.deepEqual(
  fieldListToObject([]),
  {},
  "Para la lista vacía debe devolver un objeto vacío.",
);
assert.deepEqual(
  fieldListToObject([{ field: "uno", value: 1 }]),
  { uno: 1 },
);
assert.deepEqual(
  fieldListToObject([{ field: "x", value: 1 }, { field: "y", value: 2 }]),
  { x: 1, y: 2 },
);

assert.deepEqual(
  fieldListToObject([{ filed: "no", value: 1 }]),
  {},
  "Objeto sin 'field' no se deben incluir en el resultado.",
);
assert.deepEqual(
  fieldListToObject([{ field: "yes", valeu: 1 }]),
  { yes: undefined },
  "Objeto sin 'value' se deben incluir con valor undefined.",
);
assert.deepEqual(
  fieldListToObject([{ field: "vale", value: true, other: 'does not matter' }]),
  { vale: true },
  "No deben importar otros campos que no sean 'field' y 'value'.",
);
assert.deepEqual(
  fieldListToObject([{ field: "same", value: 7 }, { field: "same", value: 77 }]),
  { same: 77 },
  "Ante valores repetidos, se debe tomar el último.",
);

assert.throws(
  () => fieldListToObject(),
  "Se debe fallar si el argumento es undefined."
);
assert.throws(
  () => fieldListToObject(null),
  "Se debe fallar si el argumento es null."
);

console.log('Tests para fieldListToObject finalizados correctamente.');
