import React, {useState, useCallback} from 'react';
import {View, FlatList, TouchableOpacity} from 'react-native';
import {Appbar, Card, Text} from 'react-native-paper';
import {useNavigation, useFocusEffect} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import styles from './BloodTestHistoryPageStyle';
import axios from 'axios';
import endpoints from '../../configs/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LoadingScreen from '../../components/LoadingScreen';

const BloodTestHistoryPage = () => {
  const [bloodTestRecords, setBloodTestRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  // Fetch Blood Test records for the user
  const fetchUserBloodTestRecords = async email => {
    try {
      const response = await axios.get(`${endpoints.GETBLOODTEST}/${email}`);
      const records = response.data.data;
      console.log('Blood Test records:', records);
      // Sort records by date
      records.sort((a, b) => new Date(a.date) - new Date(b.date));

      setBloodTestRecords(records);
    } catch (error) {
      console.error('Error fetching BMI records:', error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      const getEmailAndRecords = async () => {
        try {
          const userEmail = await AsyncStorage.getItem('userEmail');
          console.log('User email:', userEmail);
          if (userEmail) {
            fetchUserBloodTestRecords(userEmail);
          } else {
            console.error('User email not found.');
          }
        } catch (e) {
          console.error('Failed to load user email:', e);
        }
      };

      getEmailAndRecords();
    }, []),
  );

  const formatDate = date => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const handleSelectItem = item => {
    console.log('Selected item:', item);
    navigation.navigate('SubPage', {
      screen: 'EditBloodTest',
      params: {record: item},
    });
  };

  const renderItem = ({item}) => (
    <TouchableOpacity onPress={() => handleSelectItem(item)}>
      <Card style={styles.card}>
        <Card.Content style={styles.cardContent}>
          <View style={styles.focusContainer}>
            <Icon name="calendar" size={20} color="#888" />
            <Text style={styles.focus}>{formatDate(item.date)}</Text>
          </View>
          <View style={styles.cardInfo}>
            <View style={styles.infoRow}>
              <Icon name="test-tube" size={20} color="#888" />
              <Text style={styles.detailText}>Glucose: {item.glucose}</Text>
            </View>
            <View style={styles.infoRow}>
              <Icon name="test-tube" size={20} color="#888" />
              <Text style={styles.detailText}>
                Cholesterol: {item.totalCholesterol}
              </Text>
            </View>
          </View>
        </Card.Content>
      </Card>
    </TouchableOpacity>
  );

  return (
    <View style={{flex: 1}}>
      <View style={styles.container}>
        {/* Header */}
        <Appbar.Header style={{backgroundColor: 'transparent'}}>
          <Appbar.Content
            titleStyle={{fontWeight: 'bold'}}
            title="Blood Test History"
          />
        </Appbar.Header>
        {/* Loading Indicator */}
        {loading ? (
          <LoadingScreen />
        ) : // Blood Test Records List
        bloodTestRecords.length === 0 ? (
          <View style={styles.noRecordsContainer}>
            <Text style={styles.noRecordsText}>No records found.</Text>
          </View>
        ) : (
          <FlatList
            data={bloodTestRecords}
            renderItem={renderItem}
            keyExtractor={item => item._id.toString()}
            contentContainerStyle={styles.listContent}
          />
        )}
      </View>
    </View>
  );
};

export default BloodTestHistoryPage;
