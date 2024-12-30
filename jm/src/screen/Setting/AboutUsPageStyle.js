import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    paddingTop: 20,
    paddingHorizontal: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  description: {
    fontSize: 14,
    lineHeight: 24,
    marginBottom: 10,
  },
  bulletPoints: {
    paddingLeft: 10,
    marginBottom: 10,
  },
  bulletPoint: {
    fontSize: 14,
    lineHeight: 24,
  },
});

export default styles;
