// ==============================================
// Archivo: src/App.jsx
// Qué hace: configura las rutas. La importante es "/producto/:id": la
// parte ":id" es un PARÁMETRO, o sea que /producto/1, /producto/2, etc.
// coinciden todas con esa misma Route y el componente lee el valor con
// useParams.
// Conceptos: BrowserRouter, Routes, Route con parámetro dinámico.
// ==============================================
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import BarraNavegacion from './componentes/BarraNavegacion.jsx';
import Home from './paginas/Home.jsx';
import ListaProductos from './paginas/ListaProductos.jsx';
import DetalleProducto from './paginas/DetalleProducto.jsx';
import NoEncontrada from './paginas/NoEncontrada.jsx';
import './App.css';

function App() {
  return (
    // BrowserRouter en App para tener toda la configuración de rutas junta.
    <BrowserRouter>
      <div className="contenedor">
        <BarraNavegacion />
        <main className="contenido">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/productos" element={<ListaProductos />} />

            {/* ":id" = segmento dinámico. Lo que haya en esa posición de la
                URL queda disponible en useParams().id */}
            <Route path="/producto/:id" element={<DetalleProducto />} />

            {/* Comodín para URLs que no existen */}
            <Route path="*" element={<NoEncontrada />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
