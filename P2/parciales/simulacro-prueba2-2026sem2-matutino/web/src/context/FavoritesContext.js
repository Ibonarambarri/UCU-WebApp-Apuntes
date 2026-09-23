import { createContext, useContext } from 'react';

/** Contexto de favoritos. El Provider está en FavoritesProvider.jsx.
 *
 * ¿Por qué en dos archivos? La regla de lint `react-refresh/only-export-components`
 * avisa si un archivo .jsx exporta un componente Y otra cosa (un hook, un
 * contexto). Separándolos, `npm run lint` queda sin advertencias.
 */
export const FavoritesContext = createContext(null);

/** Atajo para leer el contexto desde cualquier componente. */
export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites debe usarse dentro de <FavoritesProvider>');
  }
  return context;
}
