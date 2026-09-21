/*
    Un año es bisiesto si es divisible entre 4, salvo los divisibles entre 100 que
    además deben ser divisibles entre 400.
    El operador % devuelve el resto de la división: si el resto es 0, es divisible.
*/
function leapYears(anio) {
    const esBisiesto = anio % 4 === 0 && (anio % 100 !== 0 || anio % 400 === 0);

    console.log(esBisiesto);
    return esBisiesto;
}

leapYears(2024); // true  -> divisible entre 4
leapYears(2023); // false -> no es divisible entre 4
leapYears(1900); // false -> divisible entre 100 pero no entre 400
leapYears(2000); // true  -> divisible entre 100 y entre 400
