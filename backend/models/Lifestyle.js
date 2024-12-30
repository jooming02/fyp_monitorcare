const mongoose = require("mongoose");

const lifestyleSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      ref: "UserInfo",
      required: true,
    },
    smoking: {
      type: Boolean,
      required: true,
    },
    exercise: {
      type: Boolean,
      required: true,
    },
    alcohol: {
      type: Boolean,
      required: true,
    },
  },
  {
    collection: "Lifestyle",
  }
);

const Lifestyle = mongoose.model("Lifestyle", lifestyleSchema);

module.exports = Lifestyle;
