import { useEffect, useState } from "react";
import api from "../services/api";
import toast from "react-hot-toast";

function Applicants() {
    const [applicants, setApplicants] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadApplicants();
    }, []);

    async function loadApplicants() {
        setLoading(true);
        try {
            const res = await api.get("/applications/applicants");
            setApplicants(res.data);
        } catch (err) {
            console.error("Error loading applicants:", err);
            toast.error("Failed to load applicants.");
        } finally {
            setLoading(false);
        }
    }

    async function updateStatus(id, status) {
        try {
            await api.patch(`/applications/${id}/status`, { status });
            toast.success("Status updated.");
            loadApplicants();
        } catch (err) {
            console.error("Error updating status:", err);
            toast.error("Update failed.");
        }
    }

    if (loading) {
        return (
            <div className="container">
                <h2>Loading applicants...</h2>
            </div>
        );
    }

    return (
        <section className="dashboard-page">
            <div className="container">
                <h1>Applicants</h1>
                
                {applicants.length === 0 ? (
                    <div className="empty-state">
                        <h3>No applicants yet</h3>
                        <p>When job seekers apply to your jobs, they'll appear here.</p>
                    </div>
                ) : (
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Phone</th>
                                <th>Job</th>
                                <th>Status</th>
                                <th>Resume</th>
                            </tr>
                        </thead>
                        <tbody>
                            {applicants.map(app => (
                                <tr key={app.id}>
                                    <td>{app.full_name}</td>
                                    <td>{app.email}</td>
                                    <td>{app.phone || "N/A"}</td>
                                    <td>{app.title}</td>
                                    <td>
                                        <select
                                            value={app.status}
                                            onChange={(e) =>
                                                updateStatus(app.id, e.target.value)
                                            }
                                        >
                                            <option value="pending">Pending</option>
                                            <option value="reviewed">Reviewed</option>
                                            <option value="accepted">Accepted</option>
                                            <option value="rejected">Rejected</option>
                                        </select>
                                    </td>
                                    <td>
                                        {app.file_path ? (
                                            <a
                                                href={`http://localhost:5000/uploads/resumes/${app.file_path}`}
                                                target="_blank"
                                                rel="noreferrer"
                                            >
                                                View Resume
                                            </a>
                                        ) : (
                                            "No Resume"
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </section>
    );
}

export default Applicants;