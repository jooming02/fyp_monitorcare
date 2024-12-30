const mongoose = require("mongoose");

const UserDetailSchema = new mongoose.Schema(
    {
        name: String,
        gender:String,
        email: { type: String, unique: true },
        mobile: String,
        dob: Date,
        password: String,
        deviceToken: { type: String },
        onboardingComplete: { type: Boolean, default: false },
        notificationsEnabled: { type: Boolean, default: true },
    }, 
    {
        collection: "UserInfo",
    }
);
module.exports = mongoose.model("UserInfo", UserDetailSchema);