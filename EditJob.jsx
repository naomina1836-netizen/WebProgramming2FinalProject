import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import JobForm from "../components/JobForm";
import api from "../services/api";
import toast from "react-hot-toast";

function EditJob() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [job, setJob] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadJob();
    }, [id]);

    async function loadJob() {
        try {
            const res = await api.get(`/jobs/${id}`);
            setJob(res.data);
        } catch (err) {
            console.error("Error loading job:", err);
            toast.error("Failed to load job.");
            navigate("/employer-dashboard");
        } finally {
            setLoading(false);
        }
    }

    if (loading) {
        return (
            <div className="container">
                <h2>Loading...</h2>
            </div>
        );
    }

    return <JobForm jobId={id} initialData={job} />;
}

export default EditJob;