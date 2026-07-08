const db = require("../config/db");

exports.apply = async (req, res) => {
    try {
        const jobId = req.params.jobId;
        const userId = req.user.id;

        console.log("=== APPLY TO JOB ===");
        console.log("Job ID:", jobId);
        console.log("User ID:", userId);

        const [existing] = await db.query(
            "SELECT * FROM applications WHERE job_id = ? AND user_id = ?",
            [jobId, userId]
        );

        if (existing.length > 0) {
            return res.status(400).json({
                message: "You have already applied for this job."
            });
        }

        const [jobs] = await db.query(
            "SELECT * FROM jobs WHERE id = ?",
            [jobId]
        );

        if (jobs.length === 0) {
            return res.status(404).json({
                message: "Job not found."
            });
        }

        const [result] = await db.query(
            `INSERT INTO applications 
             (job_id, user_id, status, applied_at) 
             VALUES (?, ?, 'pending', NOW())`,
            [jobId, userId]
        );

        res.status(201).json({
            message: "Application submitted successfully.",
            applicationId: result.insertId
        });

    } catch (error) {
        console.error("Error applying to job:", error);
        res.status(500).json({
            message: "Failed to apply for job.",
            error: error.message
        });
    }
};

exports.myApplications = async (req, res) => {
    try {
        const userId = req.user.id;

        console.log("=== GET MY APPLICATIONS ===");
        console.log("User ID:", userId);

        const [applications] = await db.query(
            `SELECT a.*, 
                    j.title as job_title,
                    j.location as job_location,
                    c.company_name
             FROM applications a
             JOIN jobs j ON a.job_id = j.id
             JOIN companies c ON j.company_id = c.id
             WHERE a.user_id = ?
             ORDER BY a.applied_at DESC`,
            [userId]
        );

        console.log("Applications found:", applications.length);
        res.json(applications);

    } catch (error) {
        console.error("Error fetching applications:", error);
        res.status(500).json({
            message: "Failed to fetch applications.",
            error: error.message
        });
    }
};

exports.getApplicants = async (req, res) => {
    try {
        console.log("=== GET APPLICANTS ===");
        console.log("User ID:", req.user.id);

        // First get the employer's company
        const [companies] = await db.query(
            "SELECT id FROM companies WHERE owner_id = ?",
            [req.user.id]
        );

        console.log("Companies found:", companies);

        if (companies.length === 0) {
            return res.status(404).json({
                message: "Company not found"
            });
        }

        const companyId = companies[0].id;
        console.log("Company ID:", companyId);

        // Get all applicants for jobs in this company
        const [applicants] = await db.query(
            `SELECT 
                a.id,
                a.status,
                a.applied_at,
                a.file_path,
                u.id as user_id,
                u.name as full_name,
                u.email,
                u.phone,
                j.id as job_id,
                j.title
             FROM applications a
             JOIN users u ON a.user_id = u.id
             JOIN jobs j ON a.job_id = j.id
             WHERE j.company_id = ?
             ORDER BY a.applied_at DESC`,
            [companyId]
        );

        console.log("Applicants found:", applicants.length);
        console.log("Applicants data:", JSON.stringify(applicants, null, 2));

        res.json(applicants);

    } catch (error) {
        console.error("ERROR fetching applicants:", error);
        res.status(500).json({
            message: "Failed to fetch applicants",
            error: error.message,
            stack: error.stack
        });
    }
};

exports.updateStatus = async (req, res) => {
    try {
        const applicationId = req.params.id;
        const { status } = req.body;

        console.log("=== UPDATE APPLICATION STATUS ===");
        console.log("Application ID:", applicationId);
        console.log("New Status:", status);

        const [applications] = await db.query(
            `SELECT a.*, j.company_id 
             FROM applications a
             JOIN jobs j ON a.job_id = j.id
             JOIN companies c ON j.company_id = c.id
             WHERE a.id = ? AND c.owner_id = ?`,
            [applicationId, req.user.id]
        );

        if (applications.length === 0) {
            return res.status(404).json({
                message: "Application not found or you don't have permission."
            });
        }

        await db.query(
            "UPDATE applications SET status = ? WHERE id = ?",
            [status, applicationId]
        );

        res.json({
            message: "Application status updated successfully."
        });

    } catch (error) {
        console.error("Error updating status:", error);
        res.status(500).json({
            message: "Failed to update status.",
            error: error.message
        });
    }
};