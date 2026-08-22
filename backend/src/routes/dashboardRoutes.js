const express = require("express");
const { getStats } = require("../controllers/dashboardController");
const { protect } = require("../middleware/auth");
const { requireRole } = require("../middleware/role");

const router = express.Router();

router.get("/stats", protect, requireRole("organizer"), getStats);

module.exports = router;
