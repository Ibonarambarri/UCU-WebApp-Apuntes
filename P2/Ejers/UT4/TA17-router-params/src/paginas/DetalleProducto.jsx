// ==============================================
// Archivo: src/paginas/DetalleProducto.jsx
// Qué hace: lee el id de la URL con useParams, busca el producto en la
// lista y lo muestra. Si el id no existe muestra un mensaje. Tiene un
// botón "Volver" que usa useNavigate(-1).
// Conceptos: useParams (devuelve STRINGS), Number(), .find, useNavigate.
// ==============================================
import { useParams, useNavigate } from 'react-router-dom';
import productos from '../datos/productos.js';

function DetalleProducto() {
  // useParams devuelve un objeto con los parámetros de la URL.
  // Como la Route es "/producto/:id", el objeto tiene la propiedad "id".
  const parametros = useParams();

  // TRAMPA: todo lo que viene de la URL es un STRING. Si la URL es
  // /producto/2, parametros.id es "2" (texto), no 2 (número). Como los ids
  // de nuestra lista son números, "2" === 2 daría false y .find no
  // encontraría nada. Por eso convertimos con Number().
  const idBuscado = Number(parametros.id);

  // .find recorre el array y devuelve el PRIMER elemento para el que la
  // función devuelve true; si ninguno cumple, devuelve undefined.
  const productoEncontrado = productos.find(function (producto) {
    return producto.id === idBuscado;
  });

  // useNavigate devuelve una función para cambiar de página desde código
  // (sin que el usuario haga click en un Link).
  const navegar = useNavigate();

  // navegar(-1) es como el botón "atrás" del navegador: vuelve a la página anterior.
  function manejarClickVolver() {
    navegar(-1);
  }

  // Return temprano: si no existe el producto mostramos el aviso y listo.
  if (productoEncontrado === undefined) {
    return (
      <div>
        <h1>Producto no encontrado</h1>
        <p>No existe ningún producto con id {parametros.id}.</p>
        <button onClick={manejarClickVolver}>Volver</button>
      </div>
    );
  }

  // Render normal con los datos del producto.
  return (
    <div className="detalle">
      <h1>{productoEncontrado.nombre}</h1>
      <p>Id: {productoEncontrado.id}</p>
      <p>Precio: ${productoEncontrado.precio}</p>
      <p>{productoEncontrado.descripcion}</p>
      <button onClick={manejarClickVolver}>Volver</button>
    </div>
  );
}

export default DetalleProducto;
