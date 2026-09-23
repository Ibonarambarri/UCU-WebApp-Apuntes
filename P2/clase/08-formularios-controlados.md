# Tema 8 — Inputs y formularios controlados

## 8.1 Controlado = el input muestra lo que dice el estado

```jsx
const [name, setName] = useState('');

<input value={name} onChange={(event) => setName(event.target.value)} />
```
```
tecla "A" → onChange → setName('A') → re-render → el input muestra value={name} = 'A'
```
El input se escribe **porque cambió el estado**. Así siempre sabés qué tiene (`name`) y podés:
- **vaciarlo**: `setName('')`;
- **validarlo**: `disabled={!name.trim()}`;
- **transformarlo**: `setName(e.target.value.toUpperCase())`.

⚠️ Errores clásicos:
- **`value` sin `onChange` → input congelado** (no deja escribir). Siempre van juntos.
  Consola: *"You provided a `value` prop to a form field without an `onChange` handler"*.
- `useState()` sin inicial → `value` arranca `undefined` → warning "uncontrolled to controlled".
  **Siempre `useState('')`.**

## 8.2 Cada tipo de control

```jsx
// Texto / número
<input type="text" value={name} onChange={(e) => setName(e.target.value)} />
<input type="number" value={min} onChange={(e) => setMin(e.target.value)} />  // ¡llega string!

// Select: value en el <select> (NO "selected" en la option)
<select value={playerXId} onChange={(e) => setPlayerXId(e.target.value)}>
  <option value="">Select a player…</option>
  {players.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
</select>

// Checkbox: checked + e.target.checked
<input type="checkbox" checked={soloFavs} onChange={(e) => setSoloFavs(e.target.checked)} />

// Textarea: igual que input
<textarea value={desc} onChange={(e) => setDesc(e.target.value)} />
```
`<select>` con opciones de la API sale en casi todos los parciales (3 selects en 2025 matutino,
jugadores del tatetí, regiones del matutino).

## 8.3 Receta del formulario completo (PagePlayers del tatetí)

```jsx
const [name, setName] = useState('');
const { isCreating, createPlayer } = useCreatePlayer();
const { data: players, refetch } = useFetchPlayers();

async function handleSubmit(event) {
  event.preventDefault();                       // 1. frenar la recarga
  if (!name.trim()) return;                     // 2. validar
  try {
    await createPlayer({ name: name.trim() });  // 3. guardar (ESPERAR)
    setName('');                                // 4. limpiar
    refetch();                                  // 5. refrescar la lista
  } catch (err) {
    setError(err);                              // 6. mostrar error
  }
}

return (
  <form onSubmit={handleSubmit}>
    <label htmlFor="new-player">New:</label>
    <input id="new-player" value={name} onChange={(e) => setName(e.target.value)} />
    <button type="submit" disabled={!name.trim() || isCreating}>Add</button>
  </form>
);
```
- **`onSubmit` en el form** (no `onClick` en el botón) → también funciona con Enter.
- **`await` antes de limpiar/refrescar** → si no, la lista vuelve sin el nuevo.
- **`|| isCreating`** → un doble clic no crea dos.
- **`.trim()`** → "   " no es un nombre.

## 8.4 Varios campos: un estado objeto + un solo handleChange

(Formulario de tareas de Trello, `2026sem1-prueba2-vespertino`.)
```jsx
const [form, setForm] = useState({ titulo: '', responsable: '', estado: 'pendiente' });

function handleChange(event) {
  const { name, value } = event.target;   // el atributo name="" del input
  setForm({ ...form, [name]: value });    // copia y pisa SOLO ese campo
}

<input name="titulo" value={form.titulo} onChange={handleChange} />
<input name="responsable" value={form.responsable} onChange={handleChange} />
<select name="estado" value={form.estado} onChange={handleChange}>…</select>
```
`[name]: value` = clave calculada (si `name` es `'titulo'` → `titulo: value`).

## 8.5 Crear o editar con el mismo formulario (patrón para reconocer)

```jsx
const { id } = useParams();
const esEdicion = Boolean(id);          // hay id → editar; no → crear
// al cargar (si edición): traer la tarea y setForm(tarea)       → tema 10
// al enviar: esEdicion ? PUT /api/tasks/:id : POST /api/tasks   → luego navigate('/')
```

## 8.6 Validar con mensaje y convertir antes de enviar

```jsx
const [error, setError] = useState('');

async function handleSubmit(event) {
  event.preventDefault();
  setError('');                                   // limpiar el error anterior
  if (form.cliente.trim() === '') {
    setError('El cliente es obligatorio.');
    return;                                       // no se envía nada
  }
  await crear({ ...form, cantidad: Number(form.cantidad) });  // input number → llega "3"
}

{error !== '' ? <p className={styles.error}>{error}</p> : null}
```
⚠️ Sin `Number()` el backend guarda `"3"` y después `'3' + 2 === '32'` (BarApp 2026sem1).

Si el `<input>` va **adentro** del `<label>`, no hacen falta `htmlFor` ni `id`:
```jsx
<label>Cliente <input name="cliente" value={form.cliente} onChange={handleChange} /></label>
```

📂 **Verlo funcionando:** `parciales/simulacro-prueba2-2026sem2-vespertino/web/src/pages/PagePlayers/PagePlayers.jsx` ·
`parciales/2026sem1-prueba2-vespertino/src/pages/TaskFormPage/TaskFormPage.jsx` (crear/editar, `[name]`) ·
`parciales/2026sem1-simulacro-vespertino/src/pages/NuevaCuentaPage.jsx` (validación + `Number`)

---

## ❓ Repaso

**Pregunta:** ¿qué 3 cosas hacen que esto no funcione?
```jsx
const [code, setCode] = useState();
async function handleSubmit() {
  addFavorite(code);
  setCode('');
  refetch();
}
return (
  <form>
    <input value={code} />
    <button onClick={handleSubmit}>Agregar</button>
  </form>
);
```

**Respuesta:**
1. **Falta `await`** en `addFavorite` → `refetch()` corre antes de que se guarde.
2. **El envío va en `<form onSubmit>`** + falta **`event.preventDefault()`** → el botón (submit por defecto) recarga la página.
3. **Input sin `onChange`** → congelado. Y `useState()` debe ser `useState('')`. *(El que faltó en clase.)*

```jsx
const [code, setCode] = useState('');

async function handleSubmit(event) {
  event.preventDefault();
  if (!code.trim()) return;
  await addFavorite(code.trim().toUpperCase());
  setCode('');
  refetch();
}

return (
  <form onSubmit={handleSubmit}>
    <input value={code} onChange={(e) => setCode(e.target.value)} />
    <button type="submit" disabled={!code.trim()}>Agregar</button>
  </form>
);
```
