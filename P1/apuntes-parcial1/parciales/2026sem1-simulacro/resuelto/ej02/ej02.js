/*
# Ejercicio 02 - resuelto.

Toma una secuencia de objetos `{ field: string, value: any }` y devuelve un
objeto con una propiedad por cada `field` con el valor `value`.
*/

export function fieldListToObject(fieldList) {
  if (fieldList === undefined || fieldList === null) {
    throw new Error("El argumento no puede ser undefined o null.");
  }
  const result = {};
  for (const item of fieldList) {
    // Sólo se incluyen los objetos que tengan la propiedad `field`.
    // Si no tienen `value`, queda undefined (que es lo que pide el test).
    if (item !== null && item !== undefined && "field" in item) {
      result[item.field] = item.value;
    }
  }
  return result;
}
