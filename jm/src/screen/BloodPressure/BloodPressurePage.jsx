import React, { useState, useCallback } from 'react';
import { View, ScrollView, Dimensions } from 'react-native';
import { Text, Button, Card, Appbar } from 'react-native-paper';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { LineChart } from 'react-native-chart-kit';
import styles from './BloodPressurePageStyle';
import axios from 'axios';
import endpoints from '../../configs/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LoadingScreen from '../../components/LoadingScreen';
import regression from 'regression';

const screenWidth = Dimensions.get('window').width;

function BloodPressurePage() {
  const navigation = useNavigation();
  const [bpRecords, setBpRecords] = useState([]);
  const [stats, setStats] = useState({
    maxSystolic: 0,
    minSystolic: 0,
    avgSystolic: 0,
    maxDiastolic: 0,
    minDiastolic: 0,
    avgDiastolic: 0,
  });
  const [dateRange, setDateRange] = useState({
    startDate: null,
    endDate: null,
  });
  const [loading, setLoading] = useState(true);
  const [trendRecommendation, setTrendRecommendation] = useState('');
  const [labels, setLabels] = useState([]);
  const [systolicData, setSystolicData] = useState([]);
  const [diastolicData, setDiastolicData] = useState([]);

  // Fetch Blood Pressure records for the user
  const fetchUserBpRecords = async email => {
    try {
      const response = await axios.get(`${endpoints.GETBLOODPRESSURE}/${email}`);
      const records = response.data.data;
      console.log('BP records:', records);
      // Sort records by date
      records.sort((a, b) => new Date(a.date) - new Date(b.date));

      setBpRecords(records);
      calculateStats(records);
      updateChartData(records);
      setLoading(false);
      analyzeTrend(records);
    } catch (error) {
      console.error('Error fetching BP records:', error);
      setLoading(false);
    }
  };

  const analyzeTrend = records => {
    if (records.length < 2) {
      setTrendRecommendation('Not enough data to analyze the trend.');
      return;
    }

    const startDate = new Date(records[0].date);
    const daysFromStart = records.map(record => {
      const currentDate = new Date(record.date);
      return (currentDate - startDate) / (1000 * 60 * 60 * 24);
    });

    const systolic = records.map(record => record.systolic);
    const diastolic = records.map(record => record.diastolic);

    const systolicData = daysFromStart.map((days, index) => [days, systolic[index]]);
    const diastolicData = daysFromStart.map((days, index) => [days, diastolic[index]]);

    const systolicResult = regression.linear(systolicData);
    const diastolicResult = regression.linear(diastolicData);

    const systolicSlope = systolicResult.equation[0];
    const diastolicSlope = diastolicResult.equation[0];

    if (systolicSlope > 0 && diastolicSlope > 0) {
      setTrendRecommendation(
        'Both systolic and diastolic pressures have been trending upwards. Consider consulting with your healthcare provider.'
      );
    } else if (systolicSlope < 0 && diastolicSlope < 0) {
      setTrendRecommendation(
        'Both systolic and diastolic pressures have been trending downwards. Keep up the healthy lifestyle!'
      );
    } else if (systolicSlope > 0 || diastolicSlope > 0) {
      setTrendRecommendation(
        'There are mixed trends in your blood pressure readings. Consider consulting with your healthcare provider for a detailed analysis.'
      );
    } else {
      setTrendRecommendation(
        'Your blood pressure has been stable. Maintain your current lifestyle.'
      );
    }
  };

  useFocusEffect(
    useCallback(() => {
      const getEmailAndRecords = async () => {
        try {
          const userEmail = await AsyncStorage.getItem('userEmail');
          console.log('User email:', userEmail);
          if (userEmail) {
            fetchUserBpRecords(userEmail);
          } else {
            console.error('User email not found.');
            setLoading(false);
          }
        } catch (e) {
          console.error('Failed to load user email:', e);
          setLoading(false);
        }
      };

      getEmailAndRecords();
    }, [])
  );

  const calculateStats = records => {
    if (records.length === 0) return;

    const systolic = records.map(record => record.systolic);
    const diastolic = records.map(record => record.diastolic);

    const maxSystolic = Math.max(...systolic);
    const minSystolic = Math.min(...systolic);
    const avgSystolic = (systolic.reduce((sum, value) => sum + value, 0) / systolic.length).toFixed(1);

    const maxDiastolic = Math.max(...diastolic);
    const minDiastolic = Math.min(...diastolic);
    const avgDiastolic = (diastolic.reduce((sum, value) => sum + value, 0) / diastolic.length).toFixed(1);

    setStats({
      maxSystolic,
      minSystolic,
      avgSystolic,
      maxDiastolic,
      minDiastolic,
      avgDiastolic,
    });

    const dates = records.map(record => new Date(record.date));
    const startDate = new Date(Math.min(...dates));
    const endDate = new Date(Math.max(...dates));

    setDateRange({ startDate, endDate });
  };

  const updateChartData = records => {
    const labels = records.map(record => formatDate(new Date(record.date)));
    const systolicData = getValidChartData(records.map(record => record.systolic));
    const diastolicData = getValidChartData(records.map(record => record.diastolic));

    setLabels(labels);
    setSystolicData(systolicData);
    setDiastolicData(diastolicData);
  };

  const formatDate = date => {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const getValidChartData = data => {
    return data.map(value => {
      if (isNaN(value) || !isFinite(value)) {
        return 0; // or any default value you choose
      }
      return value;
    });
  };

  const chartConfig = {
    backgroundColor: '#333333',
    backgroundGradientFrom: '#333333',
    backgroundGradientTo: '#333333',
    decimalPlaces: 1,
    color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
    style: {
      borderRadius: 16,
    },
    propsForDots: {
      r: '6',
      strokeWidth: '2',
      stroke: '#ffa726',
    },
  };

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <View style={{ flex: 1 }}>
      {/* Header */}
      <Appbar.Header style={{ backgroundColor: 'transparent' }}>
        <Appbar.BackAction
          onPress={() => {
            navigation.goBack();
          }}
        />
        <Appbar.Content
          titleStyle={{ fontWeight: 'bold' }}
          title="Blood Pressure"
        />
      </Appbar.Header>
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        {/* Date Range */}
        <View style={styles.detailsContainer}>
          <Text style={styles.detailText}>Detail</Text>
          <View style={styles.dateRangeContainer}>
            {dateRange.startDate && dateRange.endDate && (
              <Text style={styles.dateRangeText}>
                {formatDate(dateRange.startDate)} -{' '}
                {formatDate(dateRange.endDate)}
              </Text>
            )}
          </View>
        </View>

        <Card style={styles.card}>
          <Card.Content>
            {/* Title */}
            <View style={styles.titleContainer}>
              <Text style={styles.title}>Systolic Pressure</Text>
              <Text style={styles.subtitle}>Unit: mmHg</Text>
            </View>
            {/* Stat */}
            <View style={styles.statContainer}>
              <View style={styles.statItem}>
                <Text style={styles.statLabel}>Max</Text>
                <Text style={styles.statValue}>{stats.maxSystolic}</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statLabel}>Min</Text>
                <Text style={styles.statValue}>{stats.minSystolic}</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statLabel}>Average</Text>
                <Text style={styles.statValue}>{stats.avgSystolic}</Text>
              </View>
            </View>
            <View style={styles.chartPlaceholder}>
              {systolicData.length > 0 && (
                <LineChart
                  data={{
                    labels: labels,
                    datasets: [
                      {
                        data: systolicData,
                        color: (opacity = 1) => `rgba(255, 99, 71, ${opacity})`, // tomato color
                        strokeWidth: 2,
                      },
                    ],
                  }}
                  width={screenWidth - 40}
                  height={240}
                  verticalLabelRotation={30}
                  yAxisLabel=""
                  yAxisSuffix=""
                  chartConfig={chartConfig}
                  bezier
                  style={{
                    marginVertical: 8,
                    borderRadius: 16,
                  }}
                />
              )}
            </View>
          </Card.Content>
        </Card>

        <Card style={styles.card}>
          <Card.Content>
            <Text style={styles.title}>Diastolic Pressure</Text>
            <View style={styles.statContainer}>
              <View style={styles.statItem}>
                <Text style={styles.statLabel}>Max</Text>
                <Text style={styles.statValue}>{stats.maxDiastolic}</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statLabel}>Min</Text>
                <Text style={styles.statValue}>{stats.minDiastolic}</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statLabel}>Average</Text>
                <Text style={styles.statValue}>{stats.avgDiastolic}</Text>
              </View>
            </View>
            <View style={styles.chartPlaceholder}>
              {diastolicData.length > 0 && (
                <LineChart
                  data={{
                    labels: labels,
                    datasets: [
                      {
                        data: diastolicData,
                        color: (opacity = 1) => `rgba(255, 99, 71, ${opacity})`, // tomato color
                        strokeWidth: 2,
                      },
                    ],
                  }}
                  width={screenWidth - 40}
                  height={240}
                  verticalLabelRotation={30}
                  yAxisLabel=""
                  yAxisSuffix=""
                  chartConfig={chartConfig}
                  bezier
                  style={{
                    marginVertical: 8,
                    borderRadius: 16,
                  }}
                />
              )}
            </View>
          </Card.Content>
        </Card>

        {/* Navigation Button */}
        <Button
          mode="elevated"
          onPress={() =>
            navigation.navigate('BloodPressureHistory', { records: bpRecords })
          }
          style={styles.historyButton}
        >
          View History
        </Button>

        {/* Trend Recommendation */}
        <Card style={styles.card}>
          <Card.Content>
            <Text style={styles.title}>Trend Recommendation</Text>
            <Text style={styles.recommendationText}>{trendRecommendation}</Text>
          </Card.Content>
        </Card>
      </ScrollView>

      <View style={styles.absoluteContainer}>
        <Button
          mode="contained"
          style={styles.addButton}
          onPress={() => {
            navigation.navigate('AddBloodPressure', { records: bpRecords })
          }}
        >
          + Add Record
        </Button>
      </View>
    </View>
  );
}

export default BloodPressurePage;
