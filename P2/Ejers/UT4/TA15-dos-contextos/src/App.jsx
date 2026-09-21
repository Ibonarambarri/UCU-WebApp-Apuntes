// ==============================================
// Archivo: src/App.jsx
// Qué hace: tiene DOS estados (tema e idioma) y DOS Providers anidados,
// uno por contexto. Todo lo que está adentro de los dos puede consumir
// cualquiera de ellos (o los dos).
// Conceptos: varios contextos, Providers anidados.
// ==============================================
import { useState } from 'react';
import ContextoTema from './contextos/ContextoTema.jsx';
import ContextoIdioma from './contextos/ContextoIdioma.jsx';
import Controles from './componentes/Controles.jsx';
import MostrarTema from './componentes/MostrarTema.jsx';
import MostrarIdioma from './componentes/MostrarIdioma.jsx';
import Titulo from './componentes/Titulo.jsx';
import './App.css';

function App() {
  // Estado 1: tema ('claro' u 'oscuro').
  const [tema, setTema] = useState('claro');

  // Estado 2: idioma ('es' o 'en').
  const [idioma, setIdioma] = useState('es');

  // Alterna el tema.
  function cambiarTema() {
    if (tema === 'claro') {
      setTema('oscuro');
    } else {
      setTema('claro');
    }
  }

  // Alterna el idioma.
  function cambiarIdioma() {
    if (idioma === 'es') {
      setIdioma('en');
    } else {
      setIdioma('es');
    }
  }

  // Un objeto por contexto.
  const valorTema = { tema: tema, cambiarTema: cambiarTema };
  const valorIdioma = { idioma: idioma, cambiarIdioma: cambiarIdioma };

  // Clase del contenedor según el tema.
  const claseContenedor = tema === 'claro' ? 'contenedor tema-claro' : 'contenedor tema-oscuro';

  return (
    // PROVIDERS ANIDADOS: uno adentro del otro. El ORDEN NO IMPORTA: los dos
    // son independientes y cualquier hijo puede usar useContext(ContextoTema),
    // useContext(ContextoIdioma) o ambos. Podríamos poner Idioma afuera y
    // Tema adentro y funcionaría exactamente igual.
    <ContextoTema.Provider value={valorTema}>
      <ContextoIdioma.Provider value={valorIdioma}>
        <div className={claseContenedor}>
          {/* Usa solo idioma */}
          <Titulo />

          {/* Usa los DOS contextos (para cambiarlos) */}
          <Controles />

          {/* Usa tema (para mostrarlo) e idioma (para traducir la etiqueta) */}
          <MostrarTema />

          {/* Usa solo idioma */}
          <MostrarIdioma />
        </div>
      </ContextoIdioma.Provider>
    </ContextoTema.Provider>
  );
}

export default App;
