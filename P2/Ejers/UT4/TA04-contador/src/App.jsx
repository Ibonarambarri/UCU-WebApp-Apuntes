// ==============================================
// Archivo: src/App.jsx
// Qué hace: componente principal. Solo muestra un título y el Contador.
// ==============================================
import Contador from './componentes/Contador.jsx';
import './App.css';

function App() {
  return (
    <div className="app">
      <h1>TA04 - Contador</h1>
      {/* Toda la lógica del contador está dentro del componente */}
      <Contador />
    </div>
  );
}

export default App;
