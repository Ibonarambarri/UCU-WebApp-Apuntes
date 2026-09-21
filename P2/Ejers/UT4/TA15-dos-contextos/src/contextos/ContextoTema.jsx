// ==============================================
// Archivo: src/contextos/ContextoTema.jsx
// Qué hace: contexto del tema visual ('claro' u 'oscuro') + función para alternarlo.
// Conceptos: createContext.
// ==============================================
import { createContext } from 'react';

const ContextoTema = createContext({
  tema: 'claro',
  cambiarTema: function () {},
});

export default ContextoTema;
