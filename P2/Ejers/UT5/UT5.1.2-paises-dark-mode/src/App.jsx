// ==============================================
// Archivo: src/App.jsx
// Qué hace: define las RUTAS de la aplicación con react-router y aplica la
// clase CSS del modo (light/dark) al contenedor raíz.
//   /                -> redirige a /countries
//   /countries       -> lista de países
//   /countries/:cca2 -> detalle de un país (cca2 es un parámetro: UY, AR...)
//   *                -> cualquier otra cosa: página "No encontrado"
// Conceptos: BrowserRouter, Routes, Route, Navigate, useContext, clases
// CSS condicionales.
// ==============================================
import { useContext } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ContextoTema } from './contextos/ContextoTema.jsx';
import Encabezado from './componentes/Encabezado.jsx';
import ListaDePaises from './paginas/ListaDePaises.jsx';
import DetalleDePais from './paginas/DetalleDePais.jsx';
import NoEncontrado from './paginas/NoEncontrado.jsx';
import './App.css';

// Componente raíz de la aplicación.
// IMPORTANTE: App usa useContext, así que el ProveedorTema tiene que estar
// POR FUERA de App. Por eso se envuelve en main.jsx y no acá.
function App() {
  // Leemos el modo actual del contexto.
  const contexto = useContext(ContextoTema);
  const modo = contexto.modo;

  // Elegimos la clase CSS según el modo con un if explícito.
  // Todas las reglas de App.css cuelgan de .modo-light o .modo-dark.
  let claseDelModo = 'modo-light';
  if (modo === 'dark') {
    claseDelModo = 'modo-dark';
  }

  return (
    // BrowserRouter "escucha" la URL del navegador. Tiene que envolver TODO
    // lo que use rutas, Link, useParams, useNavigate, etc.
    <BrowserRouter>
      {/*
        Concatenamos la clase fija "aplicacion" con la del modo.
        Resultado: "aplicacion modo-light" o "aplicacion modo-dark".
      */}
      <div className={'aplicacion ' + claseDelModo}>
        {/*
          El Encabezado está FUERA de Routes: se muestra siempre, sin importar
          la URL. Adentro está el selector de modo (usa Link, por eso tiene
          que estar dentro de BrowserRouter).
        */}
        <Encabezado />

        {/* main centra el contenido; Routes mira la URL y renderiza SOLO la Route que coincide */}
        <main className="contenido">
          <Routes>
            {/*
              Navigate es un componente que, al renderizarse, cambia la URL.
              Lo usamos para que "/" redirija a "/countries".
              replace: reemplaza la entrada actual del historial en vez de
              agregar una nueva. Así, si el usuario aprieta "atrás", no vuelve
              a "/" (que lo mandaría otra vez a /countries en un bucle).
            */}
            <Route path="/" element={<Navigate to="/countries" replace />} />

            {/* Lista de todos los países */}
            <Route path="/countries" element={<ListaDePaises />} />

            {/*
              Ruta con parámetro. Los dos puntos indican que ":cca2" es una
              variable: /countries/UY, /countries/AR, etc.
              Dentro del componente se lee con useParams().
            */}
            <Route path="/countries/:cca2" element={<DetalleDePais />} />

            {/* El asterisco coincide con cualquier ruta que no matcheó antes */}
            <Route path="*" element={<NoEncontrado />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
