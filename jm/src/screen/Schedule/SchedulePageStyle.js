import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  filterContainer: {
    alignItems: 'flex-end',
    marginBottom: 16,
  },
  deleteButton: {
    height: 40,
  },
  latestTestDateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: 'tomato',
    borderRadius: 15,
    marginVertical: 10,
  },
  latestTestDateText: {
    marginLeft: 8,
    fontSize: 14,
    color: 'white',
  },
  scrollViewContent: {
    flexGrow: 1,
  },
  card: {
    marginVertical: 8,
    marginHorizontal: 2,
    // padding: 8,
    backgroundColor: '#f8f8f8',
  },
  selectedCard: {
    borderColor: 'tomato',
    borderWidth: 2,
  },
  cardContent: {
    // padding: 16,
  },
  reminderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  reminderTitle: {
    flex: 1,
    marginLeft: 8,
    fontWeight: 'bold',
  },
  timeText: {
    fontSize: 32,
    fontWeight: 'bold',
    marginTop: 16,
  },
  daysText: {
    marginTop: 8,
    color: '#757575',
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
  modalView: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 16,
    margin: 10,
    // elevation: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  radioItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 4,
  },
  radioIcon: {
    marginRight: 8,
  },
  radioLabel: {
    flex: 1,
    fontSize: 16,
  },
  radioButtonContainer: {
    alignItems: 'flex-end',
  },
  timePickerContainer: {
    marginVertical: 16,
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
  listContent: {
    paddingBottom: 80, // For space under the list for buttons
  },
  selectedIcon: {
    position: 'absolute',
    top: 60,
    right: 16,
  },
  modalButton: {
    marginVertical: 10,
  },
});

export default styles;
