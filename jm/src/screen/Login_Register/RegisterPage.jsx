import {React, useState} from 'react';
import {View, TextInput, TouchableOpacity, ScrollView} from 'react-native';
import styles from './style';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Fontisto from 'react-native-vector-icons/Fontisto';
import Feather from 'react-native-vector-icons/Feather';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import axios from 'axios';
import {useNavigation} from '@react-navigation/native';
import DateTimePicker from '@react-native-community/datetimepicker';
import {Text, RadioButton, Checkbox} from 'react-native-paper';
import CustomDialog from '../../components/CustomDialog';
import endpoints from '../../configs/api.js';
import TermsAndConditionsModal from '../../components/TermsAndConditionsModal';

function RegisterPage() {
  const navigation = useNavigation();
  // State variables for form inputs and validation
  const [name, setName] = useState('');
  const [nameVerify, setNameVerify] = useState(false);
  const [gender, setGender] = useState('male');
  const [email, setEmail] = useState('');
  const [emailVerify, setEmailVerify] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [mobile, setMobile] = useState('');
  const [mobileVerify, setMobileVerify] = useState(false);
  const [password, setPassword] = useState('');
  const [passwordVerify, setPasswordVerify] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState('');
  const [confirmPasswordVerify, setConfirmPasswordVerify] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [isRegistrationSuccessful, setIsRegistrationSuccessful] =
    useState(false);

  // State variables for terms and conditions modal
  const [isTermsModalVisible, setIsTermsModalVisible] = useState(false);
  const [isAgreed, setIsAgreed] = useState(false);

  // for the CustomDialog
  const [dialogVisible, setDialogVisible] = useState(false);
  const [dialogTitle, setDialogTitle] = useState('');
  const [dialogMessage, setDialogMessage] = useState('');
  const hideDialog = () => setDialogVisible(false);

  const [date, setDate] = useState(null);
  const [showDate, setShowDate] = useState(false);

  const dateChange = (event, selectedDate) => {
    const currentDate = selectedDate;
    setShowDate(false);
    if (selectedDate !== undefined) {
      setDate(currentDate);
    }
  };

  function confirm() {
    if (isRegistrationSuccessful) {
      navigation.navigate('Login');
    } else {
      hideDialog();
    }
  }

  // Handle form submission for register
  function handleSubmit() {
    // Check if all fields are verified
    if (
      nameVerify &&
      emailVerify &&
      mobileVerify &&
      passwordVerify &&
      confirmPasswordVerify
    ) {
      // Validate date of birth
      if (!validateDateOfBirth(date)) {
        setDialogTitle('Alert');
        setDialogMessage(
          'Please enter a valid date of birth. You must be between 12 and 120 years old.',
        );
        setDialogVisible(true);
        return;
      }

      // Check if the user agreed to the terms and conditions
      if (!isAgreed) {
        setDialogTitle('Alert');
        setDialogMessage(
          'You must agree to the terms and conditions to register.',
        );
        setDialogVisible(true);
        return;
      }

      const userData = {
        name: name,
        gender: gender,
        email: email,
        mobile: mobile,
        dob: date ? date.toISOString().split('T')[0] : '', // Convert date to 'YYYY-MM-DD'
        password: password,
      };
      console.log('userData: ', userData);

      axios
        .post(endpoints.REGISTER, userData)
        .then(res => {
          if (res.data.status == 'ok') {
            // Dialog box for success
            setDialogTitle('Success');
            setDialogMessage('User Registered Successfully');
            setDialogVisible(true);
            setIsRegistrationSuccessful(true);
          } else {
            // Dialog box for error
            setDialogTitle('Alert');
            setDialogMessage(
              'User Registration Failed ' +
                JSON.stringify(res.data.data.errors),
            );
            setDialogVisible(true);
            setIsRegistrationSuccessful(false);
          }
        })
        .catch(err => console.log(err));
      setIsRegistrationSuccessful(false);
    } else {
      // Dialog box for error
      setDialogTitle('Alert');
      setDialogMessage('Please fill all mandatory fields correctly');
      setDialogVisible(true);
      setIsRegistrationSuccessful(false);
    }
  }

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

  // Function to handle email input and validation
  async function handleEmail(e) {
    const emailVar = e.nativeEvent.text;
    setEmail(emailVar);
    setEmailVerify(false);
    setEmailError('Enter proper email address');
    // Regular expression pattern for validating email format
    // Exactly one @ symbol. No spaces allowed. Exactly one dot.
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    // Tests if the email input matches the regular expression pattern
    if (emailPattern.test(emailVar)) {
      try {
        const response = await axios.post(endpoints.CHECKEMAIL, { email: emailVar });
        if (response.data.status === 'error') {
          setEmailError('Email already exists. Please use a different email.');
        } else {
          setEmailVerify(true);
        }
      } catch (error) {
        console.error('Error checking email:', error);
        setEmailError('Error checking email. Please try again.');
      }
    }
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

  // Function to handle password input and validation
  function handlePassword(e) {
    const passwordVar = e.nativeEvent.text;
    setPassword(passwordVar);
    setPasswordVerify(false);
    // make sure the password is strong
    // at least one uppercase letter, lower letter, number, and special character.
    // at least 8 characters long
    const mobilePattern =
      /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/;
    if (mobilePattern.test(passwordVar)) {
      setPassword(passwordVar);
      setPasswordVerify(true);
    }
  }

  // Function to handle confirm password input and validation
  function handleConfirmPassword(e) {
    const confirmPasswordVar = e.nativeEvent.text;
    setConfirmPassword(confirmPasswordVar);
    if (confirmPasswordVar === password) {
      setConfirmPasswordVerify(true);
    } else {
      setConfirmPasswordVerify(false);
    }
  }

  return (
    <ScrollView
      contentContainerStyle={{flexGrow: 1}}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="always">
      <View>
        <View style={styles.inputContainer}>
          <Text style={styles.text_header}>Register</Text>
          <Text style={styles.text_subheader}>
            Enter your details to register
          </Text>
          {/* Textbox for name */}
          <View style={styles.action}>
            <FontAwesome name="user-o" color="black" style={styles.smallIcon} />
            <TextInput
              placeholder="Name"
              style={styles.textInput}
              placeholderTextColor="grey"
              onChange={e => handleName(e)}
            />
            {/* Validation Icon (green for correct) (red for incorrect) */}
            {name.length < 1 ? null : nameVerify ? (
              <Feather
                name="check-circle"
                color="green"
                style={styles.smallIcon}
              />
            ) : (
              <MaterialIcons
                name="error"
                color="red"
                style={styles.smallIcon}
              />
            )}
          </View>
          {/* Validation Error for name */}
          {name.length < 1 ? null : nameVerify ? null : (
            <Text style={styles.text_error}>
              Name should be more than 1 character
            </Text>
          )}
          {/* Radio Button for gender */}
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
          {/* Textbox for email */}
          <View style={styles.action}>
            <Fontisto name="email" color="black" style={styles.smallIcon} />
            <TextInput
              placeholder="Email"
              style={styles.textInput}
              placeholderTextColor="grey"
              onChange={e => handleEmail(e)}
            />
            {/* Validation Icon (green for correct) (red for incorrect) */}
            {email.length < 1 ? null : emailVerify ? (
              <Feather
                name="check-circle"
                color="green"
                style={styles.smallIcon}
              />
            ) : (
              <MaterialIcons
                name="error"
                color="red"
                style={styles.smallIcon}
              />
            )}
          </View>
          {/* Validation Error for email */}
          {email.length < 1 ? null : emailVerify ? null : (
            <Text style={styles.text_error}>{emailError}</Text>
          )}
          {/* Textbox for mobile */}
          <View style={styles.action}>
            <FontAwesome name="mobile" color="black" style={styles.smallIcon} />
            <TextInput
              placeholder="Mobile Number"
              placeholderTextColor="gray"
              keyboardType="numeric"
              maxLength={12}
              style={styles.textInput}
              onChange={e => handleMobile(e)}
            />
            {/* Validation Icon (green for correct) (red for incorrect) */}
            {mobile.length < 1 ? null : mobileVerify ? (
              <Feather
                name="check-circle"
                color="green"
                style={styles.smallIcon}
              />
            ) : (
              <MaterialIcons
                name="error"
                color="red"
                style={styles.smallIcon}
              />
            )}
          </View>
          {/* Validation Error for mobile */}
          {mobile.length < 1 ? null : mobileVerify ? null : (
            <Text style={styles.text_error}>
              Enter proper mobile numbers (Exp: 01120865190)
            </Text>
          )}
          {/* Textbox for date of birth */}
          <View style={styles.action}>
            <Fontisto
              name="date"
              color="black"
              style={styles.smallIcon}
              onPress={() => setShowDate(true)}
            />
            <TextInput
              placeholder={
                date ? ` ${date.toLocaleDateString()}` : 'Date of Birth'
              }
              placeholderTextColor="grey"
              editable={false}
              style={styles.textInput}
            />
          </View>
          {showDate && (
            <DateTimePicker
              testID="dateTimePicker"
              value={date || new Date()}
              mode="date"
              is24Hour={false}
              maximumDate={new Date()}
              minimumDate={new Date(1900, 0, 1)}
              onChange={dateChange}
            />
          )}
          {/* Validation Error for date of birth */}
          {date && !validateDateOfBirth(date) && (
            <Text style={styles.text_error}>
              Enter a valid date of birth (You must be between 12 and 120 years
              old)
            </Text>
          )}

          {/* Textbox for password */}
          <View style={styles.action}>
            <FontAwesome name="lock" color="black" style={styles.smallIcon} />
            <TextInput
              placeholder="Password"
              style={styles.textInput}
              placeholderTextColor="grey"
              onChange={e => handlePassword(e)}
              secureTextEntry={!showPassword}
            />
            {/* Password visibility toggle icon */}
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
              {password.length < 1 ? null : showPassword ? (
                <Feather name="eye" color={'grey'} size={20} />
              ) : (
                <Feather name="eye-off" color={'grey'} size={20} />
              )}
            </TouchableOpacity>
          </View>
          {/* Validation Error for password */}
          {password.length < 1 ? null : passwordVerify ? null : (
            <Text style={styles.text_error}>
              At least one UpperCase, LowerCase, Number, Special Character and 8
              or more characters
            </Text>
          )}
          {/* Textbox for confirm password */}
          <View style={styles.action}>
            <FontAwesome name="lock" color="black" style={styles.smallIcon} />
            <TextInput
              placeholder="Confirm Password"
              style={styles.textInput}
              placeholderTextColor="grey"
              onChange={e => handleConfirmPassword(e)}
              secureTextEntry={!showConfirmPassword}
            />
            {/* Password visibility toggle icon */}
            <TouchableOpacity
              onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
              {confirmPassword.length < 1 ? null : showConfirmPassword ? (
                <Feather name="eye" color={'grey'} size={20} />
              ) : (
                <Feather name="eye-off" color={'grey'} size={20} />
              )}
            </TouchableOpacity>
          </View>
          {/* Validation Error for confirm password */}
          {confirmPassword.length < 1 ? null : confirmPasswordVerify ? null : (
            <Text style={styles.text_error}>Passwords do not match</Text>
          )}
          {/* Checkbox for terms and conditions */}
          <View style={styles.termsContainer}>
            <Checkbox
              status={isAgreed ? 'checked' : 'unchecked'}
              onPress={() => setIsAgreed(!isAgreed)}
            />
            <TouchableOpacity onPress={() => setIsTermsModalVisible(true)}>
              <Text style={styles.termsText}>
                I agree to the terms and conditions
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.bottom_section}>
          {/* Register Button */}
          <TouchableOpacity style={styles.inBut} onPress={() => handleSubmit()}>
            <View>
              <Text style={styles.textSign}>Register</Text>
            </View>
          </TouchableOpacity>
          {/* Login link */}
          <View style={{padding: 15}}>
            <Text style={styles.text_subheader}>
              Already have a account?{' '}
              <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                <Text style={styles.text_subheader_highlight}>Login</Text>
              </TouchableOpacity>
            </Text>
          </View>
        </View>
      </View>
      {/* Terms and Conditions Modal */}
      <TermsAndConditionsModal
        visible={isTermsModalVisible}
        onDismiss={() => setIsTermsModalVisible(false)}
      />
      {/* Alert message */}
      <CustomDialog
        visible={dialogVisible}
        hideDialog={hideDialog}
        title={dialogTitle}
        message={dialogMessage}
        onConfirm={confirm}
      />
    </ScrollView>
  );
}

export default RegisterPage;
