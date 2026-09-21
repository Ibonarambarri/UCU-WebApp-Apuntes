// ==============================================
// Archivo: src/App.jsx
// Qué hace: guarda el estado de autenticación, lo publica por contexto y
// define las rutas. Las rutas PÚBLICAS (/, /login) se declaran normal; las
// PRIVADAS (/perfil, /panel) van envueltas en <RutaProtegida>, que deja
// pasar solo si el usuario está logueado y si no redirige al Home.
// Conceptos: Context + Router, rutas protegidas con children.
// ==============================================
import { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ContextoAutenticacion from './contextos/ContextoAutenticacion.jsx';
import BarraNavegacion from './componentes/BarraNavegacion.jsx';
import RutaProtegida from './componentes/RutaProtegida.jsx';
import Home from './paginas/Home.jsx';
import Login from './paginas/Login.jsx';
import Perfil from './paginas/Perfil.jsx';
import Panel from './paginas/Panel.jsx';
import NoEncontrada from './paginas/NoEncontrada.jsx';
import './App.css';

function App() {
  // Estado 1: si hay sesión iniciada o no.
  const [estaLogueado, setEstaLogueado] = useState(false);

  // Estado 2: nombre del usuario que inició sesión (para saludarlo).
  const [nombreUsuario, setNombreUsuario] = useState('');

  // "Inicia sesión": en una app real acá se llamaría a una API y se
  // guardaría un token. Acá simplemente marcamos el estado como logueado.
  function iniciarSesion(nombre) {
    setNombreUsuario(nombre);
    setEstaLogueado(true);
  }

  // "Cierra sesión": vuelve todo al estado inicial.
  function cerrarSesion() {
    setNombreUsuario('');
    setEstaLogueado(false);
  }

  // Objeto que compartimos por contexto.
  const valorDelContexto = {
    estaLogueado: estaLogueado,
    nombreUsuario: nombreUsuario,
    iniciarSesion: iniciarSesion,
    cerrarSesion: cerrarSesion,
  };

  return (
    // El Provider va POR FUERA del BrowserRouter para que tanto la barra
    // como todas las páginas y RutaProtegida puedan leer el contexto.
    <ContextoAutenticacion.Provider value={valorDelContexto}>
      <BrowserRouter>
        <div className="contenedor">
          <BarraNavegacion />
          <main className="contenido">
            <Routes>
              {/* RUTAS PÚBLICAS: cualquiera puede entrar */}
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />

              {/* RUTAS PRIVADAS: la página va como "children" de RutaProtegida.
                  RutaProtegida decide si muestra props.children o redirige. */}
              <Route
                path="/perfil"
                element={
                  <RutaProtegida>
                    <Perfil />
                  </RutaProtegida>
                }
              />
              <Route
                path="/panel"
                element={
                  <RutaProtegida>
                    <Panel />
                  </RutaProtegida>
                }
              />

              {/* 404 */}
              <Route path="*" element={<NoEncontrada />} />
            </Routes>
          </main>
        </div>
      </BrowserRouter>
    </ContextoAutenticacion.Provider>
  );
}

export default App;
