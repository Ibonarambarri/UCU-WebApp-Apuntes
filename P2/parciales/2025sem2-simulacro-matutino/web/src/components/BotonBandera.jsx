// ==============================================
// Archivo: src/components/BotonBandera.jsx
// Qué hace: un botón que muestra la bandera de un país. Es "tonto": no
// sabe nada del juego, solo avisa al padre (Home) cuando lo presionan.
// Conceptos: props, onClick que llama a una función del padre, disabled.
// ==============================================

function BotonBandera(props) {
  // Leemos las props en variables con nombre claro.
  const cca3 = props.cca3; // código del país de esta bandera
  const imagenSrc = props.imagenSrc; // ruta de la imagen, ej: "/flags/URY.svg"
  const textoAlternativo = props.textoAlternativo; // descripción para el atributo alt
  const estaDeshabilitado = props.estaDeshabilitado; // true cuando ya se respondió
  const claseDeResultado = props.claseDeResultado; // "", "correcta" o "incorrecta"
  const alPresionar = props.alPresionar; // función del padre que recibe el cca3

  // Cuando el usuario hace click, le pasamos al padre QUÉ país eligió.
  function manejarClick() {
    alPresionar(cca3);
  }

  return (
    <button
      type="button"
      className={'boton-bandera ' + claseDeResultado}
      onClick={manejarClick}
      disabled={estaDeshabilitado}
    >
      <img className="imagen-bandera" src={imagenSrc} alt={textoAlternativo} />
    </button>
  );
}

export default BotonBandera;
