// src/services/email.js
const { Resend } = require("resend");
const resend = new Resend(process.env.RESEND_API_KEY);

async function sendConfirmationEmail(to, url) {
  try {
    console.log(`📨 Sending Resend email to: ${to}`);
    const data = await resend.emails.send({
      from: process.env.EMAIL_FROM || "onboarding@resend.dev",
      to,
      subject: "Confirm your email",
      html: `
        <div style="font-family:sans-serif;line-height:1.6">
          <h2>Welcome to CRM IDX</h2>
          <p>Please confirm your email by clicking the button below:</p>
          <p><a href="${url}" style="background:#007bff;color:white;padding:10px 15px;border-radius:5px;text-decoration:none;">Confirm Email</a></p>
          <p>Or copy this link: <a href="${url}">${url}</a></p>
        </div>
      `,
    });
    console.log("✅ Email sent successfully:", data);
  } catch (error) {
    console.error("❌ Error sending email:", error);
    throw error;
  }
}

module.exports = { sendConfirmationEmail };
