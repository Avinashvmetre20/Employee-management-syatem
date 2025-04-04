import { Link } from "react-router-dom";
import "../styles/LandingPage.css";

const LandingPage = () => {
    return (
        <div className="landing-container">
            <header className="header">
                <h1>Welcome to Employee Management System</h1>
                <p>Effortlessly manage your employees with our easy-to-use platform.</p>
            </header>

            <section className="features">
                <h2>Key Features</h2>
                <ul>
                    <li>✔ Add, Edit, and Delete Employees</li>
                    <li>✔ Upload and Manage Employee Profiles</li>
                    <li>✔ Secure Authentication System</li>
                    <li>✔ Search and Sort Employee Records</li>
                </ul>
            </section>

            <section className="cta-buttons">
                <Link to="/login">
                    <button className="login-btn">Login</button>
                </Link>
                <Link to="/signup">
                    <button className="signup-btn">Sign Up</button>
                </Link>
            </section>

            <footer className="footer">
                <p>© 2025 Employee Management System. All rights reserved.</p>
            </footer>
        </div>
    );
};

export default LandingPage;
