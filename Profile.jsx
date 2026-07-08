import { useEffect, useState } from "react";
import api from "../services/api";
import toast from "react-hot-toast";
import ResumeUpload from "../components/ResumeUpload";
import { useAuth } from "../context/AuthContext";

function Profile() {
    const { user: authUser } = useAuth();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        location: "",
        bio: "",
        skills: "",
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
    });

    useEffect(() => {
        loadProfile();
    }, []);

    async function loadProfile() {
        try {
            const res = await api.get("/users/me");
            setUser(res.data);
            setFormData({
                name: res.data.name || "",
                email: res.data.email || "",
                phone: res.data.phone || "",
                location: res.data.location || "",
                bio: res.data.bio || "",
                skills: res.data.skills || "",
                currentPassword: "",
                newPassword: "",
                confirmPassword: ""
            });
        } catch (err) {
            console.error("Error loading profile:", err);
            toast.error("Failed to load profile.");
        } finally {
            setLoading(false);
        }
    }

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (formData.newPassword && formData.newPassword !== formData.confirmPassword) {
            toast.error("Passwords do not match.");
            return;
        }

        if (formData.newPassword && formData.newPassword.length < 6) {
            toast.error("Password must be at least 6 characters");
            return;
        }

        setUpdating(true);
        try {
            const updateData = {
                name: formData.name,
                email: formData.email,
                phone: formData.phone,
                location: formData.location,
                bio: formData.bio,
                skills: formData.skills
            };

            if (formData.newPassword) {
                updateData.currentPassword = formData.currentPassword;
                updateData.newPassword = formData.newPassword;
            }

            const res = await api.put("/users/me", updateData);
            setUser(res.data.user);
            toast.success("Profile updated successfully!");
            
            setFormData({
                ...formData,
                currentPassword: "",
                newPassword: "",
                confirmPassword: ""
            });
        } catch (err) {
            console.error("Error updating profile:", err);
            toast.error(err.response?.data?.message || "Failed to update profile.");
        } finally {
            setUpdating(false);
        }
    };

    const handleResumeUpload = (resumeUrl) => {
        setUser(prev => ({ ...prev, resume_url: resumeUrl }));
        toast.success("Resume uploaded successfully!");
    };

    if (loading) {
        return (
            <div className="container" style={{ textAlign: "center", padding: "4rem 0" }}>
                <h2>Loading...</h2>
            </div>
        );
    }

    return (
        <div className="container">
            <div className="profile-container">
                <h1>My Profile</h1>
                
                {/* Resume Upload - Only for Job Seekers */}
                {authUser?.role === "job_seeker" && (
                    <div className="profile-section">
                        <h2>Resume</h2>
                        <ResumeUpload 
                            onUploadSuccess={handleResumeUpload}
                            currentResume={user?.resume_url}
                        />
                    </div>
                )}

                {/* Profile Update Form */}
                <div className="profile-section">
                    <h2>Personal Information</h2>
                    <form onSubmit={handleSubmit} className="profile-form">
                        <div className="form-group">
                            <label>Full Name *</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Email *</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Phone</label>
                            <input
                                type="text"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                placeholder="+251 9XX XXX XXX"
                            />
                        </div>

                        <div className="form-group">
                            <label>Location</label>
                            <input
                                type="text"
                                name="location"
                                value={formData.location}
                                onChange={handleChange}
                                placeholder="Addis Ababa, Ethiopia"
                            />
                        </div>

                        <div className="form-group">
                            <label>Bio</label>
                            <textarea
                                name="bio"
                                value={formData.bio}
                                onChange={handleChange}
                                rows="4"
                                placeholder="Tell us about yourself..."
                            />
                        </div>

                        <div className="form-group">
                            <label>Skills (comma separated)</label>
                            <input
                                type="text"
                                name="skills"
                                value={formData.skills}
                                onChange={handleChange}
                                placeholder="React, Node.js, Python, etc."
                            />
                        </div>

                        <hr />

                        <h3>Change Password (optional)</h3>

                        <div className="form-group">
                            <label>Current Password</label>
                            <input
                                type="password"
                                name="currentPassword"
                                value={formData.currentPassword}
                                onChange={handleChange}
                                placeholder="Required to change password"
                            />
                        </div>

                        <div className="form-group">
                            <label>New Password</label>
                            <input
                                type="password"
                                name="newPassword"
                                value={formData.newPassword}
                                onChange={handleChange}
                                placeholder="Min 6 characters"
                            />
                        </div>

                        <div className="form-group">
                            <label>Confirm New Password</label>
                            <input
                                type="password"
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                placeholder="Confirm your new password"
                            />
                        </div>

                        <button type="submit" className="btn btn-primary" disabled={updating}>
                            {updating ? "Updating..." : "Update Profile"}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Profile;