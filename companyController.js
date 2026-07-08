const db = require("../config/db");

exports.getMyCompany = async (req, res) => {
    try {
        console.log("Getting company for user:", req.user.id);

        const [companies] = await db.query(
            "SELECT * FROM companies WHERE owner_id = ?",
            [req.user.id]
        );

        console.log("Companies found:", companies);

        if (companies.length === 0) {
            return res.status(404).json({
                message: "Company not found"
            });
        }

        res.json(companies[0]);
    } catch (error) {
        console.error("Error fetching company:", error);
        res.status(500).json({
            message: "Failed to fetch company",
            error: error.message
        });
    }
};

exports.createCompany = async (req, res) => {
    try {
        console.log("Creating company for user:", req.user.id);
        console.log("Request body:", req.body);

        const { company_name, description, location, website } = req.body;

        // Validate required fields
        if (!company_name || !description || !location) {
            return res.status(400).json({
                message: "Company name, description, and location are required"
            });
        }

        // Check if user already has a company
        const [existing] = await db.query(
            "SELECT * FROM companies WHERE owner_id = ?",
            [req.user.id]
        );

        if (existing.length > 0) {
            return res.status(400).json({
                message: "You already have a company"
            });
        }

        const [result] = await db.query(
            `INSERT INTO companies 
             (company_name, description, location, website, owner_id) 
             VALUES (?, ?, ?, ?, ?)`,
            [company_name, description, location, website || null, req.user.id]
        );

        // Get the created company
        const [companies] = await db.query(
            "SELECT * FROM companies WHERE id = ?",
            [result.insertId]
        );

        res.status(201).json({
            message: "Company created successfully",
            company: companies[0]
        });
    } catch (error) {
        console.error("Error creating company:", error);
        res.status(500).json({
            message: "Failed to create company",
            error: error.message
        });
    }
};

exports.updateCompany = async (req, res) => {
    try {
        console.log("Updating company for user:", req.user.id);
        console.log("Company ID:", req.params.id);
        console.log("Request body:", req.body);

        const { company_name, description, location, website } = req.body;
        const companyId = req.params.id;

        // Validate required fields
        if (!company_name || !description || !location) {
            return res.status(400).json({
                message: "Company name, description, and location are required"
            });
        }

        // Check if company exists and belongs to user
        const [companies] = await db.query(
            "SELECT * FROM companies WHERE id = ? AND owner_id = ?",
            [companyId, req.user.id]
        );

        if (companies.length === 0) {
            return res.status(404).json({
                message: "Company not found or you don't have permission"
            });
        }

        await db.query(
            `UPDATE companies 
             SET company_name = ?, 
                 description = ?, 
                 location = ?, 
                 website = ?
             WHERE id = ? AND owner_id = ?`,
            [company_name, description, location, website || null, companyId, req.user.id]
        );

        // Get updated company
        const [updated] = await db.query(
            "SELECT * FROM companies WHERE id = ?",
            [companyId]
        );

        res.json({
            message: "Company updated successfully",
            company: updated[0]
        });
    } catch (error) {
        console.error("Error updating company:", error);
        res.status(500).json({
            message: "Failed to update company",
            error: error.message
        });
    }
};

exports.deleteCompany = async (req, res) => {
    try {
        console.log("Deleting company for user:", req.user.id);
        console.log("Company ID:", req.params.id);

        const companyId = req.params.id;

        // Check if company exists and belongs to user
        const [companies] = await db.query(
            "SELECT * FROM companies WHERE id = ? AND owner_id = ?",
            [companyId, req.user.id]
        );

        if (companies.length === 0) {
            return res.status(404).json({
                message: "Company not found or you don't have permission"
            });
        }

        // Delete company (this will cascade delete jobs and applications if set up)
        await db.query(
            "DELETE FROM companies WHERE id = ? AND owner_id = ?",
            [companyId, req.user.id]
        );

        res.json({
            message: "Company deleted successfully"
        });
    } catch (error) {
        console.error("Error deleting company:", error);
        res.status(500).json({
            message: "Failed to delete company",
            error: error.message
        });
    }
};

// Get company by ID (for public viewing)
exports.getCompanyById = async (req, res) => {
    try {
        const [companies] = await db.query(
            "SELECT * FROM companies WHERE id = ?",
            [req.params.id]
        );

        if (companies.length === 0) {
            return res.status(404).json({
                message: "Company not found"
            });
        }

        res.json(companies[0]);
    } catch (error) {
        console.error("Error fetching company:", error);
        res.status(500).json({
            message: "Failed to fetch company",
            error: error.message
        });
    }
};

// Get all companies (for public viewing)
exports.getAllCompanies = async (req, res) => {
    try {
        const [companies] = await db.query(
            "SELECT * FROM companies ORDER BY company_name ASC"
        );

        res.json(companies);
    } catch (error) {
        console.error("Error fetching companies:", error);
        res.status(500).json({
            message: "Failed to fetch companies",
            error: error.message
        });
    }
};