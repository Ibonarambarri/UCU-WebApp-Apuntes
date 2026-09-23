# Tema 4 — Props y `children`

## 4.1 Props = los parámetros del componente

```jsx
<CountryCard country={pais} />
<Header title="Países" />
```
Llegan **todas juntas en un objeto** (casi siempre desestructurado):
```jsx
function CountryCard({ country }) { … }        // lo más común
function CountryCard(props) { props.country }  // equivalente (apuntes viejos)
```

Qué se puede pasar:
```jsx
<Header title="Países" />            // string → comillas
<Pagina numero={3} />                // número → llaves (sin llaves sería el texto "3")
<Tarjeta activa />                   // booleano true (= activa={true})
<Lista paises={countries} />         // arrays, objetos
<Juego onFinish={handleFinish} />    // ¡FUNCIONES!
```

## 4.2 Solo lectura, de padre a hijo

- El hijo **nunca modifica** sus props.
- Los datos **bajan** (padre → hijo).
- Si el padre cambia lo que pasa, el hijo se redibuja con lo nuevo.

## 4.3 Funciones como props: el hijo le "avisa" al padre

El padre le pasa una función; el hijo la llama. Patrón clave (tatetí):

```jsx
// PADRE: PagePlay.jsx
const handleFinish = ({ history, winner }) => { /* guardar la partida */ };
<TicTacToeGame playerX={playerX} playerO={playerO} onFinish={handleFinish} />
```
```jsx
// HIJO: TicTacToeGame.jsx
export default function TicTacToeGame({ playerX, playerO, onFinish }) {
  …
  if (terminó) onFinish({ history, winner });   // "¡terminó! estos son los datos"
}
```
- El hijo no sabe qué hace el padre con eso; solo avisa.
- Convención: la prop se llama **`onAlgo`** (`onFinish`, `onStart`, `onDelete`) y la función
  del padre **`handleAlgo`**.
- Otro ejemplo: `<PlayersSelection onStart={handleStart} />`.

## 4.4 `children` = lo que va ENTRE las etiquetas

```jsx
<Header title="Uruguay">
  <FavoriteButton code="URY" />      {/* ← children */}
</Header>
```
```jsx
export default function Header({ title, children }) {
  return (
    <div className={styles.header}>
      <h1 className={styles.title}>{title}</h1>
      {children}
    </div>
  );
}
```
Para componentes **envoltorio**: Providers de Context (`<FavoritesProvider>{children}</…>`),
cajas genéricas (`StatusMessage` recibe el botón "Reintentar" como children).

| | Props normales (TA01) | `children` (TA02) |
|---|---|---|
| Quién decide lo de adentro | el **hijo** (Card arma su `<h2>` y sus `<p>`) | el **padre** (escribe el JSX que quiera entre las etiquetas) |
| Uso típico | datos con formato fijo (tarjeta de tarea, `CountryCard`) | marcos genéricos: layout, modal, **Provider**, **ruta protegida** |

## 4.5 ¿Dónde vive el estado? (*lifting state up*)

El estado vive en el componente **más alto que lo necesita**. Los hijos reciben por props
los **datos** y **funciones para pedir cambios** (4.3):
```
App  (estado: tareas)
 ├─ FormularioTarea   alAgregar(texto)      → App hace setTareas
 └─ ListaTareas       tareas, alBorrar(id)  → App hace setTareas
```
- Si **solo un componente** lo usa → estado local ahí (el texto del input mientras escribís
  vive en `FormularioTarea`; recién al enviar "sube").
- Si **dos hermanos** lo necesitan → subirlo al padre común.
- Si lo necesitan **ramas lejanas o varias rutas** → Context ([tema 16](16-context.md)).

Nombres: en los ejercicios del curso `alAgregar` / `alBorrar`; en las plantillas `onSave` /
`onDelete` / `onStatusChange`. Es la misma idea que `onAlgo` + `handleAlgo`.

## 4.6 Un componente, muchas pantallas (parcial 2025 vespertino)

Si varias páginas son iguales salvo el **título** y **de dónde salen los datos**, un componente
que recibe eso por props + envoltorios chiquitos:
```jsx
<Route path="/countries" element={<ListaDePaises titulo="All countries" url="/api/countries" />} />

function PaisesPorMoneda() {                       // envoltorio: solo lee la URL y arma props
  const { currencyCode } = useParams();
  const url = '/api/countries?currency=' + encodeURIComponent(currencyCode);
  return <ListaDePaises titulo={'Countries with currency ' + currencyCode} url={url} />;
}
```
- `ListaDePaises` hace el fetch de `props.url` con dependencia **`[props.url]`** ([tema 10](10-useeffect.md)):
  de `/currencies/EUR` a `/currencies/USD` el componente no se desmonta, solo cambia la prop.
- Los envoltorios existen porque `useParams` solo sirve **dentro** del componente de la ruta ([tema 14](14-useparams-usenavigate.md)).

📂 **Verlo funcionando:** `Ejers/UT4/TA02-card-children/src/componentes/Card.jsx`,
`Ejers/UT4/TA06-lista-tareas/src/App.jsx` (lifting state up),
`parciales/2025sem2-parcial2-vespertino/web/src/components/ListaDePaises.jsx` (+ `PaisesPorMoneda.jsx`).

---

## ❓ Repaso

**Pregunta:** en `PagePlayers` querés un botón "Borrar" en cada fila. El botón está en el hijo
`PlayerRow`, pero la función que borra (y refresca) está en el padre. ¿Qué prop pasás y cómo la
usás en el botón?

**Respuesta:**
```jsx
// PADRE: PagePlayers.jsx
async function handleDelete(id) {
  await fetchJSON(`/api/players/${id}`, { method: 'DELETE' });
  refetch();
}
{players.map((player) => (
  <PlayerRow key={player.id} player={player} onDelete={handleDelete} />
))}
```
```jsx
// HIJO: PlayerRow.jsx
export default function PlayerRow({ player, onDelete }) {
  return (
    <li>
      {player.name}
      <button onClick={() => onDelete(player.id)}>Borrar</button>
    </li>
  );
}
```
- Prop `onDelete`, función del padre `handleDelete`.
- El **hijo pasa el `id`** (el padre no sabe qué fila se tocó).
- `onClick={() => onDelete(player.id)}` **con flecha**. Sin flecha borraría todo al dibujar.
