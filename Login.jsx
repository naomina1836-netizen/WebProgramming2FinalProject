import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            await login(email, password);
            toast.success("Welcome back!");
            setEmail("");
            setPassword("");
            navigate("/");
        } catch (err) {
            console.error("Login error:", err);
            toast.error(err.response?.data?.message || "Login failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">
            <div className="container">
                <div className="auth-wrapper">
                    <div className="auth-left">
                        <h1>Welcome to <span className="gold">Nayo Jobs</span></h1>
                        <p>Login to your account and continue your journey.</p>
                        <ul className="auth-features">
                            <li>Access your personalized dashboard</li>
                            <li>Track your applications</li>
                            <li>Manage your job postings</li>
                            <li>Connect with employers</li>
                        </ul>
                    </div>
                    <div className="auth-right">
                        <div className="auth-card">
                            <h2>Login</h2>
                            <p className="auth-subtitle">Enter your credentials to access your account</p>

                            <form onSubmit={handleSubmit} className="auth-form">
                                <div className="form-group">
                                    <label htmlFor="email">Email Address</label>
                                    <input
                                        type="email"
                                        id="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                        placeholder="you@example.com"
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="password">Password</label>
                                    <input
                                        type="password"
                                        id="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                        placeholder="Enter your password"
                                    />
                                </div>

                                <button type="submit" className="btn btn-primary" disabled={loading}>
                                    {loading ? "Logging in..." : "Login"}
                                </button>
                            </form>

                            <p className="auth-link">
                                Don't have an account? <Link to="/register">Register here</Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;