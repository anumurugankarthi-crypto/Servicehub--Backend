const nodemailer = require("nodemailer");

// ── Set in your .env:
// ADMIN_EMAIL=anumurugankarthi@gmail.com
// EMAIL_PASS=your_gmail_app_password
// Generate app password at: https://myaccount.google.com/apppasswords

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "anu9361000@gmail.com";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: ADMIN_EMAIL,
    pass: process.env.EMAIL_PASS,
  },
});

const sendBookingConfirmationEmail = async (booking) => {
  const { name, email, phone, service, subService, date, time, address, city, pincode, amount, notes, _id } = booking;
  const bookingId = _id?.toString()?.slice(-8).toUpperCase() || "N/A";

  const userHtml = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8"/>
  <style>
    *{margin:0;padding:0;box-sizing:border-box}
    body{font-family:'Segoe UI',Arial,sans-serif;background:#f0f2f5}
    .wrap{max-width:600px;margin:30px auto;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 8px 30px rgba(0,0,0,0.1)}
    .hdr{background:linear-gradient(135deg,#f9b233 0%,#e6960f 100%);padding:36px 40px;text-align:center}
    .hdr h1{color:#fff;font-size:28px;font-weight:800;letter-spacing:-0.5px}
    .hdr p{color:rgba(255,255,255,0.85);font-size:14px;margin-top:6px}
    .badge{display:inline-block;background:rgba(255,255,255,0.22);color:#fff;padding:5px 16px;border-radius:20px;font-size:11px;font-weight:700;letter-spacing:1.5px;margin-top:12px;text-transform:uppercase}
    .tick{width:56px;height:56px;background:rgba(255,255,255,0.2);border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:28px;margin:0 auto 16px}
    .body{padding:36px 40px}
    .greeting{font-size:20px;font-weight:700;color:#1a1a2e;margin-bottom:8px}
    .sub{color:#666;font-size:14px;line-height:1.7;margin-bottom:28px}
    .sec-label{font-size:10px;font-weight:800;color:#f9b233;text-transform:uppercase;letter-spacing:2px;margin-bottom:12px}
    .service-card{background:linear-gradient(135deg,#fff8e7,#fff3cc);border:2px solid #f9b233;border-radius:14px;padding:22px;margin-bottom:24px}
    .svc-name{font-size:20px;font-weight:800;color:#1a1a2e}
    .svc-sub{color:#888;font-size:13px;margin-top:4px}
    .amount{font-size:26px;font-weight:800;color:#f9b233}
    .pill{display:inline-block;background:#fff3cd;color:#856404;padding:5px 14px;border-radius:20px;font-size:12px;font-weight:700;margin-top:6px}
    .details{background:#fafafa;border:1px solid #eee;border-radius:12px;overflow:hidden;margin-bottom:24px}
    .drow{display:flex;justify-content:space-between;align-items:center;padding:13px 18px;border-bottom:1px solid #f0f0f0}
    .drow:last-child{border-bottom:none}
    .dl{color:#999;font-size:13px}
    .dv{color:#1a1a2e;font-size:13px;font-weight:600;text-align:right;max-width:58%}
    .infobox{background:#e8f5fe;border-left:4px solid #2196f3;border-radius:0 10px 10px 0;padding:15px 18px;font-size:13px;color:#1565c0;line-height:1.6;margin-bottom:24px}
    .footer{background:#1a1a2e;padding:24px 40px;text-align:center}
    .f-brand{color:#f9b233;font-size:16px;font-weight:800;margin-bottom:6px}
    .f-text{color:rgba(255,255,255,0.45);font-size:12px;line-height:1.8}
  </style>
</head>
<body>
  <div class="wrap">
    <div class="hdr">
      <div class="tick">✅</div>
      <h1>Booking Confirmed!</h1>
      <p>Thank you for choosing ServiceHub</p>
      <div class="badge">Booking #${bookingId}</div>
    </div>
    <div class="body">
      <p class="greeting">Hello, ${name || "Valued Customer"}! 👋</p>
      <p class="sub">Your service booking has been <strong>successfully received</strong>. Our team will contact you shortly to confirm the schedule and assign a verified service provider to your location.</p>

      <p class="sec-label">Service Booked</p>
      <div class="service-card">
        <table width="100%"><tr>
          <td><div class="svc-name">${service || "N/A"}</div>${subService ? `<div class="svc-sub">${subService}</div>` : ""}</td>
          <td style="text-align:right"><div class="amount">${amount ? `₹${amount}` : "—"}</div><div><span class="pill">⏳ Pending Confirmation</span></div></td>
        </tr></table>
      </div>

      <p class="sec-label">Booking Details</p>
      <div class="details">
        <div class="drow"><span class="dl">📅 Preferred Date</span><span class="dv">${date || "To be confirmed"}</span></div>
        <div class="drow"><span class="dl">🕐 Preferred Time</span><span class="dv">${time || "To be confirmed"}</span></div>
        <div class="drow"><span class="dl">📍 Service Address</span><span class="dv">${[address, city, pincode].filter(Boolean).join(", ") || "N/A"}</span></div>
        <div class="drow"><span class="dl">📞 Contact Phone</span><span class="dv">${phone || "N/A"}</span></div>
        ${notes ? `<div class="drow"><span class="dl">📝 Special Notes</span><span class="dv">${notes}</span></div>` : ""}
      </div>

      <div class="infobox">ℹ️ A ServiceHub representative will call you on <strong>${phone || "your registered number"}</strong> to confirm the exact schedule and assign the best provider near you.</div>
      <p style="color:#aaa;font-size:12px;line-height:1.8">For queries, reply to this email or reach us at <strong>${ADMIN_EMAIL}</strong>.</p>
    </div>
    <div class="footer">
      <div class="f-brand">🛠 ServiceHub</div>
      <div class="f-text">Connecting you with trusted home service professionals<br/>© ${new Date().getFullYear()} ServiceHub. All rights reserved.</div>
    </div>
  </div>
</body>
</html>`;

  const adminHtml = `<!DOCTYPE html>
<html>
<head>
  <style>
    body{font-family:'Segoe UI',Arial,sans-serif;background:#f0f2f5;margin:0}
    .wrap{max-width:600px;margin:30px auto;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 4px 20px rgba(0,0,0,0.08)}
    .hdr{background:#1a1a2e;padding:28px 36px;border-bottom:3px solid #f9b233}
    .hdr h2{color:#f9b233;margin:0;font-size:20px;font-weight:800}
    .hdr p{color:rgba(255,255,255,0.55);font-size:13px;margin-top:4px}
    .body{padding:28px 36px}
    .row{display:flex;justify-content:space-between;padding:11px 0;border-bottom:1px solid #f5f5f5;font-size:14px}
    .row:last-child{border-bottom:none}
    .lbl{color:#aaa}
    .val{font-weight:600;color:#1a1a2e;text-align:right;max-width:60%}
    .alert{background:#fff8e7;border:1px solid #f9b233;border-radius:10px;padding:16px 18px;margin-top:20px;font-size:13px;color:#7d5a00;line-height:1.6}
    .id-badge{display:inline-block;background:#1a1a2e;color:#f9b233;padding:3px 12px;border-radius:6px;font-size:13px;font-weight:700;font-family:monospace}
  </style>
</head>
<body>
  <div class="wrap">
    <div class="hdr">
      <h2>🔔 New Booking Received</h2>
      <p>A new service booking has been placed on ServiceHub — action required</p>
    </div>
    <div class="body">
      <div class="row"><span class="lbl">Booking ID</span><span class="val"><span class="id-badge">#${bookingId}</span></span></div>
      <div class="row"><span class="lbl">Customer Name</span><span class="val">${name || "N/A"}</span></div>
      <div class="row"><span class="lbl">Email</span><span class="val">${email || "N/A"}</span></div>
      <div class="row"><span class="lbl">Phone</span><span class="val">${phone || "N/A"}</span></div>
      <div class="row"><span class="lbl">Service</span><span class="val">${service || "N/A"}${subService ? ` — ${subService}` : ""}</span></div>
      <div class="row"><span class="lbl">Preferred Date</span><span class="val">${date || "N/A"}</span></div>
      <div class="row"><span class="lbl">Preferred Time</span><span class="val">${time || "N/A"}</span></div>
      <div class="row"><span class="lbl">Location</span><span class="val">${[address, city, pincode].filter(Boolean).join(", ") || "N/A"}</span></div>
      <div class="row"><span class="lbl">Amount</span><span class="val">${amount ? `₹${amount}` : "N/A"}</span></div>
      ${notes ? `<div class="row"><span class="lbl">Notes</span><span class="val">${notes}</span></div>` : ""}
      <div class="alert">⚡ <strong>Action Required:</strong> Please log into the admin dashboard to assign a service provider and confirm this booking.</div>
    </div>
  </div>
</body>
</html>`;

  // Send to user
  if (email) {
    await transporter.sendMail({
      from: `"ServiceHub" <${ADMIN_EMAIL}>`,
      to: email,
      subject: `✅ Booking Confirmed — ${service || "Service"} | ServiceHub (#${bookingId})`,
      html: userHtml,
    });
  }

  // Send to admin
  await transporter.sendMail({
    from: `"ServiceHub Bookings" <${ADMIN_EMAIL}>`,
    to: ADMIN_EMAIL,
    subject: `🔔 New Booking #${bookingId} — ${service || "Service"} from ${name || "User"}`,
    html: adminHtml,
  });
};

const sendPartnerConfirmationEmail = async (partnerEmail, partnerName) => {
  const mailOptions = {
    from: `"ServiceHub" <${process.env.ADMIN_EMAIL}>`,
    to: partnerEmail,
    subject: "Your ServiceHub Partner Registration is Confirmed! 🎉",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #eee; border-radius: 8px; overflow: hidden;">
        <div style="background-color: #ffc107; padding: 24px; text-align: center;">
          <h1 style="margin: 0; color: #000; font-size: 24px;">ServiceHub</h1>
        </div>
        <div style="padding: 32px;">
          <h2 style="color: #333;">Hello, ${partnerName}! 👋</h2>
          <p style="color: #555; font-size: 15px; line-height: 1.6;">
            Thank you for registering as a partner with <strong>ServiceHub</strong>. 
            Your application has been successfully received!
          </p>
          <div style="background: #fff8e1; border-left: 4px solid #ffc107; padding: 16px; margin: 24px 0; border-radius: 4px;">
            <p style="margin: 0; color: #555; font-size: 14px;">
              <strong>What happens next?</strong><br/>
              Our team will review your application, verify your details, and contact you shortly 
              to confirm your onboarding and assign service requests in your area.
            </p>
          </div>
          <p style="color: #555; font-size: 15px;">
            If you have any questions, feel free to reply to this email or contact our support team.
          </p>
          <p style="color: #888; font-size: 13px; margin-top: 32px;">
            Best regards,<br/>
            <strong>The ServiceHub Team</strong>
          </p>
        </div>
        <div style="background: #f5f5f5; padding: 16px; text-align: center;">
          <p style="margin: 0; color: #aaa; font-size: 12px;">© 2025 ServiceHub. All rights reserved.</p>
        </div>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};

// Email to admin with full partner registration details
const sendAdminNotificationEmail = async (partnerData) => {
  const {
    name, phone, email, service, profession,
    address, city, pincode, age, gender, experience, message,
  } = partnerData;

  const mailOptions = {
    from: `"ServiceHub" <${process.env.ADMIN_EMAIL}>`,
    to: process.env.ADMIN_EMAIL,
    subject: `New Partner Registration: ${name} (${service})`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #eee; border-radius: 8px; overflow: hidden;">
        <div style="background-color: #ffc107; padding: 24px; text-align: center;">
          <h1 style="margin: 0; color: #000; font-size: 22px;">New Partner Application</h1>
        </div>
        <div style="padding: 32px;">
          <p style="color: #555; font-size: 14px; margin-bottom: 24px;">
            A new partner has submitted an application on ServiceHub. Details below:
          </p>
          <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
            ${[
              ["Full Name", name],
              ["Phone", phone],
              ["Email", email || "Not provided"],
              ["Service", service],
              ["Profession", profession],
              ["Address", address],
              ["City", city],
              ["Pincode", pincode],
              ["Age", age],
              ["Gender", gender],
              ["Experience", `${experience} year(s)`],
              ["Message", message || "None"],
            ]
              .map(
                ([label, value]) => `
              <tr style="border-bottom: 1px solid #f0f0f0;">
                <td style="padding: 10px 8px; color: #888; font-weight: bold; width: 40%;">${label}</td>
                <td style="padding: 10px 8px; color: #333;">${value}</td>
              </tr>`
              )
              .join("")}
          </table>
        </div>
        <div style="background: #f5f5f5; padding: 16px; text-align: center;">
          <p style="margin: 0; color: #aaa; font-size: 12px;">© 2025 ServiceHub. All rights reserved.</p>
        </div>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = { sendBookingConfirmationEmail,sendAdminNotificationEmail ,sendPartnerConfirmationEmail};