// ==============================================
// Archivo: src/App.jsx
// Qué hace: componente raíz. Solo muestra un título y el componente
// ListaUsuarios, que es el que hace la llamada a la API.
// Conceptos: composición de componentes.
// ==============================================
import ListaUsuarios from './componentes/ListaUsuarios.jsx';
import './App.css';

function App() {
  return (
    <div className="contenedor">
      <h1>TA10 - Usuarios desde una API</h1>
      <p>Datos obtenidos de https://jsonplaceholder.typicode.com/users</p>

      {/* Todo el trabajo de fetch vive dentro de ListaUsuarios */}
      <ListaUsuarios />
    </div>
  );
}

export default App;
