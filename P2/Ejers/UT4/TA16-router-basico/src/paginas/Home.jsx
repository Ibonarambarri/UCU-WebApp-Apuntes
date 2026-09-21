// ==============================================
// Archivo: src/paginas/Home.jsx
// Qué hace: página de inicio. Incluye un Link para mostrar que los enlaces
// también pueden ir dentro del contenido, no solo en la barra.
// Conceptos: Link.
// ==============================================
import { Link } from 'react-router-dom';

function Home() {
  return (
    <div>
      <h1>Home</h1>
      <p>Bienvenido a la página de inicio.</p>

      {/* Link cambia la URL sin recargar; Routes en App dibuja About */}
      <p>
        Podés ir a <Link to="/about">About</Link> desde acá también.
      </p>
    </div>
  );
}

export default Home;
