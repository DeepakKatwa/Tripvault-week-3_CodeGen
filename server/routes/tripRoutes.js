const express = require('express');
const router = express.Router();
const protect = require('../middleware/auth');
const {
  createTrip,
  getTrips,
  getTripById,
  updateTrip,
  deleteTrip,
} = require('../controllers/tripController');

// All trip routes require a valid JWT
router.post('/', protect, createTrip);
router.get('/', protect, getTrips);
router.get('/:id', protect, getTripById);
router.put('/:id', protect, updateTrip);
router.delete('/:id', protect, deleteTrip);

module.exports = router;
