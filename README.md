# 🗺️ TripVault

A full-stack MERN travel-journaling app where users can log their trips, attach photos, and share a public profile showcasing their travel history — no login required to view.

Built as part of the **CodGen Virtual Internship Program (Full Stack MERN)**.

---

## ✨ Features

### Trip Management
- Create, edit, and delete personal trips
- Track title, destination, dates, and rating

### 📸 Photo Uploads *(New in Week 3)*
- Upload a cover image and multiple trip photos via **Cloudinary**
- Image previews on Create/Edit Trip forms
- Cover image displayed on each trip card
- Full photo grid on the trip detail page

### 👤 Public Profiles *(New in Week 3)*
- Public, no-login profile page at `/profile/:username`
- Displays name, bio, and a grid of the user's trips
- Users can edit their own bio from the dashboard
- Sensitive fields (email, password) are never exposed on public routes

---

## 🛠️ Tech Stack

**Frontend:** React, Axios
**Backend:** Node.js, Express
**Database:** MongoDB (Mongoose)
**Media Storage:** Cloudinary
**File Handling:** Multer, multer-storage-cloudinary
**Auth:** JWT

---

## 📁 Project Structure

```
tripvault/
├── client/                 # React frontend
│   └── src/
│       ├── components/
│       ├── pages/
│       │   └── Profile/    # Public profile page
│       └── ...
├── server/                 # Express backend
│   ├── middleware/
│   │   └── upload.js       # Multer + Cloudinary config
│   ├── models/
│   │   ├── Trip.js
│   │   └── User.js
│   ├── routes/
│   │   ├── tripRoutes.js
│   │   └── userRoutes.js
│   ├── controllers/
│   └── .env                # Not committed — see below
└── README.md
```

---

## 🔌 API Routes

| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| POST | `/api/trips` | Yes | Create a new trip |
| GET | `/api/trips` | Yes | Get logged-in user's trips |
| PUT | `/api/trips/:id` | Yes | Update a trip |
| DELETE | `/api/trips/:id` | Yes | Delete a trip |
| **POST** | **`/api/trips/:id/upload`** | **Yes** | **Upload a photo, attach Cloudinary URL to trip** |
| **GET** | **`/api/users/:username/profile`** | **No** | **Public profile — user info + all their trips** |
| **PUT** | **`/api/users/profile`** | **Yes** | **Update logged-in user's bio or username** |

> Public routes explicitly `.select()` only safe fields — email and password are never returned.

---

## ⚙️ Setup & Installation

### 1. Clone the repository
```bash
git clone https://github.com/<your-username>/tripvault.git
cd tripvault
```

### 2. Install dependencies
```bash
# Backend
cd server
npm install

# Frontend
cd ../client
npm install
```

### 3. Configure environment variables
Create a `.env` file inside `/server`:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

> Get your Cloudinary credentials by creating a free account at [cloudinary.com](https://cloudinary.com).

### 4. Run the app
```bash
# From /server
npm run dev

# From /client (in a separate terminal)
npm start
```

The backend runs on `http://localhost:5000` and the frontend on `http://localhost:3000`.

---

## 🔒 Security Notes

- Cloudinary credentials are stored only in `.env` (excluded via `.gitignore`) — never hardcoded or committed
- The public profile route uses explicit field selection to guarantee `email` and `password` are never exposed
- File uploads are size-limited via Multer to prevent oversized uploads

---

## 🚀 Roadmap

- [x] Week 1 — Core trip CRUD
- [x] Week 2 — Auth & user accounts
- [x] Week 3 — Photo uploads (Cloudinary) & public profiles
- [ ] Week 4 — Polish, testing & deployment

---

## 👤 Author

Built by [Deepak katwa] as part of the TripVault Virtual Internship Program (CodGen).
