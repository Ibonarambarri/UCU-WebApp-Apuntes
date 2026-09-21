// ==============================================
// Archivo: src/componentes/SelectorDeModo.jsx
// Qué hace: un <select> con las opciones "light" y "dark". Lee el modo actual
// del contexto y, al cambiar, actualiza el contexto (y por lo tanto toda
// la app cambia de tema).
// Conceptos: useContext, select controlado, onChange.
// ==============================================
import { useContext } from 'react';
import { ContextoTema } from '../contextos/ContextoTema.jsx';

function SelectorDeModo() {
  // useContext nos da el objeto { modo, setModo } que puso el Provider.
  const contexto = useContext(ContextoTema);
  const modo = contexto.modo;
  const setModo = contexto.setModo;

  // Se ejecuta cuando el usuario elige otra opción del select.
  // evento.target.value es 'light' o 'dark' (el value del <option>).
  function manejarCambioDeModo(evento) {
    setModo(evento.target.value);
  }

  return (
    <label className="selector-de-modo">
      Modo:{' '}
      {/* select controlado: su value viene del contexto */}
      <select value={modo} onChange={manejarCambioDeModo}>
        <option value="light">Claro (light)</option>
        <option value="dark">Oscuro (dark)</option>
      </select>
    </label>
  );
}

export default SelectorDeModo;
