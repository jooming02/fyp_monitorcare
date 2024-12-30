const express = require("express");
const router = express.Router();
const BloodPressure = require("../models/BloodPressure");

// Route to handle creating or updating blood pressure data
router.post("/add_update", async (req, res) => {
  const { email, systolic, diastolic, pulse, date, category } = req.body;

  try {
    let bpRecord = await BloodPressure.findOne({ email, date });

    if (bpRecord) {
      // If the document exists, update it
      bpRecord.systolic = systolic;
      bpRecord.diastolic = diastolic;
      bpRecord.pulse = pulse;
      bpRecord.category = category;
      bpRecord = await bpRecord.save();
    } else {
      // Otherwise, create a new document
      bpRecord = new BloodPressure({
        email,
        systolic,
        diastolic,
        pulse,
        date,
        category,
      });
      await bpRecord.save();
    }

    res.status(200).json({ status: "ok", data: bpRecord });
  } catch (error) {
    console.error("Error saving blood pressure data:", error);
    res.status(500).json({ status: "error", message: "Internal Server Error" });
  }
});

// Get blood pressure data by email
router.get("/:email", async (req, res) => {
  try {
    const email = req.params.email;
    const bpRecords = await BloodPressure.find({ email });
    if (!bpRecords) {
      return res.status(404).json({ message: "Blood pressure data not found" });
    }
    res.json({ data: bpRecords });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

// Route to delete blood pressure records
router.post("/delete", async (req, res) => {
  try {
    const { ids } = req.body;

    // Validate that the ids array is provided
    if (!ids || !Array.isArray(ids)) {
      return res
        .status(400)
        .json({ status: "error", message: "Invalid input" });
    }

    // Delete records with the specified IDs
    const result = await BloodPressure.deleteMany({ _id: { $in: ids } });

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
