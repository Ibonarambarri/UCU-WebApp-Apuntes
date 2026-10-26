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
  // Botón deshabilitado: mismo tamaño, color gris para que se note.
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
  // definía (quedaban undefined). Los agregamos.
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
  // Fila horizontal (en RN el flexDirection por defecto es 'column').
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 20,
    marginBottom: 20,
  },
  mapImage: {
    width: 140,
    height: 140,
  },
  flagCard: {
    padding: 10,
    borderWidth: 1,
    borderColor: '#333',
    borderRadius: 12,
    backgroundColor: 'white',
  },
  flagImage: {
    width: 110,
    height: 70,
  },
  // Botones Sí / No: blancos con borde; al responder se pintan de verde o rojo.
  answerButton: {
    ...baseButton,
    minWidth: 110,
    borderWidth: 1,
    borderColor: '#333',
    backgroundColor: 'white',
  },
  answerButtonText: {
    color: '#333',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  correctButton: {
    backgroundColor: '#b2f2bb',
  },
  wrongButton: {
    backgroundColor: '#ffc9c9',
  },
  // Imagen grande del mapa, dentro de un recuadro.
  bigMapCard: {
    padding: 10,
    borderWidth: 1,
    borderColor: '#333',
    borderRadius: 12,
    backgroundColor: 'white',
    marginBottom: 20,
  },
  bigMapImage: {
    width: 180,
    height: 180,
  },
  // Botón con una bandera adentro (las 4 opciones).
  flagButton: {
    padding: 8,
    borderWidth: 1,
    borderColor: '#333',
    borderRadius: 10,
    backgroundColor: 'white',
  },
  smallFlagImage: {
    width: 60,
    height: 40,
  },
  bigEmoji: {
    fontSize: 80,
    marginVertical: 20,
  },
});
