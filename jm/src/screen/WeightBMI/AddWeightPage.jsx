import React, {useState, useEffect} from 'react';
import {View} from 'react-native';
import {Appbar, Text, Card, Button, TextInput} from 'react-native-paper';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useRoute} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import styles from './AddWeightPageStyle';
import endpoints from '../../configs/api.js';
import {BMI_THRESHOLDS} from '../../configs/health';
import CustomDialog from '../../components/CustomDialog';
import DateSurface from '../../components/DateSurface';

const AddWeightPage = ({navigation}) => {
  // State variables for weight, height, and BMI
  const [weight, setWeight] = useState('60');
  const [height, setHeight] = useState('165');
  const [weightVerify, setWeightVerify] = useState(true);
  const [heightVerify, setHeightVerify] = useState(true);
  const [bmi, setBmi] = useState(null);
  const [bmiCategory, setBmiCategory] = useState('');
  const [bmiRange, setBmiRange] = useState('');
  const [bmiIndex, setBmiIndex] = useState(null);

  // State variables for date and dialog
  const [date, setDate] = useState(new Date());
  const [showDate, setShowDate] = useState(false);
  const [dialogVisible, setDialogVisible] = useState(false);
  const [dialogTitle, setDialogTitle] = useState('');
  const [dialogMessage, setDialogMessage] = useState('');
  const [dialogType, setDialogType] = useState('info');
  const hideDialog = () => setDialogVisible(false);

  // Access route parameters
  const route = useRoute();
  const {records} = route.params;

  // Function to handle date change
  const dateChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShowDate(Platform.OS === 'ios');
    setDate(currentDate);
  };

  // Function to handle date change
  const bmiColors = [
    '#8e44ad', // Underweight
    '#3498db', // Normal
    '#f1c40f', // Overweight
    '#e67e22', // Obese
    '#e74c3c', // Extremely Obese
  ];
  const pointerPositions = [-70, -35, 0, 35, 70];

  // Function to get recommendations based on BMI category
  const getRecommendations = bmiCategory => {
    switch (bmiCategory) {
      case 'Underweight':
        return 'Your BMI indicates that you are underweight. Consider a diet rich in nutrients and consult with a healthcare provider.';
      case 'Normal':
        return 'Your BMI is within the normal range. Keep maintaining a balanced diet and regular exercise.';
      case 'Overweight':
        return 'Your BMI indicates that you are overweight. Consider a balanced diet and regular physical activity.';
      case 'Obese':
        return 'Your BMI indicates obesity. It is recommended to consult with a healthcare provider for a suitable weight loss plan.';
      case 'Extremely Obese':
        return 'Your BMI indicates extreme obesity. It is crucial to seek medical advice to manage your weight effectively.';
      default:
        return '';
    }
  };

  // Function to handle weight and validation
  function handleWeight(e) {
    const weightVar = e;
    // Heaviest Recorded Weight: 635kg
    if (weightVar >= 0 && weightVar <= 700) {
      setWeightVerify(true);
      setWeight(weightVar);
    } else {
      setWeightVerify(false);
      setDialogTitle('Invalid Input');
      setDialogMessage('Please enter a weight between 0kg and 700kg.');
      setDialogType('info');
      setDialogVisible(true);
    }
  }

  // Function to handle height and validation
  function handleHeight(e) {
    const heightVar = e;
    // Tallest Recorded Height: 272cm
    if (heightVar >= 0 && heightVar <= 300) {
      setHeightVerify(true);
      setHeight(heightVar);
    } else {
      setHeightVerify(false);
      setDialogTitle('Invalid Input');
      setDialogMessage('Please enter a height between 0cm and 300cm.');
      setDialogType('info');
      setDialogVisible(true);
    }
  }

  // Recalculate BMI whenever weight or height changes
  useEffect(() => {
    calculateBmi(weight, height);
  }, [weight, height]);

  // Function to calculate BMI
  const calculateBmi = (weight, height) => {
    const weightNum = parseFloat(weight);
    const heightNum = parseFloat(height) / 100; // convert cm to meters
    if (weightVerify && heightVerify) {
      const bmiValue = (weightNum / (heightNum * heightNum)).toFixed(1);
      setBmi(bmiValue);
      determineBmiCategory(bmiValue);
    } else {
      setBmi(null);
      setBmiCategory('');
      setBmiRange('');
      setBmiIndex(null);
    }
  };

  // Function to determine BMI category
  const determineBmiCategory = bmi => {
    if (bmi < BMI_THRESHOLDS.UNDERWEIGHT) {
      setBmiCategory('Underweight');
      setBmiRange(`BMI < ${BMI_THRESHOLDS.UNDERWEIGHT}`);
      setBmiIndex(0);
    } else if (
      bmi >= BMI_THRESHOLDS.UNDERWEIGHT &&
      bmi <= BMI_THRESHOLDS.NORMAL
    ) {
      setBmiCategory('Normal');
      setBmiRange(
        `BMI ${BMI_THRESHOLDS.UNDERWEIGHT} - ${BMI_THRESHOLDS.NORMAL}`,
      );
      setBmiIndex(1);
    } else if (
      bmi > BMI_THRESHOLDS.NORMAL &&
      bmi <= BMI_THRESHOLDS.OVERWEIGHT
    ) {
      setBmiCategory('Overweight');
      setBmiRange(
        `BMI ${BMI_THRESHOLDS.NORMAL + 0.1} - ${BMI_THRESHOLDS.OVERWEIGHT}`,
      );
      setBmiIndex(2);
    } else if (bmi > BMI_THRESHOLDS.OVERWEIGHT && bmi <= BMI_THRESHOLDS.OBESE) {
      setBmiCategory('Obese');
      setBmiRange(
        `BMI ${BMI_THRESHOLDS.OVERWEIGHT + 0.1} - ${BMI_THRESHOLDS.OBESE}`,
      );
      setBmiIndex(3);
    } else if (bmi >= BMI_THRESHOLDS.EXTREMELY_OBESE) {
      setBmiCategory('Extremely Obese');
      setBmiRange(`BMI > ${BMI_THRESHOLDS.EXTREMELY_OBESE}`);
      setBmiIndex(4);
    }
  };

  // Function to get user email from AsyncStorage
  const getUserEmail = async () => {
    try {
      const userEmail = await AsyncStorage.getItem('userEmail');
      return userEmail;
    } catch (e) {
      console.error('Failed to load user ID.');
    }
  };

  // Function to show confirmation dialog
  const confirmationDialog = () => {
    setDialogTitle('Confirmation');
    setDialogMessage(
      `Your weight is ${weight} kg and height is ${height} cm, Are you sure you want to proceed?`,
    );
    setDialogType('confirm');
    setDialogVisible(true);
  };

  // Handle confirmation action from dialog
  const handleConfirm = () => {
    if (dialogType === 'confirm') {
      confirmSave(); // Proceed with the update
    } else if (dialogType === 'info' && dialogTitle === 'Success') {
      navigation.navigate('WeightBMI'); // Navigate to WeightBMI after showing recommendation
    }
    hideDialog(); // Hide the dialog after confirmation or info display
  };

  // Function to confirm saving the BMI record
  const confirmSave = async () => {
    calculateBmi(weight, height);
    // Get the userEmail from AsyncStorage
    const userEmail = await getUserEmail();
    const currentDateStr = date.toISOString().split('T')[0];

    // Check if any record exists for the current date
    const existingRecord = records.find(record =>
      record.date.startsWith(currentDateStr),
    );
    if (existingRecord) {
      setDialogTitle('Duplicate Entry');
      setDialogMessage('You have already added a BMI record for today.');
      setDialogType('info');
      setDialogVisible(true);
      return;
    }

    const bmidata = {
      email: userEmail,
      date: currentDateStr,
      weight: weight,
      height: height,
      bmi: bmi,
      bmiCategory: bmiCategory,
    };
    console.log('The formdata for bmi is: ', bmidata);
    if (weightVerify && heightVerify) {
      axios.post(endpoints.ADDWEIGHT, bmidata).then(res => {
        console.log(res.data);
        if (res.data.status == 'ok') {
          const recommendation = getRecommendations(bmidata.bmiCategory);
          // Dialog box for success
          setDialogTitle('Success');
          setDialogMessage(
            `Bmi Added Successfully.\n\nRecommendation: ${recommendation}`,
          );
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
      // Dialog box for error
      setDialogTitle('Alert');
      setDialogMessage('Please fill all mandatory fields');
      setDialogVisible(true);
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <Appbar.Header style={{backgroundColor: 'transparent'}}>
        <Appbar.BackAction
          onPress={() => {
            navigation.goBack();
          }}
        />
        <Appbar.Content titleStyle={{fontWeight: 'bold'}} title="New Record" />
        {/* Submit Button */}
        <Button mode="contained" onPress={confirmationDialog}>
          Save
        </Button>
      </Appbar.Header>
      {/* Date Picker */}
      <DateSurface
        date={date}
        showDate={showDate}
        setShowDate={setShowDate}
        dateChange={dateChange}
      />
      {/* Main Content */}
      <Card style={styles.card}>
        {/* Input */}
        <View style={styles.row}>
          <View style={styles.valueContainer}>
            <Text style={styles.labelText}>Weight (Kg)</Text>
            <TextInput
              mode="flat"
              value={weight}
              onChangeText={e => handleWeight(e)}
              style={styles.input}
              keyboardType="numeric"
              right={<TextInput.Icon size={20} icon="pencil" />}
            />
          </View>
          <View style={styles.valueContainer}>
            <Text style={styles.labelText}>Height (Cm)</Text>
            <TextInput
              mode="flat"
              value={height}
              onChangeText={e => handleHeight(e)}
              style={styles.input}
              keyboardType="numeric"
              right={<TextInput.Icon size={20} icon="pencil" />}
            />
          </View>
        </View>
        {/* Result */}
        <View style={styles.resultContainer}>
          <Text style={styles.resultText}>
            {bmi ? `${bmiCategory} (${bmi})` : 'BMI: --'}
          </Text>
          <Text style={styles.resultInfo}>
            {bmiRange ? `${bmiRange}` : '--'}
          </Text>
          <View style={styles.resultColorsContainer}>
            <View style={styles.resultColors}>
              {/* Color indicators */}
              {bmiColors.map((color, index) => (
                <View
                  key={color}
                  style={[styles.colorIndicator, {backgroundColor: color}]}
                />
              ))}
            </View>
            {bmiIndex !== null && (
              <Icon
                name="chevron-up"
                size={28}
                color="black"
                style={[styles.pointer, {left: pointerPositions[bmiIndex]}]}
              />
            )}
          </View>
        </View>
      </Card>
      {/* Alert message */}
      <CustomDialog
        visible={dialogVisible}
        hideDialog={hideDialog}
        title={dialogTitle}
        message={dialogMessage}
        onConfirm={handleConfirm}
        type={dialogType}
      />
    </View>
  );
};

export default AddWeightPage;
