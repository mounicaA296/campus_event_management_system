# 🎟️ CampusPass — Smart College Event Registration & QR Attendance System

A full-stack MERN web portal built for **college clubs and student bodies** to
publish events, let students register and receive a digital QR ticket, and let
organizers verify attendance at the venue by scanning that ticket — replacing
spreadsheets, paper forms, and scattered messaging apps.

---

## 📋 Problem Statement
**ID:** RWW-8
**Title:** Campus Event Management and Registration Portal
**Category:** Software | **Theme:** Campus Utility

College clubs and student bodies currently manage event registrations through
spreadsheets, paper forms, or scattered messaging apps, making it difficult to
track attendance, avoid duplicate entries, or verify participants at the event
venue.

## 💡 Proposed Solution
CampusPass solves this end-to-end:
- **Organizers** create and publish event details — title, date/time, venue,
  category, and a registration limit.
- **Students** browse and search events, register in a few clicks, and
  instantly receive a **digital QR ticket** as confirmation.
- **Venue verification** happens by scanning the QR code (with a manual
  ticket-ID fallback if the camera isn't available).
- **Smart Check-in Protection** — scanning the same QR twice does not
  silently re-mark attendance. It shows a warning with the student's name and
  original check-in time, so organizers catch duplicate or forwarded tickets
  instantly.
- **Live dashboard** — organizers see total events, total registrations,
  today's event, and real-time attendance percentage.

## ⭐ Headline Feature: Smart Check-in Protection
⚠️ Already Checked In
Student: Arun Kumar
Time: 10:42 AM
Simple to demo, hard to fake — this is what separates CampusPass from a
plain registration form.

## 🛠️ Tech Stack
| Layer | Technology |
|---|---|
| Frontend | React 18 (Vite), Tailwind CSS, React Router, `html5-qrcode` |
| Backend | Node.js, Express.js |
| Database | MongoDB (Mongoose ODM) |
| Auth | JWT + bcrypt password hashing |
| Ticketing | `qrcode` (QR generation) |
| API Testing | Postman |
| Version Control | Git & GitHub |

## 👥 Team
| Name | Role | Contribution |
|---|---|---|
| <Member 1 name> | Backend & Database | Designed MongoDB schemas (User, Event, Registration), built the Express REST API, JWT authentication, and QR ticket generation logic. |
| <Member 2 name> | Frontend | Built the React UI — event browsing/search, registration flow, organizer dashboard, and the QR scanner page. |
| <Member 3 name> | Integration, Testing & Docs | Connected frontend to backend via the API service layer, wrote the Postman test collection, and handled documentation and deployment setup. |

## 📁 Project Structure
campuspass/
├── backend/ Node/Express API
│ ├── src/
│ │ ├── config/db.js MongoDB connection
│ │ ├── models/ User, Event, Registration (Mongoose schemas)
│ │ ├── middleware/ auth.js (JWT), role.js (role guard)
│ │ ├── controllers/ business logic per feature
│ │ ├── routes/ Express route files
│ │ ├── utils/generateTicketId.js
│ │ ├── seed/seedUsers.js creates demo Student + Organizer logins
│ │ └── server.js app entry point
│ ├── package.json
│ └── .env.example
├── frontend/ React app
│ ├── src/
│ │ ├── pages/ Login, Events, EventDetail, MyTickets,
│ │ │ CreateEvent, OrganizerDashboard, ScanQR
│ │ ├── components/ Navbar, EventCard, CountdownTimer, ProtectedRoute
│ │ ├── context/AuthContext.jsx
│ │ └── services/api.js axios instance with JWT interceptor
│ ├── package.json
│ └── .env.example
├── postman/CampusPass.postman_collection.json
├── docs/
│ ├── SETUP.md step-by-step install & run guide
│ ├── API_TESTING.md how to test every endpoint
│ └── GIT_STEPS.md how this was pushed to GitHub
└── README.md (this file)

## 🚀 Quick Start
Full instructions: **[docs/SETUP.md](docs/SETUP.md)**

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
| Role | Email | Password |
|---|---|---|
| Student | student@campuspass.com | student123 |
| Organizer | organizer@campuspass.com | organizer123 |

## 🎬 Demo Script
1. Log in as **Organizer** → Create Event "CodeSprint 2026".
2. Log out, log in as **Student** → open the event → Register → QR ticket appears.
3. Log back in as **Organizer** → Scan QR page → scan (or paste) the ticket ID → "✅ Checked in successfully".
4. Scan the **same** ticket again → "⚠️ Already Checked In" with name + time.
5. Open Dashboard → registrations / check-ins / attendance % update live.

## 📡 API Overview
Full endpoint list with example requests: **[docs/API_TESTING.md](docs/API_TESTING.md)**.
Import `postman/CampusPass.postman_collection.json` into Postman to test everything in one click.