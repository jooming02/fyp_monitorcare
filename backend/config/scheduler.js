// Import the node-cron library for scheduling tasks
const cron = require('node-cron');
const admin = require('firebase-admin');
// Import the service account key
const serviceAccount = require('./monitorcare-1e8f8-firebase-adminsdk-qrok0-ad2330d353.json');
const mongoose = require('mongoose');
const Reminder = require('../models/Reminder');
const User = require("../models/UserDetails");

// Initialize the Firebase Admin SDK with the service account credentials
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

// Function to send a notification using Firebase Cloud Messaging
const sendNotification = async (message) => {
  try {
    const response = await admin.messaging().send(message);
    console.log('Successfully sent message:', response);
  } catch (error) {
    console.log('Error sending message:', error);
  }
};

// Object to store references to scheduled jobs
const scheduledJobs = {}; // Object to store job references

// Function to schedule a reminder
const scheduleReminder = (reminder) => {
  const { email, time, _id, type, isEnabled } = reminder;

  // If the reminder is disabled, do not schedule it
  if (!isEnabled) {
    console.log(`Reminder with ID ${_id} is disabled and will not be scheduled.`);
    return;
  }

  // Find the user by email to get their device token
  User.findOne({ email }).then(user => {
    if (!user || !user.deviceToken) {
      console.log(`No device token for user with email ${email}`);
      return;
    }

    const deviceToken = user.deviceToken;
    const [hour, minute] = time.split(':');
    const cronTime = `${minute} ${hour} * * *`;

    // Set the message body based on the reminder type
    const messageBody = type === 'Blood Pressure'
      ? 'Please remember to measure your blood pressure.'
      : 'Please remember to measure your weight and BMI.';

    // Create the notification message
    const message = {
      notification: {
        title: 'Daily Reminder',
        body: messageBody,
      },
      token: deviceToken,
    };

    // Schedule the job with cron
    const job = cron.schedule(cronTime, () => {
      console.log(`Running daily reminder job for user with email ${email} at ${time} with type ${type}`);
      sendNotification(message);
    }, {
      timezone: "Asia/Kuala_Lumpur"
    });

    scheduledJobs[_id] = job; // Store the job reference

    console.log(`Scheduled reminder for user with email ${email} at ${time}`);
  }).catch(error => {
    console.log('Error finding user:', error);
  });
};

// Function to schedule all reminders from the database
const scheduleReminders = async () => {
  try {
    const reminders = await Reminder.find({});
    reminders.forEach(scheduleReminder);
  } catch (error) {
    console.log('Error fetching reminders:', error);
  }
};

// Function to cancel a scheduled reminder
const cancelReminder = (id) => {
  const job = scheduledJobs[id];
  if (job) {
    job.stop();
    delete scheduledJobs[id];
    console.log(`Cancelled reminder with ID ${id}`);
  } else {
    console.log(`No scheduled job found for ID ${id}`);
  }
};

// Schedule all reminders when the script is run
scheduleReminders();
console.log('Daily reminder job scheduler set up');

module.exports = { admin, scheduleReminder, cancelReminder };
