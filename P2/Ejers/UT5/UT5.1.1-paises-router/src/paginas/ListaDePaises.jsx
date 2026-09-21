// ==============================================
// Archivo: src/paginas/ListaDePaises.jsx
// Qué hace: página de la ruta /countries. Al montarse pide a la API la lista
// de países, la ordena alfabéticamente y la muestra en una grilla de
// tarjetas. Tiene un cuadro de búsqueda para filtrar por nombre.
// Conceptos: useState, useEffect con [] (solo al montar), fetch con
// async/await + try/catch, estados de carga/error, filter, map.
// ==============================================
import { useState, useEffect } from 'react';
import { obtenerListaDePaises } from '../servicios/api.js';
import TarjetaDePais from '../componentes/TarjetaDePais.jsx';

function ListaDePaises() {
  // Estado: array con todos los países que devolvió la API. Empieza vacío.
  const [paises, setPaises] = useState([]);

  // Estado: true mientras esperamos la respuesta de la API.
  // Empieza en true porque apenas se monta ya estamos cargando.
  const [estaCargando, setEstaCargando] = useState(true);

  // Estado: texto del error si algo falló. Vacío significa "sin error".
  const [mensajeError, setMensajeError] = useState('');

  // Estado: lo que el usuario escribió en el buscador.
  const [textoDeBusqueda, setTextoDeBusqueda] = useState('');

  // Efecto que pide los países a la API.
  // Dependencias []: se ejecuta UNA sola vez, cuando el componente se monta.
  // No se puede poner async directamente en useEffect, por eso definimos
  // una función async adentro y la llamamos.
  useEffect(function () {
    async function cargarPaises() {
      try {
        const listaDeLaApi = await obtenerListaDePaises();

        // Ordenamos alfabéticamente por nombre. sort recibe una función que
        // compara dos países: localeCompare devuelve negativo si "a" va antes
        // que "b", positivo si va después y 0 si son iguales.
        listaDeLaApi.sort(function (paisA, paisB) {
          return paisA.name.localeCompare(paisB.name);
        });

        setPaises(listaDeLaApi);
      } catch (error) {
        // Si el fetch falló (sin internet, error 500, etc.) guardamos el mensaje.
        setMensajeError(error.message);
      } finally {
        // Pase lo que pase, ya terminamos de cargar.
        setEstaCargando(false);
      }
    }

    cargarPaises();
  }, []);

  // Se ejecuta cada vez que el usuario escribe en el buscador.
  function manejarCambioDeBusqueda(evento) {
    setTextoDeBusqueda(evento.target.value);
  }

  // Filtramos la lista según el texto buscado (sin distinguir mayúsculas).
  // filter devuelve un array nuevo solo con los países cuyo nombre
  // contiene el texto. Si el texto está vacío, includes('') es true y
  // quedan todos.
  const textoEnMinusculas = textoDeBusqueda.toLowerCase();
  const paisesFiltrados = paises.filter(function (pais) {
    return pais.name.toLowerCase().includes(textoEnMinusculas);
  });

  // Return temprano: mientras carga mostramos solo un mensaje.
  if (estaCargando) {
    return <p>Cargando países...</p>;
  }

  // Return temprano: si hubo error lo mostramos y no seguimos.
  if (mensajeError !== '') {
    return <p className="mensaje-error">Error: {mensajeError}</p>;
  }

  return (
    <div>
      <h1>Países ({paisesFiltrados.length})</h1>

      {/* Input controlado: su valor viene del estado y cada tecla lo actualiza */}
      <input
        className="buscador"
        type="text"
        placeholder="Buscar país por nombre..."
        value={textoDeBusqueda}
        onChange={manejarCambioDeBusqueda}
      />

      {/* Si el filtro no dejó ningún país, avisamos (ternario con null) */}
      {paisesFiltrados.length === 0 ? <p>No hay países que coincidan.</p> : null}

      {/*
        map transforma cada objeto país en una TarjetaDePais.
        key tiene que ser única y estable: usamos el código alpha2.
      */}
      <ul className="grilla-de-paises">
        {paisesFiltrados.map((pais) => (
          // Arrow function inline: es la única forma cómoda de usar map en JSX.
          <TarjetaDePais key={pais.alpha2Code} pais={pais} />
        ))}
      </ul>
    </div>
  );
}

export default ListaDePaises;
