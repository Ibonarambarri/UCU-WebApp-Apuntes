// ==============================================
// Archivo: src/App.jsx
// Qué hace: componente principal. Muestra un título y el Contador, que es
// quien se encarga de cambiar document.title con useEffect.
// ==============================================
import Contador from './componentes/Contador.jsx';
import './App.css';

function App() {
  return (
    <div className="app">
      <h1>TA09 - useEffect y título de la pestaña</h1>
      <Contador />
    </div>
  );
}

export default App;
