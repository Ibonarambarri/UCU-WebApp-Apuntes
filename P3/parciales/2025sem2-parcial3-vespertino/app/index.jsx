import { router } from 'expo-router';
import { useState } from 'react';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';
import { styles } from '../components/styles';

// Los tres niveles: texto del botón y cuántas preguntas hay que contestar
// bien para ganar. Las vidas son siempre 3 (eso lo maneja la pantalla /game).
const NIVELES = [
  { texto: 'Nivel fácil, 6 preguntas', preguntas: 6 },
  { texto: 'Nivel medio, 9 preguntas', preguntas: 9 },
  { texto: 'Nivel difícil, 12 preguntas', preguntas: 12 },
];

// Vista 1: Bienvenida (ruta /)
export default function Index() {
  // Input controlado: el texto vive en el estado.
  const [nombre, setNombre] = useState('');

  // Sin nombre no dejamos empezar.
  const nombreVacio = nombre.trim() === '';

  function empezar(preguntas) {
    // Mandamos nombre y meta de preguntas como parámetros de la ruta.
    // En /game se leen con useLocalSearchParams() (llegan como TEXTO).
    router.push({
      pathname: '/game',
      params: { nombre: nombre.trim(), preguntas: preguntas },
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
          key={nivel.preguntas}
          style={nombreVacio ? styles.disabledButton : styles.primaryButton}
          disabled={nombreVacio}
          onPress={() => empezar(nivel.preguntas)}
        >
          <Text style={styles.buttonText}>{nivel.texto}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}
