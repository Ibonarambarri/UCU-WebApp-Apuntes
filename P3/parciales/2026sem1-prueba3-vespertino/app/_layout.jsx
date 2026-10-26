import { DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

/** Layout raíz: un Stack (pila de pantallas) con un header arriba.
 *
 * Cada <Stack.Screen name="..."> corresponde a un archivo dentro de app/:
 * - "index"          → app/index.jsx          (ruta `/`)
 * - "groups/[letter]" → app/groups/[letter].jsx (ruta `/groups/H`)
 * - "teams/[code]"    → app/teams/[code].jsx    (ruta `/teams/URU`)
 *
 * El `title` es lo que se ve en el header. Sin él, Expo Router pone el nombre
 * del archivo ("index"), que es justo lo que el enunciado NO quiere.
 * La flecha "atrás" de la esquina izquierda la pone el Stack solo cuando hay
 * una pantalla anterior en la pila.
 */
export default function RootLayout() {
  return (
    <ThemeProvider value={DefaultTheme}>
      <Stack>
        <Stack.Screen name="index" options={{ title: 'Bienvenido' }} />
        <Stack.Screen name="groups/[letter]" options={{ title: 'Figuritas del Mundial' }} />
        <Stack.Screen name="teams/[code]" options={{ title: 'Figuritas del Mundial' }} />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
