const express = require("express");
const jwt = require("jsonwebtoken");
const Project = require("../models/project");
const Evaluation = require("../models/evaluation");

const router = express.Router();

/* =======================
   Protect Middleware
======================= */
const protect = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

/* =======================
   TEAM LEAD DASHBOARD
   GET /api/teamlead/dashboard
======================= */
router.get("/dashboard", protect, async (req, res) => {
  try {
    // 1️⃣ Only teamlead allowed
    if (req.user.role !== "teamlead") {
      return res.status(403).json({ message: "Access denied" });
    }

    const teamLeadId = req.user.id;

    // 2️⃣ Find projects created by this team lead
    const projects = await Project.find({ teamLead: teamLeadId })
      .populate("interns", "name email")
       .populate("teamLead", "name email")
      .lean();

    if (!projects.length) {
      return res.status(200).json({
        message: "No projects assigned",
        projects: []
      });
    }

    // 3️⃣ Attach evaluation status for each intern
    for (let project of projects) {
      for (let intern of project.interns) {
        const evaluation = await Evaluation.findOne({
          intern: intern._id,
          project: project._id,
          evaluatedBy: teamLeadId
        });

        intern.evaluated = evaluation ? true : false;
        intern.grade = evaluation ? evaluation.grade : null;
        intern.totalScore = evaluation ? evaluation.totalScore : null;
      }
    }

    res.status(200).json({
      teamLead: req.user.name,
      projects
    });

  } catch (error) {
    console.error("Teamlead dashboard error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
