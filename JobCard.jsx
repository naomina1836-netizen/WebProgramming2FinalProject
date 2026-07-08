import { Link } from "react-router-dom";

function JobCard({ job }) {
    return (
        <div className="job-card">
            <div className="job-card-header">
                <h3>{job.title}</h3>
                <span className="job-type-badge">{job.job_type}</span>
            </div>
            <p className="company-name">{job.company_name || "Company"}</p>
            <p className="job-location">📍 {job.location}</p>
            {job.salary && (
                <p className="job-salary">💰 {job.salary}</p>
            )}
            <p className="job-deadline">
                Deadline: {new Date(job.deadline).toLocaleDateString()}
            </p>
            <Link to={`/jobs/${job.id}`} className="btn">
                View Details
            </Link>
        </div>
    );
}

export default JobCard;