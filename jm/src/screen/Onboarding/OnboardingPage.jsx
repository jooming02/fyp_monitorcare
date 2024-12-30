import React, { useRef, useState, useCallback } from 'react';
import {
  SafeAreaView,
  Image,
  FlatList,
  View,
  Dimensions,
} from 'react-native';
import { Text, Button } from 'react-native-paper';
import { slideStyles, footerStyles } from './OnboardingPageStyle';
import axios from 'axios';
import endpoints from '../../configs/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CustomDialog from '../../components/CustomDialog';

const { width } = Dimensions.get('window');

const slides = [
  {
    id: '1',
    image: require('../../assets/healthdata.png'),
    title: 'Welcome, lovely to see you!',
    subtitle: 'Here are a few questions which we would like you to answer.',
    input: false,
  },
  {
    id: '2',
    image: require('../../assets/smoking.png'),
    title: 'Do you smoke?',
    input: true,
    inputType: 'smoking',
  },
  {
    id: '3',
    image: require('../../assets/exercise.png'),
    title: 'Do you exercise?',
    input: true,
    inputType: 'exercise',
  },
  {
    id: '4',
    image: require('../../assets/alcohol.png'),
    title: 'Do you drink alcohol?',
    input: true,
    inputType: 'alcohol',
  },
];

const Slide = React.memo(({ item, handleInputChange, inputs }) => (
  <View style={slideStyles.container}>
    <Image source={item?.image} style={slideStyles.image} />
    <View style={slideStyles.textContainer}>
      <Text style={slideStyles.title}>{item?.title}</Text>
      <Text style={slideStyles.subtitle}>{item?.subtitle}</Text>
      {item.input && (
        <View style={slideStyles.inputContainer}>
          <Button
            mode={inputs[item.inputType] === false ? 'contained' : 'outlined'}
            onPress={() => handleInputChange(item.inputType, false)}
            accessibilityLabel={`Select No for ${item.title}`}
            style={slideStyles.button}
            color="#FF6F61"
          >
            No
          </Button>
          <Button
            mode={inputs[item.inputType] === true ? 'contained' : 'outlined'}
            onPress={() => handleInputChange(item.inputType, true)}
            accessibilityLabel={`Select Yes for ${item.title}`}
            style={slideStyles.button}
            color="#FF6F61"
          >
            Yes
          </Button>
        </View>
      )}
    </View>
  </View>
));

const OnboardingPage = ({ navigation }) => {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [inputs, setInputs] = useState({
    smoking: null,
    exercise: null,
    alcohol: null,
  });
  const ref = useRef();

  // for the CustomDialog
  const [dialogVisible, setDialogVisible] = useState(false);
  const [dialogTitle, setDialogTitle] = useState('');
  const [dialogMessage, setDialogMessage] = useState('');
  const hideDialog = () => setDialogVisible(false);

  const updateCurrentSlideIndex = useCallback((e) => {
    const contentOffsetX = e.nativeEvent.contentOffset.x;
    const currentIndex = Math.round(contentOffsetX / width);
    setCurrentSlideIndex(currentIndex);
  }, []);

  const goToNextSlide = () => {
    const nextSlideIndex = currentSlideIndex + 1;
    if (nextSlideIndex < slides.length) {
      const offset = nextSlideIndex * width;
      ref?.current.scrollToOffset({ offset });
      setCurrentSlideIndex(nextSlideIndex);
    }
  };

  const goToPreviousSlide = () => {
    const prevSlideIndex = currentSlideIndex - 1;
    if (prevSlideIndex >= 0) {
      const offset = prevSlideIndex * width;
      ref?.current.scrollToOffset({ offset });
      setCurrentSlideIndex(prevSlideIndex);
    }
  };

  const handleInputChange = (type, value) => {
    setInputs((prev) => ({ ...prev, [type]: value }));
  };

  const validateInputs = () => {
    return inputs.smoking !== null && inputs.exercise !== null && inputs.alcohol !== null;
  };

  const getUserEmail  = async () => {
    try {
      const userEmail  = await AsyncStorage.getItem('userEmail');
      return userEmail ;
    } catch (e) {
      console.error('Failed to load user ID.');
    }
  };

  const handleGetStarted = async () => {
    // Get the userEmail from AsyncStorage
    const userEmail  = await getUserEmail (); 

    if (userEmail === null) {
      console.error('User email not found.');
      return;
    }

    if (validateInputs()) {
      try {
        await axios.post(endpoints.ADDUPDATELIFESTYLE, {
          email: userEmail,
          ...inputs,
          onboardingComplete: true,
        });
        // Dialog box for success
        setDialogTitle('Welcome Aboard!');
        setDialogMessage('');
        setDialogVisible(true);
        navigation.navigate('Main');
      } catch (error) {
        console.error('Error saving lifestyle data:', error);
        // Dialog box for error
        setDialogTitle('Alert');
        setDialogMessage('An error occurred while saving your responses. Please try again.');
        setDialogVisible(true);
      }
    } else {
      // Dialog box for error
      setDialogTitle('Alert');
      setDialogMessage('Please answer all the questions before proceeding.');
      setDialogVisible(true);
    }
  };

  const Footer = () => (
    <View style={footerStyles.container}>
      {/* Indicator container */}
      <View style={footerStyles.indicatorContainer}>
        {slides.map((_, index) => (
          <View
            key={index}
            style={[
              footerStyles.indicator,
              currentSlideIndex === index && {
                backgroundColor: 'gray',
                width: 25,
              },
            ]}
          />
        ))}
      </View>

      {/* Render buttons */}
      <View style={footerStyles.buttonContainer}>
        {currentSlideIndex === slides.length - 1 ? (
          <View style={footerStyles.multiButtonContainer}>
            <Button
              mode="outlined"
              onPress={goToPreviousSlide}
              accessibilityLabel="Go Back"
              style={footerStyles.button}
            >
              GO BACK
            </Button>
            <View style={footerStyles.buttonSpacing} />
            <Button
              mode="contained"
              onPress={handleGetStarted}
              accessibilityLabel="Get Started"
              style={footerStyles.button}
            >
              GET STARTED
            </Button>
          </View>
        ) : (
          <View style={[footerStyles.multiButtonContainer , currentSlideIndex === 0 && footerStyles.singleButtonRight]}>
            {currentSlideIndex !== 0 && (
              <Button
                mode="outlined"
                onPress={goToPreviousSlide}
                accessibilityLabel="Go Back"
                style={footerStyles.button}
              >
                GO BACK
              </Button>
            )}
            {currentSlideIndex !== 0 && <View style={footerStyles.buttonSpacing} />}
            <Button
              mode="contained"
              onPress={goToNextSlide}
              accessibilityLabel="Next"
              style={footerStyles.button}
            >
              NEXT
            </Button>
          </View>
        )}
      </View>
    </View>
  );

  return (
    <SafeAreaView>
      <FlatList
        ref={ref}
        onMomentumScrollEnd={updateCurrentSlideIndex}
        showsHorizontalScrollIndicator={false}
        horizontal
        data={slides}
        pagingEnabled
        renderItem={({ item }) => (
          <Slide item={item} handleInputChange={handleInputChange} inputs={inputs} />
        )}
      />
      <Footer />
      {/* Alert message */}
      <CustomDialog
        visible={dialogVisible}
        hideDialog={hideDialog}
        title={dialogTitle}
        message={dialogMessage}
        onConfirm={hideDialog}
      />
    </SafeAreaView>
  );
};

export default OnboardingPage;
