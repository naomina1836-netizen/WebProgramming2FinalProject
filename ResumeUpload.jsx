import { useState } from "react";
import api from "../services/api";
import toast from "react-hot-toast";

function ResumeUpload({ onUploadSuccess, currentResume }) {
    const [uploading, setUploading] = useState(false);
    const [file, setFile] = useState(null);

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (!selectedFile) return;

        // Validate file type
        const allowedTypes = [".pdf", ".doc", ".docx"];
        const ext = selectedFile.name.substring(selectedFile.name.lastIndexOf(".")).toLowerCase();
        if (!allowedTypes.includes(ext)) {
            toast.error("Please upload a PDF, DOC, or DOCX file");
            e.target.value = "";
            return;
        }

        // Validate file size (5MB)
        if (selectedFile.size > 5 * 1024 * 1024) {
            toast.error("File size must be less than 5MB");
            e.target.value = "";
            return;
        }

        setFile(selectedFile);
    };

    const handleUpload = async () => {
        if (!file) {
            toast.error("Please select a file first");
            return;
        }

        const formData = new FormData();
        formData.append("resume", file);

        setUploading(true);
        try {
            const res = await api.post("/upload/resume", formData, {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            });
            
            toast.success("Resume uploaded successfully!");
            if (onUploadSuccess) {
                onUploadSuccess(res.data.resume_url);
            }
            setFile(null);
            // Reset file input
            document.getElementById("resume-input").value = "";
        } catch (err) {
            console.error("Upload error:", err);
            toast.error(err.response?.data?.error || "Failed to upload resume");
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="resume-upload-container">
            {currentResume && (
                <div className="current-resume">
                    <p>Current Resume: {currentResume}</p>
                    <a
                        href={`http://localhost:5000/uploads/resumes/${currentResume}`}
                        target="_blank"
                        rel="noreferrer"
                        className="btn btn-secondary"
                    >
                        View Resume
                    </a>
                </div>
            )}

            <div className="upload-section">
                <input
                    type="file"
                    id="resume-input"
                    accept=".pdf,.doc,.docx"
                    onChange={handleFileChange}
                    disabled={uploading}
                />
                <button
                    className="btn"
                    onClick={handleUpload}
                    disabled={!file || uploading}
                >
                    {uploading ? "Uploading..." : "Upload Resume"}
                </button>
            </div>

            {file && (
                <p className="file-name">Selected: {file.name}</p>
            )}
        </div>
    );
}

export default ResumeUpload;