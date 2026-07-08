import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import toast from "react-hot-toast";

function JobForm({ jobId, initialData }) {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        location: "",
        salary: "",
        job_type: "full-time",
        deadline: ""
    });

    useEffect(() => {
        if (initialData) {
            setFormData({
                title: initialData.title || "",
                description: initialData.description || "",
                location: initialData.location || "",
                salary: initialData.salary || "",
                job_type: initialData.job_type || "full-time",
                deadline: initialData.deadline ? new Date(initialData.deadline).toISOString().split('T')[0] : ""
            });
        }
    }, [initialData]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (jobId) {
                await api.put(`/jobs/${jobId}`, formData);
                toast.success("Job updated successfully!");
            } else {
                await api.post("/jobs", formData);
                toast.success("Job posted successfully!");
            }
            navigate("/employer-dashboard");
        } catch (err) {
            console.error("Error saving job:", err);
            toast.error(err.response?.data?.message || "Failed to save job.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container">
            <div className="job-form-container">
                <h1>{jobId ? "Edit Job" : "Post a New Job"}</h1>
                <p className="subtitle">Find the right talent for your company</p>
                
                <form onSubmit={handleSubmit} className="job-form">
                    <div className="form-group">
                        <label htmlFor="title">Job Title *</label>
                        <input
                            type="text"
                            id="title"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            required
                            placeholder="e.g., Senior Software Engineer"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="description">Job Description *</label>
                        <textarea
                            id="description"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            required
                            rows="6"
                            placeholder="Describe the role, responsibilities, and requirements..."
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="location">Location *</label>
                        <input
                            type="text"
                            id="location"
                            name="location"
                            value={formData.location}
                            onChange={handleChange}
                            required
                            placeholder="e.g., Addis Ababa, Ethiopia or Remote"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="salary">Salary (Optional)</label>
                        <input
                            type="text"
                            id="salary"
                            name="salary"
                            value={formData.salary}
                            onChange={handleChange}
                            placeholder="e.g., 50,000 - 80,000 ETB per month"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="job_type">Job Type *</label>
                        <select
                            id="job_type"
                            name="job_type"
                            value={formData.job_type}
                            onChange={handleChange}
                            required
                        >
                            <option value="full-time">Full Time</option>
                            <option value="part-time">Part Time</option>
                            <option value="contract">Contract</option>
                            <option value="internship">Internship</option>
                            <option value="remote">Remote</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label htmlFor="deadline">Application Deadline *</label>
                        <input
                            type="date"
                            id="deadline"
                            name="deadline"
                            value={formData.deadline}
                            onChange={handleChange}
                            required
                            min={new Date().toISOString().split('T')[0]}
                        />
                    </div>

                    <div className="form-actions">
                        <button
                            type="button"
                            className="btn btn-secondary"
                            onClick={() => navigate("/employer-dashboard")}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="btn btn-primary"
                            disabled={loading}
                        >
                            {loading ? "Saving..." : jobId ? "Update Job" : "Post Job"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default JobForm;