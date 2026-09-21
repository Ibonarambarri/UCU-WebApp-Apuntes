// ==============================================
// Archivo: src/componentes/SaludoUsuario.jsx
// Qué hace: lee el nombre del contexto y lo muestra. Como el valor cambia
// con cada tecla del InputNombre, este componente se re-renderiza solo.
// Conceptos: useContext, render condicional con ternario.
// ==============================================
import { useContext } from 'react';
import ContextoUsuario from '../contextos/ContextoUsuario.jsx';

function SaludoUsuario() {
  // Leemos el objeto del contexto; solo nos interesa contexto.nombre.
  const contexto = useContext(ContextoUsuario);

  return (
    <p className="saludo">
      {/* Ternario: si todavía no escribió nada mostramos un mensaje genérico */}
      {contexto.nombre === '' ? 'Todavía no sé tu nombre.' : 'Hola, ' + contexto.nombre + '!'}
    </p>
  );
}

export default SaludoUsuario;
