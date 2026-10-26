import { Image } from 'expo-image';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ScrollView, Text, TouchableOpacity } from 'react-native';
import StatusMessage from '@/components/StatusMessage';
import { useFetchGroup } from '@/hooks/useFetchGroups';
import { expoDevServerUri } from '@/common/utils';
import { styles } from '@/common/styles';

/** Ruta `/groups/:letter` — los 4 equipos de un grupo.
 *
 * El nombre del archivo `[letter].jsx` (con corchetes) es una ruta DINÁMICA:
 * `/groups/H` hace que `useLocalSearchParams()` devuelva `{ letter: 'H' }`.
 */
export default function Group() {
  const router = useRouter();
  const { letter } = useLocalSearchParams();
  const { data: teams, isLoading, error, refetch } = useFetchGroup(letter);

  return (
    <ScrollView contentContainerStyle={styles.scrollContent}>
      <Text style={styles.titleText}>Grupo {letter}</Text>
      <Text style={styles.sectionTitle}>Equipos:</Text>

      {isLoading && <StatusMessage isLoading text="Cargando equipos..." />}
      {error && <StatusMessage error={error} text="No se pudieron cargar los equipos" onRetry={refetch} />}
      {/* Caso borde: /groups/Z (grupo que no existe) → la lista filtrada queda vacía. */}
      {teams && teams.length === 0 && (
        <Text style={styles.errorText}>No existe el grupo {letter}</Text>
      )}

      {teams && teams.map((team) => (
        <TouchableOpacity
          key={team.code}
          style={styles.teamButton}
          // router.push agrega la pantalla del equipo arriba de la pila.
          onPress={() => router.push(`/teams/${team.code}`)}
        >
          <Image
            source={{ uri: expoDevServerUri(`/static/flags/${team.code}.png`) }}
            style={styles.smallFlag}
            contentFit="contain"
          />
          <Text style={styles.teamButtonText}>{team.name}</Text>
        </TouchableOpacity>
      ))}

      <TouchableOpacity
        style={[styles.primaryButton, styles.centered]}
        // dismissTo('/') vuelve sacando pantallas de la pila hasta llegar a `/`.
        // Si `/` no está en la pila (entraron directo por URL), la reemplaza.
        // Con router.push('/') en cambio se apilaría OTRA bienvenida encima.
        onPress={() => router.dismissTo('/')}
      >
        <Text style={styles.buttonText}>Volver</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
