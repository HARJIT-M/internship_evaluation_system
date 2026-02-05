const express = require("express");
const Team = require("../models/team");
const User = require("../models/user");
const jwt = require("jsonwebtoken");

const router = express.Router();

// middleware to verify token
const protect = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "No token" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid token" });
  }
};

// Create team (Team Lead only)
router.post("/create", protect, async (req, res) => {
  if (req.user.role !== "teamlead") {
    return res.status(403).json({ message: "Access denied" });
  }

  const { teamName } = req.body;

  const team = await Team.create({
    teamName,
    teamLead: req.user.id,
    interns: [],
  });

  res.status(201).json(team);
});

// Add intern to team
router.post("/add-intern", protect, async (req, res) => {
  const { teamId, internId } = req.body;

  const team = await Team.findById(teamId);
  if (!team) return res.status(404).json({ message: "Team not found" });

  team.interns.push(internId);
  await team.save();

  res.json({ message: "Intern added to team" });
});

module.exports = router;
