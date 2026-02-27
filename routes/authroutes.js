const express = require("express");
const router = express.Router();
const { register, login, getProfile, updateProfile } = require("../Controllers/authcontroller");
const authMiddleware = require("../middleware/authmiddleware");

// existing routes (UNCHANGED)
router.post("/register", register);
router.post("/login", login);

// PROFILE ROUTES (SAFE)
router.get("/profile", authMiddleware, getProfile);
router.put("/profile", authMiddleware, updateProfile);

module.exports = router;