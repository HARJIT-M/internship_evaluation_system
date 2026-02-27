const express = require("express");
const Evaluation = require("../models/evaluation");
const jwt = require("jsonwebtoken");
const Project = require("../models/project");
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

    const project = await Project.findById(req.body.projectId);

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    // ✅ Ensure this team lead owns the project
    if (project.teamLead.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not your project" });
    }
    
    // 2️⃣ Check intern belongs to project
    if (!project.interns.map(id => id.toString()).includes(req.body.internId)) {
      return res.status(400).json({ message: "Intern not assigned to this project" });
    }

    const userId = req.user.id; 

    // 3️⃣ 🚫 Prevent duplicate evaluation
    const existingEvaluation = await Evaluation.findOne({
      intern: req.body.internId,
      project: req.body.projectId,
      evaluatedBy: userId
    });

    if (existingEvaluation) {
      return res.status(409).json({
        message: "Evaluation already submitted for this intern in this project"
      });
    }

    // ✅ Correct ObjectId comparison
    const internExists = project.interns.some(
      (internId) => internId.toString() === req.body.internId
    );

    if (!internExists) {
      return res.status(400).json({ message: "Intern not in this project" });
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
      evaluatedBy: req.user.id ,// ✅ CONSISTENT
      status:"completed"
    });

    res.status(201).json(evaluation);

  } catch (error) {
    console.error("Add evaluation error:", error);
    res.status(500).json({ message: "Server error" });
  }
});


// Top Interns
// Top Interns (Team Lead specific)
router.get("/top", protect, async (req, res) => {
  try {
    if (req.user.role !== "teamlead") {
      return res.status(403).json({ message: "Access denied" });
    }

    const topInterns = await Evaluation.find({
      evaluatedBy: req.user.id   // 🔥 IMPORTANT FILTER
    })
      .sort({ totalScore: -1 })
      .limit(5)
      .populate("intern", "name email")
      .populate("project", "title");

    res.status(200).json(topInterns);
  } catch (error) {
    console.error("Top interns error:", error);
    res.status(500).json({ message: "Server error" });
  }
});


// Intern My Evaluation
router.get("/my", protect, async (req, res) => {
  try {
    if (req.user.role !== "intern") {
      return res.status(403).json({ message: "Access denied" });
    }

    const userId = req.user.id;

    //console.log("Logged in Intern ID:", userId);

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

// Team Lead - View my given evaluations
router.get("/my-given", protect, async (req, res) => {
  try {
    if (req.user.role !== "teamlead") {
      return res.status(403).json({ message: "Access denied" });
    }

    const evaluations = await Evaluation.find({
      evaluatedBy: req.user.id
    })
      .populate("intern", "name email")
      .populate("project", "title");

    res.status(200).json(evaluations);

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Intern Performance Trend
router.get("/trend", protect, async (req, res) => {
  try {
    if (req.user.role !== "intern") {
      return res.status(403).json({ message: "Access denied" });
    }

    const internId = req.user.id;

    const evaluations = await Evaluation.find({ intern: internId })
      .sort({ createdAt: 1 })
      .select("totalScore grade createdAt project")
      .populate("project", "title");

    if (evaluations.length === 0) {
      return res.status(200).json({
        message: "No evaluations yet",
        trend: []
      });
    }

    const avgScore =
      evaluations.reduce((sum, e) => sum + e.totalScore, 0) /
      evaluations.length;

    res.status(200).json({
      internId,
      averageScore: avgScore.toFixed(2),
      trend: evaluations
    });

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

//intern rankingin teamleader page

// GET /api/evaluation/ranking?page=1&limit=5
router.get("/ranking", protect, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const skip = (page - 1) * limit;

    // Aggregate total score per intern
    const ranking = await Evaluation.aggregate([
      {
        $group: {
          _id: "$intern",
          totalScore: { $sum: "$totalScore" },
          avgScore: { $avg: "$totalScore" },
          evaluations: { $sum: 1 }
        }
      },
      {
        $sort: { totalScore: -1 }
      },
      {
        $skip: skip
      },
      {
        $limit: limit
      }
    ]);

    // Populate intern details
    const Intern = require("../models/user");

    const populatedRanking = await Promise.all(
      ranking.map(async (item, index) => {
        const intern = await Intern.findById(item._id).select("name email");

        return {
          rank: skip + index + 1,
          internId: item._id,
          name: intern?.name || "Unknown",
          email: intern?.email || "",
          totalScore: Math.round(item.totalScore),
          avgScore: item.avgScore.toFixed(2),
          evaluations: item.evaluations
        };
      })
    );

    // Total intern count
    const totalInterns = await Evaluation.aggregate([
      {
        $group: {
          _id: "$intern"
        }
      },
      {
        $count: "count"
      }
    ]);

    const total = totalInterns[0]?.count || 0;

    res.json({
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      data: populatedRanking
    });

  } catch (err) {
    console.error("Ranking error:", err);
    res.status(500).json({ message: "Server error" });
  }
});



router.get("/intern", protect, async (req, res) => {
  try {

    const evaluations = await Evaluation.find({
      intern: req.user.id
    })
      // ✅ INCLUDE description ALSO
      .populate("project", "title description status")
      .populate({
        path: "evaluatedBy",
        select: "name email"
      })
      .sort({ createdAt: -1 });

    const formatted = evaluations.map(e => ({
      evaluationId: e._id,
      projectName: e.project?.title || "Unknown Project",
      description: e.project?.description || "No description available", // ✅ ADD THIS
      totalMarks: e.totalScore,
      grade: e.grade,
      feedback: e.feedback,
      status: e.status,
      evaluatedBy: e.evaluatedBy?.name || "Not available"
    }));

    res.json({
      count: formatted.length,
      data: formatted
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// const Evaluation = require("../models/evaluation");
// const protect = require("../middleware/authMiddleware");

// UPDATE evaluation
router.put(
  "/update/:projectId/:internId",
  protect,
  async (req, res) => {
    try {
      if (req.user.role !== "teamlead") {
        return res.status(403).json({ message: "Access denied" });
      }

      const { projectId, internId } = req.params;

      const evaluation = await Evaluation.findOne({
        project: projectId,
        intern: internId,
        evaluatedBy: req.user.id || req.user._id,
      });

      if (!evaluation) {
        return res.status(404).json({
          message: "Evaluation not found",
        });
      }

      const {
        timeliness,
        behaviour,
        technicalSkills,
        communication,
        teamwork,
        feedback,
      } = req.body;

      evaluation.timeliness = timeliness;
      evaluation.behaviour = behaviour;
      evaluation.technicalSkills = technicalSkills;
      evaluation.communication = communication;
      evaluation.teamwork = teamwork;
      evaluation.feedback = feedback;

      evaluation.status = "completed"; // 🔥 important

      await evaluation.save();

      res.json({
        message: "Evaluation updated successfully",
        evaluation,
      });
    } catch (err) {
      console.error("Update error:", err);
      res.status(500).json({ message: "Server error" });
    }
  }
);


module.exports = router;
