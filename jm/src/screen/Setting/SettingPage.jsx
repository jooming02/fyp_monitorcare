import React , { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNavigation} from '@react-navigation/native';
import {View, ScrollView} from 'react-native';
import {
  Text,
  Surface,
  TouchableRipple,
  Switch,
  IconButton,
  Appbar,
} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import CustomDialog from '../../components/CustomDialog';
import TermsAndConditionsModal from '../../components/TermsAndConditionsModal';
import axios from 'axios';
import endpoints from '../../configs/api';
import styles from './SettingPageStyle';


function SettingPage() {
  const navigation = useNavigation();
  const [isSwitchOn, setIsSwitchOn] = useState(false);
  const [email, setEmail] = useState('');


  // for the CustomDialog
  const [dialogVisible, setDialogVisible] = useState(false);
  const [dialogTitle, setDialogTitle] = useState('');
  const [dialogMessage, setDialogMessage] = useState('');
  const hideDialog = () => setDialogVisible(false);

  const [isTermsModalVisible, setIsTermsModalVisible] = useState(false);

  // Fetch user email and notification status
  useEffect(() => {
    const getUserEmail = async () => {
      try {
        const userEmail = await AsyncStorage.getItem('userEmail');
        setEmail(userEmail);

        const response = await axios.get(`${endpoints.GETNOTIFICATIONSSTATUS}/${userEmail}`);
        setIsSwitchOn(response.data.notificationsEnabled);
      } catch (error) {
        console.error('Error retrieving user email or notification status:', error);
      }
    };

    getUserEmail();
  }, []);
  
  const onToggleSwitch = async () => {
    setIsSwitchOn(!isSwitchOn);
    try {
      await axios.put(endpoints.UPDATENOTIFICATIONSSTATUS, {
        email,
        notificationsEnabled: !isSwitchOn,
      });
    } catch (error) {
      console.error('Error updating notification settings:', error);
    }
  };

  function signOutDialog() {
    // Dialog box for Confirmation
    setDialogTitle('Confirmation');
    setDialogMessage('Are you sure you want to exit? ');
    setDialogVisible(true);
  }

  function editProfile() {
    navigation.navigate('SubPage', {
      screen: 'UpdateProfile',
    });
  }

  function goToAboutUs() {
    navigation.navigate('SubPage', {
      screen: 'AboutUs',
    });
  }

  // Call this function when confirming the dialog action
  function confirmSignOut() {
    hideDialog();
    AsyncStorage.setItem('isLoggedIn', JSON.stringify(false));
    AsyncStorage.setItem('token', '');
    AsyncStorage.setItem('userEmail', '');
    // Reset navigation stack and navigate to Login to prevent the user from going back to the Home screen by pressing the back button
    navigation.reset({
      index: 0,
      routes: [{name: 'Auth'}],
    });
  }

  return (
    <ScrollView
      contentContainerStyle={{flexGrow: 1}}
      showsVerticalScrollIndicator={false}>
      <View style={styles.container}>
        {/* Header */}
        <Appbar.Header style={{backgroundColor: 'transparent'}}>
          <Appbar.Content titleStyle={{fontWeight: 'bold'}} title="Setting" />
        </Appbar.Header>

        <TouchableRipple>
          <Surface style={styles.innerSurface}>
            <Icon name="bell-outline" size={24} color="black" />
            <Text style={styles.text}>Notification Toggle</Text>
            <Switch value={isSwitchOn} onValueChange={onToggleSwitch} />
          </Surface>
        </TouchableRipple>
        <TouchableRipple onPress={() => editProfile()}>
          <Surface style={styles.innerSurface}>
            <Icon name="account" size={24} color="black" />
            <Text style={styles.text}>Profile</Text>
            <IconButton icon="chevron-right" size={24} color="black" />
          </Surface>
        </TouchableRipple>
        <TouchableRipple onPress={() => goToAboutUs()}>
          <Surface style={styles.innerSurface}>
            <Icon name="information-outline" size={24} color="black" />
            <Text style={styles.text}>About Us</Text>
            <IconButton icon="chevron-right" size={24} color="black" />
          </Surface>
        </TouchableRipple>
        <TouchableRipple onPress={() => setIsTermsModalVisible(true)}>
          <Surface style={styles.innerSurface}>
            <Icon name="file-document-outline" size={24} color="black" />
            <Text style={styles.text}>Terms and Conditions</Text>
            <IconButton icon="chevron-right" size={24} color="black" />
          </Surface>
        </TouchableRipple>
        <TouchableRipple onPress={() => signOutDialog()}>
          <Surface style={styles.innerSurface}>
            <Text style={styles.text}>Sign Out</Text>
            <IconButton icon="chevron-right" size={24} color="black" />
          </Surface>
        </TouchableRipple>
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
          onConfirm={confirmSignOut}
          type="confirm"
        />
      </View>
    </ScrollView>
  );
}

export default SettingPage;
