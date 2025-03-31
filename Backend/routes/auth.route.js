const express = require("express");
const {protect} = require("../middlewares/auth.middleware");
const {registeruser,loginUser,getUserProfile} = require("../controlers/auth.controllers")
const router = express.Router();

router.post("/register",registeruser);
router.post("/login",loginUser);
router.get("/profile",protect,getUserProfile);

module.exports = router