// ==============================================
// Archivo: src/context/RecaudacionContext.js
// Qué hace: crea el contexto global con el TOTAL RECAUDADO del bar (PUNTO 5).
//           El Provider está en RecaudacionProvider.jsx: separarlos evita el
//           aviso de lint react-refresh/only-export-components.
// ==============================================

import { createContext } from 'react';

// El valor por defecto solo aplica si alguien lo consume fuera del Provider;
// lo dejamos con la misma forma para que no rompa.
export const RecaudacionContext = createContext({
  total: 0,
  recargar: function () {},
});
