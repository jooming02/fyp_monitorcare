const mongoose = require("mongoose");

// MongoDB connection URL
const mongoUrl = process.env.MONGO_URL

// Connecting to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(mongoUrl);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Error connecting to MongoDB", error);
    process.exit(1);
  }
};

module.exports = connectDB;
