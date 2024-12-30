import {StyleSheet} from 'react-native';

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
      card: {
        marginVertical: 8,
        marginHorizontal: 2,
        padding: 8,
        backgroundColor: '#f8f8f8',
      },
      selectedCard: {
        borderColor: 'tomato',
        borderWidth: 2,
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
        fontSize: 24,
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
      bmiCategory: {
        fontSize: 18,
        fontWeight: 'bold',
        marginLeft: 8,
        color: '#e74c3c',
      },
      detailText: {
        fontSize: 16,
        color: '#888',
        marginLeft: 8,
      },
      bmiContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 4,
      },
      selectedIcon: {
        marginLeft: 8,
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
