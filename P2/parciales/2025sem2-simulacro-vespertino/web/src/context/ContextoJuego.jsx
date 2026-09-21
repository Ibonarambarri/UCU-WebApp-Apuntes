// ==============================================
// Archivo: src/context/ContextoJuego.jsx
// Qué hace: guarda el estado GLOBAL del juego (dificultad, errores que
// quedan y países visitados) en un Context de React.
// ¿Por qué un Context? Porque ese estado lo usan TRES rutas distintas:
//   - "/"       (Home) lo inicializa al elegir la dificultad,
//   - "/:cca3"  (PaginaPais) lo lee y lo modifica en cada jugada,
//   - "/end"    (PaginaFinal) lo muestra.
// Cada vez que el router cambia de ruta, el componente de la ruta anterior
// se DESMONTA y pierde su useState. El Provider está en App, por encima
// del router, así que nunca se desmonta y el estado sobrevive.
// Conceptos: createContext, Provider, useState, props.children.
// ==============================================
import { createContext, useState } from 'react';

// El Context. Los componentes lo leen con useContext(ContextoJuego).
// (El comentario de eslint de abajo solo apaga un aviso de "fast refresh"
// porque este archivo exporta un componente Y un context; no afecta la app.)
// eslint-disable-next-line react-refresh/only-export-components
export const ContextoJuego = createContext(null);

// Componente proveedor: envuelve a toda la app (ver App.jsx).
export function ProveedorJuego(props) {
  // Estado: nombre de la dificultad elegida ('facil', 'medio', 'dificil').
  // '' significa que todavía no se eligió (sirve para redirigir a "/").
  const [dificultad, setDificultad] = useState('');

  // Estado: cuántos errores puede cometer todavía el jugador.
  const [erroresRestantes, setErroresRestantes] = useState(0);

  // Estado: array de códigos cca3 de los países ya visitados, en orden.
  const [paisesVisitados, setPaisesVisitados] = useState([]);

  // Empieza un juego nuevo: fija la dificultad, el contador de errores y
  // vacía los visitados. Lo llama Home al presionar un botón de dificultad.
  function iniciarJuego(nombreDeDificultad, cantidadDeErroresPermitidos) {
    setDificultad(nombreDeDificultad);
    setErroresRestantes(cantidadDeErroresPermitidos);
    setPaisesVisitados([]);
  }

  // Agrega un país a la lista de visitados (si no estaba ya).
  // Usamos la forma "valorAnterior => nuevo" porque puede llamarse justo
  // después de otro cambio de estado y así siempre partimos del último valor.
  function agregarPaisVisitado(cca3) {
    setPaisesVisitados((visitadosAnteriores) => {
      // Si ya estaba, devolvemos el mismo array (no cambia nada).
      if (visitadosAnteriores.includes(cca3)) {
        return visitadosAnteriores;
      }
      // Nunca hacemos push sobre el estado: creamos un array nuevo.
      return [...visitadosAnteriores, cca3];
    });
  }

  // Descuenta un error. Devuelve cuántos quedan DESPUÉS de descontar, para
  // que quien llama pueda decidir si hay que ir a "/end" sin esperar al
  // re-render (recordar: setEstado no cambia la variable en el momento).
  function descontarError() {
    const erroresQueQuedan = erroresRestantes - 1;
    setErroresRestantes(erroresQueQuedan);
    return erroresQueQuedan;
  }

  // Lo que reciben los componentes al hacer useContext(ContextoJuego).
  const valorDelContexto = {
    dificultad: dificultad,
    erroresRestantes: erroresRestantes,
    paisesVisitados: paisesVisitados,
    iniciarJuego: iniciarJuego,
    agregarPaisVisitado: agregarPaisVisitado,
    descontarError: descontarError,
  };

  return (
    <ContextoJuego.Provider value={valorDelContexto}>
      {props.children}
    </ContextoJuego.Provider>
  );
}
