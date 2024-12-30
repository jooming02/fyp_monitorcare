import React, {useEffect, useState} from 'react';
import {View, TouchableOpacity, TextInput, ScrollView} from 'react-native';
import styles from './UpdateProfileStyle';
import {RadioButton, Text, Appbar} from 'react-native-paper';
import {useNavigation} from '@react-navigation/native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CustomDialog from '../../components/CustomDialog';
import DateTimePicker from '@react-native-community/datetimepicker';
import endpoints from '../../configs/api.js';

function UpdateProfile() {
  const navigation = useNavigation();

  const [name, setName] = useState('');
  const [nameVerify, setNameVerify] = useState(true);
  const [email, setEmail] = useState('');
  const [gender, setGender] = useState('');
  const [mobile, setMobile] = useState('');
  const [mobileVerify, setMobileVerify] = useState(true);
  const [date, setDate] = useState(null);
  const [dateVerify, setDateVerify] = useState(true);
  const [showDate, setShowDate] = useState(false);

  // for the CustomDialog
  const [dialogVisible, setDialogVisible] = useState(false);
  const [dialogTitle, setDialogTitle] = useState('');
  const [dialogMessage, setDialogMessage] = useState('');
  const [dialogType, setDialogType] = useState('info');
  const hideDialog = () => setDialogVisible(false);

  async function getData() {
    const token = await AsyncStorage.getItem('token');
    // console.log('I am token: ', token);
    axios.post(endpoints.USERDATA, {token: token}).then(res => {
      console.log(res.data);
      setName(res.data.data.name);
      setEmail(res.data.data.email);
      setMobile(res.data.data.mobile);
      setGender(res.data.data.gender);
      setDate(new Date(res.data.data.dob));
    });
  }

  useEffect(() => {
    getData();
  }, []);

  function confirmUpdate() {
    if (nameVerify && mobileVerify && dateVerify) {
      const formdata = {
        name: name,
        email: email,
        mobile: mobile,
        gender: gender,
        dob: date ? date.toISOString() : '',
      };
      console.log('The formdata to updated is: ', formdata);

      axios.post(endpoints.UPDATEUSER, formdata).then(async res => {
        console.log(res.data);
        // console.log('Status: ', res.data.status);
        if (res.data.status == 'Ok') {
          // Dialog box for success
          setDialogTitle('Success');
          setDialogMessage('Updated Profile Successfully');
          setDialogType('info');
          setDialogVisible(true);
        } else {
          // Dialog box for error
          setDialogTitle('Alert');
          setDialogMessage('Profile Update Failed');
          setDialogType('info');
          setDialogVisible(true);
        }
      });
    } else {
      setDialogTitle('Error');
      setDialogMessage('Please fill all fields correctly.');
      setDialogType('info');
      setDialogVisible(true);
    }
  }

  const updateDialog = () => {
    setDialogTitle('Confirmation');
    setDialogMessage('Are you sure you want to update? ');
    setDialogType('confirm');
    setDialogVisible(true);
  };

  const handleConfirm = () => {
    if (dialogType === 'confirm') {
      confirmUpdate(); // Proceed with the update
    } else if (dialogTitle === 'Success') {
      navigation.goBack(); // Go back to the previous screen
    }
    hideDialog(); // Hide the dialog after confirmation or info display
  };

  // Function to handle name input and validation
  function handleName(e) {
    // the use of variable instead of state because of async nature of setState doesn't happen immediately
    const nameVar = e.nativeEvent.text;
    setName(nameVar);
    if (nameVar.length > 1) {
      setNameVerify(true);
    } else {
      setNameVerify(false);
    }
  }

  function handleEmail() {
    setDialogTitle('Email is not editable');
    setDialogMessage('');
    setDialogType('info');
    setDialogVisible(true);
  }

  // Function to handle mobile input and validation
  function handleMobile(e) {
    const mobileVar = e.nativeEvent.text;
    setMobile(mobileVar);
    setMobileVerify(false);
    // Pattern to match numbers with 10 to 15 digits
    const mobilePattern = /^[0-9]{10,15}$/;
    if (mobilePattern.test(mobileVar)) {
      setMobile(mobileVar);
      setMobileVerify(true);
    }
  }

  const dateChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShowDate(Platform.OS === 'ios');
    setDate(currentDate);
    if (validateDateOfBirth(currentDate)) {
      setDateVerify(true);
    } else {
      setDateVerify(false);
    }
  };

  const showDatepicker = () => {
    setShowDate(true);
  };

  function validateDateOfBirth(date) {
    if (!date) return false;

    const currentDate = new Date();
    const minDate = new Date(
      currentDate.getFullYear() - 120,
      currentDate.getMonth(),
      currentDate.getDate(),
    );
    const maxDate = new Date(
      currentDate.getFullYear() - 12,
      currentDate.getMonth(),
      currentDate.getDate(),
    );

    return date >= minDate && date <= maxDate;
  }

  return (
    <ScrollView
      contentContainerStyle={{flexGrow: 1}}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps={'always'}>
      <View style={styles.mainContainer}>
        {/* Header */}
        <Appbar.Header style={{backgroundColor: 'transparent'}}>
          <Appbar.BackAction
            onPress={() => {
              navigation.goBack();
            }}
          />
          <Appbar.Content
            titleStyle={{fontWeight: 'bold'}}
            title="Update Profile"
          />
        </Appbar.Header>

        {/* Name */}
        <View style={styles.infoEditView}>
          <Text style={styles.infoEditFirst_text}>Name</Text>
          <TextInput
            placeholder="Your Name"
            placeholderTextColor="gray"
            style={styles.infoEditSecond_text}
            onChange={handleName}
            defaultValue={name}
          />
        </View>
        {!nameVerify && (
          <Text style={styles.errorText}>
            Name should be more than 1 character
          </Text>
        )}

        {/* Email */}
        <View style={styles.infoEditView}>
          <Text style={styles.infoEditFirst_text}>Email</Text>
          <TouchableOpacity onPress={handleEmail}>
            <TextInput
              editable={false}
              placeholder="Your Email"
              placeholderTextColor="gray"
              style={styles.infoEditSecond_text}
              defaultValue={email}
            />
          </TouchableOpacity>
        </View>

        {/* Gender */}
        <View style={styles.infoEditView}>
          <Text style={styles.infoEditFirst_text}>Gender</Text>

          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <View style={styles.radioView}>
              <Text style={styles.radioText}>Male</Text>
              <RadioButton
                value="male"
                status={gender === 'male' ? 'checked' : 'unchecked'}
                onPress={() => {
                  setGender('male');
                }}
              />
            </View>
            <View style={styles.radioView}>
              <Text style={styles.radioText}>Female</Text>
              <RadioButton
                value="female"
                status={gender === 'female' ? 'checked' : 'unchecked'}
                onPress={() => {
                  setGender('female');
                }}
              />
            </View>
          </View>
        </View>

        {/* Mobile */}
        <View style={styles.infoEditView}>
          <Text style={styles.infoEditFirst_text}>Mobile No</Text>
          <TextInput
            placeholder="Your Mobile No"
            placeholderTextColor="gray"
            keyboardType="numeric"
            maxLength={15}
            style={styles.infoEditSecond_text}
            onChange={handleMobile}
            defaultValue={mobile}
          />
        </View>
        {!mobileVerify && (
          <Text style={styles.errorText}>
            Enter proper mobile numbers (Exp: 01120865190)
          </Text>
        )}

        {/* Date of Birth */}
        <View style={styles.infoEditView}>
          <Text style={styles.infoEditFirst_text}>Date of Birth</Text>
          <TouchableOpacity onPress={showDatepicker}>
            <TextInput
              placeholder={date ? date.toLocaleDateString() : 'Select Date'}
              placeholderTextColor="gray"
              style={styles.infoEditSecond_text}
              editable={false}
            />
          </TouchableOpacity>
          {showDate && (
            <DateTimePicker
              value={date || new Date()}
              mode="date"
              display="default"
              maximumDate={new Date()}
              minimumDate={new Date(1900, 0, 1)}
              onChange={dateChange}
            />
          )}
        </View>
        {!dateVerify && (
          <Text style={styles.errorText}>
            Enter a valid date of birth (You must be between 12 and 120 years
            old)
          </Text>
        )}

        <View style={styles.button}>
          <TouchableOpacity onPress={() => updateDialog()} style={styles.inBut}>
            <View>
              <Text style={styles.textSign}>Update Profile</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>

      {/* Alert message */}
      <CustomDialog
        visible={dialogVisible}
        hideDialog={hideDialog}
        title={dialogTitle}
        message={dialogMessage}
        onConfirm={handleConfirm}
        type={dialogType}
      />
    </ScrollView>
  );
}

export default UpdateProfile;
