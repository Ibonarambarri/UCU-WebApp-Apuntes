// ==============================================
// Archivo: src/components/App.jsx
// Qué hace: define el ruteo de la aplicación. Cada <Route> asocia una URL
//   del navegador con el componente (página) que se debe mostrar.
// Conceptos: BrowserRouter, Routes, Route, parámetros de ruta (:cca3).
// ==============================================
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from './Home';
import PaginaPais from './PaginaPais';
import ApiRef from './ApiRef';

// Componente raíz: solo contiene el router.
function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Ruta 1: inicio, lista de países con filtros */}
        <Route path="/" element={<Home />} />

        {/* Ruta 2: detalle de un país. ":cca3" es un parámetro dinámico que
            después leemos con useParams() dentro de PaginaPais. */}
        <Route path="/country/:cca3" element={<PaginaPais />} />

        {/* Referencia de la API que venía en la plantilla (no es obligatoria) */}
        <Route path="/ref/api" element={<ApiRef />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
