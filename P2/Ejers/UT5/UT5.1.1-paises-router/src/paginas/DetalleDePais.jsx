// ==============================================
// Archivo: src/paginas/DetalleDePais.jsx
// Qué hace: página de la ruta /countries/:cca2. Lee el código del país de
// la URL, pide su detalle a la API y muestra bandera, nombre, capital,
// población, idiomas, monedas, zonas horarias y países limítrofes.
// Conceptos: useParams, useNavigate, useEffect con dependencia [cca2],
// fetch con async/await + try/catch, manejo de 404, map sobre sub-arrays.
// ==============================================
import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { obtenerPaisPorCodigo } from '../servicios/api.js';

function DetalleDePais() {
  // useParams devuelve un objeto con los parámetros de la ruta.
  // Como en App.jsx la ruta es "/countries/:cca2", la clave se llama cca2.
  // Si la URL es /countries/UY entonces parametros.cca2 === "UY".
  const parametros = useParams();
  const cca2 = parametros.cca2;

  // useNavigate devuelve una función para cambiar de ruta desde código
  // (por ejemplo al apretar un botón), a diferencia de Link que es un enlace.
  const navegar = useNavigate();

  // Estado: el objeto país que devolvió la API. null hasta que llegue.
  const [pais, setPais] = useState(null);

  // Estado: true mientras esperamos la API.
  const [estaCargando, setEstaCargando] = useState(true);

  // Estado: mensaje de error ('' = sin error).
  const [mensajeError, setMensajeError] = useState('');

  // Efecto que pide el país a la API.
  // Dependencias [cca2]: se ejecuta al montar Y cada vez que cambia cca2.
  // ¿Por qué no []? Porque si el usuario va de /countries/UY a /countries/AR
  // react-router REUTILIZA este mismo componente (no lo desmonta), así que
  // con [] el efecto no se volvería a ejecutar y quedaría mostrando Uruguay.
  useEffect(function () {
    async function cargarPais() {
      // Reiniciamos los estados por si venimos de otro país.
      setEstaCargando(true);
      setMensajeError('');

      try {
        const paisDeLaApi = await obtenerPaisPorCodigo(cca2);
        setPais(paisDeLaApi);
      } catch (error) {
        // Acá cae tanto el 404 ("País no encontrado") como errores de red.
        setMensajeError(error.message);
      } finally {
        setEstaCargando(false);
      }
    }

    cargarPais();
  }, [cca2]);

  // Al apretar "Volver": navegar(-1) es como el botón "atrás" del navegador.
  function manejarClickVolver() {
    navegar(-1);
  }

  // Return temprano mientras carga.
  if (estaCargando) {
    return <p>Cargando país...</p>;
  }

  // Return temprano si hubo error (incluye el caso 404).
  if (mensajeError !== '') {
    return (
      <div>
        <p className="mensaje-error">{mensajeError}</p>
        <Link to="/countries">Ir a la lista de países</Link>
      </div>
    );
  }

  // Por seguridad: si no cargó ni hubo error, no mostramos nada.
  if (pais === null) {
    return null;
  }

  // Algunos países no tienen fronteras (islas) y la API puede no mandar el
  // campo. Armamos un texto con if explícito en vez de usar ?. o &&.
  let textoDeFronteras = 'No tiene países limítrofes';
  if (pais.borders !== undefined && pais.borders.length > 0) {
    // join une los códigos del array con ", " -> "ARG, BRA"
    textoDeFronteras = pais.borders.join(', ');
  }

  // Lo mismo para capital (algunos territorios no tienen).
  let textoDeCapital = 'Sin capital';
  if (pais.capital !== undefined && pais.capital !== '') {
    textoDeCapital = pais.capital;
  }

  // Idiomas, monedas y zonas horarias: si faltan, usamos array vacío
  // para que el map de abajo no explote.
  let idiomas = [];
  if (pais.languages !== undefined) {
    idiomas = pais.languages;
  }

  let monedas = [];
  if (pais.currencies !== undefined) {
    monedas = pais.currencies;
  }

  let zonasHorarias = [];
  if (pais.timezones !== undefined) {
    zonasHorarias = pais.timezones;
  }

  return (
    <div className="detalle">
      {/* Dos formas de volver: botón (useNavigate) y enlace (Link) */}
      <button className="boton" onClick={manejarClickVolver}>
        Volver
      </button>
      <Link to="/countries">Ir a la lista de países</Link>

      <h1>
        {pais.flag} {pais.name}
      </h1>

      <img
        className="bandera-grande"
        src={pais.flags.png}
        alt={'Bandera de ' + pais.name}
      />

      <ul>
        <li>
          <strong>Nombre nativo:</strong> {pais.nativeName}
        </li>
        <li>
          <strong>Código:</strong> {pais.alpha2Code} / {pais.alpha3Code}
        </li>
        <li>
          <strong>Capital:</strong> {textoDeCapital}
        </li>
        <li>
          <strong>Región:</strong> {pais.region}
        </li>
        <li>
          <strong>Subregión:</strong> {pais.subregion}
        </li>
        <li>
          {/* toLocaleString pone separadores de miles: 3.473.727 */}
          <strong>Población:</strong> {pais.population.toLocaleString('es-UY')}
        </li>
        <li>
          <strong>Países limítrofes:</strong> {textoDeFronteras}
        </li>
      </ul>

      <h2>Idiomas</h2>
      <ul>
        {/* map: cada idioma es un objeto { name, nativeName, iso639_1 } */}
        {idiomas.map((idioma) => (
          <li key={idioma.name}>
            {idioma.name} ({idioma.nativeName})
          </li>
        ))}
      </ul>

      <h2>Monedas</h2>
      <ul>
        {/* map: cada moneda es un objeto { code, name, symbol } */}
        {monedas.map((moneda) => (
          <li key={moneda.code}>
            {moneda.name} ({moneda.symbol})
          </li>
        ))}
      </ul>

      <h2>Zonas horarias</h2>
      <ul>
        {/* map: cada zona es un string tipo "UTC-03:00", sirve como key */}
        {zonasHorarias.map((zona) => (
          <li key={zona}>{zona}</li>
        ))}
      </ul>
    </div>
  );
}

export default DetalleDePais;
