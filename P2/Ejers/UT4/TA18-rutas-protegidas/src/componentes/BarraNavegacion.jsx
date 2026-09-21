// ==============================================
// Archivo: src/componentes/BarraNavegacion.jsx
// Qué hace: barra de navegación. Muestra siempre Home, y según el estado
// de sesión muestra "Login" (si no hay sesión) o los enlaces privados +
// botón "Logout" (si hay sesión).
// Conceptos: NavLink, useContext, render condicional, useNavigate.
// ==============================================
import { useContext } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import ContextoAutenticacion from '../contextos/ContextoAutenticacion.jsx';

// Clase del enlace según si está activo.
function elegirClase(datosDelEnlace) {
  if (datosDelEnlace.isActive) {
    return 'enlace enlace-activo';
  }
  return 'enlace';
}

function BarraNavegacion() {
  const contexto = useContext(ContextoAutenticacion);
  const navegar = useNavigate();

  // Al cerrar sesión, además mandamos al usuario al Home: si estaba en
  // /perfil, esa página ya no se puede mostrar.
  function manejarClickLogout() {
    contexto.cerrarSesion();
    navegar('/');
  }

  // Return temprano: barra para usuario NO logueado.
  if (!contexto.estaLogueado) {
    return (
      <nav className="barra">
        <NavLink to="/" className={elegirClase}>Home</NavLink>
        <NavLink to="/login" className={elegirClase}>Login</NavLink>
      </nav>
    );
  }

  // Barra para usuario logueado.
  return (
    <nav className="barra">
      <NavLink to="/" className={elegirClase}>Home</NavLink>
      <NavLink to="/perfil" className={elegirClase}>Perfil</NavLink>
      <NavLink to="/panel" className={elegirClase}>Panel</NavLink>
      <span className="usuario">Hola, {contexto.nombreUsuario}</span>
      <button className="boton-logout" onClick={manejarClickLogout}>Logout</button>
    </nav>
  );
}

export default BarraNavegacion;
