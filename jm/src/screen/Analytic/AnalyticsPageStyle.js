import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  card: {
    marginBottom: 16,
    backgroundColor: 'white',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  label: {
    fontWeight: 'bold',
  },
  missingLabel: {
    fontWeight: 'bold',
    color: 'red',
  },
  info: {
    fontSize: 16,
    marginBottom: 4,
    color: 'black',
  },
  missingValue: {
    fontSize: 16,
    marginBottom: 4,
    color: 'red',
  },
  predictButton: {
    marginTop: 16,
  },
});

export default styles;
