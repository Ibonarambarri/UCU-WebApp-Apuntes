// ==============================================
// Archivo: src/componentes/Formulario.jsx
// Qué hace: componente intermedio de la rama "que escribe". Contiene a
// InputNombre. No recibe props.
// ==============================================
import InputNombre from './InputNombre.jsx';

function Formulario() {
  return (
    <section className="formulario">
      <h2>Formulario</h2>
      {/* InputNombre modifica el nombre del contexto */}
      <InputNombre />
    </section>
  );
}

export default Formulario;
