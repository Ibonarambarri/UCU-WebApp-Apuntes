// ==============================================
// Archivo: src/components/PaginaPais.jsx
// Qué hace: página "/:cca3", el corazón del juego. Muestra el país actual
// (nombre + bandera), 9 botones con banderas (algunos fronterizos, otros al
// azar, mezclados), el botón "Ninguno" y el estado del juego (visitados y
// errores restantes). Aplica las reglas y navega al siguiente país o a /end.
// Conceptos: useParams, useEffect con dependencia [cca3] (¡clave!),
// useContext, useNavigate, <Navigate> para redirigir, azar y mezclado.
// ==============================================
import { useContext, useEffect, useState } from 'react';
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom';
import { ContextoJuego } from '../context/ContextoJuego';
import { obtenerCodigosDePaises, obtenerPais } from '../services/api';
import { elegirAlAzar, elegirVariosDistintos, mezclarArray } from '../utils/azar';
import BotonBandera from './BotonBandera';

// Cantidad de botones con bandera que se muestran debajo del país.
const CANTIDAD_DE_OPCIONES = 9;

function PaginaPais() {
  // Parámetro de la URL: en "/URY", parametros.cca3 vale "URY".
  const parametros = useParams();
  const cca3 = parametros.cca3;

  // Estado global del juego (dificultad, errores, visitados y sus funciones).
  const contextoJuego = useContext(ContextoJuego);

  // Función para cambiar de ruta desde código.
  const navegar = useNavigate();

  // Estado: el país actual (objeto completo de la API). null = cargando.
  const [pais, setPais] = useState(null);

  // Estado: las 9 opciones ya mezcladas: { cca3, imagenSrc, textoAlternativo }.
  const [opciones, setOpciones] = useState([]);

  // Estado: todos los códigos de país. Lo necesitamos para "Ninguno"
  // (elegir un país no visitado al azar) y para los países de relleno.
  const [codigosDePaises, setCodigosDePaises] = useState([]);

  // Estado: true mientras esperamos a la API (deshabilita los botones).
  const [estaCargando, setEstaCargando] = useState(true);

  // Estado: texto de error si falla un fetch (por ejemplo cca3 inexistente).
  const [mensajeDeError, setMensajeDeError] = useState('');

  // Efecto: carga el país y arma las 9 opciones.
  // DEPENDE DE [cca3]. Esto es LA trampa del ejercicio: cuando el usuario
  // presiona una bandera navegamos de "/URY" a "/ARG". Es la MISMA ruta
  // ("/:cca3") con otro parámetro, así que React Router NO desmonta
  // PaginaPais: reutiliza el mismo componente y solo cambia lo que devuelve
  // useParams(). Si el efecto tuviera [] como dependencias se ejecutaría
  // una sola vez y la página quedaría mostrando el primer país para siempre.
  useEffect(() => {
    // Si no se eligió dificultad no tiene sentido cargar nada (abajo se
    // redirige a "/" con <Navigate>).
    if (contextoJuego.dificultad === '') {
      return;
    }

    async function cargarPaisYOpciones() {
      try {
        setEstaCargando(true);
        setMensajeDeError('');

        // 1) Pedimos el país actual y la lista completa de códigos.
        const paisRecibido = await obtenerPais(cca3);
        const codigos = await obtenerCodigosDePaises();

        // 2) Recién ahora (el país existe) lo marcamos como visitado en el
        //    estado global. Si el cca3 fuera inválido saltaría al catch antes.
        contextoJuego.agregarPaisVisitado(cca3);

        // 3) Decidimos cuántos fronterizos mostrar: un número al azar entre 0
        //    y el mínimo entre la cantidad de fronteras y 9. Así "a veces"
        //    hay fronterizos y a veces no (y "Ninguno" es la respuesta).
        const fronterizos = paisRecibido.borders;
        const maximoDeFronterizos = Math.min(fronterizos.length, CANTIDAD_DE_OPCIONES);
        const cantidadDeFronterizos = Math.floor(Math.random() * (maximoDeFronterizos + 1));

        // 4) Tomamos esa cantidad de fronterizos, elegidos al azar (mezclamos
        //    la lista de fronteras y nos quedamos con los primeros).
        const fronterizosMezclados = mezclarArray(fronterizos);
        const fronterizosElegidos = fronterizosMezclados.slice(0, cantidadDeFronterizos);

        // 5) Completamos hasta 9 con países al azar que NO sean el actual ni
        //    fronterizos (para que el relleno nunca sea correcto "de casualidad").
        const cantidadDeRelleno = CANTIDAD_DE_OPCIONES - cantidadDeFronterizos;
        const excluidos = [cca3, ...fronterizos];
        const codigosDeRelleno = elegirVariosDistintos(codigos, cantidadDeRelleno, excluidos);

        // 6) Juntamos todo y mezclamos para que los fronterizos no queden
        //    siempre primeros. Las banderas están en /flags/CCA3.svg (lo dice
        //    el enunciado), así no hace falta pedir el detalle de cada país.
        const codigosDeOpciones = mezclarArray([...fronterizosElegidos, ...codigosDeRelleno]);
        const opcionesArmadas = [];
        for (const codigoDeOpcion of codigosDeOpciones) {
          opcionesArmadas.push({
            cca3: codigoDeOpcion,
            imagenSrc: '/flags/' + codigoDeOpcion + '.svg',
            textoAlternativo: 'Bandera de ' + codigoDeOpcion,
          });
        }

        // 7) Guardamos todo en el estado (provoca el re-render).
        setPais(paisRecibido);
        setCodigosDePaises(codigos);
        setOpciones(opcionesArmadas);
      } catch (error) {
        setMensajeDeError(error.message);
      } finally {
        setEstaCargando(false);
      }
    }

    cargarPaisYOpciones();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cca3]);

  // Devuelve true si el código es un fronterizo del país actual que todavía
  // no fue visitado (la única jugada correcta según las reglas).
  function esFronterizoNoVisitado(codigo) {
    const esFronterizo = pais.borders.includes(codigo);
    const yaFueVisitado = contextoJuego.paisesVisitados.includes(codigo);
    return esFronterizo && !yaFueVisitado;
  }

  // Aplica el resultado de una jugada: si fue correcta navega al destino;
  // si fue incorrecta descuenta un error y, si era el último, va a "/end".
  function resolverJugada(fueCorrecta, rutaDestino) {
    if (fueCorrecta) {
      navegar(rutaDestino);
      return;
    }
    // descontarError devuelve cuántos quedan DESPUÉS de restar. No podemos
    // leer contextoJuego.erroresRestantes acá porque setEstado es asíncrono
    // y todavía tendría el valor viejo.
    const erroresQueQuedan = contextoJuego.descontarError();
    if (erroresQueQuedan <= 0) {
      navegar('/end');
    } else {
      navegar(rutaDestino);
    }
  }

  // Se ejecuta al presionar una de las 9 banderas. SIEMPRE se navega al
  // país elegido (sea correcto o no); solo cambia si se descuenta un error.
  function manejarEleccionDePais(cca3Elegido) {
    const fueCorrecta = esFronterizoNoVisitado(cca3Elegido);
    resolverJugada(fueCorrecta, '/' + cca3Elegido);
  }

  // Se ejecuta al presionar "Ninguno". Es correcto SOLO si ninguna de las 9
  // opciones era un fronterizo sin visitar. Luego se salta a un país no
  // visitado al azar.
  function manejarClickNinguno() {
    // ¿Había alguna opción correcta entre las 9?
    let habiaOpcionCorrecta = false;
    for (const opcion of opciones) {
      if (esFronterizoNoVisitado(opcion.cca3)) {
        habiaOpcionCorrecta = true;
      }
    }
    const fueCorrecta = !habiaOpcionCorrecta;

    // Países que todavía no se visitaron (el actual ya está en visitados).
    // .filter devuelve un array nuevo solo con los que cumplen la condición.
    const codigosNoVisitados = codigosDePaises.filter(
      (codigo) => !contextoJuego.paisesVisitados.includes(codigo) // no visitado
    );
    // Caso extremo: visitó todos los países. Terminamos el juego.
    if (codigosNoVisitados.length === 0) {
      navegar('/end');
      return;
    }
    const codigoDestino = elegirAlAzar(codigosNoVisitados);
    resolverJugada(fueCorrecta, '/' + codigoDestino);
  }

  // ---------- Render ----------

  // Sin dificultad elegida (por ejemplo, el usuario recargó la página y el
  // Context volvió a su valor inicial): redirigimos al inicio. <Navigate>
  // es la forma de redirigir DESDE el JSX; useNavigate() es desde código.
  if (contextoJuego.dificultad === '') {
    return <Navigate to="/" replace />;
  }

  // Error (por ejemplo, un código de país inválido en la URL).
  if (mensajeDeError !== '') {
    return (
      <main className="pagina">
        <h1>Flag Trivia</h1>
        <p className="mensaje-error">Ocurrió un error: {mensajeDeError}</p>
        <Link to="/">Volver al inicio</Link>
      </main>
    );
  }

  // Cargando el primer país (todavía no hay nada para mostrar).
  if (pais === null) {
    return (
      <main className="pagina">
        <h1>Flag Trivia</h1>
        <p>Cargando...</p>
      </main>
    );
  }

  return (
    <main className="pagina">
      {/* Título con nombre y bandera del país actual */}
      <h1 className="titulo-pais">
        <img className="bandera-titulo" src={pais.flag.svg} alt={pais.flag.alt} />
        {pais.name.common}
      </h1>
      <p>¿Cuál de los siguientes países es fronterizo (y todavía no visitado)?</p>

      {/* Las 9 banderas. Se deshabilitan mientras carga el siguiente país. */}
      <div className="grilla-banderas">
        {opciones.map((opcion) => (
          <BotonBandera
            key={opcion.cca3}
            cca3={opcion.cca3}
            imagenSrc={opcion.imagenSrc}
            textoAlternativo={opcion.textoAlternativo}
            estaDeshabilitado={estaCargando}
            alPresionar={manejarEleccionDePais}
          />
        ))}
      </div>

      {/* Botón "Ninguno" */}
      <button
        type="button"
        className="boton-principal"
        onClick={manejarClickNinguno}
        disabled={estaCargando}
      >
        Ninguno
      </button>

      {/* Estado del juego: viene del Context */}
      <p className="texto-estado">
        Países visitados: {contextoJuego.paisesVisitados.length}
        {' '}({contextoJuego.paisesVisitados.join(', ')}).
      </p>
      <p className="texto-estado">
        Usted puede errarle {contextoJuego.erroresRestantes} veces.
      </p>
    </main>
  );
}

export default PaginaPais;
