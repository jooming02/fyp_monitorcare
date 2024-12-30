const express = require('express');
const router = express.Router();
const Reminder = require('../models/Reminder');
const { scheduleReminder, cancelReminder } = require('../config/scheduler');

router.post('/add', async (req, res) => {
  const { type, time, isEnabled, email } = req.body;

  const reminder = new Reminder({
    type,
    time,
    isEnabled,
    email
  });

  try {
    const newReminder = await reminder.save();
    scheduleReminder(newReminder);
    res.status(201).json(newReminder);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.get('/:email', async (req, res) => {
  try {
    const email = req.params.email;
    const reminders = await Reminder.find({ email });
    if (!reminders) {
      return res.status(404).json({ message: "Reminders data not found" });
    }
    res.json({ data: reminders });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

// Update reminder and reschedule if necessary
router.put('/update/:id', async (req, res) => {
  try {
    const { isEnabled } = req.body;
    const reminder = await Reminder.findById(req.params.id);
    if (!reminder) return res.status(404).json({ message: 'Reminder not found' });

    // Cancel the existing reminder job if it exists
    cancelReminder(reminder._id);

    // Update the reminder in the database
    reminder.isEnabled = isEnabled;
    await reminder.save();

    // Schedule the reminder if isEnabled is true
    if (isEnabled) {
      scheduleReminder(reminder);
    }

    res.json(reminder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/delete', async (req, res) => {
  try {
    const { ids } = req.body;
    await Reminder.deleteMany({ _id: { $in: ids } });
    ids.forEach(cancelReminder); // Cancel the reminders
    res.json({ status: 'success', message: 'Reminders deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
