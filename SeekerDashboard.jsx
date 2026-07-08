import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import toast from "react-hot-toast";
import ResumeUpload from "../components/ResumeUpload";

function SeekerDashboard() {
    const [applications, setApplications] = useState([]);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadDashboard();
    }, []);

    async function loadDashboard() {
        try {
            // Get user profile
            const userRes = await api.get("/users/me");
            setUser(userRes.data);

            // Get applications
            const appRes = await api.get("/applications/my");
            setApplications(appRes.data);
        } catch (err) {
            console.error("Error loading dashboard:", err);
            toast.error("Failed to load dashboard.");
        } finally {
            setLoading(false);
        }
    }

    const handleResumeUpload = (resumeUrl) => {
        setUser(prev => ({ ...prev, resume_url: resumeUrl }));
        toast.success("Resume uploaded successfully!");
    };

    if (loading) {
        return (
            <div className="container">
                <h2>Loading...</h2>
            </div>
        );
    }

    return (
        <section className="dashboard-page">
            <div className="container">
                <div className="dashboard-header">
                    <div>
                        <h1>Job Seeker Dashboard</h1>
                        <p>Manage your job applications and profile.</p>
                    </div>
                    <Link to="/jobs" className="btn">
                        Browse Jobs
                    </Link>
                </div>

                <div className="profile-section">
                    <h2>My Profile</h2>
                    <div className="profile-card">
                        <p><strong>Name:</strong> {user?.name}</p>
                        <p><strong>Email:</strong> {user?.email}</p>
                        <p><strong>Location:</strong> {user?.location || "Not set"}</p>
                        <p><strong>Skills:</strong> {user?.skills || "Not set"}</p>
                        <Link to="/profile" className="btn btn-secondary">
                            Edit Profile
                        </Link>
                    </div>
                </div>

                <div className="resume-section">
                    <h2>Resume</h2>
                    <ResumeUpload 
                        onUploadSuccess={handleResumeUpload}
                        currentResume={user?.resume_url}
                    />
                </div>

                <h2 className="section-title">My Applications ({applications.length})</h2>

                {applications.length === 0 ? (
                    <div className="empty-state">
                        <h3>No Applications Yet</h3>
                        <p>Browse jobs and apply to start your career journey.</p>
                        <Link to="/jobs" className="btn">
                            Browse Jobs
                        </Link>
                    </div>
                ) : (
                    <div className="applications-grid">
                        {applications.map(app => (
                            <div key={app.id} className="application-card">
                                <h3>{app.job_title}</h3>
                                <p>{app.company_name}</p>
                                <p>📍 {app.job_location}</p>
                                <p>Status: <span className={`status-${app.status}`}>{app.status}</span></p>
                                <p>Applied: {new Date(app.applied_at).toLocaleDateString()}</p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}

export default SeekerDashboard;