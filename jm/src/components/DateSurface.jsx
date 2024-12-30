// DateSurface.js
import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Text, Surface, IconButton } from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';

const DateSurface = ({ date, showDate, setShowDate, dateChange }) => {
  const showDatepicker = () => {
    setShowDate(true);
  };

  return (
    <View>
      <TouchableOpacity onPress={showDatepicker} style={styles.dateContainer}>
        <Surface style={styles.surface}>
          <Text style={styles.title}>Date</Text>
          <View style={styles.rightContainer}>
            <Text style={styles.dateText}>
              {date.toISOString().split('T')[0]}
            </Text>
            <IconButton icon="chevron-right" size={24} color="black" />
          </View>
        </Surface>
      </TouchableOpacity>
      {showDate && (
        <DateTimePicker
          testID="dateTimePicker"
          value={date}
          mode="date"
          display="default"
          maximumDate={new Date()}
          onChange={dateChange}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
    dateContainer: {
        marginBottom: 16,
      },
      surface: {
        padding: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderRadius: 8,
        backgroundColor: '#F5F5F5',
      },
      title: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#000',
      },
      rightContainer: {
        flexDirection: 'row',
        alignItems: 'center',
      },
      dateText: {
        fontSize: 16,
        marginRight: 5,
        color: '#000',
      },
  });


export default DateSurface;
