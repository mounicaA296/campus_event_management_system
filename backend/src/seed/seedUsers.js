// Run with: npm run seed
// Creates two demo accounts so you don't need a sign-up flow during the demo.
require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const connectDB = require("../config/db");
const User = require("../models/User");

const run = async () => {
  await connectDB();

  const demoUsers = [
    {
      name: "Arun Kumar",
      email: "student@campuspass.com",
      password: "student123",
      role: "student",
      department: "Computer Science",
      regNo: "CS2023045"
    },
    {
      name: "Priya Sharma",
      email: "organizer@campuspass.com",
      password: "organizer123",
      role: "organizer",
      department: "Coding Club",
      regNo: "ORG001"
    }
  ];

  for (const u of demoUsers) {
    const exists = await User.findOne({ email: u.email });
    if (exists) {
      console.log(`⏭  ${u.email} already exists, skipping`);
      continue;
    }
    const hashed = await bcrypt.hash(u.password, 10);
    await User.create({ ...u, password: hashed });
    console.log(`✅ Created ${u.role}: ${u.email} / ${u.password}`);
  }

  console.log("\nSeed complete. Demo login credentials:");
  console.log("  Student:   student@campuspass.com   / student123");
  console.log("  Organizer: organizer@campuspass.com / organizer123");

  await mongoose.connection.close();
  process.exit(0);
};

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
