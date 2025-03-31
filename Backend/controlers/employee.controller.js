const EmployeeModel = require("../models/employee.model");
const cloudinary = require("cloudinary");


const getEmployees = async (req, res) => {
    try {
        const { search, page = 1, limit = 10, sortBy = "createdAt", order = "desc" } = req.query;
        const query = search
            ? {
                  $or: [
                      { name: { $regex: search, $options: "i" } },
                      { email: { $regex: search, $options: "i" } },
                      { position: { $regex: search, $options: "i" } },
                  ],
              }
            : {};

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
    const { name, email, position, phone } = req.body;
    if (!req.file) {
        return res.status(400).json({ msg: "Image upload required" })
    }
    const imageUrl = req.file.path;
    try {
        const data = await EmployeeModel.create({
            name, email, position, phone, profilePic: imageUrl, createdBy: req.user._id
        })
        res.status(201).json(data);
    }
    catch (err) {
        res.status(500).json({ msg: err.message })
    }
}

const getEmployeeById = async (req, res) => {
    try {
        const employee = await EmployeeModel.findById(req.params.id);
        if (!employee) {
            return res.status(404).json({ msg: "employee not found" })
        }
        res.status(200).json(employee)
    }
    catch (error) {
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
    }
    catch (err) {
        res.status(500).json("error in updating file")
    }
}

const deleteEmployee = async (req, res) => {
    const employee = await EmployeeModel.findById(req.params.id);
    if (!employee) {
        return res.status(404).json({ msg: "Employee not found" });
    }
    if (employee.profilePic) {
        const publicId = employee.profilePic.split("/").pop().split(".")[0];
        await cloudinary.uploader.destroy(publicId);
    }
    await EmployeeModel.findByIdAndDelete(req.params.id);
    res.status(200).json({ msg: "Employee deleted successfully" });
}

module.exports = { getEmployees, createEmployee, getEmployeeById, updateEmployee, deleteEmployee }