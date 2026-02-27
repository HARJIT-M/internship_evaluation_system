const express = require("express");
const Project = require("../models/project");
const jwt = require("jsonwebtoken");

const router = express.Router();
const Evaluation = require("../models/evaluation");
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
  try {
    if (req.user.role !== "teamlead") {
      return res.status(403).json({ message: "Access denied" });
    }

    const project = await Project.create({
      title: req.body.title,
      description: req.body.description,
      teamLead: req.user.id || req.user._id
    });

    res.status(201).json(project);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Intern views their project
router.get("/fetch", protect, async (req, res) => {
  try {
    //console.log("User from token:", req.user);

    // Check if user exists
    if (!req.user) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    // Allow only interns
    if (req.user.role !== "intern") {
      return res.status(403).json({ message: "Access denied" });
    }

    // Find projects where this intern is included
    const projects = await Project.find({
      interns: req.user.id,
    }).populate("teamLead", "name email");

    // console.log("Projects found:", projects);

    res.status(200).json(projects);
  } catch (error) {
    console.error("Error fetching intern projects:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Assign Interns to Project
// Assign Interns to Project
// Assign Interns to Project
router.put("/assign-interns/:projectId", protect, async (req, res) => {
  try {
    if (req.user.role !== "teamlead") {
      return res.status(403).json({ message: "Access denied" });
    }

    const userId = req.user.id || req.user._id;

    if (!userId) {
      return res.status(401).json({ message: "Invalid token payload" });
    }

    const project = await Project.findById(req.params.projectId);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    if (project.teamLead.toString() !== userId.toString()) {
      return res.status(403).json({ message: "Not your project" });
    }

    const { internIds } = req.body;
    if (!Array.isArray(internIds) || internIds.length === 0) {
      return res.status(400).json({ message: "internIds must be a non-empty array" });
    }

    const uniqueInterns = [...new Set(internIds.map(id => id.toString()))];
    project.interns = uniqueInterns;

    await project.save();

    // 🔥 CREATE DEFAULT EVALUATION FOR EACH INTERN
    for (let internId of uniqueInterns) {

      const existingEvaluation = await Evaluation.findOne({
        intern: internId,
        project: project._id,
        evaluatedBy: userId
      });

      if (!existingEvaluation) {
        await Evaluation.create({
          intern: internId,
          project: project._id,
          timeliness: 0,
          behaviour: 0,
          technicalSkills: 0,
          communication: 0,
          teamwork: 0,
          feedback: "",
          evaluatedBy: userId,
          status: "ongoing"
        });
      }
    }

    res.status(200).json({
      message: "Interns assigned & evaluations created",
      project
    });

  } catch (error) {
    console.error("Assign interns error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Get single project by ID (for teamlead)
router.get("/:id", protect, async (req, res) => {
  try {
    const projectId = req.params.id;

    if (!projectId) {
      return res.status(400).json({ message: "Project ID is required" });
    }

    if (req.user.role !== "teamlead") {
      return res.status(403).json({ message: "Access denied" });
    }

    const project = await Project.findById(projectId)
      .populate("interns", "name email");

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    if (project.teamLead.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not your project" });
    }

    // 🔥 FETCH EVALUATIONS FOR THIS PROJECT
    const evaluations = await Evaluation.find({
      project: projectId,
      evaluatedBy: req.user.id
    });

    // 🔥 ATTACH STATUS TO EACH INTERN
    const projectWithStatus = {
      ...project.toObject(),
      interns: project.interns.map((intern) => {
        const evalData = evaluations.find(
          (e) =>
            e.intern.toString() === intern._id.toString()
        );

        return {
          ...intern.toObject(),
          status: evalData ? evalData.status : "ongoing"
        };
      })
    };

    res.json(projectWithStatus);

  } catch (err) {
    console.error("Fetch project error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

  // 🔥 Team Lead - get ALL my projects (for evaluate project page)
router.get("/teamlead/projects", protect, async (req, res) => {
  try {
    if (req.user.role !== "teamlead") {
      return res.status(403).json({ message: "Access denied" });
    }

    const projects = await Project.find({
      teamLead: req.user.id
    }).populate("interns", "name email");

    res.status(200).json(projects);
  } catch (err) {
    console.error("Fetch teamlead projects error:", err);
    res.status(500).json({ message: "Server error" });
  }
});


// Team Lead views their project + interns
router.get("/my-project", protect, async (req, res) => {
  try {
    if (req.user.role !== "teamlead") {
      return res.status(403).json({ message: "Access denied" });
    }

    // ✅ FIX: use req.user.id (from JWT)
    const project = await Project.findOne({
      teamLead: req.user.id
    }).populate("interns", "name email role");

    if (!project) {
      return res.status(404).json({ message: "No project found" });
    }

    res.status(200).json(project);

  } catch (err) {
    console.error("My project error:", err);
    res.status(500).json({ message: "Server error" });
  }
});


router.get("/test", (req, res) => {
  console.log("PROJECT ROUTE WORKING");
  res.json({ message: "Project route works" });
});


  // PUT - Mark project as completed
router.put("/:projectId/complete", protect, async (req, res) => {
  try {
    // Only teamlead can update
    if (req.user.role !== "teamlead") {
      return res.status(403).json({ message: "Access denied" });
    }

    const project = await Project.findById(req.params.projectId);

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    // Ensure this teamlead owns the project
    if (project.teamLead.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    project.status = "completed";

    await project.save();

    res.json({
      message: "Project marked as completed",
      project,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});


module.exports = router;
