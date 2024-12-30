const express = require("express");
const router = express.Router();
let { PythonShell } = require("python-shell");

const User = require("../models/UserDetails");
const BloodPressure = require("../models/BloodPressure");
const BloodTest = require("../models/BloodTest");
const BmiRecord = require("../models/BmiRecord");
const Lifestyle = require("../models/Lifestyle");

// Route to fetch all data required for heart disease prediction
router.get("/:email", async (req, res) => {
  try {
    const email = req.params.email;

    // Fetch user data, blood pressure, blood test, BMI, and lifestyle data in parallel
    const [user, bloodPressure, bloodTest, bmi, lifestyle] = await Promise.all([
      User.findOne({ email }),
      BloodPressure.find({ email }).sort({ date: -1 }).limit(1),
      BloodTest.find({ email }).sort({ date: -1 }).limit(1),
      BmiRecord.find({ email }).sort({ date: -1 }).limit(1),
      Lifestyle.findOne({ email }),
    ]);

    // Check if all required data is found
    if (!user || !bloodPressure || !bloodTest || !bmi || !lifestyle) {
      return res
        .status(404)
        .json({ status: "error", message: "Data not found" });
    }

    // Prepare the data object with required fields
    const data = {
      age: calculateAge(user.dob),
      ap_hi: bloodPressure[0]?.systolic || null,
      ap_lo: bloodPressure[0]?.diastolic || null,
      cholesterol: bloodTest[0]?.totalCholesterol || null,
      gluc: bloodTest[0]?.glucose || null,
      smoke: lifestyle.smoking !== undefined ? lifestyle.smoking : null,
      alco: lifestyle.alcohol !== undefined ? lifestyle.alcohol : null,
      active: lifestyle.exercise !== undefined ? lifestyle.exercise : null,
      bmi: bmi[0]?.bmi || null,
    };

    res.status(200).json({ status: "success", data });
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ status: "error", message: "Internal Server Error" });
  }
});

// Function to calculate age from date of birth
const calculateAge = (dob) => {
  // Convert the date of birth string into a Date object
  const birthDate = new Date(dob);
  const today = new Date();
  // Calculate the age based on year difference only
  const age = today.getFullYear() - birthDate.getFullYear(); 
  // Return the calculated age
  return age; 
};

// Route to predict heart disease based on the input data
router.post("/predict", (req, res) => {
  const input = req.body;
  console.log("Input:", input);

  // Modify the input values as required
  input.active = input.active ? 1 : 0;
  input.smoke = input.smoke ? 1 : 0;
  input.alco = input.alco ? 1 : 0;

  // Change cholesterol level
  if (input.cholesterol < 200) {
    input.cholesterol = 1;
  } else if (input.cholesterol >= 200 && input.cholesterol <= 239) {
    input.cholesterol = 2;
  } else {
    input.cholesterol = 3;
  }

  // Change glucose level
  if (input.gluc >= 70 && input.gluc <= 99) {
    input.gluc = 1;
  } else if (input.gluc >= 100 && input.gluc <= 125) {
    input.gluc = 2;
  } else {
    input.gluc = 3;
  }

  console.log("Modified Input:", input);

  // Set up options for the PythonShell
  const options = {
    mode: "json",
    pythonOptions: ["-u"],
    scriptPath: "../backend/python", // Path to the python folder
    args: [JSON.stringify(input)],
  };

  // Run the Python script for prediction
  PythonShell.run("predict.py", options).then (results => {
    console.log("results: %j", results);
    const result = results[0];
    // Send the prediction result as response
    res.json(result);
  });
});

module.exports = router;
