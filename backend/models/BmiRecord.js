const mongoose = require('mongoose');

const BmiRecordSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      ref: 'UserInfo',
      required: true,
    },
    date: {
      type: Date,
      default: Date.now,
    },
    weight: {
      type: Number,
      required: true,
    },
    height: {
      type: Number,
      required: true,
    },
    bmi: {
      type: Number,
      required: true,
    },
    bmiCategory: {
      type: String,
      required: true,
      enum: ['Underweight', 'Normal', 'Overweight', 'Obese', 'Extremely Obese'],
    },
  },
  {
    collection: "BmiRecord",
  }

);

const BmiRecord = mongoose.model('BmiRecord', BmiRecordSchema);

module.exports = BmiRecord;
