// ==============================================
// Archivo: src/componentes/Input.jsx
// Qué hace: un input "controlado". NO tiene estado propio: el valor que
// muestra y la función que se llama al escribir le llegan por props desde App.
// Conceptos: input controlado (value + onChange), levantar el estado al padre.
// ==============================================

function Input(props) {
  return (
    <div className="campo">
      {/* La etiqueta se muestra al lado del input */}
      <label htmlFor="entrada-texto">{props.etiqueta}</label>

      {/* value: lo que se ve en el input SIEMPRE sale del estado del padre.
          onChange: cada tecla que se aprieta avisa al padre para que actualice
          ese estado. Sin onChange el input quedaría "congelado". */}
      <input
        id="entrada-texto"
        type="text"
        value={props.valor}
        onChange={props.alCambiar}
        placeholder="Escribí algo..."
      />
    </div>
  );
}

export default Input;
