// ==============================================
// Archivo: src/components/App.jsx
// Qué hace: define el ruteador (qué componente va en cada URL) y envuelve
// todo con el proveedor del estado del juego.
// Conceptos: BrowserRouter, Routes, Route, parámetro de ruta (:cca3),
// orden de las rutas, Context Provider por encima del router.
// ==============================================
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { ProveedorJuego } from '../context/ContextoJuego';
import Home from './Home';
import PaginaPais from './PaginaPais';
import PaginaFinal from './PaginaFinal';

function App() {
  return (
    // ProveedorJuego por FUERA del router: no se desmonta al cambiar de ruta,
    // por eso dificultad / errores / visitados sobreviven entre páginas.
    <ProveedorJuego>
      <BrowserRouter>
        <Routes>
          {/* Ruta 1: elegir dificultad */}
          <Route path="/" element={<Home />} />
          {/* Ruta 3: fin del juego. Va ANTES de "/:cca3" por claridad: aunque
              react-router 6 elige la ruta más específica sin importar el
              orden, así queda evidente que "/end" NO es un país. */}
          <Route path="/end" element={<PaginaFinal />} />
          {/* Ruta 2: página de un país. ":cca3" se lee con useParams(). */}
          <Route path="/:cca3" element={<PaginaPais />} />
        </Routes>
      </BrowserRouter>
    </ProveedorJuego>
  );
}

export default App;
