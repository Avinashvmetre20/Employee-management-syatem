import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import EmployeeList from "./pages/EmployeeList";
import AddEmployee from "./pages/AddEmployee";
import PrivateRoute from "./components/PrivateRoute";
import EditEmployee from "./pages/EditEmployee";
import LandingPage from "./pages/LandingPage";

function App() {
  return (
    <>
   
        <Navbar /> 
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
        
          {/* Protected Routes */}
          <Route element={<PrivateRoute />}>
          <Route path="/employeelist" element={<EmployeeList />} />
          <Route path="/employees/add" element={<AddEmployee />} /> 
          <Route path="/employees/edit/:id" element={<EditEmployee />} />
          </Route>
        </Routes>
    
        </>
  );
}

export default App;
