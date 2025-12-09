const express = require("express");
const dashboard = require("../controller/dashboard");

const router = express.Router();

router.get("getdetails", dashboard);




module.exports = router;