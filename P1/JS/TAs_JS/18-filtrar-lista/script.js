const personas = [
    { nombre: "Ana Martínez", ciudad: "Montevideo" },
    { nombre: "Bruno Silva", ciudad: "Salto" },
    { nombre: "Carla Pérez", ciudad: "Colonia" },
    { nombre: "Diego Fernández", ciudad: "Maldonado" },
    { nombre: "Elena Rodríguez", ciudad: "Paysandú" },
    { nombre: "Federico Gómez", ciudad: "Rivera" }
];

const busqueda = document.getElementById("busqueda");
const listaPersonas = document.getElementById("lista-personas");

/*
    La lista se renderiza de forma dinámica: map() genera un <li> por persona
    usando template strings (comillas invertidas con ${}), join("") une todo en
    un único string y innerHTML lo inserta dentro del <ul>.
*/
listaPersonas.innerHTML = personas
    .map((persona) => `<li>${persona.nombre} - ${persona.ciudad}</li>`)
    .join("");

/*
    El evento "input" se dispara con cada tecla escrita.
    Se compara en minúsculas para que la búsqueda no distinga mayúsculas, y se
    agrega o quita la clase .oculto según si el texto del <li> incluye lo buscado.
*/
busqueda.addEventListener("input", () => {
    const texto = busqueda.value.trim().toLowerCase();
    const elementos = listaPersonas.querySelectorAll("li");

    elementos.forEach((elemento) => {
        const coincide = elemento.textContent.toLowerCase().includes(texto);
        elemento.classList.toggle("oculto", !coincide);
    });
});
