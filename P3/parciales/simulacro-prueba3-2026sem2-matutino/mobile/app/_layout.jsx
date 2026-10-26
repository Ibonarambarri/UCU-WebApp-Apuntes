import { DefaultTheme, Stack, ThemeProvider } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

export default function RootLayout() {
  return (
    <ThemeProvider value={DefaultTheme}>
      <Stack>
        <Stack.Screen name="index" options={{ title: 'Higher / Lower' }} />
        <Stack.Screen name="games/[id]" options={{ title: 'Partida' }} />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
