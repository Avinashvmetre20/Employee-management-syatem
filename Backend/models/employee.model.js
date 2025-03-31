const mongoose = require("mongoose");

const employeeSchema = mongoose.Schema(
    {
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        position: { type: String, required: true },
        phone: { type: String, required: true },
        profilePic: { type: String, required: false }, 
        createdBy: { 
            type: mongoose.Schema.Types.ObjectId, 
            ref: "User", 
            required: true 
        },
    },
    { timestamps: true }
);

module.exports  = mongoose.model("Employe", employeeSchema);

