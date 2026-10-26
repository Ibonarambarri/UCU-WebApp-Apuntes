import { DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

// La plantilla traía `unstable_settings = { anchor: '(tabs)' }`, que es de la
// plantilla de Expo con pestañas. Acá no hay carpeta (tabs), así que lo sacamos.

export default function RootLayout() {
  return (
    <ThemeProvider value={DefaultTheme}>
      {/* Stack = pila de pantallas. Cada Stack.Screen tiene el `name` del
          archivo dentro de app/ (sin la extensión):
          - app/index.jsx -> name="index"  (ruta /)
          - app/game.jsx  -> name="game"   (ruta /game)
          El `title` es lo que se ve en el header de navegación. */}
      <Stack>
        <Stack.Screen name="index" options={{ title: 'Bienvenido' }} />
        {/* Como game se apila ENCIMA de index, el Stack pone solo el botón
            de "atrás" (back button) en la esquina izquierda. */}
        <Stack.Screen name="game" options={{ title: 'Trivia de Países' }} />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
