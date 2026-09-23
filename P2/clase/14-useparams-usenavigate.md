# Tema 14 — `useParams` y `useNavigate`

## 14.1 `useParams`: la parte variable de la URL

```jsx
<Route path="countries/:code" element={<PageCountry />} />      // App.jsx
```
```jsx
import { useParams } from 'react-router-dom';
function PageCountry() {
  const { code } = useParams();              // /countries/URY → 'URY'
  const { data: country } = useFetchCountry(code);
}
```
- Un campo por cada `:algo` del `path`; la clave es **exactamente** el nombre después de `:`.
  ⚠️ `:code` en la ruta y `const { id } = useParams()` → `undefined` **sin error**
  (2025: `:cca3` vs `params.cca2`).
- Varios: `path="users/:userId/posts/:postId"` → `const { userId, postId } = useParams();`
- Solo en el componente que dibuja la ruta (o sus hijos). **`App.jsx` no puede leerlo** →
  en 2025 vespertino se usaron **envoltorios** de 5 líneas:
  ```jsx
  function PaisesPorZonaHoraria() {
    const { timezone } = useParams();
    return <ListaDePaises titulo={'Timezone ' + timezone}
                          url={'/api/countries?timezone=' + encodeURIComponent(timezone)} />;
  }
  ```

## 14.2 ⚠️ Siempre strings

```jsx
const { id } = useParams();                   // "3"
players.find((p) => p.id === id);             // ✅ ids string ("1") → tatetí, json-server 1.x
productos.find((p) => p.id === Number(id));   // ✅ ids número (1) → array hardcodeado (TA17)
productos.find((p) => p.id === id);           // ❌ "3" === 3 → nunca encuentra
```
**Mirá el tipo en `data.json` / `db.json`.** En 2026sem2 todo es string (`"1"`, `"URY"`).
⚠️ `Number("QqR8tAYZJTw")` = `NaN` (ids generados por json-server).

## 14.3 Cambia sin desmontar

`/countries/URY` → `/countries/ARG`: mismo componente, cambia `code` → fetch con **`[code]`**
([tema 10.5](10-useeffect.md)). Lo guardado en `useState` a partir del parámetro **no se actualiza solo**
→ calcular en vez de guardar ([tema 9](09-estado-derivado.md)).

## 14.4 Parámetros con caracteres raros

```jsx
<Link to={`/regions/${encodeURIComponent(region)}`}>     // 1) codificar en el link
const { region } = useParams();                          // 2) llega YA decodificado
fetchJSON(`/api?region=${encodeURIComponent(region)}`);  // 3) re-codificar si va a otra URL
```

## 14.5 `useNavigate`: navegar desde código

```jsx
import { useNavigate } from 'react-router-dom';

const navigate = useNavigate();            // hook: arriba, nunca en un if

async function handleSubmit(event) {
  event.preventDefault();
  await createPlayer({ name });            // 1) guardar y ESPERAR
  navigate('/players');                    // 2) recién ahora
}
```
```jsx
navigate('/players');                      // ruta
navigate(`/countries/${random.code}`);     // calculada (país al azar, V8)
navigate(-1);                              // atrás
navigate('/', { replace: true });          // sin rastro en el historial
```
⚠️ **`await` primero, `navigate` después**: si no, la lista se pide antes de guardar (no aparece lo
nuevo) y si falla el usuario nunca ve el error.
⚠️ `navigate()` suelto en el cuerpo del componente → mal. Para redirigir **al dibujar**: `<Navigate />`.

## 14.6 ¿`Link`, `navigate` o `Navigate`?

| Situación | Uso |
|---|---|
| Clic que solo va a otra página | `<Link to="…">` |
| Hacer algo **antes** (guardar, validar, calcular) y después ir | `navigate('…')` en el handler |
| **Al dibujar** mandar a otro lado (guardia, `/` → `/countries`) | `<Navigate to="…" replace />` |

## 14.7 Pasar datos al navegar

**Normal:** solo el id en la URL; la página destino pide los datos (funciona con F5 y links directos).
Datos "invisibles" con `state`:
```jsx
<Link to={`/countries/${code}`} state={{ listSearch: location.search }}>  // matutino: recordar búsqueda
const location = useLocation();  location.state?.listSearch               // puede ser null → ?.
```
⚠️ Con F5 / link directo `state` es `null` → **nada imprescindible ahí**. (Error del compañero del
tatetí: pasar los jugadores por `navigate(…, { state })`.)

## 14.8 Crear y editar con la misma página (Trello 2026sem1)

```jsx
<Route path="tasks/new" element={<TaskFormPage />} />
<Route path="tasks/:id/edit" element={<TaskFormPage />} />
```
```jsx
const { id } = useParams();
const isEditing = Boolean(id);
useEffect(() => { if (id) { /* traer la tarea y setForm(tarea) */ } }, [id]);
// submit: isEditing ? PUT /api/tasks/:id : POST /api/tasks → await → navigate('/')
```
(El formulario en sí → [tema 8.5](08-formularios-controlados.md).)

## 14.9 Errores

| Síntoma | Causa → arreglo |
|---|---|
| `useParams()` da `undefined` | nombre distinto al del `path`, o componente que no es el de la `Route` |
| `find` no encuentra | `"2" === 2` → mismo tipo que los datos |
| Página no cambia de `/x/A` a `/x/B` | `useEffect(…, [])` → `[param]` |
| Lo nuevo no aparece tras guardar | `navigate` antes del `await` |
| Datos perdidos al recargar | se pasaron por `state` → pasarlos por la URL |

📂 **Verlo funcionando:** `Ejers/UT4/TA17-router-params/src/paginas/DetalleProducto.jsx` (Number) ·
`parciales/simulacro-prueba2-2026sem2-matutino/web/src/components/PageCountry/PageCountry.jsx` (useParams + state) ·
`parciales/2026sem1-prueba2-vespertino/src/pages/TaskFormPage/TaskFormPage.jsx` (crear/editar + navigate) ·
`parciales/2025sem2-parcial2-vespertino/web/src/components/PaisesPorZonaHoraria.jsx` (envoltorio)

---

## ❓ Repaso

**Pregunta:** en `/players/:id`: 1) leer el id; 2) buscar el jugador en `players` (ids string);
3) botón "Borrar jugador" que hace `await deletePlayer(id)` y luego vuelve a `/players`.

**Respuesta:**
```jsx
const { id } = useParams();
const player = players.find((p) => p.id === id);     // string === string
const navigate = useNavigate();                      // arriba, con los hooks

async function handleDelete() {
  await deletePlayer(id);
  navigate('/players');
}
<button type="button" onClick={handleDelete}>Borrar jugador</button>
```
