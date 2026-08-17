/*
    getElementById busca en el documento el elemento cuyo atributo id coincide.
    addEventListener("click", ...) ejecuta la función cada vez que se hace clic.
    textContent permite leer o cambiar el texto que hay dentro del elemento.
*/
const parrafo = document.getElementById("parrafo");
const botonCambiar = document.getElementById("boton-cambiar");

botonCambiar.addEventListener("click", () => {
    parrafo.textContent = "Texto cambiado";
});
