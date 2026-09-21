// ==============================================
// Archivo: src/App.jsx
// Qué hace: define las RUTAS de la aplicación con react-router.
//   /                -> redirige a /countries
//   /countries       -> lista de países
//   /countries/:cca2 -> detalle de un país (cca2 es un parámetro: UY, AR...)
//   *                -> cualquier otra cosa: página "No encontrado"
// Conceptos: BrowserRouter, Routes, Route, Navigate.
// ==============================================
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import ListaDePaises from './paginas/ListaDePaises.jsx';
import DetalleDePais from './paginas/DetalleDePais.jsx';
import NoEncontrado from './paginas/NoEncontrado.jsx';
import './App.css';

// Componente raíz de la aplicación.
function App() {
  return (
    // BrowserRouter "escucha" la URL del navegador. Tiene que envolver TODO
    // lo que use rutas, Link, useParams, useNavigate, etc.
    <BrowserRouter>
      <div className="aplicacion">
        {/* Routes mira la URL actual y renderiza SOLO la Route que coincide */}
        <Routes>
          {/*
            Navigate es un componente que, al renderizarse, cambia la URL.
            Lo usamos para que "/" redirija a "/countries".
            replace: reemplaza la entrada actual del historial en vez de
            agregar una nueva. Así, si el usuario aprieta "atrás", no vuelve
            a "/" (que lo mandaría otra vez a /countries en un bucle).
          */}
          <Route path="/" element={<Navigate to="/countries" replace />} />

          {/* Lista de todos los países */}
          <Route path="/countries" element={<ListaDePaises />} />

          {/*
            Ruta con parámetro. Los dos puntos indican que ":cca2" es una
            variable: /countries/UY, /countries/AR, etc.
            Dentro del componente se lee con useParams().
          */}
          <Route path="/countries/:cca2" element={<DetalleDePais />} />

          {/* El asterisco coincide con cualquier ruta que no matcheó antes */}
          <Route path="*" element={<NoEncontrado />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
