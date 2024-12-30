const express = require("express");
const router = express.Router();
const BloodTest = require("../models/BloodTest");

router.post("/add", async (req, res) => {
  const bloodTest = new BloodTest(req.body);

  try {
    const savedBloodTest = await bloodTest.save();
    res.status(201).send({ status: "ok", data: savedBloodTest });
  } catch (error) {
    res.status(500).send({ status: "error", message: error.message });
  }
});

// Get all BMI records for a specific user
router.get("/:email", async (req, res) => {
  const { email } = req.params;

  try {
    const bloodTests = await BloodTest.find({ email });
    res.status(200).json({ status: "success", data: bloodTests });
  } catch (error) {
    console.error("Error fetching blood test records:", error);
    res.status(500).json({ status: "error", message: "Internal server error" });
  }
});

// Update an existing blood test record
router.post("/update", async (req, res) => {
  try {
    const { id, ...updateData } = req.body;

    const updatedBloodTest = await BloodTest.findByIdAndUpdate(id, updateData, {
      new: true,
    });

    if (!updatedBloodTest) {
      return res
        .status(404)
        .json({ status: "error", message: "Blood test record not found" });
    }

    return res.status(200).json({ status: "success", data: updatedBloodTest });
  } catch (error) {
    console.error("Error updating blood test data:", error);
    return res
      .status(500)
      .json({
        status: "error",
        message: "An error occurred while updating the blood test data",
      });
  }
});

// Route to delete the blood test record
router.post("/delete", async (req, res) => {
  try {
    const { id } = req.body;

    const deletedBloodTest = await BloodTest.findByIdAndDelete(id);

    if (!deletedBloodTest) {
      return res
        .status(404)
        .json({ status: "error", message: "Blood test record not found" });
    }

    return res.status(200).json({ status: "success", data: deletedBloodTest });
  } catch (error) {
    console.error("Error deleting blood test data:", error);
    return res
      .status(500)
      .json({
        status: "error",
        message: "An error occurred while deleting the blood test data",
      });
  }
});
module.exports = router;
