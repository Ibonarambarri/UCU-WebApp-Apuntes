import { Image, StyleSheet, Text, View } from 'react-native';
import { expoDevServerUri } from '@/common/utils';
import { formatNumber, STATS } from '@/common/format';

/** Tarjeta de un país: bandera, nombre y el valor de la ronda (o "?").
 *
 * - `country`: `{ code, name, flagUrl, population?, area? }`
 * - `stat`: "population" o "area" (qué valor mostrar)
 * - `hidden`: true para el país siguiente mientras no se respondió
 */
export default function CountryCard({ country, stat, hidden }) {
  return (
    <View style={cardStyles.card}>
      {/* En el celular la API está en otra máquina: hace falta la URL completa. */}
      <Image
        source={{ uri: expoDevServerUri(country.flagUrl) }}
        style={cardStyles.flag}
        resizeMode="contain"
      />
      <Text style={cardStyles.name}>{country.name}</Text>
      <Text style={cardStyles.value}>
        {hidden ? '?' : formatNumber(country[stat])}
      </Text>
      <Text style={cardStyles.unit}>{STATS[stat]?.unit}</Text>
    </View>
  );
}

const cardStyles = StyleSheet.create({
  card: {
    flex: 1,
    alignItems: 'center',
    gap: 6,
    padding: 12,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    backgroundColor: 'white',
  },
  flag: {
    width: 80,
    height: 54,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  value: {
    fontSize: 20,
    fontWeight: '600',
  },
  unit: {
    fontSize: 14,
    color: '#555',
  },
});
