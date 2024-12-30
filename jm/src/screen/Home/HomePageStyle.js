import {StyleSheet} from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  card: {
    backgroundColor: 'tomato',
    borderRadius: 10,
    padding: 10,
    margin: 10,
  },
  cardContent: {
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: 20,
  },
  measureButton: {
    marginTop: 10,
    backgroundColor: 'black',
  },
  diaryTitle: {
    marginTop: 30,
    fontSize: 18,
    fontWeight: 'bold',
  },
  diaryContainer: {
    marginTop: 20,
  },
  diaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 10,
  },
  diaryRowHalf: {
    flexDirection: 'row',
    width: '50%',
    marginBottom: 10,
  },
  diaryCardWrapper: {
    flex: 1,
    margin: 4,
  },
  diaryCard: {
    // width: '48%',
    flex: 1,
    borderRadius: 10,
    padding: 16,
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  diaryText: {
    marginTop: 10,
    fontSize: 16,
  },
  diaryValue: {
    marginTop: 5,
    fontSize: 14,
    color: 'gray',
  },
});

export default styles;
