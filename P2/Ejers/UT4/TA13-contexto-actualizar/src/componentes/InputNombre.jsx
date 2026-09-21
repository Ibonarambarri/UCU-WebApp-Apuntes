// ==============================================
// Archivo: src/componentes/InputNombre.jsx
// Qué hace: un input controlado cuyo valor es el nombre del contexto.
// Cada tecla llama a setNombre del contexto, así que el cambio se ve en
// tiempo real en cualquier otro componente que consuma el contexto.
// Conceptos: useContext, input controlado, onChange.
// ==============================================
import { useContext } from 'react';
import ContextoUsuario from '../contextos/ContextoUsuario.jsx';

function InputNombre() {
  // Sacamos del contexto el objeto { nombre, setNombre }.
  const contexto = useContext(ContextoUsuario);

  // Se ejecuta con cada tecla. evento.target.value es lo que hay en el input.
  function manejarCambioNombre(evento) {
    contexto.setNombre(evento.target.value);
  }

  return (
    <div>
      <label htmlFor="input-nombre">Escribí tu nombre: </label>
      {/* Input CONTROLADO: value viene del contexto y onChange lo actualiza.
          Así el contexto es la única "fuente de la verdad". */}
      <input
        id="input-nombre"
        type="text"
        value={contexto.nombre}
        onChange={manejarCambioNombre}
        placeholder="Tu nombre"
      />
    </div>
  );
}

export default InputNombre;
