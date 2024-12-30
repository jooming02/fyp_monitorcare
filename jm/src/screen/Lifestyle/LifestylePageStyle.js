import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    scrollView: {
      padding: 20,
      justifyContent: 'center',
    },
    row: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginVertical: 10,
    },
    label: {
      fontSize: 18,
    },
    buttonGroup: {
      flexDirection: 'row',
    },
    button: {
      marginHorizontal: 5,
    },
    saveButton: {
      marginTop: 20,
    },
  });

  export default styles;