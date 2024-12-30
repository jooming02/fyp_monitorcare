import {StyleSheet} from 'react-native';

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingBottom: 100,
    padding: 16,
  },
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    marginBottom: 8,
    fontSize: 18,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 14,
    color: 'gray',
    alignItems: 'center',
  },
  detailsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 16,
  },
  detailText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  dateRangeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateRangeText: {
    fontSize: 14,
    marginRight: 8,
  },
  card: {
    marginVertical: 8,
  },
  statContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 8,
  },
  statItem: {
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 14,
    color: 'gray',
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  chartPlaceholder: {
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 8,
  },
  absoluteContainer: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  addButton: {
    width: '90%',
    paddingVertical: 8,
  },
  historyButton: {
    padding: 16,
  },
  recommendationText: {
    fontSize: 16,
    color: '#333',
    marginTop: 10,
  },
});

export default styles;
