const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const User = require("../models/user.model");
const bcrypt = require("bcryptjs");
const { token } = require("morgan");

const generateToken = (data) => {
    return jwt.sign(data, process.env.JWT_SECRET, { expiresIn: "1d" });
}

const registeruser = asyncHandler(async (req, res) => {
    const { name, email, password, isAdmin } = req.body;

    const userExist = await User.findOne({ email });
    if (userExist) {
        res.status(400);
        throw new Error("User already exists");
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt)
    const user = await User.create({
        name, email, password: hashedPassword, isAdmin: isAdmin || false
    });
    if (user) {
        res.status(201).json({
            success: true,
            token: generateToken({ id: user.id, email: user.email })
        });
    }
    else {
        res.status(400);
        throw new Error("Invalid user data");
    }

});

const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
        return res.status(404).json({ message: "User not found." })
    }

    const isValidated = await bcrypt.compare(password, user.password);

    if (!isValidated)
        return res.status(401).json({ message: "Wrong credentials." })

    res.status(200).json({ success: true, token: generateToken({ id: user.id, email: user.email }) });
})

const getUserProfile = asyncHandler(async (req, res) => {
    const user = req.user;
    if (!user)
        return res.status(401).json({ message: "Unauthorized access." })

    res.status(200).json({ user });
});


module.exports = { registeruser, loginUser, getUserProfile };
