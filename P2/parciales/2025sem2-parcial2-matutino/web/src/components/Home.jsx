// ==============================================
// Archivo: src/components/Home.jsx
// Qué hace: página de inicio (ruta "/"). Muestra tres <select> (moneda,
//   lenguaje, zona horaria) y debajo la lista de países filtrada.
// Conceptos: varios useState, useEffect que se ejecuta una vez (cargar las
//   opciones de los selects) y otro que se ejecuta cada vez que cambia un
//   filtro (volver a pedir la lista), select controlado, .map para listas.
// ==============================================
import { useState, useEffect } from 'react';
import {
  obtenerMonedas,
  obtenerLenguajes,
  obtenerZonasHorarias,
  obtenerPaises,
} from '../services/api';
import ItemPais from './ItemPais';

function Home() {
  // ---- Estado de las OPCIONES de los selects (vienen de la API) ----
  // Lista de monedas: [{ code, name, symbol }]
  const [listaDeMonedas, setListaDeMonedas] = useState([]);
  // Lista de lenguajes: [{ code, name }]
  const [listaDeLenguajes, setListaDeLenguajes] = useState([]);
  // Lista de zonas horarias: ["UTC-03:00", ...]
  const [listaDeZonasHorarias, setListaDeZonasHorarias] = useState([]);

  // ---- Estado de los FILTROS elegidos por el usuario ----
  // String vacío "" significa "Todas" (sin filtro).
  const [monedaElegida, setMonedaElegida] = useState('');
  const [lenguajeElegido, setLenguajeElegido] = useState('');
  const [zonaHorariaElegida, setZonaHorariaElegida] = useState('');

  // ---- Estado del RESULTADO ----
  // Lista de códigos cca3 que devolvió la API: ["ARG", "BRA", ...]
  const [codigosDePaises, setCodigosDePaises] = useState([]);
  // Para mostrar "Cargando..." mientras esperamos la API.
  const [estaCargando, setEstaCargando] = useState(true);
  // Para mostrar un mensaje si algo falla.
  const [mensajeDeError, setMensajeDeError] = useState('');

  // Efecto 1: cargar las opciones de los tres selects.
  // Dependencias []: se ejecuta UNA sola vez, cuando el componente aparece,
  // porque las opciones no cambian nunca.
  useEffect(() => {
    async function cargarOpciones() {
      try {
        const monedas = await obtenerMonedas();
        const lenguajes = await obtenerLenguajes();
        const zonasHorarias = await obtenerZonasHorarias();
        setListaDeMonedas(monedas);
        setListaDeLenguajes(lenguajes);
        setListaDeZonasHorarias(zonasHorarias);
      } catch (error) {
        console.error('Error cargando las opciones de los filtros', error);
        setMensajeDeError('No se pudieron cargar los filtros.');
      }
    }
    cargarOpciones();
  }, []);

  // Efecto 2: pedir la lista de países.
  // Dependencias [monedaElegida, lenguajeElegido, zonaHorariaElegida]:
  // se ejecuta al inicio Y cada vez que el usuario cambia cualquiera de los
  // tres filtros. Así la lista siempre refleja los filtros actuales.
  useEffect(() => {
    async function cargarPaises() {
      setEstaCargando(true);
      try {
        const codigos = await obtenerPaises(monedaElegida, lenguajeElegido, zonaHorariaElegida);
        setCodigosDePaises(codigos);
        setMensajeDeError('');
      } catch (error) {
        console.error('Error cargando la lista de países', error);
        setMensajeDeError('No se pudo cargar la lista de países.');
      }
      setEstaCargando(false);
    }
    cargarPaises();
  }, [monedaElegida, lenguajeElegido, zonaHorariaElegida]);

  // ---- Handlers de los selects (select controlado) ----
  // evento.target.value es el "value" de la <option> que eligió el usuario.
  function manejarCambioDeMoneda(evento) {
    setMonedaElegida(evento.target.value);
  }

  function manejarCambioDeLenguaje(evento) {
    setLenguajeElegido(evento.target.value);
  }

  function manejarCambioDeZonaHoraria(evento) {
    setZonaHorariaElegida(evento.target.value);
  }

  // ---- Decidimos qué mostrar en la zona de la lista ----
  // Usamos una variable con if en lugar de && dentro del JSX.
  let contenidoDeLaLista;
  if (mensajeDeError !== '') {
    contenidoDeLaLista = <p className="mensaje-error">{mensajeDeError}</p>;
  } else if (estaCargando) {
    contenidoDeLaLista = <p>Cargando países...</p>;
  } else if (codigosDePaises.length === 0) {
    contenidoDeLaLista = <p>No hay países que cumplan con los filtros.</p>;
  } else {
    contenidoDeLaLista = (
      <ul className="lista-paises">
        {/* .map: por cada código creamos un ItemPais. key obligatoria en listas. */}
        {codigosDePaises.map((cca3) => (
          <ItemPais key={cca3} cca3={cca3} />
        ))}
      </ul>
    );
  }

  return (
    <div className="pagina">
      <h1>Countries</h1>

      {/* Encabezado con los tres filtros */}
      <div className="filtros">
        {/* Select controlado: value = estado, onChange = actualiza el estado */}
        <select value={monedaElegida} onChange={manejarCambioDeMoneda}>
          <option value="">Currency (todas)</option>
          {/* .map: una <option> por moneda; value es el código (EUR) */}
          {listaDeMonedas.map((moneda) => (
            <option key={moneda.code} value={moneda.code}>
              {moneda.code} - {moneda.name}
            </option>
          ))}
        </select>

        <select value={lenguajeElegido} onChange={manejarCambioDeLenguaje}>
          <option value="">Language (todos)</option>
          {/* .map: una <option> por lenguaje; value es el código (fra) */}
          {listaDeLenguajes.map((lenguaje) => (
            <option key={lenguaje.code} value={lenguaje.code}>
              {lenguaje.code} - {lenguaje.name}
            </option>
          ))}
        </select>

        <select value={zonaHorariaElegida} onChange={manejarCambioDeZonaHoraria}>
          <option value="">Time zone (todas)</option>
          {/* .map: las zonas horarias son strings simples, así que el string
              sirve tanto de key como de value y de texto */}
          {listaDeZonasHorarias.map((zonaHoraria) => (
            <option key={zonaHoraria} value={zonaHoraria}>
              {zonaHoraria}
            </option>
          ))}
        </select>
      </div>

      {/* Lista (o mensaje de carga/error) */}
      {contenidoDeLaLista}
    </div>
  );
}

export default Home;
