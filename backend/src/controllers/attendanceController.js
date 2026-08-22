const Registration = require("../models/Registration");

// POST /api/attendance/scan   { ticketId }   (organizer only)
// This is the "Smart Check-in Protection" feature:
// - Unknown ticket        -> 404 invalid ticket
// - Valid, not checked in -> mark present, return success
// - Valid, already used   -> 409 "Already Checked In" + who/when, so the scanner UI can flag it
const scanTicket = async (req, res) => {
  try {
    const { ticketId } = req.body;
    if (!ticketId) return res.status(400).json({ message: "ticketId is required" });

    const registration = await Registration.findOne({ ticketId })
      .populate("student", "name email regNo department")
      .populate("event", "title venue dateTime organizer");

    if (!registration) {
      return res.status(404).json({ status: "invalid", message: "❌ Invalid ticket — not found in the system" });
    }

    // Only the organizer who owns this event can scan for it
    if (String(registration.event.organizer) !== String(req.user._id)) {
      return res.status(403).json({ message: "This ticket belongs to an event you do not organize" });
    }

    if (registration.checkedIn) {
      return res.status(409).json({
        status: "duplicate",
        message: "⚠️ Already Checked In",
        student: registration.student.name,
        email: registration.student.email,
        checkedInAt: registration.checkedInAt
      });
    }

    registration.checkedIn = true;
    registration.checkedInAt = new Date();
    await registration.save();

    return res.status(200).json({
      status: "success",
      message: "✅ Checked in successfully",
      student: registration.student.name,
      email: registration.student.email,
      event: registration.event.title,
      checkedInAt: registration.checkedInAt
    });
  } catch (err) {
    res.status(500).json({ message: "Scan failed", error: err.message });
  }
};

module.exports = { scanTicket };
