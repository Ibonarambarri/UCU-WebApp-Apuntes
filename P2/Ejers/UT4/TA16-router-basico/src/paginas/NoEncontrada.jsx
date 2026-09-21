// ==============================================
// Archivo: src/paginas/NoEncontrada.jsx
// Qué hace: página 404. Se muestra cuando la URL no coincide con ninguna
// Route (gracias a la Route path="*" de App).
// ==============================================
import { Link } from 'react-router-dom';

function NoEncontrada() {
  return (
    <div>
      <h1>404 - Página no encontrada</h1>
      <p>La dirección que escribiste no existe.</p>
      <Link to="/">Volver al Home</Link>
    </div>
  );
}

export default NoEncontrada;
