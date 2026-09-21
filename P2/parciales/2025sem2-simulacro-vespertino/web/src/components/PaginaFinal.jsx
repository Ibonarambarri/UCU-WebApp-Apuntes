// ==============================================
// Archivo: src/components/PaginaFinal.jsx
// Qué hace: página "/end". Avisa que terminó el viaje, lista los países
// visitados (que vienen del Context) y ofrece un botón para volver al
// inicio.
// Conceptos: useContext, useNavigate, listas con .map.
// ==============================================
import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { ContextoJuego } from '../context/ContextoJuego';

function PaginaFinal() {
  // Leemos los países visitados del estado global.
  const contextoJuego = useContext(ContextoJuego);
  const navegar = useNavigate();

  // Al presionar "Volver al inicio" vamos a "/". Ahí el usuario elige
  // dificultad de nuevo y iniciarJuego() limpia la lista de visitados.
  function manejarClickVolver() {
    navegar('/');
  }

  return (
    <main className="pagina">
      <h1>Fin del juego</h1>
      <p>Usted visitó los siguientes países ({contextoJuego.paisesVisitados.length}):</p>

      {/* Lista de códigos visitados. El cca3 es único, sirve como key. */}
      <ul className="lista-visitados">
        {contextoJuego.paisesVisitados.map((cca3) => (
          <li key={cca3}>
            <img className="bandera-chica" src={'/flags/' + cca3 + '.svg'} alt={'Bandera de ' + cca3} />
            {cca3}
          </li>
        ))}
      </ul>

      <button type="button" className="boton-principal" onClick={manejarClickVolver}>
        Volver al inicio
      </button>
    </main>
  );
}

export default PaginaFinal;
