const express = require("express");
const router = express.Router()

const authRoutes = require("./auth.route") 
const employeeRoutes = require("./employee.route")

router.use("/auth",authRoutes);
router.use("/employee",employeeRoutes)

module.exports = router
