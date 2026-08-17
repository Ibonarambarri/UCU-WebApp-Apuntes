/*
    reduce() acumula un único valor recorriendo el arreglo: acumulador empieza en 0
    (segundo parámetro) y en cada paso se le suma el número actual.
*/
function getSum(nums) {
    const suma = nums.reduce((acumulador, num) => acumulador + num, 0);

    console.log(suma);
    return suma;
}

getSum([1, 2, 3, 4, 5]);
getSum([10, 20, 30]);
getSum([]);
