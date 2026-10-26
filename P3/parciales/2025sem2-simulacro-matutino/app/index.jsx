import { router } from 'expo-router';
import { useState } from 'react';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';
import { styles } from '../components/styles';

// Vista 1: Bienvenida (ruta /)
export default function Index() {
  // Input controlado: el texto vive en el estado.
  const [nombre, setNombre] = useState('');

  // Sin nombre no dejamos seguir.
  const nombreVacio = nombre.trim() === '';

  function continuar() {
    // Pasamos el nombre a /game como parámetro de la ruta.
    // Del otro lado se lee con useLocalSearchParams().
    router.push({ pathname: '/game', params: { nombre: nombre.trim() } });
  }

  return (
    <View style={styles.container}>
      <Text style={styles.titleText}>¿Quién va a jugar?</Text>
      <TextInput
        style={styles.input}
        placeholder="Ingrese su nombre"
        placeholderTextColor="#888"
        value={nombre}
        onChangeText={setNombre}
        // En el teclado del celular, "Enter" también continúa.
        onSubmitEditing={() => {
          if (!nombreVacio) {
            continuar();
          }
        }}
      />
      <TouchableOpacity
        style={nombreVacio ? styles.disabledButton : styles.primaryButton}
        disabled={nombreVacio}
        onPress={continuar}
      >
        <Text style={styles.buttonText}>Continuar</Text>
      </TouchableOpacity>
    </View>
  );
}
