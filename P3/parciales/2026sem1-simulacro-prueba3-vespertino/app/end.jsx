import { useLocalSearchParams, useRouter } from 'expo-router';
import { Text, TouchableOpacity, View } from 'react-native';
import { styles } from '@/common/styles';

/** Ruta `/end?hits=9&errors=3` — resumen de la partida.
 *
 * Los resultados llegan como parámetros de la URL (strings) → Number().
 * Si alguien entra directo a /end sin params, Number(undefined) es NaN, así
 * que usamos `|| 0` para mostrar 0.
 */
export default function End() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const hits = Number(params.hits) || 0;
  const errors = Number(params.errors) || 0;
  const attempts = hits + errors; // derivado: cada intento es acierto o error.

  return (
    <View style={styles.container}>
      <Text style={styles.titleText}>Fin del juego</Text>
      <Text style={styles.normalText}>Luego de {attempts} intentos,</Text>
      <Text style={styles.normalText}>- acertaste {hits} {hits === 1 ? 'vez' : 'veces'}</Text>
      <Text style={styles.normalText}>- erraste {errors} {errors === 1 ? 'vez' : 'veces'}</Text>

      <TouchableOpacity
        style={styles.primaryButton}
        // dismissTo('/'): saca pantallas de la pila hasta llegar a `/`.
        // Si `/` no estaba (entraron directo por URL a /end), la reemplaza.
        onPress={() => router.dismissTo('/')}
      >
        <Text style={styles.buttonText}>Nuevo juego</Text>
      </TouchableOpacity>
    </View>
  );
}
