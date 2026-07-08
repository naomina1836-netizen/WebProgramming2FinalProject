import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";
import toast from "react-hot-toast";

function Register() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        role: "job_seeker",
        location: "",
        phone: ""
    });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (formData.password !== formData.confirmPassword) {
            toast.error("Passwords do not match");
            return;
        }

        if (formData.password.length < 6) {
            toast.error("Password must be at least 6 characters");
            return;
        }

        setLoading(true);

        try {
            const { confirmPassword, ...registerData } = formData;
            await api.post("/auth/register", registerData);
            toast.success("Registration successful! Please login.");
            
            // Clear form
            setFormData({
                name: "",
                email: "",
                password: "",
                confirmPassword: "",
                role: "job_seeker",
                location: "",
                phone: ""
            });
            
            navigate("/login");
        } catch (err) {
            console.error("Registration error:", err);
            toast.error(err.response?.data?.message || "Registration failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">
            <div className="container">
                <div className="auth-wrapper">
                    <div className="auth-left">
                        <h1>Create Your <span className="gold">Account</span></h1>
                        <p>Join Nayo Jobs and start your career journey today.</p>
                        <ul className="auth-features">
                            <li>Find your dream job</li>
                            <li>Upload your resume</li>
                            <li>Apply with one click</li>
                            <li>Track your applications</li>
                        </ul>
                    </div>
                    <div className="auth-right">
                        <div className="auth-card">
                            <h2>Create Account</h2>
                            <p className="auth-subtitle">Fill in your details to get started</p>

                            <form onSubmit={handleSubmit} className="auth-form">
                                <div className="form-group">
                                    <label htmlFor="name">Full Name *</label>
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                        placeholder="e.g., Abebe Kebede"
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="email">Email Address *</label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                        placeholder="e.g., abebe@example.com"
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="phone">Phone Number</label>
                                    <input
                                        type="tel"
                                        id="phone"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        placeholder="e.g., +251 911 123 456"
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="location">Location</label>
                                    <input
                                        type="text"
                                        id="location"
                                        name="location"
                                        value={formData.location}
                                        onChange={handleChange}
                                        placeholder="e.g., Addis Ababa, Ethiopia"
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="role">I want to</label>
                                    <select
                                        id="role"
                                        name="role"
                                        value={formData.role}
                                        onChange={handleChange}
                                        required
                                    >
                                        <option value="job_seeker">Find a Job</option>
                                        <option value="employer">Hire Employees</option>
                                    </select>
                                </div>

                                <div className="form-group">
                                    <label htmlFor="password">Password *</label>
                                    <input
                                        type="password"
                                        id="password"
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        required
                                        placeholder="Minimum 6 characters"
                                        minLength="6"
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="confirmPassword">Confirm Password *</label>
                                    <input
                                        type="password"
                                        id="confirmPassword"
                                        name="confirmPassword"
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                        required
                                        placeholder="Re-enter your password"
                                    />
                                </div>

                                <button type="submit" className="btn btn-primary" disabled={loading}>
                                    {loading ? "Creating Account..." : "Create Account"}
                                </button>
                            </form>

                            <p className="auth-link">
                                Already have an account? <Link to="/login">Login here</Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Register;