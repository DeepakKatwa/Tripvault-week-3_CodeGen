const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./routes/authRoutes");
const tripRoutes = require("./routes/tripRoutes");
const userRoutes = require("./routes/userRoutes");

const app = express();

// ==========================================
// MIDDLEWARE
// ==========================================

app.use(
  cors({
    origin:
      process.env.CLIENT_URL ||
      "http://localhost:5173",
  })
);

app.use(
  express.json({
    limit: "1mb",
  })
);

// ==========================================
// HEALTH CHECK
// ==========================================

app.get("/api/health", (_req, res) => {
  res.json({
    message:
      "TripVault API is running",
  });
});

// ==========================================
// ROUTES
// ==========================================

app.use(
  "/api/auth",
  authRoutes
);

app.use(
  "/api/trips",
  tripRoutes
);

// Week 3 - Public profile routes
app.use(
  "/api/users",
  userRoutes
);

// ==========================================
// 404
// ==========================================

app.use((_req, res) => {
  res.status(404).json({
    message: "Route not found",
  });
});

// ==========================================
// GLOBAL ERROR HANDLER
// ==========================================

app.use(
  (err, _req, res, _next) => {
    console.error(err);

    res.status(500).json({
      message:
        "Internal server error",
    });
  }
);

// ==========================================
// SERVER
// ==========================================

const PORT =
  process.env.PORT || 5000;

const startServer = async () => {
  if (
    !process.env.MONGO_URI ||
    !process.env.JWT_SECRET
  ) {
    console.error(
      "MONGO_URI and JWT_SECRET are required. Copy .env.example to .env."
    );

    process.exit(1);
  }

  await mongoose.connect(
    process.env.MONGO_URI
  );

  console.log(
    "MongoDB connected successfully"
  );

  app.listen(PORT, () => {
    console.log(
      `Server running at http://localhost:${PORT}`
    );
  });
};

startServer().catch(
  (error) => {
    console.error(
      "Server startup failed:",
      error.message
    );

    process.exit(1);
  }
);