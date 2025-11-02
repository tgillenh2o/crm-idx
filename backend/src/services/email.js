// backend/src/services/email.js
require("dotenv").config();
const { Resend } = require("resend"); // destructured import

// initialize client
const resend = new Resend(process.env.RESEND_API_KEY);

// send confirmation email
async function sendEmail(to, subject, html) {
  try {
    const response = await resend.emails.send({
      from: "verified@yourdomain.com", // must be a verified Resend sender
      to,
      subject,
      html,
    });
    console.log("✅ Email sent successfully:", response);
    return response;
  } catch (err) {
    console.error("Error sending email:", err);
    throw err;
  }
}

async function sendConfirmationEmail(to, url) {
  return sendEmail(
    to,
    "Confirm your email",
    `<p>Please confirm your email by clicking <a href="${url}">here</a></p>`
  );
}

module.exports = { sendConfirmationEmail };
