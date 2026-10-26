import { obtenerJson, urlBandera, urlMapa } from '@/hooks/api';
import { styles } from '@/components/styles';
import { Image } from 'expo-image';
import { router, Stack, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';

// Pide una pregunta nueva a la API:
// 1. Dos países al azar (la API garantiza que son distintos).
// 2. El detalle de cada uno (para tener el nombre y saber si tiene mapa).
// 3. Tiramos una "moneda" (50%): la bandera es del mismo país que el mapa o
//    del otro.
async function pedirPregunta() {
  let paisMapa = null;
  let otroPais = null;

  // Hay 8 países sin mapa en los datos (FSM, JEY, MHL, ...). Si nos toca uno
  // para el mapa, repetimos el pedido hasta tener uno que sí tenga.
  while (paisMapa === null) {
    const codigos = await obtenerJson('/api/countries/random?n=2');
    // Promise.all: hacemos los dos pedidos a la vez y esperamos a ambos.
    const [paisA, paisB] = await Promise.all([
      obtenerJson(`/api/countries/${codigos[0]}`),
      obtenerJson(`/api/countries/${codigos[1]}`),
    ]);
    if (paisA.map) {
      paisMapa = paisA;
      otroPais = paisB;
    } else if (paisB.map) {
      paisMapa = paisB;
      otroPais = paisA;
    }
  }

  // Math.random() da un número entre 0 y 1: la mitad de las veces es < 0.5.
  const mismoPais = Math.random() < 0.5;
  const paisBandera = mismoPais ? paisMapa : otroPais;

  return { paisMapa, paisBandera, mismoPais };
}

// Volver a la Bienvenida. Si hay pantalla anterior en la pila, volvemos
// (así el nombre sigue escrito). Si entraron directo a /game (ej. en la web
// escribiendo la URL), no hay "atrás" y reemplazamos por '/'.
function volverAlInicio() {
  if (router.canGoBack()) {
    router.back();
  } else {
    router.replace('/');
  }
}

// Vista 2 (Juego) y Vista 3 (Fin), en la ruta /game
export default function Game() {
  // Parámetros que mandó la pantalla de Bienvenida (siempre son strings).
  const params = useLocalSearchParams();
  const nombre = params.nombre || 'Jugador';
  // Number('6') -> 6. Si falta o no es número (alguien escribió la URL a
  // mano), usamos 3 vidas para no romper.
  const vidasTotales = Number(params.vidas) > 0 ? Number(params.vidas) : 3;

  // --- Estado del juego ---
  const [vidasPerdidas, setVidasPerdidas] = useState(0);
  const [respondidas, setRespondidas] = useState(0); // bien o mal
  const [correctas, setCorrectas] = useState(0); // el "puntaje"
  const [terminado, setTerminado] = useState(false); // ¿mostramos el Fin?

  // --- Estado de la pregunta actual ---
  const [pregunta, setPregunta] = useState(null);
  const [respuesta, setRespuesta] = useState(null); // null | 'si' | 'no'
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  // Cada vez que sumamos 1 a `ronda`, el useEffect pide otra pregunta.
  const [ronda, setRonda] = useState(0);

  useEffect(() => {
    // `ignorar` evita guardar una respuesta vieja si el componente se
    // desmontó (salieron de la pantalla) o si ya se pidió otra pregunta.
    let ignorar = false;

    async function cargar() {
      setCargando(true);
      setError(null);
      try {
        const nueva = await pedirPregunta();
        if (!ignorar) {
          setPregunta(nueva);
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

  const vidasQueQuedan = vidasTotales - vidasPerdidas;

  function responder(opcion) {
    // opcion es 'si' o 'no'. Es correcta si coincide con la realidad.
    const esCorrecta = (opcion === 'si') === pregunta.mismoPais;
    setRespuesta(opcion);
    setRespondidas(respondidas + 1);
    if (esCorrecta) {
      setCorrectas(correctas + 1);
    } else {
      setVidasPerdidas(vidasPerdidas + 1);
    }
  }

  function continuar() {
    if (vidasQueQuedan <= 0) {
      // Sin vidas: pasamos a la vista de Fin.
      setTerminado(true);
    } else {
      // Quedan vidas: limpiamos la respuesta y pedimos otra pregunta.
      setRespuesta(null);
      setRonda(ronda + 1);
    }
  }

  // ---------- Vista 3: Fin ----------
  if (terminado) {
    return (
      <View style={styles.container}>
        {/* Stack.Screen DENTRO de la pantalla cambia las opciones del header
            mientras se muestra esto: el título pasa a "Fin de juego". */}
        <Stack.Screen options={{ title: 'Fin de juego' }} />
        <Text style={styles.normalText}>
          Gracias por jugar, {nombre}. Jugaste con {vidasTotales} vidas y
          pudiste contestar {respondidas} preguntas ({correctas} bien).
          Felicitaciones.
        </Text>
        <Text style={styles.bigEmoji}>🎉</Text>
        <TouchableOpacity style={styles.primaryButton} onPress={volverAlInicio}>
          <Text style={styles.buttonText}>Volver a jugar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // ---------- Vista 2: Juego ----------

  // Vidas: 💀 por cada perdida y ❤️ por cada una que queda.
  // 'x'.repeat(3) -> 'xxx'
  const textoVidas = '💀'.repeat(vidasPerdidas) + '❤️'.repeat(vidasQueQuedan);

  // Contenido del medio según el estado del pedido.
  let contenido;
  if (cargando) {
    contenido = <Text style={styles.normalText}>Cargando pregunta...</Text>;
  } else if (error) {
    contenido = (
      <>
        <Text style={styles.errorText}>
          No se pudo cargar la pregunta: {error.message}
        </Text>
        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={() => setRonda(ronda + 1)}
        >
          <Text style={styles.buttonText}>Reintentar</Text>
        </TouchableOpacity>
      </>
    );
  } else if (pregunta) {
    // Mensaje después de responder.
    let mensaje = '¿La bandera y el mapa son del mismo país?';
    if (respuesta !== null) {
      const acerto = (respuesta === 'si') === pregunta.mismoPais;
      mensaje =
        (acerto ? 'Correcto' : 'Incorrecto') +
        `: el mapa es de ${pregunta.paisMapa.name.common}` +
        ` y la bandera es de ${pregunta.paisBandera.name.common}.`;
    }

    // Estilo de cada botón: el que se apretó se pinta verde (bien) o rojo
    // (mal). En RN se pueden combinar estilos con un array: el último gana.
    function estiloBoton(opcion) {
      if (respuesta !== opcion) {
        return styles.answerButton;
      }
      const acerto = (opcion === 'si') === pregunta.mismoPais;
      return [
        styles.answerButton,
        acerto ? styles.correctButton : styles.wrongButton,
      ];
    }

    contenido = (
      <>
        <View style={styles.row}>
          <Image
            source={{ uri: urlMapa(pregunta.paisMapa.cca3) }}
            style={styles.mapImage}
            contentFit="contain"
          />
          <View style={styles.flagCard}>
            <Image
              source={{ uri: urlBandera(pregunta.paisBandera.cca3) }}
              style={styles.flagImage}
              contentFit="contain"
            />
          </View>
        </View>

        <Text style={styles.normalText}>{mensaje}</Text>

        <View style={styles.row}>
          {/* disabled: una vez que respondió no puede volver a apretar */}
          <TouchableOpacity
            style={estiloBoton('si')}
            disabled={respuesta !== null}
            onPress={() => responder('si')}
          >
            <Text style={styles.answerButtonText}>Sí</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={estiloBoton('no')}
            disabled={respuesta !== null}
            onPress={() => responder('no')}
          >
            <Text style={styles.answerButtonText}>No</Text>
          </TouchableOpacity>
        </View>
      </>
    );
  }

  return (
    // ScrollView para que en pantallas chicas se pueda bajar hasta los botones.
    // Con ScrollView el centrado va en contentContainerStyle, no en style.
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.titleText}>
        {nombre}: {textoVidas}
      </Text>
      <Text style={styles.normalText}>
        Puntaje: {correctas} de {respondidas}
      </Text>

      {contenido}

      {/* Antes de responder: Salir. Después de responder: Continuar. */}
      {respuesta === null ? (
        <TouchableOpacity style={styles.primaryButton} onPress={volverAlInicio}>
          <Text style={styles.buttonText}>Salir</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity style={styles.primaryButton} onPress={continuar}>
          <Text style={styles.buttonText}>Continuar</Text>
        </TouchableOpacity>
      )}
    </ScrollView>
  );
}
