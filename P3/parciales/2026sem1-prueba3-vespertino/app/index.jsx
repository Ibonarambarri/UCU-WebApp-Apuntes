import { Link } from 'expo-router';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import StatusMessage from '@/components/StatusMessage';
import { useFetchGroups } from '@/hooks/useFetchGroups';
import { styles } from '@/common/styles';

/** Ruta `/` — Bienvenida con un botón por cada grupo del mundial.
 *
 * Los grupos NO están escritos a mano ("A".."L"): se piden a la API
 * (`GET /api/groups`), así si mañana hay más grupos aparecen solos.
 */
export default function Home() {
  const { data: groups, isLoading, error, refetch } = useFetchGroups();

  return (
    <ScrollView contentContainerStyle={styles.scrollContent}>
      <Text style={styles.titleText}>Figuritas del Mundial</Text>
      <Text style={styles.sectionTitle}>Grupos:</Text>

      {isLoading && <StatusMessage isLoading text="Cargando grupos..." />}
      {error && <StatusMessage error={error} text="No se pudieron cargar los grupos" onRetry={refetch} />}

      {groups && (
        <View style={styles.groupGrid}>
          {groups.map((letter) => (
            // <Link asChild> le "pasa" la navegación al hijo (el botón):
            // al tocarlo navega a /groups/A, /groups/B, etc.
            <Link key={letter} href={`/groups/${letter}`} asChild>
              <TouchableOpacity style={styles.groupButton}>
                <Text style={styles.buttonText}>Grupo {letter}</Text>
              </TouchableOpacity>
            </Link>
          ))}
        </View>
      )}
    </ScrollView>
  );
}
