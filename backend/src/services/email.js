const Resend = require("resend"); // latest version
const resend = new Resend({ apiKey: process.env.RESEND_API_KEY });

async function sendEmail(to, verifyToken) {
  try {
    const verifyUrl = `${process.env.FRONTEND_URL}/verify?token=${verifyToken}`;

    await resend.emails.send({
      from: `noreply@findingathome.com`,  // Must match verified domain
      to,
      subject: "Verify your email",
      html: `<p>Click the link below to verify your account:</p>
             <a href="${verifyUrl}">Verify Email</a>`
    });

    console.log("Verification email sent to:", to);
  } catch (err) {
    console.error("Error sending email:", err);
    throw err;
  }
}

module.exports = { sendEmail };
