import { Stack } from 'expo-router';

/** Layout raíz: un Stack (pila de pantallas, como en el celular: entrar a
 * una pantalla la "apila" y volver la saca).
 *
 * Cada pantalla define su propio título y botones del encabezado con
 * `<Stack.Screen options={...} />` adentro de su archivo.
 * Rutas (por nombre de archivo dentro de `app/`):
 * - `index.jsx`        → `/`            Home (lista de tareas)
 * - `tasks/new.jsx`    → `/tasks/new`   NewTask
 * - `tasks/[id].jsx`   → `/tasks/3`     TaskDetail (`[id]` = parámetro)
 * `tasks/new` le gana a `tasks/[id]`: las rutas fijas tienen prioridad sobre
 * las dinámicas.
 */
export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: 'Tasks List' }} />
      <Stack.Screen name="tasks/[id]" options={{ title: 'Task Details' }} />
      <Stack.Screen name="tasks/new" options={{ title: 'Task Details' }} />
    </Stack>
  );
}
