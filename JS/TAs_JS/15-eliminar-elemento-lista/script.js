const entrada = document.getElementById("entrada");
const botonAnadir = document.getElementById("boton-anadir");
const botonEliminar = document.getElementById("boton-eliminar");
const lista = document.getElementById("lista");

/* Igual que en el TA 14: agrega un <li> con el texto del input y lo vacía */
botonAnadir.addEventListener("click", () => {
    const texto = entrada.value.trim();

    if (texto === "") {
        return;
    }

    const elemento = document.createElement("li");
    elemento.textContent = texto;
    lista.appendChild(elemento);

    entrada.value = "";
});

/*
    lastElementChild devuelve el último hijo de la lista (o null si está vacía).
    remove() elimina ese elemento del documento.
*/
botonEliminar.addEventListener("click", () => {
    const ultimo = lista.lastElementChild;

    if (ultimo !== null) {
        ultimo.remove();
    }
});
