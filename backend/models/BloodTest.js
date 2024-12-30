const mongoose = require("mongoose");

const BloodTestSchema = new mongoose.Schema(
  {
    email: {type: String, ref: 'UserInfo', required: true},
    date: { type: Date, required: true },
    haemoglobin: { type: Number, required: false },
    rbcCount: { type: Number, required: false },
    totalWbcCount: { type: Number, required: false },
    pcv: { type: Number, required: false },
    mcv: { type: Number, required: false },
    mch: { type: Number, required: false },
    mchc: { type: Number, required: false },
    rdw: { type: Number, required: false },
    neutrophils: { type: Number, required: false },
    lymphocytes: { type: Number, required: false },
    eosinophils: { type: Number, required: false },
    monocytes: { type: Number, required: false },
    basophils: { type: Number, required: false },
    plateletCount: { type: Number, required: false },

    glucose: { type: Number, required: false },
    bicarbonate: { type: Number, required: false },
    calcium: { type: Number, required: false },
    chloride: { type: Number, required: false },
    magnesium: { type: Number, required: false },
    phosphorus: { type: Number, required: false },
    potassium: { type: Number, required: false },
    sodium: { type: Number, required: false },
    
    totalCholesterol: { type: Number, required: false },
    ldlCholesterol: { type: Number, required: false },
    hdlCholesterol: { type: Number, required: false },
    triglycerides: { type: Number, required: false },

  },
  {
    collection: "BloodTest",
  }
);

module.exports = mongoose.model("BloodTest", BloodTestSchema);
