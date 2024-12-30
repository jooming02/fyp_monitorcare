const mongoose = require("mongoose");

const bloodPressureSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      ref: "UserInfo",
      required: true,
    },
    date: {
      type: Date,
      default: Date.now,
    },
    systolic: {
      type: Number,
      required: true,
    },
    diastolic: {
      type: Number,
      required: true,
    },
    pulse: {
      type: Number,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
  },
  {
    collection: "BloodPressure",
  }
);

const BloodPressure = mongoose.model("BloodPressure", bloodPressureSchema);

module.exports = BloodPressure;
