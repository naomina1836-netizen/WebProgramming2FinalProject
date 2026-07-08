const db = require("../config/db");

exports.create = async (req, res) => {
    try {
        console.log("=== CREATE JOB ===");
        console.log("User ID:", req.user.id);
        console.log("Request body:", req.body);

        const { title, description, location, salary, job_type, deadline } = req.body;

        if (!title || !description || !location || !job_type || !deadline) {
            return res.status(400).json({
                message: "Please provide title, description, location, job_type, and deadline."
            });
        }

        // Get the employer's company
        const [companies] = await db.query(
            "SELECT id FROM companies WHERE owner_id = ?",
            [req.user.id]
        );

        console.log("Companies found:", companies);

        if (companies.length === 0) {
            return res.status(404).json({
                message: "Create a company first."
            });
        }

        const companyId = companies[0].id;

        const [result] = await db.query(
            `INSERT INTO jobs 
             (company_id, title, description, location, salary, job_type, deadline) 
             VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [companyId, title, description, location, salary || null, job_type, deadline]
        );

        console.log("Job created with ID:", result.insertId);

        res.status(201).json({
            message: "Job posted successfully.",
            jobId: result.insertId
        });

    } catch (error) {
        console.error("Error creating job:", error);
        res.status(500).json({
            message: "Failed to create job.",
            error: error.message
        });
    }
};

exports.getMine = async (req, res) => {
    try {
        console.log("=== GET MY JOBS ===");
        console.log("User ID:", req.user.id);

        // Get the employer's company
        const [companies] = await db.query(
            "SELECT id FROM companies WHERE owner_id = ?",
            [req.user.id]
        );

        console.log("Companies found:", companies);

        if (companies.length === 0) {
            return res.status(404).json({
                message: "Company not found."
            });
        }

        const companyId = companies[0].id;
        console.log("Company ID:", companyId);

        // Get jobs for this company
        const [jobs] = await db.query(
            `SELECT j.*, 
                    c.company_name,
                    c.location as company_location
             FROM jobs j
             LEFT JOIN companies c ON j.company_id = c.id
             WHERE j.company_id = ?
             ORDER BY j.created_at DESC`,
            [companyId]
        );

        console.log("Jobs found:", jobs.length);
        console.log("Jobs data:", JSON.stringify(jobs, null, 2));

        res.json(jobs);

    } catch (error) {
        console.error("Error fetching jobs:", error);
        res.status(500).json({
            message: "Failed to fetch jobs.",
            error: error.message
        });
    }
};

exports.update = async (req, res) => {
    try {
        console.log("=== UPDATE JOB ===");
        console.log("Job ID:", req.params.id);
        console.log("Request body:", req.body);

        const { title, description, location, salary, job_type, deadline } = req.body;
        const jobId = req.params.id;

        const [companies] = await db.query(
            "SELECT id FROM companies WHERE owner_id = ?",
            [req.user.id]
        );

        if (companies.length === 0) {
            return res.status(404).json({
                message: "Company not found."
            });
        }

        const companyId = companies[0].id;

        const [jobs] = await db.query(
            "SELECT * FROM jobs WHERE id = ? AND company_id = ?",
            [jobId, companyId]
        );

        if (jobs.length === 0) {
            return res.status(404).json({
                message: "Job not found or you don't have permission."
            });
        }

        await db.query(
            `UPDATE jobs 
             SET title = ?, 
                 description = ?, 
                 location = ?, 
                 salary = ?,
                 job_type = ?, 
                 deadline = ?
             WHERE id = ? AND company_id = ?`,
            [title, description, location, salary || null, job_type, deadline, jobId, companyId]
        );

        res.json({
            message: "Job updated successfully."
        });

    } catch (error) {
        console.error("Error updating job:", error);
        res.status(500).json({
            message: "Failed to update job.",
            error: error.message
        });
    }
};

exports.remove = async (req, res) => {
    try {
        console.log("=== DELETE JOB ===");
        console.log("Job ID:", req.params.id);

        const jobId = req.params.id;

        const [companies] = await db.query(
            "SELECT id FROM companies WHERE owner_id = ?",
            [req.user.id]
        );

        if (companies.length === 0) {
            return res.status(404).json({
                message: "Company not found."
            });
        }

        const companyId = companies[0].id;

        const [jobs] = await db.query(
            "SELECT * FROM jobs WHERE id = ? AND company_id = ?",
            [jobId, companyId]
        );

        if (jobs.length === 0) {
            return res.status(404).json({
                message: "Job not found or you don't have permission."
            });
        }

        await db.query(
            "DELETE FROM jobs WHERE id = ? AND company_id = ?",
            [jobId, companyId]
        );

        res.json({
            message: "Job deleted successfully."
        });

    } catch (error) {
        console.error("Error deleting job:", error);
        res.status(500).json({
            message: "Failed to delete job.",
            error: error.message
        });
    }
};

exports.getAll = async (req, res) => {
    try {
        console.log("=== GET ALL JOBS ===");
        
        const [jobs] = await db.query(
            `SELECT j.*, 
                    c.company_name,
                    c.location as company_location
             FROM jobs j
             LEFT JOIN companies c ON j.company_id = c.id
             WHERE j.deadline >= CURDATE()
             ORDER BY j.created_at DESC`
        );

        console.log("All jobs found:", jobs.length);
        res.json(jobs);

    } catch (error) {
        console.error("Error fetching all jobs:", error);
        res.status(500).json({
            message: "Failed to fetch jobs.",
            error: error.message
        });
    }
};

exports.search = async (req, res) => {
    try {
        const keyword = req.query.keyword || "";

        const [jobs] = await db.query(
            `SELECT j.*, 
                    c.company_name,
                    c.location as company_location
             FROM jobs j
             LEFT JOIN companies c ON j.company_id = c.id
             WHERE (j.title LIKE ? 
                OR j.description LIKE ? 
                OR j.location LIKE ?)
                AND j.deadline >= CURDATE()
             ORDER BY j.created_at DESC`,
            [`%${keyword}%`, `%${keyword}%`, `%${keyword}%`]
        );

        res.json(jobs);

    } catch (error) {
        console.error("Error searching jobs:", error);
        res.status(500).json({
            message: "Failed to search jobs.",
            error: error.message
        });
    }
};

exports.getOne = async (req, res) => {
    try {
        console.log("=== GET JOB BY ID ===");
        console.log("Job ID:", req.params.id);

        const [jobs] = await db.query(
            `SELECT j.*, 
                    c.company_name,
                    c.location as company_location
             FROM jobs j
             LEFT JOIN companies c ON j.company_id = c.id
             WHERE j.id = ?`,
            [req.params.id]
        );

        if (jobs.length === 0) {
            return res.status(404).json({
                message: "Job not found."
            });
        }

        res.json(jobs[0]);

    } catch (error) {
        console.error("Error fetching job:", error);
        res.status(500).json({
            message: "Failed to fetch job.",
            error: error.message
        });
    }
};