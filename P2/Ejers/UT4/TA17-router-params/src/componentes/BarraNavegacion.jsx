// ==============================================
// Archivo: src/componentes/BarraNavegacion.jsx
// Qué hace: barra de navegación con enlaces a Home y a la lista de productos.
// Conceptos: NavLink con clase activa.
// ==============================================
import { NavLink } from 'react-router-dom';

// Devuelve la clase del enlace según si está activo o no.
function elegirClase(datosDelEnlace) {
  if (datosDelEnlace.isActive) {
    return 'enlace enlace-activo';
  }
  return 'enlace';
}

function BarraNavegacion() {
  return (
    <nav className="barra">
      <NavLink to="/" className={elegirClase}>
        Home
      </NavLink>
      <NavLink to="/productos" className={elegirClase}>
        Productos
      </NavLink>
    </nav>
  );
}

export default BarraNavegacion;
