import {useEffect} from 'react';
import messaging from '@react-native-firebase/messaging';
import notifee, {AndroidImportance} from '@notifee/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import endpoints from '../configs/api';

const useFCM = () => {
  const requestUserPermission = async () => {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      console.log('Authorization status:', authStatus);
    }
  };

  const getToken = async () => {
    const token = await messaging().getToken();
    console.log('FCM Token:', token);
    const email = await AsyncStorage.getItem('userEmail');

    if (email) {
      try {
        await axios.post(endpoints.UPDATETOKEN, {
          email,
          deviceToken: token,
        });
        console.log('Device token sent to server');
      } catch (error) {
        console.error('Error sending device token to server:', error);
      }
    }
  };

  const handleNotification = async (remoteMessage, channelId) => {
    const email = await AsyncStorage.getItem('userEmail');

    if (email) {
      const response = await axios.get(
        `${endpoints.GETNOTIFICATIONSSTATUS}/${email}`,
      );
      if (response.data.notificationsEnabled) {
        try {
          await notifee.displayNotification({
            title: remoteMessage.notification.title,
            body: remoteMessage.notification.body,
            android: {
              channelId: channelId,
              pressAction: {
                id: 'default',
              },
              importance: AndroidImportance.HIGH,
            },
          });
        } catch (error) {
          console.error('Error displaying notification:', error);
        }
      }
    }
  };

  const onAppBootstrap = async () => {
    await requestUserPermission();
    await getToken();

    const channelId = await notifee.createChannel({
      id: 'default',
      name: 'Default Channel',
      importance: AndroidImportance.HIGH,
    });

    console.log('FCM is listening!!');
    
    messaging().onMessage(async remoteMessage => {
      console.log('A new FCM message arrived!', remoteMessage);
      handleNotification(remoteMessage, channelId);
    });

    messaging().setBackgroundMessageHandler(async remoteMessage => {
      console.log('Message handled in the background!', remoteMessage);
      handleNotification(remoteMessage, channelId);
    });
  };

  useEffect(() => {
    onAppBootstrap();
  }, []);
};

export default useFCM;
