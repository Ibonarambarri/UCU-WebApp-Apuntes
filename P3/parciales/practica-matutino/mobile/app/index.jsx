import { Text, View } from 'react-native';
import { styles } from '@/common/styles';

export default function Home() {
  // TODO Nombre del jugador, botón Jugar (POST /api/games) y ranking
  // (GET /api/ranking).
  return (
    <View style={styles.container}>
      <Text style={styles.titleText}>Higher / Lower</Text>
      <Text style={styles.normalText}>Pendiente de implementar.</Text>
    </View>
  );
}
