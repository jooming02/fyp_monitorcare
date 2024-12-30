import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
  View,
  ScrollView,
} from 'react-native';
import { Text, Button, Appbar } from 'react-native-paper';
import axios from 'axios';
import endpoints from '../../configs/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CustomDialog from '../../components/CustomDialog';
import LoadingScreen from '../../components/LoadingScreen';
import styles from './LifestylePageStyle';

// The dialog didnt display properly

const LifestylePage = ({ navigation }) => {
  const [lifestyleData, setLifestyleData] = useState({
    smoking: null,
    exercise: null,
    alcohol: null,
  });

  const [loading, setLoading] = useState(true);

  // for the CustomDialog
  const [dialogVisible, setDialogVisible] = useState(false);
  const [dialogTitle, setDialogTitle] = useState('');
  const [dialogMessage, setDialogMessage] = useState('');
  const [dialogType, setDialogType] = useState('info');
  const hideDialog = () => setDialogVisible(false);

  const getUserEmail = async () => {
    try {
      const userEmail = await AsyncStorage.getItem('userEmail');
      return userEmail;
    } catch (e) {
      console.error('Failed to load user email.');
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const userEmail = await getUserEmail();
      try {
        const response = await axios.get(`${endpoints.GETLIFESTYLE}/${userEmail}`);
        console.log('Lifestyle data:', response.data);
        setLifestyleData(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching lifestyle data:', error);
        setLoading(false);
      }
    };
    fetchData();
  }, []);
  
  
  const handleSave = () => {
    setDialogTitle('Save Confirmation');
    setDialogMessage('Are you sure you want to save changes?');
    setDialogType('confirm');
    setDialogVisible(true);
  };

  const handleConfirm = () => {
    if (dialogTitle === 'Save Confirmation') {
      confirmSave(); // Proceed with the update
    } else if (dialogTitle === 'Success') {
      navigation.navigate('Main'); // Navigate back after showing success dialog
    }
    hideDialog(); // Hide the dialog after confirmation or info display
  };

  const confirmSave = async () => {
    const userEmail = await getUserEmail();
    try {
      await axios.post(endpoints.ADDUPDATELIFESTYLE, {
        email: userEmail,
        ...lifestyleData,
      });
      // Dialog box for success
      setDialogTitle('Success');
      setDialogMessage('Your lifestyle data has been updated successfully.');
      setDialogType('info');
      setDialogVisible(true);
    } catch (error) {
      console.error('Error updating lifestyle data:', error);
      // Dialog box for error
      setDialogTitle('Error');
      setDialogMessage('An error occurred while updating your lifestyle data. Please try again.');
      setDialogType('info');
      setDialogVisible(true);
    }
  }

  const handleInputChange = (type, value) => {
    setLifestyleData((prev) => ({ ...prev, [type]: value }));
  };

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <SafeAreaView style={styles.container}>
        {/* Header */}
      <Appbar.Header style={{backgroundColor: 'transparent'}}>
        <Appbar.BackAction
          onPress={() => {
            navigation.goBack();
          }}
        />
        <Appbar.Content titleStyle={{fontWeight: 'bold'}} title="Lifestyle" />
        {/* Submit Button */}
        <Button mode="contained" onPress={handleSave}>
          Save
        </Button>

      </Appbar.Header>
      <ScrollView contentContainerStyle={styles.scrollView}>
        <View style={styles.row}>
          <Text style={styles.label}>Smoking</Text>
          <View style={styles.buttonGroup}>
            <Button
              mode={lifestyleData.smoking === false ? 'contained' : 'outlined'}
              onPress={() => handleInputChange('smoking', false)}
              style={styles.button}
            >
              No
            </Button>
            <Button
              mode={lifestyleData.smoking === true ? 'contained' : 'outlined'}
              onPress={() => handleInputChange('smoking', true)}
              style={styles.button}
            >
              Yes
            </Button>
          </View>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Exercise</Text>
          <View style={styles.buttonGroup}>
            <Button
              mode={lifestyleData.exercise === false ? 'contained' : 'outlined'}
              onPress={() => handleInputChange('exercise', false)}
              style={styles.button}
            >
              No
            </Button>
            <Button
              mode={lifestyleData.exercise === true ? 'contained' : 'outlined'}
              onPress={() => handleInputChange('exercise', true)}
              style={styles.button}
            >
              Yes
            </Button>
          </View>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Alcohol</Text>
          <View style={styles.buttonGroup}>
            <Button
              mode={lifestyleData.alcohol === false ? 'contained' : 'outlined'}
              onPress={() => handleInputChange('alcohol', false)}
              style={styles.button}
            >
              No
            </Button>
            <Button
              mode={lifestyleData.alcohol === true ? 'contained' : 'outlined'}
              onPress={() => handleInputChange('alcohol', true)}
              style={styles.button}
            >
              Yes
            </Button>
          </View>
        </View>
      </ScrollView>
      <CustomDialog
        visible={dialogVisible}
        hideDialog={hideDialog}
        title={dialogTitle}
        message={dialogMessage}
        onConfirm={ handleConfirm}
        type={dialogType}
      />
    </SafeAreaView>
  );
};

export default LifestylePage;
