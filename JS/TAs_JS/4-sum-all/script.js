/*
    Suma todos los números entre a y b, ambos incluidos.
    Se calcula el menor y el mayor con Math.min y Math.max para que la función
    funcione aunque a sea mayor que b.
*/
function sumAll(a, b) {
    const desde = Math.min(a, b);
    const hasta = Math.max(a, b);
    let suma = 0;

    for (let i = desde; i <= hasta; i++) {
        suma += i;
    }

    console.log(suma);
    return suma;
}

sumAll(1, 4);
sumAll(1, 100);
sumAll(10, 5);
