const mongoose = require("mongoose");

const ReminderSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      ref: "UserInfo",
      required: true,
    },
    type: {
      type: String,
      required: true,
      enum: ["Blood Pressure", "Weight & BMI"],
    },
    time: {
      type: String,
      required: true,
    },
    isEnabled: {
      type: Boolean,
      default: true,
    },
  },
  {
    collection: "Reminder",
  }
);

module.exports = mongoose.model("Reminder", ReminderSchema);
