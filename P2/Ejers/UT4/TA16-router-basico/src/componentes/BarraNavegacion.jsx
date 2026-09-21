// ==============================================
// Archivo: src/componentes/BarraNavegacion.jsx
// Qué hace: barra con los enlaces a las tres páginas. Usa NavLink en vez
// de Link para poder marcar cuál es la página activa.
// Conceptos: Link vs <a>, NavLink con className en función de isActive.
// ==============================================
import { NavLink } from 'react-router-dom';

// Función que NavLink llama para decidir la clase. Recibe un objeto con
// "isActive" (true si la URL actual coincide con el "to" del enlace).
// NavLink exige que sea una función, por eso la definimos con "function".
function elegirClase(datosDelEnlace) {
  if (datosDelEnlace.isActive) {
    return 'enlace enlace-activo';
  }
  return 'enlace';
}

function BarraNavegacion() {
  return (
    <nav className="barra">
      {/* NavLink es un Link que además sabe si está "activo".
          Un <a href="/about"> normal RECARGARÍA toda la página y perderíamos
          el estado de React. Link / NavLink solo cambian la URL y dejan que
          Routes dibuje la página nueva sin recargar. */}
      <NavLink to="/" className={elegirClase}>
        Home
      </NavLink>
      <NavLink to="/about" className={elegirClase}>
        About
      </NavLink>
      <NavLink to="/contact" className={elegirClase}>
        Contact
      </NavLink>
    </nav>
  );
}

export default BarraNavegacion;
