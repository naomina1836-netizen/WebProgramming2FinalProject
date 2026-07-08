const express = require("express");

const router = express.Router();

const authenticate = require("../middleware/authMiddleware");
const upload = require("../middleware/upload");

const controller = require("../controllers/resumeController");

router.post(
    "/",
    authenticate,
    upload.single("resume"),
    controller.upload
);

router.get(
    "/my",
    authenticate,
    controller.getMine
);

module.exports = router;