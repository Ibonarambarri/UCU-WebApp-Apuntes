// ==============================================
// Archivo: src/paginas/Home.jsx
// Qué hace: página pública de inicio. Explica qué probar.
// ==============================================
import { Link } from 'react-router-dom';

function Home() {
  return (
    <div>
      <h1>Home (pública)</h1>
      <p>Esta página la puede ver cualquiera.</p>
      <p>
        Probá entrar a <Link to="/perfil">/perfil</Link> o <Link to="/panel">/panel</Link> sin iniciar
        sesión: vas a volver acá. Después hacé <Link to="/login">Login</Link> y probá de nuevo.
      </p>
    </div>
  );
}

export default Home;
