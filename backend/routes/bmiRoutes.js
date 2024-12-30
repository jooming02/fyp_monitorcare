const express = require("express");
const router = express.Router();
const BmiRecord = require("../models/BmiRecord");

// Add a new BMI record
router.post("/add", async (req, res) => {
  const { email, date, weight, height, bmi, bmiCategory } = req.body;

  try {
    const newBmiRecord = new BmiRecord({
      email,
      date,
      weight,
      height,
      bmi,
      bmiCategory,
    });
    console.log("req ", req.body);
    // console.log("New BMI Record: ", newBmiRecord);
    const savedBmiRecord = await newBmiRecord.save();
    console.log("New BMI Record: ", savedBmiRecord);
    res.status(201).send({ status: "ok", data: savedBmiRecord });
  } catch (error) {
    res.status(500).send({ status: "error", data: error.message });
  }
});

// Get all BMI records for a specific user
router.get("/:email", async (req, res) => {
  const { email } = req.params;

  try {
    const bmiRecords = await BmiRecord.find({ email });
    res.status(200).send({ status: "ok", data: bmiRecords });
  } catch (error) {
    res.status(500).send({ status: "error", data: error.message });
  }
});

// Function to delete multiple BMI records
router.post("/delete", async (req, res) => {
  try {
    const { ids } = req.body; // Get the list of record IDs from the request body

    // Validate that the ids array is provided
    if (!ids || !Array.isArray(ids)) {
      return res
        .status(400)
        .json({ status: "error", message: "Invalid input" });
    }

    // Delete records with the specified IDs
    const result = await BmiRecord.deleteMany({ _id: { $in: ids } });

    // Check if any records were deleted
    if (result.deletedCount === 0) {
      return res
        .status(404)
        .json({ status: "error", message: "No records found to delete" });
    }

    res
      .status(200)
      .json({ status: "success", message: "Records deleted successfully" });
  } catch (error) {
    console.error("Error deleting records:", error);
    res.status(500).json({ status: "error", message: "Internal server error" });
  }
});

module.exports = router;
