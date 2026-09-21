// ==============================================
// Archivo: src/paginas/Perfil.jsx
// Qué hace: página PRIVADA. Solo se llega si RutaProtegida dejó pasar.
// Muestra el nombre del usuario leído del contexto.
// ==============================================
import { useContext } from 'react';
import ContextoAutenticacion from '../contextos/ContextoAutenticacion.jsx';

function Perfil() {
  const contexto = useContext(ContextoAutenticacion);

  return (
    <div>
      <h1>Perfil (privada)</h1>
      <p>Usuario: <strong>{contexto.nombreUsuario}</strong></p>
      <p>Si ves esto es porque estás logueado.</p>
    </div>
  );
}

export default Perfil;
