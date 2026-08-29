TripVault — Week 3

TripVault is a MERN stack travel planning application developed as part of the CodGen Virtual Internship Program.

Week 3 Theme

Photo Uploads & Public Profiles

Week 3 focuses on adding cloud-based photo uploads using Cloudinary and building public traveller profile pages that can be viewed without login. These are the two main features required for Week 3.

Tech Stack

React

Node.js

Express.js

MongoDB

Cloudinary

Multer

Axios

JWT Authentication

Week 3 Features

1. Photo Uploads with Cloudinary

Users can upload photos for their trips.

Implemented features:

Cloudinary account and backend configuration

Multer file upload middleware

multer-storage-cloudinary integration

coverImage field added to the Trip model

photos array added to the Trip model

Upload API route:

POST /api/trips/:id/upload

Image upload from Create Trip form

Image upload from Edit Trip form

Image preview before upload

Trip cover image displayed on dashboard trip cards

Uploaded photo count displayed on trip cards

Single trip detail page

Photo grid showing uploaded trip photos

File-size limit for uploaded images

2. Public User Profiles

Users now have public traveller profiles.

Implemented features:

Unique username field added to User model

Bio field added to User model

Public profile API:

GET /api/users/:username/profile

Public profile does not expose email, password, or sensitive information

React public profile page:

/profile/:username

Public profile works without login

Profile page displays:

Traveller name

Username

Bio

Public trip cards

Destination

Dates

Rating

Cover image

My Profile button added to dashboard

Edit Profile option added

Users can update name, username, and bio

Profile update API:

PUT /api/users/profile

Public profile tested successfully in Incognito mode

Week 3 API Routes

Method

Route

Authentication

Description

POST

/api/trips/:id/upload

Required

Upload a photo and attach its Cloudinary URL to a trip

GET

/api/users/:username/profile

Not Required

View a traveller's public profile and trips

PUT

/api/users/profile

Required

Update the logged-in user's profile

Backend Packages Added

npm install multer cloudinary multer-storage-cloudinary

Environment Variables

Create a .env file inside the server folder.

PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

CLIENT_URL=http://localhost:5173

Never commit the real .env file or expose MongoDB, JWT, or Cloudinary credentials in GitHub.

Project Structure

tripvault/
├── client/
│   ├── src/
│   │   ├── api/
│   │   ├── components/
│   │   ├── pages/
│   │   │   ├── AuthPage.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Documents.jsx
│   │   │   ├── Memories.jsx
│   │   │   ├── TripDetails.jsx
│   │   │   ├── Profile.jsx
│   │   │   └── EditProfile.jsx
│   │   ├── services/
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── package.json
│
├── server/
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── tripController.js
│   │   └── userController.js
│   ├── middleware/
│   │   ├── auth.js
│   │   └── upload.js
│   ├── models/
│   │   ├── User.js
│   │   └── Trip.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── tripRoutes.js
│   │   └── userRoutes.js
│   ├── .env
│   └── server.js
│
├── .gitignore
└── README.md

How to Run the Project

Backend

Open a terminal:

cd server
npm install
npm run dev

The backend runs at:

http://localhost:5000

Frontend

Open another terminal:

cd client
npm install
npm run dev

The frontend runs at:

http://localhost:5173

Testing the Public Profile

Login to TripVault.

Open Edit Profile.

Add or update the username and bio.

Save the profile.

Open My Profile.

Copy the public profile URL.

Open an Incognito browser window.

Paste the full profile URL, for example:

http://localhost:5173/profile/your_username

The public profile should open without login.

Week 3 Deliverables Status

Cloudinary setup

Upload middleware

Trip model updated

Photo upload route

Photo upload UI

Image preview

Trip card cover images

Trip detail photo grid

User model updated with username and bio

Public profile API

Public profile React page

Edit Profile

My Profile dashboard link

Public profile tested without authentication

Security

Passwords are never returned in public profile responses.

Email is not exposed on public profiles.

Cloudinary and MongoDB credentials are stored only in .env.

Protected routes use JWT authentication.

Uploads are restricted by file size and supported image formats.

Week 3 Status

Week 3 Development: Completed ✅

The Week 3 requirements for Photo Uploads and Public Profiles have been implemented and tested successfully.
