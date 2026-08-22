const Event = require("../models/Event");
const Registration = require("../models/Registration");

// GET /api/events  (public — anyone can browse)
const getEvents = async (req, res) => {
  try {
    const { category, status, search } = req.query;
    const filter = { published: true };
    if (category && category !== "all") filter.category = category;
    if (search) filter.title = { $regex: search, $options: "i" };

    let events = await Event.find(filter).populate("organizer", "name department").sort({ dateTime: 1 });

    const now = new Date();
    if (status === "upcoming") events = events.filter((e) => new Date(e.dateTime) > now);
    if (status === "past") events = events.filter((e) => new Date(e.dateTime) <= now);

    // attach registration counts
    const withCounts = await Promise.all(
      events.map(async (e) => {
        const count = await Registration.countDocuments({ event: e._id });
        return {
          ...e.toObject(),
          registeredCount: count,
          seatsLeft: Math.max(e.registrationLimit - count, 0),
          status: new Date(e.dateTime) > now ? "upcoming" : "past"
        };
      })
    );

    res.json(withCounts);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch events", error: err.message });
  }
};

// GET /api/events/:id
const getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id).populate("organizer", "name department");
    if (!event) return res.status(404).json({ message: "Event not found" });

    const count = await Registration.countDocuments({ event: event._id });
    res.json({
      ...event.toObject(),
      registeredCount: count,
      seatsLeft: Math.max(event.registrationLimit - count, 0),
      status: new Date(event.dateTime) > new Date() ? "upcoming" : "past"
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch event", error: err.message });
  }
};

// POST /api/events  (organizer only)
const createEvent = async (req, res) => {
  try {
    const { title, description, category, venue, dateTime, registrationLimit, image } = req.body;
    if (!title || !venue || !dateTime) {
      return res.status(400).json({ message: "title, venue and dateTime are required" });
    }
    const event = await Event.create({
      title,
      description,
      category,
      venue,
      dateTime,
      registrationLimit: registrationLimit || 100,
      image,
      organizer: req.user._id
    });
    res.status(201).json(event);
  } catch (err) {
    res.status(500).json({ message: "Failed to create event", error: err.message });
  }
};

// PUT /api/events/:id  (organizer who owns the event only)
const updateEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: "Event not found" });
    if (String(event.organizer) !== String(req.user._id)) {
      return res.status(403).json({ message: "You can only edit your own events" });
    }
    Object.assign(event, req.body);
    await event.save();
    res.json(event);
  } catch (err) {
    res.status(500).json({ message: "Failed to update event", error: err.message });
  }
};

// DELETE /api/events/:id  (organizer who owns the event only)
const deleteEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: "Event not found" });
    if (String(event.organizer) !== String(req.user._id)) {
      return res.status(403).json({ message: "You can only delete your own events" });
    }
    await event.deleteOne();
    await Registration.deleteMany({ event: event._id });
    res.json({ message: "Event deleted" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete event", error: err.message });
  }
};

// GET /api/events/mine/list (organizer — events they created)
const getMyEvents = async (req, res) => {
  try {
    const eventsList = await Event.find({ organizer: req.user._id }).sort({ dateTime: 1 });
    const withCounts = await Promise.all(
      eventsList.map(async (e) => {
        const total = await Registration.countDocuments({ event: e._id });
        const checkedIn = await Registration.countDocuments({ event: e._id, checkedIn: true });
        return { ...e.toObject(), registeredCount: total, checkedInCount: checkedIn };
      })
    );
    res.json(withCounts);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch your events", error: err.message });
  }
};

module.exports = { getEvents, getEventById, createEvent, updateEvent, deleteEvent, getMyEvents };
