const express = require("express");
const { scanTicket } = require("../controllers/attendanceController");
const { protect } = require("../middleware/auth");
const { requireRole } = require("../middleware/role");

const router = express.Router();

router.post("/scan", protect, requireRole("organizer"), scanTicket);

module.exports = router;
