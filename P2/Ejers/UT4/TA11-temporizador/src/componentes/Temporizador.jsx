// ==============================================
// Archivo: src/componentes/Temporizador.jsx
// Qué hace: muestra un contador de segundos que sube solo, cada segundo.
// Al montarse arranca un setInterval; al desmontarse lo detiene con
// clearInterval (función de limpieza del useEffect).
// Conceptos: useEffect con limpieza, setInterval/clearInterval,
// actualización funcional del estado.
// ==============================================
import { useState, useEffect } from 'react';

function Temporizador() {
  // Estado: cantidad de segundos transcurridos desde que se montó.
  const [segundos, setSegundos] = useState(0);

  // useEffect: arranca el intervalo una sola vez, al montar.
  // Dependencias []: solo queremos UN intervalo, creado al montar.
  // Si pusiéramos [segundos], cada segundo se destruiría y crearía un
  // intervalo nuevo (funciona, pero es un desperdicio).
  useEffect(function () {
    console.log('Temporizador montado: arranca el setInterval');

    // setInterval ejecuta la función cada 1000 ms y devuelve un número (id)
    // que sirve para poder cancelarlo después.
    const idIntervalo = setInterval(function () {
      // FORMA FUNCIONAL del setState: le pasamos una función que recibe
      // el valor anterior y devuelve el nuevo.
      // ¿POR QUÉ hace falta? Porque esta función del setInterval se creó
      // en el PRIMER render, cuando "segundos" valía 0. Si escribiéramos
      // setSegundos(segundos + 1) siempre haríamos 0 + 1 = 1 y el contador
      // se quedaría clavado en 1 (es el problema de la "closure vieja").
      // Con la forma funcional React nos pasa siempre el valor más reciente.
      setSegundos(function (valorAnterior) {
        return valorAnterior + 1;
      });
    }, 1000);

    // FUNCIÓN DE LIMPIEZA: React la ejecuta cuando el componente se
    // desmonta (y también antes de volver a ejecutar el efecto, si las
    // dependencias cambiaran). Acá cancelamos el intervalo para que no
    // siga corriendo "en el aire" intentando actualizar un componente que
    // ya no existe (eso provoca fugas de memoria y avisos de React).
    return function limpiar() {
      console.log('Temporizador desmontado: se ejecuta clearInterval');
      clearInterval(idIntervalo);
    };
  }, []);

  return (
    <div className="temporizador">
      {/* Mostramos el estado actual; cada segundo cambia y React re-renderiza */}
      <p className="numero">{segundos}</p>
      <p>segundos transcurridos</p>
    </div>
  );
}

export default Temporizador;
