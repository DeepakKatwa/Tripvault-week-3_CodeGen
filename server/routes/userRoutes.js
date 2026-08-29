const express = require("express");

const router = express.Router();

const protect = require("../middleware/auth");

const {
  getPublicProfile,
  updateProfile,
} = require("../controllers/userController");

// ==========================================
// WEEK 3 - PUBLIC PROFILE
// GET /api/users/:username/profile
// No login required
// ==========================================

router.get(
  "/:username/profile",
  getPublicProfile
);

// ==========================================
// WEEK 3 - UPDATE OWN PROFILE
// PUT /api/users/profile
// Login required
// ==========================================

router.put(
  "/profile",
  protect,
  updateProfile
);

module.exports = router;