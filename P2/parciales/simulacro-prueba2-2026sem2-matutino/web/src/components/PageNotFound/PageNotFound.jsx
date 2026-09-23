import { Link } from 'react-router-dom';
import Header from '../Header/Header.jsx';

/** Ruta "*": cualquier URL que no coincide con ninguna otra. */
export default function PageNotFound() {
  return (
    <div>
      <Header title="Página no encontrada" />
      <Link to="/countries">← Ir al listado de países</Link>
    </div>
  );
}
