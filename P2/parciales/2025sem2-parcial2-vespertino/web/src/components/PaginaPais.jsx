// ==============================================
// Archivo: src/components/PaginaPais.jsx
// Qué hace: ruta 3 "/countries/:cca3". Lee el código de la URL, pide el país
//   a la API y muestra nombres (inglés y nativo), capital, monedas, lenguajes
//   y zonas horarias. Al final un botón para volver al inicio.
// Conceptos: useParams, useNavigate, useEffect con dependencia [cca3],
//   recorrer OBJETOS con Object.keys (currencies, languages, nativeName).
// ==============================================
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { obtenerPais } from '../services/api';

function PaginaPais() {
  // parametros.cca3 viene de ":cca3" en la ruta.
  const parametros = useParams();
  const cca3 = parametros.cca3;

  // Función para cambiar de ruta desde código (el botón de volver).
  const navegar = useNavigate();

  // Estado: objeto país completo. null mientras no llegó.
  const [pais, setPais] = useState(null);
  // Estado: mensaje si la API falla (ej: código inexistente → 404).
  const [mensajeDeError, setMensajeDeError] = useState('');

  // Efecto: pedir el país. Dependencia [cca3]: si cambia la URL, repedimos.
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

  // Handler del botón: vuelve al inicio.
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

  // ---- A partir de acá pais tiene datos ----

  // name.nativeName es un OBJETO: clave = código de idioma, valor = { official, common }.
  // Con Object.keys obtenemos los códigos y con for...of juntamos los nombres oficiales.
  const nombresNativos = [];
  for (const codigoDeIdioma of Object.keys(pais.name.nativeName)) {
    const nombreNativo = pais.name.nativeName[codigoDeIdioma];
    nombresNativos.push(nombreNativo.official);
  }

  // currencies es un OBJETO: { "EUR": { name: "Euro", symbol: "€" } }.
  const textosDeMonedas = [];
  for (const codigoDeMoneda of Object.keys(pais.currencies)) {
    const moneda = pais.currencies[codigoDeMoneda];
    textosDeMonedas.push(moneda.name + ' (' + moneda.symbol + ')');
  }

  // languages es un OBJETO: { "fra": "French" }. El valor ya es el nombre.
  const textosDeLenguajes = [];
  for (const codigoDeLenguaje of Object.keys(pais.languages)) {
    textosDeLenguajes.push(pais.languages[codigoDeLenguaje]);
  }

  // capital y timezones SÍ son arrays. Hay países con arrays/objetos vacíos
  // (ej: Antártida), por eso esta auxiliar devuelve "-" si no hay nada.
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
        {/* Bandera grande: el objeto trae la url en pais.flag.svg */}
        <img className="bandera-grande" src={pais.flag.svg} alt={'Bandera de ' + pais.name.common} />

        <div className="datos-pais">
          <p><strong>Official name:</strong> {pais.name.official}</p>
          <p><strong>Native name:</strong> {unirOGuion(nombresNativos)}</p>
          <p><strong>Capital:</strong> {unirOGuion(pais.capital)}</p>
          <p><strong>Currencies:</strong> {unirOGuion(textosDeMonedas)}</p>
          <p><strong>Languages:</strong> {unirOGuion(textosDeLenguajes)}</p>
          <p><strong>Time zones:</strong> {unirOGuion(pais.timezones)}</p>
        </div>
      </div>

      {/* Botón para volver al inicio con useNavigate */}
      <button className="boton-volver" onClick={manejarClickVolver}>Back to list</button>
    </div>
  );
}

export default PaginaPais;
