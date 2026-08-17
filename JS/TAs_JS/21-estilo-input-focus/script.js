const campo = document.getElementById("campo");

const BORDE_ORIGINAL = "#cccccc";
const BORDE_ENFOCADO = "#1a3a8f";

/*
    focus se dispara cuando el input recibe el foco (al hacer clic o con el
    tabulador) y blur cuando lo pierde.
    La propiedad style.borderColor cambia el estilo en línea del elemento.
*/
campo.addEventListener("focus", () => {
    campo.style.borderColor = BORDE_ENFOCADO;
});

campo.addEventListener("blur", () => {
    campo.style.borderColor = BORDE_ORIGINAL;
});
