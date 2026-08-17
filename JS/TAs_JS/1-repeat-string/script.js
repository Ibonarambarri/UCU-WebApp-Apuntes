/*
    Imprime el texto recibido tantas veces como indique el parámetro repeticiones.
    Se usa un bucle for: la variable i cuenta desde 0 hasta repeticiones - 1.
*/
function repeatString(texto, repeticiones) {
    for (let i = 0; i < repeticiones; i++) {
        console.log(texto);
    }
}

repeatString("Hola", 3);
repeatString("JavaScript", 5);
