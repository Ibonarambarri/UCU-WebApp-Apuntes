// ==============================================
// Archivo: src/context/ContextoPuntaje.jsx
// Qué hace: guarda el puntaje del jugador en un Context de React para que
// NO se pierda al navegar entre rutas.
// ¿Por qué un Context y no un useState en Home? Porque cuando el usuario
// hace click en el mapa y va a /country/URY, el router DESMONTA el
// componente Home. Al desmontarse, todo su estado (useState) se destruye.
// Al volver a "/" se monta un Home nuevo con el puntaje en 0. El Context
// vive en App (arriba del router), que nunca se desmonta, así que el
// puntaje sobrevive a los cambios de ruta.
// Conceptos: createContext, Provider, useState, props.children.
// ==============================================
import { createContext, useState } from 'react';

// El Context en sí. Los componentes lo leen con useContext(ContextoPuntaje).
// El valor inicial (null) solo se usa si alguien lo lee fuera del Provider.
// (El comentario de eslint de abajo solo apaga un aviso de "fast refresh"
// porque este archivo exporta un componente Y un context; no afecta la app.)
// eslint-disable-next-line react-refresh/only-export-components
export const ContextoPuntaje = createContext(null);

// Componente "proveedor": envuelve a la app y comparte el puntaje con todos
// los componentes que estén adentro (props.children).
export function ProveedorPuntaje(props) {
  // Estado: puntaje = respuestas correctas menos respuestas incorrectas.
  const [puntaje, setPuntaje] = useState(0);

  // Suma 1 al puntaje (respuesta correcta).
  function sumarPunto() {
    setPuntaje(puntaje + 1);
  }

  // Resta 1 al puntaje (respuesta incorrecta). Puede quedar negativo.
  function restarPunto() {
    setPuntaje(puntaje - 1);
  }

  // Esto es lo que reciben los componentes que hacen useContext.
  const valorDelContexto = {
    puntaje: puntaje,
    sumarPunto: sumarPunto,
    restarPunto: restarPunto,
  };

  return (
    <ContextoPuntaje.Provider value={valorDelContexto}>
      {props.children}
    </ContextoPuntaje.Provider>
  );
}
