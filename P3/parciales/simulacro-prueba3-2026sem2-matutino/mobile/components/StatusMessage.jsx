import { ActivityIndicator, Text, View } from 'react-native';
import { styles } from '@/common/styles';
import Button from './Button';

/** Mensajes de estado reutilizables:
 * - `<StatusMessage loading text="Cargando…" />`
 * - `<StatusMessage error={error} text="No se pudo…" onRetry={refetch} />`
 */
export default function StatusMessage({ loading, error, text, onRetry }) {
  if (loading) {
    return (
      <View style={styles.row}>
        <ActivityIndicator />
        <Text style={styles.normalText}>{text ?? 'Cargando…'}</Text>
      </View>
    );
  }
  return (
    <View style={{ gap: 10, alignItems: 'flex-start' }}>
      <Text style={error ? styles.errorText : styles.normalText}>
        {text}
        {error?.status ? ` (error ${error.status})` : ''}
      </Text>
      {onRetry && <Button title="Reintentar" onPress={onRetry} />}
    </View>
  );
}
