import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "../styles/EmployeeList.css"; // Import the CSS file

const EmployeeList = () => {
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [sortBy, setSortBy] = useState("createdAt");
    const [order, setOrder] = useState("desc");
    const [deleting, setDeleting] = useState(null);

    useEffect(() => {
        const fetchEmployees = async () => {
            setLoading(true);
            try {
                const token = localStorage.getItem("token");
                const response = await axios.get("http://localhost:5000/api/employee", {
                    headers: { Authorization: `Bearer ${token}` },
                    params: { search, page, limit: 10, sortBy, order },
                });

                setEmployees(response.data.employees);
                setTotalPages(response.data.totalPages);
            } catch (err) {
                setError(err.response?.data?.msg || "Something went wrong");
            } finally {
                setLoading(false);
            }
        };

        const delaySearch = setTimeout(fetchEmployees, 500);

        return () => clearTimeout(delaySearch);
    }, [search, page, sortBy, order]);

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this employee?")) return;

        setDeleting(id);
        try {
            const token = localStorage.getItem("token");
            await axios.delete(`http://localhost:5000/api/employee/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setEmployees(employees.filter((emp) => emp._id !== id));
        } catch (err) {
            alert("Error deleting employee");
        } finally {
            setDeleting(null);
        }
    };

    const handleSort = (column) => {
        setSortBy(column);
        setOrder(order === "asc" ? "desc" : "asc");
    };

    return (
        <div className="employee-list-container">
            <h2>Employee List</h2>

            {/* Search & Add Button */}
            <div className="employee-controls">
                <input
                    type="text"
                    placeholder="Search employees..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
                <Link to="/employees/add">
                    <button>Add Employee</button>
                </Link>
            </div>

            {/* Employee Table */}
            {loading ? (
                <p>Loading employees...</p>
            ) : error ? (
                <p style={{ color: "red" }}>{error}</p>
            ) : employees.length === 0 ? (
                <p>No employees found.</p>
            ) : (
                <table className="employee-table">
                    <thead>
                        <tr>
                            <th onClick={() => handleSort("name")}>
                                Name {sortBy === "name" && (order === "asc" ? "⬆" : "⬇")}
                            </th>
                            <th onClick={() => handleSort("email")}>
                                Email {sortBy === "email" && (order === "asc" ? "⬆" : "⬇")}
                            </th>
                            <th>Position</th>
                            <th>Phone</th>
                            <th>Profile Pic</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {employees.map((emp) => (
                            <tr key={emp._id}>
                                <td>{emp.name}</td>
                                <td>{emp.email}</td>
                                <td>{emp.position}</td>
                                <td>{emp.phone}</td>
                                <td>
                                    <img src={emp.profilePic} alt="profile" />
                                </td>
                                <td className="action-buttons">
                                    <Link to={`/employees/edit/${emp._id}`}>
                                        <button>Edit</button>
                                    </Link>
                                    <button onClick={() => handleDelete(emp._id)} disabled={deleting === emp._id}>
                                        {deleting === emp._id ? "Deleting..." : "Delete"}
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}

            {/* Pagination */}
            <div className="pagination">
                <button onClick={() => setPage(page - 1)} disabled={page === 1}>Previous</button>
                <span> Page {page} of {totalPages} </span>
                <button onClick={() => setPage(page + 1)} disabled={page === totalPages}>Next</button>
            </div>
        </div>
    );
};

export default EmployeeList;
