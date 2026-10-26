import { StyleSheet } from 'react-native';

// Estilo base que comparten todos los botones (después cada uno le cambia
// el color). Es un objeto común y corriente: lo "desparramamos" con ...
const baseButton = {
  paddingHorizontal: 30,
  paddingVertical: 15,
  borderRadius: 8,
  marginBottom: 15,
};

export const styles = StyleSheet.create({
  primaryButton: {
    ...baseButton,
    backgroundColor: '#000099',
  },
  // Botón deshabilitado: mismo tamaño, gris para que se note.
  disabledButton: {
    ...baseButton,
    backgroundColor: '#999999',
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
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 15,
    fontSize: 16,
    marginBottom: 20,
    backgroundColor: 'white',
  },
  link: {
    marginTop: 15,
    paddingVertical: 15,
  },
  secondaryButton: {
    ...baseButton,
    backgroundColor: '#0088ff',
  },
  titleText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
  },
  // La plantilla usaba styles.normalText y styles.errorText pero no los
  // definía. Los agregamos.
  normalText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 10,
  },
  errorText: {
    fontSize: 16,
    color: '#cc0000',
    textAlign: 'center',
    marginBottom: 10,
  },
  // --- Estilos del juego ---
  currentFlag: {
    width: 150,
    height: 100,
    marginBottom: 15,
  },
  // Grilla de 3x3: una fila que "salta de línea" (flexWrap) con un ancho
  // fijo para que entren exactamente 3 botones por fila.
  grid: {
    width: 270,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 10,
    marginBottom: 20,
  },
  flagButton: {
    width: 80,
    height: 60,
    padding: 6,
    borderWidth: 1,
    borderColor: '#333',
    borderRadius: 10,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  flagImage: {
    width: 64,
    height: 44,
  },
  // Colores después de responder: verde (bien), rojo (mal), gris (el resto).
  correctButton: {
    backgroundColor: '#b2f2bb',
  },
  wrongButton: {
    backgroundColor: '#ffc9c9',
  },
  greyButton: {
    backgroundColor: '#dddddd',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
  },
  // Botones de abajo (Salir / Vamos / Ninguno): blancos con borde.
  outlineButton: {
    ...baseButton,
    minWidth: 120,
    borderWidth: 1,
    borderColor: '#333',
    backgroundColor: 'white',
  },
  outlineButtonText: {
    color: '#333',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
});
