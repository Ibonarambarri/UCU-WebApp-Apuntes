# Tema 16 — Context: estado compartido entre páginas

## 16.1 Tres problemas que resuelve

1. **Prop drilling**: `App` → `Panel` (no la usa, solo la pasa) → `Saludo`. Con Context el nieto
   lee directo (`Ejers/UT4/TA12-contexto-usuario/src/componentes/Panel.jsx` no recibe props).
2. **Estado que se pierde al cambiar de ruta**: al desmontarse una página su `useState` se borra
   (tema 7.7). Trivia 2025: puntaje en `Home` → ir a `/country/URY` → volvía a 0. Un Provider
   **por encima de `<Routes>`** nunca se desmonta.
3. **Una sola fuente de verdad**: favoritos del matutino en barra + listado + detalle. Con un
   `useFetch` en cada uno, cada cual tendría su copia (tema 12.8) y la barra no se enteraría.

**Cuándo NO:** si lo usa una sola página → hook/estado local. Context **no reemplaza** props
(una `CountryCard` sigue recibiendo `country`).

## 16.2 Emisor y receptores

```
                 <FavoritesProvider>          ← tiene el estado y lo transmite
                /        |          \
           Layout   PageCountryList  PageCountry
      useFavorites()  useFavorites()  useFavorites()   ← cualquiera, a cualquier profundidad
```
1. `createContext` → el canal. 2. **Provider** → componente con el estado, envuelve con `children`.
3. `useContext` → leer.

## 16.3 Receta (dos archivos)

```js
// context/FavoritesContext.js
import { createContext, useContext } from 'react';
export const FavoritesContext = createContext(null);
export function useFavorites() {
  return useContext(FavoritesContext);
}
```
```jsx
// context/FavoritesProvider.jsx
export default function FavoritesProvider({ children }) {
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    fetchJSON('/api/favorites').then(setFavorites);
  }, []);

  async function toggleFavorite(code) {
    if (favorites.some((f) => f.code === code)) {
      await fetchJSON(`/api/favorites/${code}`, { method: 'DELETE' });
      setFavorites((list) => list.filter((f) => f.code !== code));
    } else {
      const nuevo = await fetchJSON('/api/favorites', { method: 'PUT', body: { code } });
      setFavorites((list) => [...list, nuevo]);
    }
  }

  const value = { favorites, toggleFavorite };
  return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>;
}
```
```jsx
// App.jsx
<FavoritesProvider>
  <BrowserRouter><Routes>…</Routes></BrowserRouter>
</FavoritesProvider>

// cualquier componente
const { favorites, toggleFavorite } = useFavorites();
```
El Provider es un **componente normal** (useState, useEffect, fetchJSON). Lo nuevo: `<X.Provider value>` + `useContext`.

⚠️ **Dos archivos** por el lint `react-refresh/only-export-components` (un `.jsx` no puede exportar
componente + contexto/hook). En parciales viejos se toleraba el warning o se apagaba con
`// eslint-disable-next-line react-refresh/only-export-components`; en 2026sem2 el lint debe quedar limpio.

**Valor por defecto:** `createContext(null)` → si alguien consume **sin** Provider explota rápido
(*"Cannot read properties of null"*), lo cual avisa. Con la misma forma (`{ tasks: [], setTasks: () => {} }`)
no explota. Los dos criterios aparecen en parciales.

## 16.4 Dónde va el Provider

**Debe envolver a todos los que lo usan. Un componente no puede leer un contexto que él mismo dibuja.**

| Situación | Dónde | Ejemplo |
|---|---|---|
| Lo usan varias rutas (caso examen) | por encima de `<Routes>` en `App.jsx` | 2026sem2 `components/App/App.jsx` |
| `App` también lo lee | `main.jsx`, envolviendo `<App />` | Trello / BarApp 2026sem1, UT5.1.2 |
| El Provider usa `useNavigate` | **dentro** del `BrowserRouter` | — |
| Solo lo usan hijos de App | en el `return` de App | TA13 |

