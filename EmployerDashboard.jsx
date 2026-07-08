import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import toast from "react-hot-toast";

function EmployerDashboard() {
    const [company, setCompany] = useState(null);
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        totalJobs: 0,
        totalApplicants: 0,
        pendingApplications: 0
    });

    useEffect(() => {
        loadData();
    }, []);

    async function loadData() {
        setLoading(true);
        console.log("Loading employer dashboard data...");

        try {
            // Load company
            try {
                console.log("Fetching company...");
                const companyRes = await api.get("/companies/my");
                console.log("Company response:", companyRes.data);
                setCompany(companyRes.data);
            } catch (err) {
                console.log("Company error:", err.response?.status);
                if (err.response?.status === 404) {
                    setCompany(null);
                } else {
                    throw err;
                }
            }

            // Load jobs
            try {
                console.log("Fetching jobs...");
                const jobsRes = await api.get("/jobs/mine");
                console.log("Jobs response:", jobsRes.data);
                const jobsData = Array.isArray(jobsRes.data) ? jobsRes.data : [];
                setJobs(jobsData);
                
                // Update stats
                setStats(prev => ({
                    ...prev,
                    totalJobs: jobsData.length
                }));
            } catch (err) {
                console.log("Jobs error:", err.response?.status);
                if (err.response?.status === 404) {
                    setJobs([]);
                } else {
                    throw err;
                }
            }

            // Load applicants count
            try {
                const applicantsRes = await api.get("/applications/applicants");
                const applicants = applicantsRes.data || [];
                const pending = applicants.filter(a => a.status === 'pending').length;
                setStats(prev => ({
                    ...prev,
                    totalApplicants: applicants.length,
                    pendingApplications: pending
                }));
            } catch (err) {
                console.log("Applicants error:", err.response?.status);
                // Don't throw, just continue
            }

        } catch (err) {
            console.error("Dashboard load error:", err);
            toast.error("Failed to load dashboard.");
        } finally {
            setLoading(false);
        }
    }

    async function deleteJob(id) {
        if (!window.confirm("Delete this job?")) return;

        try {
            await api.delete(`/jobs/${id}`);
            setJobs(jobs.filter(job => job.id !== id));
            toast.success("Job deleted.");
        } catch (err) {
            console.error("Delete error:", err);
            toast.error("Failed to delete job.");
        }
    }

    if (loading) {
        return (
            <div className="container">
                <div className="loading-spinner">
                    <h2>Loading...</h2>
                </div>
            </div>
        );
    }

    return (
        <section className="dashboard-page">
            <div className="container">
                <div className="dashboard-header">
                    <div>
                        <h1>Employer Dashboard</h1>
                        <p>Manage your company and job postings.</p>
                    </div>
                    <div className="dashboard-actions">
                        {company && (
                            <Link to="/jobs/create" className="btn">
                                + Post Job
                            </Link>
                        )}
                        <Link to="/applicants" className="btn btn-secondary">
                            View Applicants
                        </Link>
                    </div>
                </div>

                {/* Stats */}
                <div className="stats-grid">
                    <div className="stat-card">
                        <h2>{stats.totalJobs}</h2>
                        <p>Total Jobs Posted</p>
                    </div>
                    <div className="stat-card">
                        <h2>{stats.totalApplicants}</h2>
                        <p>Total Applicants</p>
                    </div>
                    <div className="stat-card">
                        <h2>{stats.pendingApplications}</h2>
                        <p>Pending Applications</p>
                    </div>
                </div>

                {!company ? (
                    <div className="empty-state">
                        <h2>No Company Found</h2>
                        <p>Create your company before posting jobs.</p>
                        <Link to="/company/create" className="btn">
                            Create Company
                        </Link>
                    </div>
                ) : (
                    <>
                        <div className="company-card">
                            <h2>{company.company_name}</h2>
                            <p>{company.description}</p>
                            <p>📍 {company.location}</p>
                            {company.website && (
                                <a href={company.website} target="_blank" rel="noreferrer">
                                    {company.website}
                                </a>
                            )}
                        </div>

                        <h2 className="section-title">Your Jobs ({jobs.length})</h2>

                        {jobs.length === 0 ? (
                            <div className="empty-state">
                                <h3>No Jobs Posted</h3>
                                <p>Start hiring today by posting your first job.</p>
                                <Link to="/jobs/create" className="btn">
                                    Post a Job
                                </Link>
                            </div>
                        ) : (
                            <div className="jobs-grid">
                                {jobs.map(job => (
                                    <div key={job.id} className="job-card">
                                        <div className="job-card-header">
                                            <h3>{job.title}</h3>
                                            <span className="job-type-badge">{job.job_type}</span>
                                        </div>
                                        <p className="job-location">📍 {job.location}</p>
                                        <p className="job-salary">💰 {job.salary || "Salary not specified"}</p>
                                        <p className="job-deadline">
                                            Deadline: {new Date(job.deadline).toLocaleDateString()}
                                        </p>
                                        <div className="card-actions">
                                            <Link
                                                className="btn btn-small"
                                                to={`/jobs/edit/${job.id}`}
                                            >
                                                Edit
                                            </Link>
                                            <button
                                                className="btn btn-small btn-danger"
                                                onClick={() => deleteJob(job.id)}
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </>
                )}
            </div>
        </section>
    );
}

export default EmployerDashboard;