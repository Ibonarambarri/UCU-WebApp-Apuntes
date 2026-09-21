// ==============================================
// Archivo: src/components/Home.jsx
// Qué hace: página de inicio. Muestra 3 botones de dificultad. Al presionar
// uno, inicializa el estado global del juego (errores permitidos, visitados
// vacío) y redirige a la página de un país elegido al azar.
// Conceptos: useContext, useNavigate (redirección desde código), fetch con
// async/await, elegir al azar.
// ==============================================
import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ContextoJuego } from '../context/ContextoJuego';
import { obtenerCodigosDePaises } from '../services/api';
import { elegirAlAzar } from '../utils/azar';

// Errores permitidos por dificultad (según el enunciado).
const ERRORES_FACIL = 8;
const ERRORES_MEDIO = 5;
const ERRORES_DIFICIL = 3;

function Home() {
  // Estado global del juego (ver ContextoJuego.jsx).
  const contextoJuego = useContext(ContextoJuego);

  // useNavigate devuelve una función para cambiar de ruta desde código
  // (a diferencia de <Link>, que es un enlace que aprieta el usuario).
  const navegar = useNavigate();

  // Estado: true mientras pedimos la lista de países (para no permitir
  // dos clicks seguidos).
  const [estaCargando, setEstaCargando] = useState(false);

  // Estado: mensaje de error si falla la API.
  const [mensajeDeError, setMensajeDeError] = useState('');

  // Se ejecuta al presionar cualquier botón de dificultad. Recibe el nombre
  // de la dificultad y cuántos errores permite.
  async function comenzarJuego(nombreDeDificultad, erroresPermitidos) {
    try {
      setEstaCargando(true);
      setMensajeDeError('');
      // 1) Guardamos en el Context la dificultad, los errores y vaciamos
      //    la lista de visitados (por si es la segunda partida).
      contextoJuego.iniciarJuego(nombreDeDificultad, erroresPermitidos);
      // 2) Elegimos un país al azar de la lista de la API.
      const codigos = await obtenerCodigosDePaises();
      const codigoInicial = elegirAlAzar(codigos);
      // 3) Redirigimos a la página de ese país. PaginaPais se encarga de
      //    marcarlo como visitado y de cargar sus datos.
      navegar('/' + codigoInicial);
    } catch (error) {
      setMensajeDeError(error.message);
      setEstaCargando(false);
    }
  }

  // Un handler por botón, para que quede claro qué hace cada uno.
  function manejarClickFacil() {
    comenzarJuego('facil', ERRORES_FACIL);
  }
  function manejarClickMedio() {
    comenzarJuego('medio', ERRORES_MEDIO);
  }
  function manejarClickDificil() {
    comenzarJuego('dificil', ERRORES_DIFICIL);
  }

  return (
    <main className="pagina">
      <h1>Flag Trivia</h1>
      <p>Elija la dificultad del juego:</p>

      {/* Los 3 botones. Se deshabilitan mientras carga la lista de países. */}
      <div className="fila-botones">
        <button type="button" className="boton-dificultad" onClick={manejarClickFacil} disabled={estaCargando}>
          Fácil ({ERRORES_FACIL} errores)
        </button>
        <button type="button" className="boton-dificultad" onClick={manejarClickMedio} disabled={estaCargando}>
          Medio ({ERRORES_MEDIO} errores)
        </button>
        <button type="button" className="boton-dificultad" onClick={manejarClickDificil} disabled={estaCargando}>
          Difícil ({ERRORES_DIFICIL} errores)
        </button>
      </div>

      {/* Mensaje de error solo si hay uno (ternario con null) */}
      {mensajeDeError !== '' ? <p className="mensaje-error">{mensajeDeError}</p> : null}
    </main>
  );
}

export default Home;
