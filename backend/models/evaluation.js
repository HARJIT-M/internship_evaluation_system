const mongoose = require("mongoose");

const evaluationSchema = new mongoose.Schema(
  {
    intern: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },

    timeliness: { type: Number, min: 0, max: 10, required: true },
    behaviour: { type: Number, min: 0, max: 10, required: true },
    technicalSkills: { type: Number, min: 0, max: 10, required: true },
    communication: { type: Number, min: 0, max: 10, required: true },
    teamwork: { type: Number, min: 0, max: 10, required: true },

    totalScore: Number,

    grade: String,   // ⭐ NEW FIELD

    feedback: String,

    evaluatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    status:{
      type: String,
      enum: ["ongoing", "completed"],
      default: "ongoing"
    }
  },
  { timestamps: true }
);

// Auto calculate score + grade
evaluationSchema.pre("save", function () {
  this.totalScore =
    this.timeliness +
    this.behaviour +
    this.technicalSkills +
    this.communication +
    this.teamwork;

  // Grade Logic
  if (this.totalScore >= 45) this.grade = "A";
  else if (this.totalScore >= 35) this.grade = "B";
  else if (this.totalScore >= 25) this.grade = "C";
  else this.grade = "D";
//next();
});

module.exports = mongoose.model("Evaluation", evaluationSchema);
