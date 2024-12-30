import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  card: {
    marginVertical: 8,
    marginHorizontal: 2,
    padding: 8,
    backgroundColor: '#f8f8f8',
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  focusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  focus: {
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  cardInfo: {
    flex: 1,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  detailText: {
    fontSize: 16,
    color: '#888',
    marginLeft: 8,
    marginBottom: 4,
  },
  listContent: {
    paddingBottom: 16,
  },
  noRecordsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noRecordsText: {
    fontSize: 18,
    color: '#888',
  },
});

export default styles;
