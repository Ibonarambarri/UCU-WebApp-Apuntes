// ==============================================
// Archivo: src/components/BotonBandera.jsx
// Qué hace: botón con la bandera de un país. No conoce las reglas del
// juego: solo avisa al padre (PaginaPais) qué cca3 se presionó.
// Conceptos: props, onClick que llama a una función del padre, disabled.
// ==============================================

function BotonBandera(props) {
  // Leemos las props en variables con nombres claros.
  const cca3 = props.cca3; // código del país de esta bandera
  const imagenSrc = props.imagenSrc; // ruta de la imagen, ej: "/flags/URY.svg"
  const textoAlternativo = props.textoAlternativo; // texto para el atributo alt
  const estaDeshabilitado = props.estaDeshabilitado; // true mientras se procesa una jugada
  const alPresionar = props.alPresionar; // función del padre que recibe el cca3

  // Al hacer click le pasamos al padre el código del país elegido.
  function manejarClick() {
    alPresionar(cca3);
  }

  return (
    <button
      type="button"
      className="boton-bandera"
      onClick={manejarClick}
      disabled={estaDeshabilitado}
    >
      <img className="imagen-bandera" src={imagenSrc} alt={textoAlternativo} />
    </button>
  );
}

export default BotonBandera;
