# Tema 6 — Formularios: `TextInput` controlado, validar y botón deshabilitado

## 6.1 Input controlado: `value` + `onChangeText`

Misma idea que P2 (el texto vive en el **estado**), con otra prop:
```jsx
const [player, setPlayer] = useState('');

<TextInput
  style={styles.input}            // sin estilo, en el celular no se ve el borde
  placeholder="Tu nombre"
  value={player}                  // el estado manda
  onChangeText={setPlayer}        // recibe el STRING nuevo (no un evento)
/>
```
| Web (P2) | RN |
|---|---|
| `onChange={(e) => setPlayer(e.target.value)}` | `onChangeText={setPlayer}` |
| `onChange={(e) => setForm({ ...form, title: e.target.value })}` | `onChangeText={(text) => setForm({ ...form, title: text })}` |

⚠️ `onChange` también existe en TextInput, pero te da un **evento nativo** (`e.nativeEvent.text`),
no `e.target.value`. Usá `onChangeText`.

## 6.2 No hay `<form>` ni `preventDefault`

En P2: `<form onSubmit={handleSubmit}>` + `e.preventDefault()`. En RN no hay form ni recarga de
página que evitar. El "enviar" es:
```jsx
<TextInput
  value={player}
  onChangeText={setPlayer}
  onSubmitEditing={handlePlay}    // Enter en el teclado (web y celular)
  returnKeyType="go"              // cómo se ve la tecla Enter: 'done' | 'go' | 'next' | 'search' | 'send'
/>
<Button title="Jugar" onPress={handlePlay} disabled={!canPlay} />
```
Las **dos** vías llaman a la misma función → la validación va **adentro** de `handlePlay` también
(el Enter no respeta el `disabled` del botón):
```jsx
async function handlePlay() {
  if (!canPlay) return;                       // ← protege el onSubmitEditing
  const game = await createGame(trimmedPlayer);
  if (game) router.push(`/games/${game.id}`);
}
```

## 6.3 Validar con `trim()` y botón deshabilitado = estado derivado

"Deshabilitado mientras el nombre esté vacío **o tenga solamente espacios**":
```jsx
const trimmedPlayer = player.trim();                     // "  Bruno  " → "Bruno", "   " → ""
const canPlay = trimmedPlayer !== '' && !isCreating;     // DERIVADO: no es un useState

<Button title={isCreating ? 'Creando…' : 'Jugar'} onPress={handlePlay} disabled={!canPlay} />
```
- ❌ No hagas `const [disabled, setDisabled] = useState(true)` + `useEffect` que lo actualice:
  se **calcula** en cada render (P2 [tema 9](../../P2/clase/09-estado-derivado.md)).
- Mandá a la API el **recortado** (`trimmedPlayer`), no `player`.
- `isCreating` en la condición → no se crean dos partidas con doble toque.

Mensaje de validación (si lo piden), también derivado:
```jsx
{player.length > 0 && trimmedPlayer === '' && (
  <Text style={styles.errorText}>El nombre no puede ser solo espacios.</Text>
)}
```

## 6.4 Props útiles de TextInput

| Prop | Para |
|---|---|
| `keyboardType="numeric"` / `"number-pad"` / `"email-address"` / `"phone-pad"` | qué teclado abre en el celular |
| `secureTextEntry` | contraseña (puntitos) |
| `autoCapitalize="none"` / `"words"` / `"sentences"` | mayúscula automática (`none` para mails/usuarios) |
| `autoCorrect={false}` | sin autocorrector |
| `maxLength={20}` | límite de caracteres |
| `multiline` | textarea (en Android sumá `textAlignVertical: 'top'`) |
| `editable={false}` | solo lectura (el `disabled` de un input) |
| `placeholderTextColor="#888"` | color del placeholder |
| `autoFocus` | foco al abrir la pantalla |

⚠️ `keyboardType="numeric"` **no** te da un número: el valor sigue siendo string → `Number(text)`
cuando lo uses (y validá `Number.isNaN`).

## 6.5 Varios campos: un objeto en el estado

```jsx
const [values, setValues] = useState({ name: '', description: '' });

function handleChange(field, value) {
  setValues((previous) => ({ ...previous, [field]: value }));   // copiar y pisar uno
}

<TextInput value={values.name} onChangeText={(text) => handleChange('name', text)} />
<TextInput value={values.description} onChangeText={(text) => handleChange('description', text)} multiline />
```

## 6.6 `Switch` como checkbox

```jsx
const [onlyMine, setOnlyMine] = useState(false);

<View style={styles.row}>
  <Text>Solo mis partidas</Text>
  <Switch value={onlyMine} onValueChange={setOnlyMine} />   {/* recibe true/false */}
</View>
```

## 6.7 "Select" con botones

No hay `<select>`. Se arma con un `map` de botones y se marca el elegido con un estilo condicional:
```jsx
const OPTIONS = [
  { value: 'population', label: 'Población' },
  { value: 'area', label: 'Superficie' },
];
const [stat, setStat] = useState('population');

<View style={styles.row}>
  {OPTIONS.map((option) => (
    <Pressable
      key={option.value}
      onPress={() => setStat(option.value)}
      style={[styles.chip, stat === option.value && styles.chipSelected]}
    >
      <Text>{option.label}</Text>
    </Pressable>
  ))}
</View>
```
(Tocar otra vez el elegido para "desmarcar": `setFilter(filter === s ? null : s)` — 2025sem1.)

## 6.8 Teclado

- `Keyboard.dismiss()` (de `react-native`) cierra el teclado, por ejemplo al tocar Jugar.
- Si el teclado tapa el input en el celular: `KeyboardAvoidingView` (raro en el parcial, que se prueba en web).

📂 **Verlo funcionando:** `parciales/simulacro-prueba3-2026sem2-matutino/mobile/app/index.jsx` (`trim`,
`canPlay`, `onSubmitEditing`, `returnKeyType`) · `parciales/2025sem1-parcial-rn/mobile/components/TaskForm.jsx`
(varios campos, `multiline`, selector de íconos con botones) · `parciales/2025sem2-parcial3-matutino/app/index.jsx`
(`nombreVacio` y botones deshabilitados) · docs: [textinput.md](../docs-offline/react-native-website/docs/textinput.md) ·
[handling-text-input.md](../docs-offline/react-native-website/docs/handling-text-input.md) ·
[switch.md](../docs-offline/react-native-website/docs/switch.md)

---

## ❓ Repaso

**Pregunta:** campo "Edad" (solo números, de 1 a 120) y botón **Guardar** que solo se habilita con
una edad válida. Estado, derivado y JSX.

**Respuesta:**
```jsx
const [age, setAge] = useState('');               // string: así lo da onChangeText
const ageNumber = Number(age.trim());
const isValid = age.trim() !== '' && Number.isInteger(ageNumber) && ageNumber >= 1 && ageNumber <= 120;

<TextInput value={age} onChangeText={setAge} keyboardType="number-pad" placeholder="Edad" style={styles.input} />
<Button title="Guardar" onPress={handleSave} disabled={!isValid} />
```
El estado guarda el **texto**; el número y la validez se **derivan**. `keyboardType` solo cambia el
teclado, no el tipo del valor.
