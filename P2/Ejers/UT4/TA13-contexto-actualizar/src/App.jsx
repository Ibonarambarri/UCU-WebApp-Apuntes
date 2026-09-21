// ==============================================
// Archivo: src/App.jsx
// Qué hace: guarda el nombre en un estado y publica en el contexto TANTO el
// valor COMO la función para cambiarlo. Así cualquier componente puede
// actualizarlo sin props. Los dos componentes que lo usan están en RAMAS
// DISTINTAS del árbol (ninguno es padre del otro).
// Conceptos: Provider con value objeto { estado, setEstado }.
// ==============================================
import { useState } from 'react';
import ContextoUsuario from './contextos/ContextoUsuario.jsx';
import Formulario from './componentes/Formulario.jsx';
import Cabecera from './componentes/Cabecera.jsx';
import './App.css';

function App() {
  // Estado: el nombre del usuario. Empieza vacío.
  const [nombre, setNombre] = useState('');

  // Armamos el objeto que vamos a compartir. Si solo pasáramos el string
  // "nombre", los hijos podrían leerlo pero NO cambiarlo. Al pasar también
  // setNombre, cualquier hijo puede llamar setNombre('...') y como el
  // estado vive en App, App se re-renderiza y todos los consumidores
  // reciben el valor nuevo.
  const valorDelContexto = {
    nombre: nombre,
    setNombre: setNombre,
  };

  return (
    <ContextoUsuario.Provider value={valorDelContexto}>
      <div className="contenedor">
        <h1>TA13 - Actualizar el contexto desde cualquier componente</h1>

        {/* Rama 1 del árbol: la cabecera solo LEE el nombre */}
        <Cabecera />

        {/* Rama 2 del árbol: el formulario ESCRIBE el nombre */}
        <Formulario />
      </div>
    </ContextoUsuario.Provider>
  );
}

export default App;
