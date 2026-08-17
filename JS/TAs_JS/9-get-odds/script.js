/*
    filter() devuelve un arreglo nuevo con los elementos que cumplen la condición.
    Un número es impar cuando el resto de dividirlo entre 2 no es 0.
    Se usa Math.abs para que también funcione con números negativos.
*/
function getOdds(nums) {
    const impares = nums.filter((num) => Math.abs(num % 2) === 1);

    console.log(impares);
    return impares;
}

getOdds([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
getOdds([-3, -2, 0, 15, 22, 47]);
