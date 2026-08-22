const express = require("express");
const {
  registerForEvent,
  getMyRegistrations,
  getRegistrationsForEvent
} = require("../controllers/registrationController");
const { protect } = require("../middleware/auth");
const { requireRole } = require("../middleware/role");

const router = express.Router();

router.post("/:eventId", protect, requireRole("student"), registerForEvent);
router.get("/me", protect, requireRole("student"), getMyRegistrations);
router.get("/event/:eventId", protect, requireRole("organizer"), getRegistrationsForEvent);

module.exports = router;
