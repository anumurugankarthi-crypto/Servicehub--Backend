const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const { verifyAdminToken } = require("../middleware/adminauth");
const Booking = require("../Models/BookingForm");
const Partner = require("../Models/PartnerForm");

const ADMIN_EMAIL    = "servicehubadmin@gmail.com";
const ADMIN_PASSWORD = "servicehub@123";

// ── POST /api/admin/login ─────────────────────────────────────────────────────
router.post("/login", (req, res) => {
  const { email, password } = req.body;
  if (email !== ADMIN_EMAIL || password !== ADMIN_PASSWORD) {
    return res.status(401).json({ success: false, message: "Invalid admin credentials" });
  }
  const token = jwt.sign(
    { role: "admin", email: ADMIN_EMAIL },
    process.env.JWT_SECRET || "servicehub_secret_key",
    { expiresIn: "8h" }
  );
  res.json({ success: true, token });
});

// ── GET /api/admin/bookings ───────────────────────────────────────────────────
router.get("/bookings", verifyAdminToken, async (req, res) => {
  try {
    const bookings = await Booking.find().sort({ createdAt: -1 });
    res.json({ success: true, count: bookings.length, data: bookings });
  } catch {
    res.status(500).json({ success: false, message: "Failed to fetch bookings" });
  }
});

// ── PATCH /api/admin/bookings/:id/status ─────────────────────────────────────
router.patch("/bookings/:id/status", verifyAdminToken, async (req, res) => {
  try {
    const { status } = req.body;

    // Accept both capitalised (from admin UI) and lowercase variants
    const validStatuses = ["Pending", "Completed", "Cancelled", "pending", "completed", "cancelled"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: `Invalid status: "${status}"` });
    }

    // Normalise to capitalised form for storage
    const normalised = status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();

    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status: normalised },
      { new: true }
    );
    if (!booking)
      return res.status(404).json({ success: false, message: "Booking not found" });

    res.json({ success: true, data: booking });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to update status", error: err.message });
  }
});

// ── PATCH /api/admin/bookings/:id/assign-provider ────────────────────────────
router.patch("/bookings/:id/assign-provider", verifyAdminToken, async (req, res) => {
  try {
    const { providerId, providerName, providerPhone } = req.body;
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { assignedProvider: { id: providerId, name: providerName, phone: providerPhone } },
      { new: true }
    );
    if (!booking)
      return res.status(404).json({ success: false, message: "Booking not found" });
    res.json({ success: true, data: booking });
  } catch {
    res.status(500).json({ success: false, message: "Failed to assign provider" });
  }
});

// ── GET /api/admin/partners ───────────────────────────────────────────────────
router.get("/partners", verifyAdminToken, async (req, res) => {
  try {
    const partners = await Partner.find().sort({ createdAt: -1 });
    res.json({ success: true, count: partners.length, data: partners });
  } catch {
    res.status(500).json({ success: false, message: "Failed to fetch partners" });
  }
});

module.exports = router;