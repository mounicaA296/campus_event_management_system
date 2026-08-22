# Pushing CampusPass to GitHub

## 1. Create a new empty repo on GitHub
Go to https://github.com/new, name it e.g. `campuspass`, **do not** check
"Add a README" (you already have one), then click **Create repository**.
Keep the page open — it shows the remote URL you'll need below.

## 2. Initialize git locally (first time only)
From the project root (the folder containing `backend/`, `frontend/`, `docs/`):
```bash
cd campuspass
git init
git add .
git commit -m "Initial commit: CampusPass full-stack MVP"
```
`node_modules/`, `.env`, and `dist/` are already excluded via `.gitignore` —
never commit real `.env` files (they may hold secrets like `JWT_SECRET` or
your Atlas password). Only `.env.example` should be committed.

## 3. Connect to GitHub and push
Copy the exact remote URL GitHub showed you (HTTPS example below):
```bash
git branch -M main
git remote add origin https://github.com/<your-username>/campuspass.git
git push -u origin main
```
If prompted for credentials, GitHub no longer accepts your account password
for git operations over HTTPS — use a **Personal Access Token** instead
(GitHub → Settings → Developer settings → Personal access tokens → generate
one with `repo` scope, and paste it in place of your password when prompted).

Alternatively, use SSH if you already have an SSH key added to GitHub:
```bash
git remote add origin git@github.com:<your-username>/campuspass.git
git push -u origin main
```

## 4. Making further changes during/after the hackathon
```bash
git add .
git commit -m "Describe what changed"
git push
```

## 5. (Optional) Branch per feature, for team hackathons
```bash
git checkout -b feature/qr-scanner
# ...make changes...
git add .
git commit -m "Add QR scanner page"
git push -u origin feature/qr-scanner
```
Then open a Pull Request on GitHub from that branch into `main`.

## 6. Deploying later (not required for the demo, but useful to know)
- **Backend:** Render, Railway, or Fly.io all have free tiers that deploy a
  Node/Express app directly from your GitHub repo — set the same environment
  variables from `backend/.env` in their dashboard.
- **Frontend:** Vercel or Netlify — deploy the `frontend/` folder, set
  `VITE_API_URL` to your deployed backend's URL as an environment variable.
- Remember to update `CLIENT_URL` in the backend's environment variables to
  your deployed frontend's URL, or CORS will block requests.
