const mongoose = require("mongoose");

const SignupSchema = new mongoose.Schema({
    Name:{
        type: String,
        required: true

    },
    userName:{
        type: String,
        required: true,
    },
    Email:{
        type: String,
        unique: true,
        required: true,
    },
    Password:{
        type: String,
        required: true,
    }
})


const User = mongoose.model("users",SignupSchema)

module.exports = {User};