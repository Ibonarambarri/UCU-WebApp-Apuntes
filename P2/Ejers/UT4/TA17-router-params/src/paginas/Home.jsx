// ==============================================
// Archivo: src/paginas/Home.jsx
// Qué hace: página de inicio con un enlace a la lista de productos.
// ==============================================
import { Link } from 'react-router-dom';

function Home() {
  return (
    <div>
      <h1>Home</h1>
      <p>
        Mirá el <Link to="/productos">catálogo de productos</Link>.
      </p>
      <p>
        También podés escribir a mano una URL como <code>/producto/3</code> o una que no exista como <code>/producto/99</code>.
      </p>
    </div>
  );
}

export default Home;
