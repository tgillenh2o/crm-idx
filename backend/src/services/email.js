// backend/src/services/email.js
const axios = require("axios");

async function sendEmail(to, verifyUrl) {
  try {
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; background: #fff; border: 1px solid #eee; border-radius: 8px; padding: 24px;">
        <h2 style="color: #333;">Verify Your Email</h2>
        <p style="font-size: 15px; color: #555;">Welcome to CRM IDX!</p>
        <p style="font-size: 15px; color: #555;">Click below to confirm your email address:</p>
        <a href="${verifyUrl}" style="display: inline-block; background: #007bff; color: white; padding: 10px 20px; border-radius: 6px; text-decoration: none;">Verify Email</a>
        <p style="font-size: 13px; color: #999; margin-top: 20px;">If you didn’t sign up, you can safely ignore this email.</p>
      </div>
    `;

    await axios.post(
      "https://api.resend.com/emails",
      {
        from: process.env.SMTP_FROM || "CRM IDX <noreply@crm-idx.com>",
        to,
        subject: "Verify your email - CRM IDX",
        html,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log(`✅ Email sent to ${to}`);
  } catch (error) {
    console.error("❌ Email sending failed:", error.response?.data || error.message);
  }
}

module.exports = { sendEmail };
