// ==============================================
// Archivo: src/components/PaginaPais.jsx
// Qué hace: página de detalle de un país (ruta "/country/:cca3"). Lee el
//   código de la URL, pide el país a la API y muestra nombres, capital,
//   monedas, lenguajes y zonas horarias. Tiene un botón para volver a "/".
// Conceptos: useParams, useNavigate, useEffect con dependencia [cca3],
//   recorrer OBJETOS con Object.keys (currencies, languages, nativeName).
// ==============================================
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { obtenerPais } from '../services/api';

function PaginaPais() {
  // useParams devuelve un objeto con los parámetros de la ruta.
  // Como la ruta es "/country/:cca3", tenemos parametros.cca3.
  const parametros = useParams();
  const cca3 = parametros.cca3;

  // useNavigate devuelve una función para cambiar de ruta desde código
  // (por ejemplo al hacer click en un botón).
  const navegar = useNavigate();

  // Estado: el objeto país completo. null mientras no llegó.
  const [pais, setPais] = useState(null);
  // Estado: mensaje de error si la API falla (ej: código inexistente → 404).
  const [mensajeDeError, setMensajeDeError] = useState('');

  // Efecto: pedir el país cuando aparece la página.
  // Dependencia [cca3]: si la URL cambia a otro país, volvemos a pedir.
  useEffect(() => {
    async function cargarPais() {
      try {
        const datosDelPais = await obtenerPais(cca3);
        setPais(datosDelPais);
      } catch (error) {
        console.error('Error cargando el país ' + cca3, error);
        setMensajeDeError('No se encontró el país ' + cca3);
      }
    }
    cargarPais();
  }, [cca3]);

  // Handler del botón "Back to list": vuelve al inicio.
  function manejarClickVolver() {
    navegar('/');
  }

  // ---- Returns tempranos: error o cargando ----
  if (mensajeDeError !== '') {
    return (
      <div className="pagina">
        <p className="mensaje-error">{mensajeDeError}</p>
        <button onClick={manejarClickVolver}>Back to list</button>
      </div>
    );
  }

  if (pais === null) {
    return (
      <div className="pagina">
        <p>Cargando país...</p>
      </div>
    );
  }

  // ---- A partir de acá sabemos que pais tiene datos ----

  // Nombres nativos: name.nativeName es un OBJETO cuya clave es el código de
  // idioma y el valor es { official, common }. Ejemplo:
  //   { "spa": { "official": "República Oriental del Uruguay", "common": "Uruguay" } }
  // Para recorrerlo usamos Object.keys, que nos da ["spa"], y con un for
  // armamos un array de strings con el nombre oficial en cada idioma.
  const nombresNativos = [];
  const codigosDeIdiomaNativo = Object.keys(pais.name.nativeName);
  for (const codigoDeIdioma of codigosDeIdiomaNativo) {
    const nombreNativo = pais.name.nativeName[codigoDeIdioma];
    nombresNativos.push(nombreNativo.official);
  }

  // Monedas: currencies también es un OBJETO { "UYU": { name, symbol } }.
  // Armamos textos tipo "Uruguayan peso ($)".
  const textosDeMonedas = [];
  const codigosDeMonedas = Object.keys(pais.currencies);
  for (const codigoDeMoneda of codigosDeMonedas) {
    const moneda = pais.currencies[codigoDeMoneda];
    textosDeMonedas.push(moneda.name + ' (' + moneda.symbol + ')');
  }

  // Lenguajes: languages es un OBJETO { "spa": "Spanish" }.
  // Aquí el valor es directamente el nombre (un string).
  const textosDeLenguajes = [];
  const codigosDeLenguajes = Object.keys(pais.languages);
  for (const codigoDeLenguaje of codigosDeLenguajes) {
    textosDeLenguajes.push(pais.languages[codigoDeLenguaje]);
  }

  // capital y timezones SÍ son arrays de strings, se pueden unir directo
  // con join. Pero hay países con capital [] o sin monedas, así que usamos
  // esta función auxiliar: une con comas o devuelve "-" si está vacío.
  function unirOGuion(lista) {
    if (lista.length === 0) {
      return '-';
    }
    return lista.join(', ');
  }

  return (
    <div className="pagina">
      <h1>{pais.name.common}</h1>

      <div className="detalle-pais">
        {/* Bandera grande. Usamos la url que trae el objeto (pais.flag.svg). */}
        <img className="bandera-grande" src={pais.flag.svg} alt={'Bandera de ' + pais.name.common} />

        <div className="datos-pais">
          {/* Nombre oficial en inglés y nombres en los idiomas oficiales */}
          <p><strong>Official name:</strong> {pais.name.official}</p>
          <p><strong>Native name:</strong> {unirOGuion(nombresNativos)}</p>
          <p><strong>Capital:</strong> {unirOGuion(pais.capital)}</p>
          <p><strong>Currencies:</strong> {unirOGuion(textosDeMonedas)}</p>
          <p><strong>Languages:</strong> {unirOGuion(textosDeLenguajes)}</p>
          <p><strong>Time zones:</strong> {unirOGuion(pais.timezones)}</p>
        </div>
      </div>

      {/* Botón para volver al inicio usando useNavigate */}
      <button className="boton-volver" onClick={manejarClickVolver}>Back to list</button>
    </div>
  );
}

export default PaginaPais;
