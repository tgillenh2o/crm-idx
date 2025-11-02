const { Resend } = require("resend");
const dotenv = require("dotenv");

dotenv.config();

// Initialize Resend with API key
const resend = new Resend(process.env.RESEND_API_KEY);

/**
 * Send an email via Resend
 * @param {string} to - recipient email
 * @param {string} subject - subject line
 * @param {string} html - HTML body content
 */
async function sendEmail(to, subject, html) {
  try {
    console.log("📨 Sending email via Resend...");
    console.log("➡️ To:", to);
    console.log("➡️ From: noreply@findingathome.com");

    const { data, error } = await resend.emails.send({
      from: "CRM IDX <noreply@findingathome.com>",
      to,
      subject,
      html,
    });

    if (error) {
      console.error("❌ Resend API error:", error);
      throw new Error(error.message || "Resend email error");
    }

    console.log("✅ Email sent successfully:", data);
    return data;
  } catch (err) {
    console.error("🚨 Failed to send email:", err);
    throw err;
  }
}

module.exports = { sendEmail };
