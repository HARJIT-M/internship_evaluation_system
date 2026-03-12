const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
{
    title: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    assignedTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",   // Intern
        required: true
    },
    assignedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",   // Team Lead
        required: true
    },
    status: {
    type: String,
    enum: ["Pending", "In Progress", "Completed"],
    default: "Pending"
},

isProjectBased: {
    type: Boolean,
    default: false
},

projectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Project",
    default: null
}
},
{ timestamps: true }
);

module.exports = mongoose.model("Task", taskSchema);
