/*
    Convierte Fahrenheit a Celsius: (F - 32) * 5 / 9.
    toFixed(1) redondea a un decimal pero devuelve un string, por eso se envuelve
    en Number() para que el resultado siga siendo un número.
*/
function convertToCelsius(temp) {
    const celsius = Number((((temp - 32) * 5) / 9).toFixed(1));

    console.log(celsius);
    return celsius;
}

/* Convierte Celsius a Fahrenheit: C * 9 / 5 + 32 */
function convertToFahrenheit(temp) {
    const fahrenheit = Number(((temp * 9) / 5 + 32).toFixed(1));

    console.log(fahrenheit);
    return fahrenheit;
}

convertToCelsius(100); // 37.8
convertToCelsius(32);  // 0
convertToFahrenheit(0);  // 32
convertToFahrenheit(37); // 98.6
