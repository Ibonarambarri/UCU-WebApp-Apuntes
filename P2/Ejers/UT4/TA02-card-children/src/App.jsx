// ==============================================
// Archivo: src/App.jsx
// Qué hace: usa el componente Card 3 veces, pero ahora la información va
// ESCRITA ADENTRO de la etiqueta (entre <Card> y </Card>) en vez de como
// atributos. Eso es lo que llega al componente como props.children.
// Conceptos: props.children vs props normales.
// ==============================================
import Card from './componentes/Card.jsx';
import './App.css';

function App() {
  return (
    <div className="app">
      <h1>TA02 - Card con children</h1>

      <div className="lista-cards">
        {/* Todo lo que está entre <Card> y </Card> es "children".
            La Card lo recibe y lo dibuja adentro de su marco. */}
        <Card>
          <h2 className="card-titulo">Diseñar la base de datos</h2>
          <p className="card-descripcion">
            Definir las tablas y relaciones del sistema de reservas.
          </p>
          <p className="card-dato"><strong>Persona asignada:</strong> Ana Pérez</p>
          <p className="card-dato"><strong>Fecha de inicio:</strong> 01/09/2026</p>
          <p className="card-dato"><strong>Fecha de fin:</strong> 10/09/2026</p>
        </Card>

        <Card>
          <h2 className="card-titulo">Programar el login</h2>
          <p className="card-descripcion">
            Crear el formulario de inicio de sesión y validar usuario y contraseña.
          </p>
          <p className="card-dato"><strong>Persona asignada:</strong> Bruno García</p>
          <p className="card-dato"><strong>Fecha de inicio:</strong> 11/09/2026</p>
          <p className="card-dato"><strong>Fecha de fin:</strong> 20/09/2026</p>
        </Card>

        <Card>
          <h2 className="card-titulo">Probar la aplicación</h2>
          <p className="card-descripcion">
            Hacer pruebas manuales de todas las pantallas antes de la entrega.
          </p>
          <p className="card-dato"><strong>Persona asignada:</strong> Carla López</p>
          <p className="card-dato"><strong>Fecha de inicio:</strong> 21/09/2026</p>
          <p className="card-dato"><strong>Fecha de fin:</strong> 30/09/2026</p>
        </Card>
      </div>
    </div>
  );
}

export default App;
