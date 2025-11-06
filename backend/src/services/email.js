// backend/src/services/email.js
const { Resend } = require("resend");

const resend = new Resend(process.env.RESEND_API_KEY);

async function sendEmail(to, verifyUrl) {
  try {
    const response = await resend.emails.send({
      from: "noreply@findingathome.com", // Must match verified domain
      to,
      subject: "Verify your email address",
      html: `
        <div style="font-family:Arial,sans-serif;max-width:500px;margin:auto;padding:20px;border:1px solid #eee;border-radius:10px;">
          <h2>Welcome to Finding At Home!</h2>
          <p>Click the link below to verify your email address and activate your account:</p>
          <p><a href="${verifyUrl}" style="display:inline-block;background:#007BFF;color:#fff;padding:10px 15px;border-radius:5px;text-decoration:none;">Verify Email</a></p>
          <p>If you didn’t create an account, please ignore this email.</p>
        </div>
      `,
    });

    console.log("✅ Email sent via Resend:", response);
    return response;
  } catch (error) {
    console.error("❌ Error sending verification email:", error);
    throw error;
  }
}

module.exports = { sendEmail };
