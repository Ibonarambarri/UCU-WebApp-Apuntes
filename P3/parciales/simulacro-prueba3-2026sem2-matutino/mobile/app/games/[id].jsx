import { useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { fetchJSON } from '@/common/fetch';
import { STATS } from '@/common/format';
import { styles } from '@/common/styles';
import Button from '@/components/Button';
import CountryCard from '@/components/CountryCard';
import StatusMessage from '@/components/StatusMessage';
import { useCreateGame } from '@/hooks/useCreateGame';
import { useFetchGame } from '@/hooks/useFetchGame';

export default function Game() {
  // `id` viene de la URL (/games/6) y siempre es un STRING.
  const { id } = useLocalSearchParams();
  const router = useRouter();

  // Todos los hooks arriba, antes de cualquier `return`.
  const { data: loadedGame, setData: setGame, error, refetch } = useFetchGame(id);
  const { createGame, isCreating, error: createError } = useCreateGame();
  // Respuesta del último POST .../guess: { guess, stat, correct, revealed, game }.
  const [result, setResult] = useState(null);
  const [isGuessing, setIsGuessing] = useState(false);
  const [guessError, setGuessError] = useState(null);

  // "Jugar de nuevo" cambia el `id` de la URL. Hasta que llega la partida
  // nueva, `loadedGame` y `result` todavía son de la anterior: solo los usamos
  // si son de ESTA partida (estado derivado, sin efectos para "resetear").
  const game = loadedGame && String(loadedGame.id) === String(id) ? loadedGame : null;
  const roundResult = result && String(result.game.id) === String(id) ? result : null;

  async function handleGuess(guess) {
    setIsGuessing(true);
    setGuessError(null);
    try {
      const response = await fetchJSON(`/api/games/${id}/guess`, {
        method: 'POST',
        body: { guess },
      });
      setResult(response);
    } catch (err) {
      setGuessError(err);
    } finally {
      setIsGuessing(false);
    }
  }

  function handleNext() {
    // La partida que devolvió la API ya es la ronda siguiente: no hace falta
    // volver a pedirla.
    setGame(roundResult.game);
    setResult(null);
  }

  async function handlePlayAgain() {
    // `game?.` y no `game.`: el React Compiler puede leer `game.player` antes de
    // los `return` tempranos, cuando `game` todavía es null.
    const newGame = await createGame(game?.player);
    if (newGame) {
      // replace: "atrás" vuelve al inicio y no a la partida terminada.
      router.replace(`/games/${newGame.id}`);
    }
  }

  function handleGoHome() {
    // Si se recargó la página en /games/6 no hay "atrás": dismissTo vuelve
    // hasta el inicio, o lo abre si no estaba en la pila.
    router.dismissTo('/');
  }

  const title = <Stack.Screen options={{ title: `Partida ${id}` }} />;

  if (error) {
    return (
      <View style={styles.container}>
        {title}
        {error.status === 404 ? (
          <Text style={styles.errorText}>La partida {id} no existe.</Text>
        ) : (
          <StatusMessage error={error} text="No se pudo cargar la partida." onRetry={refetch} />
        )}
        <Button title="Volver al inicio" onPress={handleGoHome} />
      </View>
    );
  }
  if (!game) {
    return (
      <View style={styles.container}>
        {title}
        <StatusMessage loading text="Cargando partida…" />
      </View>
    );
  }

  // Qué se muestra depende de si hay un resultado de ronda o no:
  // - Jugando, sin responder: current vs next (con "?").
  // - Recién respondida: current vs revealed, con el stat DE ESA RONDA
  //   (result.stat), no el de la partida nueva (result.game.stat).
  // - Partida que ya estaba terminada al entrar: current vs next (con valores).
  const finishedOnEntry = !roundResult && game.status !== 'playing';
  const stat = roundResult ? roundResult.stat : game.stat;
  const otherCountry = roundResult ? roundResult.revealed : game.next;
  const hideOther = !roundResult && game.status === 'playing';
  const score = roundResult ? roundResult.game.score : game.score;
  const isOver = roundResult ? roundResult.game.status !== 'playing' : finishedOnEntry;
  const finalStatus = roundResult ? roundResult.game.status : game.status;

  let verdict = null;
  if (roundResult) {
    verdict = roundResult.correct ? '¡Correcto!' : 'Incorrecto';
  } else if (finishedOnEntry) {
    verdict = game.status === 'won' ? '¡Ganaste! No quedan más países.' : 'Incorrecto';
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {title}
      <View style={styles.row}>
        <Text style={styles.normalText}>Jugador: {game.player}</Text>
        <Text style={styles.normalText}>Puntaje: {score}</Text>
      </View>

      <View style={[styles.row, { alignItems: 'stretch' }]}>
        <CountryCard country={game.current} stat={stat} />
        <Text style={[styles.normalText, { alignSelf: 'center' }]}>vs</Text>
        {/* otherCountry puede ser null si se ganó la partida (no queda país). */}
        {otherCountry && <CountryCard country={otherCountry} stat={stat} hidden={hideOther} />}
      </View>

      {otherCountry && (
        <Text style={[styles.normalText, { textAlign: 'center' }]}>
          ¿{otherCountry.name} tiene más o menos {STATS[stat].question} que {game.current.name}?
        </Text>
      )}

      {/* Jugando: botones Más / Menos (deshabilitados mientras se espera). */}
      {!roundResult && game.status === 'playing' && (
        <View style={[styles.row, { justifyContent: 'center' }]}>
          <Button title="Más ▲" onPress={() => handleGuess('higher')} disabled={isGuessing} />
          <Button title="Menos ▼" onPress={() => handleGuess('lower')} disabled={isGuessing} />
        </View>
      )}
      {isGuessing && <StatusMessage loading text="Enviando respuesta…" />}
      {guessError && (
        <StatusMessage error={guessError} text="No se pudo enviar la respuesta." />
      )}

      {verdict && (
        <Text
          style={[
            styles.titleText,
            { textAlign: 'center', color: verdict === 'Incorrecto' ? '#cc0000' : '#008800' },
          ]}
        >
          {verdict}
        </Text>
      )}

      {/* Acierto y la partida sigue: Siguiente. */}
      {roundResult && !isOver && (
        <View style={[styles.row, { justifyContent: 'center' }]}>
          <Button title="Siguiente" onPress={handleNext} />
        </View>
      )}

      {/* Fin de la partida (recién perdida o ya terminada al entrar). */}
      {isOver && (
        <View style={{ gap: 10, alignItems: 'center' }}>
          <Text style={styles.normalText}>
            Fin de la partida{finalStatus === 'won' ? ' (¡ganaste!)' : ''}. Puntaje final: {score}
          </Text>
          <View style={styles.row}>
            <Button
              title={isCreating ? 'Creando…' : 'Jugar de nuevo'}
              onPress={handlePlayAgain}
              disabled={isCreating}
            />
            <Button title="Volver al inicio" onPress={handleGoHome} style={styles.dangerButton} />
          </View>
          {createError && (
            <Text style={styles.errorText}>No se pudo crear la partida ({createError.message}).</Text>
          )}
        </View>
      )}
    </ScrollView>
  );
}
