import React, {useState, useEffect} from 'react';
import {View} from 'react-native';
import {Appbar, Text, Card, Button, TextInput} from 'react-native-paper';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useRoute} from '@react-navigation/native';
import styles from './AddBloodPressurePageStyle';
import endpoints from '../../configs/api.js';
import CustomDialog from '../../components/CustomDialog';
import DateSurface from '../../components/DateSurface';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {BP_THRESHOLDS} from '../../configs/health';

const AddBloodPressurePage = ({navigation}) => {
  const [systolic, setSystolic] = useState('100');
  const [diastolic, setDiastolic] = useState('75');
  const [pulse, setPulse] = useState('70');
  const [date, setDate] = useState(new Date());
  const [showDate, setShowDate] = useState(false);
  const [bpCategory, setBpCategory] = useState('');
  const [bpRange, setBpRange] = useState('');
  const [bpIndex, setBpIndex] = useState(null);

  // for the CustomDialog
  const [dialogVisible, setDialogVisible] = useState(false);
  const [dialogTitle, setDialogTitle] = useState('');
  const [dialogMessage, setDialogMessage] = useState('');
  const [dialogType, setDialogType] = useState('info');
  const hideDialog = () => setDialogVisible(false);

  const route = useRoute();
  const {records} = route.params;

  const dateChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShowDate(Platform.OS === 'ios');
    setDate(currentDate);
  };

  const handleSystolicChange = value => {
    const systolicNum = parseInt(value, 10);
    if (systolicNum < 0 || systolicNum > 300) {
      setDialogTitle('Invalid Input');
      setDialogMessage(
        'Please enter a systolic pressure between 0 and 300 mmHg.',
      );
      setDialogType('info');
      setDialogVisible(true);
    } else {
      setSystolic(value);
      determineBpCategory(value, diastolic);
    }
  };

  const handleDiastolicChange = value => {
    const diastolicNum = parseInt(value, 10);
    if (diastolicNum < 0 || diastolicNum > 200) {
      setDialogTitle('Invalid Input');
      setDialogMessage(
        'Please enter a diastolic pressure between 0 and 200 mmHg.',
      );
      setDialogType('info');
      setDialogVisible(true);
    } else {
      setDiastolic(value);
      determineBpCategory(systolic, value);
    }
  };

  const handlePulseChange = value => {
    const pulseNum = parseInt(value, 10);
    if (pulseNum < 0 || pulseNum > 220) {
      setDialogTitle('Invalid Input');
      setDialogMessage('Please enter a pulse between 0 and 220 bpm.');
      setDialogType('info');
      setDialogVisible(true);
    } else {
      setPulse(value);
    }
  };

  useEffect(() => {
    determineBpCategory(systolic, diastolic);
  }, [systolic, diastolic]);

  const determineBpCategory = (systolic, diastolic) => {
    if (!systolic || !diastolic) {
      setBpCategory('');
      setBpRange('');
      setBpIndex(null);
      return;
    }

    const systolicNum = parseInt(systolic, 10);
    const diastolicNum = parseInt(diastolic, 10);

    if (
      systolicNum < BP_THRESHOLDS.NORMAL.systolic &&
      diastolicNum < BP_THRESHOLDS.NORMAL.diastolic
    ) {
      setBpCategory('Normal');
      setBpRange(
        `Systolic < ${BP_THRESHOLDS.NORMAL.systolic} and Diastolic < ${BP_THRESHOLDS.NORMAL.diastolic}`,
      );
      setBpIndex(0);
    } else if (
      systolicNum <= BP_THRESHOLDS.ELEVATED.systolic &&
      diastolicNum < BP_THRESHOLDS.ELEVATED.diastolic
    ) {
      setBpCategory('Elevated');
      setBpRange(
        `Systolic ${BP_THRESHOLDS.NORMAL.systolic}-${BP_THRESHOLDS.ELEVATED.systolic} and Diastolic < ${BP_THRESHOLDS.ELEVATED.diastolic}`,
      );
      setBpIndex(1);
    } else if (
      (systolicNum <= BP_THRESHOLDS.HYPERTENSION_STAGE_1.systolic &&
        systolicNum > BP_THRESHOLDS.ELEVATED.systolic) ||
      (diastolicNum <= BP_THRESHOLDS.HYPERTENSION_STAGE_1.diastolic &&
        diastolicNum >= BP_THRESHOLDS.ELEVATED.diastolic)
    ) {
      setBpCategory('Hypertension Stage 1');
      setBpRange(
        `Systolic ${BP_THRESHOLDS.ELEVATED.systolic + 1}-${
          BP_THRESHOLDS.HYPERTENSION_STAGE_1.systolic
        } or Diastolic ${BP_THRESHOLDS.ELEVATED.diastolic + 1}-${
          BP_THRESHOLDS.HYPERTENSION_STAGE_1.diastolic
        }`,
      );
      setBpIndex(2);
    } else if (
      systolicNum >= BP_THRESHOLDS.HYPERTENSION_STAGE_2.systolic ||
      diastolicNum >= BP_THRESHOLDS.HYPERTENSION_STAGE_2.diastolic
    ) {
      setBpCategory('Hypertension Stage 2');
      setBpRange(
        `Systolic >= ${BP_THRESHOLDS.HYPERTENSION_STAGE_2.systolic} or Diastolic >= ${BP_THRESHOLDS.HYPERTENSION_STAGE_2.diastolic}`,
      );
      setBpIndex(3);
    } else if (
      systolicNum > BP_THRESHOLDS.HYPERTENSIVE_CRISIS.systolic ||
      diastolicNum > BP_THRESHOLDS.HYPERTENSIVE_CRISIS.diastolic
    ) {
      setBpCategory('Hypertensive Crisis');
      setBpRange(
        `Systolic > ${BP_THRESHOLDS.HYPERTENSIVE_CRISIS.systolic} or Diastolic > ${BP_THRESHOLDS.HYPERTENSIVE_CRISIS.diastolic}`,
      );
      setBpIndex(4);
    } else {
      setBpCategory('');
      setBpRange('');
      setBpIndex(null);
    }
  };

  const getRecommendations = bpCategory => {
    switch (bpCategory) {
      case 'Normal':
        return 'Your blood pressure is normal. Keep maintaining a healthy lifestyle.';
      case 'Elevated':
        return 'Your blood pressure is elevated. Consider lifestyle changes to lower it.';
      case 'Hypertension Stage 1':
        return 'You have hypertension stage 1. Consult with a healthcare provider for advice.';
      case 'Hypertension Stage 2':
        return 'You have hypertension stage 2. It is recommended to seek medical advice.';
      case 'Hypertensive Crisis':
        return 'Hypertensive crisis detected. Seek immediate medical attention.';
      default:
        return '';
    }
  };

  const getUserEmail = async () => {
    try {
      const userEmail = await AsyncStorage.getItem('userEmail');
      return userEmail;
    } catch (e) {
      console.error('Failed to load user ID.');
    }
  };

  const confirmSave = async () => {
    // Get the userEmail from AsyncStorage
    const userEmail = await getUserEmail();

    const currentDateStr = date.toISOString().split('T')[0];
    // Check if any record exists for the current date
    const existingRecord = records.find(record =>
      record.date.startsWith(currentDateStr),
    );

    // prevent duplicate blood pressure entries for the same day
    if (existingRecord) {
      setDialogTitle('Duplicate Entry');
      setDialogMessage(
        'You have already added a blood pressure record for today.',
      );
      setDialogType('info');
      setDialogVisible(true);
      return;
    }

    const bpData = {
      email: userEmail,
      date: currentDateStr,
      systolic: parseInt(systolic, 10),
      diastolic: parseInt(diastolic, 10),
      pulse: parseInt(pulse, 10),
      category: bpCategory,
    };
    console.log('The formdata for blood pressure is: ', bpData);

    if (systolic && diastolic && pulse) {
      axios.post(endpoints.ADDBLOODPRESSURE, bpData).then(res => {
        console.log(res.data);
        if (res.data.status == 'ok') {
          const recommendation = getRecommendations(bpData.category);
          // Dialog box for success
          setDialogTitle('Success');
          setDialogMessage(
            `Blood Pressure Added Successfully.\n\nRecommendation: ${recommendation}`,
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

  const confirmationDialog = () => {
    setDialogTitle('Confirmation');
    setDialogMessage(
      `Your systolic pressure is ${systolic} mmHg, diastolic pressure is ${diastolic} mmHg, and pulse is ${pulse} bpm. Are you sure you want to proceed?`,
    );
    setDialogType('confirm');
    setDialogVisible(true);
  };

  const handleConfirm = () => {
    if (dialogType === 'confirm') {
      confirmSave(); // Proceed with the update
    } else if (dialogType === 'info' && dialogTitle === 'Success') {
      navigation.navigate('BloodPressure'); // Navigate to BloodPressure after showing success message
    }
    hideDialog(); // Hide the dialog after confirmation or info display
  };

  const bpColors = [
    '#2ecc71', // Normal
    '#f1c40f', // Elevated
    '#e67e22', // Hypertension Stage 1
    '#e74c3c', // Hypertension Stage 2
    '#c0392b', // Hypertensive Crisis
  ];

  const pointerPositions = [-70, -35, 0, 35, 70];

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
        <View style={styles.row}>
          <View style={styles.valueContainer}>
            <Text style={styles.labelText}>Systolic Pressure (mmHg)</Text>
            <TextInput
              mode="flat"
              value={systolic}
              onChangeText={handleSystolicChange}
              keyboardType="numeric"
              right={<TextInput.Icon size={20} icon="pencil" />}
            />
          </View>
          <View style={styles.valueContainer}>
            <Text style={styles.labelText}>Diastolic Pressure (mmHg)</Text>
            <TextInput
              mode="flat"
              value={diastolic}
              onChangeText={handleDiastolicChange}
              keyboardType="numeric"
              right={<TextInput.Icon size={20} icon="pencil" />}
            />
          </View>
        </View>
        <View style={styles.row}>
          <View style={styles.valueContainer}>
            <Text style={styles.labelText}>Pulse (bpm)</Text>
            <TextInput
              mode="flat"
              value={pulse}
              onChangeText={handlePulseChange}
              keyboardType="numeric"
              right={<TextInput.Icon size={20} icon="pencil" />}
            />
          </View>
        </View>
        <View style={styles.resultContainer}>
          <Text style={styles.resultText}>
            {bpCategory ? `${bpCategory}` : 'BP: --'}
          </Text>
          <Text style={styles.resultInfo}>{bpRange ? `${bpRange}` : '--'}</Text>
          <View style={styles.resultColorsContainer}>
            <View style={styles.resultColors}>
              {bpColors.map((color, index) => (
                <View
                  key={color}
                  style={[styles.colorIndicator, {backgroundColor: color}]}
                />
              ))}
            </View>
            {bpIndex !== null && (
              <Icon
                name="chevron-up"
                size={28}
                color="black"
                style={[styles.pointer, {left: pointerPositions[bpIndex]}]}
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

export default AddBloodPressurePage;
