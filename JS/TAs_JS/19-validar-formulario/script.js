const formulario = document.getElementById("formulario");
const nombre = document.getElementById("nombre");
const password = document.getElementById("password");
const email = document.getElementById("email");
const mensajeExito = document.getElementById("mensaje-exito");

const LARGO_MINIMO_PASSWORD = 8;

/* Expresión regular sencilla: texto + @ + texto + . + texto, sin espacios */
const FORMATO_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/*
    Muestra u oculta el mensaje de error de un campo.
    Devuelve true si el campo es válido, para poder combinar las validaciones.
*/
function mostrarError(campo, mensaje) {
    const parrafoError = document.getElementById(`error-${campo.id}`);

    parrafoError.textContent = mensaje;
    campo.classList.toggle("invalido", mensaje !== "");

    return mensaje === "";
}

function validarNombre() {
    if (nombre.value.trim() === "") {
        return mostrarError(nombre, "El nombre no puede estar vacío");
    }

    return mostrarError(nombre, "");
}

function validarPassword() {
    if (password.value === "") {
        return mostrarError(password, "La contraseña no puede estar vacía");
    }

    if (password.value.length < LARGO_MINIMO_PASSWORD) {
        return mostrarError(
            password,
            `La contraseña debe tener al menos ${LARGO_MINIMO_PASSWORD} caracteres`
        );
    }

    return mostrarError(password, "");
}

function validarEmail() {
    if (email.value.trim() === "") {
        return mostrarError(email, "El correo no puede estar vacío");
    }

    if (!FORMATO_EMAIL.test(email.value.trim())) {
        return mostrarError(email, "El correo no es válido");
    }

    return mostrarError(email, "");
}

/*
    El evento "input" se dispara con cada tecla, así la validación es en tiempo
    real mientras el usuario escribe.
*/
nombre.addEventListener("input", validarNombre);
password.addEventListener("input", validarPassword);
email.addEventListener("input", validarEmail);

/*
    Al enviar se validan los tres campos (sin cortocircuito, para que se muestren
    todos los errores a la vez) y preventDefault() impide el envío si hay errores.
*/
formulario.addEventListener("submit", (evento) => {
    const nombreValido = validarNombre();
    const passwordValida = validarPassword();
    const emailValido = validarEmail();

    if (!nombreValido || !passwordValida || !emailValido) {
        evento.preventDefault();
        mensajeExito.textContent = "";
        return;
    }

    evento.preventDefault(); // solo para la demo: evita recargar la página
    mensajeExito.textContent = "Formulario enviado correctamente";
});
