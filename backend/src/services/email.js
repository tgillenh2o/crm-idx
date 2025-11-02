// src/services/email.js
const Resend = require("resend");

// Initialize with your Resend API key
const resend = new Resend({ apiKey: process.env.RESEND_API_KEY });

async function sendEmail(to, url) {
  try {
    const response = await resend.emails.send({
      from: "verified@yourdomain.com", // must be a verified domain in Resend
      to,
      subject: "Confirm your email",
      html: `<p>Please confirm your email by clicking <a href="${url}">here</a></p>`,
    });

    console.log("✅ Email sent:", response);
    return response;
  } catch (err) {
    console.error("❌ Error sending email:", err);
    throw err;
  }
}

module.exports = { sendEmail };
