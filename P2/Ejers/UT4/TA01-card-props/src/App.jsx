// ==============================================
// Archivo: src/App.jsx
// Qué hace: componente principal. Usa el componente Card 3 veces con
// información distinta para demostrar que un mismo componente se puede
// reutilizar cambiando solo las props.
// Conceptos: reutilización de componentes, pasar props desde el padre.
// ==============================================
import Card from './componentes/Card.jsx';
import './App.css';

function App() {
  return (
    <div className="app">
      <h1>TA01 - Card con props</h1>

      {/* Contenedor que pone las 3 tarjetas una al lado de la otra */}
      <div className="lista-cards">
        {/* Cada Card recibe sus datos como atributos. Eso son las props. */}
        <Card
          titulo="Diseñar la base de datos"
          descripcion="Definir las tablas y relaciones del sistema de reservas."
          personaAsignada="Ana Pérez"
          fechaInicio="01/09/2026"
          fechaFin="10/09/2026"
        />
        <Card
          titulo="Programar el login"
          descripcion="Crear el formulario de inicio de sesión y validar usuario y contraseña."
          personaAsignada="Bruno García"
          fechaInicio="11/09/2026"
          fechaFin="20/09/2026"
        />
        <Card
          titulo="Probar la aplicación"
          descripcion="Hacer pruebas manuales de todas las pantallas antes de la entrega."
          personaAsignada="Carla López"
          fechaInicio="21/09/2026"
          fechaFin="30/09/2026"
        />
      </div>
    </div>
  );
}

export default App;
