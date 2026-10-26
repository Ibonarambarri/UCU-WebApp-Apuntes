import { useCallback, useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { Stack, useFocusEffect, useRouter } from 'expo-router';
import { useFetchTasks } from '../lib/api';
import { STATUSES, STATUS_KEYS } from '../lib/status';
import StatusMessage from '../components/StatusMessage';

/** Home: lista de tareas + filtro por estado. */
export default function Home() {
  const router = useRouter();
  const { data: tasks, error, isLoading, reload } = useFetchTasks();
  // null = sin filtro (mostrar todas). Si no, 'pending' | 'blocked' | 'completed'.
  const [filter, setFilter] = useState(null);

  // Cada vez que la pantalla vuelve a estar visible (por ejemplo al volver de
  // crear o de cambiar el estado de una tarea) recargamos la lista.
  // En un Stack la Home NO se desmonta al ir a otra pantalla, así que su
  // useEffect([]) no se vuelve a ejecutar: por eso hace falta useFocusEffect.
  useFocusEffect(
    useCallback(() => {
      reload();
    }, [reload]),
  );

  /** Si tocás el filtro que ya está activo se quita; si no, se aplica. */
  function handleFilterPress(status) {
    if (filter === status) {
      setFilter(null);
    } else {
      setFilter(status);
    }
  }

  // Dato derivado: se calcula en cada render, no se guarda en otro estado.
  let visibleTasks = [];
  if (tasks) {
    visibleTasks = filter ? tasks.filter((task) => task.status === filter) : tasks;
  }

  return (
    <View style={styles.container}>
      {/* Encabezado: título + botón "+" a la derecha */}
      <Stack.Screen
        options={{
          title: 'Tasks List',
          headerRight: () => (
            <Pressable style={styles.addButton} onPress={() => router.push('/tasks/new')}>
              <Text style={styles.addText}>+</Text>
            </Pressable>
          ),
        }}
      />

      {/* Cuerpo */}
      {!tasks && (isLoading || error) ? (
        <StatusMessage isLoading={isLoading} error={error} onRetry={reload} />
      ) : (
        <FlatList
          data={visibleTasks}
          keyExtractor={(task) => String(task.id)}
          contentContainerStyle={styles.list}
          ListEmptyComponent={<Text style={styles.empty}>No tasks.</Text>}
          renderItem={({ item }) => (
            <Pressable
              // El color de fondo depende del estado. Si viniera un estado raro
              // usamos blanco para que no explote.
              style={[styles.item, { backgroundColor: STATUSES[item.status]?.color ?? '#fff' }]}
              onPress={() => router.push(`/tasks/${item.id}`)}
            >
              <Text style={styles.itemIcon}>{item.icon}</Text>
              <Text style={styles.itemName}>{item.name}</Text>
            </Pressable>
          )}
        />
      )}

      {/* Pie: un botón por estado */}
      <View style={styles.footer}>
        {STATUS_KEYS.map((status) => (
          <Pressable
            key={status}
            style={[styles.filterButton, filter === status && styles.filterActive]}
            onPress={() => handleFilterPress(status)}
            accessibilityLabel={`Filter ${STATUSES[status].label}`}
          >
            <Text style={styles.filterText}>{STATUSES[status].emoji}</Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fafafa',
  },
  addButton: {
    paddingHorizontal: 14,
  },
  addText: {
    fontSize: 28,
    color: '#1e6fd9',
  },
  list: {
    padding: 12,
    gap: 8,
  },
  item: {
    flexDirection: 'row', // ícono y nombre en la misma fila
    alignItems: 'center',
    gap: 12,
    padding: 14,
    borderRadius: 10,
  },
  itemIcon: {
    fontSize: 24,
  },
  itemName: {
    fontSize: 16,
    flexShrink: 1, // si el nombre es largo, que baje de renglón
  },
  empty: {
    textAlign: 'center',
    color: '#777',
    marginTop: 24,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    backgroundColor: '#fff',
  },
  filterButton: {
    paddingVertical: 8,
    paddingHorizontal: 22,
    borderRadius: 10,
  },
  filterActive: {
    backgroundColor: '#dcebff',
  },
  filterText: {
    fontSize: 24,
  },
});
