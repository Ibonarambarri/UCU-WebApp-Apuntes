const parrafo = document.getElementById("parrafo");
const botonAlternar = document.getElementById("boton-alternar");

/*
    classList.toggle("oculto") agrega la clase si el elemento no la tiene y la
    quita si ya la tiene. La clase .oculto está definida en style.css con
    display: none, por lo que el párrafo se muestra u oculta en cada clic.
*/
botonAlternar.addEventListener("click", () => {
    parrafo.classList.toggle("oculto");
});
