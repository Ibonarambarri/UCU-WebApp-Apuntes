/*
    Elimina el item del arreglo original.
      indexOf() devuelve la posición del item (o -1 si no está).
      splice(posicion, 1) elimina un elemento en esa posición.
    Se usa un while para eliminar todas las apariciones del item.
*/
function removeFromArray(arreglo, item) {
    let posicion = arreglo.indexOf(item);

    while (posicion !== -1) {
        arreglo.splice(posicion, 1);
        posicion = arreglo.indexOf(item);
    }

    console.log(arreglo);
    return arreglo;
}

removeFromArray([1, 2, 3, 4, 5], 3);
removeFromArray(["rojo", "verde", "azul", "verde"], "verde");
