import React from 'react';
import {View, ScrollView, StyleSheet} from 'react-native';
import {Text, Button, Modal, Portal} from 'react-native-paper';

const TermsAndConditionsModal = ({visible, onDismiss}) => {
  return (
    <Portal>
      <Modal
        visible={visible}
        onDismiss={onDismiss}
        contentContainerStyle={styles.modalContainer}>
        <Text style={styles.modalTitle}>Terms and Conditions</Text>
        <ScrollView>
          <Text style={styles.modalSectionTitle}>1. Introduction</Text>
          <Text style={styles.modalText}>
            Welcome to [MonitorCare]. Your privacy is important to us. This
            document outlines the terms and conditions under which we collect,
            use, and protect your health data. By using our services, you agree
            to the collection and use of information in accordance with these
            terms.
          </Text>
          <Text style={styles.modalSectionTitle}>2. Data Collection</Text>
          <Text style={styles.modalText}>
            We collect various types of information in connection with the
            services we provide, including:
          </Text>
          <View style={styles.bulletPoints}>
            <Text style={styles.bulletPoint}>
              • Personal Information: This includes your name, email address,
              phone number, and other contact details.
            </Text>
            <Text style={styles.bulletPoint}>
              • Health Data: This includes data related to your health and
              wellness, such as blood pressure, weight, BMI, and any other
              health-related information you provide.
            </Text>
          </View>
          <Text style={styles.modalSectionTitle}>3. Use of Data</Text>
          <Text style={styles.modalText}>The data we collect is used for:</Text>
          <View style={styles.bulletPoints}>
            <Text style={styles.bulletPoint}>
              • Providing and maintaining our services.
            </Text>
            <Text style={styles.bulletPoint}>
              • Enhancing and personalizing your user experience.
            </Text>
            <Text style={styles.bulletPoint}>
              • Analyzing usage patterns to improve our services.
            </Text>
            <Text style={styles.bulletPoint}>
              • Communicating with you, including sending updates and
              promotional offers.
            </Text>
          </View>
          <Text style={styles.modalSectionTitle}>4. Data Sharing</Text>
          <Text style={styles.modalText}>
            We do not sell, trade, or otherwise transfer your personal
            information to outside parties without your consent. However, we may
            share your data with trusted third parties who assist us in
            operating our website, conducting our business, or providing
            services to you, as long as those parties agree to keep this
            information confidential.
          </Text>
          <Text style={styles.modalSectionTitle}>5. Data Security</Text>
          <Text style={styles.modalText}>
            We implement a variety of security measures to maintain the safety
            of your personal information. Your data is stored in secure
            environments and protected against unauthorized access, alteration,
            disclosure, or destruction.
          </Text>
          <Text style={styles.modalSectionTitle}>6. User Rights</Text>
          <Text style={styles.modalText}>You have the right to:</Text>
          <View style={styles.bulletPoints}>
            <Text style={styles.bulletPoint}>
              • Access and review your health data.
            </Text>
            <Text style={styles.bulletPoint}>
              • Request corrections to any inaccurate or incomplete information.
            </Text>
            <Text style={styles.bulletPoint}>
              • Withdraw your consent to the collection and use of your data at
              any time.
            </Text>
          </View>
          <Text style={styles.modalSectionTitle}>
            7. Changes to Terms and Conditions
          </Text>
          <Text style={styles.modalText}>
            We may update our terms and conditions from time to time. We will
            notify you of any changes by posting the new terms and conditions on
            this page. You are advised to review this page periodically for any
            changes.
          </Text>
          <Text style={styles.modalSectionTitle}>8. Contact Us</Text>
          <Text style={styles.modalText}>
            If you have any questions about these terms and conditions or our
            data collection practices, please contact us at:
          </Text>
          <View style={styles.bulletPoints}>
            <Text style={styles.bulletPoint}>
              • Email: laujm02@hotmail.com
            </Text>
            <Text style={styles.bulletPoint}>• Phone: +6 011 2087 6180</Text>
          </View>
          <Text style={styles.modalSectionTitle}>9. Consent</Text>
          <Text style={styles.modalText}>
            By using our services and providing your health data, you consent to
            our collection, use, and sharing of this data in accordance with
            these terms and conditions.
          </Text>
          <Text style={styles.modalText}>
            Please read these terms and conditions carefully before using our
            services. If you do not agree with any part of these terms and
            conditions, please do not use our services.
          </Text>
        </ScrollView>
        <Button onPress={onDismiss}>Close</Button>
      </Modal>
    </Portal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    backgroundColor: 'white',
    marginVertical: 80,
    padding: 20,
    marginHorizontal: 20,
    borderRadius: 10,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalEffectiveDate: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalSectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 5,
  },
  modalText: {
    fontSize: 14,
    marginBottom: 10,
  },
  bulletPoints: {
    marginLeft: 10,
  },
  bulletPoint: {
    fontSize: 14,
    marginBottom: 5,
  },
});

export default TermsAndConditionsModal;
