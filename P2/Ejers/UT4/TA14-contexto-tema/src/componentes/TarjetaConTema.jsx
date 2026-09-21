// ==============================================
// Archivo: src/componentes/TarjetaConTema.jsx
// Qué hace: tarjeta que LEE el tema del contexto y elige su clase CSS en
// función de él. Cuando el tema cambia, se re-renderiza y cambia de estilo.
// Conceptos: useContext, className dinámico con ternario.
// ==============================================
import { useContext } from 'react';
import ContextoTema from '../contextos/ContextoTema.jsx';

function TarjetaConTema() {
  // Solo necesitamos leer contexto.tema.
  const contexto = useContext(ContextoTema);

  // Ternario para elegir la clase: 'tarjeta tema-claro' o 'tarjeta tema-oscuro'.
  const claseTarjeta = contexto.tema === 'claro' ? 'tarjeta tema-claro' : 'tarjeta tema-oscuro';

  return (
    <div className={claseTarjeta}>
      <h2>Tarjeta con tema</h2>
      <p>Tema actual: <strong>{contexto.tema}</strong></p>
      <p>Mis colores cambian solos cuando el contexto se actualiza.</p>
    </div>
  );
}

export default TarjetaConTema;
