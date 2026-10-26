import { Text, View } from 'react-native';
import { Stack, useLocalSearchParams } from 'expo-router';
import { styles } from '@/common/styles';

export default function Game() {
  const { id } = useLocalSearchParams();

  // TODO Partida: los dos países, la pregunta según el `stat` de la ronda,
  // botones Más y Menos
  // (POST /api/games/:id/guess), resultado de cada ronda y fin de la partida.
  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: `Partida ${id}` }} />
      <Text style={styles.normalText}>Pendiente de implementar.</Text>
    </View>
  );
}
