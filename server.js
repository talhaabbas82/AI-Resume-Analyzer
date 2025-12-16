const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const path = require("path");

const router = require("./Router/route");
const resumeRoute = require("./Router/resume");
const Authorization = require("./Middleware/authorization");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

// Routes
app.use("/api", router);
app.use("/api",Authorization, resumeRoute);






  app.listen(PORT, "0,0,0,0" ,() => {
    console.log(`Server running locally on port ${PORT}`);
  });


