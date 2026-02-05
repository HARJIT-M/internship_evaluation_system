const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Internship Evaluation System API is running");
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

//connecting db
const connectDB = require("./config/db");
connectDB();

//connecting authroutes
const authRoutes = require("./routes/authroutes");

app.use("/api/auth", authRoutes);

// connecting teamroutes
const teamRoutes = require("./routes/teamroutes");
app.use("/api/team", teamRoutes);

// connecting projectroutes
const projectRoutes = require("./routes/projectroutes");
app.use("/api/project", projectRoutes);

// connecting taskroutes
const taskRoutes = require("./routes/taskroutes");
app.use("/api/task", taskRoutes);

//connecting evaluationroutes.js
const evaluationRoutes = require("./routes/evaluationroutes");
app.use("/api/evaluation", evaluationRoutes);
