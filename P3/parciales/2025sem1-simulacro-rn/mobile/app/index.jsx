import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useFetchFoods, useFetchOrders } from '../lib/api';
import { formatPrice } from '../lib/format';
import StatusMessage from '../components/StatusMessage';

/** Calcula el stock de una comida: suma de `count` de sus órdenes.
 * OJO: json-server 1.x devuelve los `id` como STRING ("19") pero `food` en
 * las órdenes es NÚMERO (19). `19 === "19"` es false, por eso comparamos
 * pasando los dos a String.
 */
function getStock(food, orders) {
  let stock = 0;
  for (const order of orders) {
    if (String(order.food) === String(food.id)) {
      stock += order.count;
    }
  }
  return stock;
}

/** Pantalla "Comidas": un botón por comida con ícono, nombre, precio y stock. */
export default function Foods() {
  const router = useRouter();
  // Dos GET en paralelo: comidas y TODAS las órdenes (para sumar el stock).
  const foods = useFetchFoods();
  const orders = useFetchOrders();

  if (foods.isLoading || orders.isLoading || foods.error || orders.error) {
    return (
      <StatusMessage
        isLoading={foods.isLoading || orders.isLoading}
        error={foods.error ?? orders.error}
        onRetry={() => {
          foods.reload();
          orders.reload();
        }}
      />
    );
  }

  return (
    <FlatList
      style={styles.container}
      contentContainerStyle={styles.list}
      data={foods.data}
      keyExtractor={(food) => String(food.id)}
      renderItem={({ item }) => (
        <Pressable
          // `pressed` viene de Pressable: lo usamos para dar feedback al tocar.
          style={({ pressed }) => [styles.card, pressed && styles.pressed]}
          onPress={() => router.push(`/foods/${item.id}`)}
        >
          <Text style={styles.icon}>{item.icon}</Text>
          <View style={styles.info}>
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.price}>{formatPrice(item.price)}</Text>
          </View>
          <Text style={styles.stock}>{getStock(item, orders.data)} u.</Text>
        </Pressable>
      )}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fafafa',
  },
  list: {
    padding: 12,
    gap: 8,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 14,
    borderRadius: 10,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e2e2e2',
  },
  pressed: {
    backgroundColor: '#eef4ff',
  },
  icon: {
    fontSize: 28,
  },
  info: {
    flex: 1, // ocupa el medio y empuja el stock a la derecha
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  price: {
    color: '#555',
  },
  stock: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1e6fd9',
  },
});
