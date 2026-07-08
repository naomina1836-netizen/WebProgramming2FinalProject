const express = require("express");
const router = express.Router();
const authenticate = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");
const companyController = require("../controllers/companyController");

// Get my company 
router.get("/my", authenticate, authorize("employer"), companyController.getMyCompany);

// Get all companies
router.get("/", companyController.getAllCompanies);

// Create company
router.post("/", authenticate, authorize("employer"), companyController.createCompany);

// Get company by ID
router.get("/:id", companyController.getCompanyById);

// Update company
router.put("/:id", authenticate, authorize("employer"), companyController.updateCompany);

// Delete company
router.delete("/:id", authenticate, authorize("employer"), companyController.deleteCompany);

module.exports = router;