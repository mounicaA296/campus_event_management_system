# Setup Guide — Run CampusPass locally in VS Code

## 0. Prerequisites
Install these before you start:
- **Node.js** v18+ (includes npm) — https://nodejs.org
- **MongoDB** — pick ONE:
  - Option A (easiest, no install): free **MongoDB Atlas** cluster — https://www.mongodb.com/cloud/atlas/register
  - Option B: install MongoDB Community Server locally — https://www.mongodb.com/try/download/community
- **VS Code** — https://code.visualstudio.com
- A webcam (optional) if you want to demo the live QR camera scanner. A manual
  "paste ticket ID" field is also built in, so a webcam is not required.

## 1. Open the project
Unzip the project, then in VS Code: `File → Open Folder... → campuspass/`

You should see two main folders: `backend/` and `frontend/`. Open two terminals
in VS Code (Terminal → Split Terminal) — one for each.

## 2. Backend setup
```bash
cd backend
npm install
```

Create your real environment file:
```bash
cp .env.example .env
```

Open `.env` and set `MONGO_URI`:
- **Using Atlas:** In Atlas, click "Connect" → "Drivers" → copy the connection
  string, replace `<username>` / `<password>` with your Atlas DB user, and paste
  it as `MONGO_URI`. Make sure your current IP is allow-listed in Atlas
  Network Access (or allow `0.0.0.0/0` for the hackathon demo).
- **Using local MongoDB:** leave the default
  `mongodb://127.0.0.1:27017/campuspass` and just make sure your local
  `mongod` service is running.

Seed two demo accounts (Student + Organizer):
```bash
npm run seed
```
You should see:
```
✅ Created student: student@campuspass.com / student123
✅ Created organizer: organizer@campuspass.com / organizer123
```

Start the API:
```bash
npm run dev
```
It should print: `🚀 CampusPass API listening on http://localhost:5000`

Sanity check: open http://localhost:5000 in a browser — you should see
`{"message":"CampusPass API is running 🚀"}`.

## 3. Frontend setup
In your second terminal:
```bash
cd frontend
npm install
cp .env.example .env
```
The default `VITE_API_URL=http://localhost:5000/api` in `.env` matches the
backend above — no change needed unless you deployed the backend elsewhere.

Start the app:
```bash
npm run dev
```
Open the printed URL, typically **http://localhost:5173**.

## 4. Log in and try it
Use the demo login buttons on the Login page (they auto-fill the credentials),
or type them manually:
- Student: `student@campuspass.com` / `student123`
- Organizer: `organizer@campuspass.com` / `organizer123`

Follow the "Demo script for judges" section in the root `README.md`.

## 5. Common issues
| Problem | Fix |
|---|---|
| `MongoServerError: bad auth` | Double-check the username/password in your Atlas connection string; special characters in the password must be URL-encoded. |
| Backend runs but frontend shows network errors | Confirm `VITE_API_URL` in `frontend/.env` matches the port the backend actually printed, and that `CLIENT_URL` in `backend/.env` matches your frontend's URL (for CORS). |
| Camera scanner doesn't open | Browsers only allow camera access on `localhost` or HTTPS — `http://localhost:5173` is fine. Otherwise use the manual "paste ticket ID" field on the Scan QR page. |
| `npm run seed` says accounts already exist | That's fine — it means you already seeded; just use the printed demo credentials. |
