import { router } from 'expo-router';
import { useState } from 'react';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';
import { styles } from '../components/styles';

// Los tres niveles: texto del botón y cantidad de vidas que da cada uno.
// Lo dejamos en un array para no repetir 3 veces el mismo botón.
const NIVELES = [
  { texto: 'Nivel fácil, 9 vidas', vidas: 9 },
  { texto: 'Nivel medio, 6 vidas', vidas: 6 },
  { texto: 'Nivel difícil, 3 vidas', vidas: 3 },
];

// Vista 1: Bienvenida (ruta /)
export default function Index() {
  // Input controlado: el texto vive en el estado.
  const [nombre, setNombre] = useState('');

  // Sin nombre no dejamos empezar (si no, en el juego diría ": ❤️❤️...").
  const nombreVacio = nombre.trim() === '';

  function empezar(vidas) {
    // Pasamos el nombre y las vidas a la pantalla /game como parámetros
    // de la ruta. Del otro lado se leen con useLocalSearchParams().
    // OJO: llegan como TEXTO ('9'), no como número.
    router.push({
      pathname: '/game',
      params: { nombre: nombre.trim(), vidas: vidas },
    });
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
      />

      {nombreVacio && (
        <Text style={styles.normalText}>Escribí tu nombre para empezar.</Text>
      )}

      {NIVELES.map((nivel) => (
        <TouchableOpacity
          key={nivel.vidas}
          style={nombreVacio ? styles.disabledButton : styles.primaryButton}
          disabled={nombreVacio}
          onPress={() => empezar(nivel.vidas)}
        >
          <Text style={styles.buttonText}>{nivel.texto}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}
