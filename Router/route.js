const express = require("express");

let Router = express.Router();

const { auth, Signup, Login, home } = require("../controller/auth");
const Authorization = require("../Middleware/authorization");


Router.get("/",auth);
Router.post("/Signup",Signup);
Router.post("/Login",Login);
Router.get("/home", Authorization ,home)

















module.exports = Router;