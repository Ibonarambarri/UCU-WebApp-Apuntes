// ==============================================
// Archivo: src/contextos/ContextoUsuario.jsx
// Qué hace: crea el contexto del usuario. A diferencia de la TA12, el
// value va a ser un OBJETO { nombre, setNombre } para que cualquier
// componente pueda leer Y cambiar el nombre.
// Conceptos: createContext.
// ==============================================
import { createContext } from 'react';

// Valor por defecto con la misma forma que el value real, para que si
// alguien lo usa sin Provider no explote al hacer contexto.nombre.
const ContextoUsuario = createContext({
  nombre: '',
  setNombre: function () {},
});

export default ContextoUsuario;
