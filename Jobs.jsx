import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import api from "../services/api";
import toast from "react-hot-toast";

function Jobs() {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchParams] = useSearchParams();
    const searchQuery = searchParams.get('search') || '';

    useEffect(() => {
        loadJobs();
    }, [searchQuery]);

    async function loadJobs() {
        try {
            let res;
            if (searchQuery) {
                res = await api.get(`/jobs/search?keyword=${encodeURIComponent(searchQuery)}`);
            } else {
                res = await api.get("/jobs");
            }
            setJobs(res.data || []);
        } catch (err) {
            console.error("Error loading jobs:", err);
            toast.error("Failed to load jobs.");
        } finally {
            setLoading(false);
        }
    }

    if (loading) {
        return (
            <div className="container">
                <div className="loading-spinner">
                    <h2>Loading jobs...</h2>
                </div>
            </div>
        );
    }

    return (
        <section className="section">
            <div className="container">
                <div className="section-header">
                    <h1>{searchQuery ? `Results for "${searchQuery}"` : "Browse Jobs"}</h1>
                    <p className="job-count">{jobs.length} jobs found</p>
                </div>

                {jobs.length === 0 ? (
                    <div className="empty-state">
                        <h3>No jobs found</h3>
                        <p>Try adjusting your search or browse all jobs.</p>
                        <Link to="/jobs" className="btn">
                            View All Jobs
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
                                <p className="company-name">{job.company_name || "Company"}</p>
                                <p className="job-location">📍 {job.location}</p>
                                {job.salary && (
                                    <p className="job-salary">💰 {job.salary}</p>
                                )}
                                <p className="job-description">
                                    {job.description?.substring(0, 120)}
                                    {job.description?.length > 120 ? "..." : ""}
                                </p>
                                <p className="job-deadline">
                                    Deadline: {new Date(job.deadline).toLocaleDateString()}
                                </p>
                                <Link to={`/jobs/${job.id}`} className="btn">
                                    View Details
                                </Link>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}

export default Jobs;