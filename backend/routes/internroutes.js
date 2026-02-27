const express = require("express");
const jwt = require("jsonwebtoken");
const Evaluation = require("../models/evaluation");
const Project = require("../models/project");
const User = require("../models/user");
const router = express.Router();

/* =========================
   PROTECT MIDDLEWARE
========================= */
const protect = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

/* =========================
   INTERN DASHBOARD
========================= */

/**
 * GET /api/intern/dashboard
 * Intern can view:
 * - Project title
 * - Team lead
 * - Score
 * - Grade
 * - Feedback
 */
router.get("/dashboard", protect, async (req, res) => {
  try {
    // Only interns allowed
    if (req.user.role !== "intern") {
      return res.status(403).json({ message: "Access denied" });
    }

    const internId = req.user.id;

    const evaluations = await Evaluation.find({ intern: internId })
      .populate("project", "title")
      .populate("evaluatedBy", "name email")
      .sort({ createdAt: -1 });

    if (evaluations.length === 0) {
      return res.status(200).json({
        message: "No evaluations yet",
        evaluations: []
      });
    }

    res.status(200).json({
      count: evaluations.length,
      evaluations
    });

  } catch (error) {
    console.error("Intern dashboard error:", error);
    res.status(500).json({ message: "Server error" });
  }
});
// to get all interns
router.get("/totalinterns", protect, async (req, res) => {
  try {
    if (req.user.role !== "teamlead") {
      return res.status(403).json({ message: "Access denied" });
    }

    const interns = await User.find({ role: "intern" }).select("name email");
    res.json(interns);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
