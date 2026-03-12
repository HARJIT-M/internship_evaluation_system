const express = require("express");
const Task = require("../models/task");
const jwt = require("jsonwebtoken");

const router = express.Router();

/* =========================
   AUTH PROTECT MIDDLEWARE
========================= */
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

/* =========================
   1. ASSIGN TASK (TEAMLEAD)
   POST /api/tasks/assign
========================= */
router.post("/assign", protect, async (req, res) => {
  try {
    if (req.user.role !== "teamlead") {
      return res.status(403).json({ message: "Access denied" });
    }

    const { title, description, internId, isProjectBased, projectId } = req.body;

    const task = await Task.create({
  title,
  description,
  assignedTo: internId,
  assignedBy: req.user.id,
  isProjectBased: isProjectBased || false,
  projectId: isProjectBased ? projectId : null
});

    res.status(201).json(task);
  } catch (err) {
    console.error("Assign task error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

/* =========================
   2. INTERN - GET MY TASKS
   GET /api/tasks/my
========================= */
router.get("/my", protect, async (req, res) => {
  try {
    //console.log("User from token:", req.user); 
    if (req.user.role !== "intern") {
      return res.status(403).json({ message: "Access denied" });
    }

    const tasks = await Task.find({ assignedTo: req.user.id })
      .populate("assignedBy", "name")
      .populate("projectId", "title")
      .sort({ createdAt: -1 });

    res.status(200).json(tasks);
  } catch (err) {
    console.error("Fetch intern tasks error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

/* =========================
   3. INTERN - UPDATE STATUS
   PUT /api/tasks/update/:taskId
========================= */
router.put("/update/:taskId", protect, async (req, res) => {
  try {
    if (req.user.role !== "intern") {
      return res.status(403).json({ message: "Access denied" });
    }

    const { status } = req.body;

    const task = await Task.findOneAndUpdate(
      {
        _id: req.params.taskId,
        assignedTo: req.user.id,
      },
      { status },
      { new: true }
    );

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.status(200).json(task);
  } catch (err) {
    console.error("Update task error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

/* =========================
   4. TEAMLEAD - VIEW TASKS
   GET /api/tasks/teamlead
========================= */
router.get("/teamlead", protect, async (req, res) => {
  try {
    if (req.user.role !== "teamlead") {
      return res.status(403).json({ message: "Access denied" });
    }

    const tasks = await Task.find({ assignedBy: req.user.id })
  .populate("assignedTo", "name email")
  .populate("projectId", "title")
  .sort({ createdAt: -1 });

    res.status(200).json(tasks);
  } catch (err) {
    console.error("Teamlead tasks error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

router.put("/update-status/:id", protect, async (req, res) => {
  try {

    // role check (only intern allowed)
    if (req.user.role !== "intern") {
      return res.status(403).json({ message: "Access denied" });
    }

    const { status } = req.body;

    // validate status
    const validStatus = ["Pending", "In Progress", "Completed"];

    if (!validStatus.includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    // ensure intern updates only their task
    if (task.assignedTo.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not your task" });
    }

    task.status = status;

    await task.save();

    res.status(200).json({
      message: "Task status updated",
      task
    });

  } catch (error) {
    console.error("Update status error:", error);
    res.status(500).json({ message: "Server error" });
  }
});





module.exports = router;
