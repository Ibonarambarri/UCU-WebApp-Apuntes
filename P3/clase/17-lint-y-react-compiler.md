# Tema 17 — Lint y React Compiler

> Requisito del README: *"`npm run lint` debe correr sin advertencias"*. Todos los mensajes de este
> tema son **reales**: los saqué creando archivos con cada error en la plantilla del simulacro y
> corriendo `npx eslint` (después los borré).

## 17.1 `npm run lint` = `expo lint`

```bash
npm run lint              # en la raíz → npm run lint --workspace mobile → expo lint
npx expo lint --fix       # arregla solo lo arreglable (los ; que faltan)
npx eslint .              # desde mobile/: TODO el proyecto (ver ⚠️)
```
Sin problemas, la salida es solo `> expo lint` y nada más.

⚠️ **`expo lint` solo revisa `app/`, `components/` y `src/`** (lo dice `npx expo lint --help`, y lo
probé: un `;` faltante en `hooks/` **no aparece** con `npm run lint` pero sí con `npx eslint .`).
Tus `hooks/` y `common/` también son código tuyo → antes de entregar corré **los dos**.

## 17.2 Qué trae la configuración

```js
// mobile/eslint.config.js
module.exports = defineConfig([
  expoConfig,                                   // eslint-config-expo 58: core + react + react-hooks 7 + import
  {
    settings: { 'import/resolver': { alias: { map: [['@', '.']], extensions: ['.js', '.jsx', '.json'] } } },
    rules: { semi: ['error', 'always'] },       // ← agregado por los docentes
  },
]);
```
- `app.json` tiene `"experiments": { "reactCompiler": true }` y la plantilla usa
  **`eslint-plugin-react-hooks` 7**, cuyo `recommended` incluye las reglas del **React Compiler**
  (`set-state-in-effect`, `purity`, `refs`, `set-state-in-render`, `immutability`, `static-components`…).
- El alias `@/` (`@/common/fetch` = `mobile/common/fetch`) lo resuelven Babel (`babel.config.js`),
  VS Code (`jsconfig.json`) y el lint (este `settings`).

## 17.3 `rules-of-hooks`: hooks siempre arriba

```jsx
export default function Game({ game }) {
  if (!game) return null;                        // return temprano…
  const [n, setN] = useState(0);                 // …y después un hook → ERROR
```
```
8:21  error  React Hook "useState" is called conditionally. React Hooks must be called in the exact
             same order in every component render. Did you accidentally call a React Hook after an
             early return?  react-hooks/rules-of-hooks
```
Arreglo: **todos** los `use…` (incluidos `useFetchGame`, `useRouter`, `useLocalSearchParams`)
arriba de todo; los `if (error) return …` después. Es lo que hace `app/games/[id].jsx`.

## 17.4 `set-state-in-effect`: el que más vas a ver

```jsx
useEffect(() => {
  setResult(null);                 // setState SÍNCRONO en el cuerpo del efecto
}, [id]);
```
```
7:5  error  Error: Calling setState synchronously within an effect can trigger cascading renders
     …
  >  7 |     setResult(null);
       |     ^^^^^^^^^ Avoid calling setState() directly within an effect
     react-hooks/set-state-in-effect
```
| Caso | ¿Error? |
|---|---|
| `setX(…)` directo en el cuerpo del efecto | ❌ **error** |
| `setIsLoading(true)` antes de un `fetchJSON(url).then(…)` | ❌ **error** (también es síncrono) |
| `if (left === 0) setLeft(seconds)` en el cuerpo | ❌ **error** |
| `setX` dentro de `(async () => { … })()` (antes o después del `await`) | ✅ (así hace `useFetchJSON`) |
| `setX` dentro de `.then(…)`, `setInterval(…)`, `setTimeout(…)` | ✅ |
| `setX` en un handler (`onPress`) | ✅ |

**Antes de "esconder" el setState en un async, preguntate si hace falta el efecto:**
- "Resetear cuando cambia el id" → **variable derivada** (comparar `result.game.id` con `id`, tema 12.6).
- "Calcular algo de otro estado" → calcularlo en el render (no guardarlo).
- "Reaccionar a un toque" → hacerlo en el handler.

Pariente: **`set-state-in-render`** (setState suelto en el cuerpo del componente):
```
6:3  error  Error: Cannot call setState during render
            Calling setState during render may trigger an infinite loop.   react-hooks/set-state-in-render
```

## 17.5 React Compiler: `purity`, `refs`, y adiós a muchos `useCallback`

Con `reactCompiler: true` el compilador **memoiza solo** componentes, funciones y cálculos:
- **No hace falta** `useMemo`/`useCallback` "por rendimiento". `createGame` en `useCreateGame` es
  una función común y está bien.
- **Sí** dejá `useCallback` donde una API lo pide explícitamente: `useFocusEffect(useCallback(…, [refetch]))`
  (lo dice la doc de Expo Router) y el `refetch` estable de `useFetchJSON`.
- A cambio, exige que el render sea **puro**:

```jsx
const lucky = Math.random();                     // en el cuerpo del componente
```
```
6:17  error  Error: Cannot call impure function during render
             `Math.random` is an impure function. …   react-hooks/purity
```
(`Date.now()` igual.) → al azar en un handler/efecto (tema 12.7).

```jsx
const renders = useRef(0);
renders.current += 1;                            // leer/escribir .current en el render
```
```
6:3  error  Error: Cannot access refs during render   …   react-hooks/refs
```
→ `ref.current` solo en handlers o efectos.

## 17.6 `exhaustive-deps` (warning, pero "sin advertencias" = también cuenta)

