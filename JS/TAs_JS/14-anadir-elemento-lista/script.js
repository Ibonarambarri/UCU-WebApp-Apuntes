const entrada = document.getElementById("entrada");
const botonAnadir = document.getElementById("boton-anadir");
const lista = document.getElementById("lista");

/*
    Al hacer clic:
      1. Se lee el valor del input con .value y se le quita el espacio sobrante
         con trim(); si quedó vacío no se agrega nada.
      2. createElement("li") crea un nuevo elemento de lista.
      3. appendChild() lo agrega como último hijo del <ul>.
      4. Se vacía el input asignándole un string vacío.
*/
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
