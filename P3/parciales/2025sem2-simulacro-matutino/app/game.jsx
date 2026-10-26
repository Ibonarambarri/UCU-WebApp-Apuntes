import { obtenerJson, urlBandera, urlMapa } from '@/hooks/api';
import { styles } from '@/components/styles';
import { Image } from 'expo-image';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';

// Pide un desafío nuevo:
// 1. Cuatro países al azar (distintos entre sí).
// 2. Elegimos al azar CUÁL de los cuatro es el correcto: así la posición de
//    la bandera correcta también es aleatoria (0, 1, 2 o 3).
// 3. Pedimos el detalle del correcto para saber su nombre y si tiene mapa.
async function pedirDesafio() {
  // 8 países no tienen mapa (FSM, JEY, ...). Si el elegido es uno de esos,
  // repetimos el pedido.
  while (true) {
    const codigos = await obtenerJson('/api/countries/random?n=4');
    const posicionCorrecta = Math.floor(Math.random() * codigos.length);
    const paisCorrecto = await obtenerJson(
      `/api/countries/${codigos[posicionCorrecta]}`
    );
    if (paisCorrecto.map) {
      return { opciones: codigos, paisCorrecto };
    }
  }
}

// Volver a la Bienvenida (si no hay "atrás", reemplazamos por '/').
function volverAlInicio() {
  if (router.canGoBack()) {
    router.back();
  } else {
    router.replace('/');
  }
}

// Vista 2: Juego (ruta /game)
export default function Game() {
  const { nombre } = useLocalSearchParams();
  const nombreJugador = nombre || 'Jugador';

  // Puntaje = correctas - incorrectas. Puede ser negativo.
  const [puntaje, setPuntaje] = useState(0);

  const [desafio, setDesafio] = useState(null);
  const [elegida, setElegida] = useState(null); // cca3 que tocó, o null
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  // Sumar 1 a `ronda` dispara el useEffect y trae otro desafío.
  const [ronda, setRonda] = useState(0);

  useEffect(() => {
    let ignorar = false; // por si sale de la pantalla antes de que llegue

    async function cargar() {
      setCargando(true);
      setError(null);
      try {
        const nuevo = await pedirDesafio();
        if (!ignorar) {
          setDesafio(nuevo);
        }
      } catch (err) {
        if (!ignorar) {
          setError(err);
        }
      } finally {
        if (!ignorar) {
          setCargando(false);
        }
      }
    }

    cargar();
    return () => {
      ignorar = true;
    };
  }, [ronda]);

  function elegir(cca3) {
    setElegida(cca3);
    if (cca3 === desafio.paisCorrecto.cca3) {
      setPuntaje(puntaje + 1);
    } else {
      setPuntaje(puntaje - 1);
    }
  }

  function otroDesafio() {
    setElegida(null);
    setRonda(ronda + 1);
  }

  const yaRespondio = elegida !== null;

  let contenido;
  if (cargando) {
    contenido = <Text style={styles.normalText}>Cargando desafío...</Text>;
  } else if (error) {
    contenido = (
      <>
        <Text style={styles.errorText}>
          No se pudo cargar el desafío: {error.message}
        </Text>
        <TouchableOpacity style={styles.secondaryButton} onPress={otroDesafio}>
          <Text style={styles.buttonText}>Reintentar</Text>
        </TouchableOpacity>
      </>
    );
  } else if (desafio) {
    const correcto = desafio.paisCorrecto.cca3;
    const acerto = elegida === correcto;

    let mensaje = '¿Cuál es la bandera del país del mapa?';
    if (yaRespondio) {
      mensaje = acerto
        ? '¡Bien! Esa es la bandera correcta.'
        : `No, esa no es la bandera correcta. Era la de ${desafio.paisCorrecto.name.common}.`;
    }

    contenido = (
      <>
        <View style={styles.bigMapCard}>
          <Image
            source={{ uri: urlMapa(correcto) }}
            style={styles.bigMapImage}
            contentFit="contain"
          />
        </View>

        <View style={styles.row}>
          {desafio.opciones.map((cca3) => {
            // Estilo del botón: si es el que tocó, verde o rojo.
            // Un array de estilos: el último pisa al anterior.
            let estilo = styles.flagButton;
            if (yaRespondio && cca3 === elegida) {
              estilo = [
                styles.flagButton,
                acerto ? styles.correctButton : styles.wrongButton,
              ];
            }
            return (
              <TouchableOpacity
                key={cca3}
                style={estilo}
                disabled={yaRespondio}
                onPress={() => elegir(cca3)}
              >
                <Image
                  source={{ uri: urlBandera(cca3) }}
                  style={styles.smallFlagImage}
                  contentFit="contain"
                />
              </TouchableOpacity>
            );
          })}
        </View>

        <Text style={styles.normalText}>{mensaje}</Text>
      </>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {contenido}

      <Text style={styles.normalText}>
        {yaRespondio ? 'Ahora tenés' : 'Tenés'} {puntaje} puntos,{' '}
        {nombreJugador}.
      </Text>

      {/* Antes de responder: Salir. Después: Continuar (otro desafío). */}
      {yaRespondio ? (
        <TouchableOpacity style={styles.primaryButton} onPress={otroDesafio}>
          <Text style={styles.buttonText}>Continuar</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity style={styles.primaryButton} onPress={volverAlInicio}>
          <Text style={styles.buttonText}>Salir</Text>
        </TouchableOpacity>
      )}
    </ScrollView>
  );
}
