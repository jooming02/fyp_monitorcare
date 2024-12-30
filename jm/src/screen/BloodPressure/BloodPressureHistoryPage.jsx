import React, { useState } from 'react';
import { View, FlatList, TouchableOpacity } from 'react-native';
import { Appbar, Card, Text, Button, useTheme } from 'react-native-paper';
import { useNavigation, useRoute } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import styles from './BloodPressureHistoryPageStyle';
import axios from 'axios';
import endpoints from '../../configs/api';
import CustomDialog from '../../components/CustomDialog';

const BloodPressureHistoryPage = () => {
  const theme = useTheme();
  const navigation = useNavigation();
  const [selectedRecords, setSelectedRecords] = useState([]);
  const route = useRoute();
  const { records } = route.params; 
  const [dialogVisible, setDialogVisible] = useState(false);
  const [dialogTitle, setDialogTitle] = useState('');
  const [dialogMessage, setDialogMessage] = useState('');
  const [dialogType, setDialogType] = useState('info');
  const hideDialog = () => setDialogVisible(false);

  const formatDate = date => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const handleSelectItem = item => {
    setSelectedRecords(prevSelectedRecords =>
      prevSelectedRecords.includes(item._id)
        ? prevSelectedRecords.filter(id => id !== item._id)
        : [...prevSelectedRecords, item._id]
    );
  };

  const handleDelete = () => {
    setDialogTitle('Delete Records');
    setDialogMessage('Are you sure you want to delete the selected records?');
    setDialogType('confirm');
    setDialogVisible(true);
  };

  const confirmDelete = async () => {
    setDialogVisible(false);
    console.log('Deleting records:', selectedRecords);
    try {
      const response = await axios.post(endpoints.DELETEBLOODPRESSURE, {
        ids: selectedRecords,
      });
      if (response.data.status === 'success') {
        // Filter out the deleted records
        const updatedRecords = records.filter(
          record => !selectedRecords.includes(record._id)
        );
        setSelectedRecords([]);
        // Update the records in the parent component
        navigation.setParams({ records: updatedRecords });

        // Show success dialog
        setDialogTitle('Success');
        setDialogMessage('Records deleted successfully.');
        setDialogType('info');
        setDialogVisible(true);
      }
    } catch (error) {
      console.error('Error deleting records:', error);
    }
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity onPress={() => handleSelectItem(item)}>
      <Card
        style={[
          styles.card,
          selectedRecords.includes(item._id) && styles.selectedCard,
        ]}
      >
        <Card.Content style={styles.cardContent}>
          <View style={styles.focusContainer}>
            <Icon name="heart-pulse" size={24} color="#000" />
            <Text style={styles.focus}>{item.systolic}/{item.diastolic} mmHg</Text>
          </View>
          <View style={styles.cardInfo}>
            <View style={styles.infoRow}>
              <Icon name="heart" size={20} color="#888" />
              <Text style={styles.detailText}>Pulse: {item.pulse} bpm</Text>
            </View>
            <View style={styles.infoRow}>
              <Icon name="chart-bubble" size={20} color="#888" />
              <Text style={styles.bpCategory}>{item.category}</Text>
            </View>
            <View style={styles.infoRow}>
              <Icon name="calendar" size={20} color="#888" />
              <Text style={styles.detailText}>{formatDate(item.date)}</Text>
            </View>
          </View>
          {selectedRecords.includes(item._id) && (
            <Icon name="check-circle" size={24} color={theme.colors.primary} style={styles.selectedIcon} />
          )}
        </Card.Content>
      </Card>
    </TouchableOpacity>
  );

  return (
    <View style={{ flex: 1 }}>
      {/* Header */}
      <Appbar.Header style={{ backgroundColor: 'transparent' }}>
        <Appbar.BackAction
          onPress={() => {
            navigation.goBack();
          }}
        />
        <Appbar.Content titleStyle={{ fontWeight: 'bold' }} title="History" />
      </Appbar.Header>

      <View style={styles.container}>
        {/* Delete */}
        <View style={styles.filterContainer}>
          {selectedRecords.length > 0 && (
            <Button mode="contained" onPress={handleDelete} style={styles.deleteButton}>
              Delete
            </Button>
          )}
        </View>
        {/* Blood Pressure Records List */}
        {records.length === 0 ? (
          <View style={styles.noRecordsContainer}>
            <Text style={styles.noRecordsText}>No records found.</Text>
          </View>
        ) : (
          <FlatList
            data={records}
            renderItem={renderItem}
            keyExtractor={item => item._id.toString()}
            contentContainerStyle={styles.listContent}
          />
        )}
      </View>
      <CustomDialog
        visible={dialogVisible}
        hideDialog={hideDialog}
        title={dialogTitle}
        message={dialogMessage}
        onConfirm={dialogType === 'confirm' ? confirmDelete : hideDialog}
        type={dialogType}
      />
    </View>
  );
};

export default BloodPressureHistoryPage;
