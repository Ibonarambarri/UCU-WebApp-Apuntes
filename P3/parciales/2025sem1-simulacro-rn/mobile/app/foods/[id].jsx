import { FlatList, StyleSheet, Text, View } from 'react-native';
import { Stack, useLocalSearchParams } from 'expo-router';
import { useFetchFood, useFetchOrders } from '../../lib/api';
import { formatDate, formatPrice } from '../../lib/format';
import StatusMessage from '../../components/StatusMessage';

/** Detalle de una comida: `/foods/:id`.
 * Título = ícono + nombre. Debajo el precio y la lista de órdenes.
 */
export default function FoodDetail() {
  // `[id]` del nombre del archivo → `id` (string).
  const { id } = useLocalSearchParams();
  const food = useFetchFood(id);
  const orders = useFetchOrders(id); // GET /orders?food=:id

  if (food.isLoading || orders.isLoading || food.error || orders.error) {
    return (
      <>
        <Stack.Screen options={{ title: 'Detalle' }} />
        <StatusMessage
          isLoading={food.isLoading || orders.isLoading}
          error={food.error ?? orders.error}
          onRetry={() => {
            food.reload();
            orders.reload();
          }}
        />
      </>
    );
  }

  return (
    <View style={styles.container}>
      {/* El título se arma con los datos que llegaron del backend. */}
      <Stack.Screen options={{ title: `${food.data.icon} ${food.data.name}` }} />

      <Text style={styles.price}>Precio: {formatPrice(food.data.price)}</Text>
      <Text style={styles.subtitle}>Órdenes</Text>

      <FlatList
        data={orders.data}
        keyExtractor={(order) => String(order.id)}
        contentContainerStyle={styles.list}
        ListEmptyComponent={<Text style={styles.empty}>No hay órdenes.</Text>}
        renderItem={({ item }) => (
          <View style={styles.row}>
            <Text>{formatDate(item.date)}</Text>
            <Text style={styles.count}>x {item.count}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fafafa',
  },
  price: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  list: {
    gap: 6,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between', // fecha a la izquierda, cantidad a la derecha
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e2e2e2',
  },
  count: {
    fontWeight: 'bold',
  },
  empty: {
    color: '#777',
  },
});
