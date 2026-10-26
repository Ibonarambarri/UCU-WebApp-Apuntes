import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';

/** Muestra "cargando" o un error (con botón de reintentar).
 * Se usa en todas las pantallas para no repetir lo mismo.
 */
export default function StatusMessage({ isLoading, error, onRetry }) {
  if (isLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" />
        <Text style={styles.text}>Cargando...</Text>
      </View>
    );
  }
  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.error}>⚠️ {error.message}</Text>
        {onRetry && (
          <Pressable style={styles.button} onPress={onRetry}>
            <Text>Reintentar</Text>
          </Pressable>
        )}
      </View>
    );
  }
  return null;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    gap: 12,
  },
  text: {
    color: '#555',
  },
  error: {
    color: '#b00020',
    textAlign: 'center',
  },
  button: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: '#eee',
  },
});
