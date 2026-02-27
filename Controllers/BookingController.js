const Booking = require("../Models/BookingForm");
const { sendBookingConfirmationEmail } = require("../Controllers/Emailservice");
const { Router } = require("express");

// ── CREATE BOOKING ────────────────────────────────────────────────────────────
exports.createBooking = async (req, res) => {
  try {
    const body = req.body;
    // ✅ ADD THIS (instant booking date auto-fill)
    // Get today's date in YYYY-MM-DD format
const today = new Date().toISOString().split("T")[0];

// If instant booking and no date provided → use today
if (body.bookingType === "instant") {
  body.preferredDate = today;
  body.date = today;
}

    const bookingData = {
      ...body, userId: req.user.id, status: "pending",
      fullName: body.fullName || body.name || "",
      name: body.name || body.fullName || "",
      phoneNumber: body.phoneNumber || body.phone || body.mobile || "",
      phone: body.phone || body.phoneNumber || body.mobile || "",
      email: body.email || body.emailAddress || "",
      serviceCategory: body.serviceCategory || body.service || body.serviceName || "",
      serviceType: body.serviceType || body.subService || "",
      service: body.service || body.serviceCategory || body.serviceName || "",
      // ✅ instant booking date auto-filled
     preferredDate: body.preferredDate || "",
      date: body.date || "",
      preferredTime: body.preferredTime || body.time || "",
      time: body.time || body.preferredTime || "",
      fullAddress: body.fullAddress || body.address || "",
      address: body.address || body.fullAddress || "",
      additionalMessage: body.additionalMessage || body.notes || "",
      notes: body.notes || body.additionalMessage || "",
    };
    const booking = await Booking.create(bookingData);
    sendBookingConfirmationEmail(booking).catch((err) => console.error("Email notification error:", err.message));
    res.status(201).json({
      success: true, message: "Booking created successfully", data: booking,
    });
  }
  catch (error) {
    console.error
      ("Booking creation error:",
        error.message);
    res.status(400).json({ success: false, message: "Booking creation failed", error: error.message, });
  }
};
// ── GET ALL BOOKINGS 
exports.getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: bookings.length,
      data: bookings,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch bookings" });
  }
};

// ── GET SINGLE BOOKING 
exports.getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking)
      return res.status(404).json({ message: "Booking not found" });
    res.status(200).json({ success: true, data: booking });
  } catch (error) {
    res.status(400).json({ message: "Invalid booking ID" });
  }
};

// ── GET LOGGED-IN USER'S BOOKINGS 
exports.myBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: bookings.length,
      data: bookings,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch user bookings" });
  }
};
// In your booking controller — updateStatus handler
// Replace your existing PATCH /:id/status handler with this:

exports.updateBookingStatus = async (req, res) => {
  try {
    const { status, cancelledBy } = req.body;

    const updateFields = { status };

    // ✅ Save who cancelled — "user" or "admin"
    if (status === "cancelled" || status === "Cancelled") {
      updateFields.cancelledBy = cancelledBy || "admin";
    } else {
      // ✅ Clear cancelledBy if status is reset away from cancelled
      updateFields.cancelledBy = "";
    }

const booking = await Booking.findByIdAndUpdate(
  req.params.id,
  { $set: updateFields },
  { new: true }
);

    if (!booking) {
      return res.status(404).json({ success: false, message: "Booking not found" });
    }

    res.status(200).json({ success: true, data: booking });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Failed to update status" });
  }
};