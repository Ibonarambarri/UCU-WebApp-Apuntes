# Tema 5 — Listas: `FlatList` (y cuándo alcanza con `map`)

## 5.1 Por qué no alcanza con `map` como en P2

En web la página scrollea sola. En RN **no**: si hacés `ranking.map(...)` dentro de un `View` y no
entra, lo de abajo **se corta**. Opciones:

| Lista | Usá |
|---|---|
| Larga, viene de la API, no sabés cuántos son | **`FlatList`** (scrollea y solo dibuja lo visible) |
| Cortita y fija (4 equipos, 3 botones de dificultad) | `map` + `key` (adentro de un `ScrollView` si puede no entrar) |
| Agrupada con títulos (por grupo, por letra) | `SectionList` (5.7) |

## 5.2 FlatList básica: las 3 props

```jsx
import { FlatList, Text, View } from 'react-native';

<FlatList
  data={ranking}                                   // 1. el ARRAY
  keyExtractor={(item) => String(item.id)}         // 2. la key de cada uno, como STRING
  renderItem={({ item, index }) => (               // 3. cómo dibujar UNO
    <View style={styles.row}>
      <Text>{index + 1}</Text>
      <Text style={{ flex: 1 }}>{item.player}</Text>
      <Text>{item.score} pts</Text>
    </View>
  )}
/>
```
Equivale a P2:
```jsx
<ul>{ranking.map((item, index) => <li key={item.id}>{index + 1}. {item.player}</li>)}</ul>
```

## 5.3 ⚠️ Las trampas de `renderItem` y `keyExtractor`

```jsx
renderItem={(item) => <Text>{item.player}</Text>}          // ❌ undefined: recibe UN OBJETO
renderItem={({ item }) => <Text>{item.player}</Text>}      // ✅ desestructurar { item, index }

keyExtractor={(item) => item.id}                           // ⚠️ la firma es (item, index) => string
keyExtractor={(item) => String(item.id)}                   // ✅
keyExtractor={(item) => item.code}                         // ✅ 'URY' ya es string
```
- Un id numérico suele andar igual, pero la doc pide **string**: `String(item.id)` y te olvidás.
- Sin `keyExtractor`, FlatList busca `item.key` / `item.id` o usa el índice (con warning).
- **No** pongas `key` en lo que devuelve `renderItem`: de eso se encarga `keyExtractor`.
- `index` es la posición → sirve para "posición en el ranking" (`index + 1`).

## 5.4 Las props "de adorno" (todas opcionales)

```jsx
<FlatList
  data={visibleTasks}
  keyExtractor={(task) => String(task.id)}
  renderItem={({ item }) => <TaskRow task={item} />}
  ListEmptyComponent={<Text>No hay tareas.</Text>}           // si data = [] (no si es null)
  ListHeaderComponent={<Text style={styles.titleText}>Ranking</Text>}   // arriba, scrollea con la lista
  ListFooterComponent={<Button title="Cargar más" onPress={…} />}
  ItemSeparatorComponent={() => <View style={{ height: 1, backgroundColor: '#ddd' }} />}  // ENTRE ítems
  contentContainerStyle={{ padding: 12, gap: 8 }}            // padding/gap del contenido
  numColumns={2}                                             // grilla (fijo: no se cambia en caliente)
/>
```
- `ListEmptyComponent` solo aparece con `data = []`. Si `data` es `null` (todavía cargando) la lista
  no dibuja nada → el "Cargando…" lo resolvés **antes** (5.6).
- `ItemSeparatorComponent` recibe un **componente** (función o elemento), no se pone después del último.

## 5.5 Tirar para refrescar: `refreshing` + `onRefresh`

```jsx
const { data: ranking, isLoading, refetch } = useFetchRanking();

<FlatList
  data={ranking}
  keyExtractor={(item) => String(item.id)}
  renderItem={…}
  refreshing={isLoading}        // muestra la ruedita arriba mientras sea true
  onRefresh={refetch}           // al tirar hacia abajo
/>
```
Van **las dos juntas**. Con el `refetch` del hook (P2 tema 12) sale en dos líneas.

