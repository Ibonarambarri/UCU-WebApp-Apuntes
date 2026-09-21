// ==============================================
// Archivo: src/contextos/ContextoTema.jsx
// Qué hace: crea el contexto del tema visual. El value va a ser un objeto
// { tema, cambiarTema } donde tema es 'claro' u 'oscuro'.
// Conceptos: createContext.
// ==============================================
import { createContext } from 'react';

// Valor por defecto con la misma forma que el value real.
const ContextoTema = createContext({
  tema: 'claro',
  cambiarTema: function () {},
});

export default ContextoTema;
