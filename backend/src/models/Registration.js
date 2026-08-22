const mongoose = require("mongoose");

const registrationSchema = new mongoose.Schema(
  {
    event: { type: mongoose.Schema.Types.ObjectId, ref: "Event", required: true },
    student: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    ticketId: { type: String, required: true, unique: true }, // encoded into the QR
    checkedIn: { type: Boolean, default: false },
    checkedInAt: { type: Date, default: null }
  },
  { timestamps: true }
);

registrationSchema.index({ event: 1, student: 1 }, { unique: true });

module.exports = mongoose.model("Registration", registrationSchema);
