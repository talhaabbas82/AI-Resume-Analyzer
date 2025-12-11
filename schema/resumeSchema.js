const mongoose = require("mongoose");

const ResumeSchema = new mongoose.Schema({
  filename: {
    type: String,
    required: true
  },
  originalName: {
    type: String
  },
  // Make sure you actually have a User ID available when saving, otherwise remove 'required'
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: false // Set to true only if you are sure you can pass the ID
  },
  jobDescription: {
    type: String,
    default: "N/A"
  },
  analysis: {
    // Schema uses camelCase (Best Practice)
    resumeScore: { type: Number },
    atsScore: { type: Number },
    matchPercentage: { type: Number }, // <--- Added this (was missing)
    missingSkills: { type: [String] },
    suggestions: { type: String }, // Can store general advice here
    improvedResumeText: { type: String }, // Stores "Corrected Resume"
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
});

const resumemodel = mongoose.model("Resume", ResumeSchema);

module.exports = { resumemodel };