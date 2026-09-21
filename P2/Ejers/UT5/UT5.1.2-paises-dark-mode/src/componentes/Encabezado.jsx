// ==============================================
// Archivo: src/componentes/Encabezado.jsx
// Qué hace: barra superior que aparece en TODAS las páginas. Tiene el título
// (que es un Link a la lista) y el selector de modo.
// Se renderiza en App.jsx FUERA de <Routes>, por eso no depende de la ruta.
// Conceptos: Link, composición de componentes.
// ==============================================
import { Link } from 'react-router-dom';
import SelectorDeModo from './SelectorDeModo.jsx';

function Encabezado() {
  return (
    <header className="encabezado">
      {/* El título lleva siempre a la lista */}
      <Link to="/countries" className="titulo-de-app">
        Países del mundo
      </Link>

      {/* Selector light/dark, visible en todas las páginas */}
      <SelectorDeModo />
    </header>
  );
}

export default Encabezado;
