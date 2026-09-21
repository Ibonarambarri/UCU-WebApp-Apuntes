// Tests automáticos, por favor no modificar.
// Ejecutar con `node ej02/ej02.test.js` para correr los tests.
import assert from "node:assert";
import { modelosPorCapacidad } from "./ej02.js";
import modelos from "./modelos.json" with { type: "json" };

console.log('Ejecutando tests para modelosPorCapacidad...');

assert.ok(
  typeof modelosPorCapacidad === "function",
  "El código debe exportar una función llamada modelosPorCapacidad.",
);
assert.ok(
  Array.isArray(modelos) && modelos.every((item) => (
    typeof item === "object" && item !== null
    && typeof item.sigla === "string"
    && Array.isArray(item.capacidades)
  )),
  "El archivo modelos.json debe tener el formato correcto.",
);

assert.deepEqual(
  modelosPorCapacidad([], "x"),
  [],
  "Para el arreglo vacío debe devolver un arreglo vacío.",
);
assert.deepEqual(
  modelosPorCapacidad(modelos, "web"),
  ["GPT", "GRK", "PPX"],
  "Para la capacidad web debe devolver las siglas correctas.",
);
assert.deepEqual(
  modelosPorCapacidad(modelos, "razonamiento"),
  ["CLD", "DSK", "QWN"],
  "Para la capacidad razonamiento debe devolver las siglas correctas.",
);
assert.deepEqual(
  modelosPorCapacidad(modelos, "video"),
  ["GEM", "NVA"],
  "Para la capacidad video debe devolver las siglas correctas.",
);
assert.deepEqual(
  modelosPorCapacidad(modelos, "audio"),
  ["GEM", "SUN"],
  "Para la capacidad audio debe devolver las siglas correctas.",
);
assert.deepEqual(
  modelosPorCapacidad(modelos, "traduccion"),
  [],
  "Para una capacidad que ningún modelo soporta debe devolver un arreglo vacío.",
);
assert.deepEqual(
  modelosPorCapacidad(modelos),
  [],
  "Debe devolver un arreglo vacío cuando no se pasa la capacidad.",
);

assert.throws(
  () => {
    modelosPorCapacidad(undefined, "texto");
    modelosPorCapacidad(null, "texto");
  },
  "Se debe fallar si el primer argumento es undefined o null.",
);

assert.throws(
  () => { modelosPorCapacidad([{}], "texto") },
  "Se debe fallar si los datos no son del formato esperado.",
);

console.log('Tests para modelosPorCapacidad finalizados correctamente.');
