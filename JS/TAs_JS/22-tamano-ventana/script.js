const tamano = document.getElementById("tamano");

/*
    window.innerWidth e innerHeight devuelven el ancho y alto visibles de la
    ventana. El texto se arma con un template string.
*/
function mostrarTamano() {
    tamano.textContent = `${window.innerWidth} x ${window.innerHeight} píxeles`;
}

/* El evento resize se dispara cada vez que cambia el tamaño de la ventana */
window.addEventListener("resize", mostrarTamano);

/* Se llama una vez al cargar para mostrar el tamaño inicial */
mostrarTamano();
