/**
 * EJERCICIO DE PARCIAL: SISTEMA DE GESTIÓN DE BIBLIOTECA UNIVERSITARIA - RESUELTO
 *
 * Ejecutar con: node ejercicio_biblioteca.js
 */

// En Node moderno el atributo correcto es `with` (antes era `assert`).
import bibliotecaData from './datos_biblioteca.json' with { type: 'json' };

const biblioteca = { ...bibliotecaData };

/**
 * 1. Función para devolver un libro
 *
 * @param {number} idLibro - ID del libro a devolver
 * @param {number} idEstudiante - ID del estudiante que devuelve
 * @param {string} fechaDevolucion - Fecha de devolución (formato YYYY-MM-DD)
 * @return {boolean|string} - true si se realizó la devolución, mensaje de error si no
 */
function devolverLibro(idLibro, idEstudiante, fechaDevolucion) {
  const libro = biblioteca.libros.find((l) => l.id === idLibro);
  if (!libro) {
    return `Error: no existe un libro con id ${idLibro}.`;
  }

  const estudiante = biblioteca.estudiantes.find((e) => e.id === idEstudiante);
  if (!estudiante) {
    return `Error: no existe un estudiante con id ${idEstudiante}.`;
  }

  if (!/^\d{4}-\d{2}-\d{2}$/.test(fechaDevolucion)) {
    return `Error: la fecha "${fechaDevolucion}" no tiene el formato YYYY-MM-DD.`;
  }

  // El préstamo abierto es el que tiene fechaDevolucion en null.
  const prestamo = libro.prestamos.find((p) => (
    p.estudiante === estudiante.nombre && p.fechaDevolucion === null
  ));
  if (!prestamo) {
    return `Error: ${estudiante.nombre} no tiene prestado "${libro.titulo}".`;
  }

  if (fechaDevolucion < prestamo.fechaPrestamo) {
    return `Error: la devolución no puede ser anterior al préstamo (${prestamo.fechaPrestamo}).`;
  }

  prestamo.fechaDevolucion = fechaDevolucion;
  libro.disponible = true;
  estudiante.librosActuales = estudiante.librosActuales.filter((id) => id !== idLibro);

  return true;
}

/**
 * 2. Función para listar libros prestados actualmente
 *
 * @param {boolean} incluirDetallesEstudiante - Si es true, incluir datos del estudiante
 * @return {array} - Lista de libros prestados
 */
function listarLibrosPrestados(incluirDetallesEstudiante = false) {
  return biblioteca.libros
    .flatMap((libro) => {
      const prestamo = libro.prestamos.find((p) => p.fechaDevolucion === null);
      if (!prestamo) {
        return [];
      }

      const info = {
        id: libro.id,
        titulo: libro.titulo,
        autor: libro.autor,
        categoria: libro.categoria,
        fechaPrestamo: prestamo.fechaPrestamo,
      };

      if (!incluirDetallesEstudiante) {
        return [info];
      }

      const estudiante = biblioteca.estudiantes
        .find((e) => e.nombre === prestamo.estudiante);
      return [{
        ...info,
        estudiante: estudiante
          ? { id: estudiante.id, nombre: estudiante.nombre, carrera: estudiante.carrera }
          : { nombre: prestamo.estudiante },
      }];
    });
}

// ALGUNOS CASOS DE PRUEBA
console.log("Listando libros prestados (sin detalles):");
console.log(listarLibrosPrestados());

console.log("\nProbando devolución de libro:");
console.log(devolverLibro(2, 1, "2025-09-13"));   // true
console.log(devolverLibro(2, 1, "2025-09-13"));   // ya fue devuelto
console.log(devolverLibro(5, 2, "2025-09-13"));   // no lo tiene ese estudiante

console.log("\nListando todos los libros actualmente prestados:");
console.log(listarLibrosPrestados(true));
