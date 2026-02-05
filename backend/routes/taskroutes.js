const express = require("express");
const Task = require("../models/task");
const jwt = require("jsonwebtoken");

const router = express.Router();

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

// Assign task (Team Lead only)
router.post("/assign", protect, async (req, res) => {
  if (req.user.role !== "teamlead") {
    return res.status(403).json({ message: "Access denied" });
  }

  const { title, description, role, internId, projectId } = req.body;

  const task = await Task.create({
    title,
    description,
    role,
    intern: internId,
    project: projectId,
  });

  res.status(201).json(task);
});

module.exports = router;
