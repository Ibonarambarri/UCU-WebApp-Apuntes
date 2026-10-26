import { Text, TouchableOpacity, View } from 'react-native';
import { useRouter } from 'expo-router';
import { DIFFICULTIES } from '@/common/game';
import { styles } from '@/common/styles';

/** Ruta `/` — Bienvenida: elegir la dificultad.
 *
 * Los tres botones van a la MISMA ruta (/game); lo que cambia es el parámetro
 * `maxErrors` que viaja en la URL: /game?maxErrors=8, /game?maxErrors=5, ...
 * La pantalla del juego lo lee con useLocalSearchParams.
 */
export default function Home() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.titleText}>Elija la dificultad del juego:</Text>

      {DIFFICULTIES.map((difficulty) => (
        <TouchableOpacity
          key={difficulty.key}
          style={styles.difficultyButton}
          onPress={() => router.push({
            pathname: '/game',
            params: { maxErrors: difficulty.maxErrors },
          })}
        >
          <Text style={styles.buttonText}>{difficulty.label}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}
