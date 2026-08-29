<<<<<<< HEAD
# TripVault - Complete Week 2 MERN Project

TripVault is a secure personal travel journal. This version completes every item in the supplied Week 2 PDF: authentication, protected trip CRUD, ownership checks, automatic UI refresh, loading/error states, and a responsive dashboard.

## Features

- Register, login, logout and 7-day JWT sessions
- Create, view, edit and delete trips
- Each user can access only their own trips
- Required dates, date-order validation and 1-5 rating validation
- Responsive dashboard, modal form, delete confirmation and empty state
- Axios JWT interceptor and automatic handling of expired sessions

## Run on Windows (VS Code PowerShell)

1. Copy `server/.env.example` to `server/.env`.
2. Replace the MongoDB values in `server/.env` with your Atlas connection details.
3. Start the backend:

```powershell
cd server
npm install
npm run dev
```

4. Open a second terminal and start the frontend:

```powershell
cd client
npm install
npm run dev
```

5. Open `http://localhost:5173`, create an account, and add your first trip.

If your MongoDB password contains `@`, `#`, `%` or `/`, URL-encode it. Never upload `server/.env` or `node_modules` to GitHub.

## Completed API

| Method | Route | Access |
|---|---|---|
| POST | `/api/auth/register` | Public |
| POST | `/api/auth/login` | Public |
| GET | `/api/auth/me` | Private |
| POST | `/api/trips` | Private |
| GET | `/api/trips` | Private |
| GET | `/api/trips/:id` | Private, owner only |
| PUT | `/api/trips/:id` | Private, owner only |
| DELETE | `/api/trips/:id` | Private, owner only |
=======
# Tripvault-week-2_CodeGen
>>>>>>> 6feb1426d0b637b7a6e67873ab56b56737499bdf
