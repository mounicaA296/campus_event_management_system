# API Testing Guide

Base URL (local): `http://localhost:5000/api`

Import `postman/CampusPass.postman_collection.json` into Postman for ready-made
requests with variables already wired up — it auto-saves the JWT token and
event ID from responses into collection variables, so you can run requests
top-to-bottom without copy-pasting IDs by hand.

If you prefer curl, here's the full flow:

## 1. Register or log in
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"organizer@campuspass.com","password":"organizer123"}'
```
Response includes a `token` — copy it, you'll need it for every request below
as `Authorization: Bearer <token>`.

## 2. Create an event (organizer token)
```bash
curl -X POST http://localhost:5000/api/events \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <ORGANIZER_TOKEN>" \
  -d '{
    "title": "CodeSprint 2026",
    "description": "24-hour coding competition",
    "category": "Technical",
    "venue": "Main Auditorium",
    "dateTime": "2026-09-10T09:00:00.000Z",
    "registrationLimit": 200
  }'
```
Copy the returned `_id` — that's the event ID used below.

## 3. Browse events (public, no token needed)
```bash
curl http://localhost:5000/api/events
curl http://localhost:5000/api/events/<EVENT_ID>
```

## 4. Register for an event (student token)
```bash
curl -X POST http://localhost:5000/api/registrations/<EVENT_ID> \
  -H "Authorization: Bearer <STUDENT_TOKEN>"
```
Response includes `qrCode` (a base64 PNG data URL) and `registration.ticketId`
(e.g. `CP-9F3A2C1B`) — that ticket ID is what gets encoded in the QR and what
you scan/paste at check-in.

## 5. Scan / check in a ticket (organizer token, must own the event)
```bash
curl -X POST http://localhost:5000/api/attendance/scan \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <ORGANIZER_TOKEN>" \
  -d '{"ticketId": "CP-9F3A2C1B"}'
```
- First scan → `200 OK`, `"status": "success"`.
- Second scan of the **same** ticket → `409 Conflict`,
  `"status": "duplicate"`, `"message": "⚠️ Already Checked In"` with the
  student's name and original check-in time.
- Unknown ticket → `404 Not Found`, `"status": "invalid"`.

## 6. Dashboard stats (organizer token)
```bash
curl http://localhost:5000/api/dashboard/stats \
  -H "Authorization: Bearer <ORGANIZER_TOKEN>"
```

## Full endpoint reference
| Method | Endpoint | Auth | Role | Description |
|---|---|---|---|---|
| POST | `/api/auth/register` | none | — | Create an account |
| POST | `/api/auth/login` | none | — | Log in, get JWT |
| GET | `/api/auth/me` | JWT | any | Current user info |
| GET | `/api/events` | none | — | List published events (filters: `category`, `status`, `search`) |
| GET | `/api/events/:id` | none | — | Single event details |
| POST | `/api/events` | JWT | organizer | Create event |
| PUT | `/api/events/:id` | JWT | organizer (owner) | Edit event |
| DELETE | `/api/events/:id` | JWT | organizer (owner) | Delete event |
| GET | `/api/events/mine/list` | JWT | organizer | Events you created, with counts |
| POST | `/api/registrations/:eventId` | JWT | student | Register + get QR ticket |
| GET | `/api/registrations/me` | JWT | student | Your tickets |
| GET | `/api/registrations/event/:eventId` | JWT | organizer (owner) | Who registered for your event |
| POST | `/api/attendance/scan` | JWT | organizer | Check in a ticket by ID (duplicate-protected) |
| GET | `/api/dashboard/stats` | JWT | organizer | Totals + today's event attendance % |
