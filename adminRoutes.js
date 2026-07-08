const express = require("express");

const router = express.Router();

const authenticate = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");

const controller = require("../controllers/adminController");

router.use(authenticate);
router.use(authorize("admin"));

router.get("/dashboard", controller.dashboard);

router.get("/users", controller.users);

router.get("/companies", controller.companies);

router.get("/jobs", controller.jobs);

router.delete("/users/:id", controller.deleteUser);

router.delete("/jobs/:id", controller.deleteJob);

module.exports = router;