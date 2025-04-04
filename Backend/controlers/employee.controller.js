const EmployeeModel = require("../models/employee.model");
const cloudinary = require("cloudinary").v2;

const getEmployees = async (req, res) => {
    try {
        const { search, page = 1, limit = 10, sortBy = "createdAt", order = "desc" } = req.query;

        if (!req.user) {
            return res.status(401).json({ msg: "Unauthorized" });
        }

        const query = { createdBy: req.user.id }; // Ensure only fetching user's employees

        if (search) {
            query.$or = [
                { name: { $regex: search, $options: "i" } },
                { email: { $regex: search, $options: "i" } },
                { position: { $regex: search, $options: "i" } },
            ];
        }

        const employees = await EmployeeModel.find(query)
            .sort({ [sortBy]: order === "desc" ? -1 : 1 })
            .skip((page - 1) * limit)
            .limit(parseInt(limit));

        const totalEmployees = await EmployeeModel.countDocuments(query);

        res.status(200).json({
            totalEmployees,
            totalPages: Math.ceil(totalEmployees / limit),
            currentPage: Number(page),
            employees,
        });
    } catch (err) {
        res.status(500).json({ msg: err.message });
    }
};

const createEmployee = async (req, res) => {
    try {
        const { name, email, position, phone } = req.body;

        if (!req.user) {
            return res.status(401).json({ msg: "Unauthorized" });
        }

        if (!req.file) {
            return res.status(400).json({ msg: "Image upload required" });
        }

        // Upload to Cloudinary
        const uploadedImage = await cloudinary.uploader.upload(req.file.path);
        const imageUrl = uploadedImage.secure_url;

        // Ensure unique email per user
        const existingEmployee = await EmployeeModel.findOne({ email, createdBy: req.user.id });
        if (existingEmployee) {
            return res.status(400).json({ msg: "Employee with this email already exists." });
        }

        const newEmployee = await EmployeeModel.create({
            name,
            email,
            position,
            phone,
            profilePic: imageUrl,
            createdBy: req.user.id, // Use 'id' instead of '_id'
        });

        res.status(201).json(newEmployee);
    } catch (err) {
        res.status(500).json({ msg: err.message });
    }
};

const getEmployeeById = async (req, res) => {
    try {
        const employee = await EmployeeModel.findById(req.params.id);

        if (!employee) {
            return res.status(404).json({ msg: "Employee not found" });
        }

        // Ensure the employee belongs to the logged-in user
        if (employee.createdBy.toString() !== req.user.id) {
            return res.status(403).json({ msg: "Unauthorized to access this employee" });
        }

        res.status(200).json(employee);
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};

const updateEmployee = async (req, res) => {
    try {
        const { name, email, position, phone } = req.body;
        const employeeId = req.params.id;

        let employee = await EmployeeModel.findById(employeeId);
        if (!employee) {
            return res.status(404).json({ msg: "Employee not found" });
        }

        // Ensure the employee belongs to the logged-in user
        if (employee.createdBy.toString() !== req.user.id) {
            return res.status(403).json({ msg: "Unauthorized to update this employee" });
        }

        let imageUrl = employee.profilePic;
        if (req.file) {
            const uploadedImage = await cloudinary.uploader.upload(req.file.path);
            imageUrl = uploadedImage.secure_url;
        }

        employee.name = name || employee.name;
        employee.email = email || employee.email;
        employee.position = position || employee.position;
        employee.phone = phone || employee.phone;
        employee.profilePic = imageUrl;

        const updatedEmployee = await employee.save();
        res.status(200).json(updatedEmployee);
    } catch (err) {
        res.status(500).json({ msg: "Error updating employee" });
    }
};

const deleteEmployee = async (req, res) => {
    try {
        const employee = await EmployeeModel.findById(req.params.id);
        if (!employee) {
            return res.status(404).json({ msg: "Employee not found" });
        }

        // Ensure the employee belongs to the logged-in user
        if (employee.createdBy.toString() !== req.user.id) {
            return res.status(403).json({ msg: "Unauthorized to delete this employee" });
        }

        // Delete image from Cloudinary
        if (employee.profilePic) {
            const publicId = employee.profilePic.split("/").pop().split(".")[0];
            await cloudinary.uploader.destroy(publicId);
        }

        await EmployeeModel.findByIdAndDelete(req.params.id);
        res.status(200).json({ msg: "Employee deleted successfully" });
    } catch (err) {
        res.status(500).json({ msg: "Error deleting employee" });
    }
};

module.exports = { getEmployees, createEmployee, getEmployeeById, updateEmployee, deleteEmployee };
