import { ActivityIndicator, Text, TouchableOpacity, View } from 'react-native';
import { styles } from '@/common/styles';

/** Cartel reutilizable para los estados de un pedido.
 *
 * - Con `isLoading` muestra la ruedita + el texto.
 * - Con `error` muestra el texto en rojo y, si nos pasan `onRetry`, un botón
 *   "Reintentar" (que normalmente es el `refetch` del hook).
 */
export default function StatusMessage({ text, isLoading = false, error = null, onRetry = null }) {
  return (
    <View style={styles.statusBox}>
      {isLoading && <ActivityIndicator size="large" color="#000099" />}
      <Text style={error ? styles.errorText : styles.normalText}>
        {text}
        {error ? ` (${error.message})` : ''}
      </Text>
      {error && onRetry && (
        <TouchableOpacity style={styles.secondaryButton} onPress={onRetry}>
          <Text style={styles.buttonText}>Reintentar</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}
