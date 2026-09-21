// ==============================================
// Archivo: src/paginas/NoEncontrada.jsx
// Qué hace: página 404 para URLs que no coinciden con ninguna Route.
// ==============================================
import { Link } from 'react-router-dom';

function NoEncontrada() {
  return (
    <div>
      <h1>404 - Página no encontrada</h1>
      <Link to="/">Volver al Home</Link>
    </div>
  );
}

export default NoEncontrada;
