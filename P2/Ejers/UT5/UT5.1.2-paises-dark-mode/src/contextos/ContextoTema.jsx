// ==============================================
// Archivo: src/contextos/ContextoTema.jsx
// Qué hace: define el CONTEXTO del tema (light / dark) y el componente
// proveedor que guarda el estado y lo comparte con toda la app.
// Además persiste el modo elegido en localStorage.
// Conceptos: createContext, Provider, props.children, useState, useEffect,
// localStorage.getItem / setItem.
// ==============================================
import { createContext, useState, useEffect } from 'react';

// 1) Creamos el contexto. El valor que le pasamos (null) es solo el valor por
// defecto si alguien usa useContext SIN estar dentro del proveedor.
// Lo que de verdad importa es el "value" que le damos al Provider abajo.
const ContextoTema = createContext(null);

// 2) Componente proveedor. Envuelve a toda la app (ver App.jsx) y todo lo que
// esté adentro (props.children) puede leer el modo con useContext.
function ProveedorTema(props) {
  // Función que decide con qué modo arrancar. Se la pasamos a useState
  // para que solo se ejecute una vez (en el primer render), no en cada render.
  function obtenerModoInicial() {
    // localStorage guarda strings y sobrevive a recargar la página.
    // Si nunca se guardó nada, getItem devuelve null.
    const modoGuardado = localStorage.getItem('modo');

    // if explícito: si no hay nada guardado (o hay basura) usamos 'light'.
    if (modoGuardado === 'dark') {
      return 'dark';
    }
    return 'light';
  }

  // Estado: el modo actual. Solo puede valer 'light' o 'dark'.
  const [modo, setModo] = useState(obtenerModoInicial);

  // Efecto que guarda el modo en localStorage cada vez que cambia.
  // Dependencias [modo]: se ejecuta al montar y cada vez que modo cambia.
  // Así, al recargar la página, obtenerModoInicial lo recupera.
  useEffect(function () {
    localStorage.setItem('modo', modo);
  }, [modo]);

  // Lo que compartimos con toda la app: el modo y la función para cambiarlo.
  // Se pasa como un objeto para poder agregar más cosas en el futuro.
  const valorDelContexto = {
    modo: modo,
    setModo: setModo,
  };

  return (
    // Provider: todo componente hijo que haga useContext(ContextoTema)
    // recibe valorDelContexto. Cuando modo cambia, se re-renderizan todos
    // los componentes que lo consumen.
    <ContextoTema.Provider value={valorDelContexto}>
      {props.children}
    </ContextoTema.Provider>
  );
}

export { ContextoTema, ProveedorTema };
