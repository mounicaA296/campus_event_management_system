const Event = require("../models/Event");
const Registration = require("../models/Registration");

// GET /api/dashboard/stats  (organizer only — org sees stats for events they created)
const getStats = async (req, res) => {
  try {
    const myEvents = await Event.find({ organizer: req.user._id });
    const myEventIds = myEvents.map((e) => e._id);

    const totalEvents = myEvents.length;
    const totalRegistrations = await Registration.countDocuments({ event: { $in: myEventIds } });
    const totalCheckedIn = await Registration.countDocuments({ event: { $in: myEventIds }, checkedIn: true });

    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const todayEnd = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
    const todaysEvent = myEvents.find((e) => e.dateTime >= todayStart && e.dateTime < todayEnd);

    let todaysEventStats = null;
    if (todaysEvent) {
      const total = await Registration.countDocuments({ event: todaysEvent._id });
      const checkedIn = await Registration.countDocuments({ event: todaysEvent._id, checkedIn: true });
      todaysEventStats = {
        title: todaysEvent.title,
        registered: total,
        checkedIn,
        attendancePercent: total > 0 ? Number(((checkedIn / total) * 100).toFixed(1)) : 0
      };
    }

    res.json({
      totalEvents,
      totalRegistrations,
      totalCheckedIn,
      overallAttendancePercent:
        totalRegistrations > 0 ? Number(((totalCheckedIn / totalRegistrations) * 100).toFixed(1)) : 0,
      todaysEvent: todaysEventStats
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to load dashboard stats", error: err.message });
  }
};

module.exports = { getStats };
