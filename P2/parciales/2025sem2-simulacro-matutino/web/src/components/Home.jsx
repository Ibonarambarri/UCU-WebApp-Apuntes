// ==============================================
// Archivo: src/components/Home.jsx
// Qué hace: la página de la trivia. Elige un país al azar, muestra su mapa
// y 4 banderas (1 correcta + 3 distractoras, en orden aleatorio). Al elegir
// una, avisa si estuvo bien o mal, ajusta el puntaje, habilita el enlace del
// mapa a la página del país y ofrece un botón para jugar otra ronda.
// Conceptos: useState, useEffect con dependencia, useContext, fetch con
// async/await, azar, Link, listas con .map.
// ==============================================
import { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { obtenerCodigosDePaises, obtenerPais } from '../services/api';
import { elegirAlAzar, elegirVariosDistintos, mezclarArray } from '../utils/azar';
import { ContextoPuntaje } from '../context/ContextoPuntaje';
import BotonBandera from './BotonBandera';

// Cantidad de banderas "distractoras" que acompañan a la correcta.
const CANTIDAD_DE_DISTRACTORES = 3;

// Convierte un país de la API en una "opción" para un BotonBandera.
// Muchos países del mock tienen flag.alt vacío; en ese caso inventamos un
// texto alternativo para que el botón siempre tenga descripción.
function armarOpcion(pais) {
  let textoAlternativo = pais.flag.alt;
  if (!textoAlternativo) {
    textoAlternativo = 'Bandera de ' + pais.name.common;
  }
  return {
    cca3: pais.cca3,
    imagenSrc: pais.flag.svg,
    textoAlternativo: textoAlternativo,
  };
}

function Home() {
  // El puntaje NO vive acá sino en el Context, porque Home se desmonta al
  // navegar a /country/:cca3 y perdería el estado (ver ContextoPuntaje.jsx).
  const contextoPuntaje = useContext(ContextoPuntaje);

  // Estado: el país que hay que adivinar (objeto completo de la API).
  const [paisCorrecto, setPaisCorrecto] = useState(null);

  // Estado: las 4 opciones ya mezcladas. Cada una es un objeto
  // { cca3, imagenSrc, textoAlternativo }.
  const [opciones, setOpciones] = useState([]);

  // Estado: el cca3 de la bandera que eligió el usuario. null = todavía no
  // respondió en esta ronda.
  const [respuestaElegida, setRespuestaElegida] = useState(null);

  // Estado: número de ronda. Cambiarlo es la forma de pedir "otro desafío":
  // como está en las dependencias del useEffect, al cambiar se vuelve a
  // ejecutar el efecto y se carga un país nuevo SIN recargar la página.
  const [numeroDeRonda, setNumeroDeRonda] = useState(1);

  // Estado: true mientras esperamos a la API (para mostrar "Cargando...").
  const [estaCargando, setEstaCargando] = useState(true);

  // Estado: texto de error si falla algún fetch. '' significa sin error.
  const [mensajeDeError, setMensajeDeError] = useState('');

  // Efecto: arma una ronda nueva. Depende de [numeroDeRonda]: se ejecuta al
  // montar el componente (ronda 1) y cada vez que el botón "Otro desafío"
  // cambia el número de ronda.
  useEffect(() => {
    // Definimos una función async adentro porque la función del useEffect
    // no puede ser async directamente.
    async function cargarRonda() {
      try {
        setEstaCargando(true);
        setMensajeDeError('');
        // Al empezar una ronda todavía no hay respuesta elegida.
        setRespuestaElegida(null);

        // 1) Pedimos todos los códigos de país.
        const codigos = await obtenerCodigosDePaises();

        // 2) Elegimos un país al azar. Algunos países del mock no tienen mapa;
        //    si nos toca uno de esos, seguimos eligiendo hasta encontrar uno
        //    que sí tenga (sin mapa no se puede jugar la ronda).
        let paisElegido = null;
        while (paisElegido === null) {
          const codigoCandidato = elegirAlAzar(codigos);
          const paisCandidato = await obtenerPais(codigoCandidato);
          if (paisCandidato.map && paisCandidato.map.svg) {
            paisElegido = paisCandidato;
          }
        }

        // 3) Elegimos 3 códigos distintos entre sí y distintos del correcto.
        const codigosDistractores = elegirVariosDistintos(
          codigos,
          CANTIDAD_DE_DISTRACTORES,
          [paisElegido.cca3]
        );

        // 4) Armamos la lista de opciones. Para cada distractor pedimos su
        //    detalle para tener la ruta de la bandera y el texto alternativo.
        const opcionesSinMezclar = [];
        opcionesSinMezclar.push(armarOpcion(paisElegido));
        for (const codigoDistractor of codigosDistractores) {
          const paisDistractor = await obtenerPais(codigoDistractor);
          opcionesSinMezclar.push(armarOpcion(paisDistractor));
        }

        // 5) Mezclamos para que la correcta quede en una posición aleatoria.
        const opcionesMezcladas = mezclarArray(opcionesSinMezclar);

        // 6) Guardamos todo en el estado: esto provoca el re-render.
        setPaisCorrecto(paisElegido);
        setOpciones(opcionesMezcladas);
      } catch (error) {
        setMensajeDeError(error.message);
      } finally {
        // finally se ejecuta siempre, haya salido bien o mal.
        setEstaCargando(false);
      }
    }

    cargarRonda();
  }, [numeroDeRonda]);

  // Se ejecuta cuando el usuario presiona una bandera. Recibe el cca3 de la
  // bandera presionada (lo manda BotonBandera).
  function manejarEleccionDeBandera(cca3Elegido) {
    // Si ya respondió en esta ronda no hacemos nada (los botones además
    // están deshabilitados, esto es una doble protección).
    if (respuestaElegida !== null) {
      return;
    }
    setRespuestaElegida(cca3Elegido);
    // Ajustamos el puntaje del Context según si acertó o no.
    if (cca3Elegido === paisCorrecto.cca3) {
      contextoPuntaje.sumarPunto();
    } else {
      contextoPuntaje.restarPunto();
    }
  }

  // Se ejecuta al presionar "Otro desafío". Solo cambia el número de ronda;
  // el useEffect hace el resto porque numeroDeRonda está en sus dependencias.
  function manejarClickOtroDesafio() {
    setNumeroDeRonda(numeroDeRonda + 1);
  }

  // ---------- Render ----------

  // Si hubo un error lo mostramos y cortamos acá (return temprano).
  if (mensajeDeError !== '') {
    return (
      <main className="pagina">
        <h1>Country Trivia</h1>
        <p className="mensaje-error">Ocurrió un error: {mensajeDeError}</p>
        <button type="button" onClick={manejarClickOtroDesafio}>Reintentar</button>
      </main>
    );
  }

  // Mientras carga (o si todavía no hay país) mostramos un texto simple.
  if (estaCargando || paisCorrecto === null) {
    return (
      <main className="pagina">
        <h1>Country Trivia</h1>
        <p>Cargando...</p>
      </main>
    );
  }

  // ¿El usuario ya respondió en esta ronda?
  const yaRespondio = respuestaElegida !== null;
  // ¿Respondió bien? (solo tiene sentido si yaRespondio es true)
  const respondioBien = respuestaElegida === paisCorrecto.cca3;

  // Texto de la pregunta / resultado y su clase CSS, según el momento de
  // la ronda (antes de responder, acertó, o falló).
  let textoDeEstado = '¿Cuál es la bandera del país del mapa?';
  let claseDelTextoDeEstado = '';
  if (yaRespondio && respondioBien) {
    textoDeEstado = '¡Bien! Esa es la bandera correcta.';
    claseDelTextoDeEstado = 'bien';
  }
  if (yaRespondio && !respondioBien) {
    textoDeEstado = 'No, esa no es la bandera correcta.';
    claseDelTextoDeEstado = 'mal';
  }

  // La imagen del mapa. Antes de responder es solo una imagen; después de
  // responder la envolvemos en un Link a la página del país.
  const imagenDelMapa = (
    <img
      className="imagen-mapa"
      src={paisCorrecto.map.svg}
      alt="Mapa del país a adivinar"
    />
  );

  return (
    <main className="pagina">
      <h1>Country Trivia</h1>

      {/* Mensaje de la ronda: pregunta, o resultado bien/mal */}
      <p className={'texto-estado ' + claseDelTextoDeEstado}>{textoDeEstado}</p>

      {/* Mapa: con enlace SOLO después de responder (ternario con null) */}
      <div className="contenedor-mapa">
        {yaRespondio ? (
          <Link to={'/country/' + paisCorrecto.cca3} title="Ver la página del país">
            {imagenDelMapa}
          </Link>
        ) : (
          imagenDelMapa
        )}
      </div>

      {/* Las 4 banderas. .map convierte cada opción en un BotonBandera.
          La key es el cca3 porque es único dentro de la ronda. */}
      <div className="fila-banderas">
        {opciones.map((opcion) => {
          // Clase para pintar de verde la correcta y de rojo la elegida mal,
          // pero solo cuando ya se respondió.
          let claseDeResultado = '';
          if (yaRespondio && opcion.cca3 === paisCorrecto.cca3) {
            claseDeResultado = 'correcta';
          }
          if (yaRespondio && opcion.cca3 === respuestaElegida && !respondioBien) {
            claseDeResultado = 'incorrecta';
          }
          return (
            <BotonBandera
              key={opcion.cca3}
              cca3={opcion.cca3}
              imagenSrc={opcion.imagenSrc}
              textoAlternativo={opcion.textoAlternativo}
              estaDeshabilitado={yaRespondio}
              claseDeResultado={claseDeResultado}
              alPresionar={manejarEleccionDeBandera}
            />
          );
        })}
      </div>

      {/* Puntaje: viene del Context, sobrevive a los cambios de ruta */}
      <p className="texto-puntaje">Usted tiene {contextoPuntaje.puntaje} puntos.</p>

      {/* Botón para la siguiente ronda: solo aparece después de responder */}
      {yaRespondio ? (
        <button type="button" className="boton-principal" onClick={manejarClickOtroDesafio}>
          Otro desafío
        </button>
      ) : null}
    </main>
  );
}

export default Home;
