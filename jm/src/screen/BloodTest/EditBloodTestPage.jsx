import React, {useState} from 'react';
import {View, ScrollView} from 'react-native';
import {TextInput, Button, Card, Appbar} from 'react-native-paper';
import {useNavigation, useRoute} from '@react-navigation/native';
import DateSurface from '../../components/DateSurface';
import axios from 'axios';
import {bloodTestNormalRanges} from '../../configs/health';
import endpoints from '../../configs/api';
import styles from './EditBloodTestPageStyle';
import CustomDialog from '../../components/CustomDialog';
import LoadingScreen from '../../components/LoadingScreen';
import AsyncStorage from '@react-native-async-storage/async-storage';

const EditBloodTestPage = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const {record} = route.params;

  const [showDate, setShowDate] = useState(false);
  const [loading, setLoading] = useState(false);

  // for the CustomDialog
  const [dialogVisible, setDialogVisible] = useState(false);
  const [dialogTitle, setDialogTitle] = useState('');
  const [dialogMessage, setDialogMessage] = useState('');
  const [dialogType, setDialogType] = useState('info');
  const hideDialog = () => setDialogVisible(false);

  const [initialDate] = useState(new Date(record.date));

  const [formData, setFormData] = useState({
    date: new Date(record.date),

    haemoglobin: record.haemoglobin?.toString() || '',
    rbcCount: record.rbcCount?.toString() || '',
    totalWbcCount: record.totalWbcCount?.toString() || '',
    pcv: record.pcv?.toString() || '',
    mcv: record.mcv?.toString() || '',
    mch: record.mch?.toString() || '',
    mchc: record.mchc?.toString() || '',
    rdw: record.rdw?.toString() || '',
    neutrophils: record.neutrophils?.toString() || '',
    lymphocytes: record.lymphocytes?.toString() || '',
    eosinophils: record.eosinophils?.toString() || '',
    monocytes: record.monocytes?.toString() || '',
    basophils: record.basophils?.toString() || '',
    plateletCount: record.plateletCount?.toString() || '',

    glucose: record.glucose?.toString() || '',
    bicarbonate: record.bicarbonate?.toString() || '',
    calcium: record.calcium?.toString() || '',
    chloride: record.chloride?.toString() || '',
    magnesium: record.magnesium?.toString() || '',
    phosphorus: record.phosphorus?.toString() || '',
    potassium: record.potassium?.toString() || '',
    sodium: record.sodium?.toString() || '',

    totalCholesterol: record.totalCholesterol?.toString() || '',
    ldlCholesterol: record.ldlCholesterol?.toString() || '',
    hdlCholesterol: record.hdlCholesterol?.toString() || '',
    triglycerides: record.triglycerides?.toString() || '',
  });

  const handleInputChange = (name, value) => {
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const dateChange = (event, selectedDate) => {
    setShowDate(Platform.OS === 'ios');
    handleInputChange('date', selectedDate);
  };

  const getUserEmail = async () => {
    try {
      const userEmail = await AsyncStorage.getItem('userEmail');
      return userEmail;
    } catch (e) {
      console.error('Failed to load user ID.');
    }
  };

  const checkExistingRecord = async (email, date) => {
    try {
      const response = await axios.get(`${endpoints.GETBLOODTEST}/${email}`);
      const records = response.data.data;
      const existingRecord = records.find(record =>
        record.date.startsWith(date),
      );
      return existingRecord;
    } catch (error) {
      console.error('Error checking existing blood test record:', error);
      return false;
    }
  };

  const confirmSave = async () => {
    // Get the userEmail from AsyncStorage
    const userEmail = await getUserEmail();

    if (!userEmail) {
      console.error('User email not found.');
      return;
    }

    const formattedDate = formData.date.toISOString().split('T')[0];
    // Check if any record exists for the current date if the date has changed
    if (initialDate.toISOString().split('T')[0] !== formattedDate) {
      const existingRecord = await checkExistingRecord(
        userEmail,
        formattedDate,
      );

      if (existingRecord) {
        setDialogTitle('Alert');
        setDialogMessage(
          'A blood test record already exists for the selected date.',
        );
        setDialogType('info');
        setDialogVisible(true);
        return;
      }
    }
    setLoading(true);

    try {
      const response = await axios.post(endpoints.UPDATEBLOODTEST, {
        ...formData,
        id: record._id,
      });
      if (response.data.status === 'success') {
        setDialogTitle('Success');
        setDialogMessage('Updated Successfully');
        setDialogType('info');
        setDialogVisible(true);
      } else {
        console.error('Failed to update blood test data.');
      }
    } catch (error) {
      console.error('Error updating blood test data:', error);
    } finally {
      setLoading(false);
    }
  };

  const confirmDelete = async () => {
    setLoading(true);
    try {
      const response = await axios.post(endpoints.DELETEBLOODTEST, {
        id: record._id,
      });
      if (response.data.status === 'success') {
        navigation.goBack();
      } else {
        console.error('Failed to delete blood test data.');
      }
    } catch (error) {
      console.error('Error deleting blood test data:', error);
    } finally {
      setLoading(false);
    }
  };

  const confirmationDialog = type => {
    if (type === 'delete') {
      setDialogTitle('Delete Confirmation');
      setDialogMessage('Are you sure you want to delete this record?');
      setDialogType('confirm');
    } else {
      setDialogTitle('Save Confirmation');
      setDialogMessage('Are you sure you want to save changes?');
      setDialogType('confirm');
    }
    setDialogVisible(true);
  };

  const handleConfirm = () => {
    if (dialogTitle === 'Save Confirmation') {
      confirmSave(); // Proceed with the update
    } else if (dialogTitle === 'Delete Confirmation') {
      confirmDelete(); // Proceed with the delete
    } else if (dialogTitle === 'Success') {
      navigation.goBack(); // Navigate back after showing success dialog
    }
    hideDialog(); // Hide the dialog after confirmation or info display
  };

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <View style={{flex: 1}}>
      {/* Header */}
      <Appbar.Header style={{backgroundColor: 'transparent'}}>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content titleStyle={{fontWeight: 'bold'}} title="Manage" />
        {/* Edit Button */}
        <Button mode="contained" onPress={() => confirmationDialog('confirm')}>
          Save
        </Button>
        {/* Delete Button */}
        <Button
          mode="contained"
          onPress={() => confirmationDialog('delete')}
          style={{marginLeft: 10}}>
          Delete
        </Button>
      </Appbar.Header>
      <ScrollView contentContainerStyle={styles.container}>
        {/* Date Picker */}
        <DateSurface
          date={formData.date}
          showDate={showDate}
          setShowDate={setShowDate}
          dateChange={dateChange}
        />

        {/* Complete Blood Count (CBC) */}
        <Card style={styles.card}>
          <Card.Title title="Complete Blood Count (CBC)" />
          <Card.Content>
            <TextInput
              mode="outlined"
              label={`Haemoglobin (Normal: ${bloodTestNormalRanges.haemoglobin})`}
              value={formData.haemoglobin}
              onChangeText={value => handleInputChange('haemoglobin', value)}
              keyboardType="numeric"
              style={styles.input}
            />
            <TextInput
              mode="outlined"
              label={`RBC Count (Normal: ${bloodTestNormalRanges.rbcCount})`}
              value={formData.rbcCount}
              onChangeText={value => handleInputChange('rbcCount', value)}
              keyboardType="numeric"
              style={styles.input}
            />
            <TextInput
              mode="outlined"
              label={`Total WBC Count (Normal: ${bloodTestNormalRanges.totalWbcCount})`}
              value={formData.totalWbcCount}
              onChangeText={value => handleInputChange('totalWbcCount', value)}
              keyboardType="numeric"
              style={styles.input}
            />
            <TextInput
              mode="outlined"
              label={`PCV (Normal: ${bloodTestNormalRanges.pcv})`}
              value={formData.pcv}
              onChangeText={value => handleInputChange('pcv', value)}
              keyboardType="numeric"
              style={styles.input}
            />
            <TextInput
              mode="outlined"
              label={`MCV (Normal: ${bloodTestNormalRanges.mcv})`}
              value={formData.mcv}
              onChangeText={value => handleInputChange('mcv', value)}
              keyboardType="numeric"
              style={styles.input}
            />
            <TextInput
              mode="outlined"
              label={`MCH (Normal: ${bloodTestNormalRanges.mch})`}
              value={formData.mch}
              onChangeText={value => handleInputChange('mch', value)}
              keyboardType="numeric"
              style={styles.input}
            />
            <TextInput
              mode="outlined"
              label={`MCHC (Normal: ${bloodTestNormalRanges.mchc})`}
              value={formData.mchc}
              onChangeText={value => handleInputChange('mchc', value)}
              keyboardType="numeric"
              style={styles.input}
            />
            <TextInput
              mode="outlined"
              label={`RDW (Normal: ${bloodTestNormalRanges.rdw})`}
              value={formData.rdw}
              onChangeText={value => handleInputChange('rdw', value)}
              keyboardType="numeric"
              style={styles.input}
            />
            <TextInput
              mode="outlined"
              label={`Neutrophils (Normal: ${bloodTestNormalRanges.neutrophils})`}
              value={formData.neutrophils}
              onChangeText={value => handleInputChange('neutrophils', value)}
              keyboardType="numeric"
              style={styles.input}
            />
            <TextInput
              mode="outlined"
              label={`Lymphocytes (Normal: ${bloodTestNormalRanges.lymphocytes})`}
              value={formData.lymphocytes}
              onChangeText={value => handleInputChange('lymphocytes', value)}
              keyboardType="numeric"
              style={styles.input}
            />
            <TextInput
              mode="outlined"
              label={`Eosinophils (Normal: ${bloodTestNormalRanges.eosinophils})`}
              value={formData.eosinophils}
              onChangeText={value => handleInputChange('eosinophils', value)}
              keyboardType="numeric"
              style={styles.input}
            />
            <TextInput
              mode="outlined"
              label={`Monocytes (Normal: ${bloodTestNormalRanges.monocytes})`}
              value={formData.monocytes}
              onChangeText={value => handleInputChange('monocytes', value)}
              keyboardType="numeric"
              style={styles.input}
            />
            <TextInput
              mode="outlined"
              label={`Basophils (Normal: ${bloodTestNormalRanges.basophils})`}
              value={formData.basophils}
              onChangeText={value => handleInputChange('basophils', value)}
              keyboardType="numeric"
              style={styles.input}
            />
            <TextInput
              mode="outlined"
              label={`Platelet Count (Normal: ${bloodTestNormalRanges.plateletCount})`}
              value={formData.plateletCount}
              onChangeText={value => handleInputChange('plateletCount', value)}
              keyboardType="numeric"
              style={styles.input}
            />
          </Card.Content>
        </Card>

        {/* Comprehensive Metabolic Panel (CMP) */}
        <Card style={styles.card}>
          <Card.Title title="Comprehensive Metabolic Panel (CMP)" />
          <Card.Content>
            <TextInput
              mode="outlined"
              label={`Glucose (Normal: ${bloodTestNormalRanges.glucose})`}
              value={formData.glucose}
              onChangeText={value => handleInputChange('glucose', value)}
              keyboardType="numeric"
              style={styles.input}
            />
            <TextInput
              mode="outlined"
              label={`Bicarbonate (Normal: ${bloodTestNormalRanges.bicarbonate})`}
              value={formData.bicarbonate}
              onChangeText={value => handleInputChange('bicarbonate', value)}
              keyboardType="numeric"
              style={styles.input}
            />
            <TextInput
              mode="outlined"
              label={`Calcium (Normal: ${bloodTestNormalRanges.calcium})`}
              value={formData.calcium}
              onChangeText={value => handleInputChange('calcium', value)}
              keyboardType="numeric"
              style={styles.input}
            />
            <TextInput
              mode="outlined"
              label={`Chloride (Normal: ${bloodTestNormalRanges.chloride})`}
              value={formData.chloride}
              onChangeText={value => handleInputChange('chloride', value)}
              keyboardType="numeric"
              style={styles.input}
            />
            <TextInput
              mode="outlined"
              label={`Magnesium (Normal: ${bloodTestNormalRanges.magnesium})`}
              value={formData.magnesium}
              onChangeText={value => handleInputChange('magnesium', value)}
              keyboardType="numeric"
              style={styles.input}
            />
            <TextInput
              mode="outlined"
              label={`Phosphorus (Normal: ${bloodTestNormalRanges.phosphorus})`}
              value={formData.phosphorus}
              onChangeText={value => handleInputChange('phosphorus', value)}
              keyboardType="numeric"
              style={styles.input}
            />
            <TextInput
              mode="outlined"
              label={`Potassium (Normal: ${bloodTestNormalRanges.potassium})`}
              value={formData.potassium}
              onChangeText={value => handleInputChange('potassium', value)}
              keyboardType="numeric"
              style={styles.input}
            />
            <TextInput
              mode="outlined"
              label={`Sodium (Normal: ${bloodTestNormalRanges.sodium})`}
              value={formData.sodium}
              onChangeText={value => handleInputChange('sodium', value)}
              keyboardType="numeric"
              style={styles.input}
            />
          </Card.Content>
        </Card>

        {/* Lipid Profile */}
        <Card style={styles.card}>
          <Card.Title title="Lipid Profile" />
          <Card.Content>
            <TextInput
              mode="outlined"
              label={`Total Cholesterol (Normal: ${bloodTestNormalRanges.totalCholesterol})`}
              value={formData.totalCholesterol}
              onChangeText={value =>
                handleInputChange('totalCholesterol', value)
              }
              keyboardType="numeric"
              style={styles.input}
            />
            <TextInput
              mode="outlined"
              label={`HDL Cholesterol (Normal: ${bloodTestNormalRanges.hdlCholesterol})`}
              value={formData.hdlCholesterol}
              onChangeText={value => handleInputChange('hdlCholesterol', value)}
              keyboardType="numeric"
              style={styles.input}
            />
            <TextInput
              mode="outlined"
              label={`LDL Cholesterol (Normal: ${bloodTestNormalRanges.ldlCholesterol})`}
              value={formData.ldlCholesterol}
              onChangeText={value => handleInputChange('ldlCholesterol', value)}
              keyboardType="numeric"
              style={styles.input}
            />
            <TextInput
              mode="outlined"
              label={`Triglycerides (Normal: ${bloodTestNormalRanges.triglycerides})`}
              value={formData.triglycerides}
              onChangeText={value => handleInputChange('triglycerides', value)}
              keyboardType="numeric"
              style={styles.input}
            />
          </Card.Content>
        </Card>
      </ScrollView>
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

export default EditBloodTestPage;
