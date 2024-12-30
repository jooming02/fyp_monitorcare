import {React, useState} from 'react';
import {
  Text,
  View,
  Image,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import styles from './style';
import {useNavigation} from '@react-navigation/native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Feather from 'react-native-vector-icons/Feather';
import CustomDialog from '../../components/CustomDialog';
import endpoints from '../../configs/api.js';

function LoginPage() {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [emailVerify, setEmailVerify] = useState(false);
  const [password, setPassword] = useState('');
  const [passwordVerify, setPasswordVerify] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // for the CustomDialog
  const [dialogVisible, setDialogVisible] = useState(false);
  const [dialogTitle, setDialogTitle] = useState('');
  const [dialogMessage, setDialogMessage] = useState('');
  const hideDialog = () => setDialogVisible(false);

  // Handle form submission for login
  async function handleSubmit() {
    console.log(email, password);
    const userData = {
      email: email,
      password,
    };
    // Check if all fields are verified
    if (emailVerify && passwordVerify) {
      try {
        // Sending a POST request to the login API endpoint
        const res = await axios.post(endpoints.LOGIN, userData);

        if (res.data.status === 'ok') {
          const { data, onboardingComplete } = res.data;
          
          await AsyncStorage.setItem('token', data);
          // Save email and onboarding status to AsyncStorage
          await AsyncStorage.setItem('userEmail', email); 
          // this is used to keep user logged in
          await AsyncStorage.setItem('isLoggedIn', JSON.stringify(true));

          setDialogTitle('Success');
          setDialogMessage('User Login Successfully');
          setDialogVisible(true);

          // Check if onboarding is complete
          if (!onboardingComplete) {
            navigation.navigate('Onboarding');
          } else {
            // Navigate to the main app
            navigation.navigate('Main');
          }
        } else {
          // Dialog box for error
          setDialogTitle('Alert');
          setDialogMessage('User Login Failed. ' + res.data.data);
          setDialogVisible(true);
        }
      } catch (err) {
        console.log('Error', err);
      }
    } else {
      // Dialog box for error
      setDialogTitle('Alert');
      setDialogMessage('Please fill all mandatory fields');
      setDialogVisible(true);
    }
  }
  // Function to handle email input and validation
  function handleEmail(e) {
    const emailVar = e.nativeEvent.text;
    setEmail(emailVar);
    if (emailVar.length > 1) {
      setEmailVerify(true);
    } else {
      setEmailVerify(false);
    }
  }

  // Function to handle password input and validation
  function handlePassword(e) {
    const passwordVar = e.nativeEvent.text;
    setPassword(passwordVar);
    if (passwordVar.length > 1) {
      setPasswordVerify(true);
    } else {
      setPasswordVerify(false);
    }
  }
  return (
    <ScrollView
      contentContainerStyle={{flexGrow: 1}}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="always"
      >
      <View style={styles.mainContainer}>
        {/* Logo */}
        <View style={styles.logoContainer}>
          <Image
            style={styles.logo}
            source={require('../../assets/logo.png')}
          />
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.text_header}>Login</Text>
          <Text style={styles.text_subheader}>Please sign in to continue.</Text>
          {/* Textbox for email */}
          <View style={styles.action}>
            <FontAwesome name="user-o" color="black" style={styles.smallIcon} />
            <TextInput
              placeholder="Your Email"
              placeholderTextColor="grey"
              style={styles.textInput}
              onChange={e => handleEmail(e)}
            />
          </View>
          {/* Textbox for password */}
          <View style={styles.action}>
            <FontAwesome name="lock" color="black" style={styles.smallIcon} />
            <TextInput
              placeholder="Password"
              style={styles.textInput}
              placeholderTextColor="grey"
              onChange={e => handlePassword(e)}
              secureTextEntry={!showPassword} // Toggle visibility of the password
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
        </View>
        {/* Forgot Password link */}
        {/* <View style={styles.forgotpassword}>
          <Text style={styles.text_footer}>Forgot Password?</Text>
        </View> */}

        <View style={styles.bottom_section}>
          {/* Login Button */}
          <TouchableOpacity style={styles.inBut} onPress={() => handleSubmit()}>
            <View>
              <Text style={styles.textSign}>Log in</Text>
            </View>
          </TouchableOpacity>
          {/* Register link */}
          <View style={{padding: 15}}>
            <Text style={styles.text_subheader}>
              Don't have an account?{' '}
              <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                <Text style={styles.text_subheader_highlight}>Register</Text>
              </TouchableOpacity>
            </Text>
          </View>
        </View>
      </View>
      <CustomDialog
        visible={dialogVisible}
        // hideDialog={hideDialog}
        title={dialogTitle}
        message={dialogMessage}
        onConfirm={hideDialog}
      />
    </ScrollView>
  );
}

export default LoginPage;
