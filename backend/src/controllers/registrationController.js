const QRCode = require("qrcode");
const Event = require("../models/Event");
const Registration = require("../models/Registration");
const generateTicketId = require("../utils/generateTicketId");

// POST /api/registrations/:eventId  (student only)
const registerForEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.eventId);
    if (!event) return res.status(404).json({ message: "Event not found" });

    if (new Date(event.dateTime) <= new Date()) {
      return res.status(400).json({ message: "This event has already ended" });
    }

    const existing = await Registration.findOne({ event: event._id, student: req.user._id });
    if (existing) {
      return res.status(409).json({ message: "You are already registered for this event" });
    }

    const count = await Registration.countDocuments({ event: event._id });
    if (count >= event.registrationLimit) {
      return res.status(400).json({ message: "Registration limit reached — event is full" });
    }

    const ticketId = generateTicketId();
    const registration = await Registration.create({
      event: event._id,
      student: req.user._id,
      ticketId
    });

    // The QR encodes the ticketId — that's all the scanner needs to verify + check in
    const qrDataUrl = await QRCode.toDataURL(ticketId, { width: 300, margin: 1 });

    res.status(201).json({
      message: "Registered successfully",
      registration,
      qrCode: qrDataUrl // base64 PNG the frontend can render directly in <img src=... />
    });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ message: "You are already registered for this event" });
    }
    res.status(500).json({ message: "Registration failed", error: err.message });
  }
};

// GET /api/registrations/me  (student — "My Tickets")
const getMyRegistrations = async (req, res) => {
  try {
    const regs = await Registration.find({ student: req.user._id })
      .populate("event")
      .sort({ createdAt: -1 });

    const withQr = await Promise.all(
      regs.map(async (r) => {
        const qrDataUrl = await QRCode.toDataURL(r.ticketId, { width: 300, margin: 1 });
        return { ...r.toObject(), qrCode: qrDataUrl };
      })
    );

    res.json(withQr);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch your tickets", error: err.message });
  }
};

// GET /api/registrations/event/:eventId  (organizer — see who registered)
const getRegistrationsForEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.eventId);
    if (!event) return res.status(404).json({ message: "Event not found" });
    if (String(event.organizer) !== String(req.user._id)) {
      return res.status(403).json({ message: "You can only view registrations for your own events" });
    }
    const regs = await Registration.find({ event: event._id })
      .populate("student", "name email department regNo")
      .sort({ createdAt: -1 });
    res.json(regs);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch registrations", error: err.message });
  }
};

module.exports = { registerForEvent, getMyRegistrations, getRegistrationsForEvent };