## 5.6 El patrón completo de la pantalla (= P2 tema 12.4)

```jsx
let rankingContent;
if (rankingError) {
  rankingContent = <StatusMessage error={rankingError} text="No se pudo cargar el ranking." onRetry={refetch} />;
} else if (!ranking) {
  rankingContent = <StatusMessage loading text="Cargando ranking…" />;   // !data, no isLoading → no parpadea
} else if (ranking.length === 0) {
  rankingContent = <Text>Todavía no hay partidas terminadas.</Text>;     // o ListEmptyComponent
} else {
  rankingContent = <FlatList data={ranking} keyExtractor={…} renderItem={…} />;
}
```
Lista **filtrada** = estado derivado, igual que en P2: `const visibles = filter ? tasks.filter(…) : tasks;`
y `data={visibles}`.

## 5.7 `map` dentro de `ScrollView` y el warning de VirtualizedList

Para pocos elementos fijos, `map` sigue valiendo (con `key`, como en P2):
```jsx
<ScrollView contentContainerStyle={styles.container}>
  {teams.map((team) => (
    <TouchableOpacity key={team.code} onPress={() => router.push(`/teams/${team.code}`)}>
      <Text>{team.name}</Text>
    </TouchableOpacity>
  ))}
</ScrollView>
```
⚠️ **No metas una `FlatList` adentro de un `ScrollView`** (misma dirección). Sale:
> *VirtualizedLists should never be nested inside plain ScrollViews with the same orientation…*

Arreglos: (a) que la pantalla sea un `View` con `flex: 1` y la FlatList scrollee sola (el simulacro);
(b) lo de arriba/abajo de la lista va en `ListHeaderComponent` / `ListFooterComponent`;
(c) si la lista es corta, `map` y listo.

## 5.8 `SectionList` (por si piden grupos)

```jsx
import { SectionList } from 'react-native';

const sections = [
  { title: 'Grupo A', data: [{ code: 'URY', name: 'Uruguay' }, …] },
  { title: 'Grupo B', data: […] },
];
<SectionList
  sections={sections}                                        // [{ title, data: [] }]
  keyExtractor={(item) => item.code}
  renderItem={({ item }) => <Text>{item.name}</Text>}
  renderSectionHeader={({ section }) => <Text style={styles.titleText}>{section.title}</Text>}
/>
```
Cada sección **tiene que** tener `data` (array). El resto, igual que FlatList.

📂 **Verlo funcionando:** `parciales/simulacro-prueba3-2026sem2-matutino/mobile/app/index.jsx` (ranking:
FlatList con `index + 1`, `!ranking`) · `parciales/2025sem1-parcial-rn/mobile/app/index.jsx`
(`ListEmptyComponent`, lista filtrada, `contentContainerStyle`) ·
`parciales/2026sem1-prueba3-vespertino/app/groups/[letter].jsx` (`map` en ScrollView) · docs:
[flatlist.md](../docs-offline/react-native-website/docs/flatlist.md) ·
[using-a-listview.md](../docs-offline/react-native-website/docs/using-a-listview.md) ·
[sectionlist.md](../docs-offline/react-native-website/docs/sectionlist.md)

---

## ❓ Repaso

**Pregunta:** `GET /api/ranking` devuelve `[{ id: 1, player: 'Ayrton', score: 7 }, …]`. Escribí la
FlatList que muestre "1. Ayrton — 7 pts", con un mensaje si viene vacío y "tirar para refrescar".

**Respuesta:**
```jsx
<FlatList
  data={ranking}
  keyExtractor={(item) => String(item.id)}
  renderItem={({ item, index }) => (
    <Text>{index + 1}. {item.player} — {item.score} pts</Text>
  )}
  ListEmptyComponent={<Text>Todavía no hay partidas.</Text>}
  refreshing={isLoading}
  onRefresh={refetch}
/>
```
`{ item, index }` desestructurado; `String(item.id)` porque el id es número; la posición sale de `index`.
