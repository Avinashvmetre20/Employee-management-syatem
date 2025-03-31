import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <nav>
      <Link to="/">Home</Link>
      {user ? (
        <>
          <Link to="/employees">Employees</Link>
          <button onClick={logout}>Logout</button>
        </>
      ) : (
        <>
          <Link to="/login">Login</Link>
          <Link to="/signup">Register</Link>
        </>
      )}
    </nav>
  );
};

export default Navbar;
