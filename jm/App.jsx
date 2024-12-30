import React, {useEffect, useState} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createMaterialBottomTabNavigator} from 'react-native-paper/react-navigation';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useTheme} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import LoadingScreen from './src/components/LoadingScreen';
import SplashScreen from 'react-native-splash-screen';
import LoginPage from './src/screen/Login_Register/LoginPage';
import RegisterPage from './src/screen/Login_Register/RegisterPage';
import HomeScreen from './src/screen/Home/HomePage';
import UpdateProfile from './src/screen/UpdateProfile/UpdateProfile';
import SettingPage from './src/screen/Setting/SettingPage';
import AboutUsPage from './src/screen/Setting/AboutUsPage';
import OnboardingPage from './src/screen/Onboarding/OnboardingPage';
import LifestylePage from './src/screen/Lifestyle/LifestylePage';
import AnalyticPage from './src/screen/Analytic/AnalyticPage';
import SchedulePage from './src/screen/Schedule/SchedulePage';
import WeightBMIPage from './src/screen/WeightBMI/WeightBMIPage';
import AddWeightPage from './src/screen/WeightBMI/AddWeightPage';
import BMIHistoryPage from './src/screen/WeightBMI/BMIHistoryPage';
import BloodPressurePage from './src/screen/BloodPressure/BloodPressurePage';
import AddBloodPressurePage from './src/screen/BloodPressure/AddBloodPressurePage';
import BloodPressureHistoryPage from './src/screen/BloodPressure/BloodPressureHistoryPage';
import AddBloodTestPage from './src/screen/BloodTest/AddBloodTestPage';
import BloodTestHistoryPage from './src/screen/BloodTest/BloodTestHistoryPage';
import EditBloodTestPage from './src/screen/BloodTest/EditBloodTestPage';

// SubPageNavigator handles the navigation between secondary screens
const SubPageNavigator = () => {
  const SubPageStack = createNativeStackNavigator();
  return (
    <SubPageStack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <SubPageStack.Screen name="WeightBMI" component={WeightBMIPage} />
      <SubPageStack.Screen name="AddWeight" component={AddWeightPage} />
      <SubPageStack.Screen name="BMIHistory" component={BMIHistoryPage} />
      <SubPageStack.Screen name="AddBloodTest" component={AddBloodTestPage} />
      <SubPageStack.Screen name="EditBloodTest" component={EditBloodTestPage} />
      <SubPageStack.Screen name="BloodPressure" component={BloodPressurePage} />
      <SubPageStack.Screen name="AddBloodPressure" component={AddBloodPressurePage}/>
      <SubPageStack.Screen name="BloodPressureHistory" component={BloodPressureHistoryPage}/>
      <SubPageStack.Screen name="Lifestyle" component={LifestylePage} />
      <SubPageStack.Screen name="UpdateProfile" component={UpdateProfile} />
      <SubPageStack.Screen name="AboutUs" component={AboutUsPage} />
    </SubPageStack.Navigator>
  );
};

// MainNavigator sets up the bottom tab navigation for the main sections of the app
const MainNavigator = () => {
  const theme = useTheme();
  const MainTab = createMaterialBottomTabNavigator();
  return (
    <MainTab.Navigator
      activeColor={theme.colors.primary}
      barStyle={{
        backgroundColor: theme.colors.surface,
      }}>
      <MainTab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({color}) => <Icon name="home" color={color} size={26} />,
        }}
      />
      <MainTab.Screen
        name="BloodTest"
        component={BloodTestHistoryPage}
        options={{
          tabBarLabel: 'BloodTest',
          tabBarIcon: ({color}) => (
            <Icon name="water" color={color} size={26} />
          ),
        }}
      />
      <MainTab.Screen
        name="Analytic"
        component={AnalyticPage}
        options={{
          tabBarLabel: 'Analytic',
          tabBarIcon: ({color}) => (
            <Icon name="chart-arc" color={color} size={26} />
          ),
        }}
      />
      <MainTab.Screen
        name="Schedule"
        component={SchedulePage}
        options={{
          tabBarLabel: 'Schedule',
          tabBarIcon: ({color}) => (
            <Icon name="calendar-clock" color={color} size={26} />
          ),
        }}
      />
      <MainTab.Screen
        name="SettingNav"
        component={SettingPage}
        options={{
          tabBarLabel: 'Setting',
          tabBarIcon: ({color}) => <Icon name="cog" color={color} size={26} />,
        }}
      />
    </MainTab.Navigator>
  );
};

// AuthNavigator manages the authentication flow of the application
const AuthNavigator = () => {
  const AuthStack = createNativeStackNavigator();
  return (
    <AuthStack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <AuthStack.Screen name="Login" component={LoginPage} />
      <AuthStack.Screen name="Register" component={RegisterPage} />
    </AuthStack.Navigator>
  );
};

// AppNavigator manages the top-level navigation, determining whether to show Auth or Main flow
const AppNavigator = ({isLoggedIn}) => {
  const RootStack = createNativeStackNavigator();
  return (
    <RootStack.Navigator
      initialRouteName={isLoggedIn ? 'Main' : 'Auth'}
      screenOptions={{
        headerShown: false,
      }}>
      <RootStack.Screen name="Auth" component={AuthNavigator} />
      <RootStack.Screen name="Main" component={MainNavigator} />
      <RootStack.Screen name="SubPage" component={SubPageNavigator} />
      <RootStack.Screen name="Onboarding" component={OnboardingPage} />
    </RootStack.Navigator>
  );
};

// Main App component handles the initial state and splash screen
function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(null);

  // Retrieve the login status from AsyncStorage
  async function getData() {
    let data = await AsyncStorage.getItem('isLoggedIn');
    console.log(data, 'at app.jsx');
    if (data === null) {
      data = 'false'; // Set to string 'false' if null
    }
    setIsLoggedIn(data === 'true'); // Convert to boolean
  }

  useEffect(() => {
    const initializeApp = async () => {
      await getData();
      console.log('App initialized.');
      setTimeout(() => {
        SplashScreen.hide();
      }, 900);
    };
    initializeApp();
  }, []); // This useEffect runs only once when the component mounts
  

  if (isLoggedIn === null) {
    // Render a loading screen or indicator while determining login status
    return <LoadingScreen />;
  }

  return (
    <NavigationContainer>
      <AppNavigator isLoggedIn={isLoggedIn} />
    </NavigationContainer>
  );
}

export default App;
