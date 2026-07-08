import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../services/api";
import toast from "react-hot-toast";

function JobDetails() {

    const { id } = useParams();

    const [job, setJob] = useState(null);

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadJob();
    }, []);

    async function loadJob() {

        try {

            const res = await api.get(`/jobs/${id}`);
            setJob(res.data);

        }

        catch {

            toast.error("Failed to load job.");

        }

        finally {

            setLoading(false);

        }

    }

    async function apply() {

        try {

            await api.post(`/applications/${job.id}`);

            toast.success("Application submitted.");

        }

        catch (err) {

            toast.error(

                err.response?.data?.message ||

                "Application failed."

            );

        }

    }

    if (loading) {

        return (
            <div className="container">
                Loading...
            </div>
        );

    }

    if (!job) {

        return (
            <div className="container">
                Job not found.
            </div>
        );

    }

    return (

        <section className="job-details">

            <div className="container">

                <div className="job-card">

                    <h1>{job.title}</h1>

                    <p>

                        <strong>Company:</strong>

                        {" "}

                        {job.company_name}

                    </p>

                    <p>

                        <strong>Location:</strong>

                        {" "}

                        {job.location}

                    </p>

                    <p>

                        <strong>Salary:</strong>

                        {" "}

                        {job.salary || "Not specified"}

                    </p>

                    <p>

                        <strong>Job Type:</strong>

                        {" "}

                        {job.job_type}

                    </p>

                    <p>

                        <strong>Deadline:</strong>

                        {" "}

                        {job.deadline}

                    </p>

                    <hr />

                    <p>

                        {job.description}

                    </p>

                    <button

                        className="btn"

                        onClick={apply}

                    >

                        Apply Now

                    </button>

                </div>

            </div>

        </section>

    );

}

export default JobDetails;