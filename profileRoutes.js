const express = require("express");

const router = express.Router();

const authenticate = require("../middleware/authMiddleware");

const controller = require("../controllers/profileController");

router.get(
    "/me",
    authenticate,
    controller.getProfile
);

router.put(
    "/me",
    authenticate,
    controller.updateProfile
);

module.exports = router;