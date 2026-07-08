import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import toast from "react-hot-toast";

function CreateCompany() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        company_name: "",
        description: "",
        location: "",
        website: ""
    });

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
            await api.post("/companies", formData);
            toast.success("Company created successfully!");
            navigate("/employer-dashboard");
        } catch (err) {
            console.error("Error creating company:", err);
            toast.error(err.response?.data?.message || "Failed to create company.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container">
            <div className="company-form-container">
                <h1>Create Your Company</h1>
                <p className="subtitle">Set up your company profile to start posting jobs</p>

                <form onSubmit={handleSubmit} className="company-form">
                    <div className="form-group">
                        <label htmlFor="company_name">Company Name *</label>
                        <input
                            type="text"
                            id="company_name"
                            name="company_name"
                            value={formData.company_name}
                            onChange={handleChange}
                            required
                            placeholder="e.g., Tech Solutions Inc"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="description">Company Description *</label>
                        <textarea
                            id="description"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            required
                            rows="5"
                            placeholder="Describe your company, mission, and culture..."
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
                            placeholder="e.g., New York, NY"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="website">Website (Optional)</label>
                        <input
                            type="url"
                            id="website"
                            name="website"
                            value={formData.website}
                            onChange={handleChange}
                            placeholder="https://yourcompany.com"
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
                            className="btn"
                            disabled={loading}
                        >
                            {loading ? "Creating..." : "Create Company"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default CreateCompany;