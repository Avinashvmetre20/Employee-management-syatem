const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const userModel = require("../models/user.model");

const protect = async (req, res, next) => {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        try {
            token = req.headers.authorization.split(" ")[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = await userModel.findById(decoded.id).select("-password");
            next();
        } catch (err) {
            res.status(401).json({message:err.message});

        }
    }
    if (!token) {
        res.status(401).json({message:"Not authorised, No Token"});
    }
};

const admin = asyncHandler((req, res, next) => {
    if (req.user && req.user.isAdmin) {
        next();
    } else {
        res.status(403).json("Access denied, admin only");
    }
});

module.exports = { protect, admin }