const express = require("express");
const Reviews = require("../Models/Reviews");
const User = require("../Models/User"); // ✅ IMPORT USER
const authmiddleware = require("../middleware/authmiddleware");

const router = express.Router();

/* ADD REVIEW */
router.post("/", authmiddleware, async (req, res) => {
  try {
    const { serviceId, rating, comment, userName } = req.body;

    if (!serviceId || !rating || !comment || !userName) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const user = await User.findById(req.user.id).select("name");

const review = new Reviews({
  serviceId,
  rating,
  comment,
  userId: req.user.id,
  userName: user.name,
});
    await review.save();
    res.status(201).json(review);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Review submission failed" });
  }
});

/* GET REVIEWS */
router.get("/:serviceId", async (req, res) => {
  try {
    const reviews = await Reviews.find({
      serviceId: req.params.serviceId,
    }).sort({ createdAt: -1 });

    res.json(reviews);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch reviews" });
  }
});

module.exports = router;