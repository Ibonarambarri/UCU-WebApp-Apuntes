const MAYUSCULAS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const MINUSCULAS = "abcdefghijklmnopqrstuvwxyz";
const NUMEROS = "0123456789";
const SIMBOLOS = "!@#$%&*?-_+=";
const LARGO_MINIMO = 8;

/* Devuelve un carácter al azar del conjunto recibido */
function caracterAleatorio(conjunto) {
    const posicion = Math.floor(Math.random() * conjunto.length);
    return conjunto[posicion];
}

/*
    Genera una contraseña del largo pedido.
      1. Se fuerza al menos un carácter de cada tipo para cumplir el requisito.
      2. El resto se completa con caracteres al azar de todos los tipos juntos.
      3. Se mezclan las posiciones (sort con Math.random) para que los caracteres
         obligatorios no queden siempre al principio.
    Como se usa Math.random(), dos llamadas dan resultados distintos.
*/
function generatePassword(length) {
    if (length < LARGO_MINIMO) {
        console.log(`La contraseña debe tener al menos ${LARGO_MINIMO} caracteres`);
        return null;
    }

    const todos = MAYUSCULAS + MINUSCULAS + NUMEROS + SIMBOLOS;
    const caracteres = [
        caracterAleatorio(MAYUSCULAS),
        caracterAleatorio(MINUSCULAS),
        caracterAleatorio(NUMEROS),
        caracterAleatorio(SIMBOLOS)
    ];

    for (let i = caracteres.length; i < length; i++) {
        caracteres.push(caracterAleatorio(todos));
    }

    const password = caracteres.sort(() => Math.random() - 0.5).join("");

    console.log(password);
    return password;
}

generatePassword(8);
generatePassword(8); // distinta de la anterior
generatePassword(16);
generatePassword(4); // no cumple el largo mínimo
