import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { updateTask, useFetchIcons, useFetchTask } from '../../lib/api';
import { STATUSES, STATUS_KEYS } from '../../lib/status';
import { goBackOrHome } from '../../lib/navigation';
import StatusMessage from '../../components/StatusMessage';
import TaskForm from '../../components/TaskForm';

/** TaskDetail: `/tasks/:id`. Formulario con los datos de la tarea y botones
 * para cambiarle el estado.
 */
export default function TaskDetail() {
  // `[id]` en el nombre del archivo → `id` en los params (siempre string).
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { data: task, error: taskError, isLoading: taskLoading, reload } = useFetchTask(id);
  const { data: icons, error: iconsError, isLoading: iconsLoading } = useFetchIcons();

  // Copia editable de los campos (estado del formulario controlado).
  const [values, setValues] = useState({ name: '', icon: '', description: '' });
  // Estado actual de la tarea (lo actualizamos después de cada PATCH).
  const [status, setStatus] = useState(null);
  const [validationError, setValidationError] = useState(null);
  const [saveError, setSaveError] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  // Cuando llega la tarea del backend, "cargamos" el formulario con sus datos.
  useEffect(() => {
    if (task) {
      setValues({
        name: task.name ?? '',
        icon: task.icon ?? '',
        description: task.description ?? '',
      });
      setStatus(task.status);
    }
  }, [task]);

  function handleChange(field, value) {
    // Copiamos el objeto y pisamos solo el campo que cambió (inmutabilidad).
    setValues((previous) => ({ ...previous, [field]: value }));
  }

  async function handleChangeStatus(newStatus) {
    if (values.name.trim() === '') {
      setValidationError('The name can not be empty.');
      return;
    }
    setValidationError(null);
    setSaveError(null);
    setIsSaving(true);
    try {
      // El PLANTEO pide PATCH con el estado. Mandamos también los campos del
      // formulario para no perder lo que el usuario haya editado
      // (PATCH solo pisa los campos que mandás, el resto queda igual).
      const updated = await updateTask(id, { ...values, name: values.name.trim(), status: newStatus });
      setStatus(updated.status);
    } catch (error) {
      setSaveError(error.message);
    } finally {
      setIsSaving(false);
    }
  }

  // Encabezado: título + cruz para cerrar. Lo ponemos en todos los casos
  // (cargando, error o datos) para que siempre se pueda volver.
  const header = (
    <Stack.Screen
      options={{
        title: 'Task Details',
        // Sacamos la flecha de volver: se cierra con la cruz.
        // (headerBackVisible alcanza en el celular; en la web hace falta headerLeft.)
        headerBackVisible: false,
        headerLeft: () => null,
        headerRight: () => (
          <Pressable style={styles.closeButton} onPress={() => goBackOrHome(router)}>
            <Text style={styles.closeText}>✕</Text>
          </Pressable>
        ),
      }}
    />
  );

  if (taskLoading || iconsLoading || taskError || iconsError || !task || !icons) {
    return (
      <View style={styles.container}>
        {header}
        <StatusMessage
          isLoading={taskLoading || iconsLoading}
          error={taskError ?? iconsError}
          onRetry={reload}
        />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: STATUSES[status]?.color ?? '#fafafa' }]}>
      {header}

      {/* Cuerpo */}
      <View style={styles.body}>
        <TaskForm values={values} onChange={handleChange} icons={icons} error={validationError} />
      </View>
      {saveError && <Text style={styles.error}>⚠️ {saveError}</Text>}

      {/* Pie: los dos estados que NO son el actual */}
      <View style={styles.footer}>
        {STATUS_KEYS.filter((key) => key !== status).map((key) => (
          <Pressable
            key={key}
            style={[styles.button, isSaving && styles.disabled]}
            onPress={() => handleChangeStatus(key)}
            disabled={isSaving}
          >
            <Text style={styles.buttonText}>
              {STATUSES[key].emoji} {STATUSES[key].label}
            </Text>
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
  body: {
    flex: 1, // ocupa todo el espacio y empuja el pie hacia abajo
  },
  closeButton: {
    paddingHorizontal: 14,
  },
  closeText: {
    fontSize: 22,
  },
  error: {
    color: '#b00020',
    textAlign: 'center',
    padding: 8,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 12,
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    backgroundColor: '#fff',
  },
  button: {
    flex: 1,
    alignItems: 'center',
    padding: 12,
    borderRadius: 10,
    backgroundColor: '#eee',
  },
  disabled: {
    opacity: 0.5,
  },
  buttonText: {
    fontSize: 16,
  },
});
