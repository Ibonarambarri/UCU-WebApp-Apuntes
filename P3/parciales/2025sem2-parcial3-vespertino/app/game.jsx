import { obtenerJson, urlBandera, urlMapa } from '@/hooks/api';
import { styles } from '@/components/styles';
import { Image } from 'expo-image';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';

// El usuario siempre arranca con 3 vidas (lo dice el enunciado).
const VIDAS_TOTALES = 3;

// Elige un elemento al azar de un array.
function elegirAlAzar(lista) {
  return lista[Math.floor(Math.random() * lista.length)];
}

// Pide una pregunta nueva a la API:
// 1. Dos países al azar: el "de la pregunta" y "otro" (de donde sacar un
//    idioma que capaz no se habla en el primero).
// 2. El detalle de cada uno (nombre, idiomas, si tiene mapa).
// 3. Dos monedas al aire (50% cada una):
//    - ¿mostramos la bandera o el mapa?
//    - ¿preguntamos por un idioma del país o por uno del otro país?
async function pedirPregunta() {
  const codigos = await obtenerJson('/api/countries/random?n=2');
  // Promise.all: hacemos los dos pedidos a la vez y esperamos a ambos.
  const [pais, otroPais] = await Promise.all([
    obtenerJson(`/api/countries/${codigos[0]}`),
    obtenerJson(`/api/countries/${codigos[1]}`),
  ]);

  // 8 países no tienen mapa (FSM, JEY, ...): a esos les mostramos la bandera.
  const mostrarMapa = Math.random() < 0.5 && Boolean(pais.map);

  // `languages` es un OBJETO { spa: 'Spanish' }: con Object.values
  // obtenemos el array ['Spanish'].
  const idiomasDelPais = Object.values(pais.languages || {});
  const idiomasDelOtro = Object.values(otroPais.languages || {});

  let idioma;
  const usarIdiomaPropio = Math.random() < 0.5;
  // Antártida (ATA) no tiene idiomas: si le toca a uno de los dos, usamos el
  // del otro país para no quedarnos sin idioma.
  if (
    (usarIdiomaPropio && idiomasDelPais.length > 0) ||
    idiomasDelOtro.length === 0
  ) {
    idioma = elegirAlAzar(idiomasDelPais);
  } else {
    idioma = elegirAlAzar(idiomasDelOtro);
  }

  // OJO: la respuesta correcta NO es "usarIdiomaPropio". Si el otro país es
  // Argentina y el de la pregunta es Uruguay, "Spanish" es del otro país pero
  // en Uruguay TAMBIÉN se habla. Por eso lo calculamos mirando los idiomas.
  const seHabla = idiomasDelPais.includes(idioma);

  return { pais, mostrarMapa, idioma, seHabla };
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
  // Parámetros que mandó la Bienvenida (siempre llegan como string).
  const params = useLocalSearchParams();
  const nombre = params.nombre || 'Jugador';
  // Si falta o no es un número (URL escrita a mano), usamos 6 (fácil).
  const meta = Number(params.preguntas) > 0 ? Number(params.preguntas) : 6;

  // --- Estado del juego ---
  const [vidasPerdidas, setVidasPerdidas] = useState(0);
  const [correctas, setCorrectas] = useState(0); // el puntaje
  const [respondidas, setRespondidas] = useState(0); // bien o mal
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
    // desmontó o si ya se pidió otra pregunta.
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

  const vidasQueQuedan = VIDAS_TOTALES - vidasPerdidas;

  function responder(opcion) {
    // Es correcta si "sí" coincide con que el idioma se habla en el país.
    const esCorrecta = (opcion === 'si') === pregunta.seHabla;
    setRespuesta(opcion);
    setRespondidas(respondidas + 1);
    if (esCorrecta) {
      setCorrectas(correctas + 1);
    } else {
      setVidasPerdidas(vidasPerdidas + 1);
    }
  }

  function continuar() {
    // Se termina si no quedan vidas o si ya llegó a la meta de preguntas.
    if (vidasQueQuedan <= 0 || correctas >= meta) {
      setTerminado(true);
    } else {
      setRespuesta(null);
      setRonda(ronda + 1);
    }
  }

  // ---------- Vista 3: Fin ----------
  if (terminado) {
    // Ganó si llegó a la meta (las vidas se le pudieron acabar o no, pero
    // la meta se alcanza en el mismo momento en que contesta bien, así que
    // ahí todavía tiene vidas).
    const gano = correctas >= meta;
    return (
      <View style={styles.container}>
        {gano ? (
          <Text style={styles.normalText}>
            ¡Ganaste, {nombre}! Pudiste contestar las {meta} preguntas, antes de
            gastar tus {VIDAS_TOTALES} vidas. Felicitaciones.
          </Text>
        ) : (
          <Text style={styles.normalText}>
            Perdiste, {nombre}. Pudiste contestar {correctas} preguntas, pero
            tenías que llegar a {meta}.
          </Text>
        )}
        <Text style={styles.bigEmoji}>{gano ? '🎉' : '😞'}</Text>
        <TouchableOpacity style={styles.primaryButton} onPress={volverAlInicio}>
          <Text style={styles.buttonText}>Volver a jugar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // ---------- Vista 2: Juego ----------

  // Vidas: 💀 por cada perdida y ❤️ por cada una que queda.
  const textoVidas = '💀'.repeat(vidasPerdidas) + '❤️'.repeat(vidasQueQuedan);

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
    const nombrePais = pregunta.pais.name.common;
    let mensaje = `¿En este país se habla ${pregunta.idioma}?`;
    if (respuesta !== null) {
      const acerto = (respuesta === 'si') === pregunta.seHabla;
      // El mensaje dice la verdad (se habla / no se habla), haya acertado o no.
      mensaje =
        (acerto ? 'Correcto' : 'Incorrecto') +
        `: en ${nombrePais} ` +
        (pregunta.seHabla ? 'se habla ' : 'no se habla ') +
        `${pregunta.idioma}.`;
    }

    // El botón apretado se pinta verde (bien) o rojo (mal).
    // Un array de estilos combina ambos: el último pisa al anterior.
    function estiloBoton(opcion) {
      if (respuesta !== opcion) {
        return styles.answerButton;
      }
      const acerto = (opcion === 'si') === pregunta.seHabla;
      return [
        styles.answerButton,
        acerto ? styles.correctButton : styles.wrongButton,
      ];
    }

    const cca3 = pregunta.pais.cca3;
    contenido = (
      <>
        <Image
          source={{
            uri: pregunta.mostrarMapa ? urlMapa(cca3) : urlBandera(cca3),
          }}
          style={styles.bigImage}
          contentFit="contain"
        />

        <Text style={styles.normalText}>{mensaje}</Text>

        <View style={styles.row}>
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
    // Con ScrollView el centrado va en contentContainerStyle.
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.titleText}>
        {nombre}: {textoVidas}
      </Text>
      <Text style={styles.normalText}>
        Correctas: {correctas} de {meta} (respondiste {respondidas})
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
