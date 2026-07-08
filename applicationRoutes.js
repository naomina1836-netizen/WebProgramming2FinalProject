const express = require("express");
const router = express.Router();
const authenticate = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");
const applicationController = require("../controllers/applicationController");

// Apply for a job
router.post("/:jobId", authenticate, authorize("job_seeker"), applicationController.apply);

// Get my applications
router.get("/my", authenticate, authorize("job_seeker"), applicationController.myApplications);

// Get applicants for employer
router.get("/applicants", authenticate, authorize("employer"), applicationController.getApplicants);

// Update application status
router.patch("/:id/status", authenticate, authorize("employer"), applicationController.updateStatus);

module.exports = router;