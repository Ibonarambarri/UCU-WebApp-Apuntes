// ==============================================
// Archivo: src/contextos/ContextoAutenticacion.jsx
// Qué hace: contexto que guarda si el usuario está logueado y las
// funciones para iniciar y cerrar sesión. Lo consumen la barra de
// navegación, la página Login y el componente RutaProtegida.
// Conceptos: createContext.
// ==============================================
import { createContext } from 'react';

// Valor por defecto con la misma forma que el value real.
const ContextoAutenticacion = createContext({
  estaLogueado: false,
  nombreUsuario: '',
  iniciarSesion: function () {},
  cerrarSesion: function () {},
});

export default ContextoAutenticacion;
