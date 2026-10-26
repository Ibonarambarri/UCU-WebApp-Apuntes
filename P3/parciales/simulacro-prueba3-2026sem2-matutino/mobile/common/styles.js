import { StyleSheet } from 'react-native';

const baseButton = {
  paddingHorizontal: 20,
  paddingVertical: 10,
  borderRadius: 8,
};

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    gap: 15,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
  },
  primaryButton: {
    ...baseButton,
    backgroundColor: '#000099',
  },
  dangerButton: {
    ...baseButton,
    backgroundColor: '#cc0000',
  },
  disabledButton: {
    opacity: 0.5,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    backgroundColor: 'white',
  },
  titleText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  normalText: {
    fontSize: 16,
    color: '#222',
  },
  errorText: {
    fontSize: 16,
    color: '#cc0000',
  },
  logoImage: {
    width: 48,
    height: 48,
  },
});
