const books = [
    {
        title: "El nombre del viento",
        author: "Patrick Rothfuss"
    },
    {
        title: "Rayuela",
        author: "Julio Cortázar"
    },
    {
        title: "Cien años de soledad",
        author: "Gabriel García Márquez"
    },
    {
        title: "Dune",
        author: "Frank Herbert"
    }
];

/*
    map() recorre el arreglo y devuelve un arreglo nuevo del mismo largo con el
    resultado de la función para cada elemento; aquí, solo la propiedad title.
*/
function getTheTitles(books) {
    const titulos = books.map((book) => book.title);

    console.log(titulos);
    return titulos;
}

getTheTitles(books);
