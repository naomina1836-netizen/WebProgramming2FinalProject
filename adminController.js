const {
    getStatistics,
    getUsers,
    getCompanies,
    getJobs,
    deleteUser,
    deleteJob
} = require("../models/adminModel");

exports.dashboard = async (req, res) => {
    try {
        const stats = await getStatistics();
        res.json(stats);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to load dashboard." });
    }
};

exports.users = async (req, res) => {
    try {
        const users = await getUsers();
        res.json(users);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to load users." });
    }
};

exports.companies = async (req, res) => {
    try {
        const companies = await getCompanies();
        res.json(companies);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to load companies." });
    }
};

exports.jobs = async (req, res) => {
    try {
        const jobs = await getJobs();
        res.json(jobs);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to load jobs." });
    }
};

exports.deleteUser = async (req, res) => {
    try {
        await deleteUser(req.params.id);
        res.json({ message: "User deleted successfully." });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to delete user." });
    }
};

exports.deleteJob = async (req, res) => {
    try {
        await deleteJob(req.params.id);
        res.json({ message: "Job deleted successfully." });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to delete job." });
    }
};