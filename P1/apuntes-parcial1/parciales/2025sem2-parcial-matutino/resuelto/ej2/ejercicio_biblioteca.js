/**
 * EJERCICIO DE PARCIAL: SISTEMA DE GESTIÓN DE BIBLIOTECA UNIVERSITARIA - RESUELTO
 *
 * Ejecutar con: node ejercicio_biblioteca.js
 */

// En Node moderno el atributo correcto es `with` (antes era `assert`).
import bibliotecaData from './datos_biblioteca.json' with { type: 'json' };

// Copia (superficial) de los datos para trabajar con ellos.
const biblioteca = { ...bibliotecaData };

/**
 * 1. Función para prestar un libro
 *
 * @param {number} idLibro - ID del libro a prestar
 * @param {number} idEstudiante - ID del estudiante que pide prestado
 * @param {string} fechaPrestamo - Fecha del préstamo (formato YYYY-MM-DD)
 * @return {boolean|string} - true si se realizó el préstamo, mensaje de error si no
 */
function prestarLibro(idLibro, idEstudiante, fechaPrestamo) {
  const libro = biblioteca.libros.find((l) => l.id === idLibro);
  if (!libro) {
    return `Error: no existe un libro con id ${idLibro}.`;
  }

  const estudiante = biblioteca.estudiantes.find((e) => e.id === idEstudiante);
  if (!estudiante) {
    return `Error: no existe un estudiante con id ${idEstudiante}.`;
  }

  if (!libro.disponible) {
    return `Error: el libro "${libro.titulo}" no está disponible.`;
  }

  if (!/^\d{4}-\d{2}-\d{2}$/.test(fechaPrestamo)) {
    return `Error: la fecha "${fechaPrestamo}" no tiene el formato YYYY-MM-DD.`;
  }

  if (estudiante.librosActuales.includes(idLibro)) {
    return `Error: ${estudiante.nombre} ya tiene prestado "${libro.titulo}".`;
  }

  // Actualizar los registros: el libro deja de estar disponible, se agrega el
  // préstamo abierto (fechaDevolucion en null) y se registra en el estudiante.
  libro.disponible = false;
  libro.prestamos.push({
    estudiante: estudiante.nombre,
    fechaPrestamo,
    fechaDevolucion: null,
  });
  estudiante.librosActuales.push(idLibro);

  return true;
}

/**
 * 2. Función para buscar libros
 *
 * Criterios soportados: titulo, autor, categoria (subcadena, sin distinguir
 * mayúsculas), disponible (booleano) y añoPublicacion (número exacto).
 *
 * @param {object} criterios - Objeto con los criterios de búsqueda
 * @return {array} - Array con los libros que cumplen los criterios
 */
function buscarLibros(criterios = {}) {
  const contiene = (valor, buscado) =>
    String(valor).toLowerCase().includes(String(buscado).toLowerCase());

  return biblioteca.libros.filter((libro) => (
    (criterios.titulo === undefined || contiene(libro.titulo, criterios.titulo))
    && (criterios.autor === undefined || contiene(libro.autor, criterios.autor))
    && (criterios.categoria === undefined || contiene(libro.categoria, criterios.categoria))
    && (criterios.disponible === undefined || libro.disponible === criterios.disponible)
    && (criterios.añoPublicacion === undefined || libro.añoPublicacion === criterios.añoPublicacion)
  ));
}

// ALGUNOS CASOS DE PRUEBA
console.log("Probando préstamo de libro:");
console.log(prestarLibro(1, 3, "2025-09-13"));       // true
console.log(prestarLibro(1, 3, "2025-09-13"));       // ya no está disponible
console.log(prestarLibro(99, 3, "2025-09-13"));      // libro inexistente
console.log(prestarLibro(4, 1, "13/09/2025"));       // fecha inválida

console.log("\nBuscando libros de programación disponibles:");
console.log(buscarLibros({ categoria: "Programación", disponible: true }));

console.log("\nBuscando por autor:");
console.log(buscarLibros({ autor: "john doe" }).map((l) => l.titulo));
