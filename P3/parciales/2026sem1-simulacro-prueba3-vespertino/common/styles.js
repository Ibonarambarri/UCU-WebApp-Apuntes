import { StyleSheet } from "react-native";

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
    width: '28%',
  },
  flagGridItemSelected: {
    backgroundColor: '#ffee77',
  },
  flagImage: {
    width: 50,
    height: 30,
  },

  // ---- Estilos agregados para la solución ----
  scrollContent: {
    flexGrow: 1,
    alignItems: 'center',
    padding: 20,
  },
  normalText: {
    fontSize: 14,
    color: '#222',
    textAlign: 'center',
    marginBottom: 6,
  },
  errorText: {
    color: '#cc0000',
    fontSize: 14,
    marginBottom: 8,
    textAlign: 'center',
  },
  statusBox: {
    alignItems: 'center',
    padding: 20,
  },
  // Botones de dificultad: todos del mismo ancho.
  difficultyButton: {
    ...baseButton,
    backgroundColor: '#000099',
    width: 200,
  },
  capitalText: {
    fontSize: 26,
    fontWeight: 'bold',
    marginVertical: 8,
  },
  // Colores de las banderas después de responder.
  flagCorrect: {
    backgroundColor: '#99ee99',
    borderColor: '#2a9d2a',
  },
  flagWrong: {
    backgroundColor: '#ff9999',
    borderColor: '#cc0000',
  },
  flagGray: {
    backgroundColor: '#cccccc',
  },
  resultCorrect: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2a9d2a',
  },
  resultWrong: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#cc0000',
  },
  // La grilla de banderas no debe ser más ancha que un celular.
  flagGridLimited: {
    width: '100%',
    maxWidth: 400,
  },
});
