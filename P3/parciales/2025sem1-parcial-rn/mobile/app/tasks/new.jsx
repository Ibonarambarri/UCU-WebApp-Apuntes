import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { createTask, useFetchIcons } from '../../lib/api';
import { goBackOrHome } from '../../lib/navigation';
import StatusMessage from '../../components/StatusMessage';
import TaskForm from '../../components/TaskForm';

/** NewTask: `/tasks/new`. Mismo formulario que TaskDetail + Create/Cancel. */
export default function NewTask() {
  const router = useRouter();
  const { data: icons, error: iconsError, isLoading: iconsLoading, reload } = useFetchIcons();

  // `icon` arranca vacío: mientras no elijan uno usamos el primero de la
  // lista (lo calculamos abajo), porque los íconos llegan DESPUÉS del primer render.
  const [values, setValues] = useState({ name: '', icon: '', description: '' });
  const [validationError, setValidationError] = useState(null);
  const [saveError, setSaveError] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  function handleChange(field, value) {
    setValues((previous) => ({ ...previous, [field]: value }));
  }

  // Ícono por defecto = el primero de /icons (lo dice el PLANTEO).
  const defaultIcon = icons && icons.length > 0 ? icons[0].icon : '';
  const formValues = { ...values, icon: values.icon || defaultIcon };

  async function handleCreate() {
    // Validación: el nombre no puede estar vacío (ni ser solo espacios).
    if (formValues.name.trim() === '') {
      setValidationError('The name can not be empty.');
      return;
    }
    setValidationError(null);
    setSaveError(null);
    setIsSaving(true);
    try {
      await createTask({
        icon: formValues.icon,
        name: formValues.name.trim(),
        description: formValues.description,
        status: 'pending', // toda tarea nueva arranca en pending
      });
      // Volvemos a la Home; su useFocusEffect recarga la lista.
      goBackOrHome(router);
    } catch (error) {
      setSaveError(error.message);
      setIsSaving(false);
    }
  }

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: 'Task Details' }} />

      {iconsLoading || iconsError || !icons ? (
        <StatusMessage isLoading={iconsLoading} error={iconsError} onRetry={reload} />
      ) : (
        <View style={styles.body}>
          <TaskForm values={formValues} onChange={handleChange} icons={icons} error={validationError} />
        </View>
      )}
      {saveError && <Text style={styles.error}>⚠️ {saveError}</Text>}

      {/* Pie: crear y cancelar */}
      <View style={styles.footer}>
        <Pressable
          style={[styles.button, styles.primary, (isSaving || !icons) && styles.disabled]}
          onPress={handleCreate}
          disabled={isSaving || !icons}
        >
          <Text style={styles.primaryText}>{isSaving ? 'Creating...' : 'Create'}</Text>
        </Pressable>
        <Pressable style={styles.button} onPress={() => goBackOrHome(router)}>
          <Text style={styles.buttonText}>Cancel</Text>
        </Pressable>
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
    flex: 1,
  },
  error: {
    color: '#b00020',
    textAlign: 'center',
    padding: 8,
  },
  footer: {
    flexDirection: 'row',
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
  primary: {
    backgroundColor: '#1e6fd9',
  },
  primaryText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  buttonText: {
    fontSize: 16,
  },
  disabled: {
    opacity: 0.5,
  },
});
