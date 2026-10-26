import { Image } from 'expo-image';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import StatusMessage from '@/components/StatusMessage';
import { useTriviaRound } from '@/hooks/useTriviaRound';
import { parseMaxErrors, remainingErrorsText } from '@/common/game';
import { expoDevServerUri } from '@/common/utils';
import { styles } from '@/common/styles';

/** Ruta `/game?maxErrors=5` — una jugada de la trivia.
 *
 * Estado de la partida (vive acá mientras se juega):
 * - `roundNumber`: número de jugada. Al sumarle 1 el hook arma otra jugada.
 * - `selectedCode`: la bandera que tocó el usuario (null = todavía no respondió).
 * - `hits` / `errors`: aciertos y errores acumulados.
 */
export default function Game() {
  const router = useRouter();
  const { maxErrors: maxErrorsParam } = useLocalSearchParams();
  const maxErrors = parseMaxErrors(maxErrorsParam);

  const [roundNumber, setRoundNumber] = useState(1);
  const [selectedCode, setSelectedCode] = useState(null);
  const [hits, setHits] = useState(0);
  const [errors, setErrors] = useState(0);
  const { data: round, isLoading, error, refetch } = useTriviaRound(roundNumber);

  // Estado derivado (se calcula, no se guarda en otro useState).
  const remainingErrors = maxErrors - errors;
  const hasAnswered = selectedCode !== null;
  const selectedOption = round?.options.find((option) => option.cca3 === selectedCode);
  // Es correcto si la capital mostrada está entre las capitales del país
  // tocado (cubre países con varias capitales, ej. Jerusalem).
  const isCorrect = selectedOption ? selectedOption.capitals.includes(round.capital) : false;

  function handleAnswer(option) {
    if (hasAnswered) {
      return; // Ya respondió esta jugada: no se puede cambiar.
    }
    setSelectedCode(option.cca3);
    if (option.capitals.includes(round.capital)) {
      setHits(hits + 1);
    } else {
      setErrors(errors + 1);
    }
  }

  function handleContinue() {
    if (remainingErrors <= 0) {
      // Se terminaron los errores: vamos al resumen. `replace` (en vez de
      // push) para que "atrás" no vuelva a una partida terminada.
      router.replace({ pathname: '/end', params: { hits, errors } });
      return;
    }
    setSelectedCode(null);
    setRoundNumber(roundNumber + 1);
  }

  // Color de cada bandera: antes de responder, el normal; después, verde o
  // rojo la tocada y gris todas las demás.
  function flagStyle(option) {
    if (!hasAnswered) {
      return null;
    }
    if (option.cca3 !== selectedCode) {
      return styles.flagGray;
    }
    return isCorrect ? styles.flagCorrect : styles.flagWrong;
  }

  return (
    <ScrollView contentContainerStyle={styles.scrollContent}>
      {isLoading && <StatusMessage isLoading text="Armando la jugada..." />}
      {error && <StatusMessage error={error} text="No se pudo cargar la jugada" onRetry={refetch} />}

      {round && (
        <>
          {!hasAnswered && (
            <>
              <Text style={styles.normalText}>¿Cuál de los siguientes países tiene a</Text>
              <Text style={styles.capitalText}>{round.capital}</Text>
              <Text style={styles.normalText}>como ciudad capital?</Text>
            </>
          )}

          {hasAnswered && (
            <>
              <Text style={isCorrect ? styles.resultCorrect : styles.resultWrong}>
                {isCorrect ? '¡Correcto!' : '¡Error!'}
              </Text>
              <Text style={styles.capitalText}>{round.capital}</Text>
              <Text style={styles.normalText}>
                {isCorrect ? 'es capital de' : 'no es capital de'} {selectedOption.name}.
              </Text>
              <Text style={styles.normalText}>{remainingErrorsText(remainingErrors)}</Text>
            </>
          )}

          <View style={[styles.flagGrid, styles.flagGridLimited]}>
            {round.options.map((option) => (
              <TouchableOpacity
                key={option.cca3}
                style={[styles.flagGridItem, flagStyle(option)]}
                disabled={hasAnswered}
                onPress={() => handleAnswer(option)}
              >
                <Image
                  source={{ uri: expoDevServerUri(`/static/flags/${option.cca3}.svg`) }}
                  style={styles.flagImage}
                  contentFit="contain"
                />
              </TouchableOpacity>
            ))}
          </View>
        </>
      )}

      <Text style={styles.normalText}>
        Aciertos: {hits} · Errores: {errors} de {maxErrors}
      </Text>

      {hasAnswered ? (
        <TouchableOpacity style={styles.primaryButton} onPress={handleContinue}>
          <Text style={styles.buttonText}>Continuar</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          style={styles.primaryButton}
          // Salir aborta el juego: volvemos a la bienvenida sacando esta
          // pantalla de la pila (si `/` no estaba, la reemplaza).
          onPress={() => router.dismissTo('/')}
        >
          <Text style={styles.buttonText}>Salir</Text>
        </TouchableOpacity>
      )}
    </ScrollView>
  );
}
