const { v4: uuidv4 } = require("uuid");

// Generates a short, unique, human-shareable ticket ID e.g. CP-9F3A2C1B
const generateTicketId = () => {
  const raw = uuidv4().replace(/-/g, "").toUpperCase();
  return `CP-${raw.slice(0, 10)}`;
};

module.exports = generateTicketId;
