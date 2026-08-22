const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, default: "" },
    category: {
      type: String,
      enum: ["Technical", "Cultural", "Workshop", "Sports", "Other"],
      default: "Other"
    },
    venue: { type: String, required: true },
    dateTime: { type: Date, required: true },
    registrationLimit: { type: Number, default: 100 },
    organizer: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    image: { type: String, default: "" },
    published: { type: Boolean, default: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Event", eventSchema);
