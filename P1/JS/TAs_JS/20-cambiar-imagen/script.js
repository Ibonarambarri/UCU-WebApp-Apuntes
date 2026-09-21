const imagen = document.getElementById("imagen");

const IMAGEN_ORIGINAL = "imagen1.svg";
const IMAGEN_HOVER = "imagen2.svg";

/*
    mouseenter se dispara cuando el puntero entra en el elemento y mouseleave
    cuando lo abandona. Cambiando el atributo src (y el alt) se muestra otra imagen.
*/
imagen.addEventListener("mouseenter", () => {
    imagen.src = IMAGEN_HOVER;
    imagen.alt = "Imagen de noche";
});

imagen.addEventListener("mouseleave", () => {
    imagen.src = IMAGEN_ORIGINAL;
    imagen.alt = "Imagen de día";
});
