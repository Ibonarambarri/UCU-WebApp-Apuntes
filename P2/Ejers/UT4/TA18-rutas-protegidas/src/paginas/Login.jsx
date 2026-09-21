// ==============================================
// Archivo: src/paginas/Login.jsx
// Qué hace: página pública con un formulario mínimo. Al enviarlo llama a
// iniciarSesion del contexto y redirige al perfil.
// Conceptos: input controlado, onSubmit + preventDefault, useContext, useNavigate.
// ==============================================
import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import ContextoAutenticacion from '../contextos/ContextoAutenticacion.jsx';

function Login() {
  // Estado local: lo que escribe el usuario en el input.
  const [nombreEscrito, setNombreEscrito] = useState('');

  const contexto = useContext(ContextoAutenticacion);
  const navegar = useNavigate();

  // Actualiza el estado con cada tecla.
  function manejarCambioNombre(evento) {
    setNombreEscrito(evento.target.value);
  }

  // Se ejecuta al enviar el formulario (Enter o click en el botón).
  function manejarEnvio(evento) {
    // Evita que el navegador recargue la página (comportamiento por defecto de un form).
    evento.preventDefault();

    // No dejamos iniciar sesión con el nombre vacío.
    if (nombreEscrito.trim() === '') {
      return;
    }

    // "Condición" para estar autenticado: haber escrito un nombre.
    contexto.iniciarSesion(nombreEscrito);

    // Una vez logueado, lo llevamos a una página privada.
    navegar('/perfil');
  }

  return (
    <div>
      <h1>Login (pública)</h1>
      <form onSubmit={manejarEnvio}>
        <label htmlFor="nombre">Nombre: </label>
        <input
          id="nombre"
          type="text"
          value={nombreEscrito}
          onChange={manejarCambioNombre}
          placeholder="Escribí cualquier nombre"
        />
        <button type="submit">Iniciar sesión</button>
      </form>
    </div>
  );
}

export default Login;
