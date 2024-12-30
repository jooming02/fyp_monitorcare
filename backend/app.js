require('dotenv').config();
const express = require("express");
const connectDB = require("./config/db");
const scheduler  = require("./config/scheduler");

const userRouter = require("./routes/userRoutes");
const bmiRouter = require("./routes/bmiRoutes");
const bloodTestRouter = require("./routes/bloodTestRoutes");
const bloodPressureRouter = require("./routes/bloodPressureRoutes");
const lifestyleRouter = require("./routes/lifestyleRoutes");
const reminderRouter = require("./routes/reminderRoutes");
const heartDiseaseRouter = require("./routes/heartDiseaseRoutes");

const app = express();
app.use(express.json());

connectDB();

// Root route to check if server is running
app.get("/", (req, res) => {
  res.send({ status: "Started" });
});

app.use('/users', userRouter);
app.use('/bmi', bmiRouter);
app.use('/bloodtest', bloodTestRouter);
app.use('/bloodpressure', bloodPressureRouter);
app.use('/lifestyle', lifestyleRouter);
app.use('/reminder', reminderRouter);
app.use('/heartdisease', heartDiseaseRouter);

// Start the server on port 5001
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
