const express = require("express");

const {getEmployees, createEmployee,getEmployeeById, updateEmployee,deleteEmployee} = require("../controlers/employee.controller") 
const {protect} = require("../middlewares/auth.middleware")
const {upload} = require("../config/cloudinary")

const router = express.Router();

router.get("/",protect, getEmployees)
router.post("/",protect,upload.single("profilePic"), createEmployee);
router.get("/:id",protect, getEmployeeById);
router.put("/:id",protect,upload.single("profilePic"), updateEmployee)
router.delete("/:id",protect, deleteEmployee);

module.exports = router;