```
15:6  warning  React Hook useEffect has a missing dependency: 'id'. Either include it or remove the
               dependency array  react-hooks/exhaustive-deps
11:8  warning  React Hook useCallback has a missing dependency: 'refetch'. …  (useFocusEffect con [])
```
Arreglo: agregar la dependencia (`[id]`, `[refetch]`). Es el bug de "cambio de partida y sigue la vieja".
⚠️ Las plantillas 2025/2026sem1 traían `// eslint-disable-next-line react-hooks/exhaustive-deps`
en `makeFetchJSONHook`: **vos no lo hagas**.

## 17.7 Imports: `import/no-unresolved` y el alias `@/`

```
2:29  error  Unable to resolve path to module '@/common/formatt'                   import/no-unresolved
3:18  error  Casing of ../components/countryCard does not match the underlying filesystem   import/no-unresolved
```
- Ruta mal escrita → corregirla (Cmd+clic en VS Code para verificar).
- **Mayúsculas**: en Mac anda igual, en Linux (el corrector) **no**. El lint lo detecta: hacele caso.
- ⚠️ **Lo que el lint NO detecta:** un nombre importado que no existe en un archivo que sí existe
  (`import { formatNumbr } from '@/common/format'` pasa limpio). Explota al correr:
  *formatNumbr is not a function*. Revisá `export function` vs `export default`.

## 17.8 Las otras que aparecen

```
1:10  warning  'useState' is defined but never used                     no-unused-vars
5:9   warning  'total' is assigned a value but never used               no-unused-vars
8:12  warning  'err' is defined but never used. Allowed unused caught errors must match /^_/u   no-unused-vars
4:13  error    Component definition is missing display name             react/display-name
4:34  error    Missing "key" prop for element in iterator               react/jsx-key
4:58  error    'undefinedThing' is not defined                          no-undef
4:19  error    `'` can be escaped with `&apos;`, `&lsquo;`, `&#39;`, `&rsquo;`   react/no-unescaped-entities
4:28  error    Parsing error: Unexpected token `>`. Did you mean `&gt;` or `{">"}`?
4:14  error    Missing semicolon                                        semi
```

## 17.9 Tabla: mensaje → arreglo

| Mensaje (real) | Regla | Arreglo |
|---|---|---|
| `Missing semicolon` | `semi` | poner `;` · `npx expo lint --fix` |
| `'X' is defined but never used` | `no-unused-vars` | borrar el import/variable |
| `'err' is defined but never used. Allowed unused caught errors must match /^_/u` | `no-unused-vars` | usarlo (`setError(err)`), renombrar a `_err`, o `catch {` sin variable |
| `React Hook "useX" is called conditionally…` | `rules-of-hooks` | hooks arriba, antes de cualquier `return` |
| `React Hook useEffect has a missing dependency: 'x'` | `exhaustive-deps` | agregar `x` al array |
| `Calling setState synchronously within an effect…` | `set-state-in-effect` | derivar en el render / handler; o setState dentro del callback async |
| `Cannot call setState during render` | `set-state-in-render` | moverlo a un handler, o derivar |
| `Cannot call impure function during render` | `purity` | `Math.random()`/`Date.now()` en handler o efecto |
| `Cannot access refs during render` | `refs` | `ref.current` solo en handlers/efectos |
| `Unable to resolve path to module '@/…'` | `import/no-unresolved` | ruta o nombre de archivo mal |
| `Casing of … does not match the underlying filesystem` | `import/no-unresolved` | mayúsculas exactas del archivo |
| `Component definition is missing display name` | `react/display-name` | `export default function Nombre()`, no `export default () =>` ni `memo(() => …)` anónimo |
| `Missing "key" prop for element in iterator` | `react/jsx-key` | `key={item.id}` en el `map` (o `FlatList` + `keyExtractor`) |
| `'x' is not defined` | `no-undef` | falta el import o está mal escrito |
| `` `'` can be escaped with `&apos;`… `` | `react/no-unescaped-entities` | texto entre llaves: `{"Don't"}` o `{'"ok"'}` |
| `Parsing error: Unexpected token '>'` | (parser) | `{'>'}` o `&gt;` en el texto |

**Lo que probé y NO da error** (para que no pierdas tiempo): `setState` dentro de async/`.then`/`setInterval`
en un efecto; Context + Provider + hook en el mismo archivo; `list.push(x); setList(list)` en un handler
(bug real, el lint no lo ve: tema 14.5); componente definido adentro de otro componente.

⚠️ **No apagues reglas** con `// eslint-disable…`. Correlo **cada vez que terminás una parte**.

📂 **Verlo funcionando:** `parciales/simulacro-prueba3-2026sem2-matutino/mobile/eslint.config.js` ·
`.../mobile/app.json` (`reactCompiler`) · `.../mobile/hooks/useFetchJSON.js` (setState dentro del async) ·
`.../mobile/app/index.jsx` (`useFocusEffect` + `useCallback([refetch])`) ·
Docs: [using-eslint.mdx](../docs-offline/expo/docs/pages/guides/using-eslint.mdx) ·
[react-compiler.mdx](../docs-offline/expo/docs/pages/guides/react-compiler.mdx)

---

## ❓ Repaso

**Pregunta:** querés que al cambiar de partida se borre el resultado de la ronda anterior y escribís
esto. ¿Qué dice el lint y cuál es el arreglo correcto?
```jsx
useEffect(() => {
  setResult(null);
}, [id]);
```

**Respuesta:** `Calling setState synchronously within an effect can trigger cascading renders`
(`react-hooks/set-state-in-effect`, **error**). Meterlo en un `async` "callaría" el lint, pero lo
correcto es no usar un efecto: **derivar** si el resultado es de esta partida:
```js
const roundResult = result && String(result.game.id) === String(id) ? result : null;
```
y usar `roundResult` en todo el JSX (así hace el simulacro).
