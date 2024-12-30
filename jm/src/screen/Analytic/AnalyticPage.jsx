import React, {useState, useCallback} from 'react';
import {View, ScrollView} from 'react-native';
import {
  Text,
  Button,
  Card,
  Appbar,
  Dialog,
  Portal,
  Paragraph,
} from 'react-native-paper';
import {useFocusEffect} from '@react-navigation/native';
import axios from 'axios';
import endpoints from '../../configs/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LoadingScreen from '../../components/LoadingScreen';
import CustomDialog from '../../components/CustomDialog';
import styles from './AnalyticsPageStyle';

const AnalyticsPage = () => {
  // Initialize state for user data
  const [userData, setUserData] = useState({
    age: null,
    ap_hi: null,
    ap_lo: null,
    cholesterol: null,
    gluc: null,
    smoke: null,
    alco: null,
    active: null,
    bmi: null,
  });
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  // Initialize state for prediction result
  const [predictionResult, setPredictionResult] = useState('');

  // Initialize state for custom dialog
  const [dialogVisible, setDialogVisible] = useState(false);
  const [dialogTitle, setDialogTitle] = useState('');
  const [dialogMessage, setDialogMessage] = useState('');
  const hideDialog = () => setDialogVisible(false);

  // Function to fetch user data
  const fetchData = async () => {
    setLoading(true);
    try {
      // Get user email from AsyncStorage
      const userEmail = await AsyncStorage.getItem('userEmail');
      if (!userEmail) {
        throw new Error('User email not found.');
      }

      const response = await axios.get(
        `${endpoints.GETHEARTDISEASERECORD}/${userEmail}`,
      );
      const data = response.data.data;
      console.log('User data Fetched for Analysis:', data);

      setUserData({
        age: data.age,
        ap_hi: data.ap_hi,
        ap_lo: data.ap_lo,
        cholesterol: data.cholesterol,
        gluc: data.gluc,
        smoke: data.smoke,
        alco: data.alco,
        active: data.active,
        bmi: data.bmi,
      });
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false);
    }
  };

  // Use focus effect to fetch data when the screen is focused
  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, []),
  );

  // Function to validate user data
  const validateUserData = () => {
    for (const key in userData) {
      if (userData[key] === null || userData[key] === '') {
        return false;
      }
    }
    return true;
  };

  // Function to handle prediction
  const handlePredict = async () => {
    if (!validateUserData()) {
      setDialogTitle('Error');
      setDialogMessage('Please ensure you have sufficient health data.');
      setDialogVisible(true);
      return;
    }
    try {
      setLoading(true);
      console.log('User data:', userData);
      // Make prediction request
      const response = await axios.post(`${endpoints.PREDICT}`, userData);
      console.log('Prediction result:', response.data.prediction);
      const result = response.data.prediction;
      setPredictionResult(result);
      setModalVisible(true); // Show modal with prediction result
    } catch (error) {
      // Dialog box for error
      setDialogTitle('Error');
      setDialogMessage('Error predicting heart disease');
      setDialogVisible(true);
    }
    setLoading(false);
  };

  // Function to get text style based on value
  const getTextStyle = value => {
    return value === null || value === '' || value === undefined
      ? styles.missingValue
      : styles.info;
  };

  // Function to get label style based on value
  const getLabelStyle = value => {
    return value === null || value === '' || value === undefined
      ? styles.missingLabel
      : styles.label;
  };

  // Display loading screen if data is still loading
  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <View style={{flex: 1, padding: 16}}>
      <Appbar.Header style={{backgroundColor: 'transparent'}}>
        <Appbar.Content
          titleStyle={{fontWeight: 'bold'}}
          title="Heart Disease Prediction"
        />
      </Appbar.Header>
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}>
        <Card style={styles.card}>
          <Card.Content>
            <Text style={styles.title}>User Data</Text>
            <Text style={getTextStyle(userData.age)}>
              <Text style={getLabelStyle(userData.age)}>Age: </Text>
              {userData.age}
            </Text>
            <Text style={getTextStyle(userData.ap_hi)}>
              <Text style={getLabelStyle(userData.ap_hi)}>Systolic: </Text>
              {userData.ap_hi} mmHg
            </Text>
            <Text style={getTextStyle(userData.ap_lo)}>
              <Text style={getLabelStyle(userData.ap_lo)}>Diastolic: </Text>
              {userData.ap_lo} mmHg
            </Text>
            <Text style={getTextStyle(userData.cholesterol)}>
              <Text style={getLabelStyle(userData.cholesterol)}>
                Cholesterol:{' '}
              </Text>
              {userData.cholesterol} mg/dL
            </Text>
            <Text style={getTextStyle(userData.gluc)}>
              <Text style={getLabelStyle(userData.gluc)}>Glucose: </Text>
              {userData.gluc} mg/dL
            </Text>
            <Text style={getTextStyle(userData.bmi)}>
              <Text style={getLabelStyle(userData.bmi)}>BMI: </Text>
              {userData.bmi}
            </Text>
            <Text style={getTextStyle(userData.smoke)}>
              <Text style={getLabelStyle(userData.smoke)}>Smoking: </Text>
              {userData.smoke ? 'Yes' : 'No'}
            </Text>
            <Text style={getTextStyle(userData.active)}>
              <Text style={getLabelStyle(userData.active)}>Exercise: </Text>
              {userData.active ? 'Yes' : 'No'}
            </Text>
            <Text style={getTextStyle(userData.alco)}>
              <Text style={getLabelStyle(userData.alco)}>Alcohol: </Text>
              {userData.alco ? 'Yes' : 'No'}
            </Text>
          </Card.Content>
        </Card>

        <Button
          mode="contained"
          onPress={handlePredict}
          style={styles.predictButton}>
          Predict Heart Disease
        </Button>
        <Portal>
          <Dialog
            visible={modalVisible}
            onDismiss={() => setModalVisible(false)}>
            <Dialog.Title>Prediction Result</Dialog.Title>
            <Dialog.Content>
              <Paragraph>{predictionResult}</Paragraph>
            </Dialog.Content>
            <Dialog.Actions>
              <Button onPress={() => setModalVisible(false)}>Close</Button>
            </Dialog.Actions>
          </Dialog>
        </Portal>
      </ScrollView>
      {/* Alert message */}
      <CustomDialog
        visible={dialogVisible}
        hideDialog={hideDialog}
        title={dialogTitle}
        message={dialogMessage}
        onConfirm={hideDialog}
      />
    </View>
  );
};

export default AnalyticsPage;
