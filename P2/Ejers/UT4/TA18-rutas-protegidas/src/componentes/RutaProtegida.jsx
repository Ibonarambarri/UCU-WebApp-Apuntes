// ==============================================
// Archivo: src/componentes/RutaProtegida.jsx
// Qué hace: "guardia" de las rutas privadas. Recibe la página como
// props.children. Si el usuario está logueado la muestra; si no, redirige
// al Home con <Navigate>.
// Conceptos: props.children, useContext, <Navigate to replace />.
// ==============================================
import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import ContextoAutenticacion from '../contextos/ContextoAutenticacion.jsx';

function RutaProtegida(props) {
  // Leemos el estado de sesión del contexto.
  const contexto = useContext(ContextoAutenticacion);

  // Si NO está logueado, devolvemos <Navigate>: es un componente que, al
  // renderizarse, cambia la URL a "to" (como hacer navegar('/') pero en JSX).
  // "replace" hace que la URL privada NO quede en el historial: así, si el
  // usuario aprieta "atrás", no vuelve a caer en /perfil y ser redirigido
  // otra vez en bucle.
  if (!contexto.estaLogueado) {
    return <Navigate to="/" replace />;
  }

  // Si está logueado, mostramos la página que nos pasaron como hijo.
  return props.children;
}

export default RutaProtegida;

// ALTERNATIVA con <Outlet /> (no usada acá, pero es muy común):
//
//   function RutaProtegida() {
//     const contexto = useContext(ContextoAutenticacion);
//     if (!contexto.estaLogueado) {
//       return <Navigate to="/" replace />;
//     }
//     return <Outlet />;   // Outlet = "acá va la ruta hija que coincida"
//   }
//
// y en App se usa como RUTA PADRE sin path, con las privadas anidadas:
//
//   <Route element={<RutaProtegida />}>
//     <Route path="/perfil" element={<Perfil />} />
//     <Route path="/panel" element={<Panel />} />
//   </Route>
//
// Ventaja: se envuelven muchas rutas de una sola vez en lugar de repetir
// <RutaProtegida> en cada element. El resultado es el mismo.
