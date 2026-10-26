import { useCallback, useState } from 'react';
import { FlatList, Text, TextInput, View } from 'react-native';
import { useFocusEffect, useRouter } from 'expo-router';
import { styles } from '@/common/styles';
import Button from '@/components/Button';
import StatusMessage from '@/components/StatusMessage';
import { useCreateGame } from '@/hooks/useCreateGame';
import { useFetchRanking } from '@/hooks/useFetchRanking';

export default function Home() {
  const router = useRouter();
  // Input controlado: el texto vive en el estado (TextInput usa onChangeText).
  const [player, setPlayer] = useState('');
  const { createGame, isCreating, error: createError } = useCreateGame();
  const { data: ranking, error: rankingError, refetch } = useFetchRanking();

  // Al volver a esta pantalla (desde una partida) el ranking puede haber
  // cambiado: se vuelve a pedir cada vez que la pantalla gana el foco.
  // (Con la navegación Stack el inicio NO se desmonta al abrir una partida.)
  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [refetch]),
  );

  // Estado derivado: no hace falta un useState para "está vacío".
  const trimmedPlayer = player.trim();
  const canPlay = trimmedPlayer !== '' && !isCreating;

  async function handlePlay() {
    if (!canPlay) return;
    const game = await createGame(trimmedPlayer);
    if (game) {
      router.push(`/games/${game.id}`);
    }
  }

  let rankingContent;
  if (rankingError) {
    rankingContent = (
      <StatusMessage error={rankingError} text="No se pudo cargar el ranking." onRetry={refetch} />
    );
  } else if (!ranking) {
    // `!ranking` y no `isLoading`: así al refrescar no parpadea la lista vieja.
    rankingContent = <StatusMessage loading text="Cargando ranking…" />;
  } else if (ranking.length === 0) {
    rankingContent = <Text style={styles.normalText}>Todavía no hay partidas terminadas.</Text>;
  } else {
    rankingContent = (
      <FlatList
        data={ranking}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item, index }) => (
          <View style={[styles.row, homeStyles.rankingRow]}>
            <Text style={homeStyles.position}>{index + 1}</Text>
            <Text style={[styles.normalText, { flex: 1 }]}>{item.player}</Text>
            <Text style={styles.normalText}>{item.score} pts</Text>
          </View>
        )}
      />
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.titleText}>Higher / Lower</Text>
      <Text style={styles.normalText}>
        ¿El segundo país tiene más o menos habitantes (o superficie) que el primero?
      </Text>

      <View style={styles.row}>
        <TextInput
          style={styles.input}
          placeholder="Tu nombre"
          value={player}
          onChangeText={setPlayer}
          onSubmitEditing={handlePlay}
          returnKeyType="go"
        />
        <Button title={isCreating ? 'Creando…' : 'Jugar'} onPress={handlePlay} disabled={!canPlay} />
      </View>
      {createError && (
        <Text style={styles.errorText}>No se pudo crear la partida ({createError.message}).</Text>
      )}

      <Text style={styles.titleText}>Ranking</Text>
      {rankingContent}
    </View>
  );
}

const homeStyles = {
  rankingRow: {
    justifyContent: 'flex-start',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  position: {
    width: 24,
    fontSize: 16,
    fontWeight: 'bold',
  },
};
