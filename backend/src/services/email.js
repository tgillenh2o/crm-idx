const { Resend } = require("resend");

const resend = new Resend(process.env.RESEND_API_KEY);

async function sendEmail(to, verifyUrl) {
  try {
    const response = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL, // e.g., "noreply@yourdomain.com"
      to,
      subject: "Verify your email",
      html: `<p>Click <a href="${verifyUrl}">here</a> to verify your email.</p>`,
    });
    console.log("Email sent successfully:", response);
  } catch (err) {
    console.error("Error sending email:", err);
    throw new Error("Failed to send verification email.");
  }
}

module.exports = { sendEmail };
