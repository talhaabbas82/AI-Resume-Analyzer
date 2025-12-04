const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema({
    userId : String,
    company : String,
    position: String,
    jobDescription: String,
    status: String,
    notes: String,
    CreatedAt: { type: Date, default: Date.now}
});


const job = mongoose.model("jobs", jobSchema);

module.exports = {jobSchema};