// ==============================================
// Archivo: src/textos.js
// Qué hace: diccionario de textos en español e inglés. Los componentes
// eligen textos[idioma].clave según el idioma que hay en el contexto.
// ==============================================

const textos = {
  es: {
    titulo: 'TA15 - Dos contextos: idioma y tema',
    temaActual: 'Tema actual',
    idiomaActual: 'Idioma actual',
    cambiarTema: 'Cambiar tema',
    cambiarIdioma: 'Cambiar idioma',
    claro: 'claro',
    oscuro: 'oscuro',
    nombreIdioma: 'Español',
  },
  en: {
    titulo: 'TA15 - Two contexts: language and theme',
    temaActual: 'Current theme',
    idiomaActual: 'Current language',
    cambiarTema: 'Toggle theme',
    cambiarIdioma: 'Toggle language',
    claro: 'light',
    oscuro: 'dark',
    nombreIdioma: 'English',
  },
};

export default textos;
