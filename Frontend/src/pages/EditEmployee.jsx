import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/EditEmployee.css"; // Import the CSS file

const EditEmployee = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [employee, setEmployee] = useState({
        name: "",
        email: "",
        position: "",
        phone: "",
        profilePic: "",
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);

    useEffect(() => {
        const fetchEmployee = async () => {
            try {
                const token = localStorage.getItem("token");
                const response = await axios.get(`http://localhost:5000/api/employee/${id}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setEmployee(response.data);
            } catch (err) {
                setError(err.response?.data?.msg || "Failed to fetch employee");
            }
        };
        fetchEmployee();
    }, [id]);

    const handleChange = (e) => {
        setEmployee({ ...employee, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        setSelectedFile(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const token = localStorage.getItem("token");
            const formData = new FormData();
            formData.append("name", employee.name);
            formData.append("email", employee.email);
            formData.append("position", employee.position);
            formData.append("phone", employee.phone);
            if (selectedFile) {
                formData.append("profilePic", selectedFile);
            }

            await axios.put(`http://localhost:5000/api/employee/${id}`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "multipart/form-data",
                },
            });

            navigate("/employeelist"); // Redirect to employee list
        } catch (err) {
            setError(err.response?.data?.msg || "Failed to update employee");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="edit-employee-container">
            <h2>Edit Employee</h2>
            {error && <p className="error-message">{error}</p>}
            <form onSubmit={handleSubmit} className="edit-employee-form">
                <div>
                    <label>Name:</label>
                    <input type="text" name="name" value={employee.name} onChange={handleChange} required />
                </div>
                <div>
                    <label>Email:</label>
                    <input type="email" name="email" value={employee.email} onChange={handleChange} required />
                </div>
                <div>
                    <label>Position:</label>
                    <input type="text" name="position" value={employee.position} onChange={handleChange} required />
                </div>
                <div>
                    <label>Phone:</label>
                    <input type="text" name="phone" value={employee.phone} onChange={handleChange} required />
                </div>
                <div>
                    <label>Profile Picture:</label>
                    <input type="file" onChange={handleFileChange} />
                    {employee.profilePic && <img src={employee.profilePic} alt="Profile" className="profile-pic" />}
                </div>
                <button type="submit" disabled={loading}>{loading ? "Updating..." : "Update Employee"}</button>
            </form>
        </div>
    );
};

export default EditEmployee;
