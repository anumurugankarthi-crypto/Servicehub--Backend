const Partner = require("../Models/PartnerForm");
const {
  sendPartnerConfirmationEmail,
  sendAdminNotificationEmail,
} = require("../Controllers/Emailservice");

exports.createPartner = async (req, res) => {
  try {
    const partner = new Partner(req.body);
    await partner.save();

    // Send emails (non-blocking — don't let email failure break the response)
    const emailPromises = [];

    if (req.body.email) {
      emailPromises.push(
        sendPartnerConfirmationEmail(req.body.email, req.body.name)
      );
    }

    emailPromises.push(sendAdminNotificationEmail(req.body));

    // Fire emails and catch errors independently so DB save always succeeds
    Promise.allSettled(emailPromises).then((results) => {
      results.forEach((result, i) => {
        if (result.status === "rejected") {
          console.error(`Email ${i + 1} failed:`, result.reason);
        }
      });
    });

    res.status(201).json({
      success: true,
      message: "Partner application submitted successfully",
      data: partner,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to submit application",
    });
  }
};

exports.getAllPartners = async (req, res) => {
  try {
    const partners = await Partner.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: partners.length,
      data: partners,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch partners",
    });
  }
};