require("dotenv").config();

const express = require("express");
const cors = require("cors");
const path = require("path");

const db = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const companyRoutes = require("./routes/companyRoutes");
const jobRoutes = require("./routes/jobRoutes");
const userRoutes = require("./routes/userRoutes");
const applicationRoutes = require("./routes/applicationRoutes");
const adminRoutes = require("./routes/adminRoutes");
const profileRoutes = require("./routes/profileRoutes");
const resumeRoutes = require("./routes/resumeRoutes"); // ✅ ADDED

const app = express();

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/api/auth", authRoutes);
app.use("/api/companies", companyRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/users", userRoutes);
app.use("/api/users", profileRoutes);
app.use("/api/resumes", resumeRoutes); // ✅ ADDED
app.use("/api/applications", applicationRoutes);
app.use("/api/admin", adminRoutes);

app.get("/", (req, res) => {
    res.json({ message: "Welcome to Nayo Jobs API" });
});

app.get("/api/test", (req, res) => {
    res.json({
        message: "Backend is running!",
        timestamp: new Date().toISOString()
    });
});

app.get("/test-db", async (req, res) => {
    try {
        const [rows] = await db.query("SELECT NOW() AS currentTime");
        res.json({ success: true, time: rows[0].currentTime });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.use((err, req, res, next) => {
    console.error("Error:", err);
    res.status(500).json({
        message: "Something went wrong!",
        error: err.message
    });
});

module.exports = app;