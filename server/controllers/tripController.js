const Trip = require("../models/Trip");

// @desc    Create a new trip for the logged-in user
// @route   POST /api/trips
// @access  Private
const createTrip = async (req, res) => {
  try {
    const {
      title,
      destination,
      startDate,
      endDate,
      description,
      rating,
    } = req.body;

    if (!title?.trim() || !destination?.trim() || !startDate || !endDate) {
      return res.status(400).json({
        message:
          "Title, destination, start date and end date are required",
      });
    }

    if (new Date(endDate) < new Date(startDate)) {
      return res.status(400).json({
        message: "End date cannot be before start date",
      });
    }

    const trip = await Trip.create({
      title: title.trim(),
      destination: destination.trim(),
      startDate,
      endDate,
      description,
      rating,
      user: req.user.id,
    });

    res.status(201).json(trip);
  } catch (err) {
    res
      .status(err.name === "ValidationError" ? 400 : 500)
      .json({
        message: err.message || "Failed to create trip",
      });
  }
};

// @desc    Get all trips belonging to the logged-in user
// @route   GET /api/trips
// @access  Private
const getTrips = async (req, res) => {
  try {
    const trips = await Trip.find({
      user: req.user.id,
    }).sort({ createdAt: -1 });

    res.status(200).json(trips);
  } catch (err) {
    res.status(500).json({
      message: "Failed to fetch trips",
      error: err.message,
    });
  }
};

// @desc    Get a single trip by ID
// @route   GET /api/trips/:id
// @access  Private
const getTripById = async (req, res) => {
  try {
    const trip = await Trip.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!trip) {
      return res.status(404).json({
        message: "Trip not found",
      });
    }

    res.status(200).json(trip);
  } catch (err) {
    res
      .status(err.name === "CastError" ? 404 : 500)
      .json({
        message:
          err.name === "CastError"
            ? "Trip not found"
            : "Failed to fetch trip",
      });
  }
};

// @desc    Update a trip
// @route   PUT /api/trips/:id
// @access  Private
const updateTrip = async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id);

    if (!trip) {
      return res.status(404).json({
        message: "Trip not found",
      });
    }

    if (trip.user.toString() !== req.user.id) {
      return res.status(403).json({
        message: "Not authorized to update this trip",
      });
    }

    const {
      title,
      destination,
      startDate,
      endDate,
      description,
      rating,
    } = req.body;

    const nextStart = startDate ?? trip.startDate;
    const nextEnd = endDate ?? trip.endDate;

    if (new Date(nextEnd) < new Date(nextStart)) {
      return res.status(400).json({
        message: "End date cannot be before start date",
      });
    }

    if (title !== undefined && !title.trim()) {
      return res.status(400).json({
        message: "Title cannot be empty",
      });
    }

    if (destination !== undefined && !destination.trim()) {
      return res.status(400).json({
        message: "Destination cannot be empty",
      });
    }

    trip.title = title?.trim() ?? trip.title;
    trip.destination =
      destination?.trim() ?? trip.destination;
    trip.startDate = startDate ?? trip.startDate;
    trip.endDate = endDate ?? trip.endDate;
    trip.description =
      description ?? trip.description;
    trip.rating = rating ?? trip.rating;

    const updatedTrip = await trip.save();

    res.status(200).json(updatedTrip);
  } catch (err) {
    res
      .status(err.name === "CastError" ? 404 : 400)
      .json({
        message:
          err.name === "CastError"
            ? "Trip not found"
            : err.message,
      });
  }
};

// @desc    Delete a trip
// @route   DELETE /api/trips/:id
// @access  Private
const deleteTrip = async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id);

    if (!trip) {
      return res.status(404).json({
        message: "Trip not found",
      });
    }

    if (trip.user.toString() !== req.user.id) {
      return res.status(403).json({
        message: "Not authorized to delete this trip",
      });
    }

    await trip.deleteOne();

    res.status(200).json({
      message: "Trip deleted successfully",
      id: req.params.id,
    });
  } catch (err) {
    res
      .status(err.name === "CastError" ? 404 : 500)
      .json({
        message:
          err.name === "CastError"
            ? "Trip not found"
            : "Failed to delete trip",
      });
  }
};

// ========================================
// WEEK 3 - Upload Trip Photo
// ========================================

// @desc    Upload a photo to a trip
// @route   POST /api/trips/:id/upload
// @access  Private
const uploadTripPhoto = async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id);

    if (!trip) {
      return res.status(404).json({
        message: "Trip not found",
      });
    }

    // Make sure this trip belongs to logged-in user
    if (trip.user.toString() !== req.user.id) {
      return res.status(403).json({
        message: "Not authorized to upload photos to this trip",
      });
    }

    // Multer/Cloudinary did not receive an image
    if (!req.file) {
      return res.status(400).json({
        message: "Please select an image",
      });
    }

    // CloudinaryStorage normally provides the uploaded URL here
    const imageUrl = req.file.path;

    if (!imageUrl) {
      return res.status(500).json({
        message: "Image upload failed",
      });
    }

    // Add image to photo gallery
    trip.photos.push(imageUrl);

    // Use the first uploaded image as the trip cover
    if (!trip.coverImage) {
      trip.coverImage = imageUrl;
    }

    const updatedTrip = await trip.save();

    res.status(200).json({
      message: "Photo uploaded successfully",
      imageUrl,
      trip: updatedTrip,
    });
  } catch (err) {
    console.error("Trip photo upload error:", err);

    if (err.name === "CastError") {
      return res.status(404).json({
        message: "Trip not found",
      });
    }

    res.status(500).json({
      message: err.message || "Failed to upload photo",
    });
  }
};

module.exports = {
  createTrip,
  getTrips,
  getTripById,
  updateTrip,
  deleteTrip,
  uploadTripPhoto,
};