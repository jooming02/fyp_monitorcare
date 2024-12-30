import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  card: {
    padding: 16,
    backgroundColor: 'white',
    marginTop: 16,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  valueContainer: {
     alignItems: 'center',
    marginVertical: 8,
    flex: 1,
  },
  labelText: {
    marginBottom: 16,
    fontWeight: 'bold',
    fontSize: 16,
  },
  resultContainer: {
    alignItems: 'center',
    marginTop: 32,
  },
  resultText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  resultInfo: {
    color: 'gray',
  },
  resultColorsContainer: {
    position: 'relative',
    width: '100%',
    alignItems: 'center',
    marginVertical: 16,
  },
  resultColors: {
    flexDirection: 'row',
    marginTop: 8,
  },
  colorIndicator: {
    width: 30,
    height: 10,
    borderRadius: 5,
    marginHorizontal: 2,
  },
  pointer: {
    bottom: -5,
  },
});

export default styles;
