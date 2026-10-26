import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

/** Formulario de tarea: nombre, ícono y descripción (en ese orden).
 * Lo usan `TaskDetail` y `NewTask` (el PLANTEO dice que es idéntico).
 *
 * Es un componente CONTROLADO: no guarda estado propio. Recibe
 * - `values`: `{ name, icon, description }`
 * - `onChange(campo, valor)`: avisa al padre que cambió un campo
 * - `icons`: la lista de `/icons` (`[{ id, name, icon }]`)
 * - `error`: texto de validación (o null)
 */
export default function TaskForm({ values, onChange, icons, error }) {
  return (
    <ScrollView contentContainerStyle={styles.form}>
      <Text style={styles.label}>Name</Text>
      {/* En RN no hay onChange(event): onChangeText ya te da el string. */}
      <TextInput
        style={styles.input}
        value={values.name}
        onChangeText={(text) => onChange('name', text)}
        placeholder="Task name"
      />
      {error && <Text style={styles.error}>{error}</Text>}

      <Text style={styles.label}>Icon</Text>
      {/* No hay <select> en React Native: armamos una grilla de botones
          (Pressable) y marcamos el elegido con otro estilo. */}
      <View style={styles.icons}>
        {icons.map((item) => {
          const isSelected = item.icon === values.icon;
          return (
            <Pressable
              key={item.id ?? item.name}
              style={[styles.iconButton, isSelected && styles.iconSelected]}
              onPress={() => onChange('icon', item.icon)}
              accessibilityLabel={item.name}
            >
              <Text style={styles.iconText}>{item.icon}</Text>
            </Pressable>
          );
        })}
      </View>

      <Text style={styles.label}>Description</Text>
      <TextInput
        style={[styles.input, styles.multiline]}
        value={values.description}
        onChangeText={(text) => onChange('description', text)}
        placeholder="Description (optional)"
        multiline
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  form: {
    padding: 16,
    gap: 8,
  },
  label: {
    fontWeight: 'bold',
    marginTop: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    backgroundColor: '#fff',
  },
  multiline: {
    minHeight: 100,
    textAlignVertical: 'top', // en Android el texto arranca arriba
  },
  error: {
    color: '#b00020',
  },
  icons: {
    flexDirection: 'row',
    flexWrap: 'wrap', // que bajen de renglón cuando no entran
    gap: 6,
  },
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f2f2f2',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  iconSelected: {
    borderColor: '#1e6fd9',
    backgroundColor: '#dcebff',
  },
  iconText: {
    fontSize: 22,
  },
});
