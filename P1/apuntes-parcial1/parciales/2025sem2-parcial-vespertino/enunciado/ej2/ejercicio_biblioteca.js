/**
 * EJERCICIO DE PARCIAL: SISTEMA DE GESTIÓN DE BIBLIOTECA UNIVERSITARIA
 * 
 * OBJETIVO: Implementar un sistema que permita gestionar los préstamos de libros 
 * en una biblioteca universitaria, aplicando conceptos avanzados de manipulación
 * de objetos y arrays en JavaScript.
 * 
 * INSTRUCCIONES:
 * 1. Analiza la estructura de datos proporcionada
 * 2. Implementa todas las funciones requeridas 
 * 3. Prueba tus funciones con los datos de ejemplo y los casos de prueba proporcionados
 * 4. NO modifiques la estructura base de los objetos, solo añade las funcionalidades solicitadas
 */

// Importamos los datos desde el archivo JSON usando ES6 import
import bibliotecaData from './datos_biblioteca.json' assert { type: 'json' };

// Creamos una copia de los datos para trabajar con ellos
const biblioteca = { ...bibliotecaData };

/**
 * FUNCIONES A IMPLEMENTAR:
 */

/**
 * 1. Función para devolver un libro
 * 
 * Implementa una función que gestione el proceso de devolución de un libro por parte de un estudiante.
 * Deberás validar la información y actualizar los registros del sistema adecuadamente.
 * 
 * @param {number} idLibro - ID del libro a devolver
 * @param {number} idEstudiante - ID del estudiante que devuelve
 * @param {string} fechaDevolucion - Fecha de devolución (formato YYYY-MM-DD)
 * @return {boolean|string} - true si se realizó la devolución, mensaje de error si no
 */
function devolverLibro(idLibro, idEstudiante, fechaDevolucion) {
  // Tu código aquí
}

/**
 * 2. Función para listar libros prestados actualmente
 * 
 * Crea una función que genere un informe de los libros que actualmente
 * se encuentran prestados, con opción de incluir información del estudiante.
 * 
 * @param {boolean} incluirDetallesEstudiante - Si es true, incluir datos del estudiante
 * @return {array} - Lista de libros prestados
 */
function listarLibrosPrestados(incluirDetallesEstudiante = false) {
  // Tu código aquí
}

// ALGUNOS CASOS DE PRUEBA
// Descomentar para probar tu implementación

/*

console.log("\nProbando devolución de libro:");
console.log(devolverLibro(2, 1, "2025-09-13"));

console.log("\nListando todos los libros actualmente prestados:");
console.log(listarLibrosPrestados(true));
*/

