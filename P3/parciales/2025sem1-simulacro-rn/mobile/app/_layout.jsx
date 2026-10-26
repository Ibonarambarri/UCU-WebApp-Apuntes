import { Stack } from 'expo-router';

/** Layout raíz: Stack (pila de pantallas).
 * - `index.jsx`      → `/`          Comidas (resumen de stock y precios)
 * - `foods/[id].jsx` → `/foods/3`   Detalle de órdenes de una comida
 * El título del detalle depende de la comida, así que lo pone la propia
 * pantalla con `<Stack.Screen options={{ title }} />`.
 */
export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: 'Comidas' }} />
      <Stack.Screen name="foods/[id]" options={{ title: 'Detalle' }} />
    </Stack>
  );
}
