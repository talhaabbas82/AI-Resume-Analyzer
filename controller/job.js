const Job = require("../schema/jobSchema");

async function addjob(req, res) {
  try {
    const { company, position, jobDescription, status, notes } = req.body;

    const job = new Job({
      company,
      position,
      jobDescription,
      status,
      notes,
      userId: req.user.id,
    });

    const savedJob = await job.save();

    res.status(200).json({
      status: 200,
      message: "Job posted successfully",
      job: savedJob,
    });
  } catch (error) {
    res.status(500).json({
      status: 500,
      message: "Error while posting job",
      error: error.message,
    });
  }
}



const allJob = async (req, res) => {
  try {
    const jobs = await Job.find({ userId: req.user.id });
    res.status(200).json({
      status: 200,
      message: "All jobs displayed",
      jobs,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const singleJob = async (req, res) => {
  try {
    const jobId = req.params.id;
    const job = await Job.findOne({ _id: jobId, userId: req.user.id });
    if (!job) {
      return res.status(404).json({ status: 404, message: "Job not found" });
    }
    res.status(200).json({
      status: 200,
      message: "Job retrieved",
      job,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateJob = async (req, res) => {
  try {
    const jobId = req.params.id;
    const updatedJob = await Job.findOneAndUpdate(
      { _id: jobId, userId: req.user.id },
      req.body,
      { new: true }
    );
    if (!updatedJob) {
      return res.status(404).json({ status: 404, message: "Job not found" });
    }
    res.status(200).json({
      status: 200,
      message: "Job updated successfully",
      job: updatedJob,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteJob = async (req, res) => {
  try {
    const jobId = req.params.id;
    const deletedJob = await Job.findOneAndDelete({
      _id: jobId,
      userId: req.user.id,
    });
    if (!deletedJob) {
      return res.status(404).json({ status: 404, message: "Job not found" });
    }
    res.status(200).json({
      status: 200,
      message: "Job deleted successfully",
      job: deletedJob,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { addjob,allJob,singleJob ,updateJob,deleteJob};
