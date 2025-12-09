const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const path = require("path");

const router = require("./Router/route");
const jobroutes = require("./Router/job");
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
app.use("/api", jobroutes);
app.use("/api",Authorization, resumeRoute);


app.get("/", (req, res) => {
  res.send("Backend is running ✅");
});

app.post("/api/test", (req, res) => {
  res.json({ message: "API working ✅" });
});


module.exports = app; 
if (require.main === module) {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server running locally on port ${PORT}`);
  });
}

