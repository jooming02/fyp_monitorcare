import React, {useState, useCallback} from 'react';
import {View, ScrollView, Dimensions} from 'react-native';
import {Text, Button, Card, Appbar} from 'react-native-paper';
import {useNavigation, useFocusEffect} from '@react-navigation/native';
import styles from './WeightBMIPageStyle';
import axios from 'axios';
import endpoints from '../../configs/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LoadingScreen from '../../components/LoadingScreen';
import {LineChart} from 'react-native-chart-kit';
import regression from 'regression';

const screenWidth = Dimensions.get('window').width;

function WeightBMIPage() {
  const navigation = useNavigation();
  const [bmiRecords, setBmiRecords] = useState([]);
  const [stats, setStats] = useState({
    maxWeight: 0,
    minWeight: 0,
    avgWeight: 0,
    maxBMI: 0,
    minBMI: 0,
    avgBMI: 0,
  });
  const [dateRange, setDateRange] = useState({
    startDate: null,
    endDate: null,
  });
  const [loading, setLoading] = useState(true);
  const [trendRecommendation, setTrendRecommendation] = useState('');
  const [labels, setLabels] = useState([]);
  const [weightData, setWeightData] = useState([]);
  const [bmiData, setBmiData] = useState([]);

  // Fetch BMI records for the user
  const fetchUserBmiRecords = async email => {
    try {
      const response = await axios.get(`${endpoints.GETWEIGHT}/${email}`);
      const records = response.data.data;
      console.log('BMI records:', records);
      // Sort records by date
      records.sort((a, b) => new Date(a.date) - new Date(b.date));

      setBmiRecords(records);
      calculateStats(records);
      updateChartData(records);
      setLoading(false);
      analyzeTrend(records);
    } catch (error) {
      console.error('Error fetching BMI records:', error);
      setLoading(false);
    }
  };

  // Analyze trend using linear equation, 
  const analyzeTrend = records => {
    if (records.length < 2) {
      setTrendRecommendation('Not enough data to analyze the trend.');
      return;
    }

    // Get the start date
    const startDate = new Date(records[0].date);
    // Calculate the number of days from the start date for each record
    const daysFromStart = records.map(record => {
      const currentDate = new Date(record.date);
      return (currentDate - startDate) / (1000 * 60 * 60 * 24); // Convert milliseconds to days
    });

    const bmis = records.map(record => record.bmi);

    const data = daysFromStart.map((days, index) => [days, bmis[index]]);

    const result = regression.linear(data);
    // result.equation is an array with the slope and y-intercept, 
    //the first index is slope and the second is y-intercept
    const slope = result.equation[0];

    console.log('Equation:', result.equation);

    if (slope > 0) {
      setTrendRecommendation(
        'Your BMI has been trending upwards. Consider reviewing your diet and exercise routine.',
      );
    } else if (slope < 0) {
      setTrendRecommendation(
        'Your BMI has been trending downwards. Keep up the good work!',
      );
    } else {
      setTrendRecommendation(
        'Your BMI has been stable. Maintain your current lifestyle.',
      );
    }
  };

  // Use focus effect to fetch records when the screen is focused
  useFocusEffect(
    useCallback(() => {
      const getEmailAndRecords = async () => {
        try {
          const userEmail = await AsyncStorage.getItem('userEmail');
          console.log('User email:', userEmail);
          if (userEmail) {
            // Fetch BMI records
            fetchUserBmiRecords(userEmail);
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
    }, []),
  );

  // Calculate statistics from records
  const calculateStats = records => {
    if (records.length === 0) return;

    const weights = records.map(record => record.weight);
    const bmis = records.map(record => record.bmi);
    const maxWeight = Math.max(...weights);
    const minWeight = Math.min(...weights);
    const avgWeight = (
      weights.reduce((sum, weight) => sum + weight, 0) / weights.length
    ).toFixed(1);
    const maxBMI = Math.max(...bmis);
    const minBMI = Math.min(...bmis);
    const avgBMI = (
      bmis.reduce((sum, bmi) => sum + bmi, 0) / bmis.length
    ).toFixed(1);

    setStats({
      maxWeight,
      minWeight,
      avgWeight,
      maxBMI,
      minBMI,
      avgBMI,
    });

    const dates = records.map(record => new Date(record.date));
    const startDate = new Date(Math.min(...dates));
    const endDate = new Date(Math.max(...dates));

    setDateRange({startDate, endDate});
  };

  const updateChartData = records => {
    const labels = records.map(record => formatDate(new Date(record.date)));
    const weightData = getValidChartData(records.map(record => record.weight));
    const bmiData = getValidChartData(records.map(record => record.bmi));

    setLabels(labels);
    setWeightData(weightData);
    setBmiData(bmiData);
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
    decimalPlaces: 1, // optional, defaults to 2dp
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
    <View style={{flex: 1}}>
      {/* Header */}
      <Appbar.Header style={{backgroundColor: 'transparent'}}>
        <Appbar.BackAction
          onPress={() => {
            navigation.goBack();
          }}
        />
        <Appbar.Content
          titleStyle={{fontWeight: 'bold'}}
          title="Weight & BMI"
        />
      </Appbar.Header>
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}>
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
        {/* Card for weight with stat and graph */}
        <Card style={styles.card}>
          <Card.Content>
            {/* Title */}
            <View style={styles.titleContainer}>
              <Text style={styles.title}>Weight</Text>
              <Text style={styles.subtitle}>Unit: kg</Text>
            </View>
            {/* Stat */}
            <View style={styles.statContainer}>
              <View style={styles.statItem}>
                <Text style={styles.statLabel}>Max</Text>
                <Text style={styles.statValue}>{stats.maxWeight}</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statLabel}>Min</Text>
                <Text style={styles.statValue}>{stats.minWeight}</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statLabel}>Average</Text>
                <Text style={styles.statValue}>{stats.avgWeight}</Text>
              </View>
            </View>
            {/* Graph */}
            <View style={styles.chartPlaceholder}>
              {weightData.length > 0 && (
                <LineChart
                  data={{
                    labels: labels,
                    datasets: [
                      {
                        data: weightData,
                        color: (opacity = 1) => `rgba(255, 99, 71, ${opacity})`, // tomato color
                        strokeWidth: 2,
                      },
                    ],
                  }}
                  width={screenWidth - 40}
                  height={240}
                  verticalLabelRotation={30}
                  yAxisLabel=""
                  yAxisSuffix=" kg"
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
        {/* Card for BMI with stat and graph */}
        <Card style={styles.card}>
          <Card.Content>
            {/* Title */}
            <Text style={styles.title}>BMI</Text>
            {/* Stat */}
            <View style={styles.statContainer}>
              <View style={styles.statItem}>
                <Text style={styles.statLabel}>Max</Text>
                <Text style={styles.statValue}>{stats.maxBMI}</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statLabel}>Min</Text>
                <Text style={styles.statValue}>{stats.minBMI}</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statLabel}>Average</Text>
                <Text style={styles.statValue}>{stats.avgBMI}</Text>
              </View>
            </View>
            {/* Graph */}
            <View style={styles.chartPlaceholder}>
              {bmiData.length > 0 && (
                <LineChart
                  data={{
                    labels: labels,
                    datasets: [
                      {
                        data: bmiData,
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
            navigation.navigate('BMIHistory', {records: bmiRecords})
          }
          style={styles.historyButton}>
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
            navigation.navigate('AddWeight', {records: bmiRecords});
          }}>
          + Add Record
        </Button>
      </View>
    </View>
  );
}

export default WeightBMIPage;
