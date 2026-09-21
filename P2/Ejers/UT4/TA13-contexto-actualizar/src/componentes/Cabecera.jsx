// ==============================================
// Archivo: src/componentes/Cabecera.jsx
// Qué hace: componente intermedio de la rama "que lee". Contiene a
// SaludoUsuario. No recibe props.
// ==============================================
import SaludoUsuario from './SaludoUsuario.jsx';

function Cabecera() {
  return (
    <header className="cabecera">
      <h2>Cabecera</h2>
      {/* SaludoUsuario lee el nombre del contexto */}
      <SaludoUsuario />
    </header>
  );
}

export default Cabecera;
