const express = require("express");
const router = express.Router();
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");


// Protect middleware
const protect = (req, res, next) => {

  const token = req.headers.authorization?.split(" ")[1];

  if (!token)
    return res.status(401).json({ message: "No token" });

  try {

    req.user = jwt.verify(token, process.env.JWT_SECRET);

    next();

  }
  catch {

    res.status(401).json({ message: "Invalid token" });

  }

};


// Admin only middleware
const adminOnly = (req, res, next) => {

  if (req.user.role !== "admin") {

    return res.status(403).json({
      message: "Admin access only"
    });

  }

  next();

};



// =============================
// ADD USER (Intern / TeamLead)
// =============================
router.post("/add-user", protect, adminOnly, async (req, res) => {

  try {

    const { name, email, password, role } = req.body;

    if (!name || !email || !password || !role) {

      return res.status(400).json({
        message: "All fields required"
      });

    }

    if (!["intern", "teamlead"].includes(role)) {

      return res.status(400).json({
        message: "Invalid role"
      });

    }

    const existing = await User.findOne({ email });

    if (existing) {

      return res.status(400).json({
        message: "User already exists"
      });

    }

    const hashedPassword =
      await bcrypt.hash(password, 10);

    const user = await User.create({

      name,
      email,
      password: hashedPassword,
      role

    });

    res.status(201).json({

      message: "User created successfully",
      user

    });

  }
  catch (err) {

    console.error(err);

    res.status(500).json({
      message: "Server error"
    });

  }

});



// =============================
// GET ALL INTERNS
// =============================
router.get("/interns", protect, adminOnly, async (req, res) => {

  try {

    const interns =
      await User.find({ role: "intern" })
      .select("-password");

    res.json(interns);

  }
  catch {

    res.status(500).json({
      message: "Server error"
    });

  }

});



// =============================
// GET ALL TEAMLEADS
// =============================
router.get("/teamleads", protect, adminOnly, async (req, res) => {

  try {

    const teamleads =
      await User.find({ role: "teamlead" })
      .select("-password");

    res.json(teamleads);

  }
  catch {

    res.status(500).json({
      message: "Server error"
    });

  }

});



// =============================
// DELETE USER
// =============================
router.delete("/delete-user/:id",
protect,
adminOnly,
async (req, res) => {

  try {

    const user =
      await User.findById(req.params.id);

    if (!user) {

      return res.status(404).json({
        message: "User not found"
      });

    }

    await User.findByIdAndDelete(req.params.id);

    res.json({
      message: "User deleted successfully"
    });

  }
  catch {

    res.status(500).json({
      message: "Server error"
    });

  }

});



module.exports = router;
