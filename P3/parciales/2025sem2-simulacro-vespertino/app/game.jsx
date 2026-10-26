import { styles } from '@/components/styles';
import { obtenerJson, urlBandera } from '@/hooks/api';
import { Image } from 'expo-image';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';

const CANTIDAD_OPCIONES = 9; // grilla de 3x3
const MAXIMO_LIMITROFES = 4; // cuántos limítrofes como mucho ponemos

// Devuelve una COPIA del array mezclada al azar (el truco del sort con
// random es el mismo que usa la API mock; no es perfecto pero alcanza).
function mezclar(lista) {
  return [...lista].sort(() => Math.random() - 0.5);
}

function elegirAlAzar(lista) {
  return lista[Math.floor(Math.random() * lista.length)];
}

// Arma las 9 banderas: algunos limítrofes (hasta 4) + países al azar que NO
// son limítrofes ni el país actual. Al final se mezcla todo para que las
// posiciones sean aleatorias.
function armarOpciones(pais, todos) {
  const limitrofes = mezclar(pais.borders).slice(0, MAXIMO_LIMITROFES);
  const noLimitrofes = todos.filter(
    (cca3) => cca3 !== pais.cca3 && !pais.borders.includes(cca3)
  );
  const relleno = mezclar(noLimitrofes).slice(
    0,
    CANTIDAD_OPCIONES - limitrofes.length
  );
  return mezclar([...limitrofes, ...relleno]);
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

  const [puntaje, setPuntaje] = useState(0);

  // Lista con TODOS los códigos (para elegir países al azar).
  const [todos, setTodos] = useState(null);
  // Código del país actual. Cuando cambia, el 2do useEffect trae su detalle.
  const [codigoActual, setCodigoActual] = useState(null);
  const [pais, setPais] = useState(null); // detalle del país actual
  const [opciones, setOpciones] = useState([]); // 9 códigos
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  // Respuesta: null (todavía no), un cca3, o 'ninguno'.
  const [elegido, setElegido] = useState(null);
  // Nombre del país elegido, para preguntar "¿Vamos a ...?"
  const [nombreElegido, setNombreElegido] = useState(null);

  // 1) Al entrar: pedimos la lista de países y elegimos el primero al azar.
  useEffect(() => {
    let ignorar = false;
    async function cargarLista() {
      try {
        const lista = await obtenerJson('/api/countries');
        if (!ignorar) {
          setTodos(lista);
          setCodigoActual(elegirAlAzar(lista));
        }
      } catch (err) {
        if (!ignorar) {
          setError(err);
          setCargando(false);
        }
      }
    }
    cargarLista();
    return () => {
      ignorar = true;
    };
  }, []);

  // 2) Cada vez que cambia el país actual: pedimos su detalle (nombre y
  //    fronteras) y armamos las 9 banderas.
  useEffect(() => {
    if (codigoActual === null || todos === null) {
      return; // todavía no llegó la lista
    }
    let ignorar = false;
    async function cargarPais() {
      setCargando(true);
      setError(null);
      try {
        const detalle = await obtenerJson(`/api/countries/${codigoActual}`);
        if (!ignorar) {
          setPais(detalle);
          // Las opciones se arman ACÁ (una vez) y se guardan en el estado.
          // Si las armáramos en el render, con cada render se mezclarían
          // de nuevo y las banderas "saltarían" de lugar.
          setOpciones(armarOpciones(detalle, todos));
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
    cargarPais();
    return () => {
      ignorar = true;
    };
  }, [codigoActual, todos]);

  // ¿La respuesta fue correcta?
  function esCorrecta(respuesta) {
    if (respuesta === 'ninguno') {
      return pais.borders.length === 0;
    }
    return pais.borders.includes(respuesta);
  }

  async function responder(respuesta) {
    setElegido(respuesta);
    setPuntaje(esCorrecta(respuesta) ? puntaje + 1 : puntaje - 1);

    // Para "¿Vamos a Argentina?" necesitamos el nombre del país tocado.
    setNombreElegido(null);
    if (respuesta !== 'ninguno') {
      try {
        const detalle = await obtenerJson(`/api/countries/${respuesta}`);
        setNombreElegido(detalle.name.common);
      } catch {
        setNombreElegido(respuesta); // si falla, mostramos el código
      }
    }
  }

  function vamos() {
    // Si eligió un país, vamos a ese (sea limítrofe o no).
    // Si eligió "Ninguno", no hay país elegido: vamos a uno al azar.
    let siguiente = elegido;
    if (elegido === 'ninguno') {
      const otros = todos.filter((cca3) => cca3 !== codigoActual);
      siguiente = elegirAlAzar(otros);
    }
    setElegido(null);
    setNombreElegido(null);
    setCodigoActual(siguiente);
  }

  const yaRespondio = elegido !== null;

  // Color de un botón (bandera o "Ninguno") después de responder:
  // el tocado verde/rojo, los demás grises.
  function estiloSegunRespuesta(estiloBase, valor) {
    if (!yaRespondio) {
      return estiloBase;
    }
    if (valor !== elegido) {
      return [estiloBase, styles.greyButton];
    }
    return [
      estiloBase,
      esCorrecta(valor) ? styles.correctButton : styles.wrongButton,
    ];
  }

  // ----- Estados de carga / error -----
  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>
          No se pudo cargar el juego: {error.message}
        </Text>
        <TouchableOpacity style={styles.primaryButton} onPress={volverAlInicio}>
          <Text style={styles.buttonText}>Salir</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (cargando || pais === null) {
    return (
      <View style={styles.container}>
        <Text style={styles.normalText}>Cargando país...</Text>
      </View>
    );
  }

  // ----- Textos -----
  let textoArriba = `Tenés ${puntaje} puntos, ${nombreJugador}. Estás en ${pais.name.common}.`;
  let pregunta = '¿Cuál de los siguientes es un país fronterizo?';
  if (yaRespondio) {
    const bien = esCorrecta(elegido);
    if (elegido === 'ninguno') {
      textoArriba = bien
        ? 'Correcto, no tiene fronteras.'
        : 'Incorrecto, sí tiene fronteras.';
      pregunta = '¿Vamos a otro país al azar?';
    } else {
      textoArriba = bien ? 'Se puede ir ahí.' : 'No se puede ir ahí.';
      pregunta = `¿Vamos a ${nombreElegido ?? '...'}?`;
    }
    textoArriba += ` Ahora tenés ${puntaje} puntos, ${nombreJugador}.`;
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.normalText}>{textoArriba}</Text>

      <Image
        source={{ uri: urlBandera(pais.cca3) }}
        style={styles.currentFlag}
        contentFit="contain"
      />

      <Text style={styles.normalText}>{pregunta}</Text>

      <View style={styles.grid}>
        {opciones.map((cca3) => (
          <TouchableOpacity
            key={cca3}
            style={estiloSegunRespuesta(styles.flagButton, cca3)}
            disabled={yaRespondio}
            onPress={() => responder(cca3)}
          >
            <Image
              source={{ uri: urlBandera(cca3) }}
              style={styles.flagImage}
              contentFit="contain"
            />
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.row}>
        {/* Salir cambia por Vamos después de responder */}
        {yaRespondio ? (
          <TouchableOpacity style={styles.outlineButton} onPress={vamos}>
            <Text style={styles.outlineButtonText}>Vamos</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={styles.outlineButton}
            onPress={volverAlInicio}
          >
            <Text style={styles.outlineButtonText}>Salir</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity
          style={estiloSegunRespuesta(styles.outlineButton, 'ninguno')}
          disabled={yaRespondio}
          onPress={() => responder('ninguno')}
        >
          <Text style={styles.outlineButtonText}>Ninguno</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
