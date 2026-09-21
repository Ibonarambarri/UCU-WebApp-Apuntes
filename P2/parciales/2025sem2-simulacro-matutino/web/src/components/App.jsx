// ==============================================
// Archivo: src/components/App.jsx
// Qué hace: define el ruteador de la aplicación (qué componente se muestra
// en cada URL) y envuelve todo con el proveedor del puntaje.
// Conceptos: BrowserRouter, Routes, Route, parámetros de ruta (:cca3),
// Context Provider por encima de las rutas.
// ==============================================
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { ProveedorPuntaje } from '../context/ContextoPuntaje';
import Home from './Home';
import PaginaPais from './PaginaPais';

function App() {
  return (
    // El ProveedorPuntaje va POR FUERA de las rutas: así nunca se desmonta al
    // cambiar de página y el puntaje se conserva entre "/" y "/country/XXX".
    <ProveedorPuntaje>
      <BrowserRouter>
        <Routes>
          {/* Ruta 1: la trivia (elegir la bandera del mapa) */}
          <Route path="/" element={<Home />} />
          {/* Ruta 2: detalle de un país. ":cca3" es un parámetro que se lee
              con useParams() dentro de PaginaPais. */}
          <Route path="/country/:cca3" element={<PaginaPais />} />
        </Routes>
      </BrowserRouter>
    </ProveedorPuntaje>
  );
}

export default App;
