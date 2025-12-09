const express = require("express");
const { addjob, allJob, singleJob, updateJob, deleteJob } = require("../controller/job");



const router = express.Router();


router.post("/addjob",addjob);
router.get("/allJob",allJob);
router.get("/singleJob",singleJob);
router.put("/updateJob",updateJob);
router.delete("/deleteJob",deleteJob);






module.exports = router;