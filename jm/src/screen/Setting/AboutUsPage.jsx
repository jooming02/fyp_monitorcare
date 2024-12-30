import React from 'react';
import { View, ScrollView } from 'react-native';
import { Text, Appbar } from 'react-native-paper';
import styles from './AboutUsPageStyle';

function AboutUsPage({ navigation }) {
  return (
    <ScrollView
      contentContainerStyle={{ flexGrow: 1 }}
      showsVerticalScrollIndicator={false}>
      <View style={styles.container}>
        {/* Header */}
        <Appbar.Header style={{ backgroundColor: 'transparent' }}>
          <Appbar.BackAction onPress={() => navigation.goBack()} />
          <Appbar.Content titleStyle={{ fontWeight: 'bold' }} title="About Us" />
        </Appbar.Header>

        <View style={styles.content}>
          <Text style={styles.title}>About This System</Text>
          <Text style={styles.description}>
            This system is designed to help you manage your health and wellness. 
            It includes features such as:
          </Text>
          <View style={styles.bulletPoints}>
            <Text style={styles.bulletPoint}>
              • Tracking blood pressure
            </Text>
            <Text style={styles.bulletPoint}>
              • Monitoring weight & BMI
            </Text>
            <Text style={styles.bulletPoint}>
              • Providing analytics and dashboard
            </Text>
            <Text style={styles.bulletPoint}>
              • Predict heart disease
            </Text>
            <Text style={styles.bulletPoint}>
              • Scheduling reminders
            </Text>
          </View>
          <Text style={styles.description}>
            Our goal is to provide you with the tools you need to maintain a healthy lifestyle.
          </Text>
          <Text style={styles.title}>Our Mission</Text>
          <Text style={styles.description}>
            Our mission is to empower individuals to take control of their health and well-being through comprehensive tracking and insightful analytics.
          </Text>
          <Text style={styles.title}>Contact Us</Text>
          <Text style={styles.description}>
            For more information or assistance, please contact us at:
          </Text>
          <View style={styles.bulletPoints}>
            <Text style={styles.bulletPoint}>
              • Email: laujm02@hotmail.com
            </Text>
            <Text style={styles.bulletPoint}>
              • Phone: +6 011-2087 6180
            </Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

export default AboutUsPage;
