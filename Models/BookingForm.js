const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

    // ── Personal Details (matches BookNow.jsx field names) ─────────────────
    fullName: { type: String },   // BookNow sends "fullName"
    phoneNumber: { type: String },   // BookNow sends "phoneNumber"
    email: { type: String },

    // ── Legacy / alternate field names (kept for backwards compatibility) ──
    name: { type: String },         // some older forms send "name"
    phone: { type: String },         // some older forms send "phone"

    // ── Service ────────────────────────────────────────────────────────────
    serviceCategory: { type: String }, // BookNow sends "serviceCategory"
    serviceType: { type: String }, // BookNow sends "serviceType"
    service: { type: String }, // legacy field name fallback
    subService: { type: String },
    amount: { type: Number },

    // ── Booking Type & Schedule ────────────────────────────────────────────
    bookingType: { type: String, default: "instant" }, // "instant" | "prebooking"
    preferredDate: { type: String },
    preferredTime: { type: String }, // BookNow sends "preferredTime"
    ampm: { type: String },
    date: { type: String }, // legacy fallback
    time: { type: String }, // legacy fallback

    // ── Address ────────────────────────────────────────────────────────────
    fullAddress: { type: String }, // BookNow sends "fullAddress"
    address: { type: String }, // legacy fallback
    city: { type: String },
    pincode: { type: String },

    // ── Map Location ───────────────────────────────────────────────────────
    location: {
      address: { type: String },
      coordinates: {
        lat: { type: Number },
        lng: { type: Number },
      },
      googleMapsLink: { type: String },
    },
    cancelledBy: {
      type: String,
      enum: ["user", "admin", null],
      default: null,
    },
    // ── Extra ──────────────────────────────────────────────────────────────
    additionalMessage: { type: String }, // BookNow sends "additionalMessage"
    notes: { type: String }, // legacy fallback

    // ── Admin-managed fields ───────────────────────────────────────────────
    // NOTE: "pending" is lowercase to match what the frontend sends naturally.
    // The admin dashboard uses "Pending" (capital) — both are listed in the enum.
    status: {
      type: String,
      enum: ["pending", "completed", "cancelled"],
      default: "pending",
    },

    assignedProvider: {
      id: { type: mongoose.Schema.Types.ObjectId, ref: "Partner" },
      name: { type: String, default: "" },
      phone: { type: String, default: "" },
    },
  },
  { timestamps: true }
);

// ── Virtual: normalised status for display ──────────────────────────────────
// Ensures "pending" and "Pending" both display as "Pending" in admin
bookingSchema.virtual("statusDisplay").get(function () {
  const s = this.status || "pending";
  return s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();
});

module.exports = mongoose.model("Booking", bookingSchema);