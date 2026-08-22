const express = require("express");
const {
  getEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
  getMyEvents
} = require("../controllers/eventController");
const { protect } = require("../middleware/auth");
const { requireRole } = require("../middleware/role");

const router = express.Router();

router.get("/", getEvents);
router.get("/mine/list", protect, requireRole("organizer"), getMyEvents);
router.get("/:id", getEventById);
router.post("/", protect, requireRole("organizer"), createEvent);
router.put("/:id", protect, requireRole("organizer"), updateEvent);
router.delete("/:id", protect, requireRole("organizer"), deleteEvent);

module.exports = router;
