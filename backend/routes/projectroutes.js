const express = require("express");
const Project = require("../models/project");
const jwt = require("jsonwebtoken");

const router = express.Router();

// reuse protect middleware
const protect = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "No token" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch {
    res.status(401).json({ message: "Invalid token" });
  }
};

// Create project (Team Lead only)
router.post("/create", protect, async (req, res) => {
  if (req.user.role !== "teamlead") {
    return res.status(403).json({ message: "Access denied" });
  }

  const { title, description, teamId } = req.body;

  const project = await Project.create({
    title,
    description,
    team: teamId,
    createdBy: req.user.id,
  });

  res.status(201).json(project);
});

module.exports = router;
