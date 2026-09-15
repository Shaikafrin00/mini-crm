# Mini CRM — Client Lead Management System

A full-stack CRM to manage client leads generated from website contact forms.

## Stack
- Frontend: React.js (Vite)
- Backend: Node.js + Express (REST API)
- Database: MongoDB (Mongoose)
- Auth: JWT-based secure admin login

## Features
- Lead listing with search + status filter
- Lead status updates (new / contacted / converted / lost)
- Notes and follow-ups per lead
- Secure admin-only access (JWT)

## Google Sign-In Setup (optional but recommended)
1. Go to https://console.cloud.google.com/ → create a project (or use an existing one).
2. Go to **APIs & Services → Credentials → Create Credentials → OAuth Client ID**.
3. Application type: **Web application**.
4. Under **Authorized JavaScript origins**, add:
   - `http://localhost:5173` (local dev)
   - your deployed frontend URL later (e.g. `https://your-app.vercel.app`)
5. Click Create — copy the **Client ID** shown.
6. Put it in `backend/.env` as `GOOGLE_CLIENT_ID=...`
7. Put it in `frontend/.env` as `VITE_GOOGLE_CLIENT_ID=...`

If you skip this, email/password login and Create Account still work fine — only the "Continue with Google" button won't function.

## Local Setup

### 1. Database
Create a free MongoDB Atlas cluster: https://www.mongodb.com/cloud/atlas
Get your connection string (looks like `mongodb+srv://user:pass@cluster0.mongodb.net/minicrm`).

### 2. Backend
```
cd backend
npm install
cp .env.example .env   # fill in MONGO_URI, JWT_SECRET, ADMIN_EMAIL, ADMIN_PASSWORD
npm run seed            # creates the admin account
npm run dev              # starts server on http://localhost:5000
```

### 3. Frontend
```
cd frontend
npm install
cp .env.example .env   # VITE_API_URL=http://localhost:5000/api
npm run dev              # starts app on http://localhost:5173
```

Login with the ADMIN_EMAIL / ADMIN_PASSWORD you set in backend/.env.

## Deployment
- Database: MongoDB Atlas (free M0 tier)
- Backend: Render.com (Web Service, connect GitHub repo, root dir `backend`, build `npm install`, start `npm start`, add env vars)
- Frontend: Vercel (import repo, root dir `frontend`, add env var VITE_API_URL = your Render backend URL + /api)

## API Endpoints
- POST /api/auth/login
- GET /api/leads
- GET /api/leads/:id
- POST /api/leads
- PATCH /api/leads/:id/status
- POST /api/leads/:id/notes
- DELETE /api/leads/:id
