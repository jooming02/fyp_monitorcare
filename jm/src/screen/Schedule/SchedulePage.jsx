import React, {useState, useCallback} from 'react';
import {View, FlatList, TouchableOpacity, Platform} from 'react-native';
import {
  Appbar,
  Card,
  Text,
  Switch,
  Button,
  Portal,
  RadioButton,
  Modal,
  useTheme,
} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import DateTimePicker from '@react-native-community/datetimepicker';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useFocusEffect} from '@react-navigation/native';
import endpoints from '../../configs/api';
import CustomDialog from '../../components/CustomDialog';
import styles from './SchedulePageStyle';

const SchedulePage = () => {
  const theme = useTheme();
  const [reminders, setReminders] = useState([]);
  const [latestBloodTestDate, setLatestBloodTestDate] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [reminderType, setReminderType] = useState('Blood Pressure');
  const [time, setTime] = useState(new Date());
  const [showTime, setShowTime] = useState(false);
  const [selectedReminders, setSelectedReminders] = useState([]);
  const [dialogVisible, setDialogVisible] = useState(false);
  const [dialogTitle, setDialogTitle] = useState('');
  const [dialogMessage, setDialogMessage] = useState('');
  const [dialogType, setDialogType] = useState('info');
  const hideDialog = () => setDialogVisible(false);
  // State for checkup dialog
  const [checkupDialogVisible, setCheckupDialogVisible] = useState(false); 
  // Hide checkup dialog
  const hideCheckupDialog = () => setCheckupDialogVisible(false); 

  // Function to get user email from AsyncStorage
  const getUserEmail = async () => {
    try {
      const email = await AsyncStorage.getItem('userEmail');
      return email;
    } catch (error) {
      console.error('Error retrieving user email:', error);
      return null;
    }
  };

  // Function to fetch reminders from the server
  const fetchReminders = async () => {
    const email = await getUserEmail();
    if (email) {
      try {
        const response = await axios.get(`${endpoints.GETREMINDER}/${email}`);
        console.log('RemindersXDDD:', response.data.data);
        setReminders(response.data.data);
      } catch (error) {
        console.error('Error fetching reminders:', error);
      }
    }
  };

  // Function to fetch the latest blood test date from the server
  const fetchLatestBloodTestDate = async () => {
    const email = await getUserEmail();
    if (email) {
      try {
        const response = await axios.get(`${endpoints.GETBLOODTEST}/${email}`);
        const bloodTests = response.data.data;
        const latestTest = bloodTests.reduce((latest, current) => {
          return new Date(current.date) > new Date(latest.date)
            ? current
            : latest;
        }, bloodTests[0]);
        setLatestBloodTestDate(latestTest?.date || null);
      } catch (error) {
        console.error('Error fetching blood test date:', error);
      }
    }
  };

  // Use focus effect to fetch reminders and blood test date when the screen is focused
  useFocusEffect(
    useCallback(() => {
      fetchReminders();
      fetchLatestBloodTestDate();
    }, []),
  );

  // Function to handle save button press
  const handleSave = () => {
    setShowTime(true);
  };

  // Function to save reminder to the server
  const saveReminder = async currentTime => {
    const email = await getUserEmail();
    if (email) {
      const newReminder = {
        email: email,
        type: reminderType,
        time: currentTime.toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        }),
        isEnabled: true,
      };

      try {
        console.log(newReminder.time);
        const response = await axios.post(endpoints.ADDREMINDER, newReminder);
        setReminders(prevReminders => [
          ...prevReminders,
          {_id: response.data._id, ...newReminder},
        ]);
        console.log('Reminder added successfully');
      } catch (error) {
        console.error('Error adding reminder:', error);
      }

      setModalVisible(false);
      setShowTime(false);
    }
  };

  // Function to toggle reminder switch
  const toggleSwitch = async id => {
    const updatedReminders = reminders.map(reminder =>
      reminder._id === id
        ? {...reminder, isEnabled: !reminder.isEnabled}
        : reminder,
    );
    const reminderToUpdate = updatedReminders.find(
      reminder => reminder._id === id,
    );
    try {
      await axios.put(`${endpoints.UPDATEREMINDER}/${id}`, {
        isEnabled: reminderToUpdate.isEnabled,
      });
      setReminders(updatedReminders);
    } catch (error) {
      console.error('Error updating reminder:', error);
    }
  };

  // Function to handle time change in the time picker
  const timeChange = (event, selectedTime) => {
    // 'set' is when the user clicks 'OK'
    if (event.type === 'set') {
      const currentTime = selectedTime || time;
      setTime(currentTime);
      console.log('User selected time:', currentTime);
      saveReminder(currentTime);
    } else if (event.type === 'dismissed') {
      // 'dismissed' is when the user clicks 'CANCEL'
      console.log('User dismissed the time picker');
    }
    setShowTime(Platform.OS === 'ios');
  };

  // Function to handle item selection
  const handleSelectItem = item => {
    setSelectedReminders(prevSelectedReminders =>
      prevSelectedReminders.includes(item._id)
        ? prevSelectedReminders.filter(id => id !== item._id)
        : [...prevSelectedReminders, item._id],
    );
  };

  // Function to handle delete button press
  const handleDelete = () => {
    setDialogTitle('Delete Records');
    setDialogMessage('Are you sure you want to delete the selected reminders?');
    setDialogType('confirm');
    setDialogVisible(true);
  };

  // Function to confirm deletion of selected reminders
  const confirmDelete = async () => {
    setDialogVisible(false);
    console.log('Deleting reminders:', selectedReminders);
    try {
      const response = await axios.post(endpoints.DELETEREMINDER, {
        ids: selectedReminders,
      });
      if (response.data.status === 'success') {
        const updatedReminders = reminders.filter(
          reminder => !selectedReminders.includes(reminder._id),
        );
        setSelectedReminders([]);
        setReminders(updatedReminders);
        setDialogTitle('Success');
        setDialogMessage('Reminders deleted successfully.');
        setDialogType('info');
        setDialogVisible(true);
      }
    } catch (error) {
      console.error('Error deleting reminders:', error);
    }
  };

  // Function to handle latest test date press
  const handleLatestTestDatePress = () => {
    setCheckupDialogVisible(true);
  };

  // Function to render each reminder item
  const renderItem = ({item}) => (
    <TouchableOpacity onPress={() => handleSelectItem(item)}>
      <Card
        style={[
          styles.card,
          selectedReminders.includes(item._id) && styles.selectedCard,
        ]}>
        <Card.Content style={styles.cardContent}>
          <View style={styles.reminderHeader}>
            <Text style={styles.reminderTitle}>{item.type}</Text>
            <Switch
              value={item.isEnabled}
              onValueChange={() => toggleSwitch(item._id)}
            />
          </View>
          <Text style={styles.timeText}>{item.time}</Text>
          <Text style={styles.daysText}>Sun,Mon,Tue,Wed,Thu,Fri,Sat</Text>
          {selectedReminders.includes(item._id) && (
            <Icon
              name="check-circle"
              size={24}
              color={theme.colors.primary}
              style={styles.selectedIcon}
            />
          )}
        </Card.Content>
      </Card>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Appbar.Header style={{backgroundColor: 'transparent'}}>
        <Appbar.Content titleStyle={{fontWeight: 'bold'}} title="Schedule" />
      </Appbar.Header>

      {latestBloodTestDate && (
        <TouchableOpacity
          style={styles.latestTestDateContainer}
          onPress={handleLatestTestDatePress}>
          <Icon name="information-outline" size={24} color="white" />
          <Text style={styles.latestTestDateText}>
            Latest Blood Test Taken:{' '}
            {new Date(latestBloodTestDate).toLocaleDateString()}
          </Text>
        </TouchableOpacity>
      )}

      {/* Delete */}
      <View style={styles.filterContainer}>
        {selectedReminders.length > 0 && (
          <Button
            mode="contained"
            onPress={handleDelete}
            style={styles.deleteButton}>
            Delete
          </Button>
        )}
      </View>

      {reminders.length === 0 ? (
        <View style={styles.noRecordsContainer}>
          <Text style={styles.noRecordsText}>No records found.</Text>
        </View>
      ) : (
        <FlatList
          data={reminders}
          renderItem={renderItem}
          keyExtractor={item => item._id.toString()}
          contentContainerStyle={styles.listContent}
        />
      )}

      <View style={styles.absoluteContainer}>
        <Button
          mode="contained"
          style={styles.addButton}
          onPress={() => setModalVisible(true)}>
          + Add Reminder
        </Button>
      </View>

      {showTime && (
        <DateTimePicker
          value={time}
          mode="time"
          display="spinner"
          onChange={timeChange}
        />
      )}

      <Portal>
        <Modal visible={modalVisible} onDismiss={() => setModalVisible(false)}>
          <View style={styles.modalView}>
            <Text style={styles.modalTitle}>Remind me to record</Text>
            <RadioButton.Group
              onValueChange={newValue => setReminderType(newValue)}
              value={reminderType}>
              <View style={styles.radioItem}>
                <Icon
                  name="heart-pulse"
                  size={24}
                  color="black"
                  style={styles.radioIcon}
                />
                <Text style={styles.radioLabel}>Blood Pressure</Text>
                <View style={styles.radioButtonContainer}>
                  <RadioButton.Item value="Blood Pressure" />
                </View>
              </View>
              <View style={styles.radioItem}>
                <Icon
                  name="weight"
                  size={24}
                  color="black"
                  style={styles.radioIcon}
                />
                <Text style={styles.radioLabel}>Weight & BMI</Text>
                <View style={styles.radioButtonContainer}>
                  <RadioButton.Item value="Weight & BMI" />
                </View>
              </View>
            </RadioButton.Group>

            <Button
              style={styles.modalButton}
              mode="contained"
              onPress={handleSave}>
              Save
            </Button>
          </View>
        </Modal>
      </Portal>

      {/* Checkup Suggestion Dialog */}
      <CustomDialog
        visible={checkupDialogVisible}
        hideDialog={hideCheckupDialog}
        title="Annual Check-up"
        message="It's recommended to have an annual check-up. Please schedule your next blood test."
        onConfirm={hideCheckupDialog}
        type="info"
      />

      <CustomDialog
        visible={dialogVisible}
        hideDialog={hideDialog}
        title={dialogTitle}
        message={dialogMessage}
        onConfirm={dialogType === 'confirm' ? confirmDelete : hideDialog}
        type={dialogType}
      />
    </View>
  );
};

export default SchedulePage;
