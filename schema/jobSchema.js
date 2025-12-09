const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema({
    Company:{
        type: "string",
        required: true,
    },
    Position:{
        type: "string",
        required: true,
    },
    jobDescription:{
        type: "string",
        required: true,
    },
    status:{
        type: "string",
        requird: true,
    },
    CreatedAt:{
        type: Date,
        default: Date.now,
        
    },

});


const job = mongoose.model("jobs",jobSchema);

module.exports = job;