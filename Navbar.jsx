import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";

function Navbar() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [menuOpen, setMenuOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate("/");
        setMenuOpen(false);
    };

    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    };

    return (
        <nav className="navbar">
            <div className="navbar-container">
                <Link to="/" className="logo" onClick={() => setMenuOpen(false)}>
                    Nayo Jobs
                </Link>

                <button className="menu-toggle" onClick={toggleMenu}>
                    ☰
                </button>

                <ul className={`nav-links ${menuOpen ? "active" : ""}`}>
                    <li><Link to="/" onClick={() => setMenuOpen(false)}>Home</Link></li>
                    <li><Link to="/jobs" onClick={() => setMenuOpen(false)}>Jobs</Link></li>
                    
                    {user ? (
                        <>
                            {user.role === "job_seeker" && (
                                <li>
                                    <Link to="/seeker-dashboard" onClick={() => setMenuOpen(false)}>
                                        Dashboard
                                    </Link>
                                </li>
                            )}
                            {user.role === "employer" && (
                                <li>
                                    <Link to="/employer-dashboard" onClick={() => setMenuOpen(false)}>
                                        Dashboard
                                    </Link>
                                </li>
                            )}
                            {user.role === "admin" && (
                                <li>
                                    <Link to="/admin" onClick={() => setMenuOpen(false)}>
                                        Admin
                                    </Link>
                                </li>
                            )}
                            <li>
                                <button onClick={handleLogout} className="btn btn-small">
                                    Logout
                                </button>
                            </li>
                        </>
                    ) : (
                        <>
                            <li><Link to="/login" onClick={() => setMenuOpen(false)}>Login</Link></li>
                            <li>
                                <Link to="/register" className="btn btn-small" onClick={() => setMenuOpen(false)}>
                                    Register
                                </Link>
                            </li>
                        </>
                    )}
                </ul>
            </div>
        </nav>
    );
}

export default Navbar;