const express = require("express");
const router = express.Router();
const User = require("../models/UserDetails");

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Secret key for JWT
const JWT_SECRET = process.env.JWT_SECRET;
  
// Register route to create a new user
router.post("/register", async (req, res) => {
  const { name, gender, email, mobile, dob, password } = req.body;

  // Check if the user already exists
  const oldUser = await User.findOne({ email: email });
  if (oldUser) {
    return res.send({ data: "User already exists" });
  }

  // Hash the password
  const encryptedPassword = await bcrypt.hash(password, 10);

  // Create a new user in the database
  try {
    await User.create({
      name: name,
      gender: gender,
      email: email,
      mobile: mobile,
      dob: dob,
      password: encryptedPassword,
    });
    res.send({ status: "ok", data: "User created successfully" });
  } catch (error) {
    res.send({ status: "error", data: error });
  }
});

// Login route to authenticate a user
router.post("/login-user", async (req, res) => {
  const { email, password } = req.body;
  console.log(req.body);
   // Check if the user exists
  const oldUser = await User.findOne({ email: email });
  if (!oldUser) {
    console.log("User does not exist");
    return res.send({ status: "error", data: "User does not exist" });
  }

  // Compare the password
  if (await bcrypt.compare(password, oldUser.password)) {
    // Generate a JWT token
    const token = jwt.sign({ email: oldUser.email }, JWT_SECRET);
    console.log("This is token: ", token);
    if (res.status(201)) {
      return res.send({
        status: "ok",
        data: token,
        onboardingComplete: oldUser.onboardingComplete,
      });
    } else {
      return res.send({ error: "error"});
    }
  } else {
    console.log("Password incorrect");
    return res.send({ error: "error", data: "Password incorrect" });
  }

});

// Route to get user data based on JWT token
router.post("/userdata", async (req, res) => {
    const { token } = req.body;
    try {
      const user = jwt.verify(token, JWT_SECRET);
      const useremail = user.email;
      
      // Find the user by email
      User.findOne({ email: useremail }).then((data) => {
        return res.send({ status: "Ok", data: data });
      });
    } catch (error) {
      return res.send({ error: error });
    }
  });

  // Route to update user information
router.post("/update-user", async (req, res) => {
  const { name, email, mobile, gender, dob } = req.body;
  console.log("The user information is updating!!!!, ", req.body);
  // Update the user data
  try {
    await User.updateOne(
      { email: email },
      {
        $set: {
          name,
          mobile,
          gender,
          dob, 
        },
      }
    );
    res.send({ status: "Ok", data: "Updated" });
  } catch (error) {
    return res.send({ error: error });
  }
});

// Route to check if email exists
router.post("/check-email", async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email: email });
  if (user) {
    return res.send({ status: "error", message: "Email already exists" });
  }
  res.send({ status: "ok", message: "Email is available" });
});


// Update device token
router.post('/update-token', async (req, res) => {
  const { email, deviceToken } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    user.deviceToken = deviceToken;
    await user.save();

    res.status(200).json({ message: 'Device token updated successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Update notificationsEnabled status
router.put("/notifications/update", async (req, res) => {
  const { email, notificationsEnabled } = req.body;
  try {
    await User.updateOne({ email }, { notificationsEnabled });
    res.json({ status: "ok", message: "Notification settings updated" });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
});

// Get notificationsEnabled status
router.get("/notifications/:email", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.params.email });
    if (!user) return res.status(404).json({ status: "error", message: "User not found" });
    res.json({ status: "ok", notificationsEnabled: user.notificationsEnabled });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
});

module.exports = router;