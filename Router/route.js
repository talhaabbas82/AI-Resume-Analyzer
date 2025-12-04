const express = require("express");

let Router = express.Router();

const { auth, Signup, Login, home } = require("../controller/auth");
const { Analyzer } = require("../controller/resume");
const Authorization = require("../Middleware/authorization");


Router.get("/",auth);
Router.post("/Signup",Signup);
Router.post("/Login",Login);
Router.get("/home", Authorization ,home)
Router.post("/Analyzer",Analyzer);
















module.exports = Router;