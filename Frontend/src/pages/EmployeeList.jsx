import { useState, useEffect } from "react";
import { getEmployees } from "../services/api";
import { useAuth } from "../context/AuthContext";

const EmployeeList = () => {
  const { token } = useAuth();
  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    getEmployees(token).then(setEmployees);
  }, [token]);

  return (
    <div>
      <h2>Employee List</h2>
      <ul>
        {employees.map((emp) => (
          <li key={emp._id}>{emp.name} - {emp.position}</li>
        ))}
      </ul>
    </div>
  );
};

export default EmployeeList;
