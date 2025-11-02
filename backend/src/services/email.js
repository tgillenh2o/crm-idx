// src/services/email.js
const Resend = require("resend");
const resend = new Resend(process.env.RESEND_API_KEY);

async function sendEmail(to, url) {
  try {
    const response = await resend.emails.send({
      from: "verified@yourdomain.com",
      to,
      subject: "Confirm your email",
      html: `<p>Click <a href="${url}">here</a> to verify your email.</p>`
    });
    console.log("✅ Email sent:", response);
  } catch (err) {
    console.error("Error sending email:", err);
    throw err;
  }
}

module.exports = { sendEmail };
