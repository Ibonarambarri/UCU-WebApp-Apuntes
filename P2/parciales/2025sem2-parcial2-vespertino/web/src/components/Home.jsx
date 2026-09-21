// ==============================================
// Archivo: src/components/Home.jsx
// Qué hace: página de inicio (ruta "/") con los cuatro enlaces de navegación.
// Conceptos: Link de react-router-dom (navega sin recargar la página).
// ==============================================
import { Link } from 'react-router-dom';

function Home() {
  return (
    <div className="pagina">
      <h1>Countries</h1>
      <p>Choose your navigation:</p>

      {/* Cuatro enlaces, uno por vista. Usamos Link y no <a> para que React
          Router cambie de página sin recargar. */}
      <nav className="menu-inicio">
        <Link className="boton-enlace" to="/currencies">By currency</Link>
        <Link className="boton-enlace" to="/languages">By language</Link>
        <Link className="boton-enlace" to="/timezones">By timezone</Link>
        <Link className="boton-enlace" to="/countries">All countries</Link>
      </nav>
    </div>
  );
}

export default Home;
