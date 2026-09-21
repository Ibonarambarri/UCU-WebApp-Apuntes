// ==============================================
// Archivo: src/componentes/Panel.jsx
// Qué hace: componente INTERMEDIO. Existe solo para demostrar que el nombre
// del usuario "atraviesa" niveles sin pasar por props: Panel no sabe nada
// del nombre y aun así SaludoUsuario (su hijo) lo puede leer.
// Conceptos: composición, evitar el "prop drilling".
// ==============================================
import SaludoUsuario from './SaludoUsuario.jsx';

function Panel() {
  return (
    <div className="panel">
      <h2>Panel (componente intermedio)</h2>
      <p>Este componente no recibe ni pasa el nombre.</p>

      {/* SaludoUsuario está 2 niveles por debajo de App (App -> Panel -> Saludo) */}
      <SaludoUsuario />
    </div>
  );
}

export default Panel;
