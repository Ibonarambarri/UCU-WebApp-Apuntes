import { StyleSheet } from 'react-native';

// Base compartida por todos los botones (se "copia" con el spread `...`).
const baseButton = {
  paddingHorizontal: 30,
  paddingVertical: 15,
  borderRadius: 8,
  marginBottom: 15,
};

export const styles = StyleSheet.create({
  // ---- Estilos que venían en la plantilla ----
  primaryButton: {
    ...baseButton,
    backgroundColor: '#000099',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  titleText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
  },
  flagGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    margin: 20,
  },
  flagGridItem: {
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingVertical: 10,
    marginBottom: 10,
    width: '23%',
  },
  flagGridItemSelected: {
    backgroundColor: '#ffee77',
  },
  flagImage: {
    width: 120,
    height: 80,
  },
  errorText: {
    color: '#cc0000',
    fontSize: 14,
    marginBottom: 8,
    textAlign: 'center',
  },
  normalText: {
    fontSize: 14,
    color: '#222',
  },

  // ---- Estilos agregados para la solución ----
  // Contenedor para pantallas con ScrollView (el contenido puede ser más alto
  // que la pantalla del celular). Va en `contentContainerStyle`.
  scrollContent: {
    flexGrow: 1,
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  secondaryButton: {
    ...baseButton,
    backgroundColor: '#0088ff',
  },
  disabledButton: {
    opacity: 0.5,
  },
  // Grilla de grupos: 3 por fila (como en el croquis).
  groupGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  groupButton: {
    ...baseButton,
    backgroundColor: '#000099',
    paddingHorizontal: 0,
    width: '31%',
  },
  // Botón de equipo: bandera + nombre en fila, ocupa todo el ancho.
  teamButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    backgroundColor: 'white',
  },
  teamButtonText: {
    fontSize: 18,
    marginLeft: 12,
  },
  smallFlag: {
    width: 48,
    height: 32,
  },
  // Encabezado de la vista de equipo: bandera a la izquierda, datos a la derecha.
  teamHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  teamInfo: {
    marginLeft: 16,
    flexShrink: 1, // para que el texto largo baje de línea y no se salga.
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfButton: {
    ...baseButton,
    backgroundColor: '#0088ff',
    width: '48%',
  },
  stickerNumber: {
    fontSize: 16,
    fontWeight: '600',
  },
  statusBox: {
    alignItems: 'center',
    padding: 20,
  },
  centered: {
    alignItems: 'center',
  },
});
