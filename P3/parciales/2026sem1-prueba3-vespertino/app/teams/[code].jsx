import { Image } from 'expo-image';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import StatusMessage from '@/components/StatusMessage';
import { useFetchTeam } from '@/hooks/useFetchTeam';
import { fetchJSON } from '@/common/fetch';
import { expoDevServerUri } from '@/common/utils';
import { styles } from '@/common/styles';

/** Ruta `/teams/:code` — estado del álbum de un equipo.
 *
 * - GET /api/teams/:code trae los datos del equipo + `stickers` (20 booleanos).
 * - Cada vez que el usuario marca/desmarca algo mandamos un PATCH con la
 *   lista COMPLETA de figuritas nueva, y nos quedamos con lo que responde la
 *   API (así la pantalla siempre muestra lo que quedó guardado de verdad).
 */
export default function Team() {
  const router = useRouter();
  const { code } = useLocalSearchParams();
  const { data: team, setData: setTeam, isLoading, error, refetch } = useFetchTeam(code);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState(null);

  // Manda la lista nueva a la API y actualiza la pantalla con la respuesta.
  async function saveStickers(newStickers) {
    setIsSaving(true);
    setSaveError(null);
    try {
      const updatedTeam = await fetchJSON(`/api/teams/${encodeURIComponent(code)}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stickers: newStickers }),
      });
      setTeam(updatedTeam);
    } catch (err) {
      setSaveError(err);
    } finally {
      setIsSaving(false);
    }
  }

  // Marcar/desmarcar UNA figurita. Copiamos el array con map (nunca
  // modificar el estado directamente) y damos vuelta sólo la posición tocada.
  function toggleSticker(index) {
    const newStickers = team.stickers.map((hasSticker, i) => (i === index ? !hasSticker : hasSticker));
    saveStickers(newStickers);
  }

  // Botones "Todas" / "Ninguna": misma cantidad de figuritas, todas en true o false.
  function setAllStickers(value) {
    const newStickers = team.stickers.map(() => value);
    saveStickers(newStickers);
  }

  if (isLoading) {
    return <StatusMessage isLoading text="Cargando equipo..." />;
  }

  if (error) {
    return (
      <View style={styles.container}>
        {error.status === 404
          ? <StatusMessage error={error} text={`No existe el equipo ${code}`} />
          : <StatusMessage error={error} text={`No se pudo cargar el equipo ${code}`} onRetry={refetch} />}
        <TouchableOpacity style={styles.primaryButton} onPress={() => router.dismissTo('/')}>
          <Text style={styles.buttonText}>Volver al inicio</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!team) {
    return null;
  }

  // Estado derivado: se calcula en cada render a partir de `team`, no hace
  // falta un useState aparte para esto.
  const pastedCount = team.stickers.filter((hasSticker) => hasSticker).length;

  return (
    <ScrollView contentContainerStyle={styles.scrollContent}>
      <Text style={styles.titleText}>Equipo: {team.name}</Text>

      <View style={styles.teamHeader}>
        <Image
          source={{ uri: expoDevServerUri(`/static/flags/${team.code}.png`) }}
          style={styles.flagImage}
          contentFit="contain"
        />
        <View style={styles.teamInfo}>
          <Text style={styles.normalText}>Código: {team.code}</Text>
          <Text style={styles.normalText}>Grupo: {team.group}</Text>
          <Text style={styles.normalText}>Continente: {team.continent}</Text>
          <Text style={styles.normalText}>Confederación: {team.confed}</Text>
        </View>
      </View>

      <Text style={styles.sectionTitle}>
        Figuritas: {pastedCount} de {team.stickers.length}
      </Text>
      {isSaving && <Text style={styles.normalText}>Guardando...</Text>}
      {saveError && <Text style={styles.errorText}>No se pudo guardar: {saveError.message}</Text>}

      <View style={styles.flagGrid}>
        {team.stickers.map((hasSticker, index) => (
          <TouchableOpacity
            // El índice como key está bien acá: la lista siempre tiene 20
            // elementos y nunca se reordena ni se borran posiciones.
            key={index}
            style={[styles.flagGridItem, hasSticker && styles.flagGridItemSelected]}
            disabled={isSaving}
            onPress={() => toggleSticker(index)}
          >
            {/* Las figuritas se numeran desde 1, los índices desde 0. */}
            <Text style={styles.stickerNumber}>{index + 1}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.row}>
        <TouchableOpacity
          style={[styles.halfButton, isSaving && styles.disabledButton]}
          disabled={isSaving}
          onPress={() => setAllStickers(true)}
        >
          <Text style={styles.buttonText}>Todas</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.halfButton, isSaving && styles.disabledButton]}
          disabled={isSaving}
          onPress={() => setAllStickers(false)}
        >
          <Text style={styles.buttonText}>Ninguna</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={[styles.primaryButton, styles.centered]}
        // Volver a la vista del grupo de ESTE equipo (lo sabemos por team.group).
        onPress={() => router.dismissTo(`/groups/${team.group}`)}
      >
        <Text style={styles.buttonText}>Volver</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
