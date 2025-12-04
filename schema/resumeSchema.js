const mongoose = require("mongoose");

const resumeSchema = new mongoose.Schema({
    serId: String,
  originalText: String,
  improvedText: String,
  score: Number,
  atsScore: Number,
  suggestions: Array,
  createdAt: { type: Date, default: Date.now }
});

const resume = mongoose.model("resumemodels",resumeSchema);

module.exports =  { resume };

