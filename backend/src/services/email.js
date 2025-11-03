const Resend = require("resend"); // Ensure this is the latest version
const resend = new Resend({ apiKey: process.env.RESEND_API_KEY });

async function sendEmail(to, verifyUrl) {
  try {
    await resend.emails.send({
      from: `noreply@findingathome.com`,  // Must be your verified domain
      to,
      subject: "Verify your email",
      html: `<p>Click the link to verify your account:</p>
             <a href="${verifyUrl}">Verify Email</a>`
    });
    console.log("Verification email sent to:", to);
  } catch (err) {
    console.error("Error sending email:", err);
    throw err;
  }
}

module.exports = { sendEmail };
