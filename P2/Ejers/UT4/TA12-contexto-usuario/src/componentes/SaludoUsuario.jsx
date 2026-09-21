// ==============================================
// Archivo: src/componentes/SaludoUsuario.jsx
// Qué hace: lee el nombre del usuario DIRECTAMENTE del contexto con
// useContext y lo muestra. No recibe props.
// Conceptos: useContext.
// ==============================================
import { useContext } from 'react';
import ContextoUsuario from '../contextos/ContextoUsuario.jsx';

function SaludoUsuario() {
  // useContext busca hacia ARRIBA en el árbol el Provider más cercano de
  // ContextoUsuario y nos devuelve su "value" (acá, un string con el nombre).
  const nombreUsuario = useContext(ContextoUsuario);

  return (
    <div className="saludo">
      {/* Mostramos el valor leído del contexto */}
      <p>Hola, <strong>{nombreUsuario}</strong>. Este nombre vino del contexto.</p>
    </div>
  );
}

export default SaludoUsuario;
