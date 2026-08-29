const express = require("express");
const router = express.Router();

const protect = require("../middleware/auth");
const upload = require("../middleware/upload");

const {
  createTrip,
  getTrips,
  getTripById,
  updateTrip,
  deleteTrip,
  uploadTripPhoto,
} = require("../controllers/tripController");

// Create trip
router.post("/", protect, createTrip);

// Get all logged-in user's trips
router.get("/", protect, getTrips);

// Get one trip
router.get("/:id", protect, getTripById);

// Update trip
router.put("/:id", protect, updateTrip);

// Delete trip
router.delete("/:id", protect, deleteTrip);

// Week 3 - Upload trip photo to Cloudinary
router.post(
  "/:id/upload",
  protect,
  upload.single("image"),
  uploadTripPhoto
);

module.exports = router;