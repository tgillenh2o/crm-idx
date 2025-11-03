// src/services/email.js
const { Resend } = require("resend"); // Use destructuring
const resend = new Resend(process.env.RESEND_API_KEY); // no `new` here

async function sendEmail(to, verifyUrl) {
  try {
    const response = await resend.emails.send({
      from: "noreply@findingathome.com",  // Must match your verified domain
      to,
      subject: "Verify your email",
      html: `
        <p>Click the link below to verify your account:</p>
        <a href="${verifyUrl}" target="_blank">Verify Email</a>
      `
    });
    console.log("Verification email sent:", response);
  } catch (err) {
    console.error("Error sending verification email:", err);
    throw err;
  }
}

module.exports = { sendEmail };
