const mongoose = require("mongoose");

const ResumeSchema = new mongoose.Schema({
  filename: {
    type: String,
    required: true
  },
  originalName: {
    type: String
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  jobDescription: {
    type: String,
    default: "N/A"
  },
  analysis: {
    resumeScore: { type: Number },
    atsScore: { type: Number },
    missingSkills: { type: [String] },
    suggestions: { type: String },
    improvedResumeText: { type: String },
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
});

const resumemodel = mongoose.model("Resume", ResumeSchema);

module.exports = { resumemodel };