⚠️ Mal ubicado → `useContext` da el default (`null`) → *"Cannot read properties of null (reading 'favorites')"* o el set "no hace nada".

## 16.5 El `value`

- **Siempre un objeto** (mañana agregás una función sin tocar consumidores).
- **Funciones con nombre > setter crudo**: `{ favorites, isFavorite, toggleFavorite }` mejor que
  `{ favorites, setFavorites }` (la lógica PUT/DELETE queda en un solo lugar).
- Si cambia el `value` → **se redibujan todos los que hacen `useContext`**.
- Si el que llama necesita el valor nuevo en el mismo clic, **la función lo devuelve** (tema 7.3):
  ```js
  function descontarError() {
    const quedan = errores - 1;
    setErrores(quedan);
    return quedan;              // if (descontarError() <= 0) navigate('/end')
  }
  ```
- Agregar sin duplicar (juego 2025): `setVisitados((prev) => prev.includes(c) ? prev : [...prev, c])`.

## 16.6 Dos estilos de Provider

| "Simple" (Trello 2026sem1) | "Autosuficiente" (BarApp, favoritos 2026sem2) |
|---|---|
| Solo `{ tasks, setTasks }`; una página hace el fetch | Hace **su propio fetch** y expone funciones |
| ⚠️ F5 en otra página → datos vacíos | Datos listos en cualquier ruta |

Examen: **autosuficiente** (copiar el de favoritos). Tras modificar: `await crear()` → `await recargar()` → `navigate()`.

## 16.7 Dónde se usó

| Dónde | `value` | Provider en |
|---|---|---|
| TA12 | `nombreUsuario` (solo lectura) | App |
| TA13 / TA14 | `{ nombre, setNombre }` / `{ tema, setTema }` | App |
| TA15 | tema + idioma (**anidados**; un componente puede leer dos) | App |
| TA18 | auth `{ estaLogueado, iniciarSesion, cerrarSesion }` + ruta protegida (tema 13.7) | App, fuera del router |
| UT5.1.2 | `{ modo, setModo }` + `localStorage` (tema 10.10 d) | main.jsx |
| Trivia 2025 mat. | `{ puntaje, sumarPunto, restarPunto }` | App, fuera del router |
| Viaje 2025 vesp. | dificultad, errores, visitados + 3 funciones | App, fuera del router |
| Trello 2026sem1 | `{ tasks, setTasks }` | main.jsx |
| BarApp 2026sem1 | `{ total, recargar }` (fetch propio) | main.jsx, dentro del router |
| **Países 2026sem2** | favoritos + `toggleFavorite` (PUT/DELETE) | App.jsx |

📂 **Verlo funcionando:** `parciales/simulacro-prueba2-2026sem2-matutino/web/src/context/FavoritesContext.js` + `FavoritesProvider.jsx` ·
`.../components/FavoriteButton/FavoriteButton.jsx` · `parciales/2026sem1-simulacro-vespertino/src/context/RecaudacionProvider.jsx` ·
`Ejers/UT5/UT5.1.2-paises-dark-mode/src/contextos/ContextoTema.jsx`

---

## ❓ Repaso

**Pregunta:** barra en todas las páginas con "Jugadores: N" que se actualice al instante al agregar
en `/players`. 1) ¿Por qué no alcanza `useFetchPlayers()` en la barra y en PagePlayers? 2) `value`
de un `PlayersProvider`. 3) ¿Dónde va?

**Respuesta:**
1. Cada llamada al hook tiene **su propia copia**: el `refetch()` de PagePlayers no actualiza la de la barra.
2. `const value = { players, isLoading, error, addPlayer, refetch };` — transmitir `addPlayer`
   (PUT + actualizar lista adentro), no `setPlayers` crudo.
3. Por encima de `<Routes>`:
```jsx
<PlayersProvider>
  <BrowserRouter><Routes>…</Routes></BrowserRouter>
</PlayersProvider>
```
