/*
    Cuenta cuántos valores distintos aparecen más de una vez.
      1. filter() con indexOf/lastIndexOf no alcanza para contar valores únicos,
         por eso se arma primero un Set con los valores que están repetidos.
      2. Un Set no admite elementos duplicados, así que su tamaño (size) es
         directamente la cantidad de valores repetidos distintos.
*/
function duplicates(nums) {
    const repetidos = new Set(
        nums.filter((num, indice) => nums.indexOf(num) !== indice)
    );

    console.log(repetidos.size);
    return repetidos.size;
}

duplicates([1, 2, 2, 3, 4, 4, 4, 5]); // 2 -> el 2 y el 4
duplicates([1, 2, 3]);                // 0 -> no hay repetidos
duplicates([7, 7, 7, 7]);             // 1 -> solo el 7
