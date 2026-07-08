const express = require("express");
const router = express.Router();
const authenticate = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");
const jobController = require("../controllers/jobController");

// Public routes
router.get("/", jobController.getAll);
router.get("/search", jobController.search);
router.get("/:id", jobController.getOne);

// Employer routes
router.post("/", authenticate, authorize("employer"), jobController.create);
router.get("/mine", authenticate, authorize("employer"), jobController.getMine);
router.put("/:id", authenticate, authorize("employer"), jobController.update);
router.delete("/:id", authenticate, authorize("employer"), jobController.remove);

module.exports = router;