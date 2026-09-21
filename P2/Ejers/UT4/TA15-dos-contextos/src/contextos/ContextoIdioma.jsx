// ==============================================
// Archivo: src/contextos/ContextoIdioma.jsx
// Qué hace: contexto del idioma ('es' o 'en') + función para alternarlo.
// Es un contexto INDEPENDIENTE del de tema: cada uno tiene su propio
// Provider y su propio estado.
// Conceptos: createContext.
// ==============================================
import { createContext } from 'react';

const ContextoIdioma = createContext({
  idioma: 'es',
  cambiarIdioma: function () {},
});

export default ContextoIdioma;
