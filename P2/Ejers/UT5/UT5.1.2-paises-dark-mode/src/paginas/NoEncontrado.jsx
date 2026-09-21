// ==============================================
// Archivo: src/paginas/NoEncontrado.jsx
// Qué hace: página que se muestra cuando la URL no coincide con ninguna
// ruta (Route path="*"). Ofrece un enlace para volver a la lista.
// Conceptos: Link, ruta comodín.
// ==============================================
import { Link } from 'react-router-dom';

function NoEncontrado() {
  return (
    <div>
      <h1>Página no encontrada</h1>
      <p>La dirección que escribiste no existe en esta aplicación.</p>
      {/* Link a la lista para que el usuario no quede trabado */}
      <Link to="/countries">Ir a la lista de países</Link>
    </div>
  );
}

export default NoEncontrado;
