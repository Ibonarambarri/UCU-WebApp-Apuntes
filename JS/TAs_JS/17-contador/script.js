const contador = document.getElementById("contador");
const botonIncrementar = document.getElementById("boton-incrementar");

/*
    El valor se guarda en una variable de JavaScript en lugar de leerlo del HTML,
    y en cada clic se incrementa y se vuelca al <span> con textContent.
*/
let clics = 0;

botonIncrementar.addEventListener("click", () => {
    clics++;
    contador.textContent = clics;
});
