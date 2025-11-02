// src/services/email.js
const Resend = require("resend");
const resend = new Resend(process.env.RESEND_API_KEY);

async function sendEmail(to, url) {
  try {
    const response = await resend.emails.send({
      from: "no-reply@yourdomain.com", // must be your verified domain
      to,
      subject: "Confirm your email",
      html: `<p>Please confirm your email by clicking <a href="${url}">here</a></p>`,
    });
    console.log("Email sent successfully:", response);
  } catch (err) {
    console.error("Error sending email:", err);
    throw err;
  }
}

module.exports = { sendEmail };
