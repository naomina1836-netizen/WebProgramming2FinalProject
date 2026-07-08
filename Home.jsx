import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

function Home() {
    const { user } = useAuth();
    const [recentJobs, setRecentJobs] = useState([]);
    const [stats, setStats] = useState({
        jobs: 0,
        companies: 0
    });

    useEffect(() => {
        loadHomeData();
    }, []);

    async function loadHomeData() {
        try {
            const [jobsRes, companiesRes] = await Promise.all([
                api.get("/jobs"),
                api.get("/companies")
            ]);
            
            setRecentJobs(jobsRes.data?.slice(0, 6) || []);
            setStats({
                jobs: jobsRes.data?.length || 0,
                companies: companiesRes.data?.length || 0
            });
        } catch (err) {
            console.error("Error loading home data:", err);
        }
    }

    // For employers - show hiring message
    if (user?.role === "employer") {
        return (
            <>
                {/* Hero Section - Employer Version */}
                <section className="hero">
                    <div className="container">
                        <div className="hero-content">
                            <h1>Hire the <span className="gold">Best Talent</span> in Ethiopia</h1>
                            <p>Post jobs, manage applications, and find the perfect candidates for your company.</p>
                            <div className="hero-search">
                                <Link to="/employer-dashboard" className="btn">
                                    Go to Dashboard
                                </Link>
                                <Link to="/jobs/create" className="btn btn-outline">
                                    Post a Job
                                </Link>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Stats Section */}
                <div className="container">
                    <div className="stats">
                        <div className="stat">
                            <h2>{stats.jobs}</h2>
                            <p>Jobs Available</p>
                        </div>
                        <div className="stat">
                            <h2>{stats.companies}</h2>
                            <p>Companies Hiring</p>
                        </div>
                        <div className="stat">
                            <h2>100+</h2>
                            <p>Candidates Matched</p>
                        </div>
                    </div>
                </div>

                {/* Employer Features */}
                <section className="why-us">
                    <div className="container">
                        <h2>Why Hire with <span className="gold">Nayo Jobs</span></h2>
                        <div className="features-grid">
                            <div className="feature-card">
                                <h3>Post Jobs Free</h3>
                                <p>Reach thousands of qualified candidates at no cost</p>
                            </div>
                            <div className="feature-card">
                                <h3>Smart Screening</h3>
                                <p>Filter and review applicants efficiently</p>
                            </div>
                            <div className="feature-card">
                                <h3>Quick Hiring</h3>
                                <p>Find the right talent faster</p>
                            </div>
                            <div className="feature-card">
                                <h3>Manage All in One</h3>
                                <p>Dashboard to manage all your job postings</p>
                            </div>
                        </div>
                    </div>
                </section>
            </>
        );
    }

    // For job seekers and visitors - show job seeking message
    return (
        <>
            {/* Hero Section - Job Seeker Version */}
            <section className="hero">
                <div className="container">
                    <div className="hero-content">
                        <h1>Find Your <span className="gold">Dream Job</span> Today</h1>
                        <p>Connect with top employers in Ethiopia and across Africa. 
                        Nayo Jobs helps you find the perfect career opportunity.</p>
                        <div className="hero-search">
                            <Link to="/jobs" className="btn">
                                Browse Jobs
                            </Link>
                            {!user && (
                                <Link to="/register" className="btn btn-outline">
                                    Get Started
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <div className="container">
                <div className="stats">
                    <div className="stat">
                        <h2>{stats.jobs}</h2>
                        <p>Jobs Available</p>
                    </div>
                    <div className="stat">
                        <h2>{stats.companies}</h2>
                        <p>Companies Hiring</p>
                    </div>
                    <div className="stat">
                        <h2>500+</h2>
                        <p>Job Seekers Placed</p>
                    </div>
                </div>
            </div>

            {/* Recent Jobs */}
            <section className="section">
                <div className="container">
                    <div className="section-header">
                        <h2>Recent Jobs</h2>
                        <Link to="/jobs" className="gold-link">View All →</Link>
                    </div>
                    
                    {recentJobs.length === 0 ? (
                        <div className="empty-state">
                            <h3>No jobs posted yet</h3>
                            <p>Check back later for new opportunities.</p>
                        </div>
                    ) : (
                        <div className="jobs-grid">
                            {recentJobs.map(job => (
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
                                    <Link to={`/jobs/${job.id}`} className="btn btn-small">
                                        View Details
                                    </Link>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* Why Us Section */}
            <section className="why-us">
                <div className="container">
                    <h2>Why Choose <span className="gold">Nayo Jobs</span></h2>
                    <div className="features-grid">
                        <div className="feature-card">
                            <h3>Easy Application</h3>
                            <p>Apply to multiple jobs with just one click</p>
                        </div>
                        <div className="feature-card">
                            <h3>Smart Matching</h3>
                            <p>Find jobs that match your skills perfectly</p>
                        </div>
                        <div className="feature-card">
                            <h3>Real-time Updates</h3>
                            <p>Get notified about new opportunities</p>
                        </div>
                        <div className="feature-card">
                            <h3>Career Growth</h3>
                            <p>Build your career with top companies</p>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}

export default Home;