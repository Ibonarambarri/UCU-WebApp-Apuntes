/*
    Invierte el texto usando métodos de JavaScript:
      split("") convierte el string en un arreglo de caracteres,
      reverse() invierte ese arreglo,
      join("") vuelve a unir los caracteres en un string.
*/
function reverseString(texto) {
    const invertido = texto.split("").reverse().join("");
    console.log(invertido);
    return invertido;
}

reverseString("Hola mundo");
reverseString("JavaScript");
