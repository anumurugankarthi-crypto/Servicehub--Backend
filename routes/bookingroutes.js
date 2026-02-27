const express = require("express");
const {
  createBooking,
  getAllBookings,
  getBookingById,
  myBookings,
  updateBookingStatus,               // ✅ ADD THIS
} = require("../Controllers/BookingController");

const authMiddleware = require("../middleware/authmiddleware"); // ✅ ADD THIS

const router = express.Router();

// CREATE booking (user must be logged in)
router.post("/", authMiddleware, createBooking);

// GET logged-in user's bookings (PROFILE PAGE)
router.get("/my-bookings", authMiddleware, myBookings);

// ADMIN / ALL BOOKINGS
router.get("/", getAllBookings);

// SINGLE booking
router.get("/:id", getBookingById);
router.patch("/:id/status", authMiddleware, updateBookingStatus);



module.exports = router;