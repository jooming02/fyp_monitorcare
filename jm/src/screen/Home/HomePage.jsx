import React, {useState, useCallback} from 'react';
import {View, ScrollView, TouchableOpacity, BackHandler} from 'react-native';
import {
  Button,
  Card,
  Text,
  Surface,
  Appbar,
} from 'react-native-paper';
import {useNavigation, useFocusEffect} from '@react-navigation/native';
import styles from './HomePageStyle';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import CustomDialog from '../../components/CustomDialog';
import useFCM from '../../components/useFCM';

function HomeScreen() {
  const navigation = useNavigation();

  // for the CustomDialog
  const [dialogVisible, setDialogVisible] = useState(false);
  const [dialogTitle, setDialogTitle] = useState('');
  const [dialogMessage, setDialogMessage] = useState('');
  const hideDialog = () => setDialogVisible(false);

  // Stop Going back from Home to Login
  const handleBackPress = () => {
    // Dialog box for Confirmation
    setDialogTitle('Confirmation');
    setDialogMessage('Are you sure you want to exit? ');
    setDialogVisible(true);
    return true; // Prevent the default back press action
  };

  // Call this function when confirming the dialog action
  function confirmBack() {
    hideDialog();
    BackHandler.exitApp();
  }

  // Focus Effect is used to avoid function applied to all screens in stack
  useFocusEffect(
    useCallback(() => {
      BackHandler.addEventListener('hardwareBackPress', handleBackPress);

      return () => {
        BackHandler.removeEventListener('hardwareBackPress', handleBackPress);
      };
    }, []),
  );

  // Initialize FCM 
  useFCM();

  return (
    <ScrollView
      contentContainerStyle={{flexGrow: 1}}
      showsVerticalScrollIndicator={false}>
      <View style={styles.container}>
        {/* Header */}
        <Appbar.Header style={{backgroundColor: 'transparent'}}>
          <Appbar.Content titleStyle={{fontWeight: 'bold'}} title="Home" />
        </Appbar.Header>

        <Card style={styles.card}>
          <Card.Content style={styles.cardContent}>
            <Icon name="water" size={40} />
            <Button
              mode="contained"
              style={styles.measureButton}
              onPress={() =>
                navigation.navigate('SubPage', {screen: 'AddBloodTest'})
              }>
              Measure Now →
            </Button>
          </Card.Content>
        </Card>

        <Text style={styles.diaryTitle}>Health Diary</Text>

        <View style={styles.diaryContainer}>
          <View style={styles.diaryRow}>
            <TouchableOpacity
              style={styles.diaryCardWrapper}
              onPress={() =>
                navigation.navigate('SubPage', {screen: 'BloodPressure'})
              }>
              <Surface style={styles.diaryCard}>
                <Icon name="heart-pulse" size={40} color="black" />
                <Text style={styles.diaryText}>Blood Pressure</Text>
                <Text style={styles.diaryValue}>--/-- mmHg</Text>
              </Surface>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.diaryCardWrapper}
              onPress={() =>
                navigation.navigate('SubPage', {screen: 'WeightBMI'})
              }>
              <Surface style={styles.diaryCard}>
                <Icon name="weight" size={40} color="black" />
                <Text style={styles.diaryText}>Weight & BMI</Text>
                <Text style={styles.diaryValue}>-- kg</Text>
              </Surface>
            </TouchableOpacity>
          </View>
          <View style={styles.diaryRowHalf}>
            <TouchableOpacity
              style={styles.diaryCardWrapper}
              onPress={() => 
                navigation.navigate('SubPage', {screen: 'Lifestyle'})
                }>
              <Surface style={styles.diaryCard}>
                <Icon name="run" size={40} color="black" />
                <Text style={styles.diaryText}>Lifestyle</Text>
                <Text style={styles.diaryValue}>-- mins</Text>
              </Surface>
            </TouchableOpacity>
          </View>
        </View>
      </View>
      <CustomDialog
        visible={dialogVisible}
        hideDialog={hideDialog}
        title={dialogTitle}
        message={dialogMessage}
        onConfirm={confirmBack}
        type="confirm"
      />
    </ScrollView>
  );
}

export default HomeScreen;
