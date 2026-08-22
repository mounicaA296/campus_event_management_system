# campus_event_management_system

# 🎟️ CampusPass — Smart College Event Registration & QR Attendance System

A full-stack MERN web portal built for:

**Problem Statement ID:** RWW-8
**Problem Statement Title:** Campus Event Management and Registration Portal
**Category:** Software
**Theme:** Campus Utility

---

## 📌 Problem Statement

College clubs and student bodies currently manage event registrations through
spreadsheets, paper forms, or scattered messaging apps. This makes it difficult to:
- Track attendance accurately
- Avoid duplicate entries
- Verify participants at the event venue

**Expected Solution (as per problem statement):**
- A web portal for clubs to create and publish event details
- A way for students to register for an event and receive a confirmation (digital ticket/code)
- A way to verify a registered participant at the event (code lookup)
- A summary view for organisers of total registrations and attendance

---

## 💡 Proposed Solution — CampusPass

CampusPass is a MERN-based web portal that digitizes the entire event lifecycle:

1. **Organizers (clubs/student bodies)** create and publish events with date, time,
   venue, and a registration limit.
2. **Students** browse published events and register in one click, instantly
   receiving a **QR-coded digital ticket** as confirmation — no more paper forms
   or spreadsheet sign-ups.
3. **At the venue**, organizers use a live camera **QR scanner** (with a manual
   ticket-ID fallback) to verify each participant and mark attendance in real time.
4. **Smart Check-in Protection**: if a QR is scanned a second time, the system does
   **not** silently re-mark attendance — it shows a warning with the student's name
   and original check-in time, catching duplicate entries or forwarded tickets.
5. **Organizer Dashboard** gives a live summary: total events, total registrations,
   check-ins, and attendance percentage — replacing manual spreadsheet tallying.

This directly satisfies all four points of the expected solution while adding a
practical anti-duplication safeguard that spreadsheets/paper forms cannot offer.

---

## 🛠️ Tech Stack

| Layer      | Technology |
|------------|------------|
| Frontend   | React 18 (Vite), Tailwind CSS, React Router, `html5-qrcode` |
| Backend    | Node.js, Express.js |
| Database   | MongoDB (Mongoose ODM) |
| Auth       | JWT + bcrypt password hashing |
| Ticketing  | `qrcode` npm package (QR generation) |
| API Testing| Postman collection (included) |
| Version Control | Git + GitHub |

---

## 👥 Team

| Name | Role | Contribution |
|------|------|---------------|
| _[Add Name 1]_ | Team Lead / Backend Developer | API design, database schema, authentication, attendance logic |
| _[Add Name 2]_ | Frontend Developer | React UI, event pages, QR ticket display, dashboard UI |
| _[Add Name 3]_ | Full-Stack / QA & Docs | QR scanner integration, testing, Postman collection, documentation |

*(Fill in your teammates' names above before submission.)*

---

## ⭐ Headline Feature: Smart Check-in Protection

Scanning the same QR twice does **not** silently mark attendance again. It returns
a clear warning with the student's name and original check-in time, so organizers
catch re-entries or shared/forwarded tickets in real time.

---

## 📁 Project Structure
```
campuspass/
├── backend/                 Node/Express API
│   ├── src/
│   │   ├── config/db.js         MongoDB connection
│   │   ├── models/              User, Event, Registration (Mongoose schemas)
│   │   ├── middleware/          auth.js (JWT), role.js (role guard)
│   │   ├── controllers/         business logic per feature
│   │   ├── routes/               Express route files
│   │   ├── utils/generateTicketId.js
│   │   ├── seed/seedUsers.js     creates demo Student + Organizer logins
│   │   └── server.js             app entry point
│   ├── package.json
│   └── .env.example
├── frontend/                 React app
│   ├── src/
│   │   ├── pages/                Login, Events, EventDetail, MyTickets,
│   │   │                         CreateEvent, OrganizerDashboard, ScanQR
│   │   ├── components/            Navbar, EventCard, ProtectedRoute
│   │   ├── context/AuthContext.jsx
│   │   └── services/api.js        axios instance with JWT interceptor
│   ├── package.json
│   └── .env.example
├── postman/CampusPass.postman_collection.json
├── docs/
│   ├── SETUP.md            step-by-step install & run guide
│   ├── API_TESTING.md      how to test every endpoint
│   └── GIT_STEPS.md        how to push this to GitHub
└── README.md (this file)
```

---

## 🚀 Quick Start
See **[docs/SETUP.md](docs/SETUP.md)** for full step-by-step instructions.
The short version:

```bash
# 1. Backend
cd backend
npm install
cp .env.example .env      # then edit MONGO_URI if needed
npm run seed               # creates demo Student + Organizer accounts
npm run dev                 # http://localhost:5000

# 2. Frontend (in a new terminal)
cd frontend
npm install
cp .env.example .env
npm run dev                 # http://localhost:5173
```

## 🔑 Demo Logins (after `npm run seed`)
| Role      | Email                     | Password      |
|-----------|----------------------------|----------------|
| Student   | student@campuspass.com     | student123     |
| Organizer | organizer@campuspass.com   | organizer123   |

## 🎬 Demo Script for Judges
1. Log in as **Organizer** → Create Event "CodeSprint 2026".
2. Log out, log in as **Student** → open the event → Register → QR ticket appears.
3. Log back in as **Organizer** → Scan QR page → scan (or paste) the ticket ID →
   "✅ Checked in successfully".
4. Scan the **same** ticket again → "⚠️ Already Checked In" with name + time.
5. Open Dashboard → registrations / check-ins / attendance % update live.

## 📡 API Overview
See **[docs/API_TESTING.md](docs/API_TESTING.md)** for the full list with example
requests, and import `postman/CampusPass.postman_collection.json` into Postman
to test everything in one click.
