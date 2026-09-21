// ==============================================
// Archivo: src/contextos/ContextoUsuario.jsx
// Qué hace: crea y exporta el contexto que va a guardar el nombre del
// usuario. Un contexto es como una "caja" global que cualquier componente
// del árbol puede abrir con useContext, sin pasar props.
// Conceptos: createContext.
// ==============================================
import { createContext } from 'react';

// El argumento de createContext es el valor POR DEFECTO: solo se usa si un
// componente hace useContext sin tener un Provider por encima.
// Lo ponemos vacío para que se note si nos olvidamos del Provider.
const ContextoUsuario = createContext('');

export default ContextoUsuario;
