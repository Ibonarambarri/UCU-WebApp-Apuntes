// ==============================================
// Archivo: src/App.jsx
// Qué hace: configura React Router. Envuelve todo en <BrowserRouter>,
// muestra la barra de navegación (siempre visible) y define en <Routes>
// qué página se dibuja según la URL.
// Conceptos: BrowserRouter, Routes, Route, ruta comodín "*".
// ==============================================
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import BarraNavegacion from './componentes/BarraNavegacion.jsx';
import Home from './paginas/Home.jsx';
import About from './paginas/About.jsx';
import Contact from './paginas/Contact.jsx';
import NoEncontrada from './paginas/NoEncontrada.jsx';
import './App.css';

function App() {
  return (
    // BrowserRouter: "escucha" la URL del navegador y se la cuenta a Routes.
    // Lo ponemos acá en App (y no en main.jsx) para que App sea
    // autocontenido: cualquiera que lea App.jsx ve toda la configuración
    // del router en un solo archivo. Ponerlo en main.jsx también sería válido.
    <BrowserRouter>
      <div className="contenedor">
        {/* La barra está FUERA de Routes, así que aparece en todas las páginas */}
        <BarraNavegacion />

        {/* Routes mira la URL y renderiza SOLO la primera Route que coincida */}
        <main className="contenido">
          <Routes>
            {/* path: la URL. element: el componente a dibujar. */}
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />

            {/* "*" es el comodín: coincide con cualquier URL que no
                haya coincidido antes -> página 404 */}
            <Route path="*" element={<NoEncontrada />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
