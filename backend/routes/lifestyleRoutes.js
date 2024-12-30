const express = require('express');
const router = express.Router();
const User = require("../models/UserDetails");
const Lifestyle = require('../models/Lifestyle');

// Route to handle creating or updating lifestyle data
router.post('/add_update', async (req, res) => {
  const { email, smoking, exercise, alcohol } = req.body;

  try {
    // Update onboardingComplete in User schema
    await User.updateOne(
        { email },
        { onboardingComplete: true }
      );

    let lifestyle = await Lifestyle.findOne({ email });

    if (lifestyle) {
      // If the document exists, update it
      lifestyle.smoking = smoking;
      lifestyle.exercise = exercise;
      lifestyle.alcohol = alcohol;
      lifestyle = await lifestyle.save();
    } else {
      // Otherwise, create a new document
      lifestyle = new Lifestyle({ email, smoking, exercise, alcohol });
      await lifestyle.save();
    }

    res.status(200).json({ status: 'ok', data: lifestyle });
  } catch (error) {
    console.error('Error saving lifestyle data:', error);
    res.status(500).json({ status: 'error', message: 'Internal Server Error' });
  }
});

// Get lifestyle data by email
router.get('/:email', async (req, res) => {
    try {
      const email = req.params.email;
      const lifestyle = await Lifestyle.findOne({ email });
      if (!lifestyle) {
        return res.status(404).json({ message: 'Lifestyle data not found' });
      }
      res.json(lifestyle);
    } catch (error) {
      res.status(500).json({ message: 'Server error', error });
    }
});

module.exports = router;