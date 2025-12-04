const express = require("express");
// const fileUpload = require("express.fileupload");
const dotenv = require("dotenv");
const cors = require("cors");
const app = express();
const PORT = 3000 || process.env.PORT;
const router = require("./Router/route")

dotenv.config();
app.use(express.json());
app.use(cors());
app.use(express.static("public"));
app.use("/api",router)







app.listen(PORT,()=>{
    console.log(`server is running on ${PORT} `)
});