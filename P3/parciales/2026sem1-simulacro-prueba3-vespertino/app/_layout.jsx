import { DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

/** Layout raíz: un Stack (pila de pantallas) con header.
 *
 * - "index" → app/index.jsx (`/`): el header tiene que decir "Bienvenido" y no
 *   "index" (que es lo que pone Expo Router si no le damos `title`).
 * - "game"  → app/game.jsx (`/game`): "Trivia Capitales". La flecha "atrás"
 *   de la izquierda la agrega el Stack solo, porque hay una pantalla anterior.
 * - "end"   → app/end.jsx (`/end`): resumen. Sin flecha atrás: la partida ya
 *   terminó, no tiene sentido volver al juego (se sale con "Nuevo juego").
 *   `headerLeft: () => null` borra la flecha en web, iOS y Android
 *   (`headerBackVisible: false` NO la saca en web).
 */
export default function RootLayout() {
  return (
    <ThemeProvider value={DefaultTheme}>
      <Stack>
        <Stack.Screen name="index" options={{ title: 'Bienvenido' }} />
        <Stack.Screen name="game" options={{ title: 'Trivia Capitales' }} />
        <Stack.Screen name="end" options={{ title: 'Trivia Capitales', headerLeft: () => null }} />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
