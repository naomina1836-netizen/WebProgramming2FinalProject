const db = require("../config/db");
const fs = require("fs");
const path = require("path");

exports.uploadResume = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: "No file uploaded" });
        }

        const resumePath = req.file.filename;
        const userId = req.user.id;

        // Check if user exists
        const [users] = await db.query(
            "SELECT id FROM users WHERE id = ?",
            [userId]
        );

        if (users.length === 0) {
            return res.status(404).json({ error: "User not found" });
        }

        // Update user's resume path
        await db.query(
            "UPDATE users SET resume_url = ? WHERE id = ?",
            [resumePath, userId]
        );

        res.json({
            message: "Resume uploaded successfully",
            resume_url: resumePath
        });

    } catch (error) {
        console.error("Error uploading resume:", error);
        res.status(500).json({
            error: "Failed to upload resume",
            details: error.message
        });
    }
};

exports.getResume = async (req, res) => {
    try {
        const filename = req.params.filename;
        const filepath = path.join(__dirname, "../uploads/resumes", filename);
        
        if (!fs.existsSync(filepath)) {
            return res.status(404).json({ error: "Resume not found" });
        }

        res.sendFile(filepath);
    } catch (error) {
        console.error("Error serving resume:", error);
        res.status(500).json({
            error: "Failed to serve resume",
            details: error.message
        });
    }
};

exports.deleteResume = async (req, res) => {
    try {
        const userId = req.user.id;

        const [users] = await db.query(
            "SELECT resume_url FROM users WHERE id = ?",
            [userId]
        );

        if (users.length === 0) {
            return res.status(404).json({ error: "User not found" });
        }

        const resumePath = users[0].resume_url;

        if (!resumePath) {
            return res.status(404).json({ error: "No resume found" });
        }

        const filepath = path.join(__dirname, "../uploads/resumes", resumePath);
        if (fs.existsSync(filepath)) {
            fs.unlinkSync(filepath);
        }

        await db.query(
            "UPDATE users SET resume_url = NULL WHERE id = ?",
            [userId]
        );

        res.json({ message: "Resume deleted successfully" });

    } catch (error) {
        console.error("Error deleting resume:", error);
        res.status(500).json({
            error: "Failed to delete resume",
            details: error.message
        });
    }
};