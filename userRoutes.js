const express = require("express");
const router = express.Router();
const authenticate = require("../middleware/authMiddleware");
const userController = require("../controllers/userController");

router.get("/me", authenticate, userController.me);
router.put("/me", authenticate, userController.update);

module.exports = router;