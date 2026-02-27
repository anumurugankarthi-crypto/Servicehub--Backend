const express = require("express");
const router = express.Router();
const {
  createPartner,
  getAllPartners,
} = require("../Controllers/PartnerController");

router.post("/", createPartner);
router.get("/", getAllPartners);

module.exports = router;