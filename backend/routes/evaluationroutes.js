const express = require("express");
const Evaluation = require("../models/evaluation");
const jwt = require("jsonwebtoken");

const router = express.Router();

// Protect Middleware
const protect = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) return res.status(401).json({ message: "No token" });

  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ message: "Invalid token" });
  }
};

// Add Evaluation
router.post("/add", protect, async (req, res) => {
  try {
    if (req.user.role !== "teamlead") {
      return res.status(403).json({ message: "Access denied" });
    }

    const evaluation = await Evaluation.create({
      intern: req.body.internId,
      project: req.body.projectId,
      timeliness: req.body.timeliness,
      behaviour: req.body.behaviour,
      technicalSkills: req.body.technicalSkills,
      communication: req.body.communication,
      teamwork: req.body.teamwork,
      feedback: req.body.feedback,
      evaluatedBy: req.user._id || req.user.id
    });

    res.status(201).json(evaluation);

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
});

// Top Interns
router.get("/top", protect, async (req, res) => {
  try {
    const topInterns = await Evaluation.find()
      .sort({ totalScore: -1 })
      .limit(5)
      .populate("intern", "name email")
      .populate("project", "title");

    res.status(200).json(topInterns);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Intern My Evaluation
router.get("/my", protect, async (req, res) => {
  try {
    if (req.user.role !== "intern") {
      return res.status(403).json({ message: "Access denied" });
    }

    const userId = req.user.id || req.user._id;

    console.log("Logged in Intern ID:", userId);

    const evaluations = await Evaluation.find({
      intern: userId
    })
      .populate("project", "title")
      .populate("evaluatedBy", "name");

    res.status(200).json(evaluations);

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});



module.exports = router;
