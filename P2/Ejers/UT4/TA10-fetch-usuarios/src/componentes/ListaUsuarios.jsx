// ==============================================
// Archivo: src/componentes/ListaUsuarios.jsx
// Qué hace: al montarse, llama UNA sola vez a la API de usuarios y muestra
// el nombre y el mail de cada uno. Mientras carga muestra "Cargando..." y
// si algo falla muestra un mensaje de error.
// Conceptos: useState, useEffect con [] (solo al montar), fetch con
// async/await + try/catch, renderizado condicional, listas con .map.
// ==============================================
import { useState, useEffect } from 'react';
import TarjetaUsuario from './TarjetaUsuario.jsx';

function ListaUsuarios() {
  // Estado 1: la lista de usuarios que devuelve la API. Empieza vacía.
  const [usuarios, setUsuarios] = useState([]);

  // Estado 2: true mientras esperamos la respuesta de la API.
  // Empieza en true porque apenas se monta el componente ya estamos cargando.
  const [estaCargando, setEstaCargando] = useState(true);

  // Estado 3: texto del error si la llamada falla. Empieza vacío (sin error).
  const [mensajeError, setMensajeError] = useState('');

  // useEffect: se ejecuta DESPUÉS del primer render.
  // Dependencias []: array vacío = "no dependas de nada" = se ejecuta solo
  // una vez, cuando el componente se monta. Si lo omitiéramos, se ejecutaría
  // después de CADA render y haríamos la llamada infinitas veces (porque
  // cada setUsuarios provoca un render, que dispara el efecto, que hace
  // setUsuarios... y así).
  useEffect(function () {
    // IMPORTANTE: el callback del useEffect NO puede ser async.
    // useEffect espera que devolvamos "nada" o una función de limpieza,
    // pero una función async siempre devuelve una Promesa, y React no sabe
    // qué hacer con ella. Por eso definimos una función async ADENTRO
    // y la llamamos en la línea siguiente.
    async function cargarUsuarios() {
      try {
        // Hacemos la petición HTTP GET a la API.
        const respuesta = await fetch('https://jsonplaceholder.typicode.com/users');

        // fetch NO lanza error con códigos 404 o 500: solo falla si no hay
        // red. Por eso hay que comprobar respuesta.ok a mano.
        if (!respuesta.ok) {
          throw new Error('La API respondió con el código ' + respuesta.status);
        }

        // Convertimos el cuerpo de la respuesta (texto JSON) en un array de objetos.
        const datos = await respuesta.json();

        // Guardamos los usuarios en el estado -> React vuelve a renderizar.
        setUsuarios(datos);
      } catch (error) {
        // Cae acá si no hay red, si el JSON está mal o si lanzamos el Error de arriba.
        setMensajeError('No se pudieron cargar los usuarios: ' + error.message);
      } finally {
        // Pase lo que pase (éxito o error) dejamos de "cargar".
        setEstaCargando(false);
      }
    }

    // Llamamos a la función async que acabamos de definir.
    cargarUsuarios();
  }, []);

  // Render condicional 1: mientras carga, mostramos solo el aviso.
  if (estaCargando) {
    return <p className="aviso">Cargando usuarios...</p>;
  }

  // Render condicional 2: si hubo error, lo mostramos y no seguimos.
  if (mensajeError !== '') {
    return <p className="error">{mensajeError}</p>;
  }

  // Render normal: recorremos el array con .map y devolvemos una tarjeta
  // por cada usuario. key es obligatoria para que React identifique cada
  // elemento de la lista; usamos el id que ya viene de la API.
  return (
    <ul className="lista-usuarios">
      {usuarios.map(function (usuario) {
        // Por cada usuario del array devolvemos un <li> con su tarjeta
        return (
          <li key={usuario.id}>
            <TarjetaUsuario nombre={usuario.name} mail={usuario.email} />
          </li>
        );
      })}
    </ul>
  );
}

export default ListaUsuarios;
