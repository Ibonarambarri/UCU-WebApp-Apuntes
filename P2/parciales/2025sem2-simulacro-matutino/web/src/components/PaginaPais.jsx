// ==============================================
// Archivo: src/components/PaginaPais.jsx
// Qué hace: página de detalle de un país (/country/:cca3). Muestra el nombre
// común como título, bandera y mapa en una línea, los nombres oficiales
// (inglés + idiomas oficiales), capital, monedas y zonas horarias, y un
// enlace para volver al inicio.
// Conceptos: useParams, useEffect con dependencia [cca3], recorrer OBJETOS
// con Object.keys (currencies, nativeName, languages), Link.
// ==============================================
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { obtenerPais } from '../services/api';

function PaginaPais() {
  // useParams devuelve un objeto con los parámetros de la ruta. Como la ruta
  // es "/country/:cca3", acá tenemos parametros.cca3.
  const parametros = useParams();
  const cca3 = parametros.cca3;

  // Estado: el país que muestra la página (null hasta que llega de la API).
  const [pais, setPais] = useState(null);

  // Estado: texto de error si falla el fetch (por ejemplo, un cca3 inválido).
  const [mensajeDeError, setMensajeDeError] = useState('');

  // Efecto: pide el país a la API. Depende de [cca3] para que, si cambia el
  // parámetro de la URL (por ejemplo navegando de /country/URY a
  // /country/ARG), se vuelva a pedir el país nuevo.
  useEffect(() => {
    async function cargarPais() {
      try {
        setMensajeDeError('');
        const paisRecibido = await obtenerPais(cca3);
        setPais(paisRecibido);
      } catch (error) {
        setMensajeDeError(error.message);
      }
    }
    cargarPais();
  }, [cca3]);

  // ---------- Render ----------

  // Error: lo mostramos con el enlace para volver.
  if (mensajeDeError !== '') {
    return (
      <main className="pagina">
        <h1>Country Trivia</h1>
        <p className="mensaje-error">Ocurrió un error: {mensajeDeError}</p>
        <Link to="/">Volver al inicio</Link>
      </main>
    );
  }

  // Todavía no llegó el país.
  if (pais === null) {
    return (
      <main className="pagina">
        <h1>Country Trivia</h1>
        <p>Cargando...</p>
      </main>
    );
  }

  // ---- Nombres oficiales ----
  // name.nativeName es un OBJETO cuyas claves son códigos de idioma
  // ("spa", "eng", ...) y cuyos valores son { official, common }.
  // pais.languages también es un objeto: clave = código de idioma,
  // valor = nombre del idioma en inglés ("Spanish").
  // Object.keys nos da las claves como array para poder recorrerlas.
  const codigosDeIdioma = Object.keys(pais.name.nativeName);
  const nombresOficialesNativos = [];
  for (const codigoDeIdioma of codigosDeIdioma) {
    // Nombre del idioma si está en languages; si no, el código.
    let nombreDelIdioma = codigoDeIdioma;
    if (pais.languages && pais.languages[codigoDeIdioma]) {
      nombreDelIdioma = pais.languages[codigoDeIdioma];
    }
    nombresOficialesNativos.push({
      codigoDeIdioma: codigoDeIdioma,
      nombreDelIdioma: nombreDelIdioma,
      nombreOficial: pais.name.nativeName[codigoDeIdioma].official,
    });
  }

  // ---- Capital ----
  // capital es un ARRAY (algunos países tienen más de una, otros ninguna).
  let textoCapital = 'No tiene capital';
  if (pais.capital && pais.capital.length > 0) {
    textoCapital = pais.capital.join(', ');
  }

  // ---- Monedas ----
  // currencies es un OBJETO: clave = código ("UYU"), valor = { name, symbol }.
  const codigosDeMoneda = Object.keys(pais.currencies);
  const textosDeMonedas = [];
  for (const codigoDeMoneda of codigosDeMoneda) {
    const moneda = pais.currencies[codigoDeMoneda];
    textosDeMonedas.push(moneda.name + ' (' + moneda.symbol + ')');
  }
  let textoMonedas = 'No tiene moneda';
  if (textosDeMonedas.length > 0) {
    textoMonedas = textosDeMonedas.join(', ');
  }

  // ---- Zonas horarias ----
  // timezones es un ARRAY de strings, por ejemplo ["UTC-03:00"].
  const textoZonasHorarias = pais.timezones.join(', ');

  // ¿Tiene mapa? Algunos países del mock no lo tienen.
  const tieneMapa = pais.map && pais.map.svg;

  return (
    <main className="pagina">
      {/* Título: nombre común */}
      <h1>{pais.name.common}</h1>

      {/* Bandera y mapa en la misma línea (flex en CSS) */}
      <div className="fila-imagenes">
        <img className="imagen-bandera-grande" src={pais.flag.svg} alt={pais.flag.alt} />
        {tieneMapa ? (
          <img className="imagen-mapa" src={pais.map.svg} alt={'Mapa de ' + pais.name.common} />
        ) : (
          <p>Este país no tiene mapa disponible.</p>
        )}
      </div>

      {/* Datos del país */}
      <section className="datos-pais">
        <h2>Nombres oficiales</h2>
        <ul>
          {/* Primero el oficial en inglés (name.official) */}
          <li>Inglés: {pais.name.official}</li>
          {/* Después uno por cada idioma oficial. key = código de idioma. */}
          {nombresOficialesNativos.map((nombre) => (
            <li key={nombre.codigoDeIdioma}>
              {nombre.nombreDelIdioma}: {nombre.nombreOficial}
            </li>
          ))}
        </ul>

        <p><strong>Capital:</strong> {textoCapital}</p>
        <p><strong>Monedas:</strong> {textoMonedas}</p>
        <p><strong>Zonas horarias:</strong> {textoZonasHorarias}</p>
      </section>

      {/* Enlace al inicio. Usamos Link (no <a>) para que no recargue la
          página: así el Context con el puntaje sigue vivo. */}
      <Link className="enlace-volver" to="/">Volver al inicio</Link>
    </main>
  );
}

export default PaginaPais;
