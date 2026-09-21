// ==============================================
// Archivo: src/paginas/ListaProductos.jsx
// Qué hace: muestra todos los productos con un Link a su página de detalle.
// El "to" del Link se arma concatenando el id: '/producto/' + producto.id.
// Conceptos: .map con key, Link con URL dinámica.
// ==============================================
import { Link } from 'react-router-dom';
import productos from '../datos/productos.js';

function ListaProductos() {
  return (
    <div>
      <h1>Productos</h1>
      <ul className="lista-productos">
        {productos.map(function (producto) {
          // Por cada producto un <li> con un enlace a /producto/<id>
          return (
            <li key={producto.id}>
              <Link to={'/producto/' + producto.id}>{producto.nombre}</Link> - ${producto.precio}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default ListaProductos;
